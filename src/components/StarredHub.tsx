import React, { useState } from 'react';
import {
  Star,
  Search,
  MessageSquare,
  Image as ImageIcon,
  FileText,
  Clock,
  ArrowRight,
  User as UserIcon,
  Trash2,
  Share2,
  Sparkles,
} from 'lucide-react';
import { Message, User, Chat } from '../types';

interface StarredHubProps {
  currentUser: User;
  messages: Record<string, Message[]>;
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
  onUnstarMessage: (messageId: string) => void;
}

export const StarredHub: React.FC<StarredHubProps> = ({
  currentUser,
  messages,
  chats,
  onSelectChat,
  onUnstarMessage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'text' | 'media' | 'code'>('all');

  // Collect all starred messages from all chats (safely deduplicated by ID)
  const starredMap = new Map<string, Message & { chatName: string; chatAvatar?: string }>();

  Object.entries(messages).forEach(([chatId, msgList]) => {
    const chat = chats.find((c) => c.id === chatId);
    const chatName = chat?.name || 'Chat';
    const chatAvatar = chat?.avatar;

    if (Array.isArray(msgList)) {
      (msgList as Message[]).forEach((msg) => {
        if (msg.isStarred && !starredMap.has(msg.id)) {
          starredMap.set(msg.id, {
            ...msg,
            chatName,
            chatAvatar,
          });
        }
      });
    }
  });

  const allStarredMessages = Array.from(starredMap.values());

  // Filter messages
  const filteredStarred = allStarredMessages.filter((msg) => {
    const matchesSearch =
      msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.chatName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'text') return msg.type === 'text';
    if (filterType === 'media') return msg.type === 'image' || msg.type === 'video' || msg.type === 'audio';
    if (filterType === 'code') return msg.type === 'code';

    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto pb-20 md:pb-6 select-none animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Star className="w-5 h-5 fill-amber-400/20" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Starred Messages
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold">
                  {allStarredMessages.length} Saved
                </span>
              </h1>
              <p className="text-xs text-slate-400">Quickly locate important bookmarks, quotes, links and media</p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in starred messages..."
              className="w-full bg-slate-950/80 text-slate-200 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 placeholder-slate-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({allStarredMessages.length})
            </button>
            <button
              onClick={() => setFilterType('text')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === 'text'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              Text Notes
            </button>
            <button
              onClick={() => setFilterType('media')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === 'media'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              Media
            </button>
            <button
              onClick={() => setFilterType('code')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === 'code'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              Snippets
            </button>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="p-4 sm:p-6 max-w-4xl w-full mx-auto flex flex-col gap-4">
        {filteredStarred.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3 bg-slate-900/40 rounded-3xl border border-slate-800/60">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-500">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-300">No Starred Messages Found</h3>
            <p className="text-xs text-slate-500 max-w-xs">
              Hover over or long-press any message in your chats and click the star icon to save it here for instant access.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredStarred.map((msg) => (
              <div
                key={msg.id}
                className="p-4 bg-slate-900/80 border border-slate-800/90 rounded-2xl flex flex-col gap-2.5 hover:border-amber-500/40 transition-all group shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">{msg.senderName}</span>
                        <span className="text-[10px] text-slate-500">• {msg.timestamp}</span>
                      </div>
                      <span className="text-[10px] text-indigo-400 font-medium">in #{msg.chatName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUnstarMessage(msg.id)}
                      className="p-1.5 rounded-lg text-amber-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Unstar Message"
                    >
                      <Star className="w-4 h-4 fill-amber-400" />
                    </button>
                    <button
                      onClick={() => onSelectChat(msg.chatId)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all border border-indigo-500/30"
                    >
                      <span>Go to Chat</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Message Content Preview */}
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-sans">
                  {msg.type === 'text' && <p>{msg.content}</p>}
                  {msg.type === 'image' && (
                    <div className="flex flex-col gap-2">
                      {msg.mediaUrl && (
                        <img src={msg.mediaUrl} alt="Starred Media" className="max-h-48 rounded-lg object-cover" />
                      )}
                      <p className="text-slate-300">{msg.content}</p>
                    </div>
                  )}
                  {msg.type === 'code' && (
                    <pre className="font-mono text-[11px] text-emerald-300 bg-slate-900 p-2 rounded-lg overflow-x-auto">
                      {msg.content}
                    </pre>
                  )}
                  {msg.type === 'audio' && (
                    <div className="flex items-center gap-2 text-indigo-400">
                      <span>🎵 Audio Voice Note</span>
                      <span className="text-slate-400">({msg.audioDuration || 5}s)</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
