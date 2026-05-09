import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { toggleSidebar, sidebarCollapsed } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName);
      const isMod = e.metaKey || e.ctrlKey;

      // ⌘K / Ctrl+K — already handled in AppShell for search
      if (isMod && e.key === 'k') return; // Handled elsewhere

      // ⌘B / Ctrl+B — toggle sidebar
      if (isMod && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
        return;
      }

      // ⌘N / Ctrl+N — navigate to templates (new agent)
      if (isMod && e.key === 'n' && !isInput) {
        e.preventDefault();
        navigate('/app/templates');
        return;
      }

      // ⌘/ / Ctrl+/ — show shortcuts modal (handled in AppShell)
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, toggleSidebar]);
}
