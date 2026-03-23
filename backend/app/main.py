import os
import shutil
import tempfile
import zipfile

from fastapi import FastAPI, File, Form, HTTPException, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.schemas.query_schema import QueryRequest
from app.schemas.ingest_schema import GithubIngestRequest
from app.retrieval.retriever import retrieve_context
from app.llm.gemini_llm import generate_answer
from app.ingestion.pipeline import ingest_folder, ingest_github_repo

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    from app.utils.error_handler import handle_gemini_error, handle_pinecone_error

    msg = str(exc)

    if "RESOURCE_EXHAUSTED" in msg or "quota" in msg.lower():
        try:
            handle_gemini_error(exc)
        except HTTPException as http_exc:
            return JSONResponse(status_code=http_exc.status_code, content={"detail": http_exc.detail})

    if "pinecone" in type(exc).__module__.lower():
        try:
            handle_pinecone_error(exc)
        except HTTPException as http_exc:
            return JSONResponse(status_code=http_exc.status_code, content={"detail": http_exc.detail})

    return JSONResponse(status_code=500, content={"detail": f"Unexpected server error: {msg}"})


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
