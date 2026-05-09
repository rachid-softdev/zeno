import { useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { mockClientAnalytics } from '../lib/mockData';
import { StatCard } from '../components/ui/StatCard';
import { Activity, MessageSquare, Clock, TrendingUp, Target, FileText, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';

type DateRange = '7d' | '30d' | '90d' | 'custom';

const multipliers: Record<DateRange, number> = { '7d': 1, '30d': 4, '90d': 12, 'custom': 4 };

export function ClientAnalytics() {
  const { id } = useParams<{ id: string }>();
  const raw = mockClientAnalytics[id!];
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [showCustom, setShowCustom] = useState(false);

  const analytics = useMemo(() => {
    if (!raw) return null;
    const m = multipliers[dateRange];
    return {
      ...raw,
      tasksCompleted: raw.tasksCompleted * m / 4,
      messagesHandled: raw.messagesHandled * m / 4,
      hoursSaved: raw.hoursSaved * m / 4,
      leadsQualified: raw.leadsQualified * m / 4,
      contentPublished: raw.contentPublished * m / 4,
    };
  }, [raw, dateRange]);

  if (!analytics) return <div className="p-8 text-text-muted text-center">No analytics data.</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-primary">Analytics</h1>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-bg-surface border border-border-subtle rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((d) => (
              <button
                key={d}
                onClick={() => { setDateRange(d); setShowCustom(false); }}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${dateRange === d && !showCustom ? 'bg-bg-elevated text-text-primary' : 'text-text-muted hover:text-text-secondary'}`}
              >{d}</button>
            ))}
            <button
              onClick={() => { setShowCustom(true); setDateRange('custom'); }}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${showCustom ? 'bg-bg-elevated text-text-primary' : 'text-text-muted hover:text-text-secondary'}`}
            >
              <Calendar size={12} /> Custom
            </button>
          </div>
          {showCustom && (
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <input type="date" className="bg-bg-surface border border-border-subtle rounded px-2 py-1 text-xs text-text-primary" />
              <span>→</span>
              <input type="date" className="bg-bg-surface border border-border-subtle rounded px-2 py-1 text-xs text-text-primary" />
            </div>
          )}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard label="Tasks" value={String(analytics.tasksCompleted)} trend={`↑${analytics.trend}%`} trendUp icon={<Activity size={14} className="text-accent-primary" />} />
        <StatCard label="Messages" value={String(analytics.messagesHandled)} icon={<MessageSquare size={14} className="text-accent-secondary" />} />
        <StatCard label="Hours saved" value={`${analytics.hoursSaved}h`} icon={<Clock size={14} className="text-accent-warning" />} />
        <StatCard label="Avg response" value={analytics.avgResponseTime} icon={<TrendingUp size={14} className="text-accent-primary" />} />
        <StatCard label="Leads qualified" value={String(analytics.leadsQualified)} icon={<Target size={14} className="text-accent-secondary" />} />
        <StatCard label="Published" value={String(analytics.contentPublished)} icon={<FileText size={14} className="text-accent-primary" />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Activity Area Chart */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
          <h3 className="font-display font-semibold text-text-primary mb-4">Agent Activity Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={analytics.agentActivity[0]?.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2A40" />
              <XAxis dataKey="day" stroke="#4A5878" fontSize={12} />
              <YAxis stroke="#4A5878" fontSize={12} />
              <Tooltip contentStyle={{ background: '#0F1420', border: '1px solid #1E2A40', borderRadius: '8px', color: '#F0F4FF' }} />
              {analytics.agentActivity.map((a) => (
                <Area key={a.agentName} type="monotone" dataKey="tasks" data={a.data} stroke={a.color} fill={a.color} fillOpacity={0.1} name={a.agentName} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Channel Donut */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
          <h3 className="font-display font-semibold text-text-primary mb-4">Channel Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={analytics.channelBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
                {analytics.channelBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0F1420', border: '1px solid #1E2A40', borderRadius: '8px' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Time by Category Bar */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
          <h3 className="font-display font-semibold text-text-primary mb-4">Time Saved by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.timeByCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2A40" />
              <XAxis type="number" stroke="#4A5878" fontSize={12} />
              <YAxis type="category" dataKey="category" stroke="#4A5878" fontSize={12} width={120} />
              <Tooltip contentStyle={{ background: '#0F1420', border: '1px solid #1E2A40', borderRadius: '8px' }} />
              <Bar dataKey="hours" fill="#3B82F6" radius={[0, 4, 4, 0]} name="Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Agency-wide overview */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
          <h3 className="font-display font-semibold text-text-primary mb-4">Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border-subtle">
              <span className="text-sm text-text-secondary">Total hours saved this month</span>
              <span className="font-mono text-lg text-text-primary">{analytics.hoursSaved * 4}h</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border-subtle">
              <span className="text-sm text-text-secondary">Estimated cost savings (@ €25/h)</span>
              <span className="font-mono text-lg text-accent-secondary">€{analytics.hoursSaved * 4 * 25}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border-subtle">
              <span className="text-sm text-text-secondary">Content pieces produced</span>
              <span className="font-mono text-lg text-text-primary">{analytics.contentPublished * 4}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-text-secondary">Leads qualified</span>
              <span className="font-mono text-lg text-text-primary">{analytics.leadsQualified * 4}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
