from google import genai
from app.config import GEMINI_API_KEY, GOOGLE_EMBEDDING_MODEL

client = genai.Client(api_key=GEMINI_API_KEY)

def get_embedding(text: str):
    response = client.models.embed_content(
        model=GOOGLE_EMBEDDING_MODEL,
        contents=text
    )
    return response.embeddings[0].values