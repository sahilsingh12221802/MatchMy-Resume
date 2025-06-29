// FileUpload.jsx
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiX, FiCheck } from 'react-icons/fi';

const FileUpload = ({ onTextExtracted, text }) => {
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');
  const [pdfjs, setPdfjs] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadPdfjs = async () => {
      const pdfjsLib = await import('pdfjs-dist/build/pdf');
      const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;
      setPdfjs(pdfjsLib);
    };
    loadPdfjs();
  }, []);

  const extractText = async (file) => {
    if (!pdfjs) {
      setError("PDF library is still loading. Please try again.");
      return;
    }

    try {
      setError(null);
      setIsUploading(true);
      setFileName(file.name);
      
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let extractedText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        extractedText += textContent.items.map(item => item.str).join(' ') + '\n';
      }
      
      onTextExtracted(extractedText);
    } catch (err) {
      console.error("PDF parsing error:", err);
      setError("Failed to parse PDF. Please try a different file.");
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0 && acceptedFiles[0].type === 'application/pdf') {
      extractText(acceptedFiles[0]);
    } else {
      setError("Please upload a valid PDF file (max 5MB)");
    }
  }, [pdfjs]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB limit
  });

  const clearFile = (e) => {
    e.stopPropagation();
    onTextExtracted('');
    setFileName('');
    setError(null);
  };

  return (
    <div>
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}
          ${error ? 'border-red-300 bg-red-50' : ''}
          ${isUploading ? 'opacity-70' : ''}`}
      >
        <input {...getInputProps()} disabled={isUploading} />
        <div className="flex flex-col items-center justify-center">
          <FiUpload className={`mx-auto text-3xl mb-3 ${isDragActive ? 'text-indigo-500' : 'text-gray-400'}`} />
          <p className={`text-sm mb-1 ${isDragActive ? 'text-indigo-600' : 'text-gray-600'}`}>
            {isUploading 
              ? 'Processing your resume...' 
              : isDragActive 
                ? 'Drop your PDF here' 
                : 'Drag & drop a PDF file, or click to select'}
          </p>
          <p className="text-xs text-gray-500">Supports PDF files up to 5MB</p>
          
          {fileName && (
            <div className="mt-4 w-full max-w-xs bg-gray-50 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center truncate">
                <FiFile className="mr-2 text-gray-500 flex-shrink-0" />
                <span className="truncate text-sm text-gray-700">{fileName}</span>
              </div>
              <button 
                onClick={clearFile}
                className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0"
                aria-label="Remove file"
              >
                <FiX />
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <FiX className="mr-1.5 flex-shrink-0" /> {error}
        </p>
      )}

      {text && !error && (
        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200 flex items-center">
          <FiCheck className="text-green-500 mr-2 flex-shrink-0" />
          <span className="text-sm text-green-700">Resume processed successfully</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;