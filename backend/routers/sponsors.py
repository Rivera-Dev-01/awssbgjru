from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import json

router = APIRouter(prefix="/api/sponsors", tags=["sponsors"])

class Sponsor(BaseModel): 
    name: str
    website: str

def load_sponsors():
    with open('data/sponsors.json') as file:
        data = json.load(file)
        sponsors = data["sponsors"]
        return sponsors
    
def load_partners():
    with open('data/partners.json') as file:
        data = json.load(file)
        partners = data["partners"]
        return partners

@router.get("", response_model=List[Sponsor]) 
def get_sponsor():
    sponors = load_sponsors()
    partners = load_partners()
    data = sponors + partners
    return data

# @router.get("/partners", response_model=List[Sponsor]) 
# def get_partners():
#     data = load_partners()
#     return data