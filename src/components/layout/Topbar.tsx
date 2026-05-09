import { Bell, Search, Sparkles, Zap, ShieldAlert, X } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../../stores/appStore';
import toast from 'react-hot-toast';

export function Topbar({ onSearchOpen }: { onSearchOpen: () => void }) {
  const { activeClientId, clients, sandboxMode, toggleSandbox } = useAppStore();
  const [showQuickTask, setShowQuickTask] = useState(false);
  const [quickTask, setQuickTask] = useState('');
  const activeClient = clients.find((c) => c.id === activeClientId);

  return (
    <header className="h-14 bg-bg-base border-b border-border-subtle flex items-center justify-between px-5 sticky top-0 z-10">
      {/* Left - Breadcrumb */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-text-secondary">
          {activeClientId ? (
            <>
              <span className="text-text-muted">Clients /</span>{' '}
              <span className="text-text-primary font-medium">{activeClient?.name}</span>
            </>
          ) : (
            <span className="text-text-primary font-medium">Command Center</span>
          )}
        </span>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search agents, clients, tasks..."
            onClick={onSearchOpen}
            readOnly
            className="w-full bg-bg-surface border border-border-subtle rounded-lg pl-9 pr-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 transition-colors cursor-pointer"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-text-muted bg-bg-elevated px-1.5 py-0.5 rounded border border-border-subtle">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-2">
        {sandboxMode && (
          <button
            onClick={toggleSandbox}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent-warning/10 text-accent-warning text-xs font-medium border border-accent-warning/20 animate-pulse"
          >
            <ShieldAlert size={12} /> SANDBOX — Safe mode active
          </button>
        )}
        <button
          onClick={() => setShowQuickTask(!showQuickTask)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            showQuickTask ? 'bg-accent-primary/20 text-accent-primary' : 'bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20'
          }`}
        >
          <Zap size={14} />
          <span className="hidden sm:inline">Quick task</span>
        </button>

        {showQuickTask && (
          <div className="absolute top-14 right-20 w-96 bg-bg-surface border border-border-subtle rounded-xl shadow-2xl p-4 z-20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-text-primary flex items-center gap-1.5"><Zap size={14} className="text-accent-primary" /> Quick Task</span>
              <button onClick={() => setShowQuickTask(false)} className="p-1 rounded hover:bg-bg-hover text-text-muted"><X size={14} /></button>
            </div>
            <textarea
              value={quickTask}
              onChange={(e) => setQuickTask(e.target.value)}
              placeholder="Ask any agent to do something... e.g., 'Draft a blog post about SEO trends for Hexa Corp'"
              rows={3}
              className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <select className="bg-bg-base border border-border-subtle rounded-lg px-2 py-1.5 text-xs text-text-secondary">
                <option>Auto-assign best agent</option>
                {activeClientId && clients.filter((c) => c.id === activeClientId).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  if (quickTask.trim()) {
                    toast.success(`Task delegated: "${quickTask.slice(0, 40)}${quickTask.length > 40 ? '...' : ''}"`);
                  }
                  setQuickTask(''); setShowQuickTask(false);
                }}
                className="px-4 py-1.5 bg-accent-primary text-white rounded-lg text-xs font-medium hover:brightness-110 transition-all"
              >
                Delegate task
              </button>
            </div>
          </div>
        )}

        {sandboxMode && (
          <button
            onClick={toggleSandbox}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent-warning/10 text-accent-warning text-xs font-medium border border-accent-warning/20"
          >
            <ShieldAlert size={12} /> Sandbox
          </button>
        )}
        <button
          onClick={toggleSandbox}
          className={`p-2 rounded-lg transition-colors sm:hidden ${sandboxMode ? 'bg-accent-warning/10 text-accent-warning' : 'text-text-muted hover:bg-bg-hover'}`}
          title="Toggle sandbox"
        >
          <ShieldAlert size={16} />
        </button>
        <button onClick={() => toast('Notifications coming soon')} className="relative p-2 rounded-lg hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-danger" />
        </button>
        <button onClick={() => toast('AI Assistant coming soon')} className="p-2 rounded-lg hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-colors">
          <Sparkles size={18} />
        </button>
      </div>
    </header>
  );
}
