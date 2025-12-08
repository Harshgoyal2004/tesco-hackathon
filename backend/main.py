from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.routers import creative
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="CreativePilot AI API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for hackathon
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for serving generated images
app.mount("/static", StaticFiles(directory="static"), name="static")

# Routers
from app.routers import creative
app.include_router(creative.router, prefix="/api/creative", tags=["creative"])

@app.get("/")
async def root():
    return {"message": "CreativePilot AI Backend Running"}
