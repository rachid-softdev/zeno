import { FastifyInstance } from 'fastify';
import { supabase } from '../lib/supabase.js';

export async function analyticsRoutes(app: FastifyInstance) {
  // Agency-wide analytics
  app.get('/agency', { onRequest: [app.authenticate] }, async (request, reply) => {
    const userId = (request as any).user.sub;
    const { data: profile } = await supabase.from('profiles').select('agency_id').eq('user_id', userId).single();
    if (!profile) return reply.status(404).send({ success: false, error: 'Profile not found' });

    const { data: workspaces } = await supabase.from('client_workspaces').select('id').eq('agency_id', profile.agency_id);
    const workspaceIds = (workspaces || []).map((w: any) => w.id);

    const { count: totalTasks } = await supabase.from('ai_usage_logs').select('*', { count: 'exact', head: true }).in('workspace_id', workspaceIds);
    const { data: activeAgents } = await supabase.from('client_agents').select('id').in('workspace_id', workspaceIds).eq('status', 'active');
    const { count: totalConversations } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).in('workspace_id', workspaceIds);

    return {
      success: true,
      data: {
        totalTasks: totalTasks || 0,
        activeAgents: activeAgents?.length || 0,
        totalConversations: totalConversations || 0,
        workspacesCount: workspaces?.length || 0,
      },
    };
  });

  // Workspace analytics
  app.get('/workspace/:workspaceId', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { workspaceId } = request.params as any;

    const { count: tasks } = await supabase.from('ai_usage_logs').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId);
    const { data: agents } = await supabase.from('client_agents').select('status').eq('workspace_id', workspaceId);
    const { data: workflows } = await supabase.from('workflows').select('status, runs_count, success_rate').eq('workspace_id', workspaceId);

    // Cost summary
    const { data: costs } = await supabase.from('ai_usage_logs').select('estimated_cost').eq('workspace_id', workspaceId);
    const totalCost = (costs || []).reduce((sum: number, c: any) => sum + (c.estimated_cost || 0), 0);

    return {
      success: true,
      data: {
        tasksCompleted: tasks || 0,
        activeAgents: agents?.filter((a: any) => a.status === 'active').length || 0,
        totalAgents: agents?.length || 0,
        workflows: workflows || [],
        totalCost: Math.round(totalCost * 100) / 100,
      },
    };
  });

  // Usage logs (with date range filter)
  app.get('/usage/:workspaceId', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { workspaceId } = request.params as any;
    const { days } = request.query as any;
    const daysAgo = parseInt(days || '30', 10);

    const since = new Date(Date.now() - daysAgo * 86400000).toISOString();
    const { data, error } = await supabase
      .from('ai_usage_logs')
      .select('*')
      .eq('workspace_id', workspaceId)
      .gte('created_at', since)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  });
}
