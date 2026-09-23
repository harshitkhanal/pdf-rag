from sentence_transformers import SentenceTransformer 
import faiss 
import numpy as np 
import json
model = SentenceTransformer("BAAI/bge-small-en-v1.5")



def get_chunks(chunk_path):
    with open(chunk_path,"r",encoding="utf-8") as f:
        chunks = json.load(f)
    return chunks

def retrieve(query,chunk_path,index_path,top_k=5): 
    chunks = get_chunks(chunk_path)
    if not chunks:
        return []
    index = faiss.read_index(str(index_path))
    query = (
    "Represent this sentence for searching relevant passages: "
    + query
)
    query_embed = model.encode(
        inputs=[query],
        normalize_embeddings=True 
    )
    scores,indices = index.search(query_embed,top_k)
    return [chunks[idx] for idx in indices[0]
            if 0 <= idx < len(chunks)]


