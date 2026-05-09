import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { mockWorkflows } from '../lib/mockData';
import { ExecutionTimeline } from '../components/ui/ExecutionTimeline';
import { Play, Pause, Settings, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

export function Workflows() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const workflows = mockWorkflows.filter((w) => w.clientId === id || w.clientId === 'cl_all');
  const [showTimeline, setShowTimeline] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Workflows ({workflows.length})</h1>
          <p className="text-text-secondary text-sm mt-1">Automate multi-step processes across agents and tools.</p>
        </div>
        <button
          onClick={() => toast.success('Workflow creation coming soon')}
          className="px-4 py-2 bg-accent-primary text-white rounded-lg text-sm font-medium hover:brightness-110 transition-all active:scale-95">
          + New workflow
        </button>
      </div>

      <div className="space-y-4">
        {workflows.map((wf) => (
          <div key={wf.id} className="bg-bg-surface border border-border-subtle rounded-xl p-5 hover:border-border-active transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-display font-semibold text-text-primary">{wf.name}</h3>
                <p className="text-sm text-text-secondary mt-0.5">{wf.description}</p>
              </div>
              <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
                wf.status === 'active' ? 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20' :
                wf.status === 'paused' ? 'bg-accent-warning/10 text-accent-warning border-accent-warning/20' :
                'bg-bg-hover text-text-muted border-border-subtle'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${wf.status === 'active' ? 'bg-accent-secondary animate-pulse' : 'bg-current'}`} />
                {wf.status.charAt(0).toUpperCase() + wf.status.slice(1)}
              </span>
            </div>

            <div className="flex items-center gap-6 text-xs text-text-muted mb-4">
              <span>Ran {wf.runsCount} times</span>
              <span>Last run: {wf.lastRun}</span>
              <span>Success rate: <span className="text-accent-secondary font-medium">{wf.successRate}%</span></span>
            </div>

            <div className="flex items-center gap-2">
              {wf.status === 'active' ? (
                <button
                  onClick={() => toast('Workflow paused')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-elevated border border-border-subtle rounded-lg text-xs text-text-secondary">
                  <Pause size={14} /> Pause
                </button>
              ) : (
                <button
                  onClick={() => toast.success('Workflow activated')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-primary/10 text-accent-primary rounded-lg text-xs">
                  <Play size={14} /> Activate
                </button>
              )}
              <button
                onClick={() => navigate(`/app/clients/${id}/workflows/${wf.id}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-primary text-white rounded-lg text-xs font-medium hover:brightness-110 transition-all"
              >
                <Settings size={14} /> Edit
              </button>
              <button
                onClick={() => setShowTimeline(showTimeline === wf.id ? null : wf.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-border-subtle rounded-lg text-xs text-text-secondary hover:border-border-active transition-colors"
              >
                <BarChart3 size={14} /> {showTimeline === wf.id ? 'Hide runs' : 'View runs'}
              </button>
            </div>

            {showTimeline === wf.id && (
              <div className="mt-4 pt-4 border-t border-border-subtle">
                <ExecutionTimeline workflowId={wf.id} maxItems={5} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
