import google.generativeai as genai
print([x for x in dir(genai) if 'Image' in x or 'gen' in x])
