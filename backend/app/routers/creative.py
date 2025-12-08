from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Body
from pydantic import BaseModel
from app.models.creative import Creative, ComplianceReport, CreativeFormat
from app.services.validation_service import validation_service
from app.services.image_processing import generate_background as generate_bg_service
from typing import Dict, Any
import json
import os
import uuid

router = APIRouter()

# --- Validation ---

class ValidationRequest(BaseModel):
    creative: Dict[str, Any]
    brandKit: Dict[str, Any] = None

@router.post("/validate")
async def validate_creative(request: ValidationRequest):
    """
    Validate a creative against guidelines using the ValidationService.
    """
    return validation_service.validate_creative(request.creative, request.brandKit)

# --- Sharing ---

@router.post("/share")
async def share_creative(data: Dict[str, Any] = Body(...)):
    """
    Save creative JSON and return a unique ID.
    """
    share_id = str(uuid.uuid4())
    os.makedirs("data/creatives", exist_ok=True)
    
    with open(f"data/creatives/{share_id}.json", "w") as f:
        json.dump(data, f)
        
    return {"id": share_id, "url": f"/share/{share_id}"}

@router.get("/load/{share_id}")
async def load_creative(share_id: str):
    """
    Load creative JSON by ID.
    """
    try:
        with open(f"data/creatives/{share_id}.json", "r") as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Creative not found")

# --- Assets & AI ---

@router.post("/upload")
async def upload_asset(file: UploadFile = File(...)):
    """
    Upload an asset and save it to static directory.
    """
    import shutil
    
    file_location = f"static/{file.filename}"
    # Ensure static directory exists
    os.makedirs("static", exist_ok=True)
    
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
        
    return {"filename": file.filename, "url": f"/static/{file.filename}"}

@router.post("/generate-bg")
async def generate_background(prompt: str = Form(...)):
    """
    Generate a background image using the Flux service.
    """
    # Generate unique filename
    filename = f"ai_gen_{uuid.uuid4()}.png"
    output_path = f"static/{filename}"
    
    try:
        # Call the service (uses Flux via HF Inference Client)
        await generate_bg_service(prompt, output_path)
        
        return {
            "url": f"/static/{filename}", 
            "name": filename
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/remove-bg")
async def remove_background(image_url: str = Form(...)):
    """
    Remove background from an image (Stub).
    """
    # In a real app, this would call rembg
    # For now, return the original url or a transparent placeholder
    return {"url": image_url}

