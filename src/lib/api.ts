// API Client — connects frontend to Zeno backend
// Falls back to mock data when API is unavailable

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getToken(): string | null {
  return localStorage.getItem('zeno-auth-token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Auth ──
export const api = {
  health: () => request<{ status: string }>('/health'),

  // Workspaces
  workspaces: {
    list: () => request<any>('/workspaces'),
    get: (id: string) => request<any>(`/workspaces/${id}`),
    create: (data: any) => request<any>('/workspaces', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/workspaces/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/workspaces/${id}`, { method: 'DELETE' }),
  },

  // Agents
  agents: {
    list: (workspaceId: string) => request<any>(`/agents/workspace/${workspaceId}`),
    get: (id: string) => request<any>(`/agents/${id}`),
    create: (data: any) => request<any>('/agents', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/agents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/agents/${id}`, { method: 'DELETE' }),
  },

  // Templates
  templates: {
    list: () => request<any>('/templates'),
    create: (data: any) => request<any>('/templates', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/templates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/templates/${id}`, { method: 'DELETE' }),
  },

  // Workflows
  workflows: {
    list: (workspaceId: string) => request<any>(`/workflows/workspace/${workspaceId}`),
    get: (id: string) => request<any>(`/workflows/${id}`),
    create: (data: any) => request<any>('/workflows', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/workflows/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    execute: (id: string) => request<any>(`/workflows/${id}/execute`, { method: 'POST' }),
    executions: (id: string) => request<any>(`/workflows/${id}/executions`),
    events: (executionId: string) => request<any>(`/workflows/executions/${executionId}/events`),
  },

  // Chat (SSE streaming)
  chat: {
    stream: (agentId: string, message: string, conversationId?: string, onChunk?: (text: string) => void, onDone?: (convId: string) => void, onError?: (err: Error) => void) => {
      const token = getToken();
      fetch(`${API_URL}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token || ''}` },
        body: JSON.stringify({ agentId, message, conversationId }),
      }).then(async (res) => {
        if (!res.ok) throw new Error('Stream failed');
        const reader = res.body?.getReader();
        if (!reader) throw new Error('No reader');

        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.error) onError?.(new Error(data.error));
                else if (data.done) onDone?.(data.conversationId);
                else if (data.text) onChunk?.(data.text);
              } catch {}
            }
          }
        }
      }).catch((err) => onError?.(err));
    },
  },

  // Brain
  brain: {
    memories: (workspaceId: string) => request<any>(`/brain/workspace/${workspaceId}/memories`),
    updateMemory: (id: string, data: any) => request<any>(`/brain/memories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteMemory: (id: string) => request<any>(`/brain/memories/${id}`, { method: 'DELETE' }),
    rules: (workspaceId: string) => request<any>(`/brain/workspace/${workspaceId}/rules`),
    createRule: (data: any) => request<any>('/brain/rules', { method: 'POST', body: JSON.stringify(data) }),
    updateRule: (id: string, data: any) => request<any>(`/brain/rules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteRule: (id: string) => request<any>(`/brain/rules/${id}`, { method: 'DELETE' }),
  },

  // Analytics
  analytics: {
    agency: () => request<any>('/analytics/agency'),
    workspace: (id: string) => request<any>(`/analytics/workspace/${id}`),
    usage: (workspaceId: string, days?: number) => request<any>(`/analytics/usage/${workspaceId}?days=${days || 30}`),
  },
};
