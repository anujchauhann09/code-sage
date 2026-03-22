import os
import shutil
import tempfile
import zipfile

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from app.schemas.query_schema import QueryRequest
from app.schemas.ingest_schema import GithubIngestRequest
from app.retrieval.retriever import retrieve_context
from app.llm.gemini_llm import generate_answer
from app.ingestion.pipeline import ingest_folder, ingest_github_repo

app = FastAPI()


@app.get("/")
def root():
    return {"message": "Codebase RAG API running"}


@app.post("/ingest")
async def ingest_zip(
    file: UploadFile = File(...),
    namespace: str = Form(...)
):
    if not file.filename.endswith(".zip"):
        raise HTTPException(status_code=400, detail="Only .zip files are supported")

    tmp_dir = tempfile.mkdtemp()
    try:
        zip_path = os.path.join(tmp_dir, "upload.zip")
        contents = await file.read()
        with open(zip_path, "wb") as f:
            f.write(contents)

        extract_dir = os.path.join(tmp_dir, "extracted")
        with zipfile.ZipFile(zip_path, "r") as zf:
            zf.extractall(extract_dir)

        return ingest_folder(folder_path=extract_dir, namespace=namespace)
    except zipfile.BadZipFile:
        raise HTTPException(status_code=400, detail="Invalid or corrupted zip file")
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


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
