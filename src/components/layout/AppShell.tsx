import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { SearchModal } from './SearchModal';
import { useKeyboardShortcuts } from '../../lib/shortcuts';
import { Home, Users, MessageSquare, Bell, Menu, X, Command } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';

export function AppShell() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { clients } = useAppStore();

  useKeyboardShortcuts();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setShortcutsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const shortcuts = [
    { keys: '⌘K', desc: 'Global search' },
    { keys: '⌘B', desc: 'Toggle sidebar' },
    { keys: '⌘N', desc: 'New template / agent' },
    { keys: '⌘/', desc: 'Show shortcuts' },
    { keys: 'Esc', desc: 'Close any modal' },
  ];

  // Close mobile sidebar on route change
  useEffect(() => { setMobileSidebar(false); }, [location.pathname]);

  const tabItems = [
    { icon: <Home size={20} />, label: 'Home', path: '/app/command' },
    { icon: <Users size={20} />, label: 'Clients', path: `/app/clients/${clients[0]?.id || ''}` },
    { icon: <MessageSquare size={20} />, label: 'Inbox', path: `/app/clients/${clients[0]?.id || ''}/inbox` },
    { icon: <Bell size={20} />, label: 'Alerts', path: '/app/command' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebar(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 z-50">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Topbar with hamburger */}
        <div className="md:hidden h-14 bg-bg-base border-b border-border-subtle flex items-center px-4">
          <button onClick={() => setMobileSidebar(true)} className="p-2 -ml-2 text-text-secondary">
            <Menu size={20} />
          </button>
          <div className="flex-1 text-center">
            <span className="font-display font-bold text-lg text-text-primary">ZENO</span>
          </div>
          <div className="w-10" />
        </div>

        <Topbar onSearchOpen={() => setSearchOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile Bottom Tab Bar */}
        <nav className="md:hidden h-14 bg-bg-surface border-t border-border-subtle flex items-center justify-around px-2">
          {tabItems.map((tab, i) => (
            <button
              key={i}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                location.pathname.includes(tab.path.split('/')[2] || 'command') ? 'text-accent-primary' : 'text-text-muted'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {shortcutsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
            onClick={() => setShortcutsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-bg-surface border border-border-subtle rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <Command size={18} className="text-accent-primary" />
                  <h3 className="font-display font-semibold text-text-primary">Keyboard Shortcuts</h3>
                </div>
                <button onClick={() => setShortcutsOpen(false)} className="p-1.5 rounded-lg hover:bg-bg-hover text-text-muted"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-3">
                {shortcuts.map((s) => (
                  <div key={s.keys} className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">{s.desc}</span>
                    <kbd className="text-xs font-mono text-text-muted bg-bg-base border border-border-subtle px-2 py-1 rounded">{s.keys}</kbd>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
