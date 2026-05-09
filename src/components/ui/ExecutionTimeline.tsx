import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';

interface ExecutionEvent {
  id: string;
  nodeId: string;
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
}

interface Execution {
  id: string;
  status: 'completed' | 'failed' | 'running' | 'waiting_approval';
  startedAt: string;
  duration: string;
  error?: string;
  triggeredBy: string;
  events: ExecutionEvent[];
}

// Mock execution data
const mockExecutions: Execution[] = [
  {
    id: 'exec_001', status: 'completed', startedAt: '2h ago', duration: '3.4s', triggeredBy: 'schedule',
    events: [
      { id: 'e1', nodeId: 'trigger-1', type: 'node_started', data: { label: 'New Lead in HubSpot' }, timestamp: '2h ago' },
      { id: 'e2', nodeId: 'trigger-1', type: 'node_completed', data: { result: 'Lead detected: Thomas Martin' }, timestamp: '2h ago' },
      { id: 'e3', nodeId: 'agent-1', type: 'node_started', data: { label: 'Max (Lead Qualifier)' }, timestamp: '2h ago' },
      { id: 'e4', nodeId: 'agent-1', type: 'node_completed', data: { result: 'Lead score: 8/10' }, timestamp: '2h ago' },
      { id: 'e5', nodeId: 'condition-1', type: 'node_started', data: { label: 'Score > 7?' }, timestamp: '2h ago' },
      { id: 'e6', nodeId: 'condition-1', type: 'node_completed', data: { result: 'YES' }, timestamp: '2h ago' },
      { id: 'e7', nodeId: 'action-1', type: 'node_started', data: { label: 'Send Intro Email' }, timestamp: '2h ago' },
      { id: 'e8', nodeId: 'action-1', type: 'node_completed', data: { result: 'Email sent to thomas@techscale.com' }, timestamp: '2h ago' },
      { id: 'e9', nodeId: 'action-2', type: 'node_started', data: { label: 'Book Calendly + Notify Slack' }, timestamp: '2h ago' },
      { id: 'e10', nodeId: 'action-2', type: 'node_completed', data: { result: 'Call booked + team notified' }, timestamp: '2h ago' },
    ],
  },
  {
    id: 'exec_002', status: 'completed', startedAt: '5h ago', duration: '2.8s', triggeredBy: 'webhook',
    events: [
      { id: 'e1', nodeId: 'trigger-1', type: 'node_started', data: { label: 'New Lead in HubSpot' }, timestamp: '5h ago' },
      { id: 'e2', nodeId: 'trigger-1', type: 'node_completed', data: { result: 'Lead detected' }, timestamp: '5h ago' },
      { id: 'e3', nodeId: 'agent-1', type: 'node_started', data: { label: 'Max (Lead Qualifier)' }, timestamp: '5h ago' },
      { id: 'e4', nodeId: 'agent-1', type: 'node_completed', data: { result: 'Lead score: 4/10' }, timestamp: '5h ago' },
      { id: 'e5', nodeId: 'condition-1', type: 'node_started', data: { label: 'Score > 7?' }, timestamp: '5h ago' },
      { id: 'e6', nodeId: 'condition-1', type: 'node_completed', data: { result: 'NO' }, timestamp: '5h ago' },
      { id: 'e7', nodeId: 'agent-2', type: 'node_started', data: { label: 'Iris (Nurture)' }, timestamp: '5h ago' },
      { id: 'e8', nodeId: 'agent-2', type: 'node_completed', data: { result: 'Nurture sequence started' }, timestamp: '5h ago' },
    ],
  },
  {
    id: 'exec_003', status: 'failed', startedAt: '1d ago', duration: '1.2s', triggeredBy: 'manual',
    error: 'Gmail API connection timeout — token expired',
    events: [
      { id: 'e1', nodeId: 'trigger-1', type: 'node_started', data: { label: 'New Lead in HubSpot' }, timestamp: '1d ago' },
      { id: 'e2', nodeId: 'trigger-1', type: 'node_completed', data: { result: 'Lead detected' }, timestamp: '1d ago' },
      { id: 'e3', nodeId: 'action-1', type: 'node_started', data: { label: 'Send Intro Email' }, timestamp: '1d ago' },
      { id: 'e4', nodeId: 'action-1', type: 'node_failed', data: { error: 'Gmail API connection timeout' }, timestamp: '1d ago' },
    ],
  },
  {
    id: 'exec_004', status: 'waiting_approval', startedAt: '3h ago', duration: '—', triggeredBy: 'api',
    events: [
      { id: 'e1', nodeId: 'trigger-1', type: 'node_started', data: { label: 'New Lead' }, timestamp: '3h ago' },
      { id: 'e2', nodeId: 'agent-1', type: 'node_started', data: { label: 'Max' }, timestamp: '3h ago' },
      { id: 'e3', nodeId: 'agent-1', type: 'node_completed', data: { result: 'Draft ready' }, timestamp: '3h ago' },
      { id: 'e4', nodeId: 'approval-1', type: 'approval_requested', data: { message: 'Review email before sending' }, timestamp: '3h ago' },
    ],
  },
  {
    id: 'exec_005', status: 'completed', startedAt: '1d ago', duration: '4.1s', triggeredBy: 'schedule',
    events: [
      { id: 'e1', nodeId: 'trigger-1', type: 'node_started', data: { label: 'Scheduled' }, timestamp: '1d ago' },
      { id: 'e2', nodeId: 'agent-1', type: 'node_started', data: { label: 'Nova (Reporter)' }, timestamp: '1d ago' },
      { id: 'e3', nodeId: 'agent-1', type: 'node_completed', data: { result: 'Weekly report generated' }, timestamp: '1d ago' },
      { id: 'e4', nodeId: 'action-1', type: 'node_started', data: { label: 'Notify Slack' }, timestamp: '1d ago' },
      { id: 'e5', nodeId: 'action-1', type: 'node_completed', data: { result: 'Team notified' }, timestamp: '1d ago' },
    ],
  },
];

