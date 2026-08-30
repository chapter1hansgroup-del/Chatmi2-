import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  MessageSquare,
  Bot,
  Hash,
  User,
  Search,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  Zap,
} from 'lucide-react';
import { Chat } from '../types';

interface QuickNavSwitcherProps {
  currentChat: Chat;
  allChats: Chat[];
  onSelectChat: (chatId: string) => void;
  activeTab: 'chats' | 'stories' | 'starred' | 'calls' | 'ai';
  onNavigateTab: (tab: 'chats' | 'stories' | 'starred' | 'calls' | 'ai') => void;
}

export const QuickNavSwitcher: React.FC<QuickNavSwitcherProps> = ({
  currentChat,
  allChats,
  onSelectChat,
  activeTab,
  onNavigateTab,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const currentIndex = allChats.findIndex((c) => c.id === currentChat.id);
  const prevChat = currentIndex > 0 ? allChats[currentIndex - 1] : allChats[allChats.length - 1];
  const nextChat = currentIndex < allChats.length - 1 ? allChats[currentIndex + 1] : allChats[0];

  const filteredChats = allChats.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative inline-flex items-center gap-1" ref={dropdownRef}>
      {/* Prev Chat Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (prevChat) onSelectChat(prevChat.id);
        }}
        className="hidden lg:flex items-center justify-center p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
        title={`Previous Chat: ${prevChat?.name || ''} ([)`}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
      </button>

      {/* Main Switcher Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-200 border border-slate-700/50 hover:border-indigo-500/40 text-xs font-semibold transition-all group max-w-[200px] sm:max-w-[260px]"
        title="Quick Switch Conversation (Click or press [/])"
      >
        <span className="truncate flex items-center gap-1">
          {currentChat.participants.some((p) => p.isAi) ? (
            <Bot className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          ) : currentChat.type === 'direct' ? (
            <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <Hash className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          )}
          <span className="truncate">{currentChat.name}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Next Chat Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (nextChat) onSelectChat(nextChat.id);
        }}
        className="hidden lg:flex items-center justify-center p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
        title={`Next Chat: ${nextChat?.name || ''} (])`}
      >
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-72 sm:w-80 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          {/* Quick Header Search */}
          <div className="p-2.5 border-b border-slate-800 bg-slate-950/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Jump to conversation..."
                className="w-full bg-slate-900 text-slate-200 text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-700/60 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Quick Hub Links */}
          <div className="px-2 py-1.5 bg-slate-950/30 border-b border-slate-800/60 grid grid-cols-2 gap-1 text-[11px]">
            <button
              onClick={() => {
                onNavigateTab('ai');
                setIsOpen(false);
              }}
              className="flex items-center gap-1.5 p-1.5 rounded-lg text-purple-300 hover:bg-purple-500/15 font-medium transition-colors"
            >
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              <span>Alpha AI Copilot</span>
            </button>
            <button
              onClick={() => {
                onNavigateTab('stories');
                setIsOpen(false);
              }}
              className="flex items-center gap-1.5 p-1.5 rounded-lg text-rose-300 hover:bg-rose-500/15 font-medium transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span>Postly Reels</span>
            </button>
          </div>

          {/* Chat List */}
          <div className="max-h-60 overflow-y-auto p-1.5 divide-y divide-slate-800/30 scrollbar-thin">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
              Conversations ({filteredChats.length})
            </div>
            {filteredChats.map((c) => {
              const isSelected = c.id === currentChat.id;
              const isAi = c.participants.some((p) => p.isAi);
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectChat(c.id);
                    onNavigateTab('chats');
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-slate-700"
                    />
                    <div className="min-w-0">
                      <div className="text-xs truncate flex items-center gap-1">
                        <span>{c.name}</span>
                        {isAi && <Sparkles className="w-2.5 h-2.5 text-purple-400 shrink-0" />}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {c.lastMessage ? c.lastMessage.content : c.description || 'Active chat'}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
