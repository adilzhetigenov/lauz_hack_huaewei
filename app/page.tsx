'use client';

import { useState } from 'react';
import { Sparkles, FileText } from 'lucide-react';
import DocumentUpload from './components/DocumentUpload';
import SummaryCard from './components/SummaryCard';
import QAChat from './components/QAChat';
import InsightsPanel from './components/InsightsPanel';
import LegalCompliance from './components/LegalCompliance';

export default function Home() {
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileProcessed = (text: string, name: string) => {
    setDocumentText(text);
    setFileName(name);
  };

  const handleReset = () => {
    setDocumentText(null);
    setFileName('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Barakcha</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">AI Document Intelligence</p>
              </div>
            </div>
            {documentText && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <FileText className="h-4 w-4" />
                  <span className="max-w-xs truncate">{fileName}</span>
                </div>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  New Document
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!documentText ? (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                See Your Documents in a New Light
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Upload any document and get instant AI-powered summaries, interactive Q&A, intelligent insights, and Swiss legal compliance checking
              </p>
            </div>
            <DocumentUpload onFileProcessed={handleFileProcessed} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Section */}
            <SummaryCard documentText={documentText} />

            {/* Legal Compliance Section */}
            <LegalCompliance documentText={documentText} />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Q&A Chat */}
              <QAChat documentText={documentText} />

              {/* Insights Panel */}
              <InsightsPanel documentText={documentText} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Built for GenAI Hackathon • Powered by Google Gemini
          </p>
        </div>
      </footer>
    </div>
  );
}

