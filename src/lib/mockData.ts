import type {
  Agency, TeamMember, ClientWorkspace, AgentTemplate, ClientAgent,
  ActivityFeedItem, Workflow, InboxThread, BrainMemory, BrainDocument,
  ClientBrainData, AnalyticsData, ConversationMessage,
} from './types';

// Mock Agency
export const mockAgency: Agency = {
  id: 'ag_001',
  name: 'Atelier Bold',
  website: 'https://atelierbold.fr',
  description: 'Digital agency based in Paris, specializing in B2B SaaS marketing.',
  primaryService: 'Digital Marketing / SEO',
  plan: 'agency',
  createdAt: '2026-01-15',
  defaultLanguage: 'FR',
  timezone: 'Europe/Paris',
};

// Mock Team
export const mockTeam: TeamMember[] = [
  {
    id: 'tm_001', userId: 'user_001', agencyId: 'ag_001',
    name: 'Julie Mercier', email: 'julie@atelierbold.fr',
    role: 'Owner', assignedClients: [],
    lastActive: '2026-05-09T14:30:00',
  },
  {
    id: 'tm_002', userId: 'user_002', agencyId: 'ag_001',
    name: 'Marco Heinrich', email: 'marco@atelierbold.fr',
    role: 'Manager', assignedClients: ['cl_001', 'cl_002', 'cl_003', 'cl_004'],
    lastActive: '2026-05-09T13:15:00',
  },
  {
    id: 'tm_003', userId: 'user_003', agencyId: 'ag_001',
    name: 'Camille Dubois', email: 'camille@atelierbold.fr',
    role: 'Operator', assignedClients: ['cl_001', 'cl_004'],
    lastActive: '2026-05-09T12:45:00',
  },
];

// Mock Clients
export const mockClients: ClientWorkspace[] = [
  {
    id: 'cl_001', agencyId: 'ag_001',
    name: 'Hexa Corp', industry: 'B2B SaaS',
    website: 'https://hexacorp.com',
    description: 'Enterprise workflow automation platform.',
    toneOfVoice: ['Professional', 'Technical', 'Bold'],
    targetAudience: 'CTOs and operations directors at mid-market tech companies',
    keyMessages: ['Automate without engineers', 'Enterprise-grade security', '10x faster deployment'],
    primaryGoal: 'Generate more organic traffic (SEO)',
    createdAt: '2026-02-01',
  },
  {
    id: 'cl_002', agencyId: 'ag_001',
    name: 'Makers & Co', industry: 'E-commerce Fashion',
    website: 'https://makersandco.com',
    description: 'Sustainable fashion brand for creative professionals.',
    toneOfVoice: ['Friendly', 'Fun', 'Minimalist'],
    targetAudience: 'Creative professionals aged 25-40, sustainability-conscious',
    keyMessages: ['Ethically made', 'Timeless design', 'Wear your values'],
    primaryGoal: 'Grow social media presence',
    createdAt: '2026-02-10',
  },
  {
    id: 'cl_003', agencyId: 'ag_001',
    name: 'Nova Formation', industry: 'Online Training',
    website: 'https://novaformation.fr',
    description: 'Online professional training platform for digital skills.',
    toneOfVoice: ['Professional', 'Empathetic'],
    targetAudience: 'Career changers and professionals upskilling',
    keyMessages: ['Learn at your pace', 'Industry-recognized certifications', 'Taught by practitioners'],
    primaryGoal: 'Qualify more leads',
    createdAt: '2026-03-05',
  },
  {
    id: 'cl_004', agencyId: 'ag_001',
    name: 'Celesty Group', industry: 'Hospitality',
    website: 'https://celestygroup.com',
    description: 'Luxury boutique hotel chain across Europe.',
    toneOfVoice: ['Luxury', 'Warm', 'Professional'],
    targetAudience: 'High-net-worth travelers seeking unique experiences',
    keyMessages: ['Exclusive experiences', 'Personalized service', 'Local authenticity'],
    primaryGoal: 'Improve customer support response time',
    createdAt: '2026-03-20',
  },
];

