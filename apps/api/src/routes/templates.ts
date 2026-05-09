import { FastifyInstance } from 'fastify';
import { supabase } from '../lib/supabase.js';

export async function templateRoutes(app: FastifyInstance) {
  app.get('/', { onRequest: [app.authenticate] }, async (request, reply) => {
    const userId = (request as any).user.sub;
    const { data: profile } = await supabase.from('profiles').select('agency_id').eq('user_id', userId).single();
    if (!profile) return reply.status(404).send({ success: false, error: 'Profile not found' });

    const { data, error } = await supabase
      .from('agent_templates')
      .select('*')
      .eq('agency_id', profile.agency_id)
      .order('deployment_count', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  });

  app.post('/', { onRequest: [app.authenticate] }, async (request, reply) => {
    const userId = (request as any).user.sub;
    const { data: profile } = await supabase.from('profiles').select('agency_id').eq('user_id', userId).single();
    const body = request.body as any;

    const { data, error } = await supabase.from('agent_templates').insert({
      agency_id: profile.agency_id,
      name: body.name,
      description: body.description,
      role: body.role,
      capabilities: body.capabilities || [],
      category: body.category,
      personality: body.personality,
      tools: body.tools || [],
    }).select().single();

    if (error) throw error;
    return { success: true, data };
  });

  app.put('/:id', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const body = request.body as any;
    const { data, error } = await supabase.from('agent_templates').update(body).eq('id', id).select().single();
    if (error) throw error;
    return { success: true, data };
  });

  app.delete('/:id', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const { error } = await supabase.from('agent_templates').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  });
}
