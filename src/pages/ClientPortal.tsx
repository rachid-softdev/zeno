import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockClients, getClientAgents, mockActivityFeed, mockClientAnalytics } from '../lib/mockData';
import { Activity, Clock, CheckCircle2, TrendingUp, Bot, Shield } from 'lucide-react';

export function ClientPortal() {
  const { id } = useParams<{ id: string }>();
  const client = mockClients.find((c) => c.id === id);
  const agents = getClientAgents(id!);
  const analytics = mockClientAnalytics[id!];
  const feed = mockActivityFeed
    .filter((item) => item.clientId === id)
    .slice(0, 10);

  if (!client) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-center text-text-muted">
          <Shield size={32} className="mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">Portal not found</p>
          <p className="text-sm mt-1">Please check the link provided by your agency.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <header className="border-b border-border-subtle bg-bg-surface/30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-secondary/20 to-accent-primary/10 border border-border-subtle flex items-center justify-center text-accent-primary font-display font-bold text-sm">
              {client.name.slice(0, 2)}
            </div>
            <div>
              <h1 className="font-display font-bold text-text-primary">{client.name}</h1>
              <p className="text-[10px] text-text-muted -mt-0.5">Performance Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span>Powered by</span>
            <span className="font-display font-semibold text-accent-primary">Atelier Bold</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* KPIs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { label: 'Tasks Completed', value: analytics?.tasksCompleted || 0, icon: <Activity size={16} className="text-accent-primary" />, sub: 'This month' },
            { label: 'Time Saved', value: `${analytics?.hoursSaved || 0}h`, icon: <Clock size={16} className="text-accent-secondary" />, sub: 'This month' },
            { label: 'Active Agents', value: agents.filter((a) => a.status === 'active').length, icon: <Bot size={16} className="text-accent-warning" />, sub: 'Working for you' },
            { label: 'Avg. Response', value: analytics?.avgResponseTime || '—', icon: <TrendingUp size={16} className="text-accent-primary" />, sub: 'Agent speed' },
          ].map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-bg-surface border border-border-subtle rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-text-muted uppercase tracking-wider">{kpi.label}</span>
                {kpi.icon}
              </div>
              <div className="font-mono text-2xl font-medium text-text-primary">{kpi.value}</div>
              <div className="text-[10px] text-text-muted mt-1">{kpi.sub}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border-subtle">
                <h2 className="font-display font-semibold text-text-primary flex items-center gap-2">
                  <Activity size={16} className="text-accent-primary" /> Recent Activity
                </h2>
              </div>
              <div className="divide-y divide-border-subtle">
                {feed.length === 0 ? (
                  <div className="p-8 text-center text-text-muted text-sm">No recent activity yet</div>
                ) : (
                  feed.map((item, i) => (
                    <div key={item.id} className="flex items-center gap-3 px-5 py-3 hover:bg-bg-hover/30 transition-colors">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-text-secondary">
                          <span className="font-medium text-text-primary">{item.agentName}</span> — {item.action}
                        </span>
                      </div>
                      <span className="text-xs text-text-muted whitespace-nowrap">{item.timestamp}</span>
                      {item.type === 'review' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-warning/10 text-accent-warning">Pending</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Agents overview */}
          <div>
            <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border-subtle">
                <h2 className="font-display font-semibold text-text-primary flex items-center gap-2">
                  <Bot size={16} className="text-accent-secondary" /> Your Agent Team
                </h2>
              </div>
              <div className="p-3 space-y-2">
                {agents.map((agent) => (
                  <div key={agent.id} className="flex items-center gap-3 p-3 rounded-lg bg-bg-base border border-border-subtle">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                      style={{ backgroundColor: agent.avatarColor }}
                    >
                      {agent.name.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-text-primary font-medium truncate">{agent.name}</div>
                      <div className="text-[10px] text-text-muted">{agent.role}</div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-accent-secondary animate-pulse' : 'bg-text-muted'}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 mt-4">
              <h3 className="font-display font-semibold text-text-primary mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-accent-secondary" /> Highlights
              </h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent-secondary" />
                  {analytics?.contentPublished || 0} content pieces published this month
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent-secondary" />
                  {analytics?.leadsQualified || 0} leads qualified
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent-secondary" />
                  Agents responded to {analytics?.messagesHandled || 0}+ messages
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent-secondary" />
                  All tasks handled by AI agents 24/7
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 border-t border-border-subtle">
          <p className="text-xs text-text-muted">
            This portal is provided by <span className="font-medium text-text-secondary">Atelier Bold</span> via{' '}
            <span className="font-display font-semibold text-accent-primary">Zeno</span> — AI operations for agencies.
          </p>
        </div>
      </div>
    </div>
  );
}
