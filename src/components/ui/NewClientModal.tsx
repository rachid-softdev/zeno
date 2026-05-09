import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, Globe, Search, Smartphone, BarChart3, Users, MessageSquare, FileText } from 'lucide-react';

const industries = [
  'B2B SaaS', 'E-commerce', 'Healthcare', 'FinTech', 'Real Estate', 'Education',
  'Hospitality', 'Manufacturing', 'Retail', 'Media', 'Non-profit', 'Construction',
  'Legal', 'Insurance', 'Automotive', 'Food & Beverage', 'Fashion', 'Travel',
  'Entertainment', 'Energy', 'Telecom', 'Agriculture', 'Logistics', 'Other',
];

const toneOptions = ['Professional', 'Friendly', 'Bold', 'Minimalist', 'Luxury', 'Fun', 'Technical', 'Empathetic'];

const goals = [
  { id: 'seo', icon: <Search size={18} />, label: 'Generate more organic traffic (SEO)', desc: 'Blog posts, meta descriptions, content briefs' },
  { id: 'social', icon: <Smartphone size={18} />, label: 'Grow social media presence', desc: 'Posts across Instagram, LinkedIn, Facebook' },
  { id: 'leads', icon: <Users size={18} />, label: 'Qualify more leads', desc: 'Lead scoring, email outreach, booking calls' },
  { id: 'content', icon: <FileText size={18} />, label: 'Create more content faster', desc: 'Articles, newsletters, social posts' },
  { id: 'support', icon: <MessageSquare size={18} />, label: 'Improve customer support', desc: 'Email response, inbox management 24/7' },
];

const recommendedAgents = [
  { id: '1', name: 'SEO Content Writer', icon: '✍️', desc: 'Writes SEO-optimized blog posts and content briefs', selected: true },
  { id: '2', name: 'Social Media Manager', icon: '📱', desc: 'Creates and schedules social media posts', selected: true },
  { id: '3', name: 'Email Response Agent', icon: '📧', desc: 'Handles inbound emails and drafts responses', selected: true },
  { id: '4', name: 'Lead Qualifier', icon: '🎯', desc: 'Scores leads and books discovery calls', selected: false },
  { id: '5', name: 'Performance Reporter', icon: '📊', desc: 'Weekly analytics reports with insights', selected: false },
];

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (client: any) => void;
}

