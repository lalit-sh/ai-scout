import Anthropic from '@anthropic-ai/sdk';
import { ResearchResult, ResearchStep, ResearchData } from './types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

// Simulated web search function (in production, integrate with actual search API like Tavily, Serper, etc.)
async function webSearch(query: string): Promise<SearchResult[]> {
  // This is a placeholder. In production, integrate with a real search API
  // For now, return structured placeholder data
  return [
    {
      title: `${query} - Latest News`,
      snippet: `Recent developments and announcements related to ${query}`,
      url: 'https://example.com',
    },
  ];
}

const tools: Anthropic.Tool[] = [
  {
    name: 'web_search',
    description: 'Search the web for information about companies, AI initiatives, and technology trends. Returns relevant search results.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query to execute',
        },
      },
      required: ['query'],
    },
  },
];

export async function runAnthropicResearchAgent(
  companyName: string,
  companyWebsite: string,
  onProgress?: (step: ResearchStep) => void
): Promise<ResearchData> {
  const researchSteps: ResearchStep[] = [];

  const addStep = (step: string, result: string) => {
    const newStep: ResearchStep = {
      step,
      timestamp: new Date(),
      result,
    };
    researchSteps.push(newStep);
    if (onProgress) {
      onProgress(newStep);
    }
  };

  addStep('Starting research', `Beginning research on ${companyName}`);

  // Research queries
  const queries = [
    `${companyName} AI initiatives current projects`,
    `${companyName} artificial intelligence strategy roadmap`,
    `${companyName} AI technology stack tools`,
    `${companyName} AI partnerships collaborations`,
    `${companyName} AI future plans 2025-2030`,
  ];

  let searchResults: any[] = [];

  // Execute searches using tool calling
  for (const query of queries) {
    addStep('Executing search', `Searching: ${query}`);

    const messages: Anthropic.MessageParam[] = [
      {
        role: 'user',
        content: `Search for information about: ${query}`,
      },
    ];

    let continueLoop = true;
    let response: Anthropic.Message;

    while (continueLoop) {
      response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        tools,
        messages,
      });

      if (response.stop_reason === 'tool_use') {
        const toolUse = response.content.find(
          (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
        );

        if (toolUse && toolUse.name === 'web_search') {
          const searchQuery = (toolUse.input as any).query;
          const results = await webSearch(searchQuery);
          searchResults.push({ query: searchQuery, results });

          messages.push({
            role: 'assistant',
            content: response.content,
          });

          messages.push({
            role: 'user',
            content: [
              {
                type: 'tool_result',
                tool_use_id: toolUse.id,
                content: JSON.stringify(results),
              },
            ],
          });
        }
      } else {
        continueLoop = false;
      }
    }
  }

  addStep('Synthesizing findings', 'Analyzing search results and generating report');

  // Synthesize all findings into structured report
  const synthesisPrompt = `
You are a research analyst specializing in AI and technology strategy. Based on the following search results about ${companyName}, create a comprehensive analysis.

Company: ${companyName}
Website: ${companyWebsite}

Search Results:
${JSON.stringify(searchResults, null, 2)}

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

Provide thoughtful, detailed analysis based on available information. If specific information is not available, make reasonable inferences based on the company's industry and known activities.
`;

  const synthesisResponse = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 8192,
    messages: [
      {
        role: 'user',
        content: synthesisPrompt,
      },
    ],
  });

  const responseText = synthesisResponse.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('');

  addStep('Parsing results', 'Extracting structured data from analysis');

  // Extract JSON from response
  let researchData: ResearchData;
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      researchData = JSON.parse(jsonMatch[0]);
    } else {
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
  } catch (error) {
    throw new Error('Failed to parse research results');
  }

  addStep('Research completed', 'Successfully generated comprehensive report');

  return researchData;
}
