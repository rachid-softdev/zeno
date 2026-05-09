import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, CreditCard, Globe, Bell, AlertTriangle, Download, Trash2, Palette, Link, Mail, ArrowUp, Key, Copy, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifPrefs, setNotifPrefs] = useState<Record<string, { email: boolean; push: boolean }>>({
    'Task completed': { email: true, push: true },
    'Approval required': { email: true, push: true },
    'Integration error': { email: true, push: false },
    'Weekly digest': { email: true, push: false },
    'New lead detected': { email: true, push: true },
    'Agent error': { email: true, push: true },
    'Billing alert': { email: true, push: false },
    'Workflow failed': { email: true, push: true },
    'Team member invited': { email: false, push: false },
    'Usage limit (80%)': { email: true, push: false },
  });

  const tabs = [
    { id: 'profile', label: 'Agency Profile', icon: Globe },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'whitelabel', label: 'White-label', icon: Palette },
    { id: 'api', label: 'API Access', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="font-display text-2xl font-bold text-text-primary">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-bg-surface border border-border-subtle rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-bg-elevated text-text-primary' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-2xl">
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 space-y-4">
              <h3 className="font-display font-semibold text-text-primary">Agency Profile</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-text-secondary mb-1.5 block">Agency name</label>
                  <input defaultValue="Atelier Bold" className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary" />
                </div>
                <div>
                  <label className="text-sm text-text-secondary mb-1.5 block">Website</label>
                  <input defaultValue="https://atelierbold.fr" className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary" />
                </div>
                <div>
                  <label className="text-sm text-text-secondary mb-1.5 block">Default language</label>
                  <select defaultValue="FR" className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary">
                    {['FR', 'EN', 'ES', 'DE', 'PT'].map((l) => (<option key={l} value={l}>{l}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-text-secondary mb-1.5 block">Timezone</label>
                  <select defaultValue="Europe/Paris" className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary">
                    <option>Europe/Paris</option>
                    <option>Europe/London</option>
                    <option>America/New_York</option>
                  </select>
                </div>
              </div>
              <button onClick={() => toast.success('Changes saved')} className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg text-sm font-medium hover:brightness-110 transition-all">
                <Save size={16} /> Save changes
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'billing' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 space-y-4">
              <h3 className="font-display font-semibold text-text-primary">Current Plan — Agency</h3>
              <div className="flex items-center justify-between p-4 bg-bg-base rounded-lg border border-accent-primary/30">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold text-text-primary">Agency</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent-primary/10 text-accent-primary">Current</span>
                  </div>
                  <span className="text-2xl font-bold text-text-primary font-display">€199<span className="text-sm text-text-muted font-normal">/month</span></span>
                </div>
              </div>

              {/* Usage meters */}
              <div className="space-y-3">
                {[
                  { label: 'Workspaces', used: 14, max: 20 },
                  { label: 'Tasks this month', used: 2340, max: 3000 },
                  { label: 'Team seats', used: 7, max: 10 },
                ].map((meter) => (
                  <div key={meter.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary">{meter.label}</span>
                      <span className="text-text-muted">{meter.used} / {meter.max}</span>
                    </div>
                    <div className="w-full h-2 bg-bg-base rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(meter.used / meter.max) * 100}%` }}
                        className={`h-full rounded-full ${meter.used / meter.max > 0.9 ? 'bg-accent-danger' : meter.used / meter.max > 0.7 ? 'bg-accent-warning' : 'bg-accent-primary'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => toast('Upgrade flow coming soon')} className="flex items-center gap-1 px-4 py-2 bg-accent-primary text-white rounded-lg text-sm font-medium"><ArrowUp size={14} /> Upgrade to Scale</button>
                <button onClick={() => toast('Invoice history coming soon')} className="px-4 py-2 border border-border-subtle rounded-lg text-sm text-text-secondary">View invoices</button>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 space-y-3">
              <h3 className="font-display font-semibold text-text-primary">Payment Method</h3>
              <div className="flex items-center gap-3 p-3 bg-bg-base rounded-lg border border-border-subtle">
                <div className="w-10 h-6 rounded bg-gradient-to-r from-blue-500 to-blue-700" />
                <div>
                  <div className="text-sm text-text-primary">•••• 4242</div>
                  <div className="text-xs text-text-muted">Expires 12/2027</div>
                </div>
                <button onClick={() => toast('Payment method update coming soon')} className="ml-auto text-xs text-text-secondary hover:text-text-primary">Update</button>
              </div>
            </div>

            {/* Invoice history */}
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 space-y-3">
              <h3 className="font-display font-semibold text-text-primary">Invoice History</h3>
              <div className="divide-y divide-border-subtle">
                {[
                  { date: 'May 1, 2026', amount: '€199.00', status: 'Paid' },
                  { date: 'April 1, 2026', amount: '€199.00', status: 'Paid' },
                  { date: 'March 1, 2026', amount: '€199.00', status: 'Paid' },
                ].map((inv, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5">
                    <div>
                      <div className="text-sm text-text-primary">{inv.date}</div>
                      <div className="text-xs text-text-muted">Agency Plan</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-text-secondary font-mono">{inv.amount}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent-secondary/10 text-accent-secondary">{inv.status}</span>
                      <button onClick={() => toast('PDF download simulated')} className="text-xs text-accent-primary hover:underline"><Download size={12} className="inline" /> PDF</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'whitelabel' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-text-primary">White-Label</h3>
                  <p className="text-xs text-text-muted mt-1">Available on the Scale plan. Replace Zeno branding with your own.</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent-warning/10 text-accent-warning border border-accent-warning/20">Scale Plan</span>
              </div>
              <div className="space-y-4 opacity-60 pointer-events-none">
                <div>
                  <label className="text-sm text-text-secondary mb-1.5 block flex items-center gap-2"><Link size={14} /> Custom domain</label>
                  <input placeholder="app.youragency.com" className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary" />
                </div>
                <div>
                  <label className="text-sm text-text-secondary mb-1.5 block">Logo upload</label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-bg-base border border-dashed border-border-subtle flex items-center justify-center text-text-muted text-xs">Logo</div>
                    <button className="text-xs text-accent-primary">Upload PNG/SVG</button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-text-secondary mb-1.5 block">Primary brand color</label>
                  <div className="flex items-center gap-3">
                    <input type="color" defaultValue="#3B82F6" className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
                    <span className="text-sm text-text-secondary font-mono">#3B82F6</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-text-secondary mb-1.5 block">Client portal subdomain</label>
                  <input placeholder="clients.youragency.com" className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-sm text-text-secondary mb-1.5 block flex items-center gap-2"><Mail size={14} /> Custom email sender name</label>
                  <input placeholder="Your Agency Team" className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2.5 text-sm" />
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-accent-primary/50 text-white rounded-lg text-sm font-medium cursor-not-allowed" disabled>
                Upgrade to Scale to unlock
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'api' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-text-primary">API Access</h3>
                  <p className="text-xs text-text-muted mt-1">Available on the Scale plan. Integrate Zeno into your own systems.</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent-warning/10 text-accent-warning border border-accent-warning/20">Scale Plan</span>
              </div>

              <div className="space-y-4 opacity-60 pointer-events-none">
                <div>
                  <label className="text-sm text-text-secondary mb-1.5 block flex items-center gap-2"><Key size={14} /> API Key</label>
                  <div className="flex items-center gap-2">
                    <input type="password" value="zeno_sk_live_••••••••••••••••••••••••" readOnly className="flex-1 bg-bg-base border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary font-mono" />
                    <button className="p-2 rounded-lg border border-border-subtle text-text-secondary"><Eye size={16} /></button>
                    <button className="p-2 rounded-lg border border-border-subtle text-text-secondary"><Copy size={16} /></button>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <button className="text-xs text-accent-primary hover:underline">Generate new key</button>
                    <button className="text-xs text-accent-danger hover:underline">Revoke key</button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-text-secondary mb-1.5 block flex items-center gap-2"><Link size={14} /> Webhook URL</label>
                  <input placeholder="https://your-server.com/zeno-webhook" className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2.5 text-sm" />
                  <button className="mt-2 text-xs text-accent-primary hover:underline">Test webhook</button>
                </div>

                <div className="pt-3 border-t border-border-subtle space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">API calls this month</span>
                    <span className="font-mono text-text-primary">1,247 / 10,000</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Rate limit</span>
                    <span className="font-mono text-text-primary">1,000 req/hour</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Last used</span>
                    <span className="text-text-muted text-xs">2 hours ago</span>
                  </div>
                </div>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-accent-primary/50 text-white rounded-lg text-sm font-medium cursor-not-allowed" disabled>
                Upgrade to Scale to unlock
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 space-y-0">
              <h3 className="font-display font-semibold text-text-primary mb-4">Notification Preferences</h3>
              <p className="text-xs text-text-muted mb-4">Choose which events trigger email and push notifications.</p>

              {/* Header */}
              <div className="flex items-center gap-4 mb-2 px-3">
                <span className="flex-1 text-[10px] text-text-muted uppercase tracking-wider">Event</span>
                <span className="w-12 text-center text-[10px] text-text-muted uppercase tracking-wider">Email</span>
                <span className="w-12 text-center text-[10px] text-text-muted uppercase tracking-wider">Push</span>
              </div>

              <div className="divide-y divide-border-subtle">
                {[
                  { event: 'Task completed', desc: 'When an agent finishes a task' },
                  { event: 'Approval required', desc: 'When a human review is needed' },
                  { event: 'Integration error', desc: 'When a connected tool disconnects' },
                  { event: 'Weekly digest', desc: 'Summary of the week\'s activity' },
                  { event: 'New lead detected', desc: 'When a lead qualifier finds a prospect' },
                  { event: 'Agent error', desc: 'When an agent encounters an error' },
                  { event: 'Billing alert', desc: 'Invoice, payment, or usage limit' },
                  { event: 'Workflow failed', desc: 'When a workflow execution fails' },
                  { event: 'Team member invited', desc: 'When someone joins or leaves' },
                  { event: 'Usage limit (80%)', desc: 'When approaching plan limits' },
                ].map((n, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 px-3">
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-text-primary">{n.event}</span>
                      <span className="text-[10px] text-text-muted ml-2 hidden sm:inline">{n.desc}</span>
                    </div>
                    <div className="w-12 flex justify-center">
                      <button
                        onClick={() => setNotifPrefs((prev) => ({ ...prev, [n.event]: { ...prev[n.event], email: !prev[n.event].email } }))}
                        className={`w-9 h-5 rounded-full cursor-pointer transition-colors ${notifPrefs[n.event]?.email ? 'bg-accent-secondary' : 'bg-bg-elevated'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${notifPrefs[n.event]?.email ? 'translate-x-4' : 'translate-x-0.5'}`} style={{ marginTop: '1.5px' }} />
                      </button>
                    </div>
                    <div className="w-12 flex justify-center">
                      <button
                        onClick={() => setNotifPrefs((prev) => ({ ...prev, [n.event]: { ...prev[n.event], push: !prev[n.event].push } }))}
                        className={`w-9 h-5 rounded-full cursor-pointer transition-colors ${notifPrefs[n.event]?.push ? 'bg-accent-secondary' : 'bg-bg-elevated'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${notifPrefs[n.event]?.push ? 'translate-x-4' : 'translate-x-0.5'}`} style={{ marginTop: '1.5px' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'danger' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-bg-surface border border-accent-danger/30 rounded-xl p-6 space-y-4">
              <h3 className="font-display font-semibold text-accent-danger flex items-center gap-2">
                <AlertTriangle size={18} /> Danger Zone
              </h3>
              <div className="flex items-center justify-between py-3 border-b border-border-subtle">
                <div>
                  <div className="text-sm text-text-primary font-medium">Export all data</div>
                  <div className="text-xs text-text-muted">Download a full export of your agency data</div>
                </div>
                <button onClick={() => toast('Export started')} className="px-3 py-1.5 border border-border-subtle rounded-lg text-sm text-text-secondary flex items-center gap-1">
                  <Download size={14} /> Export
                </button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm text-text-primary font-medium">Delete agency</div>
                  <div className="text-xs text-text-muted">Permanently delete your agency and all data</div>
                </div>
                <button onClick={() => toast.error('Delete disabled in demo mode')} className="px-3 py-1.5 border border-accent-danger/30 text-accent-danger rounded-lg text-sm flex items-center gap-1 hover:bg-accent-danger/10 transition-colors">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
