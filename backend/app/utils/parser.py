import re

def extract_function_name(code_chunk: str):
    patterns = [
        r"def\s+(\w+)\(",           # Python
        r"function\s+(\w+)\(",      # JS
        r"class\s+(\w+)",           # Class
        r"(\w+)\s+\w+\(.*\)\s*{",   # Java/C
    ]

    for pattern in patterns:
        match = re.search(pattern, code_chunk)
        if match:
            return match.group(1)

    return "unknown"