import ResearchForm from '@/components/ResearchForm';

export default function ResearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Company AI Research Agent</h1>
        <p className="text-gray-600">
          Analyze any company's AI initiatives, strategy, and roadmap using our AI research agents
        </p>
      </div>
      <ResearchForm />
    </div>
  );
}
