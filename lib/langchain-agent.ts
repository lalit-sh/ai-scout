import { ChatAnthropic } from '@langchain/anthropic';
import { StateGraph, END, START } from '@langchain/langgraph';
import { ResearchData, ResearchStep } from './types';

interface ResearchState {
  companyName: string;
  companyWebsite: string;
  queries: string[];
  searchResults: any[];
  currentQueryIndex: number;
  researchData?: ResearchData;
  steps: ResearchStep[];
}

// Brave Search API integration
async function performWebSearch(query: string) {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;

  if (!apiKey) {
    console.warn('BRAVE_SEARCH_API_KEY not set, using fallback search');
    return [
      {
        title: `${query} - Search Result`,
        snippet: `Information about ${query}. Please configure BRAVE_SEARCH_API_KEY for real search results.`,
        url: 'https://example.com',
      },
    ];
  }

  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=10`,
      {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Brave Search API error: ${response.status}`);
    }

    const data = await response.json();

    // Extract web results from Brave Search response
    const results = (data.web?.results || []).map((result: any) => ({
      title: result.title || '',
      snippet: result.description || '',
      url: result.url || '',
    }));

    return results.slice(0, 5); // Return top 5 results
  } catch (error) {
    console.error('Brave Search API error:', error);
    // Fallback to basic result
    return [
      {
        title: `${query} - Search Result`,
        snippet: `Search information about ${query}`,
        url: 'https://example.com',
      },
    ];
  }
}

// Node 1: Initialize research plan
async function planResearch(state: ResearchState): Promise<Partial<ResearchState>> {
  const queries = [
    `${state.companyName} AI initiatives current projects`,
    `${state.companyName} artificial intelligence strategy roadmap`,
    `${state.companyName} AI technology stack tools partnerships`,
    `${state.companyName} AI plans future 2025-2030`,
  ];

  const newStep: ResearchStep = {
    step: 'Planning research',
    timestamp: new Date(),
    result: `Created ${queries.length} search queries for ${state.companyName}`,
  };

  return {
    queries,
    currentQueryIndex: 0,
    steps: [...state.steps, newStep],
  };
}

// Node 2: Execute web searches
async function executeSearch(state: ResearchState): Promise<Partial<ResearchState>> {
  const query = state.queries[state.currentQueryIndex];
  const results = await performWebSearch(query);

  const newStep: ResearchStep = {
    step: 'Executing search',
    timestamp: new Date(),
    result: `Searched: ${query}, found ${results.length} results`,
  };

  return {
    searchResults: [...state.searchResults, { query, results }],
    currentQueryIndex: state.currentQueryIndex + 1,
    steps: [...state.steps, newStep],
  };
}

// Node 3: Synthesize information
async function synthesizeInformation(state: ResearchState): Promise<Partial<ResearchState>> {
  const llm = new ChatAnthropic({
    modelName: 'claude-3-5-sonnet-20241022',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    temperature: 0.7,
  });

  const synthesisPrompt = `
You are a research analyst specializing in AI and technology strategy. Based on the following search results about ${state.companyName}, create a comprehensive analysis.

Company: ${state.companyName}
Website: ${state.companyWebsite}

Search Results:
${JSON.stringify(state.searchResults, null, 2)}

Please provide a detailed analysis in the following JSON format:
{
  "currentInitiatives": "Detailed overview of current AI initiatives and projects (2-3 paragraphs)",
  "yearPlans": {
    "year1": "AI plans and expected developments for year 1 (next 12 months)",
    "year2": "AI plans and expected developments for year 2",
    "year3": "AI plans and expected developments for year 3",
    "year4": "AI plans and expected developments for year 4",
    "year5": "AI plans and expected developments for year 5"
  },
  "technologyStack": ["technology1", "technology2", "technology3"],
  "partnerships": ["partnership1", "partnership2"],
  "marketPosition": "Overall assessment of the company's position in AI adoption and innovation"
}

Provide thoughtful, detailed analysis. If specific information is not available, make reasonable inferences based on the company's industry and known activities.
IMPORTANT: Return ONLY the JSON object, no additional text.
`;

  const response = await llm.invoke(synthesisPrompt);
  const responseText = response.content.toString();

  let researchData: ResearchData;
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      researchData = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('No JSON found in response');
    }
  } catch (error) {
    // Fallback structure
    researchData = {
      currentInitiatives: responseText,
      yearPlans: {
        year1: 'Data not available',
        year2: 'Data not available',
        year3: 'Data not available',
        year4: 'Data not available',
        year5: 'Data not available',
      },
      technologyStack: [],
      partnerships: [],
      marketPosition: 'Analysis pending',
    };
  }

  const newStep: ResearchStep = {
    step: 'Synthesizing information',
    timestamp: new Date(),
    result: 'Generated comprehensive research report',
  };

  return {
    researchData,
    steps: [...state.steps, newStep],
  };
}

// Conditional edge: continue searching or move to synthesis
function shouldContinueSearching(state: ResearchState): string {
  if (state.currentQueryIndex < state.queries.length) {
    return 'search';
  }
  return 'synthesize';
}

export async function runLangChainResearchAgent(
  companyName: string,
  companyWebsite: string,
  onProgress?: (step: ResearchStep) => void
): Promise<ResearchData> {
  // Define the graph
  const workflow = new StateGraph<ResearchState>({
    channels: {
      companyName: null,
      companyWebsite: null,
      queries: null,
      searchResults: null,
      currentQueryIndex: null,
      researchData: null,
      steps: null,
    },
  });

  // Add nodes
  workflow.addNode('plan', planResearch);
  workflow.addNode('search', executeSearch);
  workflow.addNode('synthesize', synthesizeInformation);

  // Add edges
  (workflow as any).addEdge('__start__', 'plan');
  (workflow as any).addEdge('plan', 'search');
  (workflow as any).addConditionalEdges('search', shouldContinueSearching, {
    search: 'search',
    synthesize: 'synthesize',
  });
  (workflow as any).addEdge('synthesize', '__end__');

  // Compile the graph
  const app = workflow.compile();

  // Initialize state
  const initialState: ResearchState = {
    companyName,
    companyWebsite,
    queries: [],
    searchResults: [],
    currentQueryIndex: 0,
    steps: [],
  };

  // Run the graph
  const finalState = await (app as any).invoke(initialState);

  // Report progress
  if (onProgress) {
    finalState.steps.forEach((step: ResearchStep) => onProgress(step));
  }

  if (!finalState.researchData) {
    throw new Error('Research failed to produce results');
  }

  return finalState.researchData;
}
