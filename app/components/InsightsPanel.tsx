'use client';

import { useState } from 'react';
import { Lightbulb, Calendar, Users, Building, CheckSquare, TrendingUp, Loader2 } from 'lucide-react';

interface Insights {
  dates: string[];
  people: string[];
  organizations: string[];
  actionItems: string[];
  keyStats: string[];
}

interface InsightsPanelProps {
  documentText: string;
}

export default function InsightsPanel({ documentText }: InsightsPanelProps) {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dates');

  const extractInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/extract-insights', {
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
        throw new Error(data.error || 'Failed to extract insights');
      }

      const data = await response.json();
      setInsights(data);
      setActiveTab('dates');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract insights');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'dates', label: 'Dates', icon: Calendar, count: insights?.dates.length || 0 },
    { id: 'people', label: 'People', icon: Users, count: insights?.people.length || 0 },
    { id: 'organizations', label: 'Organizations', icon: Building, count: insights?.organizations.length || 0 },
    { id: 'actionItems', label: 'Action Items', icon: CheckSquare, count: insights?.actionItems.length || 0 },
    { id: 'keyStats', label: 'Statistics', icon: TrendingUp, count: insights?.keyStats.length || 0 },
  ];

  const renderContent = () => {
    if (!insights) return null;

    const content = {
      dates: insights.dates,
      people: insights.people,
      organizations: insights.organizations,
      actionItems: insights.actionItems,
      keyStats: insights.keyStats,
    };

    const items = content[activeTab as keyof typeof content];

    if (items.length === 0) {
      return (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} found in this document.
        </div>
      );
    }

    return (
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            {item}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Key Insights</h2>
        </div>
        {!insights && !isLoading && (
          <button
            onClick={extractInsights}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium text-sm"
          >
            Extract Insights
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-yellow-600 animate-spin" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Extracting insights...</span>
        </div>
      )}

      {error && (
        <div className="p-4 m-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {insights && (
        <>
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-yellow-600 text-yellow-600 font-medium'
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="p-6 max-h-96 overflow-y-auto">{renderContent()}</div>
        </>
      )}
    </div>
  );
}

