from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional, Callable
from dataclasses import dataclass
import logging
from enum import Enum
import uuid

logger = logging.getLogger(__name__)

class AgentRole(Enum):
    """Enumeration of possible agent roles."""
    LEADER = "leader"
    SPECIALIST = "specialist"
    COORDINATOR = "coordinator"
    ANALYST = "analyst"
    CREATIVE = "creative"
    CRITIC = "critic"

@dataclass
class AgentCapability:
    """Represents a specific capability of an agent."""
    name: str
    description: str
    confidence: float  # 0.0 to 1.0
    required_resources: List[str]

@dataclass
class AgentState:
    """Represents the current state of an agent."""
    is_active: bool = True
    current_task: Optional[str] = None
    resources_available: List[str] = None
    performance_metrics: Dict[str, float] = None
    
    def __post_init__(self):
        if self.resources_available is None:
            self.resources_available = []
        if self.performance_metrics is None:
            self.performance_metrics = {}

class Agent(ABC):
    """Abstract base class for all agents."""
    
    def __init__(
        self,
        name: str,
        role: AgentRole,
        capabilities: List[AgentCapability],
        llm_client: Any  # Type hint for LLM client
    ):
        self.id = str(uuid.uuid4())
        self.name = name
        self.role = role
        self.capabilities = capabilities
        self.llm_client = llm_client
        self.state = AgentState()
        self._observers: List[Callable] = []
        
    @abstractmethod
    def process_message(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Process an incoming message and return a response."""
        pass
    
    @abstractmethod
    def can_handle_task(self, task: Dict[str, Any]) -> bool:
        """Determine if the agent can handle a specific task."""
        pass
    
    def add_observer(self, observer: Callable) -> None:
        """Add an observer to be notified of state changes."""
        self._observers.append(observer)
        
    def remove_observer(self, observer: Callable) -> None:
        """Remove an observer."""
        self._observers.remove(observer)
        
    def notify_observers(self, event: str, data: Any) -> None:
        """Notify all observers of a state change."""
        for observer in self._observers:
            observer(self, event, data)
            
    def update_state(self, **kwargs) -> None:
        """Update agent state and notify observers."""
        for key, value in kwargs.items():
            if hasattr(self.state, key):
                setattr(self.state, key, value)
        self.notify_observers("state_changed", self.state)
        
    def get_capability(self, name: str) -> Optional[AgentCapability]:
        """Get a specific capability by name."""
        return next((cap for cap in self.capabilities if cap.name == name), None)
        
    def has_capability(self, name: str) -> bool:
        """Check if agent has a specific capability."""
        return any(cap.name == name for cap in self.capabilities)
        
    def __str__(self) -> str:
        return f"{self.name} ({self.role.value})"

class SpecializedAgent(Agent):
    """Base class for specialized agents with specific roles."""
    
    def __init__(
        self,
        name: str,
        role: AgentRole,
        capabilities: List[AgentCapability],
        llm_client: Any,
        specialization: str
    ):
        super().__init__(name, role, capabilities, llm_client)
        self.specialization = specialization
        self._task_history: List[Dict[str, Any]] = []
        
    def add_to_history(self, task: Dict[str, Any]) -> None:
        """Add a task to the agent's history."""
        self._task_history.append(task)
        self.notify_observers("history_updated", task)
        
    def get_task_history(self) -> List[Dict[str, Any]]:
        """Get the agent's task history."""
        return self._task_history.copy()
        
    def clear_history(self) -> None:
        """Clear the agent's task history."""
        self._task_history.clear()
        self.notify_observers("history_cleared", None) 