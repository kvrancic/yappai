import os
import tempfile
from typing import Optional, BinaryIO
import whisper
import logging
from dataclasses import dataclass
from pathlib import Path

logger = logging.getLogger(__name__)

@dataclass
class WhisperConfig:
    """Configuration for Whisper client."""
    model_name: str = "base"
    language: Optional[str] = None
    temperature: float = 0.0
    best_of: int = 5
    beam_size: int = 5
    condition_on_previous_text: bool = True
    initial_prompt: Optional[str] = None

class WhisperClient:
    """Client for handling voice-to-text conversion using Whisper AI."""
    
    def __init__(self, config: Optional[WhisperConfig] = None):
        """Initialize Whisper client with configuration."""
        self.config = config or WhisperConfig()
        self._model = None
        
    @property
    def model(self) -> whisper.Whisper:
        """Lazy loading of the Whisper model."""
        if self._model is None:
            logger.info(f"Loading Whisper model: {self.config.model_name}")
            self._model = whisper.load_model(self.config.model_name)
        return self._model
    
    def transcribe_audio_file(self, audio_path: str) -> str:
        """
        Transcribe audio from a file.
        
        Args:
            audio_path: Path to the audio file
            
        Returns:
            str: Transcribed text
            
        Raises:
            FileNotFoundError: If audio file doesn't exist
            Exception: For other transcription errors
        """
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found: {audio_path}")
            
        try:
            logger.info(f"Transcribing audio file: {audio_path}")
            result = self.model.transcribe(
                audio_path,
                language=self.config.language,
                temperature=self.config.temperature,
                best_of=self.config.best_of,
                beam_size=self.config.beam_size,
                condition_on_previous_text=self.config.condition_on_previous_text,
                initial_prompt=self.config.initial_prompt
            )
            return result["text"].strip()
        except Exception as e:
            logger.error(f"Error transcribing audio file: {str(e)}")
            raise
            
    def transcribe_audio_data(self, audio_data: BinaryIO) -> str:
        """
        Transcribe audio from binary data.
        
        Args:
            audio_data: Binary audio data
            
        Returns:
            str: Transcribed text
            
        Raises:
            Exception: For transcription errors
        """
        try:
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                temp_file.write(audio_data.read())
                temp_file.flush()
                return self.transcribe_audio_file(temp_file.name)
        finally:
            if 'temp_file' in locals():
                os.unlink(temp_file.name)
                
    def __del__(self):
        """Cleanup resources."""
        self._model = None 