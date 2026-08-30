import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  Send,
  Sparkles,
  BadgeCheck,
  ShieldCheck,
  Lock,
  Play,
  Smile,
  Paperclip,
  CheckCheck,
  User,
  Info,
  Gift,
  Flame,
} from 'lucide-react';
import { User as AppUser, PostlyVideo } from '../types';
import { soundEffects } from '../utils/audio';

export interface PostlyDirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderUsername: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  createdAt: number;
  isRead: boolean;
  videoAttachment?: {
    id: string;
    caption: string;
    coverImage?: string;
  };
  isFromCreator?: boolean;
}

export interface PostlyConversation {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  isVerified?: boolean;
  verificationType?: 'individual' | 'company';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: PostlyDirectMessage[];
  category?: 'creator' | 'fan' | 'collab' | 'system';
}

interface PostlyDirectChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  isVerified?: boolean;
  verificationType?: 'individual' | 'company';
  currentUser: AppUser;
  conversation?: PostlyConversation;
  onSendMessage: (creatorId: string, text: string, videoAttachment?: any) => void;
  onOpenProfile?: (creatorId: string) => void;
}

export const PostlyDirectChatModal: React.FC<PostlyDirectChatModalProps> = ({
  isOpen,
  onClose,
  creatorId,
  creatorName,
  creatorUsername,
  creatorAvatar,
  isVerified = false,
  verificationType = 'individual',
  currentUser,
  conversation,
  onSendMessage,
  onOpenProfile,
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = conversation?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages.length]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');
    soundEffects.playSendSound();
    onSendMessage(creatorId, textToSend);

    // Realistic auto-reply simulation for creators
    if (creatorId !== 'user_system') {
      setTimeout(() => {
        setIsTyping(true);
      }, 1000);

      setTimeout(() => {
        setIsTyping(false);
        const replies = [
          `Hey @${currentUser.username || 'there'}! Thanks for reaching out on Postly. Checking this out! ✨`,
          `Appreciate the support on the latest post! Let's build something awesome together 🚀`,
          `Great note! I'll catch you during the next Postly Live stream session 🎙️`,
          `Thanks for connecting on Postly Direct Messages! Stay tuned for the next drop 🔥`,
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        onSendMessage(creatorId, randomReply);
        soundEffects.playReceiveSound();
      }, 3200);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg h-[88vh] max-h-[780px] bg-slate-950 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP HEADER */}
        <div className="p-3.5 bg-slate-950/95 border-b border-slate-800/90 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Avatar with click to open profile */}
            <div
              className="relative cursor-pointer group"
              onClick={() => onOpenProfile?.(creatorId)}
              title="View Creator Profile"
            >
              <img
                src={creatorAvatar}
                alt={creatorName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-800 group-hover:ring-[#2ECC71] transition-all"
              />
              {isVerified && (
                <div
                  className={`absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full ${
                    verificationType === 'company' ? 'bg-amber-400 text-slate-950' : 'bg-cyan-500 text-slate-950'
                  }`}
                >
                  <BadgeCheck className="w-3 h-3 fill-current" />
                </div>
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenProfile?.(creatorId)}
                  className="text-sm font-black text-white hover:text-[#2ECC71] transition-colors truncate text-left"
                >
                  {creatorName}
                </button>
                {isVerified && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      verificationType === 'company'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40'
                    }`}
                  >
                    Verified
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400">@{creatorUsername} &middot; Postly Direct</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* POSTLY PRIVACY SANDBOX BANNER */}
        <div className="bg-gradient-to-r from-indigo-950/80 via-purple-950/70 to-slate-950 px-3.5 py-2 border-b border-indigo-500/20 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-indigo-300">
            <Lock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="text-[11px] font-medium leading-tight text-indigo-200">
              <strong>Postly Creator Sandbox:</strong> Direct messages here stay isolated on Postly and will not appear in your private personal chats.
            </span>
          </div>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 whitespace-nowrap">
            Public Network
          </span>
        </div>

        {/* MESSAGES LIST */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/50">
          {/* Creator Profile Intro Card in Message Feed */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center text-center gap-2 my-2">
            <img
              src={creatorAvatar}
              alt={creatorName}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-[#2ECC71]"
            />
            <div className="flex flex-col items-center">
              <h4 className="text-sm font-black text-white flex items-center gap-1">
                {creatorName}
                {isVerified && (
                  <BadgeCheck
                    className={`w-4 h-4 fill-current ${
                      verificationType === 'company' ? 'text-amber-400' : 'text-cyan-400'
                    }`}
                  />
                )}
              </h4>
              <span className="text-xs text-slate-400">@{creatorUsername}</span>
            </div>
            <p className="text-[11px] text-slate-300 max-w-xs">
              Direct communication for Postly creators, collaborations, and post inquiries.
            </p>
          </div>

          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[82%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                    isMe
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-br-none'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic animate-pulse">
              <img
                src={creatorAvatar}
                alt={creatorName}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>{creatorName} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT BAR */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message @${creatorUsername} on Postly...`}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#2ECC71] transition-all"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-2xl bg-[#2ECC71] hover:bg-[#27ae60] disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 font-bold transition-all shadow-md active:scale-95 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
