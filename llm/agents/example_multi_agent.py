import os
import sys
import logging
from datetime import datetime, timedelta
from typing import Dict, Any

from ..llm_client import LLMClient, LLMConfig
from .multi_agent_orchestrator import MultiAgentOrchestrator, Task
from .specialized_agents import LeaderAgent, AnalystAgent, CreativeAgent

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_agents(llm_client: Any) -> Dict[str, Any]:
    """Create and initialize agents."""
    agents = {}
    
    # Create leader agent
    leader = LeaderAgent("Project Leader", llm_client)
    agents[leader.id] = leader
    
    # Create analyst agent
    analyst = AnalystAgent("Data Analyst", llm_client)
    agents[analyst.id] = analyst
    
    # Create creative agent
    creative = CreativeAgent("Content Creator", llm_client)
    agents[creative.id] = creative
    
    return agents

def create_tasks() -> Dict[str, Task]:
    """Create example tasks."""
    tasks = {}
    
    # Create analysis task
    analysis_task = Task(
        id="task_001",
        description="Analyze market trends and provide insights",
        required_capabilities=["data_analysis", "insight_generation"],
        priority=1,
        deadline=datetime.now() + timedelta(hours=2)
    )
    tasks[analysis_task.id] = analysis_task
    
    # Create content task
    content_task = Task(
        id="task_002",
        description="Generate creative content based on market analysis",
        required_capabilities=["content_generation", "idea_generation"],
        priority=2,
        deadline=datetime.now() + timedelta(hours=3),
        dependencies=["task_001"]
    )
    tasks[content_task.id] = content_task
    
    return tasks

def handle_group_event(orchestrator: MultiAgentOrchestrator, event: str, data: Any) -> None:
    """Handle events from the orchestrator."""
    if event == "state_changed":
        logger.info(f"Group state updated: {data}")
    elif event == "task_completed":
        logger.info(f"Task completed: {data}")

def main():
    # Initialize LLM client
    llm_client = LLMClient(LLMConfig(
        api_url=os.getenv("LLM_API_URL", "https://api.inflection.ai/v1/chat/completions"),
        api_key=os.getenv("LLM_API_KEY", ""),
        model=os.getenv("LLM_MODEL", "Pi-3.1")
    ))
    
    # Create orchestrator
    orchestrator = MultiAgentOrchestrator(llm_client)
    orchestrator.add_observer(handle_group_event)
    
    # Create and add agents
    agents = create_agents(llm_client)
    for agent in agents.values():
        orchestrator.add_agent(agent)
    
    # Create agent group
    group_id = orchestrator.create_group(
        "Project Team",
        [agent.id for agent in agents.values()]
    )
    
    # Create and add tasks
    tasks = create_tasks()
    for task in tasks.values():
        orchestrator.add_task(task)
    
    # Monitor group performance
    logger.info("Monitoring group performance...")
    performance = orchestrator.get_group_performance()
    logger.info(f"Group performance: {performance}")
    
    # Get message history
    history = orchestrator.get_message_history()
    logger.info(f"Message history length: {len(history)}")
    
    # Example of sending a message to an agent
    leader_id = next(agent.id for agent in agents.values() if isinstance(agent, LeaderAgent))
    orchestrator._send_message_to_agent(leader_id, {
        "type": "status_request",
        "content": "Please provide a status update on the project"
    })
    
    # Print final state
    logger.info("\nFinal State:")
    logger.info(f"Active agents: {len(orchestrator.agents)}")
    logger.info(f"Total tasks: {len(orchestrator.tasks)}")
    logger.info(f"Completed tasks: {sum(1 for task in orchestrator.tasks.values() if task.status == 'completed')}")
    logger.info(f"Group performance: {orchestrator.get_group_performance()}")

if __name__ == "__main__":
    main() 