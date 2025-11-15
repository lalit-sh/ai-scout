'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ResearchResults from '@/components/ResearchResults';
import { ResearchResult } from '@/lib/types';

export default function ResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/results/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch research result');
        }
        const data = await response.json();
        setResult(data);

        // Poll for updates if research is in progress
        if (data.status === 'in-progress') {
          setTimeout(() => {
            fetchResult();
          }, 3000); // Poll every 3 seconds
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchResult();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading research results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold mb-2">Error</h2>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => router.push('/research')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Start New Research
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Result not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.push('/research')}
          className="text-blue-500 hover:underline mb-4"
        >
          ← Start New Research
        </button>
      </div>
      <ResearchResults result={result} />
    </div>
  );
}
