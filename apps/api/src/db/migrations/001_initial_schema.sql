-- ============================================================================
-- Zeno Database Schema v1.0
-- Multi-tenant SaaS for agency AI agent management
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. AGENCIES (top-level tenant)
-- ============================================================================
CREATE TABLE agencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  website TEXT,
  description TEXT,
  primary_service TEXT,
  plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'agency', 'scale')),
  logo_url TEXT,
  default_language TEXT DEFAULT 'FR',
  timezone TEXT DEFAULT 'Europe/Paris',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. PROFILES (users linked to agencies via Supabase Auth)
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'operator' CHECK (role IN ('owner', 'manager', 'operator')),
  assigned_clients UUID[] DEFAULT '{}',
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, agency_id)
);
CREATE INDEX idx_profiles_agency ON profiles(agency_id);
CREATE INDEX idx_profiles_user ON profiles(user_id);

-- ============================================================================
-- 3. CLIENT WORKSPACES
-- ============================================================================
CREATE TABLE client_workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  description TEXT,
  tone_of_voice TEXT[] DEFAULT '{}',
  target_audience TEXT,
  key_messages TEXT[] DEFAULT '{}',
  primary_goal TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_workspaces_agency ON client_workspaces(agency_id);

-- ============================================================================
-- 4. AGENT TEMPLATES (reusable across workspaces)
-- ============================================================================
CREATE TABLE agent_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  role TEXT NOT NULL,
  capabilities TEXT[] DEFAULT '{}',
  category TEXT CHECK (category IN ('content', 'sales', 'support', 'analytics', 'operations')),
  personality TEXT,
  tools TEXT[] DEFAULT '{}',
  prompt_config JSONB DEFAULT '{}',
  deployment_count INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_templates_agency ON agent_templates(agency_id);

-- ============================================================================
-- 5. CLIENT AGENTS (instances deployed to a workspace)
-- ============================================================================
CREATE TABLE client_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES client_workspaces(id) ON DELETE CASCADE,
  template_id UUID REFERENCES agent_templates(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  capabilities TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'idle' CHECK (status IN ('active', 'idle', 'training', 'error')),
  mode TEXT DEFAULT 'review' CHECK (mode IN ('suggestion', 'review', 'autonomous')),
  avatar_color TEXT DEFAULT '#3B82F6',
  personality TEXT,
  connected_tools TEXT[] DEFAULT '{}',
  config JSONB DEFAULT '{}',
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  tasks_this_week INTEGER DEFAULT 0,
  messages_handled INTEGER DEFAULT 0,
  hours_saved REAL DEFAULT 0,
  last_action TEXT,
  last_action_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_agents_workspace ON client_agents(workspace_id);
CREATE INDEX idx_agents_template ON client_agents(template_id);
CREATE INDEX idx_agents_status ON client_agents(status);

-- ============================================================================
-- 6. WORKFLOWS
-- ============================================================================
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES client_workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'failed')),
  definition JSONB NOT NULL DEFAULT '{"nodes":[],"edges":[]}',
  version INTEGER DEFAULT 1,
  runs_count INTEGER DEFAULT 0,
  last_run TIMESTAMPTZ,
  success_rate REAL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_workflows_workspace ON workflows(workspace_id);

-- ============================================================================
-- 7. WORKFLOW EXECUTIONS
-- ============================================================================
CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES client_workspaces(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'waiting_approval')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  duration_ms INTEGER,
  error TEXT,
  triggered_by TEXT DEFAULT 'system'
);
CREATE INDEX idx_executions_workflow ON workflow_executions(workflow_id);
CREATE INDEX idx_executions_workspace ON workflow_executions(workspace_id);
CREATE INDEX idx_executions_status ON workflow_executions(status);

-- ============================================================================
-- 8. WORKFLOW EVENTS (event sourcing for replayability)
-- ============================================================================
CREATE TABLE workflow_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  execution_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
  node_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('node_started', 'node_completed', 'node_failed', 'node_retried', 'approval_requested', 'approval_granted', 'approval_rejected')),
  data JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_events_execution ON workflow_events(execution_id);
CREATE INDEX idx_events_type ON workflow_events(type);

