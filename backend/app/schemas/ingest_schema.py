from pydantic import BaseModel
from typing import Optional


class GithubIngestRequest(BaseModel):
    repo_url: str
    namespace: str
    branch: Optional[str] = None