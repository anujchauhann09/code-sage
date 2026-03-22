from fastapi import HTTPException
from app.ingestion.loader import load_code_files
from app.ingestion.github_loader import parse_github_url, fetch_repo_files
from app.ingestion.chunker import chunk_code
from app.embeddings.gemini_embedder import get_embedding
from app.vectorstore.pinecone_client import upsert_vectors, delete_namespace
from app.utils.parser import extract_function_name


def process_documents(documents, namespace: str):
    if not documents:
        raise HTTPException(status_code=400, detail="No supported files found to ingest")

    vectors = []
    id_counter = 0

    for doc in documents:
        chunks = chunk_code(doc["content"])

        for chunk in chunks:
            embedding = get_embedding(chunk)
            function_name = extract_function_name(chunk)

            vectors.append({
                "id": f"{namespace}_{id_counter}",
                "values": embedding,
                "metadata": {
                    "text": chunk,
                    "file_name": doc["file_name"],
                    "function_name": function_name,
                    "path": doc.get("path", "")
                }
            })

            id_counter += 1

    upsert_vectors(vectors, namespace)
    return id_counter


def ingest_folder(folder_path: str, namespace: str):
    import os
    if not os.path.isdir(folder_path):
        raise HTTPException(status_code=400, detail=f"Folder not found: {folder_path}")

    delete_namespace(namespace)
    documents = load_code_files(folder_path)
    count = process_documents(documents, namespace)

    return {"status": "success", "chunks_ingested": count}


def ingest_github_repo(repo_url: str, namespace: str, branch: str = None):
    try:
        owner, repo = parse_github_url(repo_url)
    except Exception:
        raise HTTPException(status_code=400, detail=f"Invalid GitHub URL: {repo_url}")

    delete_namespace(namespace)

    try:
        files = fetch_repo_files(owner, repo, branch=branch)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))

    documents = [
        {
            "content": f["content"],
            "file_name": f["file_name"],
            "path": f["file_name"]
        }
        for f in files
    ]

    count = process_documents(documents, namespace)
    return {"status": "success", "chunks_ingested": count}