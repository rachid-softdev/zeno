import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { mockInboxThreads } from '../lib/mockData';
import { Mail, MessageCircle, Camera, Briefcase, AlertCircle, CheckCircle2, Clock, Search, Send, Reply, UserPlus, MoreHorizontal } from 'lucide-react';

const channelIcons: Record<string, React.ReactNode> = {
  gmail: <Mail size={14} />,
  whatsapp: <MessageCircle size={14} />,
  instagram: <Camera size={14} />,
  linkedin: <Briefcase size={14} />,
};

interface InboxMessage {
  id: string;
  from: string;
  fromType: 'contact' | 'agent';
  agentName?: string;
  content: string;
  timestamp: string;
}

const mockThreadMessages: InboxMessage[] = [
  { id: 't1', from: 'Thomas Martin', fromType: 'contact', content: "Hi, I'm following up on our conversation at SaaStr. We're looking to automate our deployment workflows and your platform seems like a great fit. Can we schedule a demo this week?", timestamp: '2h ago' },
  { id: 't2', from: 'Max (Lead Qualifier)', fromType: 'agent', agentName: 'Max', content: "Hello Thomas,\n\nThank you for your interest! I've reviewed your company profile — TechScale Inc. with 500+ employees looking to automate deployment workflows.\n\nI'd be happy to schedule a demo. Would Tuesday at 2 PM CET or Thursday at 10 AM CET work for you?\n\nIn the meantime, you can also check our case studies at hexacorp.com/cases.\n\nBest,\nMax — Lead Qualifier @ Hexa Corp", timestamp: '1h ago' },
  { id: 't3', from: 'Thomas Martin', fromType: 'contact', content: "Tuesday at 2 PM works perfectly. Looking forward to it!", timestamp: '45m ago' },
  { id: 't4', from: 'Max (Lead Qualifier)', fromType: 'agent', agentName: 'Max', content: "Excellent! I've booked the meeting. You'll receive a calendar invitation shortly.\n\nHere's what we'll cover:\n1. Your current deployment process\n2. How our workflow automation can reduce deployment time by 60%\n3. Integration with your existing stack (Jenkins, GitHub)\n4. Pricing and onboarding\n\nSee you Tuesday! 🚀", timestamp: '30m ago' },
];

export function Inbox() {
  const { id } = useParams<{ id: string }>();
  const threads = mockInboxThreads.filter((t) => t.clientId === id);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  return (
    <div className="p-6 space-y-6">
      <h1 className="font-display text-2xl font-bold text-text-primary">Inbox</h1>

      <div className="flex gap-0 rounded-xl border border-border-subtle overflow-hidden bg-bg-surface h-[calc(100vh-10rem)]">
        {/* Channel list */}
        <div className="w-48 border-r border-border-subtle p-3 space-y-1 flex-shrink-0 hidden md:block">
          <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-bg-hover text-text-primary text-sm font-medium">
            All (12)
          </button>
          {[{ channel: 'gmail', count: 6 }, { channel: 'whatsapp', count: 2 }, { channel: 'instagram', count: 3 }, { channel: 'linkedin', count: 1 }].map((c) => (
            <button key={c.channel} className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-bg-hover text-text-secondary text-sm transition-colors">
              <div className="flex items-center gap-2 capitalize">{channelIcons[c.channel]} {c.channel}</div>
              <span className="text-xs text-text-muted">{c.count}</span>
            </button>
          ))}
          <div className="border-t border-border-subtle my-2" />
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-bg-hover text-text-secondary text-sm transition-colors">
            <AlertCircle size={14} className="text-accent-warning" /> Needs review
          </button>
        </div>

        {/* Thread list */}
        <div className="w-80 border-r border-border-subtle flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-border-subtle">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input placeholder="Search messages..." className="w-full bg-bg-base border border-border-subtle rounded-lg pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border-subtle">
            {threads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => setSelectedThread(thread.id)}
                className={`p-3 cursor-pointer transition-colors ${selectedThread === thread.id ? 'bg-accent-primary/5 border-l-2 border-l-accent-primary' : 'hover:bg-bg-hover/50'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-bg-elevated flex items-center justify-center text-xs text-text-muted flex-shrink-0">
                    {thread.contactName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-primary font-medium truncate">{thread.contactName}</span>
                      <span className="text-[10px] text-text-muted">{thread.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {channelIcons[thread.channel]}
                      <span className="text-xs text-text-muted truncate flex-1">{thread.lastMessage}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1 ml-8">
                  {thread.agentName && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-primary/10 text-accent-primary">By {thread.agentName}</span>
                  )}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 ${
                    thread.status === 'handled' ? 'bg-accent-secondary/10 text-accent-secondary' :
                    thread.status === 'needs_review' ? 'bg-accent-warning/10 text-accent-warning' :
                    'bg-accent-danger/10 text-accent-danger'
                  }`}>
                    {thread.status === 'handled' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                    {thread.status === 'handled' ? 'Done' : thread.status === 'needs_review' ? 'Review' : 'Escalated'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thread detail */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedThread ? (
            <>
              {/* Thread header */}
              <div className="px-5 py-3 border-b border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-sm text-text-secondary font-medium">
                    TM
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-primary">Thomas Martin</div>
                    <div className="text-xs text-text-muted">thomas@techscale.com · Gmail</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-bg-hover text-text-muted"><UserPlus size={14} /></button>
                  <button className="p-1.5 rounded-lg hover:bg-bg-hover text-text-muted"><MoreHorizontal size={14} /></button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {mockThreadMessages.map((msg, i) => (
                  <div key={msg.id} className={`flex ${msg.fromType === 'agent' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      msg.fromType === 'agent'
                        ? 'bg-bg-elevated border border-border-subtle text-text-primary rounded-bl-md'
                        : 'bg-accent-primary/10 border border-accent-primary/20 text-text-primary rounded-br-md'
                    }`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-medium text-text-secondary">
                          {msg.fromType === 'agent' ? (
                            <span className="text-accent-primary">{msg.from}</span>
                          ) : msg.from}
                        </span>
                        {msg.agentName && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-primary/10 text-accent-primary">AI Agent</span>
                        )}
                      </div>
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                      <div className="text-[10px] text-text-muted mt-1.5">{msg.timestamp}</div>
                      {msg.fromType === 'agent' && (
                        <button className="mt-2 text-[10px] text-accent-warning hover:underline">
                          Override / Edit this message
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply input */}
              <div className="p-4 border-t border-border-subtle">
                <div className="flex items-center gap-2 mb-2">
                  <button className="text-xs px-3 py-1 rounded-full bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 transition-colors">
                    Reply as Agent
                  </button>
                  <button className="text-xs px-3 py-1 rounded-full bg-bg-hover text-text-muted hover:text-text-secondary transition-colors">
                    Take over (human)
                  </button>
                </div>
                <div className="flex items-end gap-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type a response..."
                    rows={2}
                    className="flex-1 bg-bg-base border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary resize-none"
                  />
                  <button className="p-2.5 rounded-xl bg-accent-primary text-white hover:brightness-110 transition-all active:scale-95">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-text-muted">
              <div className="text-center">
                <Mail size={32} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">Select a conversation</p>
                <p className="text-xs mt-1">View messages from the list on the left</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
