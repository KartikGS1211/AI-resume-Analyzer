# AI Resume Analyzer

AI Resume Analyzer is a modern web application designed to help job seekers optimize their resumes using Artificial Intelligence. Built with React and Flask, the app provides detailed feedback, ATS scoring, skill gap analysis, and personalized job recommendations.

---

## 🚀 Features

- 📊 **Interactive Dashboard:** Get a comprehensive overview of your resume performance, complete with skill gap analysis, historical charts, and scores.
- 📄 **Smart Resume Upload & Parsing:** Support for PDF and DOCX formats. Automatically extracts text and processes it for evaluation.
- 🤖 **AI-Powered Analysis:** Leverages Google's Gemini AI (Gemini 2.5 Flash) to provide actionable feedback, calculate an ATS score out of 100, and deliver comprehensive resume analysis.
- 🧳 **Job Recommendations:** Integrated with RapidAPI (JSearch) to fetch real-time job listings matching your role and location directly within the application.
- 🕒 **History Tracking:** Maintain a log of previous resume analyses to monitor improvements over time.
- 🔐 **Admin Dashboard:** Access an admin interface to manage job roles, keywords, and view user analytics and common skill gaps.
- 🌗 **Dark Mode Support:** Seamlessly toggle between light and dark themes for a comfortable user experience.

---

## 💻 Tech Stack

### Frontend
- **Framework:** React 18 (TypeScript), Vite
- **Styling:** Tailwind CSS, Radix UI Primitives
- **Animations & Charts:** Framer Motion, Recharts
- **HTTP Client:** Axios

### Backend
- **Framework:** Flask (Python)
- **AI Integration:** Google Generative AI (Gemini API)
- **Job Search API:** JSearch (via RapidAPI)
- **File Parsing:** PyPDF2 (PDF parsing), docx2txt (DOCX parsing)

---

## 🛠️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (v3.8 or higher)
- Gemini API Key (Get it from [Google AI Studio](https://aistudio.google.com/))
- RapidAPI Key (Get it from [JSearch API on RapidAPI](https://rapidapi.com/letscrape-6bRBa3QG1q/api/jsearch))

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment (optional but recommended):**
   - Windows:
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   - macOS / Linux:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install the Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Add your Environment Variables:**
   Create a `.env` file in the `backend` directory and add the following keys:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   RAPIDAPI_KEY=your_rapidapi_key
   ```

5. **Run the Flask server:**
   ```bash
   python app.py
   ```
   *The server will start at http://127.0.0.1:5000*

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install the Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   *The React application will be accessible at http://localhost:5173 (or the port specified by Vite).*

---

## 📂 Project Structure

```text
├── backend/
│   ├── app.py              # Main Flask application and API routes
│   ├── requirements.txt    # Python dependencies
│   ├── uploads/            # Temporary storage for uploaded resumes
│   └── .env                # API keys and environment variables
└── frontend/
    ├── src/
    │   ├── components/     # React UI components (Dashboard, Upload, History, Jobs)
    │   ├── lib/            # Utilities and mock data
    │   ├── styles/         # Global styles
    │   ├── App.tsx         # Main React application logic
    │   └── main.tsx        # React entry point
    ├── package.json        # Node.js dependencies
    └── tailwind.config.js  # Tailwind configuration
```

---

## 📝 Usage Workflow

1. Ensure both the Flask backend and the React frontend development servers are running.
2. Open the application in your browser.
3. Navigate to **Upload Resume** to submit your `.pdf` or `.docx` resume and enter your target job role.
4. Wait for the Gemini AI to process and evaluate your submission.
5. Review the detailed feedback, ATS score, and identified missing skills in the **Feedback** section.
6. Check **Job Recommendations** to discover real-time job openings tailored to your targeted role.
