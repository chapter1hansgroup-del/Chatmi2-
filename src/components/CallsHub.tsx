import React, { useState } from 'react';
import {
  Phone,
  Video,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Plus,
  Search,
  Users,
  Copy,
  Check,
  Sparkles,
  Calendar,
  Clock,
  Shield,
  Radio,
} from 'lucide-react';
import { User, Chat } from '../types';

interface CallRecord {
  id: string;
  contactName: string;
  contactAvatar: string;
  type: 'audio' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration?: string;
}

interface CallsHubProps {
  currentUser: User;
  chats: Chat[];
  onStartCall: (type: 'audio' | 'video', user?: User) => void;
  onNavigateToChat: (chatId: string) => void;
}

export const CallsHub: React.FC<CallsHubProps> = ({
  currentUser,
  chats,
  onStartCall,
  onNavigateToChat,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'history' | 'speed_dial' | 'meet'>('history');
  const [meetingCode, setMeetingCode] = useState('meet-chatmi-8842');
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const [callHistory, setCallHistory] = useState<CallRecord[]>([
    {
      id: 'call_1',
      contactName: 'Sarah Connor',
      contactAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      type: 'video',
      direction: 'incoming',
      timestamp: 'Today, 2:45 PM',
      duration: '14m 22s',
    },
    {
      id: 'call_2',
      contactName: 'David Chen',
      contactAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      type: 'audio',
      direction: 'missed',
      timestamp: 'Today, 11:20 AM',
    },
    {
      id: 'call_3',
      contactName: 'Elena Rostova',
      contactAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      type: 'video',
      direction: 'outgoing',
      timestamp: 'Yesterday, 6:15 PM',
      duration: '32m 08s',
    },
    {
      id: 'call_4',
      contactName: 'Alpha AI Assistant',
      contactAvatar: '/alpha-logo.svg',
      type: 'audio',
      direction: 'outgoing',
      timestamp: 'Yesterday, 3:00 PM',
      duration: '5m 12s',
    },
  ]);

  const directContacts = chats.filter((c) => c.type === 'direct');

  const copyMeetingLink = () => {
    navigator.clipboard?.writeText(`https://chatmi.live/meet/${meetingCode}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const generateNewRoom = () => {
    const randomCode = `meet-chatmi-${Math.floor(1000 + Math.random() * 9000)}`;
    setMeetingCode(randomCode);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto pb-20 md:pb-6 select-none animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="p-4 sm:p-6 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Calls & Meetings Hub
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  HD Audio/Video
                </span>
              </h1>
              <p className="text-xs text-slate-400">Encrypted peer-to-peer voice and group video conferencing</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onStartCall('audio')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700/60 transition-all hover:scale-105"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Quick Audio</span>
            </button>
            <button
              onClick={() => onStartCall('video')}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all hover:scale-105"
            >
              <Video className="w-4 h-4" />
              <span>Start Video Meet</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800/40 pb-2">
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Recent Calls
          </button>
          <button
            onClick={() => setActiveSubTab('speed_dial')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'speed_dial'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Speed Dial Contacts
          </button>
          <button
            onClick={() => setActiveSubTab('meet')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'meet'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            Instant Room Links
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 max-w-4xl w-full mx-auto flex flex-col gap-6">
        {/* TAB 1: RECENT CALL HISTORY */}
        {activeSubTab === 'history' && (
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Call Log & Activity
            </h2>
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl divide-y divide-slate-800/60 overflow-hidden shadow-xl">
              {callHistory.map((call) => (
                <div
                  key={call.id}
                  className="p-3 sm:p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={call.contactAvatar}
                        alt={call.contactName}
                        className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-700"
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white shadow-md ${
                          call.direction === 'missed'
                            ? 'bg-rose-600'
                            : call.direction === 'incoming'
                            ? 'bg-emerald-600'
                            : 'bg-indigo-600'
                        }`}
                      >
                        {call.direction === 'missed' ? (
                          <PhoneMissed className="w-3 h-3" />
                        ) : call.direction === 'incoming' ? (
                          <PhoneIncoming className="w-3 h-3" />
                        ) : (
                          <PhoneOutgoing className="w-3 h-3" />
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">
                        {call.contactName}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{call.timestamp}</span>
                        {call.duration && (
                          <>
                            <span>•</span>
                            <span className="text-slate-300 font-medium">{call.duration}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onStartCall('audio')}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors"
                      title="Audio Call"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onStartCall('video')}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-indigo-400 transition-colors"
                      title="Video Call"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SPEED DIAL CONTACTS */}
        {activeSubTab === 'speed_dial' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                Direct Contacts ({directContacts.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {directContacts.map((c) => (
                <div
                  key={c.id}
                  className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between hover:border-indigo-500/50 transition-all group shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-indigo-500 transition-all"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-200">{c.name}</span>
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Available for calls
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onStartCall('audio')}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-all shadow-sm"
                      title="Call Audio"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onStartCall('video')}
                      className="p-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 transition-all shadow-sm"
                      title="Call Video"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: INSTANT MEETING LINKS */}
        {activeSubTab === 'meet' && (
          <div className="flex flex-col gap-4">
            <div className="p-6 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-500/30 rounded-3xl shadow-2xl flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create Instant Video Meeting Room</h3>
                  <p className="text-xs text-slate-300">
                    Share this unique link with anyone to jump into a live WebRTC audio/video call
                  </p>
                </div>
              </div>

              {/* Link Box */}
              <div className="flex items-center gap-2 bg-slate-950/90 p-2.5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 px-2 font-mono flex-1 truncate">
                  https://chatmi.live/meet/{meetingCode}
                </span>
                <button
                  onClick={copyMeetingLink}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-all active:scale-95 shrink-0"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={generateNewRoom}
                  className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
                >
                  Generate New Room Code
                </button>

                <button
                  onClick={() => onStartCall('video')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-transform active:scale-95"
                >
                  <Radio className="w-4 h-4 animate-pulse text-cyan-300" />
                  <span>Launch Meeting Room Now</span>
                </button>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-2 p-3 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>All meetings are end-to-end encrypted with noise suppression & crystal-clear audio.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
