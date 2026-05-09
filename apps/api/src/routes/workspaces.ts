import { FastifyInstance } from 'fastify';
import { supabase } from '../lib/supabase.js';

export async function workspaceRoutes(app: FastifyInstance) {
  // List all workspaces for the authenticated user's agency
  app.get('/', { onRequest: [app.authenticate] }, async (request, reply) => {
    const userId = (request as any).user.sub;
    const { data: profile } = await supabase.from('profiles').select('agency_id').eq('user_id', userId).single();
    if (!profile) return reply.status(404).send({ success: false, error: 'Profile not found' });

    const { data: workspaces, error } = await supabase
      .from('client_workspaces')
      .select('*')
      .eq('agency_id', profile.agency_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data: workspaces };
  });

  // Get single workspace
  app.get('/:id', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const { data, error } = await supabase.from('client_workspaces').select('*').eq('id', id).single();
    if (error || !data) return reply.status(404).send({ success: false, error: 'Workspace not found' });
    return { success: true, data };
  });

  // Create workspace
  app.post('/', { onRequest: [app.authenticate] }, async (request, reply) => {
    const userId = (request as any).user.sub;
    const { data: profile } = await supabase.from('profiles').select('agency_id, role').eq('user_id', userId).single();
    if (!profile || !['owner', 'manager'].includes(profile.role)) {
      return reply.status(403).send({ success: false, error: 'Forbidden' });
    }

    const body = request.body as any;
    const { data, error } = await supabase.from('client_workspaces').insert({
      agency_id: profile.agency_id,
      name: body.name,
      industry: body.industry,
      website: body.website,
      description: body.description,
      tone_of_voice: body.toneOfVoice || [],
      target_audience: body.targetAudience,
      key_messages: body.keyMessages || [],
      primary_goal: body.primaryGoal,
    }).select().single();

    if (error) throw error;
    return { success: true, data };
  });

  // Update workspace
  app.put('/:id', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const body = request.body as any;
    const { data, error } = await supabase.from('client_workspaces').update(body).eq('id', id).select().single();
    if (error) throw error;
    return { success: true, data };
  });

  // Delete workspace
  app.delete('/:id', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const { error } = await supabase.from('client_workspaces').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  });
}
