import requests
from app.config import GITHUB_TOKEN

GITHUB_API = "https://api.github.com"

ALLOWED_EXTENSIONS = (
    ".py", ".js", ".ts", ".java", ".cpp",
    ".c", ".go", ".rs", ".json", ".md"
)


def get_headers():
    headers = {"Accept": "application/vnd.github+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    return headers


def parse_github_url(repo_url: str):
    parts = repo_url.rstrip("/").split("/")
    return parts[-2], parts[-1]


def is_valid_file(file_name: str):
    return file_name.endswith(ALLOWED_EXTENSIONS)


def resolve_branch(owner: str, repo: str, branch: str = None) -> str:
    if branch:
        return branch
    # try main first, fallback to master
    for candidate in ["main", "master"]:
        url = f"{GITHUB_API}/repos/{owner}/{repo}/branches/{candidate}"
        r = requests.get(url, headers=get_headers())
        if r.status_code == 200:
            return candidate
    raise Exception(f"Could not resolve default branch for {owner}/{repo}")


def fetch_repo_files(owner: str, repo: str, path="", branch: str = None):
    if branch is None:
        branch = resolve_branch(owner, repo)
    url = f"{GITHUB_API}/repos/{owner}/{repo}/contents/{path}?ref={branch}"
    response = requests.get(url, headers=get_headers())

    if response.status_code != 200:
        raise Exception(f"Failed to fetch repo contents at '{path}': {response.status_code} {response.text}")

    items = response.json()
    files = []

    for item in items:
        if item["type"] == "file" and is_valid_file(item["name"]):
            if item.get("size", 0) > 200000:
                continue

            file_url = item["download_url"]
            if not file_url:
                continue

            try:
                content_response = requests.get(file_url, headers=get_headers(), timeout=10)
                content_response.raise_for_status()
                content = content_response.text
            except Exception as e:
                print(f"Skipping {item['path']}: {e}")
                continue

            files.append({
                "file_name": item["path"],
                "content": content
            })

        elif item["type"] == "dir":
            files.extend(fetch_repo_files(owner, repo, item["path"], branch))

    return files
