import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code, Search, Wrench, DollarSign, Activity } from 'lucide-react';
import type { ClientAgent } from '../lib/types';

interface AgentInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  agent: ClientAgent;
  lastPrompt?: string;
  lastContext?: string;
}

export function AgentInspector({ isOpen, onClose, agent, lastPrompt, lastContext }: AgentInspectorProps) {
  if (!isOpen) return null;

  const tabs = [
    { id: 'prompt', label: 'Prompt', icon: Code },
    { id: 'context', label: 'Context', icon: Search },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'cost', label: 'Cost', icon: DollarSign },
    { id: 'trace', label: 'Trace', icon: Activity },
  ];

  const [activeTab, setActiveTab] = useState('prompt');

  const mockTrace = [
    { step: 1, action: 'Context Builder', detail: 'Loaded 3 memories, 2 rules, brand DNA', duration: '45ms' },
    { step: 2, action: 'Policy Engine', detail: 'All guardrails passed', duration: '12ms' },
    { step: 3, action: 'Model Router', detail: 'Selected claude-sonnet-4-20250514', duration: '8ms' },
    { step: 4, action: 'Prompt Composer', detail: 'Assembled 2,450 token prompt', duration: '23ms' },
    { step: 5, action: 'LLM Call', detail: 'Streamed 1,200 tokens in 3.2s', duration: '3,200ms' },
    { step: 6, action: 'Post Processor', detail: 'Output validated, no PII detected', duration: '18ms' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="bg-bg-surface border border-border-subtle rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border-subtle">
            <div>
              <h3 className="font-display font-semibold text-text-primary">Agent Inspector</h3>
              <p className="text-xs text-text-muted mt-0.5">{agent.name} · {agent.role}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg-hover text-text-muted"><X size={18} /></button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border-subtle">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === tab.id ? 'text-accent-primary border-b-2 border-accent-primary' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'prompt' && (
              <div className="space-y-3">
                <p className="text-xs text-text-muted">Full system prompt sent to Claude:</p>
                <pre className="bg-bg-base border border-border-subtle rounded-xl p-4 text-xs text-text-secondary whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto font-mono">
{lastPrompt || `You are ${agent.name}, an AI agent working for [Client] (a [Industry] business).
Your specialty: ${agent.role}.
Your personality: ${agent.personality}.
Your capabilities: ${agent.capabilities.join(', ')}.

Brand context:
- Tone of voice: [Client tones]
- Target audience: [Client audience]

Known facts:
- [Memory items]

Rules (must follow):
- [Active rules]

Always:
- Stay in character as ${agent.name}
- Produce agency-quality output
- Format outputs using markdown
- Indicate when you need human approval`}
                </pre>
              </div>
            )}

            {activeTab === 'context' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">Client Brand DNA</h4>
                  <div className="bg-bg-base border border-border-subtle rounded-xl p-3 text-xs text-text-secondary">
                    {lastContext || `Industry: [Client industry]\nTone: Professional, Bold\nAudience: Decision-makers\nKey messages: Automation, Security, Speed`}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">Injected Memories (3)</h4>
                  <div className="space-y-1">
                    {['Primary contact prefers WhatsApp', 'Blog posts min 1,500 words', 'Quarterly report due 15th'].map((m, i) => (
                      <div key={i} className="text-xs text-text-secondary flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-accent-secondary" /> {m}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">Active Rules (3)</h4>
                  <div className="space-y-1">
                    {['Always use formal language', 'Require approval before publishing', 'No weekend contact'].map((r, i) => (
                      <div key={i} className="text-xs text-text-secondary flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-accent-warning" /> {r}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="space-y-3">
                <p className="text-xs text-text-muted">Tools called during this conversation:</p>
                {[
                  { name: 'search_knowledge_base', status: 'success', result: 'Found 3 relevant documents', time: '120ms' },
                  { name: 'analyze_tone_of_voice', status: 'success', result: 'Tone matched: Professional (92% confidence)', time: '85ms' },
                ].map((tool, i) => (
                  <div key={i} className="bg-bg-base border border-border-subtle rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-mono text-accent-primary">{tool.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${tool.status === 'success' ? 'bg-accent-secondary/10 text-accent-secondary' : 'bg-accent-danger/10 text-accent-danger'}`}>{tool.status}</span>
                    </div>
                    <div className="text-xs text-text-secondary">{tool.result}</div>
                    <div className="text-[10px] text-text-muted mt-1">{tool.time}</div>
                  </div>
                ))}
                <p className="text-xs text-text-muted mt-2">Available tools: {agent.connectedTools.join(', ')}</p>
              </div>
            )}

            {activeTab === 'cost' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-bg-base border border-border-subtle rounded-xl p-3 text-center">
                    <div className="text-xs text-text-muted">Input Tokens</div>
                    <div className="font-mono text-xl text-text-primary">2,450</div>
                  </div>
                  <div className="bg-bg-base border border-border-subtle rounded-xl p-3 text-center">
                    <div className="text-xs text-text-muted">Output Tokens</div>
                    <div className="font-mono text-xl text-text-primary">1,200</div>
                  </div>
                  <div className="bg-bg-base border border-border-subtle rounded-xl p-3 text-center">
                    <div className="text-xs text-text-muted">Model</div>
                    <div className="font-mono text-sm text-text-primary mt-1">claude-sonnet-4</div>
                  </div>
                  <div className="bg-bg-base border border-border-subtle rounded-xl p-3 text-center">
                    <div className="text-xs text-text-muted">Est. Cost</div>
                    <div className="font-mono text-xl text-accent-secondary">$0.018</div>
                  </div>
                </div>
                <div className="bg-bg-base border border-border-subtle rounded-xl p-3">
                  <div className="text-xs text-text-muted mb-2">This conversation</div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Total tokens: 3,650</span>
                    <span className="text-text-secondary">Duration: 3.4s</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'trace' && (
              <div className="space-y-0">
                {mockTrace.map((step, i) => (
                  <div key={i} className="relative pl-6 pb-4 last:pb-0">
                    {i < mockTrace.length - 1 && (
                      <div className="absolute left-[7px] top-6 bottom-0 w-px bg-border-subtle" />
                    )}
                    <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-accent-primary bg-bg-surface flex items-center justify-center">
                      <div className="w-[7px] h-[7px] rounded-full bg-accent-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-text-primary font-medium">{step.action}</div>
                      <div className="text-xs text-text-secondary">{step.detail}</div>
                      <div className="text-[10px] text-text-muted mt-0.5">{step.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
