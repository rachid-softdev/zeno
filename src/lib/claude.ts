import Anthropic from '@anthropic-ai/sdk';

const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || '';

let client: Anthropic | null = null;

export const isClaudeConfigured = () => !!apiKey;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: apiKey || 'placeholder', dangerouslyAllowBrowser: true });
  }
  return client;
}

export async function streamChat(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: Error) => void
) {
  if (!isClaudeConfigured()) {
    // Mock streaming response
    const mockResponse = generateMockResponse(systemPrompt, messages);
    let i = 0;
    const interval = setInterval(() => {
      if (i < mockResponse.length) {
        onChunk(mockResponse.slice(i, i + 3));
        i += 3;
      } else {
        clearInterval(interval);
        onDone();
      }
    }, 25);
    return;
  }

  try {
    const stream = await getClient().messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        onChunk(event.delta.text);
      }
    }
    onDone();
  } catch (err) {
    onError(err instanceof Error ? err : new Error('Stream failed'));
  }
}

function generateMockResponse(systemPrompt: string, messages: { role: string; content: string }[]): string {
  const lastMsg = messages[messages.length - 1]?.content || '';
  const nameMatch = systemPrompt.match(/You are (\w+)/);
  const agentName = nameMatch ? nameMatch[1] : 'Agent';

  return `Here's my analysis based on the context provided:\n\nI've reviewed your request regarding "${lastMsg.slice(0, 50)}..." and here's what I recommend:\n\n1. **Initial Assessment** — Based on the client's brand voice and target audience, the approach should balance professionalism with accessibility.\n\n2. **Recommended Actions:**\n   - Draft the content with SEO-optimized headers\n   - Include 2-3 data citations for credibility\n   - Schedule for review before publishing\n\n3. **Next Steps:** I'll prepare a draft based on these guidelines. Would you like me to proceed with the full version?\n\n---\n*Estimated: 1,200 words · SEO score: 92/100 · Reading time: 5 min*`;
}
