import re

FUNCTION_PATTERNS = [
    r"def\s+\w+\(.*\):",        # Python
    r"class\s+\w+",             # Python/Java
    r"function\s+\w+\(.*\)",    # JS
    r"\w+\s+\w+\(.*\)\s*{",     # C/Java style
]


def is_function_boundary(line: str):
    for pattern in FUNCTION_PATTERNS:
        if re.search(pattern, line):
            return True
    return False


def chunk_code(content: str, chunk_size: int = 50):
    lines = content.split("\n")
    chunks = []
    current_chunk = []

    for line in lines:
        if is_function_boundary(line) and current_chunk:
            chunk = "\n".join(current_chunk).strip()
            if chunk:
                chunks.append(chunk)
            current_chunk = []

        current_chunk.append(line)

        if len(current_chunk) >= chunk_size:
            chunk = "\n".join(current_chunk).strip()
            if chunk:
                chunks.append(chunk)
            current_chunk = []

    if current_chunk:
        chunk = "\n".join(current_chunk).strip()
        if chunk:
            chunks.append(chunk)

    return chunks
