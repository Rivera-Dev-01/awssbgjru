import json
import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

from . import chatbot
from . import config
from . import rate_limiter
from . import cache

app = FastAPI(title="Cumulus Helm Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

limiter = rate_limiter.RateLimiter()
response_cache = cache.TTLCache()


@app.post("/api/chat")
async def chat(request: Request):
    body = await request.json()
    message = body.get("message", "").strip()

    if not message:
        return JSONResponse({"error": "Message is required"}, status_code=400)

    client_ip = request.client.host if request.client else "unknown"

    if not limiter.is_allowed(client_ip):
        return JSONResponse(
            {"error": "Rate limit exceeded. Please wait before sending another message."},
            status_code=429,
        )

    cache_key = message.lower().strip()
    cached = response_cache.get(cache_key)
    if cached is not None:

        async def cached_stream():
            yield f"data: {json.dumps({'token': cached})}\n\n"
            yield f"data: {json.dumps({'token': '[DONE]'})}\n\n"

        return StreamingResponse(cached_stream(), media_type="text/event-stream")

    async def stream():
        full_response = ""
        for chunk in chatbot.generate(message):
            if "error" in chunk:
                yield f"data: {json.dumps(chunk)}\n\n"
                return
            token = chunk.get("token", "")
            if token == "[DONE]":
                response_cache.set(cache_key, full_response)
                yield f"data: {json.dumps(chunk)}\n\n"
                return
            full_response += token
            yield f"data: {json.dumps({'token': token})}\n\n"

    return StreamingResponse(stream(), media_type="text/event-stream")


@app.get("/api/health")
async def health():
    return {"status": "ok", "model": config.GROQ_MODEL}


frontend_path = os.path.join(os.path.dirname(__file__), "..", "..", "frontend")
if os.path.isdir(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
