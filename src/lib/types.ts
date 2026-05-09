// Core data types for Zeno

export type AgencyRole = 'Owner' | 'Manager' | 'Operator';
export type AgentStatus = 'active' | 'idle' | 'training' | 'error';
export type AgentMode = 'suggestion' | 'review' | 'autonomous';
export type WorkflowStatus = 'draft' | 'active' | 'paused';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface Agency {
  id: string;
  name: string;
  website: string;
  description: string;
  primaryService: string;
  plan: 'starter' | 'agency' | 'scale';
  createdAt: string;
  logo?: string;
  defaultLanguage: string;
  timezone: string;
}

export interface TeamMember {
  id: string;
  userId: string;
  agencyId: string;
  name: string;
  email: string;
  avatar?: string;
  role: AgencyRole;
  assignedClients: string[];
  lastActive: string;
}

export interface ClientWorkspace {
  id: string;
  agencyId: string;
  name: string;
  industry: string;
  website: string;
  description: string;
  toneOfVoice: string[];
  targetAudience: string;
  keyMessages: string[];
  primaryGoal: string;
  logo?: string;
  createdAt: string;
}

export interface AgentTemplate {
  id: string;
  agencyId: string;
  name: string;
  description: string;
  role: string;
  capabilities: string[];
  category: 'content' | 'sales' | 'support' | 'analytics' | 'operations';
  deploymentCount: number;
  lastUpdated: string;
  isDefault?: boolean;
  personality: string;
  tools: string[];
}

export interface ClientAgent {
  id: string;
  clientId: string;
  templateId: string | null;
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  status: AgentStatus;
  mode: AgentMode;
  avatarColor: string;
  personality: string;
  connectedTools: string[];
  tasksThisWeek: number;
  messagesHandled: number;
  hoursSaved: number;
  lastAction: string;
  lastActionTime: string;
  assignedTo?: string;
}

export interface ConversationMessage {
  id: string;
  agentId: string;
  role: 'user' | 'agent' | 'system' | 'tool';
  content: string;
  timestamp: string;
  toolUse?: string;
}

export interface ActivityFeedItem {
  id: string;
  clientId: string;
  clientName: string;
  agentName: string;
  agentRole: string;
  action: string;
  timestamp: string;
  type: 'success' | 'review' | 'error' | 'info';
  color: string;
}

export interface Workflow {
  id: string;
  clientId: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  runsCount: number;
  lastRun: string;
  successRate: number;
}

export interface InboxThread {
  id: string;
  clientId: string;
  channel: string;
  contactName: string;
  contactAvatar?: string;
  agentName?: string;
  lastMessage: string;
  timestamp: string;
  status: 'handled' | 'needs_review' | 'escalated';
  unread: number;
}

export interface BrainMemory {
  id: string;
  clientId: string;
  fact: string;
  learnedBy: string;
  learnedAt: string;
  source: string;
  confirmed: boolean;
}

export interface BrainDocument {
  id: string;
  clientId: string;
  filename: string;
  size: string;
  uploadedAt: string;
  status: 'processing' | 'active' | 'error';
}

export interface BrainRule {
  id: string;
  clientId: string;
  description: string;
  enabled: boolean;
}

export interface ClientBrainData {
  brandDNA: {
    overview: string;
    valueProposition: string;
    yearFounded: string;
    targetAudience: { primary: string; secondary: string; painPoints: string; goals: string };
    personality: { formal: number; playful: number; corporate: number };
    keyMessages: string[];
    avoidList: string[];
    keywords: string[];
    writingExamples: string;
  };
  documents: BrainDocument[];
  memories: BrainMemory[];
  rules: BrainRule[];
}

export interface AnalyticsData {
  tasksCompleted: number;
  messagesHandled: number;
  hoursSaved: number;
  avgResponseTime: string;
  leadsQualified: number;
  contentPublished: number;
  trend: number;
  agentActivity: { agentName: string; color: string; data: { day: string; tasks: number }[] }[];
  channelBreakdown: { name: string; value: number; color: string }[];
  timeByCategory: { category: string; hours: number }[];
}