// Agent Templates
export const mockTemplates: AgentTemplate[] = [
  {
    id: 'tmpl_001', agencyId: 'ag_001', name: 'SEO Content Writer',
    description: 'Writes SEO-optimized articles, meta descriptions, and content briefs.',
    role: 'SEO Writer', capabilities: ['Content generation', 'SEO optimization', 'Keyword research'],
    category: 'content', deploymentCount: 3, lastUpdated: '2026-04-20',
    personality: 'Professional and thorough',
    tools: ['WordPress', 'SEMrush'],
  },
  {
    id: 'tmpl_002', agencyId: 'ag_001', name: 'Social Media Manager',
    description: 'Generates and schedules posts across LinkedIn, Instagram, Facebook.',
    role: 'Social Media Manager', capabilities: ['Post generation', 'Scheduling', 'Platform adaptation'],
    category: 'content', deploymentCount: 4, lastUpdated: '2026-04-18',
    personality: 'Creative and on-brand',
    tools: ['Instagram', 'LinkedIn', 'Facebook'],
  },
  {
    id: 'tmpl_003', agencyId: 'ag_001', name: 'Email Response Agent',
    description: 'Handles inbound emails: classifies, drafts responses, escalates when needed.',
    role: 'Email Agent', capabilities: ['Email classification', 'Response drafting', 'Escalation'],
    category: 'support', deploymentCount: 3, lastUpdated: '2026-04-15',
    personality: 'Professional and helpful',
    tools: ['Gmail', 'Outlook'],
  },
  {
    id: 'tmpl_004', agencyId: 'ag_001', name: 'Performance Reporter',
    description: 'Pulls analytics data, generates weekly reports with insights.',
    role: 'Analytics Reporter', capabilities: ['Data pulling', 'Report generation', 'Insight extraction'],
    category: 'analytics', deploymentCount: 4, lastUpdated: '2026-04-12',
    personality: 'Data-driven and concise',
    tools: ['Google Analytics', 'Meta Ads'],
  },
  {
    id: 'tmpl_005', agencyId: 'ag_001', name: 'Lead Qualifier',
    description: 'Engages new leads, scores them, books discovery calls autonomously.',
    role: 'Lead Qualifier', capabilities: ['Lead scoring', 'Email outreach', 'Calendar booking'],
    category: 'sales', deploymentCount: 2, lastUpdated: '2026-04-10',
    personality: 'Persuasive and efficient',
    tools: ['HubSpot', 'Calendly'],
  },
];

