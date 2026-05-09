import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, CheckCircle, Star, ChevronRight, Menu, X, ChevronDown, Calculator, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MeshGradient } from '../components/ui/MeshGradient';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export function Landing() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [showCalc, setShowCalc] = useState(false);
  const [calcEmployees, setCalcEmployees] = useState(10);
  const [calcRate, setCalcRate] = useState(25);
  const [calcHours, setCalcHours] = useState(40);

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-bg-base/80 backdrop-blur-xl border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-primary to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">Z</span>
            </div>
            <span className="font-display font-bold text-xl text-text-primary">ZENO</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
            <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
            <a href="#clients" className="hover:text-text-primary transition-colors">Clients</a>
            <a href="#pricing" className="hover:text-text-primary transition-colors">Pricing</a>
            <a href="#" className="hover:text-text-primary transition-colors">Docs</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors">Sign in</Link>
            <Link to="/signup" className="px-4 py-2 bg-accent-primary hover:brightness-110 text-white text-sm font-medium rounded-lg transition-all active:scale-95">
              Start free trial
            </Link>
          </div>

          <button className="md:hidden p-2 text-text-secondary" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenu && (
          <div className="md:hidden bg-bg-base border-b border-border-subtle px-6 py-4 space-y-3">
            <a href="#features" className="block text-text-secondary hover:text-text-primary">Features</a>
            <a href="#clients" className="block text-text-secondary hover:text-text-primary">Clients</a>
            <a href="#pricing" className="block text-text-secondary hover:text-text-primary">Pricing</a>
            <Link to="/login" className="block text-text-secondary hover:text-text-primary">Sign in</Link>
            <Link to="/signup" className="block w-full text-center px-4 py-2 bg-accent-primary text-white rounded-lg">Start free trial</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
        <MeshGradient />

        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-secondary/10 border border-accent-secondary/20 text-accent-secondary text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
              #1 AI platform for agencies — Used by 800+ agencies
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-tight text-text-primary mb-6">
            Scale your agency.<br />
            <span className="text-text-secondary">Not your headcount.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg text-text-secondary max-w-xl mx-auto mb-8">
            Zeno lets your team build reusable AI agents, deploy them across every client workspace,
            and manage everything from one command center. Stop hiring for repetitive work.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link to="/signup" className="px-8 py-3.5 bg-accent-primary hover:brightness-110 text-white font-medium rounded-xl transition-all active:scale-95 text-lg">
              Start free — 14 days
            </Link>
            <a href="#" className="flex items-center gap-2 px-6 py-3.5 text-text-secondary hover:text-text-primary transition-colors">
              <Play size={18} /> See it in 90 seconds
            </a>
          </motion.div>

          <motion.p variants={fadeUp} className="text-xs text-text-muted">
            No credit card required · Cancel anytime · GDPR compliant
          </motion.p>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section id="features" className="py-24 px-6 bg-bg-surface/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Your agency is held back by the same 4 bottlenecks.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '⏱️', title: 'Repetitive delivery', desc: 'Same tasks. Different client. Every. Single. Week.' },
              { icon: '🧠', title: 'Knowledge loss', desc: 'When a team member leaves, their client knowledge walks out too.' },
              { icon: '💸', title: 'Hiring pressure', desc: 'Junior hires cost €35k/year. They are overwhelmed in 3 months.' },
              { icon: '📉', title: 'Margin erosion', desc: 'More clients = more costs. Scaling breaks the model.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-bg-surface border border-border-subtle rounded-xl p-6 hover:border-border-active transition-colors"
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-display font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-4"
          >
            One platform. Every client. Zero extra hires.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg max-w-2xl mx-auto"
          >
            Zeno gives each of your clients their own AI team — trained on their brand, running their tasks — managed by you from a single dashboard.
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '📊', title: 'Multi-client architecture', desc: 'Every client gets an isolated workspace. Their data, their agents, their automations. You control all of them from one place.' },
            { icon: '🔄', title: 'Reusable agent templates', desc: 'Build a "SEO Writer" agent once with your agency\'s methodology. Deploy it to 20 clients in 30 seconds.' },
            { icon: '🎛️', title: 'Real-time command center', desc: 'See every client\'s agent activity, pending tasks, and performance metrics in a single live view.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-bg-surface border border-border-subtle rounded-xl p-6 hover:border-border-active hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center text-xl mb-4">{item.icon}</div>
              <h3 className="font-display font-semibold text-text-primary mb-2">{item.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 bg-bg-surface/30">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl font-bold text-text-primary text-center mb-4"
          >
            Set it up in 3 steps. Then let it run.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg text-center max-w-xl mx-auto mb-16"
          >
            From zero to automated client delivery in under 10 minutes.
          </motion.p>

          {/* Horizontal timeline */}
          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-accent-primary/40 via-accent-primary to-accent-primary/40" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '01', title: 'Build your agent library',
                  desc: 'Create your agency\'s standard agents: SEO Writer, Social Media Manager, Email Responder. Configure their capabilities once.',
                  visual: '📚',
                },
                {
                  step: '02', title: 'Add a client workspace',
                  desc: 'Create a workspace for each client. Upload their brand guidelines, connect their tools. Takes 5 minutes.',
                  visual: '🏢',
                },
                {
                  step: '03', title: 'Deploy agents, define workflows',
                  desc: 'Select which agents the client needs. Customize each instance. Build automations. Activate. Your team gets notified only when needed.',
                  visual: '⚡',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-xl z-10 relative">
                    {item.visual}
                  </div>
                  <div className="text-xs font-mono text-accent-primary mb-2">Step {item.step}</div>
                  <h3 className="font-display font-semibold text-text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Agent Showcase — Horizontal scroll */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-12">10 battle-tested agent templates. Ready to deploy.</h2>

          <div className="relative">
            {/* Scroll buttons */}
            <button
              onClick={() => {
                const el = document.getElementById('showcase-scroll');
                if (el) el.scrollBy({ left: -320, behavior: 'smooth' });
              }}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-bg-surface border border-border-subtle items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-active transition-colors shadow-lg"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('showcase-scroll');
                if (el) el.scrollBy({ left: 320, behavior: 'smooth' });
              }}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-bg-surface border border-border-subtle items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-active transition-colors shadow-lg"
            >
              <ChevronRight size={20} />
            </button>

            {/* Gradient fades */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-bg-base to-transparent z-[5] pointer-events-none md:hidden" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-r from-transparent to-bg-base z-[5] pointer-events-none md:hidden" />

            {/* Scrollable container */}
            <div id="showcase-scroll" className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-6 px-6">
              {[
                { icon: '✍️', name: 'SEO Content Writer', desc: 'SEO-optimized articles, meta descriptions, and content briefs for any industry.', tags: ['Content', 'SEO'] },
                { icon: '📱', name: 'Social Media Manager', desc: 'Generates and schedules posts across LinkedIn, Instagram, Facebook. Adapts format per platform.', tags: ['Social', 'Content'] },
                { icon: '📧', name: 'Email Response Agent', desc: 'Handles inbound emails: classifies, drafts responses, escalates when needed. Works 24/7.', tags: ['Support', 'Email'] },
                { icon: '📊', name: 'Performance Reporter', desc: 'Pulls data from analytics platforms, generates weekly reports with insights.', tags: ['Analytics', 'Reporting'] },
                { icon: '🎯', name: 'Lead Qualifier', desc: 'Engages new leads via email, scores them, books discovery calls autonomously.', tags: ['Sales', 'CRM'] },
                { icon: '💬', name: 'Community Manager', desc: 'Monitors brand mentions, responds to comments, flags urgent issues for human review.', tags: ['Social', 'Support'] },
                { icon: '🛒', name: 'E-commerce Assistant', desc: 'Product descriptions, inventory alerts, abandoned cart follow-ups.', tags: ['E-commerce', 'Shopify'] },
                { icon: '📋', name: 'Brief Writer', desc: 'Transforms a 2-line request into a full creative brief with audience, objectives, KPIs.', tags: ['Strategy', 'Internal'] },
                { icon: '🔍', name: 'Competitor Monitor', desc: 'Tracks competitor content, ads, and positioning. Weekly digest with opportunities.', tags: ['Strategy', 'Research'] },
                { icon: '📞', name: 'Meeting Summarizer', desc: 'Joins calls via transcript, extracts action items, updates PM tools.', tags: ['Operations', 'Notion'] },
              ].map((agent, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="flex-shrink-0 w-[280px] snap-start bg-bg-surface border border-border-subtle rounded-xl p-5 hover:border-border-active transition-colors"
                >
                  <div className="text-2xl mb-2">{agent.icon}</div>
                  <h4 className="font-display font-semibold text-text-primary mb-1">{agent.name}</h4>
                  <p className="text-sm text-text-secondary mb-3 line-clamp-2">{agent.desc}</p>
                  <div className="flex gap-1.5">
                    {agent.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-bg-hover text-text-muted">{tag}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-4">Transparent pricing. No per-seat surprises.</h2>
          <p className="text-text-secondary text-center mb-12">All plans include 14-day free trial. No credit card required.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Starter', price: '€79', desc: 'For agencies with up to 5 clients', features: ['5 client workspaces', '20 agent instances', '500 AI tasks/month', '3 team seats', 'Email + Slack'], highlighted: false },
              { name: 'Agency', price: '€199', desc: 'For growing agencies', features: ['20 client workspaces', 'Unlimited agents', '3,000 AI tasks/month', '10 team seats', 'All integrations', 'Workflow builder', 'Priority support'], highlighted: true },
              { name: 'Scale', price: '€499', desc: 'For large agencies', features: ['Unlimited workspaces', 'Unlimited everything', 'White-label', 'Custom agent training', 'Dedicated account manager', 'SLA 99.9%', 'API access'], highlighted: false },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-6 border ${
                  plan.highlighted
                    ? 'bg-bg-surface border-accent-primary/50 ring-1 ring-accent-primary/20'
                    : 'bg-bg-surface border-border-subtle'
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent-primary text-white text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display font-semibold text-lg text-text-primary mb-1">{plan.name}</h3>
                <div className="mb-1">
                  <span className="font-display text-4xl font-bold text-text-primary">{plan.price}</span>
                  <span className="text-text-muted">/month</span>
                </div>
                <p className="text-sm text-text-secondary mb-4">{plan.desc}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                      <CheckCircle size={14} className="text-accent-secondary flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`block text-center py-2.5 rounded-lg font-medium text-sm transition-all active:scale-95 ${
                    plan.highlighted
                      ? 'bg-accent-primary text-white hover:brightness-110'
                      : 'border border-border-subtle text-text-primary hover:border-border-active'
                  }`}
                >
                  {plan.name === 'Scale' ? 'Talk to sales' : 'Start free trial'}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="clients" className="py-24 px-6 bg-bg-surface/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-12">Trusted by agencies scaling smarter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Julie Mercier', role: 'Co-founder @ Atelier Bold, Paris', quote: 'We onboarded 6 new clients last quarter without a single new hire. Zeno\'s template system meant our SEO writer agent was configured for each client in under 10 minutes.', stats: '+6 clients · 0 hires · 40h/wk saved' },
              { name: 'Marcus Hein', role: 'Ops Director @ Hive Creative, Amsterdam', quote: 'The multi-workspace architecture is what sold us. Each client feels like they have a dedicated team, but we\'re managing everything centrally. Our margin per client went up 28%.', stats: '+28% margin · 15 clients · €0 extra salaries' },
              { name: 'Sofia Andrade', role: 'Founder @ Spark Digital, Lisbon', quote: 'I was skeptical about AI agents. But when the lead qualifier started booking discovery calls while I was asleep, I understood. This isn\'t a tool. It\'s infrastructure.', stats: '3x leads · Solo agency · €120k ARR' },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-bg-surface border border-border-subtle rounded-xl p-6"
              >
                <div className="flex items-center gap-1 text-accent-warning mb-3">
                  {[...Array(5)].map((_, i) => (<Star key={i} size={14} fill="currentColor" />))}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div>
                  <div className="font-medium text-text-primary text-sm">{t.name}</div>
                  <div className="text-xs text-text-muted mb-2">{t.role}</div>
                  <div className="text-[11px] font-mono text-accent-secondary">{t.stats}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-4">Works with the tools your clients already use.</h2>
          <p className="text-text-secondary text-center mb-12 max-w-xl mx-auto">Zeno connects to 2,000+ tools. Here are the most popular ones.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[
              { cat: 'CRM', tools: ['HubSpot', 'Salesforce', 'Pipedrive', 'GoHighLevel'] },
              { cat: 'Email', tools: ['Gmail', 'Outlook', 'Mailchimp', 'Brevo'] },
              { cat: 'Social', tools: ['LinkedIn', 'Instagram', 'Facebook', 'TikTok'] },
              { cat: 'E-commerce', tools: ['Shopify', 'WooCommerce', 'PrestaShop'] },
              { cat: 'Analytics', tools: ['Google Analytics 4', 'Meta Ads', 'Google Ads', 'SEMrush'] },
              { cat: 'Project Mgmt', tools: ['Notion', 'Asana', 'ClickUp', 'Monday'] },
              { cat: 'Messaging', tools: ['Slack', 'WhatsApp', 'Discord', 'Telegram'] },
              { cat: 'Files & Docs', tools: ['Google Drive', 'Dropbox', 'Airtable'] },
            ].map((group, i) => (
              <motion.div
                key={group.cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-bg-surface border border-border-subtle rounded-xl p-4 hover:border-border-active transition-colors"
              >
                <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">{group.cat}</h4>
                <div className="space-y-2">
                  {group.tools.map((tool) => (
                    <div key={tool} className="flex items-center gap-2 text-sm text-text-secondary">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-primary/40" />
                      {tool}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-sm text-text-muted mt-8">+ 2,000 more via Zapier / Make</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-bg-surface/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-12">Questions we get a lot.</h2>
          <div className="space-y-3">
            {[
              { q: 'Can my clients see their own workspace?', a: 'Yes! With the Agency plan, you can give each client read-only access to their workspace so they can see agent activity, completed tasks, and analytics without being able to modify anything. The Scale plan includes a fully white-labeled client portal.' },
              { q: 'What happens when I hit my task limit?', a: 'Your agents will stop processing new tasks until the next billing cycle or until you upgrade your plan. We\'ll send you notifications when you reach 80% and 95% of your limit so you\'re never caught off guard. You can also purchase overage packs at €10 per 1,000 tasks.' },
              { q: 'How is client data isolated between workspaces?', a: 'Every client workspace is fully isolated at the database level with Row-Level Security (RLS). Agents in one workspace cannot access data from another. This is the same architecture used by enterprise SaaS products — your clients\' data never mixes.' },
              { q: 'Can I build agents from scratch or only from templates?', a: 'Both! You can start from one of our 10 battle-tested templates (fastest) or build a fully custom agent from scratch by defining its name, role, capabilities, personality, connected tools, and training data. Custom agents can also be saved as new templates for reuse.' },
              { q: 'What integrations are included on the Starter plan?', a: 'The Starter plan includes Email (Gmail/Outlook) and Slack integrations. Agency plan unlocks all 2,000+ integrations including HubSpot, Notion, Shopify, GA4, Meta Ads, and more. Scale plan adds API access for custom integrations.' },
              { q: 'Is there a limit on team seats?', a: 'Starter includes 3 team seats, Agency includes 10, and Scale has unlimited seats. You can always invite additional team members, but only the allocated number can be active simultaneously on Starter and Agency plans.' },
              { q: 'How does the white-label option work on Scale?', a: 'Scale plan users can replace the Zeno branding with their own: custom domain (app.youragency.com), your logo in the UI, your primary brand color, a dedicated client portal subdomain, and custom email sender name. Your clients will see your brand, not Zeno.' },
              { q: 'Can agents communicate with each other inside a workflow?', a: 'Absolutely. This is one of Zeno\'s most powerful features. You can chain agents in a workflow — for example, the Lead Qualifier scores a lead, passes it to the Email Agent who sends a personalized intro, which triggers the CRM Agent to update HubSpot. All coordinated automatically.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-bg-hover/30 transition-colors"
                >
                  <span className="text-sm font-medium text-text-primary pr-4">{item.q}</span>
                  <motion.div animate={{ rotate: faqOpen === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-text-muted flex-shrink-0">
                    <ChevronDown size={18} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {faqOpen === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-r from-accent-primary/10 via-bg-base to-accent-primary/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-4">Your competitors are already using AI.</h2>
          <p className="text-text-secondary text-lg mb-4 max-w-2xl mx-auto">
            The agencies winning right now aren't the ones working harder. They're the ones who automated first.
          </p>
          <button onClick={() => setShowCalc(true)} className="text-accent-primary text-sm hover:underline mb-6 inline-flex items-center gap-1">
            <Calculator size={14} /> Calculate your agency's ROI →
          </button>
          <div>
            <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent-primary hover:brightness-110 text-white font-medium rounded-xl transition-all active:scale-95 text-lg">
              Build your first agent team <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ROI Calculator Modal */}
      <AnimatePresence>
        {showCalc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
            onClick={() => setShowCalc(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-bg-surface border border-border-subtle rounded-2xl w-full max-w-md shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <DollarSign size={22} className="text-accent-secondary" /> ROI Calculator
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Team size</label>
                  <input type="number" value={calcEmployees} onChange={(e) => setCalcEmployees(Number(e.target.value))} className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary" />
                </div>
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Average hourly rate (€)</label>
                  <input type="number" value={calcRate} onChange={(e) => setCalcRate(Number(e.target.value))} className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary" />
                </div>
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Estimated hours saved per week</label>
                  <input type="number" value={calcHours} onChange={(e) => setCalcHours(Number(e.target.value))} className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary" />
                </div>
                <div className="bg-accent-secondary/10 border border-accent-secondary/20 rounded-xl p-5 text-center">
                  <div className="text-xs text-accent-secondary uppercase tracking-wider mb-1">Estimated Annual Savings</div>
                  <div className="font-display text-4xl font-bold text-accent-secondary">
                    €{(calcHours * calcRate * 52).toLocaleString()}
                  </div>
                  <div className="text-xs text-text-muted mt-1">at €{calcRate}/h × {calcHours}h/wk × 52 weeks</div>
                </div>
                <Link to="/signup" className="block w-full py-2.5 bg-accent-primary text-white text-center rounded-lg font-medium text-sm hover:brightness-110 transition-all">
                  Start saving → 14-day free trial
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-accent-primary to-blue-700 rounded flex items-center justify-center">
              <span className="text-white font-display font-bold text-[10px]">Z</span>
            </div>
            <span>© 2026 Zeno Technologies — Made for agencies, by ex-agency people</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-text-secondary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-secondary transition-colors">Terms</a>
            <a href="#" className="hover:text-text-secondary transition-colors">Status</a>
            <a href="#" className="hover:text-text-secondary transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
