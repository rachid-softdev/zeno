import { FastifyInstance } from 'fastify';
import { supabase } from '../lib/supabase.js';

export async function inboxRoutes(app: FastifyInstance) {
  app.get('/workspace/:workspaceId', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { workspaceId } = request.params as any;
    const { channel, status } = request.query as any;

    let query = supabase.from('inbox_threads').select('*').eq('workspace_id', workspaceId);
    if (channel) query = query.eq('channel', channel);
    if (status) query = query.eq('status', status);

    const { data, error } = await query.order('updated_at', { ascending: false });
    if (error) throw error;
    return { success: true, data };
  });

  app.put('/:id', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const body = request.body as any;
    const { data, error } = await supabase.from('inbox_threads').update(body).eq('id', id).select().single();
    if (error) throw error;
    return { success: true, data };
  });
}
