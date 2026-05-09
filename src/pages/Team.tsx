import { mockTeam } from '../lib/mockData';
import { Plus, MoreHorizontal, Shield, UserCog, User } from 'lucide-react';
import toast from 'react-hot-toast';

export function Team() {
  const roleIcons: Record<string, React.ReactNode> = {
    Owner: <Shield size={14} className="text-accent-primary" />,
    Manager: <UserCog size={14} className="text-accent-warning" />,
    Operator: <User size={14} className="text-accent-secondary" />,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Team Members ({mockTeam.length})</h1>
          <p className="text-text-secondary text-sm mt-1">Manage roles and client assignments.</p>
        </div>
        <button
          onClick={() => toast.success('Invite modal coming soon')}
          className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg text-sm font-medium hover:brightness-110 transition-all active:scale-95">
          <Plus size={16} /> Invite member
        </button>
      </div>

      <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-text-muted text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3">Member</th>
              <th className="text-left px-5 py-3">Role</th>
              <th className="text-left px-5 py-3">Clients Assigned</th>
              <th className="text-left px-5 py-3">Last Active</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {mockTeam.map((member) => (
              <tr key={member.id} className="hover:bg-bg-hover/30 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary/30 to-accent-secondary/30 flex items-center justify-center text-white text-xs font-bold">
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-text-primary font-medium">{member.name}</div>
                      <div className="text-xs text-text-muted">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    {roleIcons[member.role]}
                    <span className="text-text-secondary">{member.role}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-text-secondary">{member.assignedClients.length} clients</span>
                </td>
                <td className="px-5 py-3 text-text-muted text-xs">{new Date(member.lastActive).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => toast('Member actions coming soon')}
                    className="p-1.5 rounded hover:bg-bg-hover text-text-muted">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
