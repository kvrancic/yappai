import os
import requests
from typing import List, Dict, Optional
from dataclasses import dataclass
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class LLMConfig:
    """Configuration for LLM client."""
    api_url: str
    api_key: str
    model: str
    temperature: float = 0.7
    max_tokens: int = 32000

class LLMClient:
    """Client for interacting with LLM APIs."""
    
    def __init__(self, config: Optional[LLMConfig] = None):
        """Initialize LLM client with configuration."""
        self.config = config or LLMConfig(
            api_url=os.getenv("LLM_API_URL", "https://api.inflection.ai/v1/chat/completions"),
            api_key=os.getenv("LLM_API_KEY", ""),
            model=os.getenv("LLM_MODEL", "Pi-3.1")
        )
        
    def _get_headers(self) -> Dict[str, str]:
        """Get headers for API request."""
        return {
            "Authorization": f"Bearer {self.config.api_key}",
            "Content-Type": "application/json",
        }
    
    def _get_payload(self, messages: List[Dict[str, str]]) -> Dict:
        """Get payload for API request."""
        return {
            "model": self.config.model,
            "messages": messages,
            "temperature": self.config.temperature,
            "max_tokens": self.config.max_tokens
        }
    
    def call_api(self, messages: List[Dict[str, str]]) -> str:
        """
        Call the LLM API with the given messages.
        
        Args:
            messages: List of message dictionaries with 'role' and 'content' keys
            
        Returns:
            str: The response content from the LLM
            
        Raises:
            requests.exceptions.RequestException: If the API request fails
            KeyError: If the response format is unexpected
        """
        try:
            response = requests.post(
                self.config.api_url,
                headers=self._get_headers(),
                json=self._get_payload(messages)
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except requests.exceptions.RequestException as e:
            logger.error(f"API request failed: {str(e)}")
            raise
        except KeyError as e:
            logger.error(f"Unexpected response format: {str(e)}")
            raise

class ConversationManager:
    """Manages conversations between multiple agents."""
    
    def __init__(self, llm_client: LLMClient):
        """Initialize conversation manager with LLM client."""
        self.llm_client = llm_client
        
    def run_dual_agents(
        self,
        agent1_system_prompt: str,
        agent2_system_prompt: str,
        initial_message: str,
        turns: int = 5
    ) -> None:
        """
        Run a conversation between two agents.
        
        Args:
            agent1_system_prompt: System prompt for the first agent
            agent2_system_prompt: System prompt for the second agent
            initial_message: Initial message to start the conversation
            turns: Number of conversation turns
        """
        agent1_msgs = [{"role": "system", "content": agent1_system_prompt}]
        agent2_msgs = [{"role": "system", "content": agent2_system_prompt}]

        agent1_msgs.append({"role": "user", "content": initial_message})
        logger.info(f"Starting conversation...\nAgent 1 (user): {initial_message}\n")

        for i in range(turns):
            # Agent 1's turn
            reply1 = self.llm_client.call_api(agent1_msgs)
            logger.info(f"Agent 1: {reply1}\n")
            agent1_msgs.append({"role": "assistant", "content": reply1})

            # Agent 2's turn
            agent2_msgs.append({"role": "user", "content": reply1})
            reply2 = self.llm_client.call_api(agent2_msgs)
            logger.info(f"Agent 2: {reply2}\n")
            agent2_msgs.append({"role": "assistant", "content": reply2})

            # Update Agent 1's context
            agent1_msgs.append({"role": "user", "content": reply2})

        logger.info("Conversation ended.") 