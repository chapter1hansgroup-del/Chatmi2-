import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MessageSquare,
  Sparkles,
  PhoneCall,
  Star,
  Shield,
  Video,
  Tv,
  Network,
  Mic,
  Palette,
  FileCode2,
  Zap,
  BarChart2,
  Calendar,
  Lock,
  ArrowRight,
  Command,
  CornerDownLeft,
  X,
  Flame,
  Radio,
  Image as ImageIcon,
  Globe,
  Users,
  FileText,
} from 'lucide-react';
import { Chat, ScreenFxType } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
  onNavigateToTab?: (tab: 'chats' | 'stories' | 'starred' | 'calls' | 'ai') => void;
  onOpenModal?: (modalName: string) => void;
  onOpenGoogleContacts?: () => void;
  onOpenGoogleForms?: () => void;
  onTriggerAction?: (action: string) => void;
  onTriggerFx?: (fx: ScreenFxType) => void;
  onToggleStealth?: () => void;
  onOpenGlobalModal?: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'AI Intelligence' | 'Interactive Tools' | 'Privacy & Effects' | 'Global & System';
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

export const CommandPaletteModal: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  chats,
  onSelectChat,
  onNavigateToTab,
  onOpenModal,
  onOpenGoogleContacts,
  onOpenGoogleForms,
  onTriggerAction,
  onTriggerFx,
  onToggleStealth,
  onOpenGlobalModal,
}) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Build command list
  const commands: CommandItem[] = [
    // Navigation items
    ...chats.map((c) => ({
      id: `chat_${c.id}`,
      title: `Jump to ${c.name}`,
      subtitle: c.type === 'group' ? 'Group channel' : 'Direct message',
      category: 'Navigation' as const,
      icon: <MessageSquare className="w-4 h-4 text-indigo-400" />,
      action: () => {
        onSelectChat(c.id);
        if (onNavigateToTab) onNavigateToTab('chats');
        onClose();
      },
    })),
    {
      id: 'nav_ai_alpha',
      title: 'Talk to Alpha AI Copilot',
      subtitle: 'Gemini-powered contextual agent',
      category: 'AI Intelligence',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      action: () => {
        if (onNavigateToTab) onNavigateToTab('ai');
        onClose();
      },
      shortcut: 'Tab 2',
    },
    {
      id: 'nav_postly',
      title: 'Open Postly Stories & Reels',
      subtitle: 'Trending video feed & broadcast studio',
      category: 'Navigation',
      icon: <Radio className="w-4 h-4 text-rose-400" />,
      action: () => {
        if (onNavigateToTab) onNavigateToTab('stories');
        onClose();
      },
      shortcut: 'Tab 3',
    },
    {
      id: 'nav_calls',
      title: 'Calls & Video Meetings Hub',
      subtitle: 'HD voice rooms & screen sharing',
      category: 'Navigation',
      icon: <PhoneCall className="w-4 h-4 text-emerald-400" />,
      action: () => {
        if (onNavigateToTab) onNavigateToTab('calls');
        onClose();
      },
    },
    {
      id: 'nav_starred',
      title: 'Starred & Saved Vault',
      subtitle: 'Bookmarks, code snippets, important quotes',
      category: 'Navigation',
      icon: <Star className="w-4 h-4 text-amber-400" />,
      action: () => {
        if (onNavigateToTab) onNavigateToTab('starred');
        onClose();
      },
    },
    {
      id: 'nav_google_contacts',
      title: 'Open Google Contacts Directory',
      subtitle: 'Browse, search, sync & import Google Workspace address book',
      category: 'Navigation',
      icon: <Users className="w-4 h-4 text-indigo-400" />,
      action: () => {
        if (onOpenGoogleContacts) onOpenGoogleContacts();
        onClose();
      },
      shortcut: 'Contacts',
    },
    {
      id: 'nav_google_forms',
      title: 'Open Google Forms & Surveys',
      subtitle: 'Create polls, surveys, event RSVPs & view live responses',
      category: 'Navigation',
      icon: <FileText className="w-4 h-4 text-purple-400" />,
      action: () => {
        if (onOpenGoogleForms) onOpenGoogleForms();
        onClose();
      },
      shortcut: 'Forms',
    },

    // AI & Intelligence
    {
      id: 'ai_voice_orb',
      title: 'Launch Neural AI Voice Companion',
      subtitle: 'Real-time interactive voice dialogue orb',
      category: 'AI Intelligence',
      icon: <Mic className="w-4 h-4 text-purple-400" />,
      action: () => {
        if (onOpenModal) onOpenModal('voiceOrb');
        else if (onTriggerAction) onTriggerAction('open_voice');
        onClose();
      },
      shortcut: 'Alt+V',
    },
    {
      id: 'ai_summarize',
      title: 'Executive Channel Catch-Up (TL;DR)',
      subtitle: 'AI bullet points & action items summarizer',
      category: 'AI Intelligence',
      icon: <Zap className="w-4 h-4 text-yellow-400" />,
      action: () => {
        if (onOpenModal) onOpenModal('aiTools');
        else if (onTriggerAction) onTriggerAction('open_ai_tools');
        onClose();
      },
    },
    {
      id: 'ai_mind_map',
      title: 'Generate Visual Knowledge Mind Map',
      subtitle: 'Extract conversational topics into interactive graph',
      category: 'AI Intelligence',
      icon: <Network className="w-4 h-4 text-cyan-400" />,
      action: () => {
        if (onOpenModal) onOpenModal('mindMap');
        else if (onTriggerAction) onTriggerAction('open_mindmap');
        onClose();
      },
    },
    {
      id: 'ai_image_studio',
      title: 'AI Image & Creative Visual Studio',
      subtitle: 'Generate stickers, avatars, and concept art',
      category: 'AI Intelligence',
      icon: <ImageIcon className="w-4 h-4 text-pink-400" />,
      action: () => {
        if (onOpenModal) onOpenModal('imageStudio');
        else if (onTriggerAction) onTriggerAction('open_ai_image');
        onClose();
      },
    },

    // Interactive Tools
    {
      id: 'tool_watch_party',
      title: 'Start Live Watch Party Room',
      subtitle: 'Synced video playback with interactive emojis',
      category: 'Interactive Tools',
      icon: <Tv className="w-4 h-4 text-indigo-400" />,
      action: () => {
        if (onOpenModal) onOpenModal('watchParty');
        else if (onTriggerAction) onTriggerAction('open_watch_party');
        onClose();
      },
    },
    {
      id: 'tool_doodle',
      title: 'Open Doodle Canvas & Handwriting Sketchpad',
      subtitle: 'Draw, sketch, and send directly into chat',
      category: 'Interactive Tools',
      icon: <Palette className="w-4 h-4 text-emerald-400" />,
      action: () => {
        if (onOpenModal) onOpenModal('doodle');
        else if (onTriggerAction) onTriggerAction('open_doodle');
        onClose();
      },
    },
    {
      id: 'tool_poll',
      title: 'Create Interactive Real-Time Poll',
      subtitle: 'Gather team feedback with live percentages',
      category: 'Interactive Tools',
      icon: <BarChart2 className="w-4 h-4 text-blue-400" />,
      action: () => {
        if (onOpenModal) onOpenModal('poll');
        else if (onTriggerAction) onTriggerAction('open_poll');
        onClose();
      },
    },
    {
      id: 'tool_schedule',
      title: 'Schedule Timed Message Dispatch',
      subtitle: 'Delay delivery across time zones',
      category: 'Interactive Tools',
      icon: <Calendar className="w-4 h-4 text-orange-400" />,
      action: () => {
        if (onOpenModal) onOpenModal('schedule');
        else if (onTriggerAction) onTriggerAction('open_schedule');
        onClose();
      },
    },

    // Privacy & Effects
    {
      id: 'privacy_vault',
      title: 'Unlock Encrypted Secret Vault',
      subtitle: 'Biometric/PIN protected secret notes & files',
      category: 'Privacy & Effects',
      icon: <Lock className="w-4 h-4 text-amber-400" />,
      action: () => {
        if (onOpenModal) onOpenModal('secretVault');
        else if (onTriggerAction) onTriggerAction('open_secret_vault');
        onClose();
      },
    },
    {
      id: 'privacy_stealth',
      title: 'Trigger Panic Stealth Disguise Mode',
      subtitle: 'Instant fake VS Code / Financial spreadsheet mask',
      category: 'Privacy & Effects',
      icon: <FileCode2 className="w-4 h-4 text-emerald-400" />,
      action: () => {
        if (onToggleStealth) onToggleStealth();
        onClose();
      },
      shortcut: 'Esc / Panic',
    },
    {
      id: 'fx_confetti',
      title: 'Trigger Confetti Celebration Blast',
      subtitle: 'Broadcast joyful screen FX across connected clients',
      category: 'Privacy & Effects',
      icon: <Zap className="w-4 h-4 text-purple-400" />,
      action: () => {
        onTriggerFx('confetti');
        onClose();
      },
    },
    {
      id: 'fx_matrix',
      title: 'Trigger Matrix Digital Rain FX',
      subtitle: 'Cyberpunk green code cascade overlay',
      category: 'Privacy & Effects',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onTriggerFx('matrix');
        onClose();
      },
    },
    {
      id: 'fx_rocket',
      title: 'Trigger Rocket Moon Launch FX',
      subtitle: 'Ignite thrusters across the screen',
      category: 'Privacy & Effects',
      icon: <Flame className="w-4 h-4 text-rose-400" />,
      action: () => {
        onTriggerFx?.('rocket');
        onClose();
      },
    },

    // Global & System
    {
      id: 'global_locale_switch',
      title: 'Change Country, Language & Edge Region (195+ Countries)',
      subtitle: 'Switch languages, Anycast edge routing & Data Saver mode',
      category: 'Global & System',
      icon: <Globe className="w-4 h-4 text-cyan-400" />,
      action: () => {
        if (onOpenGlobalModal) {
          onOpenGlobalModal();
        } else if (onTriggerAction) {
          onTriggerAction('open_global');
        }
        onClose();
      },
    },
    {
      id: 'system_export_transcripts',
      title: 'Export Transcripts & Chat Records (.json)',
      subtitle: 'Download complete chat backup package',
      category: 'Global & System',
      icon: <Shield className="w-4 h-4 text-emerald-400" />,
      action: () => {
        if (onTriggerAction) {
          onTriggerAction('export_data');
        }
        onClose();
      },
    },
  ];

  // Filter commands
  const filteredCommands = commands.filter((cmd) => {
    const query = search.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(query) ||
      (cmd.subtitle && cmd.subtitle.toLowerCase().includes(query)) ||
      cmd.category.toLowerCase().includes(query)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh] animate-in zoom-in-95 duration-150 ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/90">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Command className="w-4 h-4" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, search chats, launch AI tools... (Cmd+K)"
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
              <Search className="w-6 h-6 text-slate-500" />
              <span>No commands matching "{search}"</span>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3.5 py-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                          : 'bg-slate-800 border-slate-700/60 text-slate-400'
                      }`}
                    >
                      {cmd.icon}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold truncate flex items-center gap-2">
                        {cmd.title}
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {cmd.category}
                        </span>
                      </span>
                      {cmd.subtitle && (
                        <span className="text-[11px] text-slate-400 truncate">{cmd.subtitle}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cmd.shortcut && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                        {cmd.shortcut}
                      </span>
                    )}
                    {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <span className="text-slate-400 font-medium">Chatmi Command Center Pro</span>
        </div>
      </div>
    </div>
  );
};
