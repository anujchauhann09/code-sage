from google import genai
from app.config import GEMINI_API_KEY, GOOGLE_API_MODEL

client = genai.Client(api_key=GEMINI_API_KEY)

def generate_answer(query: str, context_chunks: list):
    formatted_context = ""

    for i, chunk in enumerate(context_chunks):
        formatted_context += f"\n[Chunk {i+1}]\n{chunk}\n"

    prompt = f"""
You are a strict code assistant.

RULES:
1. Answer ONLY using the provided context
2. If answer not found → say "Not found in codebase"
3. ALWAYS cite chunk number like [Chunk 2]
4. DO NOT hallucinate

Context:
{formatted_context}

Question:
{query}
"""

    response = client.models.generate_content(model=GOOGLE_API_MODEL, contents=prompt)
    return response.text