// Client Agents
const agentsData: Record<string, ClientAgent[]> = {
  cl_001: [
    { id: 'agt_001', clientId: 'cl_001', templateId: 'tmpl_001', name: 'Sofia (SEO Writer)', role: 'SEO Content Writer', description: 'Writes and optimizes SEO content for Hexa Corp blog.', capabilities: ['Content generation', 'SEO optimization'], status: 'active', mode: 'review', avatarColor: '#3B82F6', personality: 'Professional and data-driven', connectedTools: ['WordPress', 'SEMrush'], tasksThisWeek: 24, messagesHandled: 156, hoursSaved: 12.5, lastAction: 'Published article: "10 Workflow Automation Trends for 2026"', lastActionTime: '3m ago', assignedTo: 'Camille Dubois' },
    { id: 'agt_002', clientId: 'cl_001', templateId: 'tmpl_005', name: 'Max (Lead Qualifier)', role: 'Lead Qualifier', description: 'Qualifies inbound leads for Hexa Corp sales team.', capabilities: ['Lead scoring', 'Email outreach'], status: 'active', mode: 'autonomous', avatarColor: '#10B981', personality: 'Sharp and efficient', connectedTools: ['HubSpot', 'Calendly', 'LinkedIn'], tasksThisWeek: 18, messagesHandled: 89, hoursSaved: 9.0, lastAction: 'Booked discovery call with Thomas Martin', lastActionTime: '7m ago', assignedTo: 'Marco Heinrich' },
    { id: 'agt_003', clientId: 'cl_001', templateId: 'tmpl_002', name: 'Iris (Social Manager)', role: 'Social Media Manager', description: 'Manages social media presence for Hexa Corp.', capabilities: ['Post generation', 'Scheduling'], status: 'active', mode: 'review', avatarColor: '#8B5CF6', personality: 'Creative and engaging', connectedTools: ['LinkedIn', 'Twitter'], tasksThisWeek: 12, messagesHandled: 45, hoursSaved: 6.0, lastAction: 'Scheduled 3 LinkedIn posts for next week', lastActionTime: '15m ago', assignedTo: 'Camille Dubois' },
    { id: 'agt_004', clientId: 'cl_001', templateId: 'tmpl_003', name: 'Leon (Email Agent)', role: 'Email Response Agent', description: 'Manages Hexa Corp inbound emails.', capabilities: ['Email classification', 'Response drafting'], status: 'idle', mode: 'review', avatarColor: '#F59E0B', personality: 'Professional and responsive', connectedTools: ['Gmail'], tasksThisWeek: 45, messagesHandled: 234, hoursSaved: 18.0, lastAction: 'Filtered 12 emails, drafted 4 responses', lastActionTime: '22m ago', assignedTo: 'Marco Heinrich' },
  ],
  cl_002: [
    { id: 'agt_005', clientId: 'cl_002', templateId: 'tmpl_002', name: 'Mila (Social Manager)', role: 'Social Media Manager', description: 'Creates visual-first social content for Makers & Co.', capabilities: ['Post generation', 'Visual content'], status: 'active', mode: 'review', avatarColor: '#EC4899', personality: 'Playful and visual', connectedTools: ['Instagram', 'Pinterest'], tasksThisWeek: 20, messagesHandled: 67, hoursSaved: 10.0, lastAction: 'Created Instagram carousel: "Behind the seams"', lastActionTime: '1h ago', assignedTo: 'Marco Heinrich' },
    { id: 'agt_006', clientId: 'cl_002', templateId: 'tmpl_001', name: 'Sofia (SEO Writer)', role: 'SEO Content Writer', description: 'Writes fashion and sustainability blog content.', capabilities: ['Content generation', 'SEO optimization'], status: 'active', mode: 'review', avatarColor: '#3B82F6', personality: 'Warm and knowledgeable', connectedTools: ['WordPress'], tasksThisWeek: 8, messagesHandled: 34, hoursSaved: 5.5, lastAction: 'Drafted blog post: "5 Ways to Build a Capsule Wardrobe"', lastActionTime: '3h ago', assignedTo: 'Camille Dubois' },
    { id: 'agt_007', clientId: 'cl_002', templateId: 'tmpl_005', name: 'Max (Lead Qualifier)', role: 'Lead Qualifier', description: 'Qualifies wholesale and collaboration inquiries.', capabilities: ['Lead scoring', 'Email outreach'], status: 'idle', mode: 'review', avatarColor: '#10B981', personality: 'Polished and brand-aware', connectedTools: ['Shopify', 'Gmail'], tasksThisWeek: 5, messagesHandled: 23, hoursSaved: 3.0, lastAction: 'Flagged 2 high-value collaboration inquiries', lastActionTime: '5h ago', assignedTo: 'Marco Heinrich' },
    { id: 'agt_008', clientId: 'cl_002', templateId: 'tmpl_003', name: 'Leon (Email Agent)', role: 'Email Response Agent', description: 'Handles customer service emails for Makers & Co.', capabilities: ['Email classification', 'Response drafting'], status: 'active', mode: 'autonomous', avatarColor: '#F59E0B', personality: 'Friendly and solution-oriented', connectedTools: ['Gmail'], tasksThisWeek: 67, messagesHandled: 312, hoursSaved: 22.0, lastAction: 'Resolved 8 customer inquiries', lastActionTime: '30m ago', assignedTo: 'Camille Dubois' },
    { id: 'agt_009', clientId: 'cl_002', templateId: 'tmpl_004', name: 'Nova (Data Analyst)', role: 'Analytics Reporter', description: 'Tracks e-commerce performance and reports trends.', capabilities: ['Data analysis', 'Report generation'], status: 'active', mode: 'review', avatarColor: '#06B6D4', personality: 'Data-obsessed and precise', connectedTools: ['Google Analytics', 'Shopify'], tasksThisWeek: 3, messagesHandled: 12, hoursSaved: 4.0, lastAction: 'Generated weekly e-commerce performance report', lastActionTime: '4h ago', assignedTo: 'Marco Heinrich' },
  ],
  cl_003: [
    { id: 'agt_010', clientId: 'cl_003', templateId: 'tmpl_005', name: 'Max (Lead Qualifier)', role: 'Lead Qualifier', description: 'Qualifies course enrollment leads.', capabilities: ['Lead scoring', 'Email outreach'], status: 'active', mode: 'autonomous', avatarColor: '#10B981', personality: 'Encouraging and informative', connectedTools: ['HubSpot', 'Calendly'], tasksThisWeek: 32, messagesHandled: 145, hoursSaved: 14.0, lastAction: 'Booked 3 course consultation calls', lastActionTime: '1h ago', assignedTo: 'Marco Heinrich' },
    { id: 'agt_011', clientId: 'cl_003', templateId: 'tmpl_001', name: 'Sofia (SEO Writer)', role: 'SEO Content Writer', description: 'Creates educational SEO content for Nova blog.', capabilities: ['Content generation', 'SEO optimization'], status: 'idle', mode: 'review', avatarColor: '#3B82F6', personality: 'Educational and thorough', connectedTools: ['WordPress'], tasksThisWeek: 6, messagesHandled: 28, hoursSaved: 4.0, lastAction: 'Wrote guide: "Top 10 Digital Skills for 2026"', lastActionTime: '2h ago', assignedTo: 'Camille Dubois' },
    { id: 'agt_012', clientId: 'cl_003', templateId: 'tmpl_003', name: 'Leon (Email Agent)', role: 'Email Response Agent', description: 'Handles student and prospect emails.', capabilities: ['Email classification', 'Response drafting'], status: 'active', mode: 'review', avatarColor: '#F59E0B', personality: 'Supportive and clear', connectedTools: ['Gmail'], tasksThisWeek: 28, messagesHandled: 178, hoursSaved: 11.0, lastAction: 'Responded to 15 student inquiries', lastActionTime: '45m ago', assignedTo: 'Camille Dubois' },
  ],
  cl_004: [
    { id: 'agt_013', clientId: 'cl_004', templateId: 'tmpl_003', name: 'Leon (Email Agent)', role: 'Email Response Agent', description: 'VIP guest concierge email responses.', capabilities: ['Email classification', 'Response drafting'], status: 'active', mode: 'review', avatarColor: '#F59E0B', personality: 'Luxurious and attentive', connectedTools: ['Gmail'], tasksThisWeek: 52, messagesHandled: 267, hoursSaved: 20.0, lastAction: 'Handled 18 guest inquiry emails', lastActionTime: '10m ago', assignedTo: 'Marco Heinrich' },
    { id: 'agt_014', clientId: 'cl_004', templateId: 'tmpl_002', name: 'Mila (Social Manager)', role: 'Social Media Manager', description: 'Creates luxury travel social content.', capabilities: ['Post generation', 'Visual storytelling'], status: 'active', mode: 'review', avatarColor: '#EC4899', personality: 'Elegant and aspirational', connectedTools: ['Instagram'], tasksThisWeek: 14, messagesHandled: 56, hoursSaved: 7.0, lastAction: 'Scheduled 5 Instagram posts for hotel suites', lastActionTime: '2h ago', assignedTo: 'Camille Dubois' },
    { id: 'agt_015', clientId: 'cl_004', templateId: 'tmpl_001', name: 'Sofia (SEO Writer)', role: 'SEO Content Writer', description: 'Creates travel guide content for Celesty blog.', capabilities: ['Content generation', 'SEO optimization'], status: 'idle', mode: 'review', avatarColor: '#3B82F6', personality: 'Evocative and precise', connectedTools: ['WordPress'], tasksThisWeek: 5, messagesHandled: 22, hoursSaved: 3.5, lastAction: 'Drafted "Hidden Gems of Provence" travel guide', lastActionTime: '6h ago', assignedTo: 'Camille Dubois' },
    { id: 'agt_016', clientId: 'cl_004', templateId: 'tmpl_004', name: 'Nova (Data Analyst)', role: 'Analytics Reporter', description: 'Generates occupancy and revenue reports.', capabilities: ['Data analysis', 'Report generation'], status: 'idle', mode: 'review', avatarColor: '#06B6D4', personality: 'Precise and forward-looking', connectedTools: ['Google Analytics', 'Meta Ads'], tasksThisWeek: 2, messagesHandled: 8, hoursSaved: 3.0, lastAction: 'Generated monthly occupancy trend report', lastActionTime: '8h ago', assignedTo: 'Marco Heinrich' },
  ],
};

