from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers.members import router as members_router
from backend.routers.events import router as events_router
from backend.routers.sponsors import router as sponsors_router
from backend.routers.registration import router as registration_router

app = FastAPI(title="AWS Learning Club API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(members_router)
app.include_router(events_router)
app.include_router(sponsors_router)
app.include_router(registration_router)
