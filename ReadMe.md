# PDF-RAG

A local PDF question-answering application built with **FastAPI, React, FAISS, Sentence Transformers, and Google Gemini**.

PDF-RAG allows users to upload a PDF, ask questions about its contents, and receive context-aware answers generated from the document. Each document is processed and stored locally, allowing multiple questions to be asked without reprocessing the PDF.

---

## Overview

PDF-RAG uses a Retrieval-Augmented Generation (RAG) pipeline to ground LLM responses in the contents of an uploaded PDF.

Instead of sending the entire document to the language model for every question, the application:

1. Extracts text from the PDF.
2. Splits the text into smaller chunks.
3. Converts the chunks into vector embeddings.
4. Stores the embeddings in a FAISS index.
5. Converts each user query into an embedding.
6. Retrieves the most relevant chunks using vector similarity.
7. Sends the retrieved context and the user's question to Gemini.
8. Generates an answer based only on the retrieved document context.

This reduces unnecessary context sent to the LLM and helps keep responses grounded in the uploaded document.

---

## Features

* 📄 PDF upload and processing
* 🔍 Semantic document retrieval using embeddings
* ⚡ FAISS vector similarity search
* 🤖 Gemini-powered answer generation
* 💬 Persistent conversations
* 🗂️ Persistent document storage
* 📑 PDF viewing inside the application
* 📝 Markdown response rendering
* 📚 Source/page information for retrieved context
* 🎨 ChatGPT-inspired dark interface
* ⚛️ React frontend with component-based architecture
* 🚀 FastAPI backend
* 🔒 API keys stored through environment variables

---

## Tech Stack

### Backend

| Technology            | Purpose                          |
| --------------------- | -------------------------------- |
| Python                | Core backend language            |
| FastAPI               | REST API                         |
| PyMuPDF               | PDF text extraction              |
| Sentence Transformers | Text embeddings                  |
| FAISS                 | Vector similarity search         |
| Google Gemini         | Answer generation                |
| NumPy                 | Embedding storage and processing |

### Frontend

| Technology     | Purpose                  |
| -------------- | ------------------------ |
| React          | UI                       |
| Vite           | Frontend tooling         |
| Tailwind CSS   | Styling                  |
| Axios          | API communication        |
| React Markdown | Markdown rendering       |
| Remark GFM     | GitHub-Flavored Markdown |
| Framer Motion  | UI animations            |
| Lucide React   | Icons                    |

---

## Architecture

```text
                         ┌──────────────────┐
                         │      React       │
                         │    Frontend      │
                         └────────┬─────────┘
                                  │
                                  │ HTTP
                                  ▼
                         ┌──────────────────┐
                         │     FastAPI      │
                         │     Backend      │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
             PDF Processing               Chat Storage
                    │                           │
                    ▼                           ▼
             Text Extraction              chats.json
                    │
                    ▼
                Chunking
                    │
                    ▼
               Embeddings
                    │
                    ▼
              FAISS Index
                    │
                    │
User Query ─────────┤
                    │
                    ▼
             Semantic Retrieval
                    │
                    ▼
             Relevant Chunks
                    │
                    ▼
            Gemini Generation
                    │
                    ▼
                 Answer
```

---

## RAG Pipeline

### 1. PDF Upload

When a user uploads a PDF, the backend generates a unique `document_id`.

```text
document_id
     │
     ▼
data/documents/{document_id}/
```

The original PDF and its processed data are associated with this ID.

### 2. Text Extraction

PyMuPDF extracts text from each page of the PDF.

Each extracted section retains metadata such as:

```json
{
    "source": "original",
    "page": 42,
    "text": "..."
}
```

This allows retrieved information to be associated with its original page.

### 3. Chunking

The extracted text is divided into smaller chunks so that relevant sections can be retrieved independently.

Each chunk receives its own identifier and retains its page information.

### 4. Embedding Generation

Each chunk is converted into a numerical vector using:

```text
BAAI/bge-small-en-v1.5
```

The resulting vectors represent the semantic meaning of the document chunks.

### 5. FAISS Indexing

The embeddings are stored in a FAISS index.

```text
Document Chunks
      │
      ▼
Embeddings
      │
      ▼
FAISS Index
```

This allows relevant chunks to be retrieved efficiently based on semantic similarity.

### 6. Query Retrieval

When the user asks a question, the query is embedded using the same embedding model.

The query vector is then compared against the document vectors.

```text
User Question
      │
      ▼
Query Embedding
      │
      ▼
FAISS Search
      │
      ▼
Top Relevant Chunks
```

### 7. Generation

The retrieved chunks are passed to Gemini together with the user's question.

