# AI Scout - AI Chat & Company Research Agent Application

A Next.js application featuring two main capabilities:
1. **Direct AI Chat Interface** - Real-time conversations with Claude AI
2. **Company Research Agent** - Automated research on company AI initiatives using two different approaches: Anthropic SDK and LangChain/LangGraph

## Features

### AI Chat Interface
- Real-time streaming responses from Claude AI
- Clean, intuitive chat interface
- Full conversation history
- Message bubbles with user/assistant distinction

### Company Research Agent
- Research company AI initiatives and strategies
- Generate comprehensive 5-year AI roadmap analysis
- Two agent implementations for comparison:
  - **Anthropic SDK**: Direct Claude API with tool calling
  - **LangChain/LangGraph**: State-based graph workflow
- Structured research output including:
  - Current AI initiatives
  - 5-year AI plans
  - Technology stack analysis
  - Partnership information
  - Market position assessment
- Export results as JSON
- View all past research results

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI SDKs**:
  - @anthropic-ai/sdk
  - @langchain/anthropic
  - @langchain/community
  - @langchain/langgraph
- **Search**: Brave Search API
- **Database**: MongoDB Atlas

## Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB Atlas account
- Anthropic API key
- Brave Search API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-scout
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   BRAVE_SEARCH_API_KEY=your_brave_search_api_key_here
   MONGODB_URI=your_mongodb_connection_string_here
   MONGODB_DB_NAME=ai_scout
   ```

   **Getting your API keys:**
   - **Anthropic API Key**: Sign up at [https://console.anthropic.com](https://console.anthropic.com)
   - **Brave Search API Key**: Get your free API key at [Brave Search API](https://brave.com/search/api/)
   - **MongoDB URI**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/app
  /api
    /chat              - Chat API endpoint
    /research
      /anthropic       - Anthropic SDK research endpoint
      /langchain       - LangChain research endpoint
    /results
      /[id]            - Get specific research result
      /list            - List all research results
  /chat                - Chat interface page
  /research            - Research form page
  /results
    /[id]              - Research result detail page
    page.tsx           - Results list page
/components
  - ChatInterface.tsx
  - ResearchForm.tsx
  - ResearchResults.tsx
  - Header.tsx
/lib
  - mongodb.ts         - MongoDB connection
  - anthropic-agent.ts - Anthropic SDK agent
  - langchain-agent.ts - LangChain agent
  - types.ts           - TypeScript type definitions
```

## Usage

### AI Chat
1. Navigate to the "AI Chat" page
2. Type your message in the input field
3. Watch as Claude responds in real-time with streaming
4. Continue the conversation naturally

### Company Research
1. Navigate to the "Research" page
2. Enter the company name (e.g., "OpenAI")
3. Enter the company website (e.g., "https://openai.com")
4. Select agent type:
   - **Anthropic SDK**: Uses pure Claude with tool calling
   - **LangChain/LangGraph**: Uses state-based graph workflow
5. Click "Start Research"
6. Watch the research progress in real-time
7. View comprehensive results including:
   - Current AI initiatives
   - 5-year roadmap (year by year)
   - Technology stack
   - Partnerships
   - Market position

### Viewing Results
- Click "Results" in the navigation to see all past research
- Filter by agent type or status
- Click "View Details" to see full research report
- Export results as JSON for further analysis

## Deployment

This application can be deployed on various platforms:

### Vercel (Recommended)
1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables:
   - `ANTHROPIC_API_KEY`
   - `BRAVE_SEARCH_API_KEY`
   - `MONGODB_URI`
   - `MONGODB_DB_NAME`
4. Deploy

### AWS Amplify
1. Push your code to GitHub
2. Connect your repository in [AWS Amplify Console](https://console.aws.amazon.com/amplify)
3. Amplify will auto-detect Next.js configuration
4. Add the same environment variables as above
5. Deploy

### Important Deployment Notes
- **API Routes**: Work as serverless functions
- **MongoDB Connection**: Connection pooling is already implemented
- **Environment Variables**: Never commit `.env.local` to Git
- **Build Time**: First build may take 5-10 minutes

## Agent Comparison

### Anthropic SDK Agent
- **Approach**: Direct API calls with tool calling
- **Pros**:
  - Simple, straightforward implementation
  - Direct control over Claude's behavior
  - Minimal dependencies
- **Best for**: Simple workflows, direct Q&A

### LangChain/LangGraph Agent
- **Approach**: State-based graph execution
- **Pros**:
  - Complex multi-step workflows
  - State management built-in
  - Extensible architecture
- **Best for**: Complex research, multi-step processes

## Web Search Integration

This application uses **Brave Search API** for real-time web searches during company research.

### How It Works
- Both research agents (Anthropic SDK and LangChain) use Brave Search API
- Each search query returns up to 5 relevant results
- Results include title, description, and URL
- Automatic fallback to placeholder data if API key is not configured

### Getting Brave Search API Key
1. Visit [Brave Search API](https://brave.com/search/api/)
2. Sign up for a free account (up to 2,000 queries/month free)
3. Get your API key from the dashboard
4. Add it to your `.env.local` file as `BRAVE_SEARCH_API_KEY`

### Alternative Search APIs
If you prefer a different search provider, you can replace the `webSearch` or `performWebSearch` functions in:
- `lib/anthropic-agent.ts`
- `lib/langchain-agent.ts`

Popular alternatives:
- [Tavily Search API](https://tavily.com) - AI-optimized search
- [Serper API](https://serper.dev) - Google Search API
- [SerpApi](https://serpapi.com) - Multiple search engines

## MongoDB Schema

### Research Results Collection
```typescript
{
  _id: ObjectId,
  companyName: string,
  companyWebsite: string,
  agentType: 'anthropic' | 'langchain',
  status: 'pending' | 'in-progress' | 'completed' | 'failed',
  createdAt: Date,
  completedAt: Date,
  research: {
    currentInitiatives: string,
    yearPlans: {
      year1: string,
      year2: string,
      year3: string,
      year4: string,
      year5: string
    },
    technologyStack: string[],
    partnerships: string[],
    marketPosition: string
  },
  researchSteps: [{
    step: string,
    timestamp: Date,
    result: string
  }],
  error: string (optional)
}
```

## Development

### Run in Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Lint Code
```bash
npm run lint
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure your IP address is whitelisted in MongoDB Atlas
- Check that the connection string is correct
- Verify the database user has proper permissions

### API Rate Limits
- Anthropic API has rate limits based on your plan
- Implement request queuing for production use

### Brave Search API Issues
- Ensure your API key is correctly set in environment variables
- Check you haven't exceeded your monthly quota
- The app will work with fallback data if the API key is missing

### Build Errors
- Check build logs in your deployment platform
- Ensure all environment variables are set
- Verify Node.js version compatibility (18+)

## Future Enhancements

- [ ] Add PDF export for research results
- [ ] Implement email notifications on research completion
- [ ] Add comparison view for multiple companies
- [ ] Implement real-time progress updates via WebSockets
- [ ] Add user authentication
- [ ] Implement research result sharing via unique URLs
- [ ] Add historical tracking of company AI initiatives

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.