-- ============================================================================
-- 9. CONVERSATIONS
-- ============================================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES client_agents(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES client_workspaces(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_conversations_agent ON conversations(agent_id);
CREATE INDEX idx_conversations_workspace ON conversations(workspace_id);

-- ============================================================================
-- 10. MESSAGES
-- ============================================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'agent', 'system', 'tool')),
  content TEXT NOT NULL,
  tool_use TEXT,
  token_count INTEGER,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);

-- ============================================================================
-- 11. INBOX THREADS
-- ============================================================================
CREATE TABLE inbox_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES client_workspaces(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT,
  agent_id UUID REFERENCES client_agents(id) ON DELETE SET NULL,
  last_message TEXT,
  status TEXT DEFAULT 'needs_review' CHECK (status IN ('handled', 'needs_review', 'escalated')),
  unread_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_inbox_workspace ON inbox_threads(workspace_id);
CREATE INDEX idx_inbox_status ON inbox_threads(status);

-- ============================================================================
-- 12. BRAIN MEMORIES
-- ============================================================================
CREATE TABLE brain_memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES client_workspaces(id) ON DELETE CASCADE,
  fact TEXT NOT NULL,
  learned_by TEXT,
  source TEXT,
  confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_memories_workspace ON brain_memories(workspace_id);

-- ============================================================================
-- 13. BRAIN DOCUMENTS
-- ============================================================================
CREATE TABLE brain_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES client_workspaces(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  size_bytes INTEGER,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'active', 'error')),
  content_text TEXT,
  storage_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_documents_workspace ON brain_documents(workspace_id);

-- ============================================================================
-- 14. BRAIN RULES
-- ============================================================================
CREATE TABLE brain_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES client_workspaces(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_rules_workspace ON brain_rules(workspace_id);

-- ============================================================================
-- 15. AI USAGE LOGS (cost tracking)
-- ============================================================================
CREATE TABLE ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES client_workspaces(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES client_agents(id) ON DELETE SET NULL,
  workflow_id UUID REFERENCES workflows(id) ON DELETE SET NULL,
  model TEXT NOT NULL,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  estimated_cost REAL DEFAULT 0,
  feature_type TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_usage_workspace ON ai_usage_logs(workspace_id);
CREATE INDEX idx_usage_agent ON ai_usage_logs(agent_id);
CREATE INDEX idx_usage_date ON ai_usage_logs(created_at);

-- ============================================================================
-- 16. AUDIT LOGS
-- ============================================================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES client_workspaces(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  details JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_workspace ON audit_logs(workspace_id);
CREATE INDEX idx_audit_action ON audit_logs(action);

-- ============================================================================
-- 17. INTEGRATIONS
-- ============================================================================
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES client_workspaces(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  credentials JSONB DEFAULT '{}',
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error')),
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, provider)
);
CREATE INDEX idx_integrations_workspace ON integrations(workspace_id);

-- ============================================================================
-- 18. NOTIFICATION PREFERENCES
-- ============================================================================
CREATE TABLE notification_prefs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(profile_id, event_type)
);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER trg_agencies_updated BEFORE UPDATE ON agencies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_workspaces_updated BEFORE UPDATE ON client_workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_agents_updated BEFORE UPDATE ON client_agents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_workflows_updated BEFORE UPDATE ON workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_inbox_updated BEFORE UPDATE ON inbox_threads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_integrations_updated BEFORE UPDATE ON integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Increment template deployment count
CREATE OR REPLACE FUNCTION increment_deployment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.template_id IS NOT NULL THEN
    UPDATE agent_templates SET deployment_count = deployment_count + 1, last_updated = NOW()
    WHERE id = NEW.template_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_agent_deployed AFTER INSERT ON client_agents FOR EACH ROW EXECUTE FUNCTION increment_deployment_count();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbox_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Helper: get user's agency_id
CREATE OR REPLACE FUNCTION get_user_agency_id()
RETURNS UUID AS $$
  SELECT agency_id FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: check if user belongs to workspace's agency
CREATE OR REPLACE FUNCTION can_access_workspace(ws_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM client_workspaces ws
    JOIN profiles p ON p.agency_id = ws.agency_id
    WHERE ws.id = ws_id AND p.user_id = auth.uid()
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Agency-level policies
CREATE POLICY "Users can see their agency" ON agencies
  FOR SELECT USING (id = get_user_agency_id());
CREATE POLICY "Owners can update agency" ON agencies
  FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'owner' AND agency_id = agencies.id));

