// Workflow Engine — Event-driven state machine
// Each workflow execution is a pure function of events (replayable)

import { supabase } from '../lib/supabase.js';

export type WorkflowState = 'draft' | 'active' | 'paused' | 'completed' | 'failed';
export type NodeEventType = 'node_started' | 'node_completed' | 'node_failed' | 'node_retried' | 'approval_requested' | 'approval_granted' | 'approval_rejected';

interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  label?: string;
}

/**
 * Compute workflow state from events (pure function → replayable)
 */
export function computeState(events: { type: NodeEventType; node_id: string }[]): WorkflowState {
  if (events.length === 0) return 'active';

  const hasFailures = events.some((e) => e.type === 'node_failed');
  const hasPendingApproval = events.some((e) => e.type === 'approval_requested') &&
    !events.some((e) => e.type === 'approval_granted' || e.type === 'approval_rejected');
  const allCompleted = events.every((e) => e.type === 'node_completed');

  if (hasFailures) return 'failed';
  if (hasPendingApproval) return 'paused';
  if (allCompleted) return 'completed';
  return 'active';
}

/**
 * Get next nodes to execute based on current state and edges
 */
export function getNextNodes(
  currentNodeId: string,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  conditionResult?: string
): WorkflowNode[] {
  const outgoingEdges = edges.filter((e) => e.source === currentNodeId);

  // If condition result provided, filter by handle
  if (conditionResult !== undefined) {
    const matchingEdge = outgoingEdges.find((e) => e.sourceHandle === conditionResult || e.label === conditionResult);
    if (!matchingEdge) return [];
    const nextNode = nodes.find((n) => n.id === matchingEdge.target);
    return nextNode ? [nextNode] : [];
  }

  // Follow all outgoing edges
  return outgoingEdges
    .map((e) => nodes.find((n) => n.id === e.target))
    .filter((n): n is WorkflowNode => n !== undefined);
}

/**
 * Execute a workflow node
 */
export async function executeNode(
  executionId: string,
  node: WorkflowNode,
  workspaceId: string
): Promise<void> {
  const startTime = Date.now();

  // Emit node_started event
  await supabase.from('workflow_events').insert({
    execution_id: executionId,
    node_id: node.id,
    type: 'node_started',
    data: { node_type: node.type, node_data: node.data },
    timestamp: new Date().toISOString(),
  });

  try {
    let result: unknown = null;

    switch (node.type) {
      case 'trigger':
        result = await executeTriggerNode(node, workspaceId);
        break;
      case 'agent':
        result = await executeAgentNode(node, workspaceId);
        break;
      case 'condition':
        result = await executeConditionNode(node);
        break;
      case 'action':
        result = await executeActionNode(node, workspaceId);
        break;
      case 'delay':
        result = await executeDelayNode(node);
        break;
      case 'approval':
        result = await executeApprovalNode(node, executionId);
        break;
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }

    // Emit node_completed event
    await supabase.from('workflow_events').insert({
      execution_id: executionId,
      node_id: node.id,
      type: 'node_completed',
      data: { result, duration_ms: Date.now() - startTime },
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    // Emit node_failed event
    await supabase.from('workflow_events').insert({
      execution_id: executionId,
      node_id: node.id,
      type: 'node_failed',
      data: { error: error.message, duration_ms: Date.now() - startTime },
      timestamp: new Date().toISOString(),
    });

    throw error;
  }
}

async function executeTriggerNode(node: WorkflowNode, workspaceId: string) {
  // Triggers are entry points — just log and pass through
  return { triggered: true, node_id: node.id, type: node.data.label };
}

async function executeAgentNode(node: WorkflowNode, workspaceId: string) {
  const agentId = node.data.agentId as string;
  const task = node.data.task as string || 'Process this task';
  // Agent execution is handled by the Agent Runtime
  return { agent_id: agentId, task, status: 'delegated' };
}

async function executeConditionNode(node: WorkflowNode): Promise<string> {
  const condition = node.data.label as string || 'true';
  // Evaluate condition — in production, use a proper expression evaluator
  if (condition.includes('> 7')) return 'yes';
  if (condition.includes('>')) return 'yes';
  return 'no';
}

async function executeActionNode(node: WorkflowNode, workspaceId: string) {
  const action = node.data.label as string;
  // Log the action — actual execution handled by integration layer
  return { action, status: 'executed' };
}

async function executeDelayNode(node: WorkflowNode) {
  const label = node.data.label as string || '1h';
  // Extract delay duration
  const hours = label.includes('h') ? parseInt(label) : 1;
  await new Promise((resolve) => setTimeout(resolve, hours * 3600000));
  return { delayed_ms: hours * 3600000 };
}

async function executeApprovalNode(node: WorkflowNode, executionId: string) {
  // Emit approval_requested and pause until human responds
  await supabase.from('workflow_events').insert({
    execution_id: executionId,
    node_id: node.id,
    type: 'approval_requested',
    data: { message: 'Human approval required' },
    timestamp: new Date().toISOString(),
  });
  return { status: 'waiting_approval' };
}

/**
 * Full workflow execution: traverse graph and execute each node
 */
export async function executeWorkflow(
  executionId: string,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  workspaceId: string
): Promise<void> {
  // Find trigger node (entry point)
  const triggerNode = nodes.find((n) => n.type === 'trigger');
  if (!triggerNode) throw new Error('No trigger node found');

  let currentNode: WorkflowNode | undefined = triggerNode;

  while (currentNode) {
    await executeNode(executionId, currentNode, workspaceId);

    // Check if workflow was paused for approval
    const { data: events } = await supabase
      .from('workflow_events')
      .select('type, node_id')
      .eq('execution_id', executionId)
      .order('timestamp', { ascending: true });

    const state = computeState(events || []);
    if (state === 'paused') {
      // Stop execution — will resume when approval granted
      break;
    }

    let conditionResult: string | undefined;
    if (currentNode.type === 'condition') {
      conditionResult = await executeConditionNode(currentNode);
    }

    const nextNodes = getNextNodes(currentNode.id, nodes, edges, conditionResult);
    currentNode = nextNodes[0]; // Follow first path for now
  }

  // Update execution status
  const { data: finalEvents } = await supabase
    .from('workflow_events')
    .select('type, node_id')
    .eq('execution_id', executionId)
    .order('timestamp', { ascending: true });

  const finalState = computeState(finalEvents || []);

  await supabase.from('workflow_executions').update({
    status: finalState === 'completed' ? 'completed' : finalState === 'paused' ? 'waiting_approval' : 'failed',
    finished_at: new Date().toISOString(),
  }).eq('id', executionId);

  // Update workflow stats
  const { data: execution } = await supabase.from('workflow_executions').select('workflow_id').eq('id', executionId).single();
  if (execution) {
    const { data: allExecs } = await supabase
      .from('workflow_executions')
      .select('status')
      .eq('workflow_id', (execution as any).workflow_id);

    const successCount = allExecs?.filter((e: any) => e.status === 'completed').length || 0;
    const totalCount = allExecs?.length || 1;

    await supabase.from('workflows').update({
      runs_count: totalCount,
      success_rate: Math.round((successCount / totalCount) * 100),
      last_run: new Date().toISOString(),
    }).eq('id', (execution as any).workflow_id);
  }
}
