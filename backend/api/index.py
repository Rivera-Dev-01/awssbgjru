import sys
import json
import os
import re
import smtplib
from email.message import EmailMessage
from datetime import datetime, timezone

_api_dir = os.path.dirname(os.path.abspath(__file__))
_project_root = os.path.join(_api_dir, "..", "..")

sys.path.insert(0, _api_dir)
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

import chatbot
import config
import rate_limiter
import cache

from supabase import create_client

supabase = create_client(config.SUPABASE_URL, config.SUPABASE_KEY)

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


@app.post("/api/register")
async def register(request: Request):
    data = await request.json()

    email = data.get("email", "")
    if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
        return JSONResponse({"error": "Invalid email address"}, status_code=422)

    division_type = data.get("division_type", "")
    if division_type not in ("office", "skillbuilder"):
        return JSONResponse({"error": "division_type must be office or skillbuilder"}, status_code=422)

    photo_base64 = data.get("photo_base64", "")
    if photo_base64 and not photo_base64.startswith("data:image/"):
        return JSONResponse({"error": "photo_base64 must be a valid data URL"}, status_code=422)

    row = {
        "full_name": data.get("full_name", ""),
        "student_id": data.get("student_id", ""),
        "email": email,
        "year": data.get("year", ""),
        "program": data.get("program", ""),
        "dob": data.get("dob", ""),
        "photo_base64": photo_base64,
        "explanation": data.get("explanation", ""),
        "division_type": division_type,
        "division_name": data.get("division_name", ""),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    try:
        result = supabase.table("registrations").insert(row).execute()
    except Exception as e:
        return JSONResponse({"error": f"Database error: {str(e)}"}, status_code=500)

    if not result.data:
        return JSONResponse({"error": "Failed to insert registration"}, status_code=500)

    inserted_id = result.data[0]["id"]

    try:
        _send_notification(data)
    except Exception:
        pass

    return JSONResponse({"success": True, "id": inserted_id}, status_code=201)


def _send_notification(data: dict):
    if not config.EMAIL_USER or not config.EMAIL_PASS or not config.NOTIFY_EMAIL:
        return

    msg = EmailMessage()
    msg["Subject"] = f"New Registration — {data.get('full_name', '')}"
    msg["From"] = config.EMAIL_USER
    msg["To"] = config.NOTIFY_EMAIL

    body = f"""
New member registration:

  Name:            {data.get('full_name', '')}
  Student ID:      {data.get('student_id', '')}
  Email:           {data.get('email', '')}
  Year:            {data.get('year', '')}
  Program:         {data.get('program', '')}
  DOB:             {data.get('dob', '')}
  Division Type:   {data.get('division_type', '')}
  Division Name:   {data.get('division_name', '')}

Explanation:
{data.get('explanation', '')}
"""
    msg.set_content(body.strip())

    with smtplib.SMTP(config.EMAIL_HOST, config.EMAIL_PORT) as smtp:
        smtp.starttls()
        smtp.login(config.EMAIL_USER, config.EMAIL_PASS)
        smtp.send_message(msg)


frontend_path = os.path.join(_project_root, "frontend")
if os.path.isdir(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
