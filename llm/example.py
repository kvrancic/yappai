import sys
from llm_client import LLMClient, ConversationManager

def main():
    # Initialize the LLM client
    client = LLMClient()
    
    # Initialize the conversation manager
    manager = ConversationManager(client)
    
    # Define the number of turns (default to 5 if not specified)
    turns = 5
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        turns = int(sys.argv[1])
    
    # Run the conversation
    manager.run_dual_agents(
        agent1_system_prompt="You are an AI agent acting as a salesman that needs to get better at sales. You need help to become better",
        agent2_system_prompt="You are Agent 2, a helpful assistant helping people become better salesmen",
        initial_message="Can you help me be a better salesman",
        turns=turns
    )

if __name__ == "__main__":
    main() 