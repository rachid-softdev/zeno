import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Lazy-loaded pages for code splitting
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const AuthGuard = lazy(() => import('./components/layout/AuthGuard').then(m => ({ default: m.AuthGuard })));
const AppShell = lazy(() => import('./components/layout/AppShell').then(m => ({ default: m.AppShell })));
const CommandCenter = lazy(() => import('./pages/CommandCenter'));
const ClientWorkspace = lazy(() => import('./pages/ClientWorkspace'));
const ClientAgents = lazy(() => import('./pages/ClientAgents'));
const AgentChat = lazy(() => import('./pages/AgentChat'));
const Workflows = lazy(() => import('./pages/Workflows'));
const WorkflowBuilder = lazy(() => import('./pages/WorkflowBuilder'));
const Inbox = lazy(() => import('./pages/Inbox'));
const Brain = lazy(() => import('./pages/Brain'));
const ClientAnalytics = lazy(() => import('./pages/ClientAnalytics'));
const AgencyAnalytics = lazy(() => import('./pages/AgencyAnalytics'));
const Templates = lazy(() => import('./pages/Templates'));
const TemplateDetail = lazy(() => import('./pages/TemplateDetail'));
const Team = lazy(() => import('./pages/Team'));
const Integrations = lazy(() => import('./pages/Integrations'));
const ClientPortal = lazy(() => import('./pages/ClientPortal'));
const Settings = lazy(() => import('./pages/Settings'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-blue-700 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white font-display font-bold text-lg">Z</span>
        </div>
        <div className="h-2 w-32 mx-auto rounded-full bg-bg-surface overflow-hidden">
          <div className="h-full w-2/3 bg-accent-primary rounded-full animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#161D2E', color: '#F0F4FF', border: '1px solid #1E2A40', borderRadius: '12px', fontSize: '14px' } }} />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/app" element={<AuthGuard><AppShell /></AuthGuard>}>
              <Route index element={<Navigate to="/app/command" replace />} />
              <Route path="command" element={<CommandCenter />} />
              <Route path="analytics" element={<AgencyAnalytics />} />
              <Route path="templates" element={<Templates />} />
              <Route path="templates/:tid" element={<TemplateDetail />} />
              <Route path="team" element={<Team />} />
              <Route path="integrations" element={<Integrations />} />
              <Route path="settings" element={<Settings />} />
              <Route path="clients/:id" element={<ClientWorkspace />} />
              <Route path="clients/:id/agents" element={<ClientAgents />} />
              <Route path="clients/:id/chat/:agentId" element={<AgentChat />} />
              <Route path="clients/:id/workflows" element={<Workflows />} />
              <Route path="clients/:id/workflows/:wid" element={<WorkflowBuilder />} />
              <Route path="clients/:id/inbox" element={<Inbox />} />
              <Route path="clients/:id/brain" element={<Brain />} />
              <Route path="clients/:id/analytics" element={<ClientAnalytics />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Route path="/portal/:id" element={<ClientPortal />} />
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
