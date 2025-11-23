'use client';

import { useState } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface DocumentUploadProps {
  onFileProcessed: (text: string, fileName: string) => void;
}

export default function DocumentUpload({ onFileProcessed }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    
    // Validate file type and size
    const fileName = file.name.toLowerCase();
    const allowedExtensions = ['.pdf', '.docx', '.txt', '.md'];
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      setError('Please upload a PDF, DOCX, TXT, or MD file only');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to process file');
      }

      const { text, fileName } = await response.json();
      onFileProcessed(text, fileName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isProcessing) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!isProcessing) {
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }
        }}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Processing document...</p>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Drag & drop your document here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              or click to browse
            </p>
            <input
              type="file"
              accept=".pdf,.docx,.txt,.md"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
              className="hidden"
              id="file-upload"
              disabled={isProcessing}
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Choose File
            </label>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
              Supports PDF, DOCX, TXT, and MD files (max 10MB)
            </p>
          </>
        )}
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}

