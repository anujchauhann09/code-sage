from pinecone import Pinecone
from app.config import PINECONE_API_KEY, PINECONE_INDEX
from app.utils.error_handler import handle_pinecone_error

pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX)

def upsert_vectors(vectors, namespace: str):
    try:
        index.upsert(vectors=vectors, namespace=namespace)
    except Exception as exc:
        handle_pinecone_error(exc)

def query_vectors(vector, namespace: str, top_k=5, filter_condition=None, include_values=False):
    try:
        return index.query(
            vector=vector,
            top_k=top_k,
            namespace=namespace,
            include_metadata=True,
            include_values=include_values,
            filter=filter_condition
        )
    except Exception as e:
        if "Namespace not found" in str(e) or "404" in str(e):
            return type("EmptyResult", (), {"matches": []})()
        raise

def delete_namespace(namespace: str):
    try:
        index.delete(delete_all=True, namespace=namespace)
    except Exception as e:
        if "Namespace not found" in str(e) or "404" in str(e):
            return
        raise