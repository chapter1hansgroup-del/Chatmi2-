import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Lock,
  Pin,
  Bot,
  Users,
  Radio,
  CheckCheck,
  Sparkles,
  Filter,
  CircleDashed,
  MoreVertical,
  Settings,
  ShieldCheck,
  Star,
  UserCheck,
} from 'lucide-react';
import { Chat, StatusStory, User } from '../types';
import { ChatWaveLogo } from './ChatWaveLogo';

interface ChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onOpenNewChatModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  stories?: StatusStory[];
  currentUser?: User;
  onOpenStatusStory?: (storyIndex: number) => void;
  onOpenStatusCreator?: () => void;
  onOpenSettings?: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  onOpenNewChatModal,
  searchQuery,
  setSearchQuery,
  stories = [],
  currentUser,
  onOpenStatusStory,
  onOpenStatusCreator,
  onOpenSettings,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'teams' | 'direct'>('all');
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // Filter logic
  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'unread') return chat.unreadCount > 0;
    if (filter === 'teams') return chat.type === 'group' || chat.type === 'channel';
    if (filter === 'direct') return chat.type === 'direct';

    return true;
  });

  const pinnedChats = filteredChats.filter((c) => c.isPinned);
  const regularChats = filteredChats.filter((c) => !c.isPinned);

  return (
    <div className="w-full md:w-80 lg:w-96 bg-slate-900/95 border-r border-slate-800/80 flex flex-col h-full shrink-0 select-none pb-16 md:pb-0">
      {/* Top Header */}
      <div className="p-3.5 border-b border-slate-800/80 flex flex-col gap-2.5 bg-slate-900/60 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ChatWaveLogo size="sm" />
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Top Stories & Profile Icon Button (Highlighted by user) */}
            <button
              onClick={() => onOpenStatusStory?.(0)}
              className="relative flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-emerald-500/30 text-white transition-all hover:scale-105 active:scale-95 shadow-sm group"
              title="Stories & Profile Picture"
            >
              {/* Profile Avatar with WhatsApp-style glowing status story ring */}
              <div className="relative w-6 h-6 rounded-full p-0.5 bg-gradient-to-tr from-emerald-400 via-teal-400 to-indigo-500 shadow-sm">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt="Stories"
                  className="w-full h-full rounded-full object-cover ring-1 ring-slate-950"
                />
              </div>

              <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
                Stories
              </span>

              {/* Unread Stories Count Badge */}
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black shadow-md">
                {stories.length || 6}
              </span>
            </button>

            {/* Start New Chat Button */}
            <button
              onClick={onOpenNewChatModal}
              className="w-7 h-7 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center justify-center transition-all hover:scale-105 shadow-md shadow-indigo-600/25"
              title="Start New Chat or Team"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* WhatsApp-Style 3-Dots More Menu / Quick Settings */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-7 h-7 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/50"
                title="More Options & Settings"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-9 w-52 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onOpenSettings?.();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-200 hover:bg-[#2ECC71]/15 hover:text-[#2ECC71] flex items-center gap-2.5 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-[#2ECC71]" />
                    <span>Settings & Identity</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onOpenNewChatModal();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs text-slate-300 hover:bg-slate-900 flex items-center gap-2.5 transition-colors"
                  >
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span>New Group / Team</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onOpenSettings?.();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs text-slate-300 hover:bg-slate-900 flex items-center gap-2.5 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Privacy & Security</span>
                  </button>

                  <div className="border-t border-slate-800 my-1" />

                  <div className="px-3 py-1.5 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                    <span>ChatWave 60B Ultra</span>
                    <span className="text-[#2ECC71]">v26.4</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages, teams, contacts..."
            className="w-full bg-slate-950/80 text-slate-200 text-sm pl-9 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 placeholder-slate-400 transition-all"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          <button
            onClick={() => setFilter('all')}
            className={`text-xs px-2.5 py-1.2 rounded-lg font-medium transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/40'
            }`}
          >
            All Chats
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`text-xs px-2.5 py-1.2 rounded-lg font-medium transition-all whitespace-nowrap ${
              filter === 'unread'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/40'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('teams')}
            className={`text-xs px-2.5 py-1.2 rounded-lg font-medium transition-all whitespace-nowrap ${
              filter === 'teams'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/40'
            }`}
          >
            Teams & Channels
          </button>
          <button
            onClick={() => setFilter('direct')}
            className={`text-xs px-2.5 py-1.2 rounded-lg font-medium transition-all whitespace-nowrap ${
              filter === 'direct'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/40'
            }`}
          >
            Direct
          </button>
        </div>
      </div>

      {/* Chat List Scroll Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        {/* Pinned Chats Section */}
        {pinnedChats.length > 0 && (
          <div>
            <div className="px-4 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 bg-slate-900/50">
              <Pin className="w-3 h-3 text-emerald-400" />
              Pinned
            </div>
            {pinnedChats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === activeChatId}
                onClick={() => onSelectChat(chat.id)}
              />
            ))}
          </div>
        )}

        {/* Regular Chats Section */}
        {regularChats.length > 0 && (
          <div>
            {pinnedChats.length > 0 && (
              <div className="px-4 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900/50">
                All Messages
              </div>
            )}
            {regularChats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === activeChatId}
                onClick={() => onSelectChat(chat.id)}
              />
            ))}
          </div>
        )}

        {filteredChats.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
            <Search className="w-8 h-8 text-slate-400 stroke-[1.5]" />
            <p>No chats found</p>
            <span className="text-xs text-slate-400">Try a different search or filter</span>
          </div>
        )}
      </div>
    </div>
  );
};

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, isActive, onClick }) => {
  const isAi = chat.participants.some((p) => p.isAi);
  const isOnline = chat.participants.some((p) => p.status === 'online' && p.id !== 'user_me');

  return (
    <div
      onClick={onClick}
      className={`px-4 py-3.5 flex items-center gap-3 cursor-pointer transition-all relative group ${
        isActive
          ? 'bg-indigo-600/10 border-l-3 border-indigo-500'
          : 'hover:bg-slate-800/40 border-l-3 border-transparent'
      }`}
    >
      {/* Avatar Container */}
      <div className="relative shrink-0">
        <img
          src={chat.avatar}
          alt={chat.name}
          className="w-12 h-12 rounded-full object-cover ring-1 ring-slate-700"
        />

        {/* Online Green Status Dot */}
        {isOnline && chat.type === 'direct' && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-slate-900 font-bold" title="Online now" />
        )}

        {/* Type Icon Badge */}
        {chat.type === 'group' && (
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white ring-2 ring-slate-900">
            <Users className="w-3 h-3" />
          </span>
        )}

        {chat.type === 'channel' && (
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center text-white ring-2 ring-slate-900">
            <Radio className="w-3 h-3" />
          </span>
        )}

        {isAi && (
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white ring-2 ring-slate-900">
            <Bot className="w-3 h-3" />
          </span>
        )}
      </div>

      {/* Content Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="text-sm font-semibold text-slate-100 truncate">{chat.name}</h3>
            {chat.isE2EE && (
              <Lock className="w-3 h-3 text-emerald-400 shrink-0" title="End-to-End Encrypted" />
            )}
          </div>

          <span className="text-[11px] text-slate-400 shrink-0 font-medium">
            {chat.lastMessage?.timestamp || ''}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-slate-400 truncate flex items-center gap-1">
            {chat.lastMessage?.status === 'read' && (
              <CheckCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            )}
            <span className="truncate">
              {chat.lastMessage
                ? chat.lastMessage.type === 'audio'
                  ? '🎵 Voice Note'
                  : chat.lastMessage.type === 'image'
                  ? '📷 Photo'
                  : chat.lastMessage.type === 'poll'
                  ? '📊 Poll'
                  : chat.lastMessage.content
                : chat.description || 'No messages yet'}
            </span>
          </p>

          {/* Unread Badge */}
          {chat.unreadCount > 0 && (
            <span className="min-w-[18px] h-4.5 px-1.5 rounded-full bg-emerald-500 text-[11px] font-bold text-slate-950 flex items-center justify-center shrink-0">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
