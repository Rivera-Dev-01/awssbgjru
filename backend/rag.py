import os
import pickle
import numpy as np
from pathlib import Path

INDEX_DIR = Path(__file__).parent / "faiss_index"
INDEX_FILE = INDEX_DIR / "index.faiss"
META_FILE = INDEX_DIR / "metadata.pkl"

_embedder = None
_index = None
_metadata = None


def _get_embedder():
    global _embedder
    if _embedder is None:
        from sentence_transformers import SentenceTransformer
        _embedder = SentenceTransformer("all-MiniLM-L6-v2")
    return _embedder


def _load():
    global _index, _metadata
    if _index is not None:
        return

    if not INDEX_FILE.exists():
        _index = None
        _metadata = []
        return

    import faiss
    _index = faiss.read_index(str(INDEX_FILE))
    with open(META_FILE, "rb") as f:
        _metadata = pickle.load(f)


def embed_texts(texts):
    model = _get_embedder()
    return model.encode(texts, convert_to_numpy=True)


def build_index(texts):
    import faiss

    embeddings = embed_texts(texts)
    dim = embeddings.shape[1]

    INDEX_DIR.mkdir(parents=True, exist_ok=True)
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)
    faiss.write_index(index, str(INDEX_FILE))
    with open(META_FILE, "wb") as f:
        pickle.dump(texts, f)

    global _index, _metadata
    _index = index
    _metadata = texts
    print(f"Index saved: {len(texts)} chunks, {dim} dimensions")


def get_context(query, k=6):
    _load()
    if _index is None or not _metadata:
        return ""

    q_vec = embed_texts([query])
    distances, indices = _index.search(q_vec, k)

    chunks = []
    for i in range(len(indices[0])):
        idx = indices[0][i]
        if idx < len(_metadata):
            chunks.append(_metadata[idx])

    return "\n\n".join(chunks)
