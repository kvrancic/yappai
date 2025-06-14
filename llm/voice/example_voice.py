import os
import sys
from pathlib import Path
import logging

from ..llm_client import LLMConfig
from .whisper_client import WhisperConfig
from .voice_llm_orchestrator import VoiceLLMOrchestrator, VoiceLLMConfig
from ..prompts.prompt_manager import FileBasedPromptManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    # Get the directory of this script
    script_dir = Path(__file__).parent.parent
    
    # Initialize prompt manager with templates directory
    prompt_manager = FileBasedPromptManager(
        templates_dir=str(script_dir / "prompts" / "templates")
    )
    
    # Create configuration
    config = VoiceLLMConfig(
        whisper_config=WhisperConfig(
            model_name="base",
            language="en"
        ),
        llm_config=LLMConfig(
            api_url=os.getenv("LLM_API_URL", "https://api.inflection.ai/v1/chat/completions"),
            api_key=os.getenv("LLM_API_KEY", ""),
            model=os.getenv("LLM_MODEL", "Pi-3.1")
        ),
        default_prompt_template="voice_assistant",
        system_prompt="You are a helpful voice assistant. Respond concisely and clearly."
    )
    
    # Initialize orchestrator
    orchestrator = VoiceLLMOrchestrator(prompt_manager, config)
    
    # Check if audio file path is provided
    if len(sys.argv) < 2:
        logger.error("Please provide an audio file path")
        sys.exit(1)
        
    audio_path = sys.argv[1]
    
    try:
        # Process audio file
        response = orchestrator.process_audio_file(audio_path)
        print("\nAssistant's response:")
        print(response)
        
        # Print conversation history
        print("\nConversation history:")
        for msg in orchestrator.get_conversation_history():
            print(f"{msg['role']}: {msg['content']}")
            
    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main() 