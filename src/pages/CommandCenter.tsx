import { motion } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '../stores/appStore';
import { StatCard } from '../components/ui/StatCard';
import { NewClientModal } from '../components/ui/NewClientModal';
import { mockAgencyAnalytics } from '../lib/mockData';
import { Activity, Users, Clock, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type FeedFilter = 'all' | 'review' | 'completed' | 'errors';

export function CommandCenter() {
  const { clients, activityFeed, setActiveClient } = useAppStore();
  const navigate = useNavigate();
  const analytics = mockAgencyAnalytics;
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('all');
  const [showNewClient, setShowNewClient] = useState(false);

  useEffect(() => {
    const handler = () => setShowNewClient(true);
    window.addEventListener('open-new-client-modal', handler);
    return () => window.removeEventListener('open-new-client-modal', handler);
  }, []);

  const filteredFeed = useMemo(() => {
    return activityFeed.filter((item) => {
      if (feedFilter === 'all') return true;
      if (feedFilter === 'review') return item.type === 'review';
      if (feedFilter === 'completed') return item.type === 'success';
      if (feedFilter === 'errors') return item.type === 'error';
      return true;
    });
  }, [activityFeed, feedFilter]);

  const clientColorMap: Record<number, string> = {
    0: '#3B82F6', 1: '#EC4899', 2: '#8B5CF6', 3: '#10B981',
  };

  return (
    <div className="p-6 space-y-6">
      {/* KPI Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard label="Tasks completed today" value="247" trend="↑12% vs last week" trendUp icon={<Activity size={16} className="text-accent-primary" />} />
        <StatCard label="Active clients" value="14" icon={<Users size={16} className="text-accent-secondary" />} />
        <StatCard label="Hours saved this week" value="68h" trend="↑8%" trendUp icon={<Clock size={16} className="text-accent-warning" />} />
        <StatCard label="Automations running" value="32" trend="↑3" trendUp icon={<Zap size={16} className="text-accent-primary" />} />
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border-subtle flex items-center justify-between">
              <h3 className="font-display font-semibold text-text-primary">Client Feed</h3>
              <div className="flex gap-1.5">
                {(['all', 'review', 'completed', 'errors'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFeedFilter(f)}
                    className={`px-3 py-1 rounded text-xs transition-colors ${
                      feedFilter === f ? 'bg-bg-hover text-text-primary font-medium' : 'text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'review' ? 'Needs review' : f === 'completed' ? 'Completed' : 'Errors'}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-border-subtle">
              {filteredFeed.length === 0 ? (
                <div className="p-8 text-center text-text-muted text-sm">No items match this filter</div>
              ) : (
                filteredFeed.slice(0, 8).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-center gap-3 px-5 py-3 hover:bg-bg-hover/50 cursor-pointer transition-colors ${
                    item.type === 'review' ? 'border-l-2 border-l-accent-warning' : item.type === 'error' ? 'border-l-2 border-l-accent-danger' : ''
                  }`}
                  onClick={() => {
                    setActiveClient(item.clientId);
                    navigate(`/app/clients/${item.clientId}`);
                  }}
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-medium text-text-muted whitespace-nowrap">{item.clientName}</span>
                  <span className="text-sm text-text-secondary flex-1 truncate">
                    <span className="font-medium text-text-primary">{item.agentName}</span> — {item.action}
                  </span>
                  <span className="text-xs text-text-muted whitespace-nowrap">{item.timestamp}</span>
                  {item.type === 'review' && (
                    <button className="flex-shrink-0 px-2 py-0.5 text-xs bg-accent-warning/10 text-accent-warning rounded">Review</button>
                  )}
                  {item.type === 'error' && (
                    <button className="flex-shrink-0 px-2 py-0.5 text-xs bg-accent-danger/10 text-accent-danger rounded">Fix</button>
                  )}
                </motion.div>
              ))
              )}
            </div>
          </div>
        </div>

        {/* Clients at a glance */}
        <div>
          <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border-subtle">
              <h3 className="font-display font-semibold text-text-primary">Clients at a glance</h3>
            </div>
            <div className="p-3 space-y-2 max-h-[500px] overflow-y-auto">
              {clients.map((client, i) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => { setActiveClient(client.id); navigate(`/app/clients/${client.id}`); }}
                  className="p-3 rounded-lg bg-bg-base border border-border-subtle hover:border-border-active cursor-pointer transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: clientColorMap[i] || '#4A5878' }} />
                    <span className="text-sm font-medium text-text-primary">{client.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-hover text-text-muted">{client.industry}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {[0, 1, 2, 3].map((j) => (
                      <div key={j} className={`w-1.5 h-1.5 rounded-full ${j < 3 ? 'bg-accent-secondary' : 'bg-bg-hover'}`} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>Tasks: {12 + i * 6}</span>
                    <span className="italic">Active</span>
                  </div>
                </motion.div>
              ))}
              <button
                onClick={() => setShowNewClient(true)}
                className="w-full p-3 rounded-lg border border-dashed border-border-subtle text-text-muted hover:text-text-secondary hover:border-border-active transition-colors text-sm text-center"
              >
                + Add new client workspace
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
          <h3 className="font-display font-semibold text-text-primary mb-3 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-accent-secondary" /> This week's highlights
          </h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>• Sofia published 12 SEO articles across 4 clients</li>
            <li>• Max qualified 28 leads and booked 15 discovery calls</li>
            <li>• Leon handled 450+ emails with 94% auto-resolution rate</li>
            <li>• 68 hours of manual work automated this week (+8% vs last)</li>
          </ul>
          <button className="mt-3 text-xs text-accent-primary hover:underline">View full report →</button>
        </div>

        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
          <h3 className="font-display font-semibold text-text-primary mb-3 flex items-center gap-2">
            <AlertTriangle size={18} className="text-accent-warning" /> Agency alerts
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-danger mt-1.5 flex-shrink-0" />
              <span className="text-text-secondary">Gmail connection lost for Nova Formation — Email Responder paused</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-warning mt-1.5 flex-shrink-0" />
              <span className="text-text-secondary">3 Instagram posts pending review for Makers & Co</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-primary mt-1.5 flex-shrink-0" />
              <span className="text-text-secondary">2 new high-value leads qualified for Hexa Corp — follow up needed</span>
            </li>
          </ul>
        </div>
      </div>

      <NewClientModal
        isOpen={showNewClient}
        onClose={() => setShowNewClient(false)}
        onCreated={(client) => {
          // Mock: add to store
          useAppStore.getState().clients.push(client);
        }}
      />
    </div>
  );
}
