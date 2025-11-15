import { MongoClient, Db, Collection } from 'mongodb';
import { ResearchResult } from './types';

interface CachedConnection {
  client: MongoClient;
  db: Db;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoCache: CachedConnection | undefined;
}

let cached = global.mongoCache;

if (!cached) {
  cached = global.mongoCache = undefined as CachedConnection | undefined;
}

export async function connectToDatabase(): Promise<CachedConnection> {
  if (cached) {
    return cached;
  }

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  if (!dbName) {
    throw new Error('Please define the MONGODB_DB_NAME environment variable');
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 5,
    retryWrites: true,
    retryReads: true,
  });

  await client.connect();
  const db = client.db(dbName);

  // Create indexes
  await createIndexes(db);

  cached = { client, db };
  global.mongoCache = cached;

  return cached;
}

async function createIndexes(db: Db) {
  const researchCollection = db.collection('research_results');

  // Create indexes for better query performance
  await researchCollection.createIndex({ companyName: 1 });
  await researchCollection.createIndex({ createdAt: -1 });
  await researchCollection.createIndex({ status: 1 });
  await researchCollection.createIndex({ agentType: 1 });
}

export async function getResearchCollection(): Promise<Collection<ResearchResult>> {
  const { db } = await connectToDatabase();
  return db.collection<ResearchResult>('research_results');
}

export async function getChatSessionsCollection(): Promise<Collection> {
  const { db } = await connectToDatabase();
  return db.collection('chat_sessions');
}
