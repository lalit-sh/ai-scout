import { NextRequest, NextResponse } from 'next/server';
import { getResearchCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid research ID' },
        { status: 400 }
      );
    }

    const collection = await getResearchCollection();
    const result = await collection.findOne({ _id: new ObjectId(id) } as any);

    if (!result) {
      return NextResponse.json(
        { error: 'Research not found' },
        { status: 404 }
      );
    }

    // Convert ObjectId to string for JSON serialization
    const serializedResult = {
      ...result,
      _id: result._id.toString(),
    };

    return NextResponse.json(serializedResult);
  } catch (error) {
    console.error('Get result API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch research result' },
      { status: 500 }
    );
  }
}
