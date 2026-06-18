from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import json

router = APIRouter(prefix="/api/events", tags=["events"])

def load_events():
    with open('data/events.json') as file:
        return json.load(file)

@router.get("")
def get_events():
    data = load_events()
    return JSONResponse(content=data["events"])

@router.get("/{event_id}")
def get_event(event_id: int):
    data = load_events()
    events = data["events"]
    index = event_id - 1
    if index < 0 or index >= len(events):
        raise HTTPException(status_code=404, detail="Event not found")
    return JSONResponse(content=events[index])
