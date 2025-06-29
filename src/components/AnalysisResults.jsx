import React from 'react';
import { 
  FiPercent, 
  FiList, 
  FiEdit2, 
  FiThumbsUp, 
  FiThumbsDown, 
  FiAward,
  FiPieChart,
  FiBarChart2,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiEdit,
  FiBriefcase,
  FiBook,
  FiHash
} from 'react-icons/fi';

const AnalysisResults = ({ analysis, loading, hasData }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 h-full flex flex-col items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!analysis || !hasData) {
    return (
      <div className="bg-white rounded-lg p-6 h-full flex flex-col items-center justify-center text-center">
        <div className="bg-indigo-50 p-5 rounded-full mb-5">
          <FiAward className="text-3xl text-indigo-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Resume Analysis</h3>
        <p className="text-gray-500 max-w-xs">
          Upload your resume and job description to see detailed matching analysis and improvement suggestions
        </p>
      </div>
    );
  }

  const missingKeywords = Array.isArray(analysis.missingKeywords) 
    ? analysis.missingKeywords 
    : (typeof analysis.missingKeywords === 'string' 
        ? analysis.missingKeywords.split(',') 
        : []);

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50';
    if (percentage >= 60) return 'text-blue-600 bg-blue-50';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getMatchLabel = (percentage) => {
    if (percentage >= 80) return 'Excellent match!';
    if (percentage >= 60) return 'Good match';
    if (percentage >= 40) return 'Partial match';
    return 'Low match';
  };

  const getATSScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    return 'text-red-600 bg-red-50';
  };

  const getATSStatus = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-6">
      {/* Match Percentage Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-start">
          <div className={`p-3 rounded-lg mr-4 ${getMatchColor(analysis.matchPercentage)}`}>
            <FiPercent className="text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Match Percentage</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold text-gray-800">
                {analysis.matchPercentage}%
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchColor(analysis.matchPercentage)}`}>
                {getMatchLabel(analysis.matchPercentage)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
              <div 
                className={`h-2.5 rounded-full ${getMatchColor(analysis.matchPercentage).replace('text', 'bg').replace('bg', 'bg')}`}
                style={{ width: `${analysis.matchPercentage}%` }}
              ></div>
            </div>
            {analysis.summary && (
              <p className="text-sm text-gray-600 mt-2">{analysis.summary}</p>
            )}
          </div>
        </div>
      </div>

      {/* Score Breakdown Card */}
      {analysis.scoreBreakdown && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center mb-4">
            <FiPieChart className="text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">Score Breakdown</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(analysis.scoreBreakdown).map(([category, score]) => (
              <div key={category} className="flex items-center">
                <div className="mr-3">
                  {category === 'skills' && <FiAward className="text-blue-500" />}
                  {category === 'experience' && <FiBriefcase className="text-green-500" />}
                  {category === 'education' && <FiBook className="text-purple-500" />}
                  {category === 'keywords' && <FiHash className="text-yellow-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-gray-700">{category}</span>
                    <span className="font-medium">{score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${score}%`,
                        backgroundColor: 
                          score > 75 ? '#10B981' : 
                          score > 50 ? '#3B82F6' : 
                          '#EF4444'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ATS Compatibility Card */}
      {analysis.atsScore && (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
    <div className="flex items-center mb-4">
      <div className={`p-2 rounded-lg mr-3 ${getATSScoreColor(analysis.atsScore)}`}>
        <span className="font-bold">{analysis.atsScore}</span>/100
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-800">ATS Compatibility</h3>
        <p className="text-sm text-gray-500">{getATSStatus(analysis.atsScore)} - {analysis.atsScore >= 60 ? 'Likely to pass screening' : 'May have issues with scanners'}</p>
      </div>
    </div>

    <div className="space-y-3 mt-4">
      <h4 className="text-sm font-medium text-gray-700">
        {analysis.atsScore >= 80 ? 'Your resume is ATS-friendly!' : 
         analysis.atsScore >= 60 ? 'Your resume is mostly ATS-friendly' : 
         'Key areas to improve for ATS'}
      </h4>
      
      {/* Dynamic feedback based on score */}
      {analysis.atsScore < 80 && (
        <div className="space-y-3">
          {/* Missing standard sections */}
          {analysis.missingATSHeadings?.length > 0 && (
            <div className="flex items-start p-3 bg-red-50 rounded-lg">
              <FiAlertCircle className="text-red-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Missing Standard Sections</p>
                <p className="text-sm text-gray-600">
                  Add these standard sections: {analysis.missingATSHeadings.join(', ')}
                </p>
              </div>
            </div>
          )}

          {/* Keyword optimization */}
          {analysis.missingKeywords?.length > 0 && (
            <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
              <FiInfo className="text-yellow-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Keyword Optimization</p>
                <p className="text-sm text-gray-600">
                  Include more of these keywords: {analysis.missingKeywords.slice(0, 5).join(', ')}
                  {analysis.missingKeywords.length > 5 && ` (and ${analysis.missingKeywords.length - 5} more)`}
                </p>
              </div>
            </div>
          )}

          {/* Formatting issues */}
          {analysis.atsFormattingIssues?.length > 0 && (
            <div className="flex items-start p-3 bg-blue-50 rounded-lg">
              <FiAlertCircle className="text-blue-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Formatting Issues</p>
                <p className="text-sm text-gray-600">
                  {analysis.atsFormattingIssues.join('. ')}
                </p>
              </div>
            </div>
          )}

          {/* What's working well */}
          {analysis.atsStrengths?.length > 0 && (
            <div className="flex items-start p-3 bg-green-50 rounded-lg">
              <FiCheckCircle className="text-green-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Working Well</p>
                <p className="text-sm text-gray-600">
                  {analysis.atsStrengths.join('. ')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
)}

      {/* Strengths Card */}
      {analysis.strengths && analysis.strengths.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-start">
            <div className="bg-green-50 p-3 rounded-lg mr-4 text-green-600">
              <FiThumbsUp className="text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Your Strengths</h3>
              <ul className="space-y-2">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">✓</span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Missing Keywords Card */}
      {missingKeywords.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-start">
            <div className="bg-yellow-50 p-3 rounded-lg mr-4 text-yellow-600">
              <FiList className="text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Missing Keywords</h3>
              <p className="text-sm text-gray-600 mb-3">
                These important keywords from the job description were not found in your resume:
              </p>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((keyword, index) => (
                  <span 
                    key={index} 
                    className="bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full text-xs font-medium"
                  >
                    {keyword.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weaknesses Card */}
      {analysis.weaknesses && analysis.weaknesses.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-start">
            <div className="bg-red-50 p-3 rounded-lg mr-4 text-red-600">
              <FiThumbsDown className="text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Areas for Improvement</h3>
              <ul className="space-y-2">
                {analysis.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2 mt-0.5">!</span>
                    <span className="text-gray-700">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Key Changes Card */}
      {analysis.keyChanges && analysis.keyChanges.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-start">
            <div className="bg-blue-50 p-3 rounded-lg mr-4 text-blue-600">
              <FiEdit2 className="text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Recommended Changes</h3>
              <ul className="space-y-3">
                {analysis.keyChanges.map((change, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3 mt-0.5">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-gray-700">{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;