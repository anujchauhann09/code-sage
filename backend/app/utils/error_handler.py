from fastapi import HTTPException


def _gemini_http_exception(status_code: int, message: str) -> HTTPException:
    if status_code == 429:
        detail = (
            "Our AI service is a bit overwhelmed right now. "
            "Try uploading a smaller codebase — a handful of files works best — and give it another go."
        )
        return HTTPException(status_code=429, detail=detail)

    if status_code == 400:
        detail = (
            "Gemini rejected the request — the input may be too large. "
            "Try a smaller codebase or reduce the number of files."
        )
        return HTTPException(status_code=400, detail=detail)

    if status_code in (401, 403):
        detail = "Gemini API key is invalid or lacks permission. Check your GEMINI_API_KEY."
        return HTTPException(status_code=502, detail=detail)

    if status_code == 503:
        detail = "Gemini service is temporarily unavailable. Please try again in a moment."
        return HTTPException(status_code=503, detail=detail)

    return HTTPException(
        status_code=502,
        detail=f"Gemini API error ({status_code}): {message}",
    )


def handle_gemini_error(exc: Exception) -> None:
    status_code = getattr(exc, "status_code", None)
    message = str(exc)

    if status_code is None:
        status_code = getattr(exc, "code", None)

    if status_code == 429 or "RESOURCE_EXHAUSTED" in message or "quota" in message.lower():
        raise _gemini_http_exception(429, message)

    if status_code is not None:
        raise _gemini_http_exception(int(status_code), message)

    raise HTTPException(status_code=502, detail=f"Gemini API error: {message}")


def handle_pinecone_error(exc: Exception) -> None:
    message = str(exc)

    if "quota" in message.lower() or "rate limit" in message.lower() or "429" in message:
        raise HTTPException(
            status_code=429,
            detail=(
                "Our AI service is a bit overwhelmed right now. "
                "Try uploading a smaller codebase and give it another go."
            ),
        )

    if "unauthorized" in message.lower() or "403" in message or "401" in message:
        raise HTTPException(
            status_code=502,
            detail="Pinecone API key is invalid or lacks permission. Check your PINECONE_API_KEY.",
        )

    if "not found" in message.lower() or "404" in message:
        raise HTTPException(
            status_code=404,
            detail="Pinecone index or namespace not found. Make sure you have ingested a codebase first.",
        )

    raise HTTPException(status_code=502, detail=f"Pinecone error: {message}")
