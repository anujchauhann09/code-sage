# CodeSage — AI-Powered Codebase Q&A

> Ask questions about any codebase in plain English. Get accurate, cited answers backed by your actual source code.

CodeSage is a full-stack RAG (Retrieval-Augmented Generation) application that lets you ingest a GitHub repository or ZIP archive, then query it conversationally. Every answer is grounded in your real code and includes source file citations.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Backend setup](#2-backend-setup)
  - [3. Frontend setup](#3-frontend-setup)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Usage Guide](#usage-guide)
- [API Reference](#api-reference)
- [Supported File Types](#supported-file-types)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **GitHub Ingestion** — point to any public or private GitHub repo and ingest it by URL
- **ZIP Upload** — drag and drop a local ZIP archive of your codebase
- **Conversational Q&A** — ChatGPT-like chat interface with message history
- **Source Citations** — every AI answer links back to the exact source files it used
- **Code-aware chunking** — splits code at function and class boundaries for better context
- **Namespace isolation** — multiple codebases can coexist in separate namespaces
- **Dark / Light theme** — persisted across sessions
- **Fully responsive** — works on desktop, tablet, and mobile

---

## Architecture

```
User
 │
 ▼
Next.js Frontend  ──────────────────────────────────────────────────────────┐
 │  /tools   → ingest GitHub repo or ZIP                                    │
 │  /chat    → conversational Q&A                                           │
 │                                                                          │
 ▼  REST API calls                                                          │
FastAPI Backend                                                             │
 │                                                                          │
 ├── POST /ingest          (ZIP upload)                                     │
 ├── POST /ingest/github   (GitHub URL)                                     │
 └── POST /query           (question answering)                             │
      │                                                                     │
      ├── Ingestion Pipeline                                                │
      │    ├── Load files (GitHub API / local ZIP)                          │
      │    ├── Chunk code at function/class boundaries                      │
      │    ├── Embed chunks → Gemini Embedding API                          │
      │    └── Store vectors → Pinecone                                     │
      │                                                                     │
      └── Query Pipeline                                                    │
           ├── Embed question → Gemini Embedding API                        │
           ├── Similarity search → Pinecone                                 │
           ├── Retrieve top-k relevant chunks                               │
           └── Generate answer → Gemini LLM (with citations)               │
                                                                            │
◄───────────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, CSS Modules |
| Backend | FastAPI, Python 3.10+ |
| LLM | Google Gemini (`gemini-2.5-flash`) |
| Embeddings | Google Gemini (`gemini-embedding-001`, 768 dimensions) |
| Vector DB | Pinecone |
| GitHub API | REST API v3 (optional token for private repos) |

---

## Project Structure

```
codesage/
├── backend/
│   ├── app/
│   │   ├── embeddings/
│   │   │   └── gemini_embedder.py     # Gemini embedding calls
│   │   ├── ingestion/
│   │   │   ├── chunker.py             # Function-boundary code chunker
│   │   │   ├── github_loader.py       # GitHub API file fetcher
│   │   │   ├── loader.py              # Local file loader
│   │   │   └── pipeline.py            # Ingestion orchestration
│   │   ├── llm/
│   │   │   └── gemini_llm.py          # Gemini answer generation
│   │   ├── retrieval/
│   │   │   └── retriever.py           # Vector similarity search
│   │   ├── schemas/
│   │   │   ├── ingest_schema.py       # Request models for ingestion
│   │   │   └── query_schema.py        # Request model for queries
│   │   ├── utils/
│   │   │   ├── error_handler.py       # Centralised API error handling
│   │   │   └── parser.py              # Function name extractor
│   │   ├── vectorstore/
│   │   │   └── pinecone_client.py     # Pinecone upsert / query / delete
│   │   ├── config.py                  # Environment variable loader
│   │   └── main.py                    # FastAPI app & route definitions
│   ├── .env                           # Backend environment variables
│   └── requirements.txt
│
├── frontend/
│   ├── components/                    # Reusable React components
│   │   ├── ChatInterface.jsx          # Full chat UI with sidebar
│   │   ├── CitationList.jsx           # Source file citation display
│   │   ├── GithubIngestForm.jsx       # GitHub ingestion form
│   │   ├── LoadingDots.jsx            # Animated loading indicator
│   │   ├── MessageBubble.jsx          # Chat message renderer
│   │   ├── Navbar.jsx                 # Global navigation bar
│   │   ├── ThemeToggle.jsx            # Dark/light mode toggle
│   │   └── ZipUploadForm.jsx          # Drag-and-drop ZIP upload
│   ├── context/
│   │   └── AppContext.js              # Global state (theme, namespace)
│   ├── pages/
│   │   ├── index.js                   # Home / landing page
│   │   ├── tools.js                   # Ingestion tools page
│   │   ├── chat.js                    # Chat interface page
│   │   └── about.js                   # About / how it works page
│   ├── styles/                        # CSS Modules per page
│   ├── utils/
│   │   └── api.js                     # Frontend API client
│   ├── .env.local                     # Frontend environment variables
│   └── package.json
│
└── README.md
```

---

## Prerequisites

Make sure you have the following installed:

- **Python** 3.10 or higher
- **Node.js** 18 or higher
- **pip** (comes with Python)
- **npm** (comes with Node.js)

You will also need accounts and API keys for:

- [Google AI Studio](https://aistudio.google.com/) — for Gemini LLM and embedding models
- [Pinecone](https://www.pinecone.io/) — for vector storage (free tier works)
- [GitHub](https://github.com/settings/tokens) — optional, only needed for private repos

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/anujchauhann09/code-sage.git
cd codesage
```

### 2. Backend setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Create your environment file
cp .env.example .env
# Then fill in your API keys (see Environment Variables section below)
```

### 3. Frontend setup

```bash
cd frontend

# Install dependencies
npm install

# Create your environment file
cp .env.local.example .env.local
# Then set NEXT_PUBLIC_API_URL (defaults to http://localhost:8000)
```

---

## Environment Variables

### Backend — `backend/.env`

```env
# Google Gemini
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_API_MODEL=gemini-2.5-flash
GOOGLE_EMBEDDING_MODEL=models/gemini-embedding-001

# Pinecone
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX=codebase-rag

# GitHub (optional — only needed for private repositories)
GITHUB_TOKEN=your_github_personal_access_token_here
```

**Where to get these:**

| Variable | Where to get it |
|---|---|
| `GEMINI_API_KEY` | [Google AI Studio → API Keys](https://aistudio.google.com/app/apikey) |
| `PINECONE_API_KEY` | [Pinecone Console → API Keys](https://app.pinecone.io/) |
| `PINECONE_INDEX` | Create an index in Pinecone with **768 dimensions** and **cosine** metric |
| `GITHUB_TOKEN` | [GitHub → Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens) |

> **Pinecone index setup:** When creating your index, set dimensions to `768` and metric to `cosine`. These match the `gemini-embedding-001` output.

### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Change this to your deployed backend URL when hosting in production.

---

## Running the App

Open two terminal windows.

**Terminal 1 — Backend:**

```bash
cd backend
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate         # Windows

uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.  
Interactive docs at `http://localhost:8000/docs`.

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Usage Guide

### Ingesting a codebase

1. Navigate to **Tools** (`/tools`) in the navbar
2. Choose your ingestion method:
   - **GitHub Repo** — paste a GitHub URL (e.g. `https://github.com/owner/repo`), enter a namespace, and optionally specify a branch
   - **ZIP Upload** — drag and drop a `.zip` file of your codebase and enter a namespace
3. Click **Ingest** and wait for confirmation
4. The namespace is automatically saved to your session

> **Namespace** is a unique identifier for your codebase in the vector database. Use something descriptive like `my-project` or `react-source`. You can have multiple codebases ingested under different namespaces.

### Asking questions

1. Navigate to **Chat** (`/chat`)
2. Confirm your namespace is set in the sidebar (or enter it manually)
3. Type your question and press **Enter** or click the send button
4. The AI will respond with an answer and collapsible source citations

**Example questions:**
- *"How does authentication work in this codebase?"*
- *"What does the `processPayment` function do?"*
- *"Where are database connections managed?"*
- *"Explain the folder structure of this project"*

---

## API Reference

### `POST /ingest`

Ingest a ZIP archive.

```
Content-Type: multipart/form-data

file      (File)    .zip archive of the codebase
namespace (string)  unique identifier for this codebase
```

**Response:**
```json
{ "status": "success", "chunks_ingested": 142 }
```

---

### `POST /ingest/github`

Ingest a GitHub repository.

```json
{
  "repo_url":  "https://github.com/owner/repo",
  "namespace": "my-project",
  "branch":    "main"
}
```

**Response:**
```json
{ "status": "success", "chunks_ingested": 87 }
```

---

### `POST /query`

Query an ingested codebase.

```json
{
  "query":     "How does the authentication middleware work?",
  "namespace": "my-project"
}
```

**Response:**
```json
{
  "answer": "The authentication middleware checks for a JWT token in...",
  "context_used": [
    { "file_name": "src/middleware/auth.js", "content": "..." },
    { "file_name": "src/utils/jwt.js",       "content": "..." }
  ],
  "namespace": "my-project"
}
```

---

## Supported File Types

The following file extensions are indexed during ingestion:

| Language | Extensions |
|---|---|
| Python | `.py` |
| JavaScript | `.js` |
| TypeScript | `.ts` |
| Java | `.java` |
| C / C++ | `.c`, `.cpp` |
| Go | `.go` |
| Rust | `.rs` |
| JSON | `.json` |
| Markdown | `.md` |

Files larger than 200 KB are skipped automatically.

---

## Contributing

Contributions are welcome. To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature`
5. Open a pull request

Please keep PRs focused and include a clear description of what changed and why.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">Built with FastAPI · Pinecone · Gemini · Next.js</p>
