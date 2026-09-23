import json 
from pathlib import Path
from uuid import uuid4

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR/"data"
DOCUMENTS_DIR = DATA_DIR/"documents"
CHAT_DIR = DATA_DIR/"chats"


def create_document_directory():
    document_id = str(uuid4())
    document_dir = DOCUMENTS_DIR /document_id 
    document_dir.mkdir(
        parents=True, 
        exist_ok=False
    )
    return document_id,document_dir
    
def save_json(data,path):
    path = Path(path)
    
    path.parent.mkdir(
        parents=True ,
        exist_ok=True
    )
    with path.open("w",encoding="utf-8") as f :
        json.dump(
            data,
            f, 
            indent=4 ,
            ensure_ascii=False
        )


def load_json(path):
    path = Path(path)
    if not path.exists():
        return []

    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)