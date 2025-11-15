import { NextRequest, NextResponse } from 'next/server';
import { getResearchCollection } from '@/lib/mongodb';
import { runAnthropicResearchAgent } from '@/lib/anthropic-agent';
import { ResearchResult, ResearchStep } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const { companyName, companyWebsite } = await req.json();

    if (!companyName || !companyWebsite) {
      return NextResponse.json(
        { error: 'Company name and website are required' },
        { status: 400 }
      );
    }

    // Create initial research record
    const collection = await getResearchCollection();
    const initialResult: Omit<ResearchResult, '_id'> = {
      companyName,
      companyWebsite,
      agentType: 'anthropic',
      status: 'in-progress',
      createdAt: new Date(),
      researchSteps: [],
    };

    const insertResult = await collection.insertOne(initialResult as any);
    const researchId = insertResult.insertedId.toString();

    // Run research in background (in production, use a queue system)
    runResearchAsync(researchId, companyName, companyWebsite);

    return NextResponse.json({
      success: true,
      researchId,
      message: 'Research started',
    });
  } catch (error) {
    console.error('Research API error:', error);
    return NextResponse.json(
      { error: 'Failed to start research' },
      { status: 500 }
    );
  }
}

async function runResearchAsync(
  researchId: string,
  companyName: string,
  companyWebsite: string
) {
  const collection = await getResearchCollection();

  try {
    const researchSteps: ResearchStep[] = [];

    const onProgress = async (step: ResearchStep) => {
      researchSteps.push(step);
      await collection.updateOne(
        { _id: new ObjectId(researchId) } as any,
        {
          $set: {
            researchSteps,
            status: 'in-progress',
          },
        }
      );
    };

    const researchData = await runAnthropicResearchAgent(
      companyName,
      companyWebsite,
      onProgress
    );

    await collection.updateOne(
      { _id: new ObjectId(researchId) } as any,
      {
        $set: {
          research: researchData,
          status: 'completed',
          completedAt: new Date(),
          researchSteps,
        },
      }
    );
  } catch (error) {
    console.error('Research execution error:', error);
    await collection.updateOne(
      { _id: new ObjectId(researchId) } as any,
      {
        $set: {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          completedAt: new Date(),
        },
      }
    );
  }
}
