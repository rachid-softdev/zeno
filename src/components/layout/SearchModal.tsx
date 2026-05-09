import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Users, Bot, FileText, MessageSquare, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../stores/appStore';
import { getAllAgents } from '../../lib/mockData';

interface SearchResult {
  type: 'client' | 'agent' | 'workflow' | 'chat';
  label: string;
  subtitle: string;
  path: string;
}

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { clients } = useAppStore();
  const agents = getAllAgents();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const res: SearchResult[] = [];

    clients.forEach((c) => {
      if (c.name.toLowerCase().includes(q)) {
        res.push({ type: 'client', label: c.name, subtitle: `${c.industry} · Client workspace`, path: `/app/clients/${c.id}` });
      }
    });

    agents.forEach((a) => {
      if (a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q)) {
        const client = clients.find((c) => c.id === a.clientId);
        res.push({ type: 'agent', label: a.name, subtitle: `${a.role} · ${client?.name || ''}`, path: `/app/clients/${a.clientId}/chat/${a.id}` });
      }
    });

    // Workflows
    if ('new lead'.includes(q) || 'qualify'.includes(q)) {
      res.push({ type: 'workflow', label: 'New Lead → Qualify → Book Call', subtitle: 'Active · Hexa Corp', path: '/app/clients/cl_001/workflows/wf_001' });
    }
    if ('weekly report'.includes(q)) {
      res.push({ type: 'workflow', label: 'Weekly Report Generation', subtitle: 'Active · All clients', path: '/app/clients/cl_001/workflows' });
    }

    setResults(res.slice(0, 8));
  }, [query, clients, agents]);

  const iconMap = {
    client: <Users size={14} />,
    agent: <Bot size={14} />,
    workflow: <FileText size={14} />,
    chat: <MessageSquare size={14} />,
  };

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            className="bg-bg-surface border border-border-subtle rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
              <Search size={18} className="text-text-muted flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search agents, clients, workflows..."
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
              />
              <kbd className="text-[10px] font-mono text-text-muted bg-bg-elevated px-1.5 py-0.5 rounded border border-border-subtle">esc</kbd>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {results.length === 0 && query && (
                <div className="p-8 text-center text-text-muted text-sm">No results for "{query}"</div>
              )}
              {results.map((r, i) => (
                <div
                  key={i}
                  onClick={() => handleSelect(r.path)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-bg-hover cursor-pointer transition-colors border-b border-border-subtle last:border-0"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    r.type === 'agent' ? 'bg-accent-primary/10 text-accent-primary' :
                    r.type === 'client' ? 'bg-accent-secondary/10 text-accent-secondary' :
                    'bg-accent-warning/10 text-accent-warning'
                  }`}>
                    {iconMap[r.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-text-primary font-medium truncate">{r.label}</div>
                    <div className="text-xs text-text-muted truncate">{r.subtitle}</div>
                  </div>
                  <div className="text-xs text-text-muted uppercase">{r.type}</div>
                </div>
              ))}
              {results.length === 0 && !query && (
                <div className="p-8 text-center">
                  <Search size={24} className="mx-auto mb-2 text-text-muted" />
                  <p className="text-sm text-text-muted">Type to search across your agency</p>
                  <p className="text-xs text-text-muted mt-1">Agents, clients, workflows, conversations...</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
