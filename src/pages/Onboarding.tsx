import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, Sparkles, Globe, PenTool, BarChart3, Smartphone, Code, Puzzle } from 'lucide-react';

const primaryServices = [
  { icon: <PenTool size={20} />, label: 'Creative / Design' },
  { icon: <PenTool size={20} />, label: 'Content / Copywriting' },
  { icon: <BarChart3 size={20} />, label: 'Digital Marketing / SEO' },
  { icon: <Smartphone size={20} />, label: 'Social Media Management' },
  { icon: <Code size={20} />, label: 'Web / Development' },
  { icon: <Puzzle size={20} />, label: 'Full-service / 360°' },
];

const painPoints = [
  'Repetitive content creation',
  'Client reporting takes too long',
  'Lead generation and follow-up',
  'Email and inbox management',
  'Social media scheduling',
  'Internal team coordination',
];

const toneOptions = ['Professional', 'Friendly', 'Bold', 'Minimalist', 'Luxury', 'Fun', 'Technical', 'Empathetic'];

const goals = [
  { icon: <Globe size={18} />, label: 'Generate more organic traffic (SEO)', value: 'seo' },
  { icon: <Smartphone size={18} />, label: 'Grow social media presence', value: 'social' },
  { icon: <BarChart3 size={18} />, label: 'Qualify more leads', value: 'leads' },
  { icon: <Sparkles size={18} />, label: 'Create more content faster', value: 'content' },
];

const recommendedAgents = [
  { id: 'tmpl_001', name: 'SEO Content Writer', icon: '✍️', role: 'Writes optimized blog posts and content briefs', selected: true },
  { id: 'tmpl_002', name: 'Social Media Manager', icon: '📱', role: 'Generates and schedules social posts', selected: true },
  { id: 'tmpl_005', name: 'Lead Qualifier', icon: '🎯', role: 'Scores and qualifies incoming leads', selected: true },
  { id: 'tmpl_003', name: 'Email Response Agent', icon: '📧', role: 'Handles inbound emails 24/7', selected: false },
  { id: 'tmpl_004', name: 'Performance Reporter', icon: '📊', role: 'Weekly analytics reports', selected: false },
];

