import { FastifyInstance } from 'fastify';
import { supabase } from '../lib/supabase.js';

export async function workflowRoutes(app: FastifyInstance) {
  app.get('/workspace/:workspaceId', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { workspaceId } = request.params as any;
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  });

  app.get('/:id', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const { data, error } = await supabase.from('workflows').select('*').eq('id', id).single();
    if (error || !data) return reply.status(404).send({ success: false, error: 'Workflow not found' });
    return { success: true, data };
  });

  app.post('/', { onRequest: [app.authenticate] }, async (request, reply) => {
    const body = request.body as any;
    const { data, error } = await supabase.from('workflows').insert({
      workspace_id: body.workspaceId,
      name: body.name,
      description: body.description,
      status: 'draft',
      definition: body.definition || { nodes: [], edges: [] },
    }).select().single();

    if (error) throw error;
    return { success: true, data };
  });

  app.put('/:id', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const body = request.body as any;
    const { data, error } = await supabase.from('workflows').update(body).eq('id', id).select().single();
    if (error) throw error;
    return { success: true, data };
  });

  // Execute workflow
  app.post('/:id/execute', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const { data: workflow, error: wfError } = await supabase.from('workflows').select('*').eq('id', id).single();
    if (wfError || !workflow) return reply.status(404).send({ success: false, error: 'Workflow not found' });

    // Create execution record
    const { data: execution, error: execError } = await supabase.from('workflow_executions').insert({
      workflow_id: id,
      workspace_id: workflow.workspace_id,
      status: 'running',
      triggered_by: 'api',
    }).select().single();

    if (execError) throw execError;

    // Emit first node event
    const nodes = (workflow.definition as any).nodes || [];
    if (nodes.length > 0) {
      await supabase.from('workflow_events').insert({
        execution_id: execution.id,
        node_id: nodes[0].id,
        type: 'node_started',
        data: { node_type: nodes[0].type },
      });
    }

    // TODO: Enqueue to BullMQ for async execution

    return { success: true, data: execution };
  });

  // Get execution history
  app.get('/:id/executions', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const { data, error } = await supabase
      .from('workflow_executions')
      .select('*')
      .eq('workflow_id', id)
      .order('started_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return { success: true, data };
  });

  // Get execution events (for replay)
  app.get('/executions/:executionId/events', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { executionId } = request.params as any;
    const { data, error } = await supabase
      .from('workflow_events')
      .select('*')
      .eq('execution_id', executionId)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return { success: true, data };
  });
}
