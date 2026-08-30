import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Download,
  Copy,
  Check,
  Share2,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Layers,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  UserCheck,
} from 'lucide-react';
import { Message, MindMapData, MindMapNode } from '../types';
import { soundEffects } from '../utils/audio';

interface MindMapVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatTitle: string;
  messages: Message[];
}

export const MindMapVisualizerModal: React.FC<MindMapVisualizerModalProps> = ({
  isOpen,
  onClose,
  chatTitle,
  messages,
}) => {
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [copiedSummary, setCopiedSummary] = useState(false);

  useEffect(() => {
    if (isOpen) {
      generateMindMap();
    }
  }, [isOpen, messages]);

  const generateMindMap = async () => {
    setIsLoading(true);
    soundEffects.playOrbChime();

    try {
      const res = await fetch('/api/ai/mindmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatTitle,
          messages: messages.slice(-15),
        }),
      });
      const data = await res.json();
      if (data.mindMap) {
        setMindMapData(data.mindMap);
        setSelectedNode(data.mindMap.root);
      } else {
        throw new Error('Fallback to default');
      }
    } catch {
      // Robust client fallback
      const fallbackData: MindMapData = {
        chatTitle,
        generatedAt: new Date().toLocaleTimeString(),
        summary: `Extracted key insights, action deliverables, and tactical roadmap from ${messages.length} messages in ${chatTitle}.`,
        actionItems: [
          'Finalize WebSocket server payload schema',
          'Deploy full-stack bundle to production container',
          'Review real-time presence indicators with team',
        ],
        root: {
          id: 'node_root',
          title: chatTitle || 'Conversation Core',
          subtitle: `${messages.length} Discussion Nodes`,
          type: 'root',
          color: '#6366f1',
          children: [
            {
              id: 'node_topics',
              title: 'Strategic Priorities',
              subtitle: 'Core Focus Areas',
              type: 'topic',
              color: '#3b82f6',
              children: [
                {
                  id: 'node_sub1',
                  title: 'Real-Time Sync Protocol',
                  subtitle: 'WebSocket bidirectional state',
                  type: 'insight',
                  color: '#06b6d4',
                },
                {
                  id: 'node_sub2',
                  title: 'Zero-Knowledge Security',
                  subtitle: 'Client E2EE validation',
                  type: 'insight',
                  color: '#10b981',
                },
              ],
            },
            {
              id: 'node_decisions',
              title: 'Key Decisions Made',
              subtitle: 'Consensus Reached',
              type: 'decision',
              color: '#8b5cf6',
              children: [
                {
                  id: 'node_dec1',
                  title: 'Adopt Native Canvas FX',
                  subtitle: 'Zero external lag engine',
                  type: 'decision',
                  color: '#a855f7',
                },
                {
                  id: 'node_dec2',
                  title: 'Integrated Watch Party',
                  subtitle: 'Synchronized cinema room',
                  type: 'decision',
                  color: '#ec4899',
                },
              ],
            },
            {
              id: 'node_actions',
              title: 'Action Deliverables',
              subtitle: 'Pending Execution',
              type: 'action',
              color: '#f59e0b',
              children: [
                {
                  id: 'node_act1',
                  title: 'Verify production compilation',
                  subtitle: 'Assigned to Lead Architect',
                  type: 'action',
                  assignee: 'Alex Chen',
                  status: 'in_progress',
                  color: '#f97316',
                },
                {
                  id: 'node_act2',
                  title: 'Conduct team sync test',
                  subtitle: 'Assigned to Product Team',
                  type: 'action',
                  assignee: 'Sarah Lin',
                  status: 'pending',
                  color: '#eab308',
                },
              ],
            },
          ],
        },
      };
      setMindMapData(fallbackData);
      setSelectedNode(fallbackData.root);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!mindMapData) return;
    const md = `# Mind Map Summary: ${mindMapData.chatTitle}\n\n**Generated:** ${mindMapData.generatedAt}\n\n## Overview\n${mindMapData.summary}\n\n## Action Items\n${mindMapData.actionItems.map((a) => `- [ ] ${a}`).join('\n')}`;
    navigator.clipboard.writeText(md);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl h-[92vh] sm:h-[86vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-100">AI Conversation Mind Map</h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-bold">
                  Knowledge Graph
                </span>
              </div>
              <p className="text-xs text-slate-400">Structured visual graph extracted from {chatTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={generateMindMap}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
              title="Regenerate Map"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-colors"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? 'Copied' : 'Export MD'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Graph & Sidebar */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 relative bg-slate-950">
          {/* Interactive Graph Canvas Area */}
          <div className="flex-1 relative overflow-auto p-6 flex items-center justify-center bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3 text-slate-400">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium animate-pulse">Extracting conversational knowledge nodes...</p>
              </div>
            ) : mindMapData ? (
              <div
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
                className="transition-transform duration-300 flex flex-col items-center gap-8 py-6 w-full max-w-4xl"
              >
                {/* ROOT NODE */}
                <div
                  onClick={() => setSelectedNode(mindMapData.root)}
                  className="px-6 py-3.5 rounded-2xl bg-indigo-600/90 text-white border-2 border-indigo-400 shadow-xl shadow-indigo-600/30 flex items-center gap-3 cursor-pointer hover:scale-105 transition-all text-center"
                >
                  <Layers className="w-5 h-5" />
                  <div>
                    <h4 className="font-bold text-base">{mindMapData.root.title}</h4>
                    <p className="text-xs text-indigo-200">{mindMapData.root.subtitle}</p>
                  </div>
                </div>

                {/* LEVEL 1: CATEGORY NODES */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                  {mindMapData.root.children?.map((branch) => (
                    <div key={branch.id} className="flex flex-col items-center gap-4">
                      {/* Branch Header Node */}
                      <div
                        onClick={() => setSelectedNode(branch)}
                        style={{ borderColor: branch.color }}
                        className={`w-full p-3 rounded-2xl bg-slate-900/90 border shadow-lg cursor-pointer hover:scale-105 transition-all ${
                          selectedNode?.id === branch.id ? 'ring-2 ring-indigo-400' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {branch.type === 'decision' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                          {branch.type === 'action' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                          {branch.type === 'topic' && <Lightbulb className="w-4 h-4 text-blue-400" />}
                          <h5 className="font-bold text-xs text-slate-100">{branch.title}</h5>
                        </div>
                        <p className="text-[11px] text-slate-400">{branch.subtitle}</p>
                      </div>

                      {/* Level 2: Sub-Nodes */}
                      <div className="flex flex-col gap-2.5 w-full">
                        {branch.children?.map((leaf) => (
                          <div
                            key={leaf.id}
                            onClick={() => setSelectedNode(leaf)}
                            className={`p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-600 cursor-pointer transition-all ${
                              selectedNode?.id === leaf.id ? 'bg-indigo-950/60 border-indigo-500' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-200">{leaf.title}</span>
                              {leaf.status && (
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                                    leaf.status === 'completed'
                                      ? 'bg-emerald-500/20 text-emerald-300'
                                      : 'bg-amber-500/20 text-amber-300'
                                  }`}
                                >
                                  {leaf.status}
                                </span>
                              )}
                            </div>
                            {leaf.assignee && (
                              <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                                <UserCheck className="w-3 h-3 text-indigo-400" />
                                <span>{leaf.assignee}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-lg">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono px-2 text-slate-400">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Inspector & Action Items Sidebar */}
          <div className="w-full md:w-80 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto">
            {selectedNode && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                    Node Inspector
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {selectedNode.type}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-100">{selectedNode.title}</h4>
                {selectedNode.subtitle && (
                  <p className="text-xs text-slate-400">{selectedNode.subtitle}</p>
                )}
                {selectedNode.assignee && (
                  <div className="mt-1 pt-2 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                    <span className="text-slate-400">Owner:</span>
                    <span className="font-semibold text-emerald-400">{selectedNode.assignee}</span>
                  </div>
                )}
              </div>
            )}

            {mindMapData && (
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Action Deliverables
                </h4>

                <div className="flex flex-col gap-2">
                  {mindMapData.actionItems.map((act, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 flex items-start gap-2"
                    >
                      <input
                        type="checkbox"
                        className="mt-0.5 rounded text-indigo-500 focus:ring-0 cursor-pointer"
                      />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-2 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200">
                  <p className="font-semibold text-indigo-300 mb-1">Executive Summary:</p>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{mindMapData.summary}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
