import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plug, CheckCircle2, Loader2, XCircle, RefreshCw, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

type IntegrationStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

const initialIntegrations = [
  { category: 'CRM', items: [
    { name: 'HubSpot', status: 'connected' as IntegrationStatus },
    { name: 'Salesforce', status: 'disconnected' as IntegrationStatus },
    { name: 'Pipedrive', status: 'disconnected' as IntegrationStatus },
  ]},
  { category: 'Email', items: [
    { name: 'Gmail', status: 'connected' as IntegrationStatus },
    { name: 'Outlook', status: 'disconnected' as IntegrationStatus },
    { name: 'Mailchimp', status: 'disconnected' as IntegrationStatus },
  ]},
  { category: 'Social', items: [
    { name: 'LinkedIn', status: 'disconnected' as IntegrationStatus },
    { name: 'Instagram', status: 'disconnected' as IntegrationStatus },
    { name: 'Facebook', status: 'disconnected' as IntegrationStatus },
  ]},
  { category: 'Analytics', items: [
    { name: 'Google Analytics 4', status: 'connected' as IntegrationStatus },
    { name: 'Meta Ads', status: 'disconnected' as IntegrationStatus },
    { name: 'SEMrush', status: 'disconnected' as IntegrationStatus },
  ]},
  { category: 'PM Tools', items: [
    { name: 'Notion', status: 'connected' as IntegrationStatus },
    { name: 'Asana', status: 'disconnected' as IntegrationStatus },
    { name: 'ClickUp', status: 'disconnected' as IntegrationStatus },
  ]},
  { category: 'Messaging', items: [
    { name: 'Slack', status: 'connected' as IntegrationStatus },
    { name: 'WhatsApp', status: 'disconnected' as IntegrationStatus },
    { name: 'Telegram', status: 'disconnected' as IntegrationStatus },
  ]},
];

const statusConfig = {
  connected: { icon: <CheckCircle2 size={14} />, label: 'Connected', className: 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20' },
  disconnected: { icon: <Plug size={14} />, label: 'Connect', className: 'bg-accent-primary/10 text-accent-primary border-transparent hover:bg-accent-primary/20' },
  connecting: { icon: <Loader2 size={14} className="animate-spin" />, label: 'Connecting...', className: 'bg-accent-warning/10 text-accent-warning border-transparent opacity-70' },
  error: { icon: <XCircle size={14} />, label: 'Retry', className: 'bg-accent-danger/10 text-accent-danger border-transparent hover:bg-accent-danger/20' },
};

export function Integrations() {
  const [groups, setGroups] = useState(initialIntegrations);

  const handleToggle = (categoryIdx: number, itemIdx: number) => {
    const item = groups[categoryIdx].items[itemIdx];

    if (item.status === 'connected') {
      // Disconnect
      setGroups((prev) => {
        const updated = [...prev];
        updated[categoryIdx] = { ...updated[categoryIdx], items: [...updated[categoryIdx].items] };
        updated[categoryIdx].items[itemIdx] = { ...item, status: 'disconnected' };
        return updated;
      });
      toast.success(`${item.name} disconnected`);
      return;
    }

    if (item.status === 'connecting') return;

    // Start connecting
    setGroups((prev) => {
      const updated = [...prev];
      updated[categoryIdx] = { ...updated[categoryIdx], items: [...updated[categoryIdx].items] };
      updated[categoryIdx].items[itemIdx] = { ...item, status: 'connecting' };
      return updated;
    });

    toast(`Redirecting to ${item.name}...`, { icon: <ExternalLink size={14} />, duration: 1000 });

    // Simulate OAuth flow
    setTimeout(() => {
      // 90% success rate
      const success = Math.random() > 0.1;
      setGroups((prev) => {
        const updated = [...prev];
        updated[categoryIdx] = { ...updated[categoryIdx], items: [...updated[categoryIdx].items] };
        updated[categoryIdx].items[itemIdx] = { ...item, status: success ? 'connected' : 'error' };
        return updated;
      });
      if (success) {
        toast.success(`${item.name} connected ✓`);
      } else {
        toast.error(`${item.name} connection failed — try again`);
      }
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">Integrations</h1>
        <p className="text-text-secondary text-sm mt-1">Connect the tools your clients already use. {groups.flatMap((g) => g.items).filter((i) => i.status === 'connected').length} connected.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group, gi) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.05 }}
            className="bg-bg-surface border border-border-subtle rounded-xl p-5"
          >
            <h3 className="font-display font-semibold text-text-primary mb-4">{group.category}</h3>
            <div className="space-y-2">
              {group.items.map((item, ii) => {
                const config = statusConfig[item.status];
                return (
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-bg-base border border-border-subtle">
                    <div className="flex items-center gap-3">
                      <Plug size={16} className={item.status === 'connected' ? 'text-accent-secondary' : 'text-text-muted'} />
                      <span className="text-sm text-text-secondary">{item.name}</span>
                      {item.status === 'connected' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent-secondary/10 text-accent-secondary">Active</span>
                      )}
                      {item.status === 'error' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent-danger/10 text-accent-danger">Failed</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleToggle(gi, ii)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors border ${config.className}`}
                    >
                      {config.icon} {item.status === 'connected' ? 'Disconnect' : config.label}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
