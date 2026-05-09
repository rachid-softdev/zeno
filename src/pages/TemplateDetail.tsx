import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockTemplates, mockClients } from '../lib/mockData';
import { ArrowLeft, Edit, Trash2, Copy, Share2, Globe, Tag, Wrench, History, RefreshCw } from 'lucide-react';

export function TemplateDetail() {
  const { tid } = useParams<{ tid: string }>();
  const navigate = useNavigate();
  const template = mockTemplates.find((t) => t.id === tid);

  if (!template) {
    return (
      <div className="p-8 text-center text-text-muted">
        <h2 className="text-lg font-medium mb-2">Template not found</h2>
        <button onClick={() => navigate('/app/templates')} className="text-accent-primary text-sm hover:underline">Back to templates</button>
      </div>
    );
  }

  const clientsWithThis = mockClients.filter(() => true); // Mock: deployed to 3-4 clients

  return (
    <div className="p-6 space-y-6">
      <button onClick={() => navigate('/app/templates')} className="flex items-center gap-1 text-sm text-text-muted hover:text-text-secondary mb-2">
        <ArrowLeft size={16} /> Back to templates
      </button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-primary/20 to-accent-primary/10 border border-border-subtle flex items-center justify-center text-2xl">
                {template.category === 'content' ? '✍️' : template.category === 'sales' ? '🎯' : template.category === 'support' ? '📧' : template.category === 'analytics' ? '📊' : '⚙️'}
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-text-primary">{template.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-bg-hover text-text-muted capitalize">{template.category}</span>
                  <span className="text-xs text-text-muted">· Deployed to {template.deploymentCount} clients</span>
                  <span className="text-xs text-text-muted">· Updated {template.lastUpdated}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-primary text-white rounded-lg text-xs font-medium"><Share2 size={14} /> Deploy</button>
              <button className="p-1.5 rounded-lg border border-border-subtle text-text-secondary hover:border-border-active"><Copy size={14} /></button>
              <button className="p-1.5 rounded-lg border border-border-subtle text-text-secondary hover:border-border-active"><Trash2 size={14} /></button>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
            <h3 className="flex items-center gap-2 text-xs text-text-muted uppercase tracking-wider mb-3"><Tag size={14} /> Description</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{template.description}</p>
          </div>
          <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
            <h3 className="flex items-center gap-2 text-xs text-text-muted uppercase tracking-wider mb-3"><Wrench size={14} /> Capabilities</h3>
            <div className="flex flex-wrap gap-1.5">
              {template.capabilities.map((c) => (
                <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20">{c}</span>
              ))}
            </div>
          </div>
          <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
            <h3 className="flex items-center gap-2 text-xs text-text-muted uppercase tracking-wider mb-3"><Globe size={14} /> Connected Tools</h3>
            <div className="flex flex-wrap gap-1.5">
              {template.tools.map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-bg-hover text-text-secondary">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Personality + Prompt config */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
          <h3 className="flex items-center gap-2 text-xs text-text-muted uppercase tracking-wider mb-3">Personality &amp; Configuration</h3>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-text-muted">Personality setting:</span>
              <span className="text-sm text-text-primary ml-2">{template.personality}</span>
            </div>
            <div>
              <span className="text-xs text-text-muted">Role:</span>
              <span className="text-sm text-text-primary ml-2">{template.role}</span>
            </div>
            <div className="pt-2 border-t border-border-subtle">
              <span className="text-xs text-text-muted">Deployment count:</span>
              <span className="text-sm text-text-primary ml-2 font-mono">{template.deploymentCount} active instances</span>
            </div>
          </div>
        </div>

        {/* Deployed clients */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
          <h3 className="flex items-center gap-2 text-xs text-text-muted uppercase tracking-wider mb-4">Deployed To</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {clientsWithThis.slice(0, 4).map((client, i) => (
              <div
                key={client.id}
                onClick={() => navigate(`/app/clients/${client.id}/agents`)}
                className="flex items-center gap-3 p-3 rounded-lg bg-bg-base border border-border-subtle hover:border-border-active cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary/20 to-accent-primary/10 flex items-center justify-center text-xs text-accent-primary font-bold">
                  {client.name.slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm text-text-primary">{client.name}</div>
                  <div className="text-xs text-text-muted">{client.industry} · {Math.floor(Math.random() * 4) + 1} agents</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Version history (mock) */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
          <h3 className="flex items-center gap-2 text-xs text-text-muted uppercase tracking-wider mb-4"><History size={14} /> Version History</h3>
          <div className="space-y-3">
            {[
              { v: 'v1.2', date: 'April 20, 2026', changes: 'Updated SEO keyword list, added WordPress integration' },
              { v: 'v1.1', date: 'March 15, 2026', changes: 'Added content generation capability, refined tone' },
              { v: 'v1.0', date: 'February 1, 2026', changes: 'Initial template created' },
            ].map((ver, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-bg-base border border-border-subtle">
                <span className="text-xs font-mono text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded">{ver.v}</span>
                <div className="flex-1">
                  <div className="text-sm text-text-primary">{ver.changes}</div>
                  <div className="text-xs text-text-muted mt-0.5">{ver.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
