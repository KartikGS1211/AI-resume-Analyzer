import os
from flask import Flask, request, jsonify, render_template
from PyPDF2 import PdfReader
import docx2txt
import google.generativeai as genai
from dotenv import load_dotenv
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)


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

    # Try to extract clean JSON
    import json, re
    text_response = response.text.strip()
    json_match = re.search(r'\{.*\}', text_response, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group())
        except json.JSONDecodeError:
            pass

    # Fallback if model didn’t strictly follow JSON format
    return {
        "ats_score": None,
        "feedback": text_response,
        "analysis": "Could not parse JSON, returning raw output."
    }


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/analyze', methods=['POST'])
def analyze_resume():
    if 'resume' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['resume']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save file
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    # Extract text
    resume_text = extract_text_from_resume(file_path)
    if not resume_text.strip():
        return jsonify({"error": "Could not extract text from resume"}), 400

    # Analyze using Gemini
    result = analyze_resume_with_gemini(resume_text)
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
