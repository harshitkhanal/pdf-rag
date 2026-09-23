from google import genai
from dotenv import load_dotenv
from rags.retrieve import retrieve

import os
import random

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

models = [
    "gemini-3.5-flash",
    "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-3-flash-preview",
    "gemini-3.7-flash"
]


def generate_answer(query,retrieved_chunks):

    if not retrieved_chunks:
        return "I couldn't find relevant information in the document."

    context_parts = []

    for i, chunk in enumerate(retrieved_chunks, 1):
        context_parts.append(
            f"""
--- Context {i} ---
Source: {chunk["source"]}
Page: {chunk["page"]}

{chunk["text"]}
"""
        )

    context = "\n".join(context_parts)

   
    prompt = f"""
You are answering a question about a document.

Use ONLY the context passages provided below.

Rules:
- Answer using information from the context only.
- If the context does not contain the answer, say so.
- Write in your own words.
- Do not combine separate passages into a claim
  that the passages do not support.
- Avoid repeating the same information.
- Keep the answer concise.
- Include a code snippet only if relevant code
  is present in the context.

Citation rules:
- Each context passage has a number, such as [1], [2], [3].
- Cite a claim using the number of the passage
  that directly supports it.
- ONLY use citation numbers that appear in the
  provided context.
- Never invent, alter, or guess citation numbers.
- Do not cite a passage unless it supports the claim.
- If no passage supports a claim, do not make
  that claim.

Context:
{context}        

User question:
{query}
"""

   
    models_shuffled = random.sample(models, len(models))

    interaction = None

    for model in models_shuffled:
        try:
            interaction = client.interactions.create(
                model=model,
                input=prompt
            )

            break

        except Exception as e:
            print(f"{model} failed: {e}")

    if interaction is None:
        return "Unable to generate an answer. Please try again later."


    sources = "\n\nSources:\n\n"

    for i, chunk in enumerate(retrieved_chunks, 1):
        sources += f"\n\npage:{chunk['page']}\t\nchunkId:{chunk['chunkId']}\n\n"
    return interaction.output_text+sources