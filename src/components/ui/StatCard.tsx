import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon?: ReactNode;
}

export function StatCard({ label, value, trend, trendUp, icon }: StatCardProps) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 hover:border-border-active transition-colors duration-150">
      <div className="flex items-center justify-between mb-2">
        <span className="text-text-muted text-xs font-medium uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <div className="font-mono text-2xl font-medium text-text-primary tabular-nums">{value}</div>
      {trend && (
        <div className={`flex items-center gap-1 mt-1 text-xs ${trendUp ? 'text-accent-secondary' : 'text-accent-danger'}`}>
          <span>{trendUp ? '↑' : '↓'}</span>
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}
