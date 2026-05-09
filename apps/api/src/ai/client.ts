import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

const anthropicApiKey = process.env.ANTHROPIC_API_KEY || '';
const openaiApiKey = process.env.OPENAI_API_KEY || '';

const anthropic = new Anthropic({ apiKey: anthropicApiKey });
const openai = new OpenAI({ apiKey: openaiApiKey });

export type ModelProvider = 'claude' | 'openai' | 'mock';

export interface ModelConfig {
  provider: ModelProvider;
  model: string;
  maxTokens: number;
}

export function getModelForTask(task: string): ModelConfig {
  switch (task) {
    case 'premium_chat':
    case 'seo_writing':
    case 'analysis':
      return { provider: 'claude', model: 'claude-sonnet-4-20250514', maxTokens: 2000 };
    case 'classification':
    case 'summarization':
      return { provider: 'claude', model: 'claude-sonnet-4-20250514', maxTokens: 500 };
    case 'json_extraction':
      return { provider: 'openai', model: 'gpt-4.1-mini', maxTokens: 500 };
    default:
      return { provider: 'claude', model: 'claude-sonnet-4-20250514', maxTokens: 1000 };
  }
}

export async function streamChat(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  task: string = 'premium_chat'
): Promise<ReadableStream> {
  const config = getModelForTask(task);

  if (config.provider === 'mock' || !anthropicApiKey) {
    return mockStream(systemPrompt);
  }

  if (config.provider === 'claude') {
    const stream = await anthropic.messages.stream({
      model: config.model,
      max_tokens: config.maxTokens,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
    });

    return new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(new TextEncoder().encode(event.delta.text));
          }
        }
        controller.close();
      },
    });
  }

  // OpenAI fallback
  const openaiStream = await openai.chat.completions.create({
    model: config.model,
    max_tokens: config.maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ],
    stream: true,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of openaiStream) {
        const text = chunk.choices[0]?.delta?.content;
        if (text) controller.enqueue(new TextEncoder().encode(text));
      }
      controller.close();
    },
  });
}

async function mockStream(systemPrompt: string): Promise<ReadableStream> {
  const nameMatch = systemPrompt.match(/You are (\w+)/);
  const agentName = nameMatch ? nameMatch[1] : 'Agent';
  const text = `Here's my analysis based on the context provided:\n\nBased on the brand voice, target audience, and my capabilities as ${agentName}, here's what I recommend:\n\n1. **Initial Assessment** — The approach should balance professionalism with accessibility for the target audience.\n\n2. **Recommended Actions:**\n   - Draft content with SEO-optimized headers\n   - Include 2-3 data citations for credibility\n   - Schedule for review before publishing\n\n3. **Next Steps:** I'll prepare a draft based on these guidelines. Shall I proceed with the full version?\n\n---\n*Estimated: 1,200 words · SEO score: 92/100 · Reading time: 5 min*`;

  const encoded = new TextEncoder().encode(text);
  return new ReadableStream({
    start(controller) {
      let offset = 0;
      const chunkSize = 5;
      const interval = setInterval(() => {
        if (offset < encoded.length) {
          controller.enqueue(encoded.slice(offset, offset + chunkSize));
          offset += chunkSize;
        } else {
          clearInterval(interval);
          controller.close();
        }
      }, 20);
    },
  });
}
