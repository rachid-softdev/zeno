import { useCallback, useState, useRef, DragEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  BackgroundVariant,
} from '@xyflow/react';
import type { Connection, Node, Edge, NodeProps as RFNodeProps } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getClientAgents, mockClients } from '../lib/mockData';
import {
  ArrowLeft, Play, Pause, Save, Plus, Zap, GitBranch,
  Mail, Bell, Clock, Globe, UserPlus, ShoppingCart, FileText,
  MessageSquare, X, Settings, AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Custom Node Types
function TriggerNode({ data }: RFNodeProps) {
  return (
    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl px-4 py-3 min-w-[180px] backdrop-blur-sm">
      <Handle type="source" position={Position.Bottom} className="!bg-orange-500" />
      <div className="flex items-center gap-2 text-orange-400 text-xs font-medium mb-1">
        {data.icon} <span>TRIGGER</span>
      </div>
      <div className="text-sm text-text-primary font-medium">{data.label}</div>
      {data.detail && <div className="text-xs text-text-muted mt-0.5">{data.detail}</div>}
    </div>
  );
}

function AgentNode({ data }: RFNodeProps) {
  return (
    <div className="bg-accent-primary/10 border border-accent-primary/30 rounded-xl px-4 py-3 min-w-[180px] backdrop-blur-sm">
      <Handle type="target" position={Position.Top} className="!bg-accent-primary" />
      <Handle type="source" position={Position.Bottom} className="!bg-accent-primary" />
      <div className="flex items-center gap-2 text-accent-primary text-xs font-medium mb-1">
        <Zap size={12} /> <span>AGENT</span>
      </div>
      <div className="text-sm text-text-primary font-medium">{data.label}</div>
      {data.task && <div className="text-xs text-text-muted mt-0.5">Task: {data.task}</div>}
    </div>
  );
}

function ConditionNode({ data }: RFNodeProps) {
  return (
    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-3 min-w-[160px] backdrop-blur-sm rotate-1">
      <Handle type="target" position={Position.Top} className="!bg-purple-500" />
      <Handle type="source" position={Position.Bottom} className="!bg-purple-500" id="yes" />
      <Handle type="source" position={Position.Right} className="!bg-purple-500" id="no" />
      <div className="flex items-center gap-2 text-purple-400 text-xs font-medium mb-1">
        <GitBranch size={12} /> <span>CONDITION</span>
      </div>
      <div className="text-sm text-text-primary font-medium">{data.label}</div>
    </div>
  );
}

function ActionNode({ data }: RFNodeProps) {
  return (
    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 min-w-[180px] backdrop-blur-sm">
      <Handle type="target" position={Position.Top} className="!bg-emerald-500" />
      <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium mb-1">
        {data.icon || <Play size={12} />} <span>ACTION</span>
      </div>
      <div className="text-sm text-text-primary font-medium">{data.label}</div>
    </div>
  );
}

function DelayNode({ data }: RFNodeProps) {
  return (
    <div className="bg-gray-500/10 border border-gray-500/30 rounded-xl px-4 py-3 min-w-[160px] backdrop-blur-sm">
      <Handle type="target" position={Position.Top} className="!bg-gray-500" />
      <Handle type="source" position={Position.Bottom} className="!bg-gray-500" />
      <div className="flex items-center gap-2 text-gray-400 text-xs font-medium mb-1">
        <Clock size={12} /> <span>DELAY</span>
      </div>
      <div className="text-sm text-text-primary font-medium">{data.label}</div>
    </div>
  );
}

const nodeTypes = {
  trigger: TriggerNode,
  agent: AgentNode,
  condition: ConditionNode,
  action: ActionNode,
  delay: DelayNode,
};

// Palette items
const paletteItems = [
  {
    section: 'TRIGGERS',
    items: [
      { type: 'trigger', icon: <Mail size={14} />, label: 'Email received', defaultLabel: 'New Email' },
      { type: 'trigger', icon: <MessageSquare size={14} />, label: 'New social mention', defaultLabel: 'Social Mention' },
      { type: 'trigger', icon: <Clock size={14} />, label: 'Schedule (cron)', defaultLabel: 'Scheduled' },
      { type: 'trigger', icon: <Globe size={14} />, label: 'Webhook', defaultLabel: 'Webhook' },
      { type: 'trigger', icon: <UserPlus size={14} />, label: 'New lead in CRM', defaultLabel: 'New Lead' },
      { type: 'trigger', icon: <ShoppingCart size={14} />, label: 'New order', defaultLabel: 'New Order' },
      { type: 'trigger', icon: <FileText size={14} />, label: 'Form submitted', defaultLabel: 'Form Submit' },
    ],
  },
  {
    section: 'CONDITIONS',
    items: [
      { type: 'condition', icon: <GitBranch size={14} />, label: 'If/Else branch', defaultLabel: 'If/Else' },
      { type: 'condition', icon: <GitBranch size={14} />, label: 'Switch (multi-branch)', defaultLabel: 'Switch' },
      { type: 'condition', icon: <Clock size={14} />, label: 'Wait until', defaultLabel: 'Wait Until' },
      { type: 'condition', icon: <AlertCircle size={14} />, label: 'Approval gate', defaultLabel: 'Approval' },
    ],
  },
  {
    section: 'ACTIONS',
    items: [
      { type: 'action', icon: <Mail size={14} />, label: 'Send email', defaultLabel: 'Send Email' },
      { type: 'action', icon: <MessageSquare size={14} />, label: 'Post to social', defaultLabel: 'Post Social' },
      { type: 'action', icon: <FileText size={14} />, label: 'Update CRM record', defaultLabel: 'Update CRM' },
      { type: 'action', icon: <FileText size={14} />, label: 'Create Notion/Asana task', defaultLabel: 'Create Task' },
      { type: 'action', icon: <Bell size={14} />, label: 'Send Slack notification', defaultLabel: 'Notify Slack' },
      { type: 'action', icon: <Globe size={14} />, label: 'Call webhook', defaultLabel: 'Call Webhook' },
    ],
  },
  {
    section: 'DELAYS',
    items: [
      { type: 'delay', icon: <Clock size={14} />, label: 'Wait X hours/days', defaultLabel: 'Wait 1h' },
    ],
  },
];

export function WorkflowBuilder() {
  const { id, wid } = useParams<{ id: string; wid: string }>();
  const navigate = useNavigate();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const client = mockClients.find((c) => c.id === id);
  const agents = getClientAgents(id!);

  const initialNodes: Node[] = [
    {
      id: 'trigger-1',
      type: 'trigger',
      position: { x: 300, y: 30 },
      data: { icon: <UserPlus size={14} />, label: 'New Lead in HubSpot', detail: 'Filter: source = inbound' },
    },
    {
      id: 'agent-1',
      type: 'agent',
      position: { x: 300, y: 160 },
      data: { label: 'Max (Lead Qualifier)', task: 'Score and qualify the lead' },
    },
    {
      id: 'condition-1',
      type: 'condition',
      position: { x: 300, y: 300 },
      data: { label: 'Score > 7?' },
    },
    {
      id: 'agent-2',
      type: 'agent',
      position: { x: 80, y: 460 },
      data: { label: 'Iris (Social Manager)', task: 'Send nurture sequence' },
    },
    {
      id: 'delay-1',
      type: 'delay',
      position: { x: 80, y: 590 },
      data: { label: 'Wait 7 days' },
    },
    {
      id: 'action-1',
      type: 'action',
      position: { x: 480, y: 460 },
      data: { icon: <Mail size={14} />, label: 'Send Intro Email', detail: 'From: Iris' },
    },
    {
      id: 'action-2',
      type: 'action',
      position: { x: 480, y: 590 },
      data: { icon: <Globe size={14} />, label: 'Book Calendly Slot' },
    },
    {
      id: 'action-3',
      type: 'action',
      position: { x: 300, y: 720 },
      data: { icon: <Bell size={14} />, label: 'Notify Team on Slack' },
    },
  ];

  const initialEdges: Edge[] = [
    { id: 'e-t1-a1', source: 'trigger-1', target: 'agent-1', animated: true, className: '!stroke-text-muted' },
    { id: 'e-a1-c1', source: 'agent-1', target: 'condition-1', animated: true, className: '!stroke-text-muted' },
    { id: 'e-c1-a2', source: 'condition-1', target: 'agent-2', sourceHandle: 'no', label: 'NO', className: '!stroke-text-muted', animated: true },
    { id: 'e-c1-ac1', source: 'condition-1', target: 'action-1', sourceHandle: 'yes', label: 'YES', className: '!stroke-emerald-500', animated: true },
    { id: 'e-a2-d1', source: 'agent-2', target: 'delay-1', animated: true, className: '!stroke-text-muted' },
    { id: 'e-d1-a1-loop', source: 'delay-1', target: 'agent-1', animated: true, className: '!stroke-text-muted', style: { strokeDasharray: '5 5' } },
    { id: 'e-ac1-ac2', source: 'action-1', target: 'action-2', animated: true, className: '!stroke-text-muted' },
    { id: 'e-ac2-ac3', source: 'action-2', target: 'action-3', animated: true, className: '!stroke-text-muted' },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [workflowName, setWorkflowName] = useState('New Lead → Qualify → Book Call');
  const [status, setStatus] = useState<'draft' | 'active' | 'paused'>('active');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, className: '!stroke-text-muted' }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow-type');
      const label = event.dataTransfer.getData('application/reactflow-label');
      const icon = event.dataTransfer.getData('application/reactflow-icon');
      if (!type || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label, icon, detail: type === 'agent' ? 'Select agent...' : '' },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node);
  }, []);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Left palette */}
      <div className="w-52 border-r border-border-subtle bg-bg-surface/50 overflow-y-auto p-3 space-y-4 flex-shrink-0">
        <button onClick={() => navigate(`/app/clients/${id}/workflows`)} className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary mb-2">
          <ArrowLeft size={14} /> Back to workflows
        </button>

        {paletteItems.map((section) => (
          <div key={section.section}>
            <h4 className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-2">{section.section}</h4>
            <div className="space-y-1">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-base border border-border-subtle cursor-grab hover:border-border-active hover:bg-bg-hover transition-colors text-xs text-text-secondary"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/reactflow-type', item.type);
                    e.dataTransfer.setData('application/reactflow-label', item.defaultLabel);
                    e.dataTransfer.setData('application/reactflow-icon', '');
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Agents section */}
        <div>
          <h4 className="text-[10px] font-medium text-accent-primary uppercase tracking-wider mb-2">AGENTS</h4>
          <div className="space-y-1">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-base border border-border-subtle cursor-grab hover:border-accent-primary/30 transition-colors text-xs text-text-secondary"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/reactflow-type', 'agent');
                  e.dataTransfer.setData('application/reactflow-label', agent.name);
                  e.dataTransfer.setData('application/reactflow-icon', '');
                  e.dataTransfer.effectAllowed = 'move';
                }}
              >
                <div className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold text-white" style={{ backgroundColor: agent.avatarColor }}>
                  {agent.name.slice(0, 2)}
                </div>
                <span className="truncate">{agent.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-12 border-b border-border-subtle bg-bg-surface/50 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="bg-transparent text-sm font-medium text-text-primary focus:outline-none border-b border-transparent hover:border-border-subtle focus:border-accent-primary px-1"
            />
            <span className={`flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border ${
              status === 'active' ? 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20' :
              status === 'paused' ? 'bg-accent-warning/10 text-accent-warning border-accent-warning/20' :
              'bg-bg-hover text-text-muted border-border-subtle'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-accent-secondary animate-pulse' : 'bg-current'}`} />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            <span className="text-xs text-text-muted">Ran 42 times · Last: 2h ago · Success: 94%</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.success('Workflow test started (simulated)')}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border-subtle rounded-lg text-xs text-text-secondary hover:border-border-active transition-colors">
              <Play size={14} /> Test
            </button>
            <button
              onClick={() => toast.success('Workflow saved')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-primary text-white rounded-lg text-xs font-medium hover:brightness-110 transition-all">
              <Save size={14} /> Save
            </button>
          </div>
        </div>

        {/* Flow */}
        <div ref={reactFlowWrapper} className="flex-1" style={{ background: '#080B10' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            defaultEdgeOptions={{ animated: true }}
            proOptions={{ hideAttribution: true }}
          >
            <Controls className="!bg-bg-surface !border-border-subtle !rounded-lg !overflow-hidden" />
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1E2A40" />
            <MiniMap
              nodeStrokeColor="#1E2A40"
              nodeColor={(n) => {
                if (n.type === 'trigger') return '#F59E0B';
                if (n.type === 'agent') return '#3B82F6';
                if (n.type === 'condition') return '#8B5CF6';
                if (n.type === 'action') return '#10B981';
                return '#4A5878';
              }}
              maskColor="rgba(8, 11, 16, 0.7)"
              className="!bg-bg-surface !border-border-subtle !rounded-lg"
            />
          </ReactFlow>
        </div>
      </div>

      {/* Right config panel */}
      {selectedNode && (
        <div className="w-64 border-l border-border-subtle bg-bg-surface/50 overflow-y-auto p-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-text-primary">Node Config</h4>
            <button onClick={() => setSelectedNode(null)} className="p-1 rounded hover:bg-bg-hover text-text-muted">
              <X size={14} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-text-muted block mb-1">Label</label>
              <input
                value={selectedNode.data.label || ''}
                onChange={(e) => {
                  setNodes((nds) => nds.map((n) => n.id === selectedNode.id ? { ...n, data: { ...n.data, label: e.target.value } } : n));
                  setSelectedNode((prev) => prev ? { ...prev, data: { ...prev.data, label: e.target.value } } : null);
                }}
                className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>

            {selectedNode.type === 'agent' && (
              <div>
                <label className="text-xs text-text-muted block mb-1">Task description</label>
                <textarea
                  value={selectedNode.data.task || ''}
                  onChange={(e) => {
                    setNodes((nds) => nds.map((n) => n.id === selectedNode.id ? { ...n, data: { ...n.data, task: e.target.value } } : n));
                    setSelectedNode((prev) => prev ? { ...prev, data: { ...prev.data, task: e.target.value } } : null);
                  }}
                  rows={3}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-primary resize-none"
                  placeholder="What should this agent do?"
                />
              </div>
            )}

            {selectedNode.type === 'condition' && (
              <div>
                <label className="text-xs text-text-muted block mb-1">Condition</label>
                <input
                  placeholder="e.g., {lead_score} > 7"
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-primary"
                />
              </div>
            )}

            {selectedNode.type === 'delay' && (
              <div>
                <label className="text-xs text-text-muted block mb-1">Duration</label>
                <div className="flex gap-2">
                  <input placeholder="1" type="number" className="w-16 bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-primary" />
                  <select className="flex-1 bg-bg-base border border-border-subtle rounded-lg px-2 py-2 text-xs text-text-primary">
                    <option>hours</option>
                    <option>days</option>
                    <option>weeks</option>
                  </select>
                </div>
              </div>
            )}

            {selectedNode.type === 'trigger' && (
              <div>
                <label className="text-xs text-text-muted block mb-1">Filter (optional)</label>
                <textarea
                  placeholder="e.g., subject contains 'demo'"
                  rows={2}
                  value={selectedNode.data.detail || ''}
                  onChange={(e) => {
                    setNodes((nds) => nds.map((n) => n.id === selectedNode.id ? { ...n, data: { ...n.data, detail: e.target.value } } : n));
                    setSelectedNode((prev) => prev ? { ...prev, data: { ...prev.data, detail: e.target.value } } : null);
                  }}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-primary resize-none"
                />
              </div>
            )}

            <button
              onClick={() => {
                setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
                setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
                setSelectedNode(null);
              }}
              className="w-full py-2 border border-accent-danger/30 text-accent-danger rounded-lg text-xs hover:bg-accent-danger/10 transition-colors"
            >
              Remove node
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
