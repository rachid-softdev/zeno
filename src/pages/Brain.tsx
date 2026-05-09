import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { mockBrains } from '../lib/mockData';
import type { BrainMemory, BrainRule } from '../lib/types';
import { Brain as BrainIcon, FileText, Lightbulb, ShieldCheck, Upload, Check, X, Edit, Trash2, Plus, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function Brain() {
  const { id } = useParams<{ id: string }>();
  const brain = mockBrains[id!];
  const [activeTab, setActiveTab] = useState('dna');
  const [uploading, setUploading] = useState(false);
  const [memories, setMemories] = useState<BrainMemory[]>(brain?.memories || []);
  const [rules, setRules] = useState<BrainRule[]>(brain?.rules || []);
  const [newRule, setNewRule] = useState('');
  const [showAddRule, setShowAddRule] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  if (!brain) {
    return (
      <div className="p-8 text-center">
        <BrainIcon size={32} className="mx-auto mb-3 text-text-muted" />
        <p className="text-text-muted text-sm">No brain data for this client.</p>
        <p className="text-xs text-text-muted mt-1">Create a brain to give agents context about this client.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'dna', label: 'Brand DNA', icon: BrainIcon },
    { id: 'docs', label: 'Documents', icon: FileText },
    { id: 'memories', label: 'Memory', icon: Lightbulb },
    { id: 'rules', label: 'Rules', icon: ShieldCheck },
  ];

  const toggleMemory = (id: string) => {
    setMemories((prev) => prev.map((m) => m.id === id ? { ...m, confirmed: !m.confirmed } : m));
  };

  const deleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleRule = (id: string) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const addRule = () => {
    if (!newRule.trim()) return;
    setRules((prev) => [...prev, { id: `rul_${Date.now()}`, clientId: id!, description: newRule, enabled: true }]);
    setNewRule('');
    setShowAddRule(false);
  };

  const handleUpload = () => {
    setShowUpload(true);
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setShowUpload(false);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">Client Brain</h1>
        <p className="text-text-secondary text-sm mt-1">Shared knowledge base — agents draw from this context.</p>
      </div>

      <div className="flex gap-1 bg-bg-surface border border-border-subtle rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-bg-elevated text-text-primary' : 'text-text-muted hover:text-text-secondary'
            }`}
          ><tab.icon size={16} /> {tab.label}</button>
        ))}
      </div>

      <div className="max-w-3xl">
        {/* Brand DNA */}
        {activeTab === 'dna' && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="bg-bg-surface border border-border-subtle rounded-xl p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Company Overview</label>
                <textarea defaultValue={brain.brandDNA.overview} rows={2} className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary resize-none" />
              </div>
              <div>
                <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Value Proposition</label>
                <textarea defaultValue={brain.brandDNA.valueProposition} rows={2} className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary resize-none" />
              </div>
              <div>
                <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Target Audience (Primary)</label>
                <input defaultValue={brain.brandDNA.targetAudience.primary} className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary" />
              </div>
              <div>
                <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Pain Points</label>
                <input defaultValue={brain.brandDNA.targetAudience.painPoints} className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary" />
              </div>
            </div>

            <div>
              <label className="text-xs text-text-muted uppercase tracking-wider mb-2 block">Brand Personality</label>
              <div className="space-y-3">
                {[
                  { label: 'Formal', right: 'Casual', value: brain.brandDNA.personality.formal },
                  { label: 'Serious', right: 'Playful', value: brain.brandDNA.personality.playful },
                  { label: 'Corporate', right: 'Human', value: brain.brandDNA.personality.corporate },
                ].map((s) => (
                  <div key={s.label} className="space-y-1">
                    <div className="flex justify-between text-[10px] text-text-muted"><span>{s.label}</span><span>{s.right}</span></div>
                    <input type="range" min="0" max="100" defaultValue={s.value} className="w-full accent-accent-primary h-1.5" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Key Messages</label>
              <div className="flex flex-wrap gap-1.5">
                {brain.brandDNA.keyMessages.map((m) => (
                  <span key={m} className="text-xs px-2.5 py-1 rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20">{m}</span>
                ))}
                <button onClick={() => toast('Add key message coming soon')} className="text-xs px-2.5 py-1 rounded-full border border-dashed border-border-subtle text-text-muted hover:border-border-active transition-colors">
                  <Plus size={12} className="inline -mt-0.5" /> Add
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">What We Never Say</label>
              <div className="flex flex-wrap gap-1.5">
                {brain.brandDNA.avoidList.map((w) => (
                  <span key={w} className="text-xs px-2.5 py-1 rounded-full bg-accent-danger/10 text-accent-danger border border-accent-danger/20">{w}</span>
                ))}
              </div>
            </div>

            <p className="text-xs text-text-muted italic">Auto-saved. This is shared with all agents in this workspace.</p>
          </motion.div>
        )}

        {/* Documents */}
        {activeTab === 'docs' && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div
              onClick={handleUpload}
              className="bg-bg-surface border-2 border-dashed border-border-subtle rounded-xl p-10 text-center cursor-pointer hover:border-border-active transition-colors"
            >
              {uploading ? (
                <div className="space-y-3">
                  <Loader2 size={28} className="mx-auto text-accent-primary animate-spin" />
                  <p className="text-sm text-text-secondary">Extracting knowledge...</p>
                  <div className="w-48 mx-auto h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                    <motion.div className="h-full bg-accent-primary rounded-full" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2 }} />
                  </div>
                </div>
              ) : (
                <>
                  <Upload size={28} className="mx-auto mb-3 text-text-muted" />
                  <p className="text-sm text-text-secondary">Drag & drop files or click to upload</p>
                  <p className="text-xs text-text-muted mt-1">PDF, DOCX, TXT, URLs accepted</p>
                </>
              )}
            </div>
            <div className="space-y-2">
              {brain.documents.map((doc) => (
                <div key={doc.id} className="bg-bg-surface border border-border-subtle rounded-xl p-4 flex items-center justify-between hover:border-border-active transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-bg-hover flex items-center justify-center text-text-muted">
                      <FileText size={16} />
                    </div>
                    <div>
                      <div className="text-sm text-text-primary font-medium">{doc.filename}</div>
                      <div className="text-xs text-text-muted">{doc.size} · Uploaded {doc.uploadedAt}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      doc.status === 'active' ? 'bg-accent-secondary/10 text-accent-secondary' :
                      doc.status === 'processing' ? 'bg-accent-warning/10 text-accent-warning' :
                      'bg-accent-danger/10 text-accent-danger'
                    }`}>{doc.status}</span>
                    <button onClick={() => toast('Document deleted')} className="p-1.5 rounded hover:bg-bg-hover text-text-muted hover:text-accent-danger transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Memories */}
        {activeTab === 'memories' && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-text-muted">Facts extracted by agents from past conversations</p>
              <span className="text-xs text-text-muted">{memories.filter((m) => m.confirmed).length}/{memories.length} confirmed</span>
            </div>
            {memories.length === 0 ? (
              <div className="bg-bg-surface border border-border-subtle rounded-xl p-8 text-center">
                <Lightbulb size={24} className="mx-auto mb-2 text-text-muted" />
                <p className="text-sm text-text-secondary">No memories yet</p>
                <p className="text-xs text-text-muted mt-1">Memories are created automatically as agents interact with this client.</p>
              </div>
            ) : (
              memories.map((mem) => (
                <motion.div
                  key={mem.id}
                  layout
                  className={`bg-bg-surface border rounded-xl p-4 transition-all ${mem.confirmed ? 'border-border-subtle' : 'border-accent-warning/30 bg-accent-warning/5'}`}
                >
                  <p className="text-sm text-text-primary mb-2">"{mem.fact}"</p>
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>By {mem.learnedBy} · {mem.learnedAt} · {mem.source}</span>
                    <div className="flex items-center gap-1">
                      {!mem.confirmed && (
                        <button onClick={() => toggleMemory(mem.id)} className="p-1.5 rounded hover:bg-accent-secondary/10 text-accent-secondary transition-colors" title="Confirm">
                          <Check size={14} />
                        </button>
                      )}
                      <button onClick={() => deleteMemory(mem.id)} className="p-1.5 rounded hover:bg-accent-danger/10 text-text-muted hover:text-accent-danger transition-colors" title="Delete">
                        <X size={14} />
                      </button>
                      <button onClick={() => toast('Edit memory coming soon')} className="p-1.5 rounded hover:bg-bg-hover text-text-muted transition-colors" title="Edit"><Edit size={14} /></button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Rules */}
        {activeTab === 'rules' && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-text-muted">Explicit rules set by your team</p>
              <span className="text-xs text-text-muted">{rules.filter((r) => r.enabled).length} active</span>
            </div>
            {rules.length === 0 ? (
              <div className="bg-bg-surface border border-border-subtle rounded-xl p-8 text-center">
                <ShieldCheck size={24} className="mx-auto mb-2 text-text-muted" />
                <p className="text-sm text-text-secondary">No rules defined yet</p>
                <p className="text-xs text-text-muted mt-1">Rules help control agent behavior and prevent mistakes.</p>
              </div>
            ) : (
              rules.map((rule) => (
                <motion.div key={rule.id} layout className="bg-bg-surface border border-border-subtle rounded-xl p-4 flex items-center justify-between hover:border-border-active transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <ShieldCheck size={16} className={`flex-shrink-0 ${rule.enabled ? 'text-accent-secondary' : 'text-text-muted'}`} />
                    <p className="text-sm text-text-primary truncate">{rule.description}</p>
                  </div>
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`relative w-9 h-5 rounded-full flex-shrink-0 transition-colors ${rule.enabled ? 'bg-accent-secondary' : 'bg-bg-elevated'}`}
                  >
                    <motion.div
                      className="w-4 h-4 rounded-full bg-white absolute top-0.5 shadow"
                      animate={{ left: rule.enabled ? 'calc(100% - 18px)' : '2px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </motion.div>
              ))
            )}

            {showAddRule ? (
              <div className="bg-bg-surface border border-accent-primary/30 rounded-xl p-4 space-y-3">
                <input
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder="Describe the rule..."
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') addRule(); if (e.key === 'Escape') setShowAddRule(false); }}
                />
                <div className="flex items-center gap-2">
                  <button onClick={addRule} className="px-3 py-1.5 bg-accent-primary text-white rounded-lg text-xs font-medium">Add Rule</button>
                  <button onClick={() => setShowAddRule(false)} className="px-3 py-1.5 border border-border-subtle rounded-lg text-xs text-text-secondary">Cancel</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddRule(true)}
                className="w-full p-3 rounded-xl border-2 border-dashed border-border-subtle text-text-muted text-sm hover:border-border-active hover:text-text-secondary transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add rule
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