export function NewClientModal({ isOpen, onClose, onCreated }: NewClientModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [tones, setTones] = useState<string[]>(['Professional']);
  const [goal, setGoal] = useState('seo');
  const [agents, setAgents] = useState(recommendedAgents);
  const [done, setDone] = useState(false);

  const toggleAgent = (id: string) => {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, selected: !a.selected } : a)));
  };

  const handleCreate = () => {
    const client = { id: `cl_${Date.now()}`, name, industry, website, description, toneOfVoice: tones, primaryGoal: goal };
    setDone(true);
    setTimeout(() => {
      onCreated(client);
      resetAndClose();
    }, 1500);
  };

  const resetAndClose = () => {
    setName(''); setIndustry(''); setWebsite(''); setDescription('');
    setTones(['Professional']); setGoal('seo'); setAgents(recommendedAgents);
    setStep(1); setDone(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
        onClick={resetAndClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="bg-bg-surface border border-border-subtle rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border-subtle">
            <h2 className="font-display text-lg font-bold text-text-primary">New Client Workspace</h2>
            <button onClick={resetAndClose} className="p-1.5 rounded-lg hover:bg-bg-hover text-text-muted"><X size={18} /></button>
          </div>

          {/* Progress */}
          <div className="px-5 pt-4">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className={`flex-1 h-1 rounded-full ${s <= step ? 'bg-accent-primary' : 'bg-bg-elevated'}`} />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-text-muted mb-4">
              <span className={step >= 1 ? 'text-accent-primary' : ''}>Info</span>
              <span className={step >= 2 ? 'text-accent-primary' : ''}>Brand</span>
              <span className={step >= 3 ? 'text-accent-primary' : ''}>Agents</span>
              <span className={step >= 4 ? 'text-accent-primary' : ''}>Confirm</span>
            </div>
          </div>

          {!done ? (
            <div className="p-5">
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-display font-semibold text-text-primary">Client Information</h3>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Client / Brand name" className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary" />
                  <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary">
                    <option value="">Select industry...</option>
                    {industries.map((ind) => (<option key={ind} value={ind}>{ind}</option>))}
                  </select>
                  <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website URL (optional)" className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary" />
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of this client's business..." rows={2} className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary resize-none" />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-display font-semibold text-text-primary">Brand Setup</h3>
                  <div>
                    <label className="text-xs text-text-muted block mb-1.5">Tone of voice</label>
                    <div className="flex flex-wrap gap-1.5">
                      {toneOptions.map((t) => (
                        <button key={t} onClick={() => setTones((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])}
                          className={`px-3 py-1 rounded-full text-xs border transition-colors ${tones.includes(t) ? 'border-accent-primary bg-accent-primary/10 text-accent-primary' : 'border-border-subtle text-text-muted hover:border-border-active'}`}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted block mb-1.5">Primary goal for this client</label>
                    <div className="space-y-2">
                      {goals.map((g) => (
                        <button key={g.id} onClick={() => setGoal(g.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${goal === g.id ? 'border-accent-primary bg-accent-primary/5 text-text-primary' : 'border-border-subtle text-text-secondary hover:border-border-active'}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${goal === g.id ? 'bg-accent-primary/10 text-accent-primary' : 'bg-bg-hover text-text-muted'}`}>{g.icon}</div>
                          <div><div className="text-sm font-medium">{g.label}</div><div className="text-[10px] text-text-muted">{g.desc}</div></div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-display font-semibold text-text-primary">Recommended Agents</h3>
                  <p className="text-xs text-text-muted">Based on the selected goal, here are our suggestions. You can always add more later.</p>
                  {agents.map((agent) => (
                    <div key={agent.id} onClick={() => toggleAgent(agent.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${agent.selected ? 'border-accent-primary bg-accent-primary/5' : 'border-border-subtle opacity-60'}`}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${agent.selected ? 'border-accent-primary bg-accent-primary' : 'border-border-subtle'}`}>
                        {agent.selected && <Check size={12} className="text-white" />}
                      </div>
                      <div>
                        <div className="text-sm text-text-primary font-medium">{agent.icon} {agent.name}</div>
                        <div className="text-xs text-text-muted">{agent.desc}</div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setAgents((prev) => prev.map((a) => ({ ...a, selected: false })))} className="text-xs text-text-muted hover:text-text-secondary underline">
                    Skip — I'll add agents later
                  </button>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="font-display font-semibold text-text-primary">Confirm</h3>
                  <div className="bg-bg-base border border-border-subtle rounded-xl p-4 space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-text-muted">Name</span><span className="text-text-primary font-medium">{name || '(not set)'}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Industry</span><span className="text-text-primary">{industry || '(not set)'}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Tone</span><span className="text-text-primary">{tones.join(', ') || '—'}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Goal</span><span className="text-text-primary">{goals.find((g) => g.id === goal)?.label || '—'}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Agents</span><span className="text-accent-primary font-medium">{agents.filter((a) => a.selected).length} selected</span></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-5xl mb-4">🎉</motion.div>
              <h3 className="font-display text-xl font-bold text-text-primary mb-2">Workspace Created!</h3>
              <p className="text-sm text-text-secondary">{name} is ready. {agents.filter((a) => a.selected).length} agents deployed.</p>
            </div>
          )}

          {/* Footer */}
          {!done && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-border-subtle">
              <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}
                className={`flex items-center gap-1 text-sm ${step === 1 ? 'text-text-muted' : 'text-text-secondary hover:text-text-primary'}`}>
                <ArrowLeft size={16} /> Back
              </button>
              {step < 4 ? (
                <button onClick={() => setStep(step + 1)} className="flex items-center gap-1.5 px-6 py-2.5 bg-accent-primary text-white rounded-lg text-sm font-medium">
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <button onClick={handleCreate} className="flex items-center gap-1.5 px-6 py-2.5 bg-accent-secondary text-white rounded-lg text-sm font-medium">
                  <Sparkles size={16} /> Create Workspace
                </button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
