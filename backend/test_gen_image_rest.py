import requests
import os
import json
from dotenv import load_dotenv

load_dotenv()

api_key = os.environ.get("GEMINI_API_KEY")
url = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key={api_key}"

headers = {
    "Content-Type": "application/json"
}

data = {
    "instances": [
        {"prompt": "A futuristic retail store with neon lights"}
    ],
    "parameters": {
        "sampleCount": 1
    }
}

print(f"Testing REST API: {url.split('?')[0]}...")
try:
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Success! Response received.")
        # print(response.json()) # Don't print full binary if it returns bytes
        # Usually it returns base64 encoded image
        result = response.json()
        if 'predictions' in result:
            print("Predictions found.")
        else:
            print("No predictions found:", result)
    else:
        print("Error:", response.text)
except Exception as e:
    print(f"Request failed: {e}")
