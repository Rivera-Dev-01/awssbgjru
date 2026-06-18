from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import json

router = APIRouter(prefix="/api/members", tags=["members"])

def load_members():
    with open('data/members.json') as file:
        return json.load(file)

@router.get("")
def get_members():
    data = load_members()
    return JSONResponse(content=data["members"])

@router.get("/{member_id}")
def get_member(member_id: int):
    data = load_members()
    members = data["members"]
    index = member_id - 1
    if index < 0 or index >= len(members):
        raise HTTPException(status_code=404, detail="Member not found")
    return JSONResponse(content=members[index])