export const getAllAgents = (): ClientAgent[] => Object.values(agentsData).flat();
export const getClientAgents = (clientId: string): ClientAgent[] => agentsData[clientId] || [];

// Activity Feed
export const mockActivityFeed: ActivityFeedItem[] = [
  { id: 'act_001', clientId: 'cl_001', clientName: 'Hexa Corp', agentName: 'Sofia', agentRole: 'SEO Writer', action: 'Published article: "10 Workflow Automation Trends for 2026"', timestamp: '3m ago', type: 'success', color: '#3B82F6' },
  { id: 'act_002', clientId: 'cl_004', clientName: 'Celesty Group', agentName: 'Max', agentRole: 'Lead Qualifier', action: 'Booked discovery call with Thomas Martin (VIP)', timestamp: '7m ago', type: 'success', color: '#10B981' },
  { id: 'act_003', clientId: 'cl_002', clientName: 'Makers & Co', agentName: 'Mila', agentRole: 'Social Manager', action: '⚠ Instagram post needs your review before publishing', timestamp: '12m ago', type: 'review', color: '#EC4899' },
  { id: 'act_004', clientId: 'cl_001', clientName: 'Hexa Corp', agentName: 'Leon', agentRole: 'Email Agent', action: 'Filtered 12 new emails, drafted 4 responses', timestamp: '22m ago', type: 'success', color: '#F59E0B' },
  { id: 'act_005', clientId: 'cl_003', clientName: 'Nova Formation', agentName: 'Max', agentRole: 'Lead Qualifier', action: 'Booked 3 course consultation calls', timestamp: '1h ago', type: 'success', color: '#10B981' },
  { id: 'act_006', clientId: 'cl_002', clientName: 'Makers & Co', agentName: 'Sofia', agentRole: 'SEO Writer', action: 'Drafted blog post: "5 Ways to Build a Capsule Wardrobe"', timestamp: '3h ago', type: 'success', color: '#3B82F6' },
  { id: 'act_007', clientId: 'cl_004', clientName: 'Celesty Group', agentName: 'Leon', agentRole: 'Email Agent', action: 'Handled 18 guest inquiry emails', timestamp: '4h ago', type: 'success', color: '#F59E0B' },
  { id: 'act_008', clientId: 'cl_003', clientName: 'Nova Formation', agentName: 'Sofia', agentRole: 'SEO Writer', action: 'Wrote guide: "Top 10 Digital Skills for 2026"', timestamp: '5h ago', type: 'success', color: '#3B82F6' },
  { id: 'act_009', clientId: 'cl_003', clientName: 'Nova Formation', agentName: 'System', agentRole: 'Bot', action: 'Gmail connection lost for Email Responder', timestamp: '6h ago', type: 'error', color: '#EF4444' },
  { id: 'act_010', clientId: 'cl_002', clientName: 'Makers & Co', agentName: 'Nova', agentRole: 'Data Analyst', action: 'Generated weekly e-commerce performance report', timestamp: '7h ago', type: 'success', color: '#06B6D4' },
  { id: 'act_011', clientId: 'cl_001', clientName: 'Hexa Corp', agentName: 'Sofia', agentRole: 'SEO Writer', action: '⚠ Content brief for "API Security Best Practices" ready for review', timestamp: '8h ago', type: 'review', color: '#3B82F6' },
];

