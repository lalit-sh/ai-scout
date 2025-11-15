import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            AI Scout
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced AI-powered tools for chatting with Claude and researching company AI initiatives
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* AI Chat Feature */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3">AI Chat Interface</h2>
              <p className="text-gray-600 mb-6">
                Have intelligent conversations with Claude AI. Get instant, streaming responses to your questions with a clean, intuitive interface.
              </p>
              <ul className="space-y-2 mb-6 text-gray-700">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Real-time streaming responses
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Full conversation history
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Clean, minimal interface
                </li>
              </ul>
            </div>
            <Link
              href="/chat"
              className="block w-full text-center bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Start Chatting
            </Link>
          </div>

          {/* Company Research Feature */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3">Company AI Research</h2>
              <p className="text-gray-600 mb-6">
                Automated research agents that analyze company AI initiatives, strategies, and 5-year roadmaps using advanced AI workflows.
              </p>
              <ul className="space-y-2 mb-6 text-gray-700">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Two agent types: Anthropic SDK & LangChain
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Comprehensive 5-year AI roadmap analysis
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Export results as JSON
                </li>
              </ul>
            </div>
            <Link
              href="/research"
              className="block w-full text-center bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
              Start Research
            </Link>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="mt-16 max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">Compare Research Agents</h3>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Feature</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Anthropic SDK</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">LangChain/LangGraph</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-700">Implementation</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Pure Claude with tool calling</td>
                  <td className="px-6 py-4 text-sm text-gray-600">State-based graph workflow</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-700">Architecture</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Direct API calls</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Multi-node graph execution</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-700">Best For</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Simple, direct workflows</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Complex, multi-step processes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
