import React, { useState } from 'react';
import { FiEdit, FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi';

const ResumeEditor = ({ originalText, sectionFeedback }) => {
  const [text, setText] = useState(originalText);
  const [activeSuggestion, setActiveSuggestion] = useState(null);
  const [appliedSuggestions, setAppliedSuggestions] = useState([]);

  const applySuggestion = (suggestion) => {
    // Simple implementation - in production you'd want more sophisticated text replacement
    const newText = text.replace(suggestion.fromText, suggestion.toText);
    setText(newText);
    setAppliedSuggestions([...appliedSuggestions, suggestion.id]);
    setActiveSuggestion(null);
  };

  // Convert section feedback to suggestions
  const allSuggestions = [];
  Object.entries(sectionFeedback).forEach(([section, feedbacks]) => {
    feedbacks.forEach((feedback, index) => {
      // This is simplified - you'd want proper NLP to identify text ranges
      const fromText = feedback.match(/"(.*?)"/)?.[1] || feedback.split('→')[0]?.trim();
      const toText = feedback.match(/→ "(.*?)"/)?.[1] || feedback.split('→')[1]?.trim();
      
      if (fromText && toText) {
        allSuggestions.push({
          id: `${section}-${index}`,
          section,
          fromText,
          toText,
          feedback
        });
      }
    });
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <FiEdit className="text-gray-500 mr-2" />
        <h3 className="text-lg font-medium text-gray-800">Interactive Resume Editor</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Editor Panel */}
        <div className="p-4 border-r border-gray-200">
          <div className="relative h-full">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-96 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
              placeholder="Your resume text..."
            />
            <div className="absolute bottom-4 right-4 text-xs text-gray-500">
              {text.length} characters
            </div>
          </div>
        </div>
        
        {/* Suggestions Panel */}
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Suggested Improvements</h4>
          
          {allSuggestions.length === 0 ? (
            <div className="flex items-center justify-center h-80 text-gray-400">
              No suggestions available
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {allSuggestions.map((suggestion) => (
                <div 
                  key={suggestion.id}
                  className={`p-3 rounded-lg border ${appliedSuggestions.includes(suggestion.id) 
                    ? 'border-green-200 bg-green-50' 
                    : activeSuggestion?.id === suggestion.id 
                      ? 'border-blue-200 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'}`}
                >
                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5">
                      {appliedSuggestions.includes(suggestion.id) 
                        ? <FiCheck className="text-green-500" /> 
                        : <FiAlertTriangle className="text-yellow-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 mb-1">
                        {suggestion.section.toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">{suggestion.feedback}</p>
                      {!appliedSuggestions.includes(suggestion.id) && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => applySuggestion(suggestion)}
                            className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Apply Change
                          </button>
                          <button
                            onClick={() => setActiveSuggestion(activeSuggestion?.id === suggestion.id ? null : suggestion)}
                            className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                          >
                            {activeSuggestion?.id === suggestion.id ? 'Hide' : 'Show'} in Text
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;