// Workflows
export const mockWorkflows: Workflow[] = [
  { id: 'wf_001', clientId: 'cl_001', name: 'New Lead → Qualify → Book Call', description: 'Automatically qualifies inbound leads and books discovery calls.', status: 'active', runsCount: 142, lastRun: '2h ago', successRate: 94 },
  { id: 'wf_002', clientId: 'cl_002', name: 'New Order → Thank You + Upsell', description: 'Sends thank you email after purchase and suggests complementary items.', status: 'active', runsCount: 89, lastRun: '30m ago', successRate: 98 },
  { id: 'wf_003', clientId: 'cl_all', name: 'Weekly Report Generation', description: 'Pulls analytics data and generates weekly performance reports for all clients.', status: 'active', runsCount: 32, lastRun: '1d ago', successRate: 100 },
];

// Inbox
export const mockInboxThreads: InboxThread[] = [
  { id: 'inb_001', clientId: 'cl_001', channel: 'gmail', contactName: 'Thomas Martin', agentName: 'Leon', lastMessage: 'Re: Demo request for Q3 implementation', timestamp: '15m ago', status: 'handled', unread: 0 },
  { id: 'inb_002', clientId: 'cl_002', channel: 'instagram', contactName: 'Sophie Laurent', agentName: 'Mila', lastMessage: 'Love the new collection! When is the restock?', timestamp: '45m ago', status: 'needs_review', unread: 1 },
  { id: 'inb_003', clientId: 'cl_001', channel: 'gmail', contactName: 'Jean Dubois', agentName: 'Max', lastMessage: 'Following up on our conversation at SaaStr...', timestamp: '1h ago', status: 'needs_review', unread: 2 },
  { id: 'inb_004', clientId: 'cl_004', channel: 'whatsapp', contactName: 'Maria Santos', lastMessage: 'Hi, I need to modify my reservation for next week', timestamp: '2h ago', status: 'handled', unread: 0 },
  { id: 'inb_005', clientId: 'cl_003', channel: 'linkedin', contactName: 'Pierre Moreau', agentName: 'Max', lastMessage: 'Interested in your data science certification program', timestamp: '3h ago', status: 'handled', unread: 0 },
  { id: 'inb_006', clientId: 'cl_001', channel: 'gmail', contactName: 'support@hexacorp.com', agentName: 'Leon', lastMessage: 'Password reset request for admin account', timestamp: '4h ago', status: 'escalated', unread: 1 },
];

