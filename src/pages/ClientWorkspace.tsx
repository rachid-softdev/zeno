import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../stores/appStore';
import { StatCard } from '../components/ui/StatCard';
import { getClientAgents } from '../lib/mockData';
import { Bot, MessageSquare, Clock, TrendingUp, Activity, Plus, MessageCircle } from 'lucide-react';

export function ClientWorkspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const client = useAppStore((s) => s.getClient(id!));
  const agents = getClientAgents(id!);

  if (!client) {
    return <div className="p-8 text-text-muted">Client not found.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Client Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-surface border border-border-subtle rounded-xl p-5"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-secondary/20 to-accent-primary/20 border border-border-subtle flex items-center justify-center">
              <span className="text-xl font-display font-bold text-accent-primary">{client.name.slice(0, 2)}</span>
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-text-primary">{client.name}</h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-text-secondary">
                <span className="text-xs px-2 py-0.5 rounded-full bg-bg-hover text-text-muted">{client.industry}</span>
                <a href={client.website} className="text-accent-primary hover:underline text-xs" target="_blank" rel="noopener">{client.website}</a>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-accent-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary" /> Active
            </span>
            <button onClick={() => navigate(`/app/clients/${id}/agents`)} className="px-3 py-1.5 bg-accent-primary/10 text-accent-primary text-xs rounded-lg hover:bg-accent-primary/20 transition-colors">Ask an agent</button>
            <button onClick={() => navigate(`/app/clients/${id}/inbox`)} className="px-3 py-1.5 border border-border-subtle text-text-secondary text-xs rounded-lg hover:border-border-active transition-colors">View inbox</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {client.toneOfVoice.map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-bg-hover text-text-muted">{t}</span>
          ))}
        </div>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tasks today" value="34" trend="↑12%" trendUp icon={<Activity size={16} className="text-accent-primary" />} />
        <StatCard label="Active agents" value={`${agents.filter((a) => a.status === 'active').length}`} icon={<Bot size={16} className="text-accent-secondary" />} />
        <StatCard label="Messages handled" value="89" icon={<MessageSquare size={16} className="text-accent-warning" />} />
        <StatCard label="Time saved this week" value={`${agents.reduce((s, a) => s + a.hoursSaved, 0).toFixed(1)}h`} icon={<Clock size={16} className="text-accent-primary" />} />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity */}
        <div className="lg:col-span-2">
          <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
            <h3 className="font-display font-semibold text-text-primary mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {agents.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-bg-base border border-border-subtle"
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: agent.avatarColor }} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-text-primary">{agent.name}</span>
                    <span className="text-xs text-text-muted ml-2">{agent.role}</span>
                    <p className="text-xs text-text-secondary truncate mt-0.5">{agent.lastAction}</p>
                  </div>
                  <span className="text-xs text-text-muted whitespace-nowrap">{agent.lastActionTime}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Agents Panel */}
        <div>
          <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border-subtle flex items-center justify-between">
              <h3 className="font-display font-semibold text-text-primary">Client Agents</h3>
              <button onClick={() => navigate(`/app/clients/${id}/agents`)} className="text-xs text-accent-primary hover:underline">View all</button>
            </div>
            <div className="p-3 space-y-2">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center gap-3 p-3 rounded-lg bg-bg-base border border-border-subtle">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: agent.avatarColor }}
                  >
                    {agent.name.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-text-primary font-medium truncate">{agent.name}</div>
                    <div className="text-xs text-text-muted">{agent.tasksThisWeek} tasks this week</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-accent-secondary' : 'bg-text-muted'}`} />
                  <button
                    onClick={() => navigate(`/app/clients/${id}/chat/${agent.id}`)}
                    className="p-1.5 rounded hover:bg-bg-hover text-text-muted hover:text-text-primary transition-colors"
                  >
                    <MessageCircle size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => navigate(`/app/clients/${id}/agents`)}
                className="w-full p-2 rounded-lg border border-dashed border-border-subtle text-text-muted text-xs hover:border-border-active transition-colors"
              >
                <Plus size={14} className="inline mr-1" /> Deploy new agent
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
