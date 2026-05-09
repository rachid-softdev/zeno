import { FastifyInstance } from 'fastify';
import { supabase } from '../lib/supabase.js';
import { streamChat } from '../ai/client.js';

export async function chatRoutes(app: FastifyInstance) {
  // Streaming chat endpoint (SSE)
  app.post('/stream', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { agentId, message, conversationId } = request.body as any;

    // Fetch agent + workspace context
    const { data: agent } = await supabase.from('client_agents').select('*, client_workspaces(*)').eq('id', agentId).single();
    if (!agent) return reply.status(404).send({ success: false, error: 'Agent not found' });

    const workspace = (agent as any).client_workspaces;

    // Fetch brain memories
    const { data: memories } = await supabase.from('brain_memories').select('fact').eq('workspace_id', workspace.id).eq('confirmed', true);
    const { data: rules } = await supabase.from('brain_rules').select('description').eq('workspace_id', workspace.id).eq('enabled', true);

    // Build system prompt
    const systemPrompt = `You are ${agent.name}, an AI agent working for ${workspace.name} (a ${workspace.industry} business).
Your specialty: ${agent.role}.
Your personality: ${agent.personality}.
Your capabilities: ${(agent.capabilities || []).join(', ')}.

Brand context for ${workspace.name}:
- Description: ${workspace.description}
- Tone of voice: ${(workspace.tone_of_voice || []).join(', ')}
- Target audience: ${workspace.target_audience}
- Key messages: ${(workspace.key_messages || []).join(', ')}

${memories?.length ? 'Known facts:\n' + memories.map((m: any) => `- ${m.fact}`).join('\n') : ''}
${rules?.length ? '\nRules (must follow):\n' + rules.map((r: any) => `- ${r.description}`).join('\n') : ''}

Always:
- Stay in character as ${agent.name}
- Produce agency-quality output
- Ask for clarification when the brief is too vague
- Indicate when you've completed a task vs when you need human approval
- Format outputs beautifully (use markdown: headers, bullets, tables where relevant)
- End with: "Shall I proceed?" or "Done — here's the result:"`;

    // Get or create conversation
    let convId = conversationId;
    if (!convId) {
      const { data: newConv } = await supabase.from('conversations').insert({
        agent_id: agentId,
        workspace_id: workspace.id,
      }).select('id').single();
      convId = newConv?.id;
    }

    // Save user message
    await supabase.from('messages').insert({
      conversation_id: convId,
      role: 'user',
      content: message,
    });

    // Fetch recent history
    const { data: history } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', convId)
      .order('timestamp', { ascending: true })
      .limit(20);

    const chatMessages = (history || []).map((m: any) => ({
      role: m.role === 'user' ? 'user' as const : 'assistant' as const,
      content: m.content,
    }));

    // Set up SSE
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Conversation-Id': convId,
    });

    let fullResponse = '';

    try {
      const stream = await streamChat(systemPrompt, chatMessages, 'premium_chat');
      const reader = stream.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        fullResponse += text;
        reply.raw.write(`data: ${JSON.stringify({ text, done: false })}\n\n`);
      }

      // Save agent response
      await supabase.from('messages').insert({
        conversation_id: convId,
        role: 'agent',
        content: fullResponse,
      });

      // Log AI usage
      await supabase.from('ai_usage_logs').insert({
        workspace_id: workspace.id,
        agent_id: agentId,
        model: 'claude-sonnet-4-20250514',
        input_tokens: Math.ceil((systemPrompt.length + message.length) / 4),
        output_tokens: Math.ceil(fullResponse.length / 4),
        estimated_cost: (fullResponse.length / 4) * 0.000015,
        feature_type: 'chat',
        duration_ms: 0,
      });

      reply.raw.write(`data: ${JSON.stringify({ text: '', done: true, conversationId: convId })}\n\n`);
      reply.raw.end();
    } catch (err: any) {
      reply.raw.write(`data: ${JSON.stringify({ error: err.message, done: true })}\n\n`);
      reply.raw.end();
    }
  });

  // Get conversation history
  app.get('/conversations/:agentId', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { agentId } = request.params as any;
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data: conversations };
  });

  // Get messages for a conversation
  app.get('/conversations/:conversationId/messages', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { conversationId } = request.params as any;
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return { success: true, data };
  });
}
