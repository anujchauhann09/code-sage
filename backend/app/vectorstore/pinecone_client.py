from pinecone import Pinecone
from app.config import PINECONE_API_KEY, PINECONE_INDEX

pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX)

def upsert_vectors(vectors, namespace: str):
    index.upsert(vectors=vectors, namespace=namespace)

def query_vectors(vector, namespace: str, top_k=5, filter_condition=None, include_values=False):
    return index.query(
        vector=vector,
        top_k=top_k,
        namespace=namespace,
        include_metadata=True,
        include_values=include_values,
        filter=filter_condition
    )

def delete_namespace(namespace: str):
    index.delete(delete_all=True, namespace=namespace)