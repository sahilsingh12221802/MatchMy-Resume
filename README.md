# MatchMy Resume - AI-Powered Resume Analysis Tool

MatchMy Resume is a web application that analyzes your resume against a job description using AI (Google Gemini) to provide detailed matching insights, improvement suggestions, and ATS compatibility scores.

## Features

- **Resume Analysis**: Get a percentage match between your resume and job description
- **Section-wise Breakdown**: Scores for skills, experience, education, and keywords
- **ATS Compatibility**: Check how well your resume will perform with Applicant Tracking Systems
- **Missing Keywords**: Identify important keywords from the job description missing in your resume
- **Improvement Suggestions**: Get actionable feedback to strengthen your resume
- **PDF Processing**: Directly upload and extract text from PDF resumes
- **Interactive Editor**: Apply suggested changes directly to your resume text

## Technologies Used

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini API
- **PDF Processing**: pdfjs-dist, pdf-lib
- **File Upload**: react-dropzone
- **Linting**: ESLint with React plugins
- **Icons**: react-icons

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/matchmy-resume.git
   cd matchmy-resume
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file in the root directory with your Gemini API key:
   ```bash
   VITE_GEMINI_API_KEY=your-api-key-here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