const integrationsList = [
  { category: 'Email', items: ['Gmail', 'Outlook'] },
  { category: 'Messaging', items: ['Slack', 'WhatsApp'] },
  { category: 'Analytics', items: ['Google Analytics', 'Meta Business'] },
  { category: 'PM Tools', items: ['Notion', 'Asana'] },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [clientName, setClientName] = useState('Hexa Corp');
  const [industry, setIndustry] = useState('B2B SaaS');
  const [website, setWebsite] = useState('https://hexacorp.com');
  const [description, setDescription] = useState('Enterprise workflow automation platform');
  const [tones, setTones] = useState<string[]>(['Professional', 'Technical', 'Bold']);
  const [goal, setGoal] = useState('seo');
  const [agents, setAgents] = useState(recommendedAgents.map((a) => ({ ...a })));
  const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  const toggleTone = (tone: string) => {
    setTones((prev) => prev.includes(tone) ? prev.filter((t) => t !== tone) : [...prev, tone]);
  };

  const toggleAgent = (id: string) => {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, selected: !a.selected } : a)));
  };

  const handleFinish = () => {
    setCompleted(true);
    setTimeout(() => navigate('/app/command'), 2000);
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {!completed ? (
          <>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 h-1 rounded-full transition-colors ${s <= step ? 'bg-accent-primary' : 'bg-bg-elevated'}`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-text-muted">
                <span className={step >= 1 ? 'text-accent-primary' : ''}>Agency</span>
                <span className={step >= 2 ? 'text-accent-primary' : ''}>Client</span>
                <span className={step >= 3 ? 'text-accent-primary' : ''}>Agents</span>
                <span className={step >= 4 ? 'text-accent-primary' : ''}>Connect</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="font-display text-2xl font-bold text-text-primary mb-2">Tell us about your agency</h2>
                  <div className="space-y-4 mt-6">
                    <div>
                      <label className="text-sm text-text-secondary mb-1.5 block">Agency website</label>
                      <input type="url" defaultValue="https://atelierbold.fr" className="w-full bg-bg-surface border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary" />
                    </div>
                    <div>
                      <label className="text-sm text-text-secondary mb-1.5 block">Primary service</label>
                      <div className="grid grid-cols-2 gap-2">
                        {primaryServices.map((s) => (
                          <button key={s.label} className="flex items-center gap-2 p-2.5 rounded-lg border border-border-subtle hover:border-border-active text-sm text-text-secondary hover:text-text-primary transition-colors text-left">
                            {s.icon}<span className="truncate">{s.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-text-secondary mb-1.5 block">Main pain points</label>
                      <div className="flex flex-wrap gap-1.5">
                        {painPoints.map((p) => (
                          <button
                            key={p}
                            onClick={() => setSelectedPainPoints((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p])}
                            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${selectedPainPoints.includes(p) ? 'border-accent-primary bg-accent-primary/10 text-accent-primary' : 'border-border-subtle text-text-muted hover:border-border-active'}`}
                          >{p}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="font-display text-2xl font-bold text-text-primary mb-2">Set up your first client workspace</h2>
                  <div className="space-y-4 mt-6">
                    <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client/Brand name" className="w-full bg-bg-surface border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary" />
                    <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Industry" className="w-full bg-bg-surface border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary" />
                    <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website URL" className="w-full bg-bg-surface border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary" />
                    <div>
                      <label className="text-sm text-text-secondary mb-1.5 block">Brand tone</label>
                      <div className="flex flex-wrap gap-1.5">
                        {toneOptions.map((t) => (
                          <button key={t} onClick={() => toggleTone(t)} className={`px-3 py-1 rounded-full text-xs border transition-colors ${tones.includes(t) ? 'border-accent-primary bg-accent-primary/10 text-accent-primary' : 'border-border-subtle text-text-muted hover:border-border-active'}`}>{t}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-text-secondary mb-1.5 block">Primary goal for this client</label>
                      <div className="space-y-2">
                        {goals.map((g) => (
                          <button key={g.value} onClick={() => setGoal(g.value)} className={`w-full flex items-center gap-3 p-3 rounded-lg border text-sm text-left transition-colors ${goal === g.value ? 'border-accent-primary bg-accent-primary/5 text-text-primary' : 'border-border-subtle text-text-secondary hover:border-border-active'}`}>
                            {g.icon}<span>{g.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="font-display text-2xl font-bold text-text-primary mb-2">Pick your starter agents</h2>
                  <p className="text-text-secondary text-sm mb-6">Based on {clientName}'s goals, here are your recommended agents.</p>
                  <div className="space-y-3">
                    {agents.map((agent) => (
                      <div
                        key={agent.id}
                        onClick={() => toggleAgent(agent.id)}
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                          agent.selected ? 'border-accent-primary bg-accent-primary/5' : 'border-border-subtle bg-bg-surface/50 opacity-60'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${agent.selected ? 'border-accent-primary bg-accent-primary' : 'border-border-subtle'}`}>
                          {agent.selected && <Check size={12} className="text-white" />}
                        </div>
                        <div>
                          <div className="text-text-primary font-medium text-sm">{agent.icon} {agent.name}</div>
                          <div className="text-text-muted text-xs mt-0.5">{agent.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="font-display text-2xl font-bold text-text-primary mb-2">Connect your tools</h2>
                  <p className="text-text-secondary text-sm mb-6">Connect {clientName}'s tools. Agents will work directly inside them.</p>
                  <div className="space-y-4">
                    {integrationsList.map((group) => (
                      <div key={group.category}>
                        <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">{group.category}</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {group.items.map((item) => (
                            <div key={item} className="flex items-center justify-between p-3 rounded-lg border border-border-subtle bg-bg-surface">
                              <span className="text-sm text-text-secondary">{item}</span>
                              <button className="text-xs px-3 py-1 rounded bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 transition-colors">Connect</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-subtle">
              <button
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className={`flex items-center gap-1 text-sm ${step === 1 ? 'text-text-muted cursor-not-allowed' : 'text-text-secondary hover:text-text-primary'}`}
              >
                <ArrowLeft size={16} /> Back
              </button>
              {step < 4 ? (
                <button onClick={() => setStep(step + 1)} className="flex items-center gap-1.5 px-6 py-2.5 bg-accent-primary hover:brightness-110 text-white font-medium rounded-lg text-sm transition-all active:scale-95">
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <button onClick={handleFinish} className="flex items-center gap-1.5 px-6 py-2.5 bg-accent-secondary hover:brightness-110 text-white font-medium rounded-lg text-sm transition-all active:scale-95">
                  <Sparkles size={16} /> Finish setup
                </button>
              )}
            </div>
          </>
        ) : (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="font-display text-3xl font-bold text-text-primary mb-2">Your agency workspace is live!</h2>
            <div className="space-y-3 mt-6">
              {[
                `${clientName} workspace created ✓`,
                `${agents.filter((a) => a.selected).length} agents deployed ✓`,
                'Tools ready to connect ✓',
              ].map((msg, i) => (
                <div key={i} className="flex items-center gap-2 justify-center text-text-secondary">
                  <Check size={16} className="text-accent-secondary" />
                  <span>{msg}</span>
                </div>
              ))}
            </div>
            <p className="text-text-muted text-sm mt-6">Redirecting to Command Center...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
