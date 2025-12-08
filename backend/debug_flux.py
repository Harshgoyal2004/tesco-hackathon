import asyncio
import os
from dotenv import load_dotenv
from app.services.image_processing import generate_background

load_dotenv()

async def main():
    try:
        print("Testing Flux generation...")
        output = await generate_background("sunset over mountains", "static/test_flux_debug.png")
        print(f"Success! Output at: {output}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
