'use client';

import { useState } from 'react';
import { Scale, AlertTriangle, CheckCircle, Info, Loader2, AlertCircle } from 'lucide-react';

interface LegalIssue {
  severity: 'critical' | 'warning' | 'info';
  category: string;
  description: string;
  relevantLaw?: string;
  recommendation?: string;
}

interface LegalComplianceProps {
  documentText: string;
}

interface ComplianceResult {
  overallCompliance: 'compliant' | 'non-compliant' | 'needs-review';
  issues: LegalIssue[];
  summary: string;
  applicableLaws: string[];
}

export default function LegalCompliance({ documentText }: LegalComplianceProps) {
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkCompliance = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/legal-compliance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: documentText }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to check compliance');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check compliance');
    } finally {
      setIsLoading(false);
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600 dark:text-green-400';
      case 'non-compliant':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  const getComplianceBg = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'non-compliant':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Swiss Legal Compliance</h2>
        </div>
        {!result && !isLoading && (
          <button
            onClick={checkCompliance}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
          >
            Check Compliance
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Analyzing document against Swiss laws...</span>
        </div>
      )}

      {error && (
        <div className="p-4 m-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {result && (
        <div className="p-6 space-y-6">
          {/* Overall Status */}
          <div className={`p-4 rounded-lg border ${getComplianceBg(result.overallCompliance)}`}>
            <div className="flex items-center gap-3 mb-2">
              {result.overallCompliance === 'compliant' ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              )}
              <h3 className={`text-lg font-semibold ${getComplianceColor(result.overallCompliance)}`}>
                Status: {result.overallCompliance.charAt(0).toUpperCase() + result.overallCompliance.slice(1).replace('-', ' ')}
              </h3>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{result.summary}</p>
          </div>

          {/* Applicable Laws */}
          {result.applicableLaws.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Applicable Swiss Laws:</h3>
              <div className="flex flex-wrap gap-2">
                {result.applicableLaws.map((law, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                  >
                    {law}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Issues */}
          {result.issues.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Issues Found ({result.issues.length}):
              </h3>
              <div className="space-y-3">
                {result.issues.map((issue, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(issue.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityBadge(issue.severity)}`}>
                            {issue.severity.toUpperCase()}
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {issue.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{issue.description}</p>
                        {issue.relevantLaw && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            <strong>Relevant Law:</strong> {issue.relevantLaw}
                          </p>
                        )}
                        {issue.recommendation && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                            <strong>Recommendation:</strong> {issue.recommendation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.issues.length === 0 && result.overallCompliance === 'compliant' && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No compliance issues found. Document appears compliant with Swiss laws.</p>
            </div>
          )}

          <button
            onClick={checkCompliance}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
          >
            Re-check Compliance
          </button>
        </div>
      )}

      {!result && !isLoading && (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          <p className="mb-2">Check your document against Swiss legal requirements</p>
          <p className="text-sm">Analyzes compliance with data protection, employment law, contracts, and more</p>
        </div>
      )}
    </div>
  );
}

