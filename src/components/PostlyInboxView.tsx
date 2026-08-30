import React, { useState, useMemo } from 'react';
import {
  Inbox,
  Search,
  MessageSquare,
  BadgeCheck,
  ShieldCheck,
  Lock,
  Plus,
  Trash2,
  CheckCheck,
  Sparkles,
  Send,
  UserCheck,
  Filter,
} from 'lucide-react';
import { PostlyConversation, PostlyDirectMessage } from './PostlyDirectChatModal';
import { PostlyVideo, User } from '../types';
import { soundEffects } from '../utils/audio';

interface PostlyInboxViewProps {
  conversations: PostlyConversation[];
  allVideos: PostlyVideo[];
  currentUser: User;
  onOpenConversation: (conversation: PostlyConversation) => void;
  onNewMessage: (creatorId: string) => void;
  onDeleteConversation?: (conversationId: string) => void;
  onOpenProfile?: (creatorId: string) => void;
}

export const PostlyInboxView: React.FC<PostlyInboxViewProps> = ({
  conversations,
  allVideos,
  currentUser,
  onOpenConversation,
  onNewMessage,
  onDeleteConversation,
  onOpenProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'creators' | 'collab' | 'system'>('all');
  const [showNewDmPicker, setShowNewDmPicker] = useState(false);

  // Extract unique creators from videos
  const uniqueCreators = useMemo(() => {
    const map = new Map<string, { id: string; name: string; username: string; avatar: string; isVerified?: boolean; verificationType?: 'individual' | 'company' }>();
    allVideos.forEach((v) => {
      if (v.userId && !map.has(v.userId) && v.userId !== currentUser.id) {
        map.set(v.userId, {
          id: v.userId,
          name: v.userName,
          username: v.userUsername,
          avatar: v.userAvatar,
          isVerified: v.isVerified,
          verificationType: v.verificationType,
        });
      }
    });
    return Array.from(map.values());
  }, [allVideos, currentUser.id]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const matchesSearch =
        c.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.creatorUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterCategory === 'creators') return c.isVerified;
      if (filterCategory === 'collab') return c.category === 'collab';
      if (filterCategory === 'system') return c.category === 'system';

      return true;
    });
  }, [conversations, searchQuery, filterCategory]);

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white overflow-hidden select-none">
      {/* INBOX HEADER */}
      <div className="p-4 bg-slate-950/95 border-b border-slate-800/90 flex items-center justify-between shrink-0 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/20">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white">Postly Direct Inbox</h3>
              {totalUnread > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shadow-sm animate-pulse">
                  {totalUnread} new
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">Direct Creator & Fan Messages on Postly</p>
          </div>
        </div>

        <button
          onClick={() => setShowNewDmPicker(!showNewDmPicker)}
          className="px-3 py-1.5 rounded-2xl bg-[#2ECC71] hover:bg-[#27ae60] text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-[#2ECC71]/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New DM</span>
        </button>
      </div>

      {/* PRIVACY BOUNDARY NOTICE */}
      <div className="bg-gradient-to-r from-indigo-950/90 via-purple-950/80 to-slate-950 px-4 py-2.5 border-b border-indigo-500/30 flex items-start sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 text-indigo-200 text-xs font-medium">
          <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            <strong>Isolated Postly Public Inbox:</strong> Messages sent or received here are strictly contained within Postly. They will <em>never</em> appear in your private ChatWave chats.
          </span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 whitespace-nowrap shrink-0">
          🔒 Zero Leak
        </span>
      </div>

      {/* QUICK CREATOR DM PICKER TRAY (If toggled) */}
      {showNewDmPicker && (
        <div className="p-3 bg-slate-900/90 border-b border-slate-800 animate-in slide-in-from-top-2 duration-200 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300">Message a Creator directly:</span>
            <button
              onClick={() => setShowNewDmPicker(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {uniqueCreators.map((creator) => (
              <button
                key={creator.id}
                onClick={() => {
                  onNewMessage(creator.id);
                  setShowNewDmPicker(false);
                  soundEffects.playTapSound();
                }}
                className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-[#2ECC71] transition-all min-w-[72px] shrink-0 group"
              >
                <div className="relative">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700 group-hover:ring-[#2ECC71]"
                  />
                  {creator.isVerified && (
                    <span className="absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full bg-cyan-400 text-slate-950">
                      <BadgeCheck className="w-2.5 h-2.5 fill-current" />
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-slate-200 truncate max-w-[64px]">
                  {creator.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SEARCH & FILTERS */}
      <div className="p-3 bg-slate-950/80 border-b border-slate-800/70 flex flex-col sm:flex-row gap-2 shrink-0">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Postly conversations, creators..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2ECC71] transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterCategory === 'all'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({conversations.length})
          </button>
          <button
            onClick={() => setFilterCategory('creators')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterCategory === 'creators'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            Verified ⭐
          </button>
          <button
            onClick={() => setFilterCategory('collab')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterCategory === 'collab'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            Collabs 🚀
          </button>
          <button
            onClick={() => setFilterCategory('system')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterCategory === 'system'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            System
          </button>
        </div>
      </div>

      {/* CONVERSATION LIST */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => {
                onOpenConversation(conv);
                soundEffects.playTapSound();
              }}
              className="group p-3 sm:p-3.5 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-[#2ECC71]/50 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Creator Avatar with Click to Profile */}
                <div
                  className="relative shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenProfile) onOpenProfile(conv.creatorId);
                  }}
                  title="View Creator Profile"
                >
                  <img
                    src={conv.creatorAvatar}
                    alt={conv.creatorName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-800 group-hover:ring-[#2ECC71] transition-all"
                  />
                  {conv.isVerified && (
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full ${
                        conv.verificationType === 'company' ? 'bg-amber-400 text-slate-950' : 'bg-cyan-500 text-slate-950'
                      }`}
                    >
                      <BadgeCheck className="w-3 h-3 fill-current" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-sm font-black text-white group-hover:text-[#2ECC71] transition-colors truncate">
                        {conv.creatorName}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold truncate">
                        @{conv.creatorUsername}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0 font-medium">
                      {conv.lastMessageTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className="text-xs text-slate-300 truncate leading-relaxed">
                      {conv.lastMessage}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shrink-0 shadow-sm">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onDeleteConversation && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                      soundEffects.playClickSound();
                    }}
                    className="p-1.5 rounded-xl hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete Conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
              <Inbox className="w-7 h-7" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-slate-200">No Postly Messages Found</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Start a direct conversation with creators from their Postly profile or reel!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
