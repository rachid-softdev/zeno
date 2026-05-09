// BullMQ Workers — Async task processing
// Requires Redis connection (Upstash or local)

import { Queue, Worker, Job } from 'bullmq';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// ── Queue Definitions ──

export const agentQueue = new Queue('agent-tasks', { connection: { url: REDIS_URL } });
export const workflowQueue = new Queue('workflow-executions', { connection: { url: REDIS_URL } });
export const integrationQueue = new Queue('integrations', { connection: { url: REDIS_URL } });
export const deadLetterQueue = new Queue('dead-letter', { connection: { url: REDIS_URL } });

// ── Job Types ──

export interface AgentJob {
  type: 'chat' | 'generate' | 'analyze' | 'classify';
  workspaceId: string;
  agentId: string;
  data: Record<string, unknown>;
}

export interface WorkflowJob {
  executionId: string;
  workflowId: string;
  workspaceId: string;
}

export interface IntegrationJob {
  type: 'send_email' | 'post_social' | 'update_crm' | 'sync';
  workspaceId: string;
  integrationId: string;
  data: Record<string, unknown>;
}

// ── Agent Worker ──

export const agentWorker = new Worker(
  'agent-tasks',
  async (job: Job<AgentJob>) => {
    const { type, workspaceId, agentId, data } = job.data;

    switch (type) {
      case 'chat':
        // Handled via SSE streaming endpoint
        return { status: 'delegated_to_stream' };
      case 'generate':
        return { status: 'completed', generated: true };
      case 'analyze':
        return { status: 'completed', analyzed: true };
      case 'classify':
        return { status: 'completed', classified: true };
      default:
        throw new Error(`Unknown agent job type: ${type}`);
    }
  },
  {
    connection: { url: REDIS_URL },
    concurrency: 5,
    limiter: { max: 50, duration: 60000 },
  }
);

// ── Workflow Worker ──

export const workflowWorker = new Worker(
  'workflow-executions',
  async (job: Job<WorkflowJob>) => {
    const { executionId, workflowId, workspaceId } = job.data;
    const { executeWorkflow } = await import('../ai/workflow-engine.js');
    const { supabase } = await import('../lib/supabase.js');

    const { data: workflow } = await supabase.from('workflows').select('definition').eq('id', workflowId).single();
    if (!workflow) throw new Error('Workflow not found');

    const definition = (workflow as any).definition;
    await executeWorkflow(executionId, definition.nodes, definition.edges, workspaceId);

    return { status: 'completed' };
  },
  {
    connection: { url: REDIS_URL },
    concurrency: 3,
  }
);

// ── Integration Worker ──

export const integrationWorker = new Worker(
  'integrations',
  async (job: Job<IntegrationJob>) => {
    const { type, workspaceId, integrationId, data } = job.data;

    switch (type) {
      case 'send_email':
        // TODO: Gmail/Outlook API
        return { status: 'email_sent' };
      case 'post_social':
        // TODO: LinkedIn/Instagram API
        return { status: 'post_published' };
      case 'update_crm':
        // TODO: HubSpot/Salesforce API
        return { status: 'crm_updated' };
      case 'sync':
        // TODO: Data sync
        return { status: 'synced' };
      default:
        throw new Error(`Unknown integration job type: ${type}`);
    }
  },
  {
    connection: { url: REDIS_URL },
    concurrency: 5,
  }
);

// ── Error Handling ──

agentWorker.on('failed', async (job, err) => {
  console.error(`Agent job ${job?.id} failed:`, err.message);
  if (job && job.attemptsMade >= (job.opts.attempts || 1)) {
    await deadLetterQueue.add('agent-failed', { jobId: job.id, error: err.message });
  }
});

workflowWorker.on('failed', async (job, err) => {
  console.error(`Workflow job ${job?.id} failed:`, err.message);
  if (job && job.attemptsMade >= (job.opts.attempts || 1)) {
    await deadLetterQueue.add('workflow-failed', { jobId: job.id, error: err.message });
  }
});

// ── Helper: Enqueue ──

export async function enqueueAgentTask(task: AgentJob) {
  return agentQueue.add(task.type, task, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  });
}

export async function enqueueWorkflow(task: WorkflowJob) {
  return workflowQueue.add(task.executionId, task, {
    attempts: 2,
    backoff: { type: 'fixed', delay: 5000 },
  });
}

export async function enqueueIntegration(task: IntegrationJob) {
  return integrationQueue.add(task.type, task, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
  });
}
