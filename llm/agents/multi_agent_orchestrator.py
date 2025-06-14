from typing import List, Dict, Any, Optional, Set, Callable
from dataclasses import dataclass
import logging
import uuid
from datetime import datetime
from .base_agent import Agent, AgentRole, AgentState
from .specialized_agents import LeaderAgent, AnalystAgent, CreativeAgent

logger = logging.getLogger(__name__)

@dataclass
class Task:
    """Represents a task to be performed by agents."""
    id: str
    description: str
    required_capabilities: List[str]
    priority: int
    deadline: Optional[datetime] = None
    dependencies: List[str] = None
    assigned_agent: Optional[str] = None
    status: str = "pending"
    
    def __post_init__(self):
        if self.dependencies is None:
            self.dependencies = []

@dataclass
class GroupState:
    """Represents the current state of an agent group."""
    is_active: bool = True
    current_task: Optional[str] = None
    performance_metrics: Dict[str, float] = None
    resource_utilization: Dict[str, float] = None
    
    def __post_init__(self):
        if self.performance_metrics is None:
            self.performance_metrics = {}
        if self.resource_utilization is None:
            self.resource_utilization = {}

class MultiAgentOrchestrator:
    """Orchestrates multiple agents working together on tasks."""
    
    def __init__(self, llm_client: Any):
        """Initialize the orchestrator with an LLM client."""
        self.llm_client = llm_client
        self.agents: Dict[str, Agent] = {}
        self.tasks: Dict[str, Task] = {}
        self.groups: Dict[str, Set[str]] = {}
        self.state = GroupState()
        self._observers: List[Callable] = []
        self._message_history: List[Dict[str, Any]] = []
        
    def add_agent(self, agent: Agent) -> None:
        """Add an agent to the orchestrator."""
        self.agents[agent.id] = agent
        agent.add_observer(self._handle_agent_event)
        logger.info(f"Added agent: {agent.name} ({agent.role.value})")
        
    def remove_agent(self, agent_id: str) -> None:
        """Remove an agent from the orchestrator."""
        if agent_id in self.agents:
            agent = self.agents[agent_id]
            agent.remove_observer(self._handle_agent_event)
            del self.agents[agent_id]
            logger.info(f"Removed agent: {agent.name}")
            
    def create_group(self, name: str, agent_ids: List[str]) -> str:
        """Create a new agent group."""
        group_id = str(uuid.uuid4())
        self.groups[group_id] = set(agent_ids)
        logger.info(f"Created group {name} with {len(agent_ids)} agents")
        return group_id
        
    def add_task(self, task: Task) -> None:
        """Add a new task to be performed."""
        self.tasks[task.id] = task
        self._assign_task(task)
        logger.info(f"Added task: {task.description}")
        
    def _assign_task(self, task: Task) -> None:
        """Assign a task to the most suitable agent."""
        best_agent = None
        best_score = 0
        
        for agent in self.agents.values():
            if agent.can_handle_task(task):
                score = self._calculate_agent_score(agent, task)
                if score > best_score:
                    best_score = score
                    best_agent = agent
                    
        if best_agent:
            task.assigned_agent = best_agent.id
            task.status = "assigned"
            self._send_message_to_agent(best_agent.id, {
                "type": "task_assignment",
                "task_id": task.id,
                "description": task.description,
                "required_capabilities": task.required_capabilities
            })
            logger.info(f"Assigned task {task.id} to agent {best_agent.name}")
        else:
            logger.warning(f"No suitable agent found for task {task.id}")
            
    def _calculate_agent_score(self, agent: Agent, task: Task) -> float:
        """Calculate how suitable an agent is for a task."""
        score = 0.0
        
        # Check capabilities
        for cap in agent.capabilities:
            if cap.name in task.required_capabilities:
                score += cap.confidence
                
        # Consider current workload
        if agent.state.current_task:
            score *= 0.5
            
        # Consider performance metrics
        if agent.state.performance_metrics:
            avg_performance = sum(agent.state.performance_metrics.values()) / len(agent.state.performance_metrics)
            score *= avg_performance
            
        return score
        
    def _send_message_to_agent(self, agent_id: str, message: Dict[str, Any]) -> None:
        """Send a message to a specific agent."""
        if agent_id in self.agents:
            agent = self.agents[agent_id]
            response = agent.process_message(message)
            self._message_history.append({
                "timestamp": datetime.now(),
                "from": "orchestrator",
                "to": agent_id,
                "message": message,
                "response": response
            })
            self._handle_agent_response(agent, response)
            
    def _handle_agent_response(self, agent: Agent, response: Dict[str, Any]) -> None:
        """Handle a response from an agent."""
        if response.get("type") == "task_completion":
            task_id = response.get("task_id")
            if task_id in self.tasks:
                task = self.tasks[task_id]
                task.status = "completed"
                self._update_performance_metrics(agent, response)
                logger.info(f"Task {task_id} completed by {agent.name}")
                
    def _update_performance_metrics(self, agent: Agent, response: Dict[str, Any]) -> None:
        """Update performance metrics for an agent."""
        if "performance_score" in response:
            if "task_performance" not in agent.state.performance_metrics:
                agent.state.performance_metrics["task_performance"] = []
            agent.state.performance_metrics["task_performance"].append(
                response["performance_score"]
            )
            
    def _handle_agent_event(self, agent: Agent, event: str, data: Any) -> None:
        """Handle events from agents."""
        if event == "state_changed":
            self._update_group_state()
        elif event == "history_updated":
            self._message_history.append({
                "timestamp": datetime.now(),
                "from": agent.id,
                "event": event,
                "data": data
            })
            
    def _update_group_state(self) -> None:
        """Update the overall group state."""
        active_tasks = sum(1 for task in self.tasks.values() if task.status == "assigned")
        self.state.current_task = active_tasks > 0
        
        # Calculate group performance metrics
        total_performance = 0
        active_agents = 0
        for agent in self.agents.values():
            if agent.state.is_active:
                active_agents += 1
                if agent.state.performance_metrics:
                    total_performance += sum(agent.state.performance_metrics.values()) / len(agent.state.performance_metrics)
                    
        if active_agents > 0:
            self.state.performance_metrics["group_performance"] = total_performance / active_agents
            
    def get_group_performance(self) -> Dict[str, float]:
        """Get the current group performance metrics."""
        return self.state.performance_metrics.copy()
        
    def get_message_history(self) -> List[Dict[str, Any]]:
        """Get the message history."""
        return self._message_history.copy()
        
    def clear_message_history(self) -> None:
        """Clear the message history."""
        self._message_history.clear()
        
    def add_observer(self, observer: Callable) -> None:
        """Add an observer to be notified of group state changes."""
        self._observers.append(observer)
        
    def remove_observer(self, observer: Callable) -> None:
        """Remove an observer."""
        self._observers.remove(observer)
        
    def notify_observers(self, event: str, data: Any) -> None:
        """Notify all observers of a state change."""
        for observer in self._observers:
            observer(self, event, data) 