CREATE POLICY "Users can see colleagues" ON profiles
  FOR SELECT USING (agency_id = get_user_agency_id());
CREATE POLICY "Owners can manage profiles" ON profiles
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'owner'));

-- Workspace policies
CREATE POLICY "Agency members can see workspaces" ON client_workspaces
  FOR SELECT USING (agency_id = get_user_agency_id());
CREATE POLICY "Managers+ can create workspaces" ON client_workspaces
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('owner', 'manager')));
CREATE POLICY "Managers+ can update workspaces" ON client_workspaces
  FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('owner', 'manager')));

-- Template policies
CREATE POLICY "Agency members can see templates" ON agent_templates
  FOR SELECT USING (agency_id = get_user_agency_id());
CREATE POLICY "Managers+ can manage templates" ON agent_templates
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('owner', 'manager')));

-- Agent policies (scoped to workspace)
CREATE POLICY "Can see agents in accessible workspaces" ON client_agents
  FOR SELECT USING (can_access_workspace(workspace_id));
CREATE POLICY "Managers+ can manage agents" ON client_agents
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('owner', 'manager')));

-- Workflow policies
CREATE POLICY "Can see workflows in accessible workspaces" ON workflows
  FOR SELECT USING (can_access_workspace(workspace_id));
CREATE POLICY "Managers+ can manage workflows" ON workflows
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('owner', 'manager')));

-- Execution and event policies (readable by all agency members)
CREATE POLICY "Can see executions in agency" ON workflow_executions
  FOR SELECT USING (workspace_id IN (SELECT id FROM client_workspaces WHERE agency_id = get_user_agency_id()));

CREATE POLICY "Can see events in agency" ON workflow_events
  FOR SELECT USING (execution_id IN (
    SELECT id FROM workflow_executions WHERE workspace_id IN (
      SELECT id FROM client_workspaces WHERE agency_id = get_user_agency_id()
    )
  ));

-- Conversation/message policies
CREATE POLICY "Can see conversations in workspace" ON conversations
  FOR SELECT USING (can_access_workspace(workspace_id));
CREATE POLICY "Can see messages in workspace" ON messages
  FOR SELECT USING (conversation_id IN (
    SELECT id FROM conversations WHERE can_access_workspace(workspace_id)
  ));

-- Inbox policies
CREATE POLICY "Can see inbox in workspace" ON inbox_threads
  FOR SELECT USING (can_access_workspace(workspace_id));

-- Brain policies
CREATE POLICY "Can see brain in workspace" ON brain_memories FOR SELECT USING (can_access_workspace(workspace_id));
CREATE POLICY "Can manage brain" ON brain_memories FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('owner', 'manager')));

CREATE POLICY "Can see brain docs" ON brain_documents FOR SELECT USING (can_access_workspace(workspace_id));
CREATE POLICY "Can manage brain docs" ON brain_documents FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('owner', 'manager')));

CREATE POLICY "Can see brain rules" ON brain_rules FOR SELECT USING (can_access_workspace(workspace_id));
CREATE POLICY "Can manage brain rules" ON brain_rules FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('owner', 'manager')));

-- Usage logs (agency-wide visibility)
CREATE POLICY "Can see usage logs in agency" ON ai_usage_logs
  FOR SELECT USING (workspace_id IN (SELECT id FROM client_workspaces WHERE agency_id = get_user_agency_id()));

-- Audit logs
CREATE POLICY "Can see audit logs in agency" ON audit_logs
  FOR SELECT USING (workspace_id IN (SELECT id FROM client_workspaces WHERE agency_id = get_user_agency_id()));

-- Integration policies
CREATE POLICY "Can see integrations in workspace" ON integrations
  FOR SELECT USING (can_access_workspace(workspace_id));
CREATE POLICY "Managers+ can manage integrations" ON integrations
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('owner', 'manager')));
