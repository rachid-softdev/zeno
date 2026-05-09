import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockTemplates } from '../lib/mockData';
import { Copy, Edit, Trash2, Share2, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export function Templates() {
  const navigate = useNavigate();
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Agent Templates ({mockTemplates.length})</h1>
          <p className="text-text-secondary text-sm mt-1">Your agency's reusable agent configurations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input placeholder="Search templates..." className="w-48 bg-bg-surface border border-border-subtle rounded-lg pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary" />
          </div>
          <button
            onClick={() => toast.success('Template creation coming soon')}
            className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg text-sm font-medium hover:brightness-110 transition-all active:scale-95">
            <Plus size={16} /> New template
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {['My templates', 'Zeno library'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'My templates'
                ? 'bg-bg-surface border border-border-subtle text-text-primary'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockTemplates.map((template, i) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/app/templates/${template.id}`)}
            className="bg-bg-surface border border-border-subtle rounded-xl p-5 hover:border-accent-primary/30 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-primary/10 border border-border-subtle flex items-center justify-center flex-shrink-0">
                <span className="text-lg">{template.category === 'content' ? '✍️' : template.category === 'sales' ? '🎯' : template.category === 'support' ? '📧' : template.category === 'analytics' ? '📊' : '⚙️'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-text-primary text-sm">{template.name}</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-bg-hover text-text-muted">{template.category}</span>
              </div>
            </div>
            <p className="text-xs text-text-secondary mb-3">{template.description}</p>
            <div className="flex items-center justify-between text-xs text-text-muted mb-3">
              <span>Deployed to {template.deploymentCount} clients</span>
              <span>Updated {template.lastUpdated}</span>
            </div>
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => toast.success('Select a client to deploy to')}
                className="flex-1 py-1.5 text-xs bg-accent-primary/10 text-accent-primary rounded-lg hover:bg-accent-primary/20 transition-colors flex items-center justify-center gap-1">
                <Share2 size={12} /> Deploy
              </button>
              <button onClick={() => navigate(`/app/templates/${template.id}`)} className="p-1.5 rounded-lg border border-border-subtle text-text-secondary hover:border-border-active transition-colors">
                <Edit size={12} />
              </button>
              <button onClick={() => toast.success('Template duplicated')} className="p-1.5 rounded-lg border border-border-subtle text-text-secondary hover:border-border-active transition-colors">
                <Copy size={12} />
              </button>
              <button onClick={() => toast('Delete template? Add confirmation later')} className="p-1.5 rounded-lg border border-border-subtle text-text-secondary hover:text-accent-danger hover:border-accent-danger/30 transition-colors">
                <Trash2 size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
