import { NextRequest, NextResponse } from 'next/server';
import { getResearchCollection } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const agentType = searchParams.get('agentType');
    const status = searchParams.get('status');

    const collection = await getResearchCollection();

    // Build filter
    const filter: any = {};
    if (agentType && (agentType === 'anthropic' || agentType === 'langchain')) {
      filter.agentType = agentType;
    }
    if (status && ['pending', 'in-progress', 'completed', 'failed'].includes(status)) {
      filter.status = status;
    }

    // Get results sorted by creation date (newest first)
    const results = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    // Convert ObjectIds to strings
    const serializedResults = results.map((result) => ({
      ...result,
      _id: result._id.toString(),
    }));

    return NextResponse.json({
      results: serializedResults,
      count: serializedResults.length,
    });
  } catch (error) {
    console.error('List results API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch research results' },
      { status: 500 }
    );
  }
}
