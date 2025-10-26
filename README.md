# AI Resume Analyzer

AI Resume Analyzer is a web application that leverages AI to analyze resumes, provide detailed feedback, and help users improve their resumes to land their dream job. The system evaluates resumes, identifies skill gaps, scores the resume, and suggests actionable improvements.

---

## Features

- **Dashboard Overview**
  - View total resumes analyzed
  - Average resume score
  - Number of missing skills from the latest analysis

- **Resume Upload**
  - Upload new resumes in PDF format for analysis
  - Receive AI-powered feedback

- **Feedback & Analysis**
  - Resume scoring out of 100
  - Identify top missing skills
  - Track historical resume analyses

- **History**
  - View previously analyzed resumes and their scores
  - Keep track of improvements over time

- **Admin Panel**
  - Manage users and resumes
  - Monitor system performance

- **Dark Mode**
  - Toggle between light and dark themes for a comfortable user experience

---

## Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Flask (Python)
- **Database:** MongoDB
- **AI Integration:** OpenAI GPT API (or similar AI model)
- **Other Tools:** PDF parsing libraries (pdfplumber or PyPDF2)

---

## Installation

### Prerequisites

- Python 3.10+
- Node.js 18+
- MongoDB (local or cloud)
- OpenAI API key

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/AI-Resume-Analyzer.git
cd AI-Resume-Analyzer/backend
