import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

print(f"Token: {os.environ.get('HF_TOKEN')[:5]}...")

try:
    client = InferenceClient(
        provider="nebius",
        api_key=os.environ["HF_TOKEN"],
    )

    print("Generating image...")
    # output is a PIL.Image object
    image = client.text_to_image(
        "Astronaut riding a horse",
        model="black-forest-labs/FLUX.1-dev",
    )
    
    output_path = "static/test_flux_real.png"
    image.save(output_path)
    print(f"Success! Saved to {output_path}")

except Exception as e:
    print(f"Error: {e}")
