import { create } from 'zustand';
import type { ClientWorkspace, TeamMember, ActivityFeedItem } from '../lib/types';
import { mockClients, mockTeam, mockActivityFeed, mockAgency, getAllAgents } from '../lib/mockData';

interface AppState {
  isAuthenticated: boolean;
  currentUser: TeamMember | null;
  setAuth: (user: TeamMember | null) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  agencyName: string;
  activeClientId: string | null;
  setActiveClient: (id: string | null) => void;
  clients: ClientWorkspace[];
  getClient: (id: string) => ClientWorkspace | undefined;
  activityFeed: ActivityFeedItem[];
  sandboxMode: boolean;
  toggleSandbox: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Auth
  isAuthenticated: true, // Auto-authenticated with mock data
  currentUser: mockTeam[0],
  setAuth: (user) => set({ isAuthenticated: !!user, currentUser: user }),

  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  // Agency
  agencyName: mockAgency.name,

  // Active client
  activeClientId: null,
  setActiveClient: (id) => set({ activeClientId: id }),

  // Clients
  clients: mockClients,
  getClient: (id) => get().clients.find((c) => c.id === id),

  // Activity feed
  activityFeed: mockActivityFeed,
  sandboxMode: false,
  toggleSandbox: () => set((s) => ({ sandboxMode: !s.sandboxMode })),
}));
