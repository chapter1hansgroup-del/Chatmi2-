import React from 'react';
import {
  X,
  Lock,
  Users,
  Image as ImageIcon,
  FileText,
  Clock,
  ShieldCheck,
  Bell,
  Trash2,
  Bot,
  UserPlus,
} from 'lucide-react';
import { Chat, User } from '../types';

interface ChatInfoPanelProps {
  chat: Chat;
  onClose: () => void;
  onUpdateDisappearingTimer: (timer: number) => void;
}

export const ChatInfoPanel: React.FC<ChatInfoPanelProps> = ({
  chat,
  onClose,
  onUpdateDisappearingTimer,
}) => {
  const isAi = chat.participants.some((p) => p.isAi);

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden"
        onClick={onClose}
      />

      <div className="fixed md:relative top-0 right-0 bottom-0 z-50 md:z-auto w-full max-w-xs sm:max-w-sm md:w-80 lg:w-96 bg-slate-900 border-l border-slate-800/80 flex flex-col h-full shrink-0 select-none overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Top Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60 backdrop-blur-sm">
        <h3 className="text-base font-bold text-slate-100">Contact & Chat Info</h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Profile Info */}
      <div className="p-6 flex flex-col items-center text-center border-b border-slate-800 gap-3">
        <div className="relative">
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-800 shadow-xl"
          />
          {isAi && (
            <span className="absolute bottom-0 right-0 p-1.5 bg-purple-600 rounded-full text-white ring-2 ring-slate-900">
              <Bot className="w-4 h-4" />
            </span>
          )}
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-lg font-bold text-slate-100">{chat.name}</h2>
          <span className="text-xs text-slate-400 font-medium">
            {chat.type === 'direct' ? 'Direct Message' : `${chat.participants.length} Members`}
          </span>
        </div>

        {chat.description && (
          <p className="text-xs text-slate-300 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 leading-relaxed">
            {chat.description}
          </p>
        )}
      </div>

      {/* E2EE Security Card */}
      <div className="p-4 border-b border-slate-800">
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex flex-col text-xs gap-1">
            <span className="font-bold text-emerald-300">End-to-End Encrypted</span>
            <p className="text-slate-300 leading-relaxed">
              Messages and calls are secured with 256-bit AES encryption. No one outside this chat can read or listen to them.
            </p>
            <span className="font-mono text-[10px] text-emerald-400 mt-1">
              Fingerprint: 8F2A-94B1-3E0C-77D9
            </span>
          </div>
        </div>
      </div>

      {/* Disappearing Messages Settings */}
      <div className="p-4 border-b border-slate-800 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Clock className="w-4 h-4 text-emerald-400" />
          Disappearing Messages
        </div>
        <div className="grid grid-cols-4 gap-1.5 mt-1">
          {[
            { label: 'Off', val: 0 },
            { label: '24h', val: 24 },
            { label: '7d', val: 168 },
            { label: '90d', val: 2160 },
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => onUpdateDisappearingTimer(item.val)}
              className={`py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                chat.disappearingTimer === item.val
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Group Members (If Group) */}
      {chat.type !== 'direct' && (
        <div className="p-4 border-b border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" /> Members ({chat.participants.length})
            </span>
            <button className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
              <UserPlus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {chat.participants.map((m: User) => (
              <div key={m.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-slate-200 truncate">{m.name}</span>
                    <span className="text-[10px] text-slate-400 truncate">{m.statusText || m.username}</span>
                  </div>
                </div>
                {m.role === 'admin' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    Admin
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shared Media Section */}
      <div className="p-4 flex flex-col gap-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-cyan-400" /> Shared Media & Specs
        </span>

        <div className="grid grid-cols-3 gap-2">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80"
            alt="Media 1"
            className="w-full h-20 rounded-xl object-cover hover:opacity-90 cursor-pointer"
          />
          <img
            src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=300&auto=format&fit=crop&q=80"
            alt="Media 2"
            className="w-full h-20 rounded-xl object-cover hover:opacity-90 cursor-pointer"
          />
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=80"
            alt="Media 3"
            className="w-full h-20 rounded-xl object-cover hover:opacity-90 cursor-pointer"
          />
        </div>
      </div>
    </div>
  </>
);
};
