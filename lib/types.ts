// Type definitions for the application

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ResearchStep {
  step: string;
  timestamp: Date;
  result: string;
}

export interface YearPlans {
  year1: string;
  year2: string;
  year3: string;
  year4: string;
  year5: string;
}

export interface ResearchData {
  currentInitiatives: string;
  yearPlans: YearPlans;
  technologyStack: string[];
  partnerships: string[];
  marketPosition: string;
}

export type AgentType = 'anthropic' | 'langchain';
export type ResearchStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

export interface ResearchResult {
  _id?: string;
  companyName: string;
  companyWebsite: string;
  agentType: AgentType;
  status: ResearchStatus;
  createdAt: Date;
  completedAt?: Date;
  research?: ResearchData;
  researchSteps: ResearchStep[];
  rawData?: any;
  error?: string;
}
