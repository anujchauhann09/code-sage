from pydantic import BaseModel
from typing import Optional

class IngestRequest(BaseModel):
    folder_path: str
    namespace: str

class GithubIngestRequest(BaseModel):
    repo_url: str
    namespace: str
    branch: Optional[str] = None