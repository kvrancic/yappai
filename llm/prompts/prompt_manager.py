from typing import Dict, Any, Optional
from dataclasses import dataclass
from abc import ABC, abstractmethod
import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

@dataclass
class PromptTemplate:
    """Represents a prompt template with variables."""
    template: str
    variables: Dict[str, Any]
    
    def format(self, **kwargs) -> str:
        """Format the template with provided variables."""
        try:
            return self.template.format(**kwargs)
        except KeyError as e:
            logger.error(f"Missing required variable in prompt template: {str(e)}")
            raise

class PromptTemplateManager(ABC):
    """Abstract base class for prompt template managers."""
    
    @abstractmethod
    def get_template(self, template_name: str) -> PromptTemplate:
        """Get a prompt template by name."""
        pass
    
    @abstractmethod
    def list_templates(self) -> list[str]:
        """List all available template names."""
        pass

class FileBasedPromptManager(PromptTemplateManager):
    """Prompt template manager that loads templates from files."""
    
    def __init__(self, templates_dir: str):
        """Initialize with templates directory."""
        self.templates_dir = Path(templates_dir)
        self._templates: Dict[str, PromptTemplate] = {}
        self._load_templates()
        
    def _load_templates(self) -> None:
        """Load all templates from the templates directory."""
        if not self.templates_dir.exists():
            logger.warning(f"Templates directory not found: {self.templates_dir}")
            return
            
        for template_file in self.templates_dir.glob("*.json"):
            try:
                with open(template_file, 'r') as f:
                    data = json.load(f)
                    template_name = template_file.stem
                    self._templates[template_name] = PromptTemplate(
                        template=data["template"],
                        variables=data.get("variables", {})
                    )
                logger.info(f"Loaded template: {template_name}")
            except Exception as e:
                logger.error(f"Error loading template {template_file}: {str(e)}")
                
    def get_template(self, template_name: str) -> PromptTemplate:
        """Get a prompt template by name."""
        if template_name not in self._templates:
            raise KeyError(f"Template not found: {template_name}")
        return self._templates[template_name]
    
    def list_templates(self) -> list[str]:
        """List all available template names."""
        return list(self._templates.keys())
    
    def add_template(self, name: str, template: str, variables: Optional[Dict[str, Any]] = None) -> None:
        """Add a new template."""
        self._templates[name] = PromptTemplate(
            template=template,
            variables=variables or {}
        )
        
    def save_templates(self) -> None:
        """Save all templates to files."""
        self.templates_dir.mkdir(parents=True, exist_ok=True)
        
        for name, template in self._templates.items():
            template_file = self.templates_dir / f"{name}.json"
            try:
                with open(template_file, 'w') as f:
                    json.dump({
                        "template": template.template,
                        "variables": template.variables
                    }, f, indent=2)
                logger.info(f"Saved template: {name}")
            except Exception as e:
                logger.error(f"Error saving template {name}: {str(e)}") 