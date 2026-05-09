// Seed script — populates database with demo data
// Run with: npx tsx src/db/seed.ts

import { supabase } from '../lib/supabase.js';

const agencyId = '00000000-0000-0000-0000-000000000001';
const userId = '00000000-0000-0000-0000-000000000010';

const workspaceIds = {
  hexa: '10000000-0000-0000-0000-000000000001',
  makers: '10000000-0000-0000-0000-000000000002',
  nova: '10000000-0000-0000-0000-000000000003',
  celesty: '10000000-0000-0000-0000-000000000004',
};

const templateIds = {
  seo: '20000000-0000-0000-0000-000000000001',
  social: '20000000-0000-0000-0000-000000000002',
  email: '20000000-0000-0000-0000-000000000003',
  reporter: '20000000-0000-0000-0000-000000000004',
  lead: '20000000-0000-0000-0000-000000000005',
};

async function seed() {
  console.log('🌱 Seeding Zeno database...\n');

  // ── Agency ──
  console.log('Creating agency: Atelier Bold');
  await supabase.from('agencies').upsert({
    id: agencyId,
    name: 'Atelier Bold',
    website: 'https://atelierbold.fr',
    description: 'Digital agency based in Paris, specializing in B2B SaaS marketing.',
    primary_service: 'Digital Marketing / SEO',
    plan: 'agency',
    default_language: 'FR',
    timezone: 'Europe/Paris',
  });

  // ── Profiles ──
  console.log('Creating team members');
  const profiles = [
    { id: '30000000-0000-0000-0000-000000000001', user_id: userId, agency_id: agencyId, name: 'Julie Mercier', email: 'julie@atelierbold.fr', role: 'owner' },
    { id: '30000000-0000-0000-0000-000000000002', user_id: '00000000-0000-0000-0000-000000000011', agency_id: agencyId, name: 'Marco Heinrich', email: 'marco@atelierbold.fr', role: 'manager', assigned_clients: Object.values(workspaceIds) },
    { id: '30000000-0000-0000-0000-000000000003', user_id: '00000000-0000-0000-0000-000000000012', agency_id: agencyId, name: 'Camille Dubois', email: 'camille@atelierbold.fr', role: 'operator', assigned_clients: [workspaceIds.hexa, workspaceIds.celesty] },
  ];
  await supabase.from('profiles').upsert(profiles);

  // ── Workspaces ──
  console.log('Creating 4 client workspaces');
  await supabase.from('client_workspaces').upsert([
    { id: workspaceIds.hexa, agency_id: agencyId, name: 'Hexa Corp', industry: 'B2B SaaS', website: 'https://hexacorp.com', description: 'Enterprise workflow automation platform.', tone_of_voice: ['Professional', 'Technical', 'Bold'], target_audience: 'CTOs and ops directors', key_messages: ['Automate without engineers', 'Enterprise security', '10x faster'], primary_goal: 'Generate more organic traffic (SEO)' },
    { id: workspaceIds.makers, agency_id: agencyId, name: 'Makers & Co', industry: 'E-commerce Fashion', website: 'https://makersandco.com', description: 'Sustainable fashion brand.', tone_of_voice: ['Friendly', 'Fun'], target_audience: 'Creative professionals 25-40', key_messages: ['Ethically made', 'Timeless design'], primary_goal: 'Grow social media presence' },
    { id: workspaceIds.nova, agency_id: agencyId, name: 'Nova Formation', industry: 'Online Training', website: 'https://novaformation.fr', description: 'Online professional training.', tone_of_voice: ['Professional', 'Empathetic'], target_audience: 'Career changers', key_messages: ['Learn at your pace', 'Industry-recognized'], primary_goal: 'Qualify more leads' },
    { id: workspaceIds.celesty, agency_id: agencyId, name: 'Celesty Group', industry: 'Hospitality', website: 'https://celestygroup.com', description: 'Luxury boutique hotel chain.', tone_of_voice: ['Luxury', 'Warm'], target_audience: 'High-net-worth travelers', key_messages: ['Exclusive experiences', 'Personalized service'], primary_goal: 'Improve customer support response time' },
  ]);

  // ── Templates ──
  console.log('Creating 5 agent templates');
  await supabase.from('agent_templates').upsert([
    { id: templateIds.seo, agency_id: agencyId, name: 'SEO Content Writer', description: 'Writes SEO-optimized articles and content briefs.', role: 'SEO Writer', capabilities: ['Content generation', 'SEO optimization', 'Keyword research'], category: 'content', personality: 'Professional and thorough', tools: ['WordPress', 'SEMrush'], deployment_count: 4, is_default: true },
    { id: templateIds.social, agency_id: agencyId, name: 'Social Media Manager', description: 'Generates and schedules social media posts.', role: 'Social Media Manager', capabilities: ['Post generation', 'Scheduling'], category: 'content', personality: 'Creative and on-brand', tools: ['Instagram', 'LinkedIn'], deployment_count: 4, is_default: true },
    { id: templateIds.email, agency_id: agencyId, name: 'Email Response Agent', description: 'Handles inbound emails 24/7.', role: 'Email Agent', capabilities: ['Email classification', 'Response drafting'], category: 'support', personality: 'Professional and helpful', tools: ['Gmail'], deployment_count: 4, is_default: true },
    { id: templateIds.reporter, agency_id: agencyId, name: 'Performance Reporter', description: 'Generates weekly analytics reports.', role: 'Analytics Reporter', capabilities: ['Data analysis', 'Report generation'], category: 'analytics', personality: 'Data-driven and concise', tools: ['Google Analytics', 'Meta Ads'], deployment_count: 2, is_default: true },
    { id: templateIds.lead, agency_id: agencyId, name: 'Lead Qualifier', description: 'Qualifies leads and books discovery calls.', role: 'Lead Qualifier', capabilities: ['Lead scoring', 'Email outreach', 'Calendar booking'], category: 'sales', personality: 'Persuasive and efficient', tools: ['HubSpot', 'Calendly'], deployment_count: 3, is_default: true },
  ]);

  // ── Agents ──
  console.log('Creating 16 client agents');
  const agents = [
    // Hexa Corp
    { id: '40000000-0000-0000-0000-000000000001', workspace_id: workspaceIds.hexa, template_id: templateIds.seo, name: 'Sofia (SEO Writer)', role: 'SEO Content Writer', capabilities: ['Content generation', 'SEO optimization'], status: 'active', mode: 'review', avatar_color: '#3B82F6', personality: 'Professional and data-driven', connected_tools: ['WordPress', 'SEMrush'], assigned_to: profiles[2].id },
    { id: '40000000-0000-0000-0000-000000000002', workspace_id: workspaceIds.hexa, template_id: templateIds.lead, name: 'Max (Lead Qualifier)', role: 'Lead Qualifier', capabilities: ['Lead scoring', 'Email outreach'], status: 'active', mode: 'autonomous', avatar_color: '#10B981', personality: 'Sharp and efficient', connected_tools: ['HubSpot', 'Calendly'], assigned_to: profiles[1].id },
    { id: '40000000-0000-0000-0000-000000000003', workspace_id: workspaceIds.hexa, template_id: templateIds.social, name: 'Iris (Social Manager)', role: 'Social Media Manager', capabilities: ['Post generation', 'Scheduling'], status: 'active', mode: 'review', avatar_color: '#8B5CF6', personality: 'Creative and engaging', connected_tools: ['LinkedIn', 'Twitter'], assigned_to: profiles[2].id },
    { id: '40000000-0000-0000-0000-000000000004', workspace_id: workspaceIds.hexa, template_id: templateIds.email, name: 'Leon (Email Agent)', role: 'Email Response Agent', capabilities: ['Email classification', 'Response drafting'], status: 'active', mode: 'review', avatar_color: '#F59E0B', personality: 'Professional and responsive', connected_tools: ['Gmail'], assigned_to: profiles[1].id },
    // Makers & Co
    { id: '40000000-0000-0000-0000-000000000005', workspace_id: workspaceIds.makers, template_id: templateIds.social, name: 'Mila (Social Manager)', role: 'Social Media Manager', capabilities: ['Post generation', 'Visual content'], status: 'active', mode: 'review', avatar_color: '#EC4899', personality: 'Playful and visual', connected_tools: ['Instagram'], assigned_to: profiles[1].id },
    { id: '40000000-0000-0000-0000-000000000006', workspace_id: workspaceIds.makers, template_id: templateIds.seo, name: 'Sofia (SEO Writer)', role: 'SEO Content Writer', capabilities: ['Content generation', 'SEO optimization'], status: 'active', mode: 'review', avatar_color: '#3B82F6', personality: 'Warm and knowledgeable', connected_tools: ['WordPress'], assigned_to: profiles[2].id },
    { id: '40000000-0000-0000-0000-000000000007', workspace_id: workspaceIds.makers, template_id: templateIds.lead, name: 'Max (Lead Qualifier)', role: 'Lead Qualifier', capabilities: ['Lead scoring', 'Email outreach'], status: 'idle', mode: 'review', avatar_color: '#10B981', personality: 'Polished and brand-aware', connected_tools: ['Shopify', 'Gmail'], assigned_to: profiles[1].id },
    { id: '40000000-0000-0000-0000-000000000008', workspace_id: workspaceIds.makers, template_id: templateIds.email, name: 'Leon (Email Agent)', role: 'Email Response Agent', capabilities: ['Email classification', 'Response drafting'], status: 'active', mode: 'autonomous', avatar_color: '#F59E0B', personality: 'Friendly and solution-oriented', connected_tools: ['Gmail'], assigned_to: profiles[2].id },
    { id: '40000000-0000-0000-0000-000000000009', workspace_id: workspaceIds.makers, template_id: templateIds.reporter, name: 'Nova (Data Analyst)', role: 'Analytics Reporter', capabilities: ['Data analysis', 'Report generation'], status: 'active', mode: 'review', avatar_color: '#06B6D4', personality: 'Data-obsessed and precise', connected_tools: ['Google Analytics', 'Shopify'], assigned_to: profiles[1].id },
    // Nova Formation
    { id: '40000000-0000-0000-0000-000000000010', workspace_id: workspaceIds.nova, template_id: templateIds.lead, name: 'Max (Lead Qualifier)', role: 'Lead Qualifier', capabilities: ['Lead scoring', 'Email outreach'], status: 'active', mode: 'autonomous', avatar_color: '#10B981', personality: 'Encouraging and informative', connected_tools: ['HubSpot', 'Calendly'], assigned_to: profiles[1].id },
    { id: '40000000-0000-0000-0000-000000000011', workspace_id: workspaceIds.nova, template_id: templateIds.seo, name: 'Sofia (SEO Writer)', role: 'SEO Content Writer', capabilities: ['Content generation', 'SEO optimization'], status: 'idle', mode: 'review', avatar_color: '#3B82F6', personality: 'Educational and thorough', connected_tools: ['WordPress'], assigned_to: profiles[2].id },
    { id: '40000000-0000-0000-0000-000000000012', workspace_id: workspaceIds.nova, template_id: templateIds.email, name: 'Leon (Email Agent)', role: 'Email Response Agent', capabilities: ['Email classification', 'Response drafting'], status: 'active', mode: 'review', avatar_color: '#F59E0B', personality: 'Supportive and clear', connected_tools: ['Gmail'], assigned_to: profiles[2].id },
    // Celesty Group
    { id: '40000000-0000-0000-0000-000000000013', workspace_id: workspaceIds.celesty, template_id: templateIds.email, name: 'Leon (Email Agent)', role: 'Email Response Agent', capabilities: ['Email classification', 'Response drafting'], status: 'active', mode: 'review', avatar_color: '#F59E0B', personality: 'Luxurious and attentive', connected_tools: ['Gmail'], assigned_to: profiles[1].id },
    { id: '40000000-0000-0000-0000-000000000014', workspace_id: workspaceIds.celesty, template_id: templateIds.social, name: 'Mila (Social Manager)', role: 'Social Media Manager', capabilities: ['Post generation', 'Visual storytelling'], status: 'active', mode: 'review', avatar_color: '#EC4899', personality: 'Elegant and aspirational', connected_tools: ['Instagram'], assigned_to: profiles[2].id },
    { id: '40000000-0000-0000-0000-000000000015', workspace_id: workspaceIds.celesty, template_id: templateIds.seo, name: 'Sofia (SEO Writer)', role: 'SEO Content Writer', capabilities: ['Content generation', 'SEO optimization'], status: 'idle', mode: 'review', avatar_color: '#3B82F6', personality: 'Evocative and precise', connected_tools: ['WordPress'], assigned_to: profiles[2].id },
    { id: '40000000-0000-0000-0000-000000000016', workspace_id: workspaceIds.celesty, template_id: templateIds.reporter, name: 'Nova (Data Analyst)', role: 'Analytics Reporter', capabilities: ['Data analysis', 'Report generation'], status: 'idle', mode: 'review', avatar_color: '#06B6D4', personality: 'Precise and forward-looking', connected_tools: ['Google Analytics', 'Meta Ads'], assigned_to: profiles[1].id },
  ];
  await supabase.from('client_agents').upsert(agents);

  // ── Workflows ──
  console.log('Creating 3 workflows');
  await supabase.from('workflows').upsert([
    {
      id: '50000000-0000-0000-0000-000000000001', workspace_id: workspaceIds.hexa, name: 'New Lead → Qualify → Book Call',
      description: 'Automatically qualifies inbound leads and books discovery calls.',
      status: 'active', runs_count: 142, success_rate: 94,
      definition: {
        nodes: [
          { id: 'trigger-1', type: 'trigger', position: { x: 300, y: 30 }, data: { label: 'New Lead in HubSpot' } },
          { id: 'agent-1', type: 'agent', position: { x: 300, y: 160 }, data: { label: 'Max (Lead Qualifier)', agentId: agents[1].id, task: 'Score and qualify' } },
          { id: 'condition-1', type: 'condition', position: { x: 300, y: 300 }, data: { label: 'Score > 7?' } },
          { id: 'action-1', type: 'action', position: { x: 480, y: 460 }, data: { label: 'Send Intro Email' } },
          { id: 'action-2', type: 'action', position: { x: 300, y: 600 }, data: { label: 'Book Calendly + Notify Slack' } },
        ],
        edges: [
          { id: 'e1', source: 'trigger-1', target: 'agent-1' },
          { id: 'e2', source: 'agent-1', target: 'condition-1' },
          { id: 'e3', source: 'condition-1', target: 'action-1', sourceHandle: 'yes', label: 'YES' },
          { id: 'e4', source: 'action-1', target: 'action-2' },
        ],
      },
    },
    {
      id: '50000000-0000-0000-0000-000000000002', workspace_id: workspaceIds.makers, name: 'New Order → Thank You + Upsell',
      description: 'Sends thank you email and suggests complementary items.', status: 'active', runs_count: 89, success_rate: 98,
      definition: { nodes: [], edges: [] },
    },
    {
      id: '50000000-0000-0000-0000-000000000003', workspace_id: workspaceIds.celesty, name: 'Weekly Report Generation',
      description: 'Pulls analytics and generates weekly performance reports for all clients.', status: 'active', runs_count: 32, success_rate: 100,
      definition: { nodes: [], edges: [] },
    },
  ]);

  // ── Brain (sample for Hexa Corp) ──
  console.log('Creating brain data');
  await supabase.from('brain_memories').upsert([
    { workspace_id: workspaceIds.hexa, fact: 'Primary contact is Thomas Martin — prefers WhatsApp for quick comms', learned_by: 'Max (Lead Qualifier)', source: 'Email conversation', confirmed: true },
    { workspace_id: workspaceIds.hexa, fact: 'Blog posts should be minimum 1,500 words with data citations', learned_by: 'Sofia (SEO Writer)', source: 'Content brief', confirmed: true },
    { workspace_id: workspaceIds.hexa, fact: 'Quarterly board meeting on the 15th — always need a performance report 3 days before', learned_by: 'Nova (Data Analyst)', source: 'Calendar invite', confirmed: true },
    { workspace_id: workspaceIds.makers, fact: 'Customers love behind-the-scenes content — engagement 3x higher than product posts', learned_by: 'Mila (Social Manager)', source: 'Instagram analytics', confirmed: true },
  ]);
  await supabase.from('brain_rules').upsert([
    { workspace_id: workspaceIds.hexa, description: 'Always use formal language, never slang or emojis in external emails', enabled: true },
    { workspace_id: workspaceIds.hexa, description: 'Require human approval before publishing any blog post', enabled: true },
    { workspace_id: workspaceIds.hexa, description: 'Do not contact leads on weekends', enabled: true },
    { workspace_id: workspaceIds.makers, description: 'Instagram posts always need approval before publishing', enabled: true },
  ]);

  console.log('\n✅ Seed complete!');
  console.log('  - 1 agency (Atelier Bold)');
  console.log('  - 3 team members');
  console.log('  - 4 client workspaces');
  console.log('  - 5 agent templates');
  console.log('  - 16 agent instances');
  console.log('  - 3 workflows');
  console.log('  - Brain data for 2 clients');
}

seed().catch(console.error);
