import os
import re
import json
import requests
from flask import Flask, request, jsonify, render_template
from PyPDF2 import PdfReader
import docx2txt
import google.generativeai as genai
from dotenv import load_dotenv
from flask_cors import CORS

# ==========================
# 🌟 Flask App Setup
# ==========================
app = Flask(__name__)
CORS(app)
load_dotenv()

app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# ==========================
# 🤖 Gemini Configuration
# ==========================
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# ==========================
# 🔑 RapidAPI Configuration
# ==========================
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")

if not RAPIDAPI_KEY:
    print("⚠️ RAPIDAPI_KEY not found in environment variables! Check your .env file.")
else:
    print("✅ RAPIDAPI_KEY loaded successfully!")

# ==========================
# 📄 Resume Text Extraction
# ==========================
def extract_text_from_resume(file_path):
    """Extract text from PDF or DOCX."""
    if file_path.endswith('.pdf'):
        text = ""
        reader = PdfReader(file_path)
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    elif file_path.endswith('.docx'):
        return docx2txt.process(file_path)
    else:
        return ""

# ==========================
# 🧠 Analyze Resume with Gemini
# ==========================
def analyze_resume_with_gemini(resume_text):
    """Send resume text to Gemini and get ATS score, feedback, and analysis."""
    prompt = f"""
    You are an expert resume evaluator and ATS system.

    Analyze the following resume and return a JSON response strictly in this format:
    {{
      "ats_score": (integer between 0 and 100),
      "feedback": "constructive feedback on resume quality, formatting, and clarity",
      "analysis": "analysis focusing on keyword optimization, skills match, and professional tone"
    }}

    Resume:
    {resume_text}
    """

    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(prompt)

    text_response = response.text.strip()
    json_match = re.search(r'\{.*\}', text_response, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group())
        except json.JSONDecodeError:
            pass

    return {
        "ats_score": None,
        "feedback": text_response,
        "analysis": "Could not parse JSON, returning raw output."
    }

# ==========================
# 🧩 Routes
# ==========================

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze_resume():
    if 'resume' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['resume']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    resume_text = extract_text_from_resume(file_path)
    if not resume_text.strip():
        return jsonify({"error": "Could not extract text from resume"}), 400

    result = analyze_resume_with_gemini(resume_text)
    return jsonify(result)

@app.route("/jobs", methods=["POST"])
def get_jobs():
    try:
        data = request.get_json(force=True)
        role = data.get("role", "").strip() or "Software Engineer"
        location = data.get("location", "").strip() or "India"

        print(f"📥 Received request for: Role='{role}', Location='{location}'")

        if not RAPIDAPI_KEY:
            return jsonify({"error": "Missing RapidAPI key"}), 500

        url = "https://jsearch.p.rapidapi.com/search"
        headers = {
            "x-rapidapi-key": RAPIDAPI_KEY,
            "x-rapidapi-host": "jsearch.p.rapidapi.com"
        }
        params = {
            "query": f"{role} jobs in {location}",
            "page": "1",
            "num_pages": "1",
            "country": "in",
            "date_posted": "all"
        }

        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        api_data = response.json()

        print(f"✅ API returned {len(api_data.get('data', []))} jobs")

        return jsonify({"data": api_data.get("data", [])}), 200

    except requests.exceptions.RequestException as e:
        print("❌ RapidAPI Request Error:", e)
        return jsonify({"error": "Failed to fetch jobs from RapidAPI"}), 500

    except Exception as e:
        print("❌ Server Error:", e)
        return jsonify({"error": str(e)}), 500

# ==========================
# 🚀 Run the Flask Server
# ==========================
if __name__ == '__main__':
    print("🚀 Flask backend running at http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
