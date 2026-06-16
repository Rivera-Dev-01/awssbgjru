import smtplib
from email.message import EmailMessage
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from backend.database import supabase
from backend.schemas.registration import RegistrationRequest
from backend.api.config import (
    EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, NOTIFY_EMAIL,
)

router = APIRouter(prefix="/api", tags=["registration"])


@router.post("/register")
async def register(data: RegistrationRequest):
    row = {
        "full_name": data.full_name,
        "student_id": data.student_id,
        "email": data.email,
        "year": data.year,
        "program": data.program,
        "dob": data.dob,
        "photo_base64": data.photo_base64,
        "explanation": data.explanation,
        "division_type": data.division_type,
        "division_name": data.division_name,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    result = supabase.table("registrations").insert(row).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to insert registration")

    inserted_id = result.data[0]["id"]

    try:
        _send_notification(data)
    except Exception:
        pass

    return JSONResponse({"success": True, "id": inserted_id}, status_code=201)


def _send_notification(data: RegistrationRequest):
    if not EMAIL_USER or not EMAIL_PASS or not NOTIFY_EMAIL:
        return

    msg = EmailMessage()
    msg["Subject"] = f"New Registration — {data.full_name}"
    msg["From"] = EMAIL_USER
    msg["To"] = NOTIFY_EMAIL

    body = f"""
New member registration:

  Name:            {data.full_name}
  Student ID:      {data.student_id}
  Email:           {data.email}
  Year:            {data.year}
  Program:         {data.program}
  DOB:             {data.dob}
  Division Type:   {data.division_type}
  Division Name:   {data.division_name}

Explanation:
{data.explanation}
"""
    msg.set_content(body.strip())

    with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as smtp:
        smtp.starttls()
        smtp.login(EMAIL_USER, EMAIL_PASS)
        smtp.send_message(msg)
