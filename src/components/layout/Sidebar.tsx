import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import {
  LayoutDashboard, Users, FolderOpen, Copy, UserCog, Plug, Settings,
  ChevronLeft, ChevronRight, Plus, BarChart3, Bot,
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: { label: string; path: string }[];
  count?: number;
}

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar, clients, activeClientId, setActiveClient } = useAppStore();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');
  const isClientView = activeClientId !== null;
  const activeClient = clients.find((c) => c.id === activeClientId);

  const agencyNav: NavItem[] = [
    { label: 'Overview', icon: <LayoutDashboard size={18} />, children: [
      { label: 'Command Center', path: '/app/command' },
      { label: 'Agency Analytics', path: '/app/analytics' },
    ]},
    { label: 'Clients', icon: <Users size={18} />, count: clients.length, children: [
      ...clients.map((c) => ({ label: c.name, path: `/app/clients/${c.id}` })),
    ]},
    { label: 'Templates', icon: <Copy size={18} />, count: 5, children: [
      { label: 'Agent Templates', path: '/app/templates' },
    ]},
    { label: 'Team', icon: <UserCog size={18} />, children: [
      { label: 'Members', path: '/app/team' },
    ]},
    { label: 'Integrations', icon: <Plug size={18} />, children: [
      { label: 'Connected Tools', path: '/app/integrations' },
    ]},
    { label: 'Settings', icon: <Settings size={18} />, children: [
      { label: 'Agency Settings', path: '/app/settings' },
    ]},
  ];

  const clientNav: NavItem[] = activeClient ? [
    { label: 'Overview', icon: <LayoutDashboard size={18} />, path: `/app/clients/${activeClient.id}` },
    { label: 'Agents', icon: <Bot size={18} />, count: 4, path: `/app/clients/${activeClient.id}/agents` },
    { label: 'Workflows', icon: <BarChart3 size={18} />, count: 3, path: `/app/clients/${activeClient.id}/workflows` },
    { label: 'Inbox', icon: <FolderOpen size={18} />, path: `/app/clients/${activeClient.id}/inbox` },
    { label: 'Brain', icon: <FolderOpen size={18} />, path: `/app/clients/${activeClient.id}/brain` },
    { label: 'Analytics', icon: <BarChart3 size={18} />, path: `/app/clients/${activeClient.id}/analytics` },
  ] : [];

  const displayNav = isClientView ? clientNav : agencyNav;

  return (
    <aside
      className={`h-screen sticky top-0 bg-bg-base border-r border-border-subtle flex flex-col transition-all duration-200 ${
        sidebarCollapsed ? 'w-[60px]' : 'w-[240px]'
      }`}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-border-subtle">
        <button onClick={() => { setActiveClient(null); navigate('/app/command'); }} className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gradient-to-br from-accent-primary to-blue-700 rounded-md flex items-center justify-center flex-shrink-0">
            <span className="text-white font-display font-bold text-xs">Z</span>
          </div>
          {!sidebarCollapsed && (
            <span className="font-display font-bold text-lg text-text-primary tracking-tight">ZENO</span>
          )}
        </button>
      </div>

      {/* Client context */}
      {isClientView && activeClient && !sidebarCollapsed && (
        <div className="px-4 py-3 border-b border-border-subtle bg-bg-surface/50">
          <button onClick={() => { setActiveClient(null); navigate('/app/command'); }} className="text-xs text-text-muted hover:text-text-secondary mb-1 flex items-center gap-1">
            ← Back to agency
          </button>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-accent-secondary/20 flex items-center justify-center text-accent-secondary text-[10px] font-bold">
              {activeClient.name.slice(0, 1)}
            </div>
            <span className="text-sm font-medium text-text-primary truncate">{activeClient.name}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {displayNav.map((section, i) => {
          const sectionPath = section.path || section.children?.[0]?.path || '';
          const sectionActive = section.children
            ? section.children.some((c) => isActive(c.path))
            : isActive(sectionPath);

          return (
            <div key={i} className="mb-1">
              {/* Section header */}
              <div
                onClick={() => {
                  if (section.path) {
                    if (section.path.includes('/clients/')) setActiveClient(section.path.split('/')[3]);
                    navigate(section.path);
                  } else if (section.children?.[0] && !sidebarCollapsed) {
                    if (section.children[0].path.includes('/clients/')) setActiveClient(section.children[0].path.split('/')[3]);
                    navigate(section.children[0].path);
                  }
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-100 text-sm ${
                  sectionActive
                    ? 'bg-accent-primary/10 text-accent-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                }`}
              >
                <span className="flex-shrink-0">{section.icon}</span>
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 truncate">{section.label}</span>
                    {section.count !== undefined && (
                      <span className="text-[10px] font-mono bg-bg-elevated px-1.5 py-0.5 rounded">{section.count}</span>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Add Client button */}
      {!isClientView && !sidebarCollapsed && (
        <div className="px-3 pb-3">
          <button
            onClick={() => navigate('/app/clients/new')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border-subtle text-text-muted hover:text-text-secondary hover:border-border-active transition-colors text-sm"
          >
            <Plus size={16} />
            <span>Add client workspace</span>
          </button>
        </div>
      )}

      {/* Collapse toggle */}
      <div className="px-3 py-3 border-t border-border-subtle">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white text-[10px] font-bold">
                JM
              </div>
              <span className="text-sm text-text-secondary truncate">Julie Mercier</span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded hover:bg-bg-hover text-text-muted hover:text-text-secondary transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
