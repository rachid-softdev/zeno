// Shared types between frontend and backend

export type AgencyRole = 'owner' | 'manager' | 'operator';
export type AgentStatus = 'active' | 'idle' | 'training' | 'error';
export type AgentMode = 'suggestion' | 'review' | 'autonomous';
export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'completed' | 'failed';
export type WorkflowNodeType = 'trigger' | 'agent' | 'condition' | 'action' | 'delay' | 'approval';
export type PlanTier = 'starter' | 'agency' | 'scale';

// DB row types (matching Supabase tables)
export interface AgencyRow {
  id: string;
  name: string;
  website: string;
  description: string;
  primary_service: string;
  plan: PlanTier;
  created_at: string;
  logo_url?: string;
  default_language: string;
  timezone: string;
}

export interface ProfileRow {
  id: string;
  user_id: string;
  agency_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: AgencyRole;
  assigned_clients: string[];
  last_active: string;
}

export interface ClientWorkspaceRow {
  id: string;
  agency_id: string;
  name: string;
  industry: string;
  website: string;
  description: string;
  tone_of_voice: string[];
  target_audience: string;
  key_messages: string[];
  primary_goal: string;
  logo_url?: string;
  created_at: string;
}

export interface AgentTemplateRow {
  id: string;
  agency_id: string;
  name: string;
  description: string;
  role: string;
  capabilities: string[];
  category: string;
  personality: string;
  tools: string[];
  prompt_config: Record<string, unknown>;
  deployment_count: number;
  last_updated: string;
  is_default: boolean;
}

export interface ClientAgentRow {
  id: string;
  workspace_id: string;
  template_id: string | null;
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  status: AgentStatus;
  mode: AgentMode;
  avatar_color: string;
  personality: string;
  connected_tools: string[];
  config: Record<string, unknown>;
  assigned_to?: string;
  created_at: string;
}

export interface WorkflowRow {
  id: string;
  workspace_id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  definition: WorkflowDefinition;
  version: number;
  runs_count: number;
  last_run?: string;
  success_rate: number;
  created_at: string;
  updated_at: string;
}

export interface WorkflowDefinition {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  label?: string;
}

export interface WorkflowExecutionRow {
  id: string;
  workflow_id: string;
  workspace_id: string;
  status: 'running' | 'completed' | 'failed' | 'waiting_approval';
  started_at: string;
  finished_at?: string;
  duration_ms?: number;
  error?: string;
}

export interface WorkflowEventRow {
  id: string;
  execution_id: string;
  node_id: string;
  type: 'node_started' | 'node_completed' | 'node_failed' | 'node_retried' | 'approval_requested' | 'approval_granted';
  data: Record<string, unknown>;
  timestamp: string;
}

export interface ConversationRow {
  id: string;
  agent_id: string;
  workspace_id: string;
  title?: string;
  created_at: string;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  role: 'user' | 'agent' | 'system' | 'tool';
  content: string;
  tool_use?: string;
  token_count?: number;
  timestamp: string;
}

export interface InboxThreadRow {
  id: string;
  workspace_id: string;
  channel: string;
  contact_name: string;
  contact_email?: string;
  agent_id?: string;
  last_message: string;
  status: 'handled' | 'needs_review' | 'escalated';
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface BrainMemoryRow {
  id: string;
  workspace_id: string;
  fact: string;
  learned_by: string;
  source: string;
  confirmed: boolean;
  created_at: string;
}

export interface BrainDocumentRow {
  id: string;
  workspace_id: string;
  filename: string;
  size_bytes: number;
  status: 'processing' | 'active' | 'error';
  content_text?: string;
  created_at: string;
}

export interface BrainRuleRow {
  id: string;
  workspace_id: string;
  description: string;
  enabled: boolean;
  created_at: string;
}

export interface AiUsageLogRow {
  id: string;
  workspace_id: string;
  agent_id?: string;
  workflow_id?: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  estimated_cost: number;
  feature_type: string;
  duration_ms: number;
  created_at: string;
}

export interface AuditLogRow {
  id: string;
  workspace_id: string;
  action: string;
  actor_id: string;
  details: Record<string, unknown>;
  timestamp: string;
}

export interface IntegrationRow {
  id: string;
  workspace_id: string;
  provider: string;
  credentials: Record<string, unknown>;
  status: 'connected' | 'disconnected' | 'error';
  last_sync?: string;
  created_at: string;
}

// API request/response types
export interface CreateAgentRequest {
  workspaceId: string;
  templateId?: string;
  name: string;
  role: string;
  capabilities: string[];
  personality: string;
  tools: string[];
  mode: AgentMode;
}

export interface ChatRequest {
  agentId: string;
  message: string;
  conversationId?: string;
}

export interface ExecuteWorkflowRequest {
  workflowId: string;
  context?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
