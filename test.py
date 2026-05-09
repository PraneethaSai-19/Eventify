import google.generativeai as genai

genai.configure(api_key="AIzaSyA9Lyt1DXopbc5Pge9EELxDgMiW6JLd1m0")

model = genai.GenerativeModel("gemini-2.0-flash")

response = model.generate_content("Hello")

print(response.text)