The generation prompt instructs the model to answer using the retrieved document context rather than introducing unsupported information.

The response can include references to the relevant source/page information.

---

## Data Storage

Each document receives its own directory:

```text
data/
└── documents/
    └── {document_id}/
        ├── original.pdf
        ├── chunks.json
        ├── embeddings.npy
        └── index.faiss
```

### `original.pdf`

The original uploaded document.

### `chunks.json`

Contains the processed document chunks together with their metadata.

### `embeddings.npy`

Stores the generated embedding vectors.

### `index.faiss`

The FAISS index used for semantic retrieval.

Chat conversations are stored separately:

```text
data/
└── chats/
    └── chats.json
```

The data directory is intentionally excluded from version control.

---

## Project Structure

```text
PDF-RAG/
│
├── data/
│   ├── chats/
│   │   └── chats.json
│   │
│   └── documents/
│       └── {document_id}/
│           ├── original.pdf
│           ├── chunks.json
│           ├── embeddings.npy
│           └── index.faiss
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── rags/
│   ├── processing.py
│   ├── embeddings.py
│   ├── retrieve.py
│   ├── generation.py
│   └── ...
│
├── main.py
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

---

## API

The backend exposes endpoints for the main application operations.

### Upload PDF

```http
POST /upload
```

Uploads and processes a PDF and returns its generated document ID.

### Ask a Question

```http
POST /ask
```

Example request:

```json
{
    "query": "How does neuroplasticity work?",
    "documentId": "document-id"
}
```

The backend retrieves relevant chunks from the corresponding document and generates an answer.

### Retrieve PDF

```http
GET /pdf/{documentId}
```

Returns the original PDF associated with the document ID.

### Save Chats

```http
POST /chats/save
```

Persists the current chat data.

### Get Chats

```http
GET /chats
```

Retrieves previously saved conversations.

---

## Setup

### Prerequisites

* Python 3.10+
* Node.js
* npm
* Google Gemini API key

### Clone the Repository

```bash
git clone https://github.com/harshitkhanal/pdf-rag.git
cd pdf-rag
```

### Backend Setup

Create and activate a virtual environment:

```bash
python -m venv rag
```

Windows:

```bash
rag\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_api_key_here
```

Do not commit the `.env` file.

### Frontend Setup

```bash
cd frontend
npm install
```

---

## Running the Application

Start the FastAPI backend from the project root:

```bash
uvicorn main:app --reload
```

Then start the frontend:

```bash
cd frontend
npm run dev
```

Open the local URL provided by Vite in your browser.

---

## Example Workflow

```text
1. Start the application
          │
          ▼
2. Upload a PDF
          │
          ▼
3. PDF is processed
          │
          ├── Text extracted
          ├── Text chunked
          ├── Embeddings generated
          └── FAISS index created
          │
          ▼
4. Ask a question
          │
          ▼
5. Relevant chunks retrieved
          │
          ▼
6. Gemini generates an answer
          │
          ▼
7. Answer displayed in chat
```

After the initial document processing, additional questions can be asked against the same document without uploading or processing it again.

---

## Why RAG?

A language model by itself does not automatically have access to the contents of a user's private PDF.

RAG provides a way to connect the model to external information:

```text
                 ┌───────────────┐
                 │   PDF Data    │
                 └───────┬───────┘
                         │
                    Retrieval
                         │
                         ▼
                 ┌───────────────┐
                 │ Relevant      │
                 │ Context       │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │     LLM       │
                 └───────┬───────┘
                         │
                         ▼
                      Answer
```

Only the most relevant portions of the document are provided as context for generation.

---

## Security

API credentials are loaded from environment variables and are not included in the repository.

The following are excluded through `.gitignore`:

```text
.env
rag/
data/chats/
data/documents/
*.ipynb
frontend/node_modules/
```

Uploaded PDFs and generated document data remain local to the application.

---

## Future Possibilities

Although the project is complete in its current form, the architecture could be extended with:

* Support for multiple documents in a conversation
* Hybrid BM25 + semantic retrieval
* Reranking models
* Streaming LLM responses
* Document deletion and management
* Authentication
* Cloud storage
* PostgreSQL or another persistent database
* Evaluation datasets for retrieval and generation quality
* Support for additional document formats

---

## Learning Goals

This project was built to explore the practical implementation of a RAG application and understand how its individual components work together.

Key concepts explored:

* Retrieval-Augmented Generation
* Semantic search
* Text embeddings
* Vector similarity
* FAISS
* Document chunking
* PDF processing
* LLM prompting
* FastAPI
* REST APIs
* React state management
* Persistent application data
* Frontend/backend architecture

---

## License

This project is intended for educational and portfolio purposes.