// Brain
export const mockBrains: Record<string, ClientBrainData> = {
  cl_001: {
    brandDNA: {
      overview: 'Hexa Corp is a B2B SaaS company providing enterprise workflow automation.',
      valueProposition: 'Automate complex workflows without engineering resources.',
      yearFounded: '2020',
      targetAudience: { primary: 'CTOs', secondary: 'Ops Directors', painPoints: 'Manual processes, slow deployment', goals: '10x faster automation' },
      personality: { formal: 80, playful: 20, corporate: 70 },
      keyMessages: ['Automate without engineers', 'Enterprise security', '10x faster'],
      avoidList: ['cheap', 'hack', 'workaround'],
      keywords: ['workflow automation', 'no-code', 'enterprise'],
      writingExamples: 'Professional tone, data-backed claims, clear ROI statements.',
    },
    documents: [
      { id: 'doc_001', clientId: 'cl_001', filename: 'Hexa_Corp_Brand_Guidelines_2026.pdf', size: '2.4 MB', uploadedAt: '2026-03-10', status: 'active' },
      { id: 'doc_002', clientId: 'cl_001', filename: 'Q4_2025_Campaign_Results.pdf', size: '1.8 MB', uploadedAt: '2026-03-15', status: 'active' },
      { id: 'doc_003', clientId: 'cl_001', filename: 'Product_Launch_Playbook.docx', size: '856 KB', uploadedAt: '2026-04-01', status: 'active' },
    ],
    memories: [
      { id: 'mem_001', clientId: 'cl_001', fact: 'Primary contact is Thomas Martin (thomas@hexacorp.com) — prefers WhatsApp for quick comms', learnedBy: 'Max (Lead Qualifier)', learnedAt: '3 days ago', source: 'Email conversation', confirmed: true },
      { id: 'mem_002', clientId: 'cl_001', fact: 'Blog posts should be minimum 1,500 words with data citations', learnedBy: 'Sofia (SEO Writer)', learnedAt: '1 week ago', source: 'Content brief', confirmed: true },
      { id: 'mem_003', clientId: 'cl_001', fact: 'Quarterly board meeting on the 15th — always need a performance report 3 days before', learnedBy: 'Nova (Data Analyst)', learnedAt: '2 weeks ago', source: 'Calendar invite', confirmed: true },
    ],
    rules: [
      { id: 'rul_001', clientId: 'cl_001', description: 'Always use formal language, never slang or emojis in external emails', enabled: true },
      { id: 'rul_002', clientId: 'cl_001', description: 'Require human approval before publishing any blog post', enabled: true },
      { id: 'rul_003', clientId: 'cl_001', description: 'Do not contact leads on weekends', enabled: true },
    ],
  },
  cl_002: {
    brandDNA: {
      overview: 'Makers & Co is a sustainable fashion brand.',
      valueProposition: 'Ethically made, timeless design for creative professionals.',
      yearFounded: '2018',
      targetAudience: { primary: 'Creative professionals 25-40', secondary: 'Sustainability advocates', painPoints: 'Fast fashion guilt, lack of quality basics', goals: 'Build a conscious wardrobe' },
      personality: { formal: 20, playful: 70, corporate: 10 },
      keyMessages: ['Ethically made', 'Timeless design', 'Wear your values'],
      avoidList: ['trendy', 'disposable', 'fast'],
      keywords: ['sustainable fashion', 'capsule wardrobe', 'ethical clothing'],
      writingExamples: 'Warm, conversational, community-focused.',
    },
    documents: [
      { id: 'doc_004', clientId: 'cl_002', filename: 'Makers_Brand_Book.pdf', size: '3.1 MB', uploadedAt: '2026-03-05', status: 'active' },
      { id: 'doc_005', clientId: 'cl_002', filename: 'SS26_Lookbook.pdf', size: '5.2 MB', uploadedAt: '2026-04-10', status: 'active' },
    ],
    memories: [
      { id: 'mem_004', clientId: 'cl_002', fact: 'Customers love behind-the-scenes content — engagement 3x higher than product posts', learnedBy: 'Mila (Social Manager)', learnedAt: '5 days ago', source: 'Instagram analytics', confirmed: true },
      { id: 'mem_005', clientId: 'cl_002', fact: 'Never use the word "cheap" — always use "accessible" or "investment piece"', learnedBy: 'Mila (Social Manager)', learnedAt: '1 week ago', source: 'Brand guidelines', confirmed: true },
    ],
    rules: [
      { id: 'rul_004', clientId: 'cl_002', description: 'Instagram posts always need approval before publishing', enabled: true },
      { id: 'rul_005', clientId: 'cl_002', description: 'All product descriptions must mention sustainability angle', enabled: true },
    ],
  },
};

