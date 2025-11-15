'use client';

import { ResearchResult } from '@/lib/types';

interface ResearchResultsProps {
  result: ResearchResult;
}

export default function ResearchResults({ result }: ResearchResultsProps) {
  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  const getAgentBadge = (agentType: string) => {
    return agentType === 'anthropic'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-indigo-100 text-indigo-800';
  };

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${result.companyName.replace(/\s+/g, '_')}_research.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{result.companyName}</h1>
            <a
              href={result.companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {result.companyWebsite}
            </a>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(result.status)}`}>
              {result.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAgentBadge(result.agentType)}`}>
              {result.agentType}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
          <div>
            <span className="font-medium">Started:</span>{' '}
            {new Date(result.createdAt).toLocaleString()}
          </div>
          {result.completedAt && (
            <div>
              <span className="font-medium">Completed:</span>{' '}
              {new Date(result.completedAt).toLocaleString()}
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={exportAsJSON}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm transition-colors"
          >
            Export as JSON
          </button>
        </div>
      </div>

      {result.status === 'in-progress' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-3">Research in Progress...</h3>
          <div className="space-y-2">
            {result.researchSteps.map((step, index) => (
              <div key={index} className="text-sm">
                <span className="font-medium">{step.step}:</span> {step.result}
              </div>
            ))}
          </div>
        </div>
      )}

      {result.status === 'failed' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-red-800 mb-2">Research Failed</h3>
          <p className="text-red-700">{result.error || 'Unknown error occurred'}</p>
        </div>
      )}

      {result.status === 'completed' && result.research && (
        <div className="space-y-6">
          {/* Current Initiatives */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Current AI Initiatives</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{result.research.currentInitiatives}</p>
          </div>

          {/* 5-Year Plan */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">5-Year AI Roadmap</h2>
            <div className="space-y-4">
              {Object.entries(result.research.yearPlans).map(([year, plan]) => (
                <div key={year} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Year {year.replace('year', '')}
                  </h3>
                  <p className="text-gray-700">{plan}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Stack */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
            {result.research.technologyStack.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {result.research.technologyStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No technology stack information available</p>
            )}
          </div>

          {/* Partnerships */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Partnerships & Collaborations</h2>
            {result.research.partnerships.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {result.research.partnerships.map((partnership, index) => (
                  <li key={index} className="text-gray-700">
                    {partnership}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No partnership information available</p>
            )}
          </div>

          {/* Market Position */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Market Position in AI</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{result.research.marketPosition}</p>
          </div>

          {/* Research Steps */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Research Process</h2>
            <div className="space-y-3">
              {result.researchSteps.map((step, index) => (
                <div key={index} className="border-l-2 border-gray-300 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{step.step}</p>
                      <p className="text-sm text-gray-600">{step.result}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
