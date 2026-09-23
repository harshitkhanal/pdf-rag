from fastapi import FastAPI,UploadFile,File,HTTPException
from fastapi.responses import FileResponse
from pydantic import  BaseModel,Field
from pathlib import Path 
from rags.storage import create_document_directory,save_json,load_json
from rags.storage import DOCUMENTS_DIR,CHAT_DIR
from rags.pdf_processing import get_chunks_from_pdf,get_embeddings,process_pdf,save_faiss_index
from rags.retrieve import retrieve
from rags.generation import generate_answer
import shutil
from fastapi.middleware.cors import CORSMiddleware
from typing import List,Optional,Dict,Any
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # Specify the exact frontend origins instead of "*"
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_pdf(file:UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(
            status_code=400, 
            detail = "No filename provided"
        )
    if Path(file.filename).suffix.lower() !=".pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )
        
    document_id,document_dir = create_document_directory()
    
    pdf_path = document_dir/"original.pdf"
    
    try:
        with pdf_path.open("wb") as buffer:
            shutil.copyfileobj(file.file,buffer)
        pdf_data = process_pdf(pdf_path)
            
        chunks = get_chunks_from_pdf(pdf_data)
            
        save_json(chunks,document_dir/"chunks.json")
        texts = [chunk["text"] for chunk in chunks]
        if not texts:
            raise ValueError("No text extracted from PDF")
        
        embed_path = document_dir/"embeddings.npy"
        text_embeddings = get_embeddings(texts,embed_path) 
        save_faiss_index(text_embeddings,document_dir/"index.faiss")
        return {
        "document_id":document_id,
        "filename":file.filename,
        "pages":len(pdf_data),
        "message":"PDF uploaded successfully"
    }
    except Exception:
      shutil.rmtree(document_dir,ignore_errors=True)
      raise HTTPException(
          status_code=500,
          detail="Failed to save pdf"
      )
    finally:
        file.file.close()


class Query(BaseModel):
    query:str
    documentId: str


@app.post("/ask")
def ask_question(data:Query):
    chunk_path = DOCUMENTS_DIR / data.documentId / "chunks.json"
    index_path = DOCUMENTS_DIR / data.documentId / "index.faiss"
    if not chunk_path.exists() or not index_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Document not found" 
        )   
    retrieved_chunks = retrieve( data.query,chunk_path,index_path)
    
    answer = generate_answer(
        data.query,retrieved_chunks
    )
    
    return {
        "answer":answer,
    }

class Message(BaseModel):
    role:str 
    content:str

class PdfMetadata(BaseModel):
    filename:str 
    document_id:str 
    pages:int 
    message:str    

class ChatItem(BaseModel):
    id:int 
    title:str 
    pdfInfo:Optional[PdfMetadata] = None 
    pdfUrl: Optional[str] = None 
    messages :List[Message] = Field(default_factory=list)
@app.post("/chats/save")
def save_chats(chats:List[ChatItem]):
    try:
        chats_dict = [chat.model_dump() for chat in chats]
        save_json(chats_dict,CHAT_DIR/"chats.json")
        return {
            "status":"success",
            "saved_count":len(chats)
        }
    except Exception as e: 
        raise HTTPException(
            status_code=500, 
            detail = f"Failed to savechats : {str(e)}"
        )
        

@app.get("/chats")
def get_chats():
    path = CHAT_DIR/"chats.json"
    chats = load_json(path)
    return {
        "chats":chats
    }

@app.get("/pdf/{document_id}")
async def get_pdf(document_id:str):
    pdf_path = DOCUMENTS_DIR/document_id/"original.pdf"
    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        content_disposition_type="inline"
    )