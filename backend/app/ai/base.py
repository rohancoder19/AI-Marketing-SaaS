from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseAIClient(ABC):
    @abstractmethod
    async def generate_json(self, prompt: str) -> Dict[str, Any]:
        """
        Accepts a prompt and returns a validated JSON object.
        """
        pass
