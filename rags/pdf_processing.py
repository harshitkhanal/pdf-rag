import pymupdf 
import json
from pathlib import Path
import numpy as np

# Getting the data from the pdf
def process_pdf(pdf_path):
    pdf_name = Path(pdf_path).stem
    pdf_data = []
    with pymupdf.open(pdf_path) as pdf:
        for i,page in enumerate(pdf):
            text = page.get_text()
            if text.strip() == '' :
                continue 
            pdf_data.append({
                "source":pdf_name,
                "page":i+1,
                "text":text
            })
   
    return pdf_data


# Chunking
def get_chunks_from_pdf(pdf_data):
    

    pdf_chunks = []
    idx = 0
    chunk_size = 500

    for data in pdf_data:
        text = data["text"]
        paragraphs = [
            p.strip()
            for p in text.split("\n")
            if p.strip()
        ]

        current_chunk = ""

        for paragraph in paragraphs:

            # If a paragraph is longer than the chunk limit,
            # split it into smaller pieces.
            if len(paragraph) > chunk_size:

                # Save any existing chunk first.
                if current_chunk:
                    pdf_chunks.append({
                        "chunkId": idx,
                        "source": data["source"],
                        "page": data["page"],
                        "text": current_chunk
                    })
                    idx += 1
                    current_chunk = ""

                # Split the long paragraph into pieces.
                for start in range(0, len(paragraph), chunk_size):
                    piece = paragraph[start:start + chunk_size]

                    pdf_chunks.append({
                        "chunkId": idx,
                        "source": data["source"],
                        "page": data["page"],
                        "text": piece
                    })
                    idx += 1

            # Add paragraph if it fits in the current chunk.
            elif len(current_chunk) + len(paragraph) + 1 <= chunk_size:
                if current_chunk:
                    current_chunk += "\n"

                current_chunk += paragraph

            # Otherwise, save the current chunk and start a new one.
            else:
                if current_chunk:
                    pdf_chunks.append({
                        "chunkId": idx,
                        "source": data["source"],
                        "page": data["page"],
                        "text": current_chunk
                    })
                    idx += 1

                current_chunk = paragraph

        # Save the remaining chunk for this page.
        if current_chunk:
            pdf_chunks.append({
                "chunkId": idx,
                "source": data["source"],
                "page": data["page"],
                "text": current_chunk
            })
            idx += 1

    
    return pdf_chunks


from sentence_transformers import SentenceTransformer
import faiss
import numpy as np 

model = SentenceTransformer("BAAI/bge-small-en-v1.5")

def get_embeddings(texts,embed_path):
    embeddings =  model.encode(
        inputs = texts ,
        normalize_embeddings=True
    )
    np.save(embed_path,embeddings)
    return embeddings


def save_faiss_index(text_embeddings,index_path):
    text_embeddings = np.asarray(
        text_embeddings,
        dtype=np.float32
    )
    dimension = text_embeddings.shape[1]
    index = faiss.IndexFlatIP(dimension)
    index.add(text_embeddings)
    index_path = Path(index_path)
    index_path.parent.mkdir(
        parents=True, 
        exist_ok=True
    )
    faiss.write_index(index, str(index_path))

    return index