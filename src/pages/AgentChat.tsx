import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getClientAgents, mockConversations } from '../lib/mockData';
import { useAppStore } from '../stores/appStore';
import { streamChat, isClaudeConfigured } from '../lib/claude';
import { AgentInspector } from '../components/ui/AgentInspector';
import type { ConversationMessage } from '../lib/types';
import { Send, Paperclip, Settings, Info, History, BarChart3, ArrowLeft, Sparkles, Zap, Bug, ShieldAlert, Slash } from 'lucide-react';
import toast from 'react-hot-toast';

export function AgentChat() {
  const { id, agentId } = useParams<{ id: string; agentId: string }>();
  const navigate = useNavigate();
  const { getClient: getClientFn, sandboxMode } = useAppStore();
  const client = getClientFn(id!);
  const agents = getClientAgents(id!);
  const agent = agents.find((a) => a.id === agentId);

  const [messages, setMessages] = useState<ConversationMessage[]>(
    mockConversations[agentId!] || []
  );
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<'about' | 'history' | 'config' | 'stats'>('about');
  const [isThinking, setIsThinking] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [slashMenu, setSlashMenu] = useState<{ open: boolean; filter: string; selected: number }>({ open: false, filter: '', selected: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  if (!agent || !client) {
    return <div className="p-8 text-text-muted text-center">Agent not found.</div>;
  }

  const handleSend = () => {
    if (!input.trim() || isThinking) return;
    const userMsg: ConversationMessage = {
      id: `msg_${Date.now()}`,
      agentId: agentId!,
      role: 'user',
      content: input,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    const systemPrompt = `You are ${agent.name}, an AI agent working for ${client.name} (a ${client.industry} business).
Your specialty: ${agent.role}.
Your personality: ${agent.personality}.
Your capabilities: ${agent.capabilities.join(', ')}.

Brand context for ${client.name}:
- Description: ${client.description}
- Tone of voice: ${client.toneOfVoice.join(', ')}
- Target audience: ${client.targetAudience}
- Key messages: ${client.keyMessages.join(', ')}

Agency guidelines (from Atelier Bold):
- Always produce agency-quality output
- Ask for clarification when brief is too vague
- Indicate when you've completed a task vs when you need human approval
- Format outputs beautifully (use markdown)

Always:
- Stay in character as ${agent.name}
- Produce agency-quality output
- Ask for clarification when brief is too vague
- Indicate when you've completed a task vs when you need human approval
- Format outputs beautifully (use markdown: headers, bullets, tables where relevant)
- End action-items with: "Shall I proceed?" or "Done — here's the result:"`;

    const chatMessages = messages
      .filter((m) => m.role === 'user' || m.role === 'agent')
      .map((m) => ({
        role: m.role === 'user' ? 'user' as const : 'assistant' as const,
        content: m.content,
      }));
    chatMessages.push({ role: 'user' as const, content: input });

    setIsThinking(true);
    let streamedContent = '';
    const agentMsgId = `msg_${Date.now() + 1}`;

    streamChat(
      systemPrompt,
      chatMessages,
      (chunk) => {
        streamedContent += chunk;
        setMessages((prev) => {
          const existing = prev.find((m) => m.id === agentMsgId);
          if (existing) {
            return prev.map((m) => m.id === agentMsgId ? { ...m, content: streamedContent } : m);
          }
          return [...prev, { id: agentMsgId, agentId: agentId!, role: 'agent', content: streamedContent, timestamp: 'Just now' }];
        });
      },
      () => {
        setIsThinking(false);
      },
      (err) => {
        setIsThinking(false);
        setMessages((prev) => [...prev, {
          id: `msg_err_${Date.now()}`,
          agentId: agentId!,
          role: 'system',
          content: isClaudeConfigured() ? `Error: ${err.message}` : 'Response generated in demo mode.',
          timestamp: 'Just now',
        }]);
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Slash menu navigation
    if (slashMenu.open) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSlashMenu((s) => ({ ...s, selected: Math.min(s.selected + 1, filteredCommands.length - 1) }));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSlashMenu((s) => ({ ...s, selected: Math.max(s.selected - 1, 0) }));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = filteredCommands[slashMenu.selected];
        if (cmd) {
          if (cmd.cmd === '/help') {
            setInput('/help — Available: /report, /brief, /schedule, /analyze');
          } else {
            setInput(cmd.template);
          }
        }
        setSlashMenu({ open: false, filter: '', selected: 0 });
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setSlashMenu({ open: false, filter: '', selected: 0 });
        return;
      }
    }

    // Normal send
    if (e.key === 'Enter' && !e.shiftKey && !slashMenu.open) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    // Detect slash command
    if (value.startsWith('/') && !value.includes(' ')) {
      setSlashMenu({ open: true, filter: value, selected: 0 });
    } else if (slashMenu.open && !value.startsWith('/')) {
      setSlashMenu({ open: false, filter: '', selected: 0 });
    }
  };

  const quickActions = [
    { label: 'Write a blog post', icon: '✍️' },
    { label: 'Generate meta descriptions', icon: '📝' },
    { label: 'Keyword analysis', icon: '🔍' },
  ];

  const slashCommands = [
    { cmd: '/report', desc: 'Generate a status report', template: 'Generate a status report for this week\'s agent activities across all channels.' },
    { cmd: '/brief', desc: 'Create a content brief', template: 'Create a detailed content brief covering target audience, key messages, SEO keywords, and outline.' },
    { cmd: '/schedule', desc: 'Schedule social posts', template: 'Plan and draft social media posts for the upcoming week across all connected platforms.' },
    { cmd: '/analyze', desc: 'Analyze connected data', template: 'Analyze the connected data sources (analytics, CRM, social) and provide actionable insights.' },
    { cmd: '/help', desc: 'Show available commands', template: '/help' },
  ];

  const filteredCommands = useMemo(() => {
    if (!slashMenu.open) return slashCommands;
    return slashCommands.filter((c) => c.cmd.includes(slashMenu.filter.toLowerCase()));
  }, [slashMenu.open, slashMenu.filter]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-border-subtle bg-bg-surface/50">
          <button onClick={() => navigate(`/app/clients/${id}/agents`)} className="p-1 rounded hover:bg-bg-hover text-text-muted">
            <ArrowLeft size={18} />
          </button>
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: agent.avatarColor }}
          >
            {agent.name.slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-text-primary">{agent.name}</h2>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'active' ? 'bg-accent-secondary' : 'bg-text-muted'}`} />
              {agent.status === 'active' ? 'Active' : 'Idle'} · {agent.role}
            </div>
          </div>
          <button onClick={() => toast('Agent settings coming soon')} className="p-1.5 rounded hover:bg-bg-hover text-text-muted">
            <Settings size={16} />
          </button>
          <button onClick={() => setShowInspector(true)} className="p-1.5 rounded hover:bg-bg-hover text-text-muted hover:text-accent-primary" title="Agent Inspector">
            <Bug size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {sandboxMode && (
            <div className="flex items-center gap-2 px-4 py-2 bg-accent-warning/10 border border-accent-warning/20 rounded-xl text-xs text-accent-warning">
              <ShieldAlert size={14} /> Sandbox mode active — no emails will be sent, no posts will be published
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'system' ? (
                <div className="text-center text-xs text-text-muted py-2">{msg.content}</div>
              ) : msg.role === 'tool' ? (
                <div className="bg-bg-elevated border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-secondary max-w-md">
                  {msg.content}
                </div>
              ) : (
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-accent-primary text-white rounded-br-md'
                      : 'bg-bg-surface border border-border-subtle text-text-primary rounded-bl-md'
                  }`}
                >
                  {msg.role === 'agent' && (
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center text-white text-[8px] font-bold"
                        style={{ backgroundColor: agent.avatarColor }}
                      >
                        {agent.name.slice(0, 2)}
                      </div>
                      <span className="text-xs font-medium text-text-secondary">{agent.name}</span>
                    </div>
                  )}
                  {msg.role === 'agent' ? (
                    <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none prose-headings:text-text-primary prose-p:text-text-secondary prose-strong:text-text-primary prose-code:bg-bg-elevated prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-accent-primary prose-pre:bg-bg-elevated prose-pre:border prose-pre:border-border-subtle prose-ol:text-text-secondary prose-ul:text-text-secondary prose-li:text-text-secondary prose-a:text-accent-primary">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                  )}
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-bg-surface border border-border-subtle rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center animate-pulse-ring"
                    style={{ backgroundColor: agent.avatarColor }}
                  />
                  <span className="text-sm text-text-muted">Thinking...</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border-subtle bg-bg-surface/30 relative">
          <div className="flex items-center gap-2 mb-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => setInput(action.label)}
                className="text-xs px-3 py-1 rounded-full bg-bg-hover text-text-muted hover:text-text-secondary transition-colors"
              >
                {action.icon} {action.label}
              </button>
            ))}
          </div>

          {/* Slash commands popover */}
          {slashMenu.open && (
            <div className="absolute bottom-full left-4 mb-2 w-64 bg-bg-surface border border-border-subtle rounded-xl shadow-2xl overflow-hidden z-20">
              <div className="px-3 py-2 border-b border-border-subtle text-[10px] text-text-muted uppercase tracking-wider">Commands</div>
              {filteredCommands.map((cmd, i) => (
                <div
                  key={cmd.cmd}
                  onClick={() => {
                    if (cmd.cmd === '/help') {
                      setInput('/help — Available: /report, /brief, /schedule, /analyze');
                    } else {
                      setInput(cmd.template);
                    }
                    setSlashMenu({ open: false, filter: '', selected: 0 });
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
                    i === slashMenu.selected ? 'bg-accent-primary/10' : 'hover:bg-bg-hover'
                  }`}
                >
                  <Slash size={14} className="text-accent-primary flex-shrink-0" />
                  <div>
                    <div className="text-sm text-text-primary font-medium">{cmd.cmd}</div>
                    <div className="text-[10px] text-text-muted">{cmd.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2">
            <button onClick={() => toast('Attachments coming soon')} className="p-2 rounded-lg hover:bg-bg-hover text-text-muted transition-colors">
              <Paperclip size={18} />
            </button>
            <textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${agent.name}...  Type / for commands`}
              className="flex-1 bg-bg-surface border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 resize-none transition-colors"
              rows={1}
              style={{ maxHeight: '120px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isThinking}
              className={`p-2.5 rounded-xl transition-all ${
                input.trim() && !isThinking
                  ? 'bg-accent-primary text-white hover:brightness-110 active:scale-95'
                  : 'bg-bg-elevated text-text-muted'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Context Panel */}
      <div className="w-72 border-l border-border-subtle bg-bg-surface/30 hidden lg:flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-border-subtle">
          {(['about', 'history', 'config', 'stats'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs font-medium capitalize transition-colors ${
                activeTab === tab ? 'text-accent-primary border-b-2 border-accent-primary' : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {tab === 'about' && <Info size={14} className="inline mr-1" />}
              {tab === 'history' && <History size={14} className="inline mr-1" />}
              {tab === 'config' && <Settings size={14} className="inline mr-1" />}
              {tab === 'stats' && <BarChart3 size={14} className="inline mr-1" />}
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">About</h4>
                <p className="text-sm text-text-secondary">{agent.description}</p>
              </div>
              <div>
                <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">Capabilities</h4>
                <div className="flex flex-wrap gap-1.5">
                  {agent.capabilities.map((c) => (
                    <span key={c} className="text-xs px-2 py-1 rounded bg-bg-hover text-text-secondary">{c}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">Connected Tools</h4>
                <div className="space-y-1.5">
                  {agent.connectedTools.map((t) => (
                    <div key={t} className="flex items-center gap-2 text-sm text-text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary" /> {t}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">Training</h4>
                <p className="text-xs text-text-secondary">Trained on brand guidelines and 3 documents · Last updated 2d ago</p>
              </div>
            </div>
          )}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <p className="text-xs text-text-muted">Past conversations</p>
              {['Yesterday', '2 days ago', 'Last week'].map((date) => (
                <div key={date} className="p-2 rounded-lg bg-bg-surface border border-border-subtle cursor-pointer hover:border-border-active">
                  <div className="text-xs text-text-secondary">{date}</div>
                  <div className="text-xs text-text-muted mt-0.5">3 message exchange</div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'config' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-muted block mb-1">Approval mode</label>
                <select className="w-full bg-bg-surface border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary" defaultValue={agent.mode}>
                  <option value="suggestion">Suggestion only</option>
                  <option value="review">Review required</option>
                  <option value="autonomous">Autonomous</option>
                </select>
              </div>
              <button className="w-full py-2 border border-border-subtle rounded-lg text-xs text-text-secondary hover:border-border-active transition-colors">
                Save as agency template
              </button>
            </div>
          )}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="bg-bg-surface border border-border-subtle rounded-lg p-3">
                <div className="text-xs text-text-muted">Tasks completed (this month)</div>
                <div className="font-mono text-xl text-text-primary mt-1">{agent.tasksThisWeek * 4}</div>
              </div>
              <div className="bg-bg-surface border border-border-subtle rounded-lg p-3">
                <div className="text-xs text-text-muted">Avg response time</div>
                <div className="font-mono text-xl text-text-primary mt-1">1.2s</div>
              </div>
              <div className="bg-bg-surface border border-border-subtle rounded-lg p-3">
                <div className="text-xs text-text-muted">Hours saved</div>
                <div className="font-mono text-xl text-text-primary mt-1">{agent.hoursSaved * 4}h</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AgentInspector
        isOpen={showInspector}
        onClose={() => setShowInspector(false)}
        agent={agent}
      />
    </div>
  );
}
