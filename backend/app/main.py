from fastapi import FastAPI
from app.schemas.query_schema import QueryRequest
from app.schemas.ingest_schema import IngestRequest, GithubIngestRequest
from app.retrieval.retriever import retrieve_context
from app.llm.gemini_llm import generate_answer
from app.ingestion.pipeline import ingest_folder, ingest_github_repo


app = FastAPI()

@app.get("/")
def root():
    return {"message": "Codebase RAG API running"}

@app.post("/ingest")
def ingest_api(request: IngestRequest):
    return ingest_folder(
        folder_path=request.folder_path,
        namespace=request.namespace
    )

@app.post("/ingest/github")
def ingest_github(request: GithubIngestRequest):
    return ingest_github_repo(
        repo_url=request.repo_url,
        namespace=request.namespace,
        branch=request.branch
    )

@app.post("/query")
def query_api(request: QueryRequest):
    context_list = retrieve_context(
        request.query,
        namespace=request.namespace,
        file_name=request.file_name
    )

    answer = generate_answer(request.query, context_list)

    return {
        "answer": answer,
        "context_used": context_list,
        "namespace": request.namespace
    }