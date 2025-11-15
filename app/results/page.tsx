'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResearchResult, AgentType, ResearchStatus } from '@/lib/types';

export default function ResultsListPage() {
  const router = useRouter();
  const [results, setResults] = useState<ResearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterAgentType, setFilterAgentType] = useState<AgentType | ''>('');
  const [filterStatus, setFilterStatus] = useState<ResearchStatus | ''>('');

  useEffect(() => {
    fetchResults();
  }, [filterAgentType, filterStatus]);

  const fetchResults = async () => {
    try {
      const params = new URLSearchParams();
      if (filterAgentType) params.append('agentType', filterAgentType);
      if (filterStatus) params.append('status', filterStatus);

      const response = await fetch(`/api/results/list?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }
      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Research Results</h1>

        <div className="flex gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Agent Type
            </label>
            <select
              value={filterAgentType}
              onChange={(e) => setFilterAgentType(e.target.value as AgentType | '')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="anthropic">Anthropic SDK</option>
              <option value="langchain">LangChain/LangGraph</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ResearchStatus | '')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">{error}</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No research results found</p>
          <button
            onClick={() => router.push('/research')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Start New Research
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Website
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Agent Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.map((result) => (
                <tr key={result._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {result.companyName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <a
                      href={result.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {result.companyWebsite}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="capitalize">{result.agentType}</span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(result.status)}`}>
                      {result.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(result.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => router.push(`/results/${result._id}`)}
                      className="text-blue-500 hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
