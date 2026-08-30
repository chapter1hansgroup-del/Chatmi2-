import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Radio,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Users,
  Send,
  Heart,
  Flame,
  Sparkles,
  ShieldCheck,
  Monitor,
  Volume2,
  Bot,
  MessageSquare,
  Share2,
  Award,
  Smile,
  Coins,
  Music,
  BarChart2,
  Sliders,
  CheckCircle,
  ThumbsUp,
} from 'lucide-react';
import { LiveStream, LiveStreamComment, User } from '../types';
import { soundEffects } from '../utils/audio';

interface PostlyLiveModalProps {
  currentUser: User;
  activeStream?: LiveStream | null; // If provided, viewing this stream. If null/undefined & mode='host', hosting stream.
  mode: 'host' | 'viewer';
  onClose: () => void;
  onSaveAsStory?: (caption: string) => void;
}

type StageFilter = 'studio' | 'cyberpunk' | 'warm_glow' | 'matrix';

export const PostlyLiveModal: React.FC<PostlyLiveModalProps> = ({
  currentUser,
  activeStream,
  mode,
  onClose,
  onSaveAsStory,
}) => {
  // Host state
  const [streamTitle, setStreamTitle] = useState('🚀 Postly Live: Dev Q&A & Product Demo');
  const [streamCategory, setStreamCategory] = useState('Engineering & Tech');
  const [isLiveStarted, setIsLiveStarted] = useState(mode === 'viewer');

  // Controls
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showAiCaptions, setShowAiCaptions] = useState(true);
  const [stageFilter, setStageFilter] = useState<StageFilter>('studio');
  const [showSoundboard, setShowSoundboard] = useState(false);

  // Live metrics
  const [viewerCount, setViewerCount] = useState(activeStream?.viewerCount || 42);
  const [streamDuration, setStreamDuration] = useState(0);

  // SuperChat Banner
  const [activeSuperChat, setActiveSuperChat] = useState<{
    user: string;
    coins: number;
    message: string;
  } | null>(null);

  // Live Poll State
  const [poll, setPoll] = useState<{
    question: string;
    optionA: { text: string; votes: number };
    optionB: { text: string; votes: number };
    hasVoted: boolean;
  }>({
    question: 'Should we open-source our real-time WebRTC mesh engine?',
    optionA: { text: 'Yes, Open Source! 🚀', votes: 28 },
    optionB: { text: 'Keep Proprietary 🔒', votes: 7 },
    hasVoted: false,
  });
  const [showPoll, setShowPoll] = useState(true);

  // Comments
  const [comments, setComments] = useState<LiveStreamComment[]>([
    {
      id: 'c1',
      userId: 'user_elena',
      userName: 'Elena Rostova',
      userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      text: 'Great stream quality! Audio sounds super crisp 🔥',
      timestamp: 'Just now',
    },
    {
      id: 'c2',
      userId: 'user_marcus',
      userName: 'Marcus Vance',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: 'Are we deploying port 3000 WebSocket logic live today?',
      timestamp: 'Just now',
    },
  ]);
  const [commentInput, setCommentInput] = useState('');

  // Floating Reactions
  const [reactions, setReactions] = useState<{ id: string; emoji: string; x: number }[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Local video ref
  const videoRef = useRef<HTMLVideoElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Camera preview setup
  useEffect(() => {
    if (mode === 'host' && !isVideoOff && navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          // Camera fallback gracefully handled
        });
    }
  }, [mode, isVideoOff, isLiveStarted]);

  // Live stream duration timer & viewer count simulation
  useEffect(() => {
    if (!isLiveStarted) return;

    const durationTimer = setInterval(() => {
      setStreamDuration((prev) => prev + 1);
    }, 1000);

    const viewerTimer = setInterval(() => {
      setViewerCount((prev) => Math.max(12, prev + Math.floor(Math.random() * 5) - 2));
    }, 4000);

    // Simulated incoming comments & dynamic engagement
    const commentsTimer = setInterval(() => {
      const mockUsers = [
        { name: 'Sophia Chen', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', text: 'Loved the Postly live integration! ❤️' },
        { name: 'David Miller', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', text: 'Watching from HQ! 🎉' },
        { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', text: 'The latency is phenomenal ⚡️' },
        { name: 'Pulse AI', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150', text: '✨ Live Summary: Discussion on 60FPS UI rendering and sound synthesis.' },
      ];
      const randomMsg = mockUsers[Math.floor(Math.random() * mockUsers.length)];

      const newC: LiveStreamComment = {
        id: `c_${Date.now()}`,
        userId: `user_sim_${Date.now()}`,
        userName: randomMsg.name,
        userAvatar: randomMsg.avatar,
        text: randomMsg.text,
        timestamp: 'Just now',
      };

      setComments((prev) => [...prev.slice(-15), newC]);
    }, 5500);

    return () => {
      clearInterval(durationTimer);
      clearInterval(viewerTimer);
      clearInterval(commentsTimer);
    };
  }, [isLiveStarted]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const triggerReaction = (emoji: string) => {
    const newReaction = {
      id: `react_${Date.now()}_${Math.random()}`,
      emoji,
      x: Math.floor(Math.random() * 60) + 20, // percentage from right
    };
    setReactions((prev) => [...prev, newReaction]);

    soundEffects.playSendSound();

    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 2000);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const match = commentInput.match(/\p{Extended_Pictographic}/u);
    if (match) {
      triggerReaction(match[0]);
    }

    const newC: LiveStreamComment = {
      id: `c_me_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text: commentInput,
      timestamp: 'Just now',
    };

    setComments((prev) => [...prev, newC]);
    setCommentInput('');
    setShowEmojiPicker(false);
  };

  const handleSendQuickEmojiComment = (emoji: string) => {
    triggerReaction(emoji);
    const newC: LiveStreamComment = {
      id: `c_me_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text: `${emoji} ${emoji} ${emoji}`,
      timestamp: 'Just now',
    };
    setComments((prev) => [...prev, newC]);
  };

  // Soundboard Trigger
  const triggerSoundFX = (type: 'airhorn' | 'applause' | 'levelup' | 'bassdrop') => {
    if (type === 'airhorn') soundEffects.playAirhorn();
    else if (type === 'applause') soundEffects.playApplause();
    else if (type === 'levelup') soundEffects.playLevelUp();
    else if (type === 'bassdrop') soundEffects.playBassDrop();
  };

  // Send SuperChat Tip
  const handleSendSuperChat = (coins: number) => {
    soundEffects.playLevelUp();
    soundEffects.playCashSound();
    setActiveSuperChat({
      user: currentUser.name,
      coins,
      message: `SuperChat VIP Gifting ${coins} coins to the broadcast! 🔥`,
    });

    setTimeout(() => {
      setActiveSuperChat(null);
    }, 6000);
  };

  // Vote on Poll
  const handleVote = (option: 'A' | 'B') => {
    if (poll.hasVoted) return;
    soundEffects.playClickSound();
    setPoll((prev) => ({
      ...prev,
      hasVoted: true,
      optionA: option === 'A' ? { ...prev.optionA, votes: prev.optionA.votes + 1 } : prev.optionA,
      optionB: option === 'B' ? { ...prev.optionB, votes: prev.optionB.votes + 1 } : prev.optionB,
    }));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const hostName = activeStream ? activeStream.userName : currentUser.name;
  const hostAvatar = activeStream ? activeStream.userAvatar : currentUser.avatar;
  const liveTitle = activeStream ? activeStream.title : streamTitle;

  const totalPollVotes = poll.optionA.votes + poll.optionB.votes;
  const pctA = Math.round((poll.optionA.votes / totalPollVotes) * 100) || 50;
  const pctB = 100 - pctA;

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-5xl h-[94vh] max-h-[820px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
        {/* Top Header Bar */}
        <div className="p-4 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={hostAvatar} alt={hostName} className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500" />
              <span className="absolute -bottom-1 -right-1 px-1 py-0.5 bg-rose-600 rounded text-[9px] font-black uppercase text-white tracking-wider animate-pulse">
                LIVE
              </span>
            </div>

            <div className="flex flex-col min-w-0">
              <h3 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">{liveTitle}</h3>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-200">{hostName}</span>
                <span>•</span>
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-ping" /> Postly 1080p Ultra-HD
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLiveStarted && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30">
                  <Users className="w-3.5 h-3.5" />
                  <span>{viewerCount} Viewers</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono text-xs font-bold border border-slate-700">
                  {formatDuration(streamDuration)}
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Stage Content */}
        {!isLiveStarted && mode === 'host' ? (
          /* PRE-STREAM HOST SETUP SCREEN */
          <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto">
            <div className="flex flex-col gap-6 max-w-xl mx-auto w-full">
              <div className="flex items-center gap-3 text-rose-500 font-extrabold text-xl">
                <Radio className="w-7 h-7 animate-pulse" />
                <span>Go Live on Postly Broadcast</span>
              </div>

              <div className="flex flex-col gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Live Stream Broadcast Title</label>
                  <input
                    type="text"
                    value={streamTitle}
                    onChange={(e) => setStreamTitle(e.target.value)}
                    placeholder="e.g. Postly Live: Feature Walkthrough & Q&A"
                    className="w-full bg-slate-800 text-slate-100 text-sm p-3.5 rounded-2xl border border-slate-700 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Broadcast Category</label>
                  <select
                    value={streamCategory}
                    onChange={(e) => setStreamCategory(e.target.value)}
                    className="w-full bg-slate-800 text-slate-100 text-sm p-3.5 rounded-2xl border border-slate-700 focus:outline-none focus:border-rose-500"
                  >
                    <option value="Engineering & Tech">Engineering & Tech</option>
                    <option value="Product Launch">Product Launch</option>
                    <option value="Design & UX">Design & UX</option>
                    <option value="Company All-Hands">Company All-Hands</option>
                  </select>
                </div>

                {/* Camera / Audio Toggle Previews */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-3 rounded-xl flex items-center gap-2 text-xs font-bold ${
                        isMuted ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      {isMuted ? 'Mic Off' : 'Mic Active'}
                    </button>

                    <button
                      onClick={() => setIsVideoOff(!isVideoOff)}
                      className={`p-3 rounded-xl flex items-center gap-2 text-xs font-bold ${
                        isVideoOff ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                      {isVideoOff ? 'Cam Off' : 'Cam Active'}
                    </button>
                  </div>

                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> 1080p WebRTC Ready
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsLiveStarted(true)}
              className="max-w-xl mx-auto w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-base transition-transform active:scale-95 shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2"
            >
              <Radio className="w-5 h-5 animate-ping" />
              START POSTLY LIVE STREAM
            </button>
          </div>
        ) : (
          /* ACTIVE LIVE BROADCAST SCREEN */
          <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden bg-slate-950">
            {/* Left Stream Video Canvas */}
            <div className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden">
              {mode === 'host' && !isVideoOff ? (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              ) : activeStream?.coverImage ? (
                <div className="w-full h-full relative">
                  <img src={activeStream.coverImage} alt="Stream" className="w-full h-full object-cover brightness-75" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center p-6">
                  <div className="w-28 h-28 rounded-full bg-slate-900 border-4 border-rose-500 flex items-center justify-center relative">
                    <img src={hostAvatar} alt={hostName} className="w-full h-full rounded-full object-cover" />
                    <span className="absolute -bottom-2 px-2 py-0.5 bg-rose-600 text-white font-black text-[9px] rounded-full">
                      STREAMING
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{hostName}</h2>
                  <p className="text-xs text-slate-400">{liveTitle}</p>
                </div>
              )}

              {/* SuperChat VIP Banner Notification */}
              {activeSuperChat && (
                <div className="absolute top-4 inset-x-8 z-30 flex justify-center animate-in zoom-in-95 duration-200">
                  <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 p-3 rounded-2xl text-white shadow-2xl flex items-center gap-3 border border-yellow-200/40 max-w-md w-full">
                    <div className="p-2 rounded-xl bg-black/20 shrink-0">
                      <Coins className="w-6 h-6 text-yellow-200 animate-bounce" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-yellow-100">{activeSuperChat.user}</span>
                        <span className="px-2 py-0.5 bg-black/30 rounded-full text-[10px] font-black text-amber-200">
                          {activeSuperChat.coins} Coins Tip
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-white truncate">{activeSuperChat.message}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Live Audience Poll Widget */}
              {showPoll && (
                <div className="absolute top-20 left-4 z-20 max-w-xs w-full bg-slate-950/85 backdrop-blur-md border border-indigo-500/40 rounded-2xl p-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                    <span className="text-[10px] font-bold text-indigo-300 flex items-center gap-1">
                      <BarChart2 className="w-3 h-3" /> Live Audience Poll
                    </span>
                    <button onClick={() => setShowPoll(false)} className="text-slate-400 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs font-semibold text-white mb-2 leading-tight">{poll.question}</p>

                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => handleVote('A')}
                      className={`w-full text-left p-2 rounded-xl text-xs font-bold transition-all relative overflow-hidden ${
                        poll.hasVoted ? 'bg-slate-800 text-white' : 'bg-indigo-600/30 hover:bg-indigo-600 text-white'
                      }`}
                    >
                      <div
                        style={{ width: `${pctA}%` }}
                        className="absolute inset-y-0 left-0 bg-indigo-600/40 pointer-events-none rounded-xl"
                      />
                      <div className="relative z-10 flex justify-between">
                        <span>{poll.optionA.text}</span>
                        <span>{pctA}%</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleVote('B')}
                      className={`w-full text-left p-2 rounded-xl text-xs font-bold transition-all relative overflow-hidden ${
                        poll.hasVoted ? 'bg-slate-800 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      <div
                        style={{ width: `${pctB}%` }}
                        className="absolute inset-y-0 left-0 bg-rose-600/40 pointer-events-none rounded-xl"
                      />
                      <div className="relative z-10 flex justify-between">
                        <span>{poll.optionB.text}</span>
                        <span>{pctB}%</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* AI Live Captions Overlay */}
              {showAiCaptions && (
                <div className="absolute bottom-20 inset-x-6 z-20 flex items-center justify-center pointer-events-none">
                  <div className="bg-slate-950/85 backdrop-blur-md border border-purple-500/40 px-4 py-2 rounded-2xl text-xs text-purple-200 font-medium flex items-center gap-2 shadow-xl max-w-lg text-center">
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0 animate-pulse" />
                    <span>
                      AI Live Transcribe: "Broadcasting with sub-50ms latency across all connected peers on port 3000..."
                    </span>
                  </div>
                </div>
              )}

              {/* Floating Reaction Emojis Animation */}
              <div className="absolute right-6 bottom-24 z-20 pointer-events-none h-64 w-32 overflow-hidden">
                {reactions.map((r) => (
                  <div
                    key={r.id}
                    style={{ left: `${r.x}%` }}
                    className="absolute bottom-0 text-3xl animate-bounce transition-all duration-1000 opacity-90 scale-125"
                  >
                    {r.emoji}
                  </div>
                ))}
              </div>

              {/* Host / Viewer Control Bar Overlay (Bottom Left/Center of Video) */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between bg-slate-900/85 backdrop-blur border border-slate-800 p-2.5 rounded-2xl">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-2.5 rounded-xl ${
                      isMuted ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-2.5 rounded-xl ${
                      isVideoOff ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                    title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
                  >
                    {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setShowAiCaptions(!showAiCaptions)}
                    className={`p-2.5 rounded-xl flex items-center gap-1 text-xs font-bold ${
                      showAiCaptions ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                    title="Toggle Live AI Captions"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>

                  {/* Soundboard Button */}
                  <button
                    onClick={() => setShowSoundboard(!showSoundboard)}
                    className={`p-2.5 rounded-xl flex items-center gap-1 text-xs font-bold ${
                      showSoundboard ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                    title="Live Audio Soundboard"
                  >
                    <Music className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* SuperChat Gifting Buttons for Viewers */}
                  <div className="hidden sm:flex items-center gap-1">
                    <button
                      onClick={() => handleSendSuperChat(100)}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <Coins className="w-3.5 h-3.5" /> 100 Tip
                    </button>
                  </div>

                  {mode === 'host' && (
                    <button
                      onClick={() => {
                        if (onSaveAsStory) onSaveAsStory(liveTitle);
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg"
                    >
                      End Stream
                    </button>
                  )}
                </div>
              </div>

              {/* Soundboard Popover */}
              {showSoundboard && (
                <div className="absolute bottom-20 left-4 z-30 bg-slate-900 border border-amber-500/40 p-3 rounded-2xl shadow-2xl flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-amber-300 uppercase">Live Soundboard</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => triggerSoundFX('airhorn')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold text-slate-200 transition-all text-left"
                    >
                      🎺 Airhorn
                    </button>
                    <button
                      onClick={() => triggerSoundFX('applause')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold text-slate-200 transition-all text-left"
                    >
                      👏 Applause
                    </button>
                    <button
                      onClick={() => triggerSoundFX('levelup')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold text-slate-200 transition-all text-left"
                    >
                      🎮 Level Up
                    </button>
                    <button
                      onClick={() => triggerSoundFX('bassdrop')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold text-slate-200 transition-all text-left"
                    >
                      🥁 Bass Drop
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side Live Comments Feed & Reactions Bar */}
            <div className="w-full md:w-80 h-72 md:h-full bg-slate-900/90 border-l border-slate-800/80 flex flex-col justify-between z-20">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-rose-400" /> Live Chat Feed
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Real-time</span>
              </div>

              {/* Comments Scroll View */}
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
                {comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-2 bg-slate-950/50 p-2 rounded-xl border border-slate-800/60">
                    <img src={c.userAvatar} alt={c.userName} className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-bold text-rose-300 truncate">{c.userName}</span>
                      <p className="text-xs text-slate-200 leading-snug break-words">{c.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={commentsEndRef} />
              </div>

              {/* Reaction Buttons + Comment Bar */}
              <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Emoji Reactions:</span>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
                  >
                    <Smile className="w-3 h-3" />
                    {showEmojiPicker ? 'Close' : 'More'}
                  </button>
                </div>

                <div className="flex items-center justify-around py-1 bg-slate-900 rounded-xl border border-slate-800">
                  {['❤️', '🔥', '👏', '🚀', '💡', '💯', '🤩', '🎉'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleSendQuickEmojiComment(emoji)}
                      className="text-base hover:scale-125 transition-transform p-1"
                      title={`Post ${emoji} comment`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Emoji Picker Drawer */}
                {showEmojiPicker && (
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 grid grid-cols-6 gap-1 max-h-28 overflow-y-auto">
                    {['🔥', '❤️', '💖', '👏', '😂', '💯', '🚀', '🤩', '🎉', '💡', '🙌', '🥳', '👍', '✨', '💥', '🎯', '😍', '😎'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setCommentInput((prev) => prev + emoji);
                          triggerReaction(emoji);
                        }}
                        className="text-base p-1 hover:bg-slate-800 rounded-lg hover:scale-110 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* Comment Input */}
                <form onSubmit={handleSendComment} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Comment on Postly live..."
                      className="w-full bg-slate-800 text-slate-100 text-xs pl-3 pr-7 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-rose-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-400"
                    >
                      <Smile className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-transform active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
