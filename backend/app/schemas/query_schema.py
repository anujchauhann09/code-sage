from pydantic import BaseModel
from typing import Optional

class QueryRequest(BaseModel):
    query: str
    namespace: str 
    file_name: Optional[str] = None