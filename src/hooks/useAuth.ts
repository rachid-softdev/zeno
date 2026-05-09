import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Agency } from '../lib/types';
import { mockAgency, mockTeam } from '../lib/mockData';

interface AuthState {
  user: any | null;
  session: any | null;
  agency: Agency | null;
  isLoading: boolean;
  isConfigured: boolean;

  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string, agencyName: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  agency: null,
  isLoading: true,
  isConfigured: isSupabaseConfigured(),

  initialize: async () => {
    if (!isSupabaseConfigured()) {
      // Mock mode — auto-login with Julie
      set({
        user: { email: 'julie@atelierbold.fr', user_metadata: { name: 'Julie Mercier' } },
        session: { access_token: 'mock-token' },
        agency: mockAgency,
        isLoading: false,
      });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      set({
        user: session.user,
        session,
        agency: mockAgency, // TODO: fetch from DB
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }
  },

  signIn: async (email, password) => {
    if (!isSupabaseConfigured()) {
      set({ user: { email }, session: { access_token: 'mock' }, agency: mockAgency });
      return { error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    set({ user: data.user, session: data.session, agency: mockAgency });
    return { error: null };
  },

  signUp: async (email, password, name, agencyName) => {
    if (!isSupabaseConfigured()) {
      set({ user: { email, user_metadata: { name } }, session: { access_token: 'mock' }, agency: mockAgency });
      return { error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, agency_name: agencyName } },
    });
    if (error) return { error: error.message };
    set({ user: data.user, session: data.session, agency: mockAgency });
    return { error: null };
  },

  signInWithGoogle: async () => {
    if (!isSupabaseConfigured()) {
      set({ user: { email: 'demo@atelierbold.fr' }, session: { access_token: 'mock' }, agency: mockAgency });
      return;
    }
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/app/command` } });
  },

  signOut: async () => {
    if (isSupabaseConfigured()) await supabase.auth.signOut();
    set({ user: null, session: null, agency: null });
  },
}));