// Generated Analytics
function generateAnalytics(clientId: string, clientName: string): AnalyticsData {
  const seed = clientId.charCodeAt(clientId.length - 1);
  const base = (seed % 5) + 1;
  return {
    tasksCompleted: 140 + base * 30,
    messagesHandled: 600 + base * 120,
    hoursSaved: 70 + base * 15,
    avgResponseTime: `${(1 + base * 0.3).toFixed(1)}s`,
    leadsQualified: base * 7 + 3,
    contentPublished: base * 3 + 2,
    trend: 12 + base,
    agentActivity: [
      { agentName: 'Sofia', color: '#3B82F6', data: Array.from({ length: 7 }, (_, i) => ({ day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], tasks: 8 + i * 2 + seed % 5 })) },
      { agentName: 'Max', color: '#10B981', data: Array.from({ length: 7 }, (_, i) => ({ day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], tasks: 4 + i + seed % 3 })) },
      { agentName: 'Leon', color: '#F59E0B', data: Array.from({ length: 7 }, (_, i) => ({ day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], tasks: 12 + i * 3 + seed % 6 })) },
    ],
    channelBreakdown: [
      { name: 'Email', value: 45 + seed * 3, color: '#F59E0B' },
      { name: 'WhatsApp', value: 20 + seed, color: '#10B981' },
      { name: 'Social', value: 25 + seed * 2, color: '#EC4899' },
      { name: 'Internal', value: 10 + seed, color: '#8B5CF6' },
    ],
    timeByCategory: [
      { category: 'Content Creation', hours: 25 + base * 2 },
      { category: 'Email Management', hours: 18 + base },
      { category: 'Lead Qualification', hours: 12 + base },
      { category: 'Reporting', hours: 8 + base },
      { category: 'Social Media', hours: 10 + base },
    ],
  };
}

export const mockClientAnalytics: Record<string, AnalyticsData> = {
  cl_001: generateAnalytics('cl_001', 'Hexa Corp'),
  cl_002: generateAnalytics('cl_002', 'Makers & Co'),
  cl_003: generateAnalytics('cl_003', 'Nova Formation'),
  cl_004: generateAnalytics('cl_004', 'Celesty Group'),
};

export const mockAgencyAnalytics: AnalyticsData = {
  tasksCompleted: 942,
  messagesHandled: 4512,
  hoursSaved: 240,
  avgResponseTime: '1.8s',
  leadsQualified: 28,
  contentPublished: 18,
  trend: 14,
  agentActivity: [],
  channelBreakdown: [
    { name: 'Email', value: 48, color: '#F59E0B' },
    { name: 'WhatsApp', value: 22, color: '#10B981' },
    { name: 'Social', value: 20, color: '#EC4899' },
    { name: 'Internal', value: 10, color: '#8B5CF6' },
  ],
  timeByCategory: [
    { category: 'Content Creation', hours: 120 },
    { category: 'Email Management', hours: 80 },
    { category: 'Lead Qualification', hours: 55 },
    { category: 'Reporting', hours: 35 },
    { category: 'Social Media', hours: 45 },
  ],
};

