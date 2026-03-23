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

    matches = getattr(results, "matches", []) or []
    context = []
    for m in matches:
        metadata = getattr(m, "metadata", None)
        if isinstance(metadata, dict):
            pass
        elif hasattr(metadata, "__getitem__"):
            pass
        else:
            continue
        file_name_val = metadata.get("file_name", "unknown") if hasattr(metadata, "get") else getattr(metadata, "file_name", "unknown")
        text_val = metadata.get("text", "") if hasattr(metadata, "get") else getattr(metadata, "text", "")
        if not text_val:
            continue
        context.append({
            "file_name": file_name_val,
            "content": text_val,
        })
    return context
