'use client';

import { useState } from 'react';
import { AgentType } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function ResearchForm() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [agentType, setAgentType] = useState<AgentType>('anthropic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!companyName.trim()) {
      setError('Company name is required');
      return;
    }

    if (!companyWebsite.trim()) {
      setError('Company website is required');
      return;
    }

    if (!validateUrl(companyWebsite)) {
      setError('Please enter a valid website URL');
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint =
        agentType === 'anthropic'
          ? '/api/research/anthropic'
          : '/api/research/langchain';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: companyName.trim(),
          companyWebsite: companyWebsite.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start research');
      }

      // Redirect to results page
      router.push(`/results/${data.researchId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  const exampleCompanies = [
    { name: 'OpenAI', website: 'https://openai.com' },
    { name: 'Microsoft', website: 'https://microsoft.com' },
    { name: 'Google', website: 'https://google.com' },
    { name: 'Anthropic', website: 'https://anthropic.com' },
    { name: 'Meta', website: 'https://meta.com' },
  ];

  const fillExample = (example: { name: string; website: string }) => {
    setCompanyName(example.name);
    setCompanyWebsite(example.website);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Company AI Research</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Company Name *
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., OpenAI"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="companyWebsite"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Company Website *
            </label>
            <input
              type="url"
              id="companyWebsite"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Research Agent Type *
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="agentType"
                  value="anthropic"
                  checked={agentType === 'anthropic'}
                  onChange={(e) => setAgentType(e.target.value as AgentType)}
                  disabled={isSubmitting}
                  className="mr-2"
                />
                <span>Anthropic SDK (Pure Claude with tool calling)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="agentType"
                  value="langchain"
                  checked={agentType === 'langchain'}
                  onChange={(e) => setAgentType(e.target.value as AgentType)}
                  disabled={isSubmitting}
                  className="mr-2"
                />
                <span>LangChain/LangGraph (State-based agent workflow)</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? 'Starting Research...' : 'Start Research'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Try an example:
          </p>
          <div className="flex flex-wrap gap-2">
            {exampleCompanies.map((company) => (
              <button
                key={company.name}
                onClick={() => fillExample(company)}
                disabled={isSubmitting}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
              >
                {company.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
