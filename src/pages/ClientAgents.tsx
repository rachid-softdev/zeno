import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getClientAgents } from '../lib/mockData';
import { Bot, MessageCircle, Settings, BarChart3, MoreHorizontal, Plus, X, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

type CreatorStep = 'choose' | 'name' | 'capabilities' | 'personality' | 'tools' | 'test' | 'done';

export function ClientAgents() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const agents = getClientAgents(id!);
  const [showCreator, setShowCreator] = useState(false);
  const [creatorStep, setCreatorStep] = useState<CreatorStep>('choose');
  const [creatorMode, setCreatorMode] = useState<'template' | 'scratch' | null>(null);
  const [agentName, setAgentName] = useState('');
  const [agentRole, setAgentRole] = useState('');
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [personalityFormal, setPersonalityFormal] = useState(50);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  const allCapabilities = ['Content generation', 'SEO optimization', 'Keyword research', 'Email classification', 'Response drafting', 'Lead scoring', 'Email outreach', 'Calendar booking', 'Social scheduling', 'Data analysis', 'Report generation', 'Post generation', 'Visual content'];

  const allTools = ['WordPress', 'Gmail', 'Outlook', 'SEMrush', 'Google Analytics', 'Meta Ads', 'HubSpot', 'Calendly', 'LinkedIn', 'Instagram', 'Shopify', 'Notion', 'Slack'];

  const openCreator = () => { setShowCreator(true); setCreatorStep('choose'); setCreatorMode(null); };
  const closeCreator = () => setShowCreator(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Agents ({agents.length})</h1>
          <p className="text-text-secondary text-sm mt-1">Manage and configure agents for this client workspace.</p>
        </div>
        <button onClick={openCreator} className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg text-sm font-medium hover:brightness-110 transition-all active:scale-95">
          <Plus size={16} /> Deploy new agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-bg-surface border border-border-subtle rounded-xl p-5 hover:border-border-active transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: `linear-gradient(135deg, ${agent.avatarColor}, ${agent.avatarColor}88)` }}
                >
                  {agent.name.slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-text-primary">{agent.name}</h3>
                  <div className="text-xs text-text-muted">{agent.role}</div>
                </div>
              </div>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                agent.status === 'active' ? 'bg-accent-secondary animate-pulse' : 'bg-text-muted'
              }`} />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-border-subtle">
              <div className="text-center">
                <div className="font-mono text-lg text-text-primary">{agent.tasksThisWeek}</div>
                <div className="text-[10px] text-text-muted">tasks</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-lg text-text-primary">{agent.messagesHandled}</div>
                <div className="text-[10px] text-text-muted">messages</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-lg text-text-primary">{agent.hoursSaved}h</div>
                <div className="text-[10px] text-text-muted">saved</div>
              </div>
            </div>
            <p className="text-xs text-text-secondary mb-4 truncate">{agent.lastAction} · {agent.lastActionTime}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(`/app/clients/${id}/chat/${agent.id}`)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-accent-primary/10 text-accent-primary text-xs rounded-lg hover:bg-accent-primary/20 transition-colors">
                <MessageCircle size={14} /> Chat
              </button>
              <button className="p-2 rounded-lg border border-border-subtle text-text-secondary hover:border-border-active"><Settings size={14} /></button>
              <button className="p-2 rounded-lg border border-border-subtle text-text-secondary hover:border-border-active"><BarChart3 size={14} /></button>
              <button className="p-2 rounded-lg border border-border-subtle text-text-secondary hover:border-border-active"><MoreHorizontal size={14} /></button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Agent Creator Modal */}
      <AnimatePresence>
        {showCreator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
            onClick={closeCreator}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-bg-surface border border-border-subtle rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border-subtle">
                <h2 className="font-display text-lg font-bold text-text-primary">Deploy New Agent</h2>
                <button onClick={closeCreator} className="p-1.5 rounded-lg hover:bg-bg-hover text-text-muted"><X size={18} /></button>
              </div>

              <div className="p-5">
                {creatorStep === 'choose' && (
                  <div className="space-y-3">
                    <button
                      onClick={() => { setCreatorMode('template'); setCreatorStep('capabilities'); }}
                      className="w-full p-4 rounded-xl border border-border-subtle hover:border-accent-primary/50 bg-bg-base text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center text-accent-primary"><CopyIcon /></div>
                        <div>
                          <div className="text-sm font-medium text-text-primary">From template</div>
                          <div className="text-xs text-text-muted">Start from an existing agent template in your library</div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => { setCreatorMode('scratch'); setCreatorStep('name'); }}
                      className="w-full p-4 rounded-xl border border-border-subtle hover:border-accent-primary/50 bg-bg-base text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent-secondary/10 flex items-center justify-center text-accent-secondary"><SparklesIcon /></div>
                        <div>
                          <div className="text-sm font-medium text-text-primary">Build from scratch</div>
                          <div className="text-xs text-text-muted">Create a fully custom agent with your own configuration</div>
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                {creatorStep === 'name' && (
                  <div className="space-y-4">
                    <h3 className="font-display font-semibold text-text-primary">Name your agent</h3>
                    <input value={agentName} onChange={(e) => setAgentName(e.target.value)} placeholder="e.g., Sofia (SEO Writer)" className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary" />
                    <textarea value={agentRole} onChange={(e) => setAgentRole(e.target.value)} placeholder="What does this agent do? Describe its role..." rows={3} className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary resize-none" />
                  </div>
                )}

                {creatorStep === 'capabilities' && (
                  <div className="space-y-4">
                    <h3 className="font-display font-semibold text-text-primary">Select capabilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {allCapabilities.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedCapabilities((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])}
                          className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                            selectedCapabilities.includes(c) ? 'border-accent-primary bg-accent-primary/10 text-accent-primary' : 'border-border-subtle text-text-muted hover:border-border-active'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {creatorStep === 'personality' && (
                  <div className="space-y-4">
                    <h3 className="font-display font-semibold text-text-primary">Personality & Tone</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Formal ↔ Casual', value: personalityFormal, set: setPersonalityFormal },
                      ].map((s) => (
                        <div key={s.label}>
                          <div className="flex justify-between text-xs text-text-secondary mb-1"><span>Formal</span><span>Casual</span></div>
                          <input type="range" min="0" max="100" value={s.value} onChange={(e) => s.set(Number(e.target.value))} className="w-full accent-accent-primary" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {creatorStep === 'tools' && (
                  <div className="space-y-4">
                    <h3 className="font-display font-semibold text-text-primary">Connect tools</h3>
                    <div className="flex flex-wrap gap-2">
                      {allTools.map((t) => (
                        <button
                          key={t}
                          onClick={() => setSelectedTools((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])}
                          className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                            selectedTools.includes(t) ? 'border-accent-primary bg-accent-primary/10 text-accent-primary' : 'border-border-subtle text-text-muted hover:border-border-active'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {creatorStep === 'test' && (
                  <div className="space-y-4">
                    <h3 className="font-display font-semibold text-text-primary">Test your agent</h3>
                    <div className="bg-bg-base border border-border-subtle rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-accent-primary flex items-center justify-center text-white text-[10px] font-bold">
                          {agentName ? agentName.slice(0, 2).toUpperCase() : 'AG'}
                        </div>
                        <span className="text-sm text-text-primary font-medium">{agentName || 'Your Agent'}</span>
                      </div>
                      <div className="bg-bg-surface rounded-lg p-3 text-xs text-text-secondary">
                        Hello! I'm {agentName || 'your new agent'}. I'm configured to help with {selectedCapabilities.slice(0, 3).join(', ') || 'your tasks'}. How can I assist you today?
                      </div>
                      <input placeholder="Try a message..." className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-primary" />
                    </div>
                  </div>
                )}

                {creatorStep === 'done' && (
                  <div className="text-center py-6 space-y-3">
                    <div className="text-4xl">🎉</div>
                    <h3 className="font-display text-lg font-bold text-text-primary">Agent deployed!</h3>
                    <p className="text-sm text-text-secondary">{agentName || 'Your new agent'} is now ready to work in this workspace.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-5 border-t border-border-subtle">
                <button
                  onClick={() => {
                    if (creatorStep === 'choose') closeCreator();
                    else if (creatorStep === 'capabilities' && creatorMode === 'scratch') setCreatorStep('name');
                    else if (creatorStep === 'name') setCreatorStep('choose');
                    else if (creatorStep === 'capabilities') setCreatorStep('choose');
                    else if (creatorStep === 'personality') setCreatorStep('capabilities');
                    else if (creatorStep === 'tools') setCreatorStep('personality');
                    else if (creatorStep === 'test') setCreatorStep('tools');
                    else setCreatorStep('choose');
                  }}
                  className="flex items-center gap-1 text-sm text-text-muted hover:text-text-secondary"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                {creatorStep === 'done' ? (
                  <button onClick={closeCreator} className="px-6 py-2.5 bg-accent-primary text-white rounded-lg text-sm font-medium">
                    Go to workspace
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (creatorStep === 'choose' && creatorMode === 'template') setCreatorStep('capabilities');
                      else if (creatorStep === 'choose') setCreatorStep('name');
                      else if (creatorStep === 'name') setCreatorStep('capabilities');
                      else if (creatorStep === 'capabilities') setCreatorStep('personality');
                      else if (creatorStep === 'personality') setCreatorStep('tools');
                      else if (creatorStep === 'tools') setCreatorStep('test');
                      else if (creatorStep === 'test') setCreatorStep('done');
                    }}
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-accent-primary text-white rounded-lg text-sm font-medium hover:brightness-110 transition-all"
                  >
                    {creatorStep === 'test' ? <><Sparkles size={16} /> Deploy Agent</> : <>Continue <ArrowRight size={16} /></>}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CopyIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>; }
function SparklesIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>; }
