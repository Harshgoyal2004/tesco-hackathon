import google.generativeai as genai
print(dir(genai))
try:
    print("GenerativeModel attributes:", dir(genai.GenerativeModel))
except:
    pass
