from rembg import remove
from PIL import Image
import io
import os

async def remove_background(input_path: str, output_path: str):
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input file not found: {input_path}")
        
    with open(input_path, 'rb') as i:
        input_data = i.read()
        output_data = remove(input_data)
        
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'wb') as o:
        o.write(output_data)

from google import generativeai as genai
import requests

from huggingface_hub import InferenceClient

import asyncio

async def generate_background(prompt: str, output_path: str):
    try:
        hf_token = os.environ.get("HF_TOKEN")
        if not hf_token:
            raise ValueError("HF_TOKEN not found in environment variables")

        client = InferenceClient(
            provider="wavespeed",
            api_key=hf_token,
        )

        # Run sync call in thread to avoid blocking event loop
        image = await asyncio.to_thread(
            client.text_to_image,
            prompt,
            model="black-forest-labs/FLUX.1-dev"
        )
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        image.save(output_path)
            
        return output_path

    except Exception as e:
        print(f"Flux generation failed: {e}")
        raise e

    except Exception as e:
        print(f"Flux generation failed: {e}")
        raise e

async def generate_creative():
    pass
