import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from 'react';
import AnalysisResults from './components/AnalysisResults';
import FileUpload from './components/FileUpload';

const App = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [originalResumeText, setOriginalResumeText] = useState('');

  const extractJSON = (text) => {
    try {
      let cleanText = text
        .replace(/```/g, '')
        .replace(/json\s*{/i, '{')
        .trim();
      
      const jsonStart = cleanText.indexOf('{');
      const jsonEnd = cleanText.lastIndexOf('}') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error("No JSON found in response");
      }
      
      const jsonString = cleanText.substring(jsonStart, jsonEnd);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("JSON extraction error:", error);
      throw new Error(`Failed to parse JSON: ${error.message}`);
    }
  };

  const analyzeResume = async () => {
    if (!resumeText || !jobDescription) return;
    
    setLoading(true);
    setAnalysis(null);
    setApiError('');
    setOriginalResumeText(resumeText); // Store the original resume text
    
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.1,
          topP: 0.95,
          maxOutputTokens: 2000
        }
      });

      const prompt = `Analyze this resume against the job description with:
1. Exact match percentage (0-100)
2. Score breakdown by section (skills, experience, education, keywords)
3. ATS compatibility score (0-100)
4. Missing keywords
5. Specific improvement suggestions for each weak section
6. Overall summary

Return ONLY valid JSON format:
{
  "matchPercentage": number,
  "scoreBreakdown": {
    "skills": number,
    "experience": number,
    "education": number,
    "keywords": number
  },
  "atsScore": number,
  "missingKeywords": [string],
  "sectionFeedback": {
    "skills": [string],
    "experience": [string],
    "education": [string]
  },
  "strengths": [string],
  "weaknesses": [string],
  "keyChanges": [string],
  "summary": string
}

Resume: ${resumeText.substring(0, 10000)}
Job Description: ${jobDescription.substring(0, 5000)}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const parsed = extractJSON(text);
      
      if (typeof parsed.matchPercentage !== 'number' || 
          !Array.isArray(parsed.missingKeywords)) {
        throw new Error("Invalid analysis format received");
      }
      
      // Ensure all fields exist
      parsed.scoreBreakdown = parsed.scoreBreakdown || {
        skills: 0,
        experience: 0,
        education: 0,
        keywords: 0
      };
      parsed.atsScore = parsed.atsScore || 0;
      parsed.sectionFeedback = parsed.sectionFeedback || {
        skills: [],
        experience: [],
        education: []
      };
      parsed.keyChanges = parsed.keyChanges || [];
      parsed.strengths = parsed.strengths || [];
      parsed.weaknesses = parsed.weaknesses || [];
      parsed.summary = parsed.summary || "No summary available";
      
      setAnalysis(parsed);
    } catch (error) {
      console.error("Analysis error:", error);
      setApiError(`Analysis failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm py-4 sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="ml-2 text-2xl font-bold text-gray-800">MatchMy Resume</h1>
          </div>
          <div className="text-sm px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full font-medium flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
            Powered by AI
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Analysis Error</p>
              <p className="text-sm mt-1">{apiError}</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Resume & Job Details</h2>
              <p className="text-sm text-gray-500 mb-6">Upload your resume and paste the job description to analyze</p>
              
              <div className="mb-8">
                <FileUpload 
                  onTextExtracted={(text) => {
                    setResumeText(text);
                    setOriginalResumeText(text);
                  }} 
                  text={resumeText}
                />
              </div>
              
              <div>
                <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  id="job-description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                  rows={6}
                />
              </div>
              
              <button
                onClick={analyzeResume}
                disabled={loading || !resumeText || !jobDescription}
                className={`mt-8 w-full py-3.5 rounded-lg transition-all duration-200
                  ${(loading || !resumeText || !jobDescription) 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg'}
                  flex items-center justify-center font-medium`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Analyze Match
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Analysis Results</h2>
              <p className="text-sm text-gray-500 mb-6">
                {analysis ? "Detailed match analysis" : "Results will appear here after analysis"}
              </p>
              
              <AnalysisResults 
                analysis={analysis} 
                loading={loading} 
                hasData={!!resumeText && !!jobDescription}
                originalText={originalResumeText}
              />
            </div>
          </div>
        </div>
        
        {!analysis && !loading && (
          <div className="mt-12 text-center">
            <div className="inline-block p-5 bg-indigo-50 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700">Ready to Analyze Your Resume</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              Upload your resume and paste the job description to get detailed matching analysis and improvement suggestions
            </p>
          </div>
        )}
      </main>
      
      <footer className="py-8 mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="ml-2 text-lg font-semibold text-gray-800">MatchMy Resume</span>
            </div>
            <div className="mt-4 md:mt-0 text-center md:text-right text-sm text-gray-500">
              <p>© {new Date().getFullYear()} MatchMy Resume. All rights reserved.</p>
              <p className="mt-1">AI-powered resume analysis and optimization</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;