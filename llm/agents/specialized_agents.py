from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import logging
from .base_agent import (
    Agent, SpecializedAgent, AgentRole, AgentCapability,
    AgentState
)

logger = logging.getLogger(__name__)

class LeaderAgent(SpecializedAgent):
    """Agent responsible for coordinating and leading group activities."""
    
    def __init__(self, name: str, llm_client: Any):
        capabilities = [
            AgentCapability(
                name="task_delegation",
                description="Ability to delegate tasks to other agents",
                confidence=0.9,
                required_resources=["communication", "task_management"]
            ),
            AgentCapability(
                name="conflict_resolution",
                description="Ability to resolve conflicts between agents",
                confidence=0.8,
                required_resources=["communication", "problem_solving"]
            )
        ]
        super().__init__(
            name=name,
            role=AgentRole.LEADER,
            capabilities=capabilities,
            llm_client=llm_client,
            specialization="leadership"
        )
        self._delegated_tasks: Dict[str, List[Dict[str, Any]]] = {}
        
    def process_message(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Process incoming messages and coordinate responses."""
        if message.get("type") == "task_completion":
            return self._handle_task_completion(message)
        elif message.get("type") == "conflict":
            return self._handle_conflict(message)
        else:
            return self._handle_general_message(message)
            
    def can_handle_task(self, task: Dict[str, Any]) -> bool:
        """Determine if the leader can handle a specific task."""
        return any(
            cap.name in task.get("required_capabilities", [])
            for cap in self.capabilities
        )
        
    def _handle_task_completion(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Handle task completion notifications."""
        task_id = message.get("task_id")
        if task_id in self._delegated_tasks:
            self._delegated_tasks[task_id].append(message)
            return {
                "type": "acknowledgment",
                "content": f"Task {task_id} completion acknowledged",
                "status": "success"
            }
        return {
            "type": "error",
            "content": f"Unknown task ID: {task_id}",
            "status": "error"
        }
        
    def _handle_conflict(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Handle conflict resolution requests."""
        # Use LLM to generate conflict resolution strategy
        resolution = self.llm_client.call_api([{
            "role": "system",
            "content": "You are a conflict resolution expert. Help resolve the following conflict:"
        }, {
            "role": "user",
            "content": str(message)
        }])
        
        return {
            "type": "conflict_resolution",
            "content": resolution,
            "status": "resolved"
        }
        
    def _handle_general_message(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Handle general messages."""
        return {
            "type": "response",
            "content": "Message received and processed",
            "status": "success"
        }

class AnalystAgent(SpecializedAgent):
    """Agent responsible for analyzing data and providing insights."""
    
    def __init__(self, name: str, llm_client: Any):
        capabilities = [
            AgentCapability(
                name="data_analysis",
                description="Ability to analyze complex data sets",
                confidence=0.9,
                required_resources=["data_processing", "statistical_analysis"]
            ),
            AgentCapability(
                name="insight_generation",
                description="Ability to generate insights from data",
                confidence=0.85,
                required_resources=["critical_thinking", "pattern_recognition"]
            )
        ]
        super().__init__(
            name=name,
            role=AgentRole.ANALYST,
            capabilities=capabilities,
            llm_client=llm_client,
            specialization="analysis"
        )
        self._analysis_history: List[Dict[str, Any]] = []
        
    def process_message(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Process incoming messages and provide analysis."""
        if message.get("type") == "analysis_request":
            return self._handle_analysis_request(message)
        else:
            return self._handle_general_message(message)
            
    def can_handle_task(self, task: Dict[str, Any]) -> bool:
        """Determine if the analyst can handle a specific task."""
        return any(
            cap.name in task.get("required_capabilities", [])
            for cap in self.capabilities
        )
        
    def _handle_analysis_request(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Handle data analysis requests."""
        data = message.get("data", {})
        analysis_type = message.get("analysis_type", "general")
        
        # Use LLM to analyze the data
        analysis = self.llm_client.call_api([{
            "role": "system",
            "content": f"You are a data analyst. Analyze the following data for {analysis_type} insights:"
        }, {
            "role": "user",
            "content": str(data)
        }])
        
        result = {
            "type": "analysis_result",
            "content": analysis,
            "analysis_type": analysis_type,
            "status": "completed"
        }
        
        self._analysis_history.append(result)
        return result
        
    def _handle_general_message(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Handle general messages."""
        return {
            "type": "response",
            "content": "Message received and processed",
            "status": "success"
        }
        
    def get_analysis_history(self) -> List[Dict[str, Any]]:
        """Get the history of analyses performed."""
        return self._analysis_history.copy()

class CreativeAgent(SpecializedAgent):
    """Agent responsible for generating creative content and ideas."""
    
    def __init__(self, name: str, llm_client: Any):
        capabilities = [
            AgentCapability(
                name="content_generation",
                description="Ability to generate creative content",
                confidence=0.9,
                required_resources=["creativity", "language_processing"]
            ),
            AgentCapability(
                name="idea_generation",
                description="Ability to generate innovative ideas",
                confidence=0.85,
                required_resources=["creativity", "problem_solving"]
            )
        ]
        super().__init__(
            name=name,
            role=AgentRole.CREATIVE,
            capabilities=capabilities,
            llm_client=llm_client,
            specialization="creativity"
        )
        self._creative_works: List[Dict[str, Any]] = []
        
    def process_message(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Process incoming messages and generate creative content."""
        if message.get("type") == "creative_request":
            return self._handle_creative_request(message)
        else:
            return self._handle_general_message(message)
            
    def can_handle_task(self, task: Dict[str, Any]) -> bool:
        """Determine if the creative agent can handle a specific task."""
        return any(
            cap.name in task.get("required_capabilities", [])
            for cap in self.capabilities
        )
        
    def _handle_creative_request(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Handle creative content generation requests."""
        request_type = message.get("request_type", "general")
        parameters = message.get("parameters", {})
        
        # Use LLM to generate creative content
        content = self.llm_client.call_api([{
            "role": "system",
            "content": f"You are a creative content generator. Generate {request_type} content with the following parameters:"
        }, {
            "role": "user",
            "content": str(parameters)
        }])
        
        result = {
            "type": "creative_content",
            "content": content,
            "request_type": request_type,
            "status": "completed"
        }
        
        self._creative_works.append(result)
        return result
        
    def _handle_general_message(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Handle general messages."""
        return {
            "type": "response",
            "content": "Message received and processed",
            "status": "success"
        }
        
    def get_creative_works(self) -> List[Dict[str, Any]]:
        """Get the history of creative works generated."""
        return self._creative_works.copy() 