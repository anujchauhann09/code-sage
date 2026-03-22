import os

SUPPORTED_EXTENSIONS = ('.py', '.js', '.ts', '.java', '.cpp', '.c', '.go', '.rs', '.json', '.md')

def load_code_files(folder_path: str):
    documents = []

    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.endswith(SUPPORTED_EXTENSIONS):
                path = os.path.join(root, file)

                try:
                    with open(path, "r", encoding="utf-8") as f:
                        content = f.read()

                    documents.append({
                        "file_name": file,
                        "path": path,
                        "content": content
                    })
                except Exception as e:
                    print(f"Error reading {file}: {e}")

    return documents