// Conversation Messages
export const mockConversations: Record<string, ConversationMessage[]> = {
  'agt_001': [
    { id: 'msg_001', agentId: 'agt_001', role: 'user', content: 'I need a blog post about API security best practices for B2B SaaS companies. Target keywords: API security, OAuth 2.0, zero trust.', timestamp: '10m ago' },
    { id: 'msg_002', agentId: 'agt_001', role: 'tool', content: '🔍 Analyzing top-ranking articles for "API security best practices"...', timestamp: '10m ago', toolUse: 'SEMrush keyword research' },
    { id: 'msg_003', agentId: 'agt_001', role: 'agent', content: "Here's a draft outline for the article:\n\n# API Security Best Practices for B2B SaaS in 2026\n\n## 1. Zero Trust Architecture\n- Why perimeter security is dead\n- Implementing micro-segmentation\n- Continuous verification principles\n\n## 2. OAuth 2.0 Implementation Guide\n- Authorization Code Flow with PKCE\n- Token management best practices\n- Common misconfigurations to avoid\n\n## 3. API Gateway Security\n- Rate limiting strategies\n- Input validation at the edge\n- WAF configuration for APIs\n\n## 4. Monitoring & Incident Response\n- Real-time threat detection\n- Audit logging requirements\n- Incident response playbook\n\nShall I proceed writing the full article with this structure? Estimated: 1,800 words, 5 data citations.", timestamp: '8m ago' },
    { id: 'msg_004', agentId: 'agt_001', role: 'user', content: 'Great structure! Add a section on API key management too. Go ahead and write it.', timestamp: '5m ago' },
    { id: 'msg_005', agentId: 'agt_001', role: 'agent', content: "Perfect, I'll add a comprehensive section on API key management. Writing the full article now...\n\n---\n\n# API Security Best Practices for B2B SaaS in 2026\n\n*Published on behalf of Hexa Corp*\n\n## Introduction\n\nAPIs are the backbone of modern B2B SaaS platforms, handling over 83% of all internet traffic. Yet, they remain one of the most exploited attack vectors. For CTOs and engineering leaders, securing APIs isn't just a technical requirement—it's a business imperative.\n\n## 1. Zero Trust Architecture\n\nThe traditional perimeter-based security model is obsolete. In a zero trust architecture, every request is treated as potentially malicious, regardless of its origin...\n\n[Full 1,800-word article generated]\n\n**Sources:** OWASP API Security Top 10 (2025), Gartner API Security Report (2026), Cloudflare DDoS Threat Report\n\nDone—here's the result. Would you like me to publish this to WordPress or schedule it for review first?", timestamp: '2m ago' },
  ],
  'agt_002': [
    { id: 'msg_006', agentId: 'agt_002', role: 'system', content: 'New lead detected: Thomas Martin from Hexa Corp, Source: Inbound demo request' },
    { id: 'msg_007', agentId: 'agt_002', role: 'agent', content: "I've analyzed Thomas Martin's profile:\n\n**Lead Score:** 8/10\n- Company: TechScale Inc. (500+ employees)\n- Role: VP of Engineering\n- Use case: Looking to automate internal deployment workflows\n- Budget: Confirmed (enterprise tier)\n\n**Recommendation:** High priority. I'll draft a personalized outreach email and suggest we book a discovery call this week.\n\nWould you like me to proceed?", timestamp: '1h ago' },
    { id: 'msg_008', agentId: 'agt_002', role: 'user', content: 'Yes, reach out. Mention our SOC 2 compliance and the new workflow builder feature.', timestamp: '1h ago' },
    { id: 'msg_009', agentId: 'agt_002', role: 'agent', content: "Done! I've sent the outreach email highlighting SOC 2 compliance and the visual workflow builder.\n\n**Status:** Email sent ✓\n**Next:** Calendly link included for booking. I'll follow up in 3 days if no response.\n\nShall I add Thomas to the CRM pipeline?", timestamp: '55m ago' },
  ],
};
