import asyncio
import os
from dotenv import load_dotenv
from app.services.image_processing import generate_background

load_dotenv()

async def main():
    prompt = "A futuristic retail store with neon lights, photorealistic, 8k"
    output_path = "static/generated/test_flux.png"
    
    print(f"Testing Flux generation with prompt: '{prompt}'")
    print(f"HF Token present: {'Yes' if os.environ.get('HF_TOKEN') else 'No'}")
    
    try:
        result_path = await generate_background(prompt, output_path)
        print(f"Success! Image saved to: {result_path}")
    except Exception as e:
        print(f"Generation failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())
