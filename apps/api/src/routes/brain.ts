import { FastifyInstance } from 'fastify';
import { supabase } from '../lib/supabase.js';

export async function brainRoutes(app: FastifyInstance) {
  // Memories
  app.get('/workspace/:workspaceId/memories', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { workspaceId } = request.params as any;
    const { data, error } = await supabase.from('brain_memories').select('*').eq('workspace_id', workspaceId).order('created_at', { ascending: false });
    if (error) throw error;
    return { success: true, data };
  });

  app.put('/memories/:id', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const body = request.body as any;
    const { data, error } = await supabase.from('brain_memories').update(body).eq('id', id).select().single();
    if (error) throw error;
    return { success: true, data };
  });

  app.delete('/memories/:id', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const { error } = await supabase.from('brain_memories').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  });

  // Documents
  app.get('/workspace/:workspaceId/documents', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { workspaceId } = request.params as any;
    const { data, error } = await supabase.from('brain_documents').select('*').eq('workspace_id', workspaceId).order('created_at', { ascending: false });
    if (error) throw error;
    return { success: true, data };
  });

  // Rules
  app.get('/workspace/:workspaceId/rules', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { workspaceId } = request.params as any;
    const { data, error } = await supabase.from('brain_rules').select('*').eq('workspace_id', workspaceId).order('created_at', { ascending: false });
    if (error) throw error;
    return { success: true, data };
  });

  app.post('/rules', { onRequest: [app.authenticate] }, async (request, reply) => {
    const body = request.body as any;
    const { data, error } = await supabase.from('brain_rules').insert({
      workspace_id: body.workspaceId,
      description: body.description,
      enabled: body.enabled ?? true,
    }).select().single();
    if (error) throw error;
    return { success: true, data };
  });

  app.put('/rules/:id', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const body = request.body as any;
    const { data, error } = await supabase.from('brain_rules').update(body).eq('id', id).select().single();
    if (error) throw error;
    return { success: true, data };
  });

  app.delete('/rules/:id', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const { error } = await supabase.from('brain_rules').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  });
}
