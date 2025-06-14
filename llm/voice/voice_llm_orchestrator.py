from typing import Optional, BinaryIO, Dict, Any
import logging
from dataclasses import dataclass
from pathlib import Path

from ..llm_client import LLMClient, LLMConfig
from .whisper_client import WhisperClient, WhisperConfig
from ..prompts.prompt_manager import PromptTemplateManager, PromptTemplate

logger = logging.getLogger(__name__)

@dataclass
class VoiceLLMConfig:
    """Configuration for Voice-LLM orchestrator."""
    whisper_config: Optional[WhisperConfig] = None
    llm_config: Optional[LLMConfig] = None
    default_prompt_template: str = "voice_assistant"
    system_prompt: str = "You are a helpful voice assistant. Respond concisely and clearly."

class VoiceLLMOrchestrator:
    """Orchestrates the flow between voice processing and LLM."""
    
    def __init__(
        self,
        prompt_manager: PromptTemplateManager,
        config: Optional[VoiceLLMConfig] = None
    ):
        """Initialize the orchestrator with required components."""
        self.config = config or VoiceLLMConfig()
        self.prompt_manager = prompt_manager
        
        # Initialize clients
        self.whisper_client = WhisperClient(self.config.whisper_config)
        self.llm_client = LLMClient(self.config.llm_config)
        
        # Initialize conversation history
        self.conversation_history: list[Dict[str, str]] = [
            {"role": "system", "content": self.config.system_prompt}
        ]
        
    def process_audio_file(self, audio_path: str, template_name: Optional[str] = None) -> str:
        """
        Process audio file through the voice-LLM pipeline.
        
        Args:
            audio_path: Path to the audio file
            template_name: Optional template name to use
            
        Returns:
            str: LLM response
        """
        # Transcribe audio
        transcribed_text = self.whisper_client.transcribe_audio_file(audio_path)
        logger.info(f"Transcribed text: {transcribed_text}")
        
        return self._process_text(transcribed_text, template_name)
    
    def process_audio_data(self, audio_data: BinaryIO, template_name: Optional[str] = None) -> str:
        """
        Process audio data through the voice-LLM pipeline.
        
        Args:
            audio_data: Binary audio data
            template_name: Optional template name to use
            
        Returns:
            str: LLM response
        """
        # Transcribe audio
        transcribed_text = self.whisper_client.transcribe_audio_data(audio_data)
        logger.info(f"Transcribed text: {transcribed_text}")
        
        return self._process_text(transcribed_text, template_name)
    
    def _process_text(self, text: str, template_name: Optional[str] = None) -> str:
        """
        Process text through the LLM pipeline.
        
        Args:
            text: Input text
            template_name: Optional template name to use
            
        Returns:
            str: LLM response
        """
        # Get and format prompt template
        template = self.prompt_manager.get_template(
            template_name or self.config.default_prompt_template
        )
        formatted_prompt = template.format(
            user_input=text,
            conversation_history=self.conversation_history
        )
        
        # Add user message to history
        self.conversation_history.append({"role": "user", "content": formatted_prompt})
        
        # Get LLM response
        response = self.llm_client.call_api(self.conversation_history)
        
        # Add assistant response to history
        self.conversation_history.append({"role": "assistant", "content": response})
        
        return response
    
    def clear_conversation_history(self) -> None:
        """Clear the conversation history."""
        self.conversation_history = [
            {"role": "system", "content": self.config.system_prompt}
        ]
        
    def get_conversation_history(self) -> list[Dict[str, str]]:
        """Get the current conversation history."""
        return self.conversation_history.copy() 