const statusConfig = {
  completed: { icon: <CheckCircle2 size={14} />, color: 'text-accent-secondary', bg: 'bg-accent-secondary/10', label: 'Completed' },
  failed: { icon: <XCircle size={14} />, color: 'text-accent-danger', bg: 'bg-accent-danger/10', label: 'Failed' },
  running: { icon: <Clock size={14} />, color: 'text-accent-primary', bg: 'bg-accent-primary/10', label: 'Running' },
  waiting_approval: { icon: <AlertCircle size={14} />, color: 'text-accent-warning', bg: 'bg-accent-warning/10', label: 'Awaiting Approval' },
};

const eventTypeConfig: Record<string, { color: string; label: string }> = {
  node_started: { color: 'bg-accent-primary', label: 'Started' },
  node_completed: { color: 'bg-accent-secondary', label: 'Completed' },
  node_failed: { color: 'bg-accent-danger', label: 'Failed' },
  node_retried: { color: 'bg-accent-warning', label: 'Retried' },
  approval_requested: { color: 'bg-accent-warning', label: 'Approval Requested' },
  approval_granted: { color: 'bg-accent-secondary', label: 'Approved' },
  approval_rejected: { color: 'bg-accent-danger', label: 'Rejected' },
};

interface ExecutionTimelineProps {
  workflowId?: string;
  maxItems?: number;
}

export function ExecutionTimeline({ workflowId, maxItems = 10 }: ExecutionTimelineProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'failed'>('all');

  const filtered = mockExecutions
    .filter((e) => filter === 'all' || e.status === filter)
    .filter(() => true) // In real code: filter by workflowId
    .slice(0, maxItems);

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex items-center gap-2">
        {(['all', 'completed', 'failed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              filter === f ? 'bg-bg-hover text-text-primary' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {f === 'all' ? 'All' : f === 'completed' ? 'Successful' : 'Failed'}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {filtered.map((exec, i) => {
          const config = statusConfig[exec.status];
          const isExpanded = expanded === exec.id;

          return (
            <div key={exec.id} className="relative">
              {/* Timeline line */}
              {i < filtered.length - 1 && (
                <div className="absolute left-[19px] top-10 bottom-0 w-px bg-border-subtle" />
              )}

              <div className="flex gap-4">
                {/* Dot */}
                <div className={`relative z-10 mt-1 w-[15px] h-[15px] rounded-full border-2 flex-shrink-0 ${
                  exec.status === 'completed' ? 'border-accent-secondary bg-bg-surface' :
                  exec.status === 'failed' ? 'border-accent-danger bg-bg-surface' :
                  exec.status === 'running' ? 'border-accent-primary bg-accent-primary animate-pulse' :
                  'border-accent-warning bg-bg-surface'
                }`}>
                  {exec.status === 'completed' && <div className="absolute inset-0.5 rounded-full bg-accent-secondary" />}
                  {exec.status === 'failed' && <div className="absolute inset-0.5 rounded-full bg-accent-danger" />}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div
                    onClick={() => setExpanded(isExpanded ? null : exec.id)}
                    className="bg-bg-surface border border-border-subtle rounded-xl p-4 hover:border-border-active cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                          {config.icon} {config.label}
                        </span>
                        <span className="text-xs text-text-muted">{exec.triggeredBy}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span>{exec.startedAt}</span>
                        <span className="font-mono">{exec.duration}</span>
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </div>
                    </div>

                    {exec.error && (
                      <div className="text-xs text-accent-danger bg-accent-danger/5 rounded-lg px-3 py-2 mb-2">
                        {exec.error}
                      </div>
                    )}

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pt-3 border-t border-border-subtle space-y-1">
                            {exec.events.map((event) => {
                              const evConfig = eventTypeConfig[event.type] || { color: 'bg-text-muted', label: event.type };
                              return (
                                <div key={event.id} className="flex items-center gap-2 py-1">
                                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${evConfig.color}`} />
                                  <span className="text-xs text-text-secondary flex-1">
                                    <span className="font-medium text-text-primary">{event.nodeId}</span>
                                    {' — '}
                                    {event.type === 'node_started' && 'Started'}
                                    {event.type === 'node_completed' && `Completed: ${(event.data.result as string) || ''}`}
                                    {event.type === 'node_failed' && `Failed: ${(event.data.error as string) || ''}`}
                                    {event.type === 'approval_requested' && 'Approval requested'}
                                    {event.type === 'approval_granted' && 'Approval granted'}
                                    {event.type === 'approval_rejected' && 'Approval rejected'}
                                  </span>
                                  <span className="text-[10px] text-text-muted whitespace-nowrap">{event.timestamp}</span>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-text-muted text-sm">
            No executions found for this filter.
          </div>
        )}
      </div>
    </div>
  );
}
