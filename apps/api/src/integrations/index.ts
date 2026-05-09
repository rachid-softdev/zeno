// Integration Layer — Normalized adapters for external services
// Each provider implements a common interface for the workflow engine

export interface IntegrationAdapter {
  provider: string;
  connect(credentials: Record<string, unknown>): Promise<void>;
  disconnect(): Promise<void>;
  sendMessage?(params: { to: string; subject?: string; body: string }): Promise<void>;
  getMessages?(params: { limit?: number }): Promise<unknown[]>;
  createTask?(params: { title: string; description: string; dueDate?: string }): Promise<void>;
  updateCRM?(params: { leadId: string; data: Record<string, unknown> }): Promise<void>;
  postContent?(params: { text: string; media?: string[] }): Promise<void>;
}

// ── Gmail Adapter ──
export class GmailAdapter implements IntegrationAdapter {
  provider = 'gmail';

  async connect(credentials: Record<string, unknown>) {
    // OAuth2 with Gmail API
    return Promise.resolve();
  }

  async disconnect() {
    return Promise.resolve();
  }

  async sendMessage(params: { to: string; subject?: string; body: string }) {
    // Gmail API: users.messages.send
    console.log(`[Gmail] Sending to ${params.to}: ${params.body.slice(0, 50)}...`);
  }

  async getMessages(params: { limit?: number }) {
    // Gmail API: users.messages.list
    console.log(`[Gmail] Fetching ${params.limit || 10} messages`);
    return [];
  }
}

// ── Notion Adapter ──
export class NotionAdapter implements IntegrationAdapter {
  provider = 'notion';

  async connect(credentials: Record<string, unknown>) {
    return Promise.resolve();
  }

  async disconnect() {
    return Promise.resolve();
  }

  async createTask(params: { title: string; description: string; dueDate?: string }) {
    console.log(`[Notion] Creating task: ${params.title}`);
  }
}

// ── HubSpot Adapter ──
export class HubSpotAdapter implements IntegrationAdapter {
  provider = 'hubspot';

  async connect(credentials: Record<string, unknown>) {
    return Promise.resolve();
  }

  async disconnect() {
    return Promise.resolve();
  }

  async updateCRM(params: { leadId: string; data: Record<string, unknown> }) {
    console.log(`[HubSpot] Updating lead ${params.leadId}`);
  }
}

// ── Slack Adapter ──
export class SlackAdapter implements IntegrationAdapter {
  provider = 'slack';

  async connect(credentials: Record<string, unknown>) {
    return Promise.resolve();
  }

  async disconnect() {
    return Promise.resolve();
  }

  async sendMessage(params: { to: string; body: string }) {
    console.log(`[Slack] Sending to ${params.to}: ${params.body.slice(0, 50)}...`);
  }
}

// ── Adapter Factory ──
const adapters: Record<string, new () => IntegrationAdapter> = {
  gmail: GmailAdapter,
  outlook: GmailAdapter, // Reuse for now
  notion: NotionAdapter,
  hubspot: HubSpotAdapter,
  slack: SlackAdapter,
};

export function getAdapter(provider: string): IntegrationAdapter {
  const Adapter = adapters[provider];
  if (!Adapter) throw new Error(`Unknown integration provider: ${provider}`);
  return new Adapter();
}

// ── Normalized Event System ──
// Converts provider-specific events to Zeno's unified event format
export function normalizeEvent(provider: string, rawEvent: unknown): {
  type: 'message.received' | 'message.sent' | 'lead.created' | 'task.completed';
  data: Record<string, unknown>;
} {
  switch (provider) {
    case 'gmail':
      return { type: 'message.received', data: rawEvent as Record<string, unknown> };
    case 'slack':
      return { type: 'message.received', data: rawEvent as Record<string, unknown> };
    case 'hubspot':
      return { type: 'lead.created', data: rawEvent as Record<string, unknown> };
    default:
      return { type: 'message.received', data: rawEvent as Record<string, unknown> };
  }
}
