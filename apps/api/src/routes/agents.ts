import { FastifyInstance } from 'fastify';
import { supabase } from '../lib/supabase.js';

export async function agentRoutes(app: FastifyInstance) {
  // List agents for a workspace
  app.get('/workspace/:workspaceId', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { workspaceId } = request.params as any;
    const { data, error } = await supabase
      .from('client_agents')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { success: true, data };
  });

  // Get single agent
  app.get('/:id', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const { data, error } = await supabase.from('client_agents').select('*').eq('id', id).single();
    if (error || !data) return reply.status(404).send({ success: false, error: 'Agent not found' });
    return { success: true, data };
  });

  // Deploy new agent (from template or scratch)
  app.post('/', { onRequest: [app.authenticate] }, async (request, reply) => {
    const body = request.body as any;
    const { data, error } = await supabase.from('client_agents').insert({
      workspace_id: body.workspaceId,
      template_id: body.templateId || null,
      name: body.name,
      role: body.role,
      description: body.description || '',
      capabilities: body.capabilities || [],
      status: 'idle',
      mode: body.mode || 'review',
      avatar_color: body.avatarColor || '#3B82F6',
      personality: body.personality || 'Professional',
      connected_tools: body.tools || [],
      assigned_to: body.assignedTo || null,
    }).select().single();

    if (error) throw error;
    return { success: true, data };
  });

  // Update agent
  app.put('/:id', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const body = request.body as any;
    const { data, error } = await supabase.from('client_agents').update(body).eq('id', id).select().single();
    if (error) throw error;
    return { success: true, data };
  });

  // Delete agent
  app.delete('/:id', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const { error } = await supabase.from('client_agents').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  });

  // Get agent stats
  app.get('/:id/stats', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const { data: agent, error } = await supabase.from('client_agents').select('id, workspace_id').eq('id', id).single();
    if (error || !agent) return reply.status(404).send({ success: false, error: 'Agent not found' });

    const { count: tasksCount } = await supabase.from('ai_usage_logs').select('*', { count: 'exact', head: true }).eq('agent_id', id);
    const { data: conversations } = await supabase.from('conversations').select('id').eq('agent_id', agent.workspace_id);

    return {
      success: true,
      data: {
        tasksCompleted: tasksCount || 0,
        conversationsCount: conversations?.length || 0,
      },
    };
  });
}
