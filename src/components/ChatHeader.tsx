import React from 'react';
import {
  Phone,
  Video,
  Search,
  Lock,
  MoreVertical,
  Bot,
  Sparkles,
  Info,
  Clock,
  ShieldCheck,
  Users,
  ChevronLeft,
  Film,
  Network,
  Mic,
  Shield,
  Globe,
  ChevronRight,
} from 'lucide-react';
import { Chat, User } from '../types';
import { QuickNavSwitcher } from './QuickNavSwitcher';

interface ChatHeaderProps {
  chat: Chat;
  allChats?: Chat[];
  onSelectChat?: (chatId: string) => void;
  activeTab?: 'chats' | 'stories' | 'starred' | 'calls' | 'ai';
  onNavigateTab?: (tab: 'chats' | 'stories' | 'starred' | 'calls' | 'ai') => void;
  currentUser: User;
  onStartCall: (type: 'audio' | 'video') => void;
  onOpenSearch: () => void;
  onToggleInfoPanel: () => void;
  onTriggerAiSummarize: () => void;
  onOpenAuthModal: () => void;
  onBackToChatList?: () => void;
  onOpenMindMap?: () => void;
  onOpenWatchParty?: () => void;
  onOpenVoiceCompanion?: () => void;
  onOpenSecretVault?: () => void;
  onOpenGlobalModal?: () => void;
  currentLanguageFlag?: string;
  regionName?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  chat,
  allChats = [],
  onSelectChat,
  activeTab = 'chats',
  onNavigateTab,
  currentUser,
  onStartCall,
  onOpenSearch,
  onToggleInfoPanel,
  onTriggerAiSummarize,
  onOpenAuthModal,
  onBackToChatList,
  onOpenMindMap,
  onOpenWatchParty,
  onOpenVoiceCompanion,
  onOpenSecretVault,
  onOpenGlobalModal,
  currentLanguageFlag = '🇺🇸',
  regionName = 'Anycast Edge',
}) => {
  const isAiChat = chat.participants.some((p) => p.isAi);

  return (
    <div className="h-16 px-3 sm:px-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between shrink-0 select-none z-10 gap-2">
      {/* Left Info Section with Mobile Back Button and Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {/* Smartphone Back to Chat List Button */}
        {onBackToChatList && (
          <button
            onClick={onBackToChatList}
            className="md:hidden p-2 -ml-1 text-slate-300 hover:text-white active:bg-slate-800 rounded-xl transition-colors shrink-0 flex items-center justify-center min-w-[40px] min-h-[40px]"
            title="Back to Conversations"
          >
            <ChevronLeft className="w-6 h-6 text-indigo-400" />
          </button>
        )}

        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 cursor-pointer flex-1" onClick={onToggleInfoPanel}>
          <div className="relative shrink-0">
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-1 ring-slate-700"
            />
            {chat.type === 'direct' && !isAiChat && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
            )}
          </div>

          <div className="min-w-0 flex flex-col">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Quick Dropdown Switcher if allChats is provided */}
              {allChats.length > 0 && onSelectChat && onNavigateTab ? (
                <div onClick={(e) => e.stopPropagation()}>
                  <QuickNavSwitcher
                    currentChat={chat}
                    allChats={allChats}
                    onSelectChat={onSelectChat}
                    activeTab={activeTab}
                    onNavigateTab={onNavigateTab}
                  />
                </div>
              ) : (
                <h2 className="text-sm sm:text-base font-bold text-slate-100 truncate">{chat.name}</h2>
              )}

              {chat.isE2EE && (
                <span className="hidden xs:flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded-full shrink-0">
                  <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="hidden sm:inline">E2EE</span>
                </span>
              )}
              {isAiChat && (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-purple-300 bg-purple-500/15 border border-purple-500/30 px-1.5 sm:px-2 py-0.2 rounded-full shrink-0">
                  <Bot className="w-3 h-3 text-purple-400" />
                  <span className="hidden sm:inline">Gemini AI</span>
                </span>
              )}
            </div>

            <p className="text-[11px] sm:text-xs text-slate-400 truncate flex items-center gap-1">
              {chat.type === 'direct' ? (
                isAiChat ? (
                  'Always active copilot'
                ) : (
                  'Online • Active now'
                )
              ) : (
                <span className="flex items-center gap-1 truncate">
                  <Users className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{chat.participants.length} members</span>
                  {chat.topic ? <span className="hidden sm:inline">• {chat.topic}</span> : ''}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* Watch Party Button */}
        {onOpenWatchParty && (
          <button
            onClick={onOpenWatchParty}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 active:scale-95 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all min-h-[36px]"
            title="Start Synchronized Watch Party"
          >
            <Film className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden xl:inline">Watch Party</span>
          </button>
        )}

        {/* AI Mind Map */}
        {onOpenMindMap && (
          <button
            onClick={onOpenMindMap}
            className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 active:scale-95 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all min-h-[36px]"
            title="Generate AI Conversation Mind Map"
          >
            <Network className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden xl:inline">Mind Map</span>
          </button>
        )}

        {/* AI Live Voice Companion */}
        {onOpenVoiceCompanion && (
          <button
            onClick={onOpenVoiceCompanion}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 active:scale-95 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all min-h-[36px]"
            title="Live AI Voice Companion"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Voice AI</span>
          </button>
        )}

        {/* Secret Vault & Stealth Mode */}
        {onOpenSecretVault && (
          <button
            onClick={onOpenSecretVault}
            className="p-2 rounded-xl text-slate-300 hover:text-emerald-400 active:bg-slate-800 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Quantum E2EE Keys & Stealth Panic Disguise"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
          </button>
        )}

        {/* Global Locale & Edge Network */}
        {onOpenGlobalModal && (
          <button
            onClick={onOpenGlobalModal}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 border border-slate-700/80 text-xs font-semibold transition-all min-h-[36px]"
            title="Global Edge Routing & Language Selector"
          >
            <span className="text-sm leading-none">{currentLanguageFlag}</span>
            <span className="hidden lg:inline text-[11px] text-cyan-300">{regionName}</span>
          </button>
        )}

        {/* Audio Call */}
        <button
          onClick={() => onStartCall('audio')}
          className="p-2 rounded-xl text-slate-300 hover:text-emerald-400 active:bg-slate-800 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
          title="Start Audio Call"
        >
          <Phone className="w-4 h-4 text-slate-300" />
        </button>

        {/* Video Call */}
        <button
          onClick={() => onStartCall('video')}
          className="p-2 rounded-xl text-slate-300 hover:text-emerald-400 active:bg-slate-800 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
          title="Start Video Call"
        >
          <Video className="w-4 h-4 text-slate-300" />
        </button>

        {/* Search in Chat */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex p-2 rounded-xl text-slate-300 hover:text-slate-100 active:bg-slate-800 transition-colors min-w-[36px] min-h-[36px] items-center justify-center"
          title="Search Messages"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Toggle Right Info Drawer */}
        <button
          onClick={onToggleInfoPanel}
          className="p-2 rounded-xl text-slate-300 hover:text-slate-100 active:bg-slate-800 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
          title="Chat Details & Media"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

