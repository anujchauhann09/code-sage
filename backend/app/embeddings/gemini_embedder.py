from google import genai
from app.config import GEMINI_API_KEY, GOOGLE_EMBEDDING_MODEL
from app.utils.error_handler import handle_gemini_error

client = genai.Client(api_key=GEMINI_API_KEY)

def get_embedding(text: str):
    try:
        response = client.models.embed_content(
            model=GOOGLE_EMBEDDING_MODEL,
            contents=text,
            config={"output_dimensionality": 768}
        )
        return response.embeddings[0].values
    except Exception as exc:
        handle_gemini_error(exc)