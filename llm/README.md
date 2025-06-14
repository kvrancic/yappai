# LLM Module

This module provides a clean and well-structured interface for interacting with LLM APIs, specifically designed for managing conversations between multiple AI agents.

## Features

- Clean, object-oriented design
- Configurable LLM client
- Conversation management between multiple agents
- Proper error handling and logging
- Environment variable configuration

## Installation

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Set up your environment variables (optional):
```bash
export LLM_API_KEY="your-api-key"
export LLM_API_URL="your-api-url"
export LLM_MODEL="your-model-name"
```

## Usage

Basic usage example:

```python
from llm_client import LLMClient, ConversationManager

# Initialize the client
client = LLMClient()

# Initialize the conversation manager
manager = ConversationManager(client)

# Run a conversation between two agents
manager.run_dual_agents(
    agent1_system_prompt="Your first agent's system prompt",
    agent2_system_prompt="Your second agent's system prompt",
    initial_message="Initial message to start the conversation",
    turns=5
)
```

You can also run the example script:
```bash
python example.py [number_of_turns]
```

## Configuration

The module can be configured through environment variables or by passing a custom `LLMConfig` object:

```python
from llm_client import LLMClient, LLMConfig

config = LLMConfig(
    api_url="your-api-url",
    api_key="your-api-key",
    model="your-model-name",
    temperature=0.7,
    max_tokens=32000
)

client = LLMClient(config)
```

## Error Handling

The module includes proper error handling for API requests and response parsing. All errors are logged using Python's logging module. 