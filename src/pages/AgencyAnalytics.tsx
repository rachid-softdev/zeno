import { mockAgencyAnalytics } from '../lib/mockData';
import { StatCard } from '../components/ui/StatCard';
import { Activity, MessageSquare, Clock, TrendingUp, Target, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export function AgencyAnalytics() {
  const a = mockAgencyAnalytics;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-primary">Agency Analytics</h1>
        <div className="flex gap-1 bg-bg-surface border border-border-subtle rounded-lg p-1">
          {['7d', '30d', '90d'].map((d) => (
            <button key={d} className={`px-3 py-1 rounded text-xs font-medium ${d === '30d' ? 'bg-bg-elevated text-text-primary' : 'text-text-muted'}`}>{d}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard label="Tasks" value={String(a.tasksCompleted)} trend={`↑${a.trend}%`} trendUp icon={<Activity size={14} className="text-accent-primary" />} />
        <StatCard label="Messages" value={String(a.messagesHandled)} icon={<MessageSquare size={14} className="text-accent-secondary" />} />
        <StatCard label="Hours saved" value={`${a.hoursSaved}h`} icon={<Clock size={14} className="text-accent-warning" />} />
        <StatCard label="Avg response" value={a.avgResponseTime} icon={<TrendingUp size={14} className="text-accent-primary" />} />
        <StatCard label="Leads" value={String(a.leadsQualified)} icon={<Target size={14} className="text-accent-secondary" />} />
        <StatCard label="Published" value={String(a.contentPublished)} icon={<FileText size={14} className="text-accent-primary" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
          <h3 className="font-display font-semibold text-text-primary mb-4">Channel Breakdown (All Clients)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={a.channelBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
                {a.channelBreakdown.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0F1420', border: '1px solid #1E2A40', borderRadius: '8px' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
          <h3 className="font-display font-semibold text-text-primary mb-4">Time Saved by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={a.timeByCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2A40" />
              <XAxis type="number" stroke="#4A5878" fontSize={12} />
              <YAxis type="category" dataKey="category" stroke="#4A5878" fontSize={12} width={120} />
              <Tooltip contentStyle={{ background: '#0F1420', border: '1px solid #1E2A40', borderRadius: '8px' }} />
              <Bar dataKey="hours" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-bg-surface border border-border-subtle rounded-xl p-5">
          <h3 className="font-display font-semibold text-text-primary mb-4">ROI Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total hours saved', value: `${a.hoursSaved * 4}h`, sub: 'This month' },
              { label: 'Cost savings (@ €25/h)', value: `€${(a.hoursSaved * 4 * 25).toLocaleString()}`, sub: 'Equivalent labor cost' },
              { label: 'Active automations', value: '32', sub: 'Across all clients' },
              { label: 'Client satisfaction', value: '4.8/5', sub: 'Avg agent rating' },
            ].map((item) => (
              <div key={item.label} className="text-center p-4 bg-bg-base rounded-lg">
                <div className="font-mono text-2xl text-text-primary font-medium">{item.value}</div>
                <div className="text-xs text-text-secondary mt-1">{item.label}</div>
                <div className="text-[10px] text-text-muted">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
