from app.embeddings.gemini_embedder import get_embedding
from app.vectorstore.pinecone_client import query_vectors


def retrieve_context(query: str, namespace: str, file_name=None):
    query_embedding = get_embedding(query)

    filter_condition = None
    if file_name:
        filter_condition = {"file_name": {"$eq": file_name}}

    results = query_vectors(
        vector=query_embedding,
        namespace=namespace,
        top_k=5,
        filter_condition=filter_condition
    )

    matches = results.get("matches", [])
    return [
        m["metadata"]["text"]
        for m in matches
        if m.get("metadata") and m["metadata"].get("text")
    ]
