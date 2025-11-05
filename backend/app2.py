from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# ==========================
# 🌟 Flask App Setup
# ==========================
app = Flask(__name__)
CORS(app)  # Allow requests from React frontend
load_dotenv()

print("🔥 Starting backend...")

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")

if not RAPIDAPI_KEY:
    print("⚠️ RAPIDAPI_KEY not found in environment variables! Check your .env file.")
else:
    print("✅ RAPIDAPI_KEY loaded successfully!")


# ==========================
# 🔍 Job Search Endpoint
# ==========================
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

        # ✅ Send API request
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        api_data = response.json()

        print(f"✅ API returned {len(api_data.get('data', []))} jobs")

        # ✅ Return job data to frontend
        return jsonify({"data": api_data.get("data", [])}), 200

    except requests.exceptions.RequestException as e:
        print("❌ RapidAPI Request Error:", e)
        return jsonify({"error": "Failed to fetch jobs from RapidAPI"}), 500

    except Exception as e:
        print("❌ Server Error:", e)
        return jsonify({"error": str(e)}), 500


# ==========================
# 🚀 Run Server
# ==========================
if __name__ == "__main__":
    print("🚀 Flask backend running at http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
