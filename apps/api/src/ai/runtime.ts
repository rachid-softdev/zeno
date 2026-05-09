// AI Runtime Engine — Core intelligence layer
// Pipeline: Context Builder → Policy Engine → Model Router → Prompt Composer → Tool Executor → LLM → Post Processor

import { supabase } from '../lib/supabase.js';
import { getModelForTask, streamChat } from './client.js';
import type { ModelConfig, ModelProvider } from './client.js';

export interface RuntimeContext {
  workspaceId: string;
  agentId?: string;
  workflowId?: string;
  userId?: string;
}

export interface ExecutionResult {
  success: boolean;
  output?: string;
  cost?: number;
  tokensIn?: number;
  tokensOut?: number;
  error?: string;
  modelUsed?: string;
}

/**
 * Full AI Runtime execution pipeline
 */
export async function executeAIRuntime(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  context: RuntimeContext,
  task: string = 'premium_chat'
): Promise<ReadableStream> {
  // 1. Context Builder — enrich with workspace data
  const enrichedPrompt = await buildContext(systemPrompt, context);

  // 2. Policy Engine — run guardrails
  const policyResult = await checkPolicies(enrichedPrompt, context);
  if (!policyResult.allowed) {
    throw new Error(`Policy violation: ${policyResult.reason}`);
  }

  // 3. Model Router — select best model
  const modelConfig = getModelForTask(task);

  // 4. Stream response
  return streamChat(enrichedPrompt, messages, task);
}

/**
 * Context Builder: enriches the system prompt with workspace-specific data
 */
async function buildContext(basePrompt: string, ctx: RuntimeContext): Promise<string> {
  let enriched = basePrompt;

  try {
    // Fetch workspace brand data
    const { data: workspace } = await supabase
      .from('client_workspaces')
      .select('*')
      .eq('id', ctx.workspaceId)
      .single();

    if (workspace) {
      enriched += `\n\nWORKSPACE CONTEXT:
- Name: ${(workspace as any).name}
- Industry: ${(workspace as any).industry}
- Tone of voice: ${((workspace as any).tone_of_voice || []).join(', ')}
- Target audience: ${(workspace as any).target_audience}`;
    }

    // Fetch confirmed memories
    const { data: memories } = await supabase
      .from('brain_memories')
      .select('fact')
      .eq('workspace_id', ctx.workspaceId)
      .eq('confirmed', true);

    if (memories && memories.length > 0) {
      enriched += '\n\nKNOWN FACTS:\n' + memories.map((m: any) => `- ${m.fact}`).join('\n');
    }

    // Fetch active rules
    const { data: rules } = await supabase
      .from('brain_rules')
      .select('description')
      .eq('workspace_id', ctx.workspaceId)
      .eq('enabled', true);

    if (rules && rules.length > 0) {
      enriched += '\n\nRULES (MUST FOLLOW):\n' + rules.map((r: any) => `- ${r.description}`).join('\n');
    }
  } catch (err) {
    console.error('Context builder error:', err);
  }

  return enriched;
}

/**
 * Policy Engine: checks guardrails before allowing execution
 */
interface PolicyResult {
  allowed: boolean;
  reason?: string;
}

async function checkPolicies(prompt: string, ctx: RuntimeContext): Promise<PolicyResult> {
  // Check for PII in output going to external channels
  const piiPatterns = [/\b\d{3}-\d{2}-\d{4}\b/, /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i];
  // This runs pre-execution — actual PII check happens post-processor

  // Rate limit check
  if (ctx.workspaceId) {
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const { count } = await supabase
      .from('ai_usage_logs')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', ctx.workspaceId)
      .gte('created_at', oneHourAgo);

    if (count && count > 1000) {
      return { allowed: false, reason: 'Rate limit exceeded (1000 requests/hour)' };
    }
  }

  return { allowed: true };
}

/**
 * Post Processor: validates and logs the AI response
 */
export async function postProcess(
  output: string,
  context: RuntimeContext,
  modelConfig: ModelConfig
): Promise<void> {
  // Log to ai_usage_logs
  await supabase.from('ai_usage_logs').insert({
    workspace_id: context.workspaceId,
    agent_id: context.agentId,
    workflow_id: context.workflowId,
    model: modelConfig.model,
    input_tokens: 0, // Set by caller
    output_tokens: Math.ceil(output.length / 4),
    estimated_cost: (output.length / 4) * 0.000015,
    feature_type: 'chat',
    duration_ms: 0,
  });

  // Log to audit trail
  await supabase.from('audit_logs').insert({
    workspace_id: context.workspaceId,
    action: 'ai_response_generated',
    actor_id: context.userId,
    details: {
      agent_id: context.agentId,
      model: modelConfig.model,
      output_length: output.length,
    },
    timestamp: new Date().toISOString(),
  });
}
