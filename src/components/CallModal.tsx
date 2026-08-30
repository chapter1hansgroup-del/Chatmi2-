import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Monitor,
  Volume2,
  VolumeX,
  Volume1,
  ShieldCheck,
  Bot,
  Hand,
  Camera,
  RotateCw,
  Maximize2,
  Minimize2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  MessageSquare,
  Smile,
  Sun,
  Moon,
  Wand2,
  Sliders,
  Settings,
  ChevronDown,
  X,
  Send,
  Headphones,
  Radio,
  Share2,
  Layers,
  Subtitles,
  Pin,
  Check,
} from 'lucide-react';
import { ActiveCall, User } from '../types';
import { soundEffects, formatDuration } from '../utils/audio';
import { SignLanguageTranslator } from './SignLanguageTranslator';
import { MOCK_USERS } from '../data/mockData';

interface FloatingReaction {
  id: string;
  emoji: string;
  left: number; // percentage 10% to 90%
}

interface InCallMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  time: string;
  isMe: boolean;
}

interface CallModalProps {
  activeCall: ActiveCall;
  currentUser?: User;
  onEndCall: () => void;
  onSendMessage?: (text: string) => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  activeCall,
  currentUser,
  onEndCall,
  onSendMessage,
}) => {
  // Core call states
  const [isMuted, setIsMuted] = useState(activeCall.isMuted);
  const [isVideoOff, setIsVideoOff] = useState(activeCall.isVideoOff);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  // Video & camera controls
  const [cameraStatus, setCameraStatus] = useState<'requesting' | 'active' | 'denied' | 'fallback'>('requesting');
  const [cameraErrorMsg, setCameraErrorMsg] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isSwappedPiP, setIsSwappedPiP] = useState(false); // Tap PiP to swap local & remote feeds
  const [viewLayout, setViewLayout] = useState<'pip' | 'grid' | 'focus'>('pip');

  // WhatsApp Effects & Filters Drawer
  const [showEffectsDrawer, setShowEffectsDrawer] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'normal' | 'warm' | 'cool' | 'vintage' | 'bw' | 'cyber' | 'studio'>('normal');
  const [activeBackground, setActiveBackground] = useState<'none' | 'blur-soft' | 'blur-heavy' | 'office' | 'beach' | 'cafe' | 'cyber' | 'stars'>('none');
  const [isLowLightMode, setIsLowLightMode] = useState(false);
  const [isTouchUpEnabled, setIsTouchUpEnabled] = useState(false);

  // Audio output device selector
  const [showAudioDrawer, setShowAudioDrawer] = useState(false);
  const [audioRoute, setAudioRoute] = useState<'speaker' | 'earpiece' | 'bluetooth'>('speaker');
  const [isNoiseSuppression, setIsNoiseSuppression] = useState(true);

  // Add participants / Group calling
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [callParticipants, setCallParticipants] = useState<User[]>([
    {
      id: 'partner_initial',
      name: activeCall.chatName,
      avatar: activeCall.chatAvatar,
      status: 'online',
    },
  ]);
  const [participantSearch, setParticipantSearch] = useState('');

  // In-Call Chat Drawer
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [inCallText, setInCallText] = useState('');
  const [inCallMessages, setInCallMessages] = useState<InCallMessage[]>([
    {
      id: 'msg_1',
      senderName: activeCall.chatName,
      senderAvatar: activeCall.chatAvatar,
      text: 'Hey! Glad you could connect. Can you hear and see me well?',
      time: 'Just now',
      isMe: false,
    },
  ]);

  // Live Floating Reactions
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);

  // Live Captions & AI Subtitles
  const [showLiveCaptions, setShowLiveCaptions] = useState(false);
  const [currentCaption, setCurrentCaption] = useState<string>('Live Audio Encrypted • ChatMi HD Codec Active');

  // Accessibility & Sign Language AI
  const [isSignTranslatorOpen, setIsSignTranslatorOpen] = useState(false);

  // Network quality & audio metering
  const [audioLevel, setAudioLevel] = useState(65);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Audio level simulator
  useEffect(() => {
    if (isMuted) {
      setAudioLevel(0);
      return;
    }
    const interval = setInterval(() => {
      setAudioLevel(Math.floor(25 + Math.random() * 70));
    }, 400);
    return () => clearInterval(interval);
  }, [isMuted]);

  // Live Caption Generator simulator when enabled
  useEffect(() => {
    if (!showLiveCaptions) return;
    const captionsPool = [
      `${activeCall.chatName}: Let's review the updated milestone deliverables.`,
      `${activeCall.chatName}: The high-resolution video stream is super crisp!`,
      `${activeCall.chatName}: I'm sharing the updated prototype slides now.`,
      `${activeCall.chatName}: Everything looks fantastic on our end.`,
    ];
    let idx = 0;
    const interval = setInterval(() => {
      setCurrentCaption(captionsPool[idx % captionsPool.length]);
      idx++;
    }, 4000);
    return () => clearInterval(interval);
  }, [showLiveCaptions, activeCall.chatName]);

  // Stop camera tracks cleanly
  const stopTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
  };

  // Robust Webcam Initialization
  const startCamera = async () => {
    if (isVideoOff || activeCall.type !== 'video') {
      stopTracks();
      setCameraStatus('fallback');
      return;
    }

    setCameraStatus('requesting');
    setCameraErrorMsg(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraStatus('fallback');
      setCameraErrorMsg('Webcam is not supported in this browser environment. Showing profile avatar.');
      return;
    }

    try {
      stopTracks();
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      streamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.onloadedmetadata = () => {
          localVideoRef.current?.play().catch((e) => console.warn('Video play error:', e));
        };
      }

      setCameraStatus('active');
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraStatus('denied');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraErrorMsg('Camera access was blocked. Enable camera permissions in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraErrorMsg('No camera hardware found on this device.');
      } else {
        setCameraErrorMsg('Camera unavailable. Showing avatar fallback.');
      }
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopTracks();
    };
  }, [activeCall.type, isVideoOff, facingMode]);

  useEffect(() => {
    if (streamRef.current && localVideoRef.current && localVideoRef.current.srcObject !== streamRef.current) {
      localVideoRef.current.srcObject = streamRef.current;
      localVideoRef.current.play().catch(() => {});
    }
  }, [viewLayout, isVideoOff, cameraStatus, isSwappedPiP]);

  // Flip Camera
  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    soundEffects.playTapSound();
  };

  // Spawn Live Emoji Reaction
  const handleTriggerReaction = (emoji: string) => {
    const newId = `reaction_${Date.now()}_${Math.random()}`;
    const left = Math.floor(15 + Math.random() * 70);
    setFloatingReactions((prev) => [...prev, { id: newId, emoji, left }]);
    soundEffects.playClickSound();

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== newId));
    }, 2800);
  };

  // Send In-Call Message
  const handleSendInCallMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inCallText.trim()) return;

    const newMsg: InCallMessage = {
      id: `incall_${Date.now()}`,
      senderName: currentUser?.name || 'You',
      senderAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      text: inCallText.trim(),
      time: 'Just now',
      isMe: true,
    };

    setInCallMessages((prev) => [...prev, newMsg]);
    if (onSendMessage) {
      onSendMessage(inCallText.trim());
    }
    soundEffects.playSendSound();
    setInCallText('');
  };

  // Add Participant to Group Call
  const handleAddParticipant = (user: User) => {
    if (callParticipants.some((p) => p.id === user.id)) return;
    setCallParticipants((prev) => [...prev, user]);
    setShowAddParticipantModal(false);
    setViewLayout('grid');
    soundEffects.playCelebrationChime();
  };

  // Remove participant
  const handleRemoveParticipant = (userId: string) => {
    setCallParticipants((prev) => prev.filter((p) => p.id !== userId));
    soundEffects.playTapSound();
  };

  // Filter styles generator
  const getFilterStyle = () => {
    let filters: string[] = [];
    if (isLowLightMode) filters.push('brightness(1.35) contrast(1.1) saturate(1.15)');
    if (isTouchUpEnabled) filters.push('contrast(0.95) saturate(1.08)');

    switch (activeFilter) {
      case 'warm':
        filters.push('sepia(0.25) saturate(1.2) hue-rotate(-10deg)');
        break;
      case 'cool':
        filters.push('hue-rotate(15deg) saturate(1.1) brightness(1.05)');
        break;
      case 'vintage':
        filters.push('sepia(0.5) contrast(1.2) brightness(0.9)');
        break;
      case 'bw':
        filters.push('grayscale(1) contrast(1.3)');
        break;
      case 'cyber':
        filters.push('hue-rotate(180deg) saturate(1.8) contrast(1.2)');
        break;
      case 'studio':
        filters.push('brightness(1.2) contrast(1.15) saturate(1.1)');
        break;
      default:
        break;
    }
    return filters.join(' ');
  };

  // Background style generator
  const getBackgroundStyle = () => {
    switch (activeBackground) {
      case 'blur-soft':
        return 'backdrop-blur-md bg-slate-900/60';
      case 'blur-heavy':
        return 'backdrop-blur-2xl bg-slate-950/80';
      case 'beach':
        return "bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80')] bg-cover bg-center";
      case 'office':
        return "bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80')] bg-cover bg-center";
      case 'cafe':
        return "bg-[url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80')] bg-cover bg-center";
      case 'cyber':
        return "bg-[url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80')] bg-cover bg-center";
      case 'stars':
        return "bg-[url('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80')] bg-cover bg-center";
      default:
        return 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900';
    }
  };

  const myName = currentUser?.name || 'You';
  const myAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';
  const isAiCall = activeCall.chatName.includes('AI') || activeCall.chatName.includes('Alpha');

  /* ========================================================
     1. MINIMIZED FLOATING WHATSAPP PIP BUBBLE
     ======================================================== */
  if (isMinimized) {
    return (
      <div className="fixed bottom-20 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div
          onClick={() => {
            setIsMinimized(false);
            soundEffects.playTapSound();
          }}
          className="relative w-56 h-36 sm:w-64 sm:h-40 rounded-2xl bg-slate-900/95 border-2 border-emerald-500/80 shadow-2xl overflow-hidden cursor-pointer group flex flex-col justify-between p-2.5 backdrop-blur-xl"
        >
          {/* Live mini video / avatar */}
          <div className="absolute inset-0 z-0 flex items-center justify-center bg-slate-950">
            {activeCall.type === 'video' && !isVideoOff && cameraStatus === 'active' ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{ filter: getFilterStyle() }}
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <img
                src={activeCall.chatAvatar}
                alt={activeCall.chatName}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-400/80 shadow-lg"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/60" />
          </div>

          {/* Top Bar inside mini PiP */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-slate-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {formatDuration(callDuration)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
              }}
              className="p-1 rounded-lg bg-slate-900/80 text-white hover:bg-slate-800"
              title="Expand Video Call"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom Bar inside mini PiP */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white truncate max-w-[100px]">{activeCall.chatName}</span>
              <span className="text-[9px] text-emerald-400 font-semibold">Tap to expand</span>
            </div>

            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1.5 rounded-full text-white ${isMuted ? 'bg-rose-600' : 'bg-slate-800/90'}`}
              >
                {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  stopTracks();
                  onEndCall();
                }}
                className="p-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-md"
              >
                <PhoneOff className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ========================================================
     2. FULL-SCREEN WHATSAPP VIDEO CALL INTERFACE
     ======================================================== */
  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col justify-between select-none overflow-hidden animate-in fade-in duration-300">
      {/* Floating Animated Reaction Particles */}
      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
        {floatingReactions.map((r) => (
          <div
            key={r.id}
            style={{ left: `${r.left}%` }}
            className="absolute bottom-24 text-3xl sm:text-4xl animate-float-reaction"
          >
            {r.emoji}
          </div>
        ))}
      </div>

      {/* WHATSAPP TOP STATUS HEADER */}
      <div className="relative z-30 flex items-center justify-between p-3 sm:p-5 bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent">
        {/* Left: Minimize & Contact Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsMinimized(true);
              soundEffects.playTapSound();
            }}
            className="p-2 sm:p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 backdrop-blur-md transition-transform active:scale-95 shadow-md"
            title="Minimize Call to Floating PiP"
          >
            <ChevronDown className="w-5 h-5 text-slate-200" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={activeCall.chatAvatar}
                alt={activeCall.chatName}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-emerald-500/80 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  {activeCall.chatName}
                  {callParticipants.length > 1 && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                      +{callParticipants.length - 1}
                    </span>
                  )}
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{formatDuration(callDuration)}</span>
                <span className="text-slate-500">•</span>
                <span className="text-[11px] text-slate-300">HD 60fps</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: E2EE Lock Banner */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-inner">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>End-to-end encrypted</span>
        </div>

        {/* Right: Signal, Sign AI & Add Participants (+) */}
        <div className="flex items-center gap-2">
          {/* Sign Language AI Prominent Accessibility Button in Top Header */}
          <button
            onClick={() => {
              setIsSignTranslatorOpen(!isSignTranslatorOpen);
              soundEffects.playTapSound();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-md active:scale-95 ${
              isSignTranslatorOpen
                ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-cyan-500/40 ring-2 ring-cyan-400/50'
                : 'bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 border-cyan-500/50 hover:border-cyan-400'
            }`}
            title="Toggle Sign Language AI (ASL gesture-to-speech & speech-to-sign)"
          >
            <Hand className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span className="font-bold">Sign AI</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isSignTranslatorOpen ? 'bg-slate-950' : 'bg-cyan-400 animate-ping'
              }`}
            />
          </button>

          {/* Signal Indicator */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-semibold text-emerald-400">
            <span className="flex items-end gap-0.5 h-3">
              <span className="w-1 h-1.5 bg-emerald-400 rounded-sm" />
              <span className="w-1 h-2.5 bg-emerald-400 rounded-sm" />
              <span className="w-1 h-3 bg-emerald-400 rounded-sm" />
              <span className="w-1 h-3.5 bg-emerald-400 rounded-sm" />
            </span>
            <span className="text-[10px] text-slate-300 ml-1">4.8 Mbps</span>
          </div>

          {/* Add Participant Button (Group Call) */}
          <button
            onClick={() => {
              setShowAddParticipantModal(true);
              soundEffects.playTapSound();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-transform active:scale-95"
            title="Add contact to group video call"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>

          {/* In-Call Chat Badge */}
          <button
            onClick={() => {
              setShowChatDrawer(!showChatDrawer);
              soundEffects.playTapSound();
            }}
            className={`p-2 sm:p-2.5 rounded-full border transition-all relative ${
              showChatDrawer
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
            title="Open in-call chat"
          >
            <MessageSquare className="w-4 h-4" />
            {inCallMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-md">
                {inCallMessages.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MAIN VIDEO STAGE */}
      <div className="flex-1 relative w-full h-full flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        {/* Active Screen Sharing View */}
        {isScreenSharing ? (
          <div className="w-full h-full rounded-3xl bg-slate-900 border-2 border-cyan-500/50 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl p-6">
            <div className="absolute top-4 left-4 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>You are sharing your screen with {activeCall.chatName}</span>
            </div>

            <div className="flex flex-col items-center gap-4 text-center max-w-md">
              <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner animate-pulse">
                <Monitor className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white">Live Presentation Stream Active</h3>
              <p className="text-xs text-slate-400">
                Your screen content, applet window, and live code changes are being transmitted in full 1080p 60fps E2EE video.
              </p>
              <button
                onClick={() => setIsScreenSharing(false)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95"
              >
                Stop Sharing Screen
              </button>
            </div>
          </div>
        ) : callParticipants.length > 1 || viewLayout === 'grid' ? (
          /* GROUP VIDEO CALL GRID (WhatsApp Multi-person layout) */
          <div className={`w-full h-full grid gap-3 p-2 ${callParticipants.length >= 3 ? 'grid-cols-2 grid-rows-2' : 'grid-cols-1 md:grid-cols-2'}`}>
            {/* Local User Tile */}
            <div className="relative rounded-2xl bg-slate-900 border-2 border-indigo-500/50 overflow-hidden flex items-center justify-center shadow-xl group">
              {cameraStatus === 'active' && !isVideoOff ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ filter: getFilterStyle() }}
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-center p-4">
                  <img src={myAvatar} alt={myName} className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-500 shadow-2xl" />
                  <span className="text-sm font-bold text-white">{myName} (You)</span>
                  <span className="text-xs text-slate-400">Camera Off</span>
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-xs font-semibold text-white flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${cameraStatus === 'active' && !isVideoOff ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span>{myName} (You)</span>
              </div>
              <button
                onClick={toggleCameraFacing}
                className="absolute top-3 right-3 p-2 bg-slate-950/80 rounded-xl text-slate-300 hover:text-white border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Remote Participants */}
            {callParticipants.map((p) => (
              <div key={p.id} className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center shadow-xl group">
                <img src={p.avatar} alt={p.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-500/60 shadow-2xl mb-2" />
                <h4 className="text-base font-bold text-white">{p.name}</h4>
                <span className="text-xs text-emerald-400">HD Video Connected</span>
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-xs font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{p.name}</span>
                </div>
                {p.id !== 'partner_initial' && (
                  <button
                    onClick={() => handleRemoveParticipant(p.id)}
                    className="absolute top-3 right-3 p-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove from call"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* STANDARD 1-ON-1 WHATSAPP VIDEO STAGE WITH SWITCHABLE PIP */
          <div className={`w-full h-full rounded-3xl overflow-hidden relative flex items-center justify-center ${getBackgroundStyle()} border border-slate-800 shadow-2xl`}>
            {/* MAIN BACKGROUND FEED (Remote User or Swapped Local) */}
            {!isSwappedPiP ? (
              /* Main: Remote Partner */
              <div className="flex flex-col items-center gap-4 z-10 animate-in fade-in zoom-in-95 duration-200">
                <div className="relative">
                  <div className="absolute -inset-6 bg-emerald-500/20 rounded-full blur-2xl animate-pulse" />
                  <img
                    src={activeCall.chatAvatar}
                    alt={activeCall.chatName}
                    className="w-32 sm:w-44 h-32 sm:h-44 rounded-full object-cover ring-4 ring-emerald-500/80 shadow-2xl relative z-10"
                  />
                  {isAiCall && (
                    <span className="absolute bottom-1 right-1 p-2.5 bg-purple-600 text-white rounded-full ring-4 ring-slate-950 z-20 shadow-lg">
                      <Bot className="w-6 h-6" />
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{activeCall.chatName}</h3>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-xs sm:text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      1080p HD Video • Stereo Voice
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Main: Local Webcam (Swapped) */
              <div className="w-full h-full relative flex items-center justify-center bg-slate-950">
                {cameraStatus === 'active' && !isVideoOff ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ filter: getFilterStyle() }}
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <img src={myAvatar} alt={myName} className="w-28 h-28 rounded-full object-cover ring-4 ring-indigo-500 shadow-2xl" />
                    <span className="text-lg font-bold text-white">{myName} (Your Camera)</span>
                  </div>
                )}
              </div>
            )}

            {/* FLOATING CORNER PIP WINDOW (Tap to swap!) */}
            <div
              onClick={() => {
                setIsSwappedPiP(!isSwappedPiP);
                soundEffects.playTapSound();
              }}
              className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-36 h-48 sm:w-48 sm:h-64 rounded-2xl bg-slate-950 border-2 border-emerald-500/70 overflow-hidden shadow-2xl z-20 cursor-pointer group hover:scale-105 transition-all flex items-center justify-center"
              title="Tap to swap main and mini video"
            >
              {!isSwappedPiP ? (
                /* Mini: Local Webcam */
                cameraStatus === 'active' && !isVideoOff ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ filter: getFilterStyle() }}
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 p-2 text-center">
                    <img src={myAvatar} alt={myName} className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500" />
                    <span className="text-[11px] font-bold text-white">{myName}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startCamera();
                      }}
                      className="text-[9px] px-2 py-0.5 bg-indigo-600 rounded-md text-white font-semibold"
                    >
                      Start Cam
                    </button>
                  </div>
                )
              ) : (
                /* Mini: Remote Partner */
                <div className="flex flex-col items-center gap-1.5 p-2 text-center">
                  <img src={activeCall.chatAvatar} alt={activeCall.chatName} className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500" />
                  <span className="text-[11px] font-bold text-white truncate max-w-[100px]">{activeCall.chatName}</span>
                </div>
              )}

              {/* Tag overlay */}
              <div className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1 border border-slate-800">
                <span>{!isSwappedPiP ? `${myName} (You)` : activeCall.chatName}</span>
              </div>

              {/* Hover flip button */}
              {!isSwappedPiP && cameraStatus === 'active' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCameraFacing();
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-slate-900/80 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity border border-slate-700"
                  title="Flip Camera (Front/Back)"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* LIVE SUBTITLES & CAPTIONS BANNER */}
            {showLiveCaptions && (
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 max-w-sm sm:max-w-md bg-slate-950/90 backdrop-blur-xl border border-emerald-500/40 rounded-2xl p-3 shadow-2xl z-20 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Subtitles className="w-3.5 h-3.5" />
                    <span>Real-Time Captions (Speech-to-Text)</span>
                  </span>
                  <button onClick={() => setShowLiveCaptions(false)} className="text-slate-400 hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-slate-100 font-medium">{currentCaption}</p>
              </div>
            )}
          </div>
        )}

        {/* QUICK DISCOVERY FLOATING BADGE FOR SIGN LANGUAGE AI */}
        {!isSignTranslatorOpen && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto animate-in fade-in slide-in-from-top-3 duration-300">
            <button
              onClick={() => {
                setIsSignTranslatorOpen(true);
                soundEffects.playTapSound();
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-850 text-cyan-300 border border-cyan-500/50 shadow-xl backdrop-blur-md transition-all hover:scale-105 group text-xs font-semibold"
              title="Open Sign Language AI Real-Time Translator"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <Hand className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Sign Language AI (ASL) Converter</span>
              <span className="bg-cyan-500/20 text-cyan-200 text-[10px] px-1.5 py-0.5 rounded-full border border-cyan-400/30 font-bold">
                Tap to Open
              </span>
            </button>
          </div>
        )}

        {/* SIGN LANGUAGE AI TRANSLATOR HUD (Top-level Overlay) */}
        {isSignTranslatorOpen && (
          <SignLanguageTranslator
            isOpen={isSignTranslatorOpen}
            onClose={() => setIsSignTranslatorOpen(false)}
            localVideoRef={localVideoRef}
            partnerName={activeCall.chatName}
            partnerAvatar={activeCall.chatAvatar}
            onSendToChat={onSendMessage}
          />
        )}

        {/* IN-CALL CHAT DRAWER (Slide-over) */}
        {showChatDrawer && (
          <div className="absolute top-0 right-0 bottom-0 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-2xl border-l border-slate-800 shadow-2xl z-40 flex flex-col justify-between animate-in slide-in-from-right duration-200">
            {/* Chat Drawer Header */}
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">In-Call Messages</h3>
              </div>
              <button onClick={() => setShowChatDrawer(false)} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {inCallMessages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold text-slate-400">{m.senderName}</span>
                    <span className="text-[9px] text-slate-500">{m.time}</span>
                  </div>
                  <div className={`px-3 py-2 rounded-2xl text-xs max-w-[85%] font-medium ${m.isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-100 rounded-bl-none'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Field */}
            <form onSubmit={handleSendInCallMessage} className="p-3 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={inCallText}
                onChange={(e) => setInCallText(e.target.value)}
                placeholder="Send a message to call..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!inCallText.trim()}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* WHATSAPP FLOATING EMOJI REACTIONS BAR */}
      <div className="relative z-30 flex items-center justify-center gap-1.5 sm:gap-3 py-1.5 px-3 bg-slate-950/80 backdrop-blur-md border-t border-slate-900 max-w-lg mx-auto rounded-full my-1">
        {['❤️', '👍', '😂', '😮', '😢', '🙏', '🎉', '🔥', '🚀'].map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleTriggerReaction(emoji)}
            className="text-lg sm:text-2xl hover:scale-125 transition-transform active:scale-95 p-1"
            title={`React with ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* WHATSAPP SIGNATURE BOTTOM CONTROL DOCK */}
      <div className="relative z-30 flex items-center justify-center gap-2 sm:gap-3.5 p-3 sm:p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
        {/* Flip Camera */}
        {activeCall.type === 'video' && !isVideoOff && (
          <button
            onClick={toggleCameraFacing}
            className="p-3 sm:p-3.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 shadow-lg transition-transform active:scale-95"
            title="Flip camera (Front/Rear)"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        )}

        {/* Video On/Off */}
        <button
          onClick={() => {
            const next = !isVideoOff;
            setIsVideoOff(next);
            if (!next) startCamera();
            else stopTracks();
            soundEffects.playTapSound();
          }}
          className={`p-3 sm:p-3.5 rounded-full border transition-transform active:scale-95 shadow-lg ${
            isVideoOff
              ? 'bg-rose-600 text-white border-rose-500 shadow-rose-600/30'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-800'
          }`}
          title={isVideoOff ? 'Turn on video' : 'Turn off video'}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </button>

        {/* Microphone Mute/Unmute */}
        <button
          onClick={() => {
            setIsMuted(!isMuted);
            soundEffects.playTapSound();
          }}
          className={`p-3 sm:p-3.5 rounded-full border transition-transform active:scale-95 shadow-lg ${
            isMuted
              ? 'bg-rose-600 text-white border-rose-500 shadow-rose-600/30'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-800'
          }`}
          title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* WhatsApp Effects & Filters Drawer Trigger */}
        <button
          onClick={() => {
            setShowEffectsDrawer(!showEffectsDrawer);
            setShowAudioDrawer(false);
            soundEffects.playTapSound();
          }}
          className={`p-3 sm:p-3.5 rounded-full border transition-transform active:scale-95 shadow-lg ${
            showEffectsDrawer || activeFilter !== 'normal' || activeBackground !== 'none' || isLowLightMode
              ? 'bg-gradient-to-tr from-amber-500 to-rose-500 text-white border-amber-400'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-800'
          }`}
          title="ChatMi Filters, Backgrounds & Low-Light Mode"
        >
          <Sparkles className="w-5 h-5" />
        </button>

        {/* Screen Share */}
        <button
          onClick={() => {
            setIsScreenSharing(!isScreenSharing);
            soundEffects.playTapSound();
          }}
          className={`p-3 sm:p-3.5 rounded-full border transition-transform active:scale-95 shadow-lg ${
            isScreenSharing
              ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-cyan-500/30'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-800'
          }`}
          title="Share Screen"
        >
          <Monitor className="w-5 h-5" />
        </button>

        {/* Audio Route Selector (Speaker / Bluetooth) */}
        <button
          onClick={() => {
            setShowAudioDrawer(!showAudioDrawer);
            setShowEffectsDrawer(false);
            soundEffects.playTapSound();
          }}
          className={`p-3 sm:p-3.5 rounded-full border transition-transform active:scale-95 shadow-lg ${
            showAudioDrawer
              ? 'bg-indigo-600 text-white border-indigo-500'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-800'
          }`}
          title="Audio output settings"
        >
          {audioRoute === 'speaker' ? (
            <Volume2 className="w-5 h-5" />
          ) : audioRoute === 'bluetooth' ? (
            <Headphones className="w-5 h-5" />
          ) : (
            <Volume1 className="w-5 h-5" />
          )}
        </button>

        {/* Live Captions Toggle */}
        <button
          onClick={() => {
            setShowLiveCaptions(!showLiveCaptions);
            soundEffects.playTapSound();
          }}
          className={`hidden sm:flex p-3 sm:p-3.5 rounded-full border transition-transform active:scale-95 shadow-lg ${
            showLiveCaptions
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-800'
          }`}
          title="Live Automated Captions (Speech-to-Text)"
        >
          <Subtitles className="w-5 h-5" />
        </button>

        {/* Sign Language AI Accessibility */}
        <button
          onClick={() => {
            setIsSignTranslatorOpen(!isSignTranslatorOpen);
            soundEffects.playTapSound();
          }}
          className={`flex p-3 sm:p-3.5 rounded-full border transition-transform active:scale-95 shadow-lg relative ${
            isSignTranslatorOpen
              ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-cyan-500/50 ring-2 ring-cyan-400'
              : 'bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 border-cyan-500/50 hover:border-cyan-400'
          }`}
          title="Sign Language AI (ASL) Hand Gesture & Speech Translator"
        >
          <Hand className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 text-[8px] bg-cyan-400 text-slate-950 font-black px-1 rounded-full uppercase tracking-tighter shadow">
            ASL
          </span>
        </button>

        {/* WhatsApp Big Red End Call Button */}
        <button
          onClick={() => {
            stopTracks();
            onEndCall();
          }}
          className="p-3.5 sm:p-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/40 transition-transform active:scale-90 ml-1 sm:ml-3"
          title="End ChatMi Video Call"
        >
          <PhoneOff className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>

      {/* ========================================================
          3. WHATSAPP EFFECTS, FILTERS & BACKGROUNDS DRAWER
          ======================================================== */}
      {showEffectsDrawer && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-xl bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl z-40 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-white">ChatMi Video Effects & Accessibility</h4>
            </div>
            <button onClick={() => setShowEffectsDrawer(false)} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 pt-3 max-h-72 overflow-y-auto pr-1">
            {/* Quick Enhancers: Low Light, Touch Up & Sign AI */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => {
                  setIsSignTranslatorOpen(!isSignTranslatorOpen);
                  soundEffects.playTapSound();
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  isSignTranslatorOpen
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Hand className="w-4 h-4 text-cyan-400" />
                  <span>Sign AI (ASL)</span>
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSignTranslatorOpen ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'
                  }`}
                />
              </button>

              <button
                onClick={() => {
                  setIsLowLightMode(!isLowLightMode);
                  soundEffects.playTapSound();
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  isLowLightMode
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-amber-400" />
                  <span>Low-Light Boost</span>
                </span>
                <span className={`w-2 h-2 rounded-full ${isLowLightMode ? 'bg-amber-400' : 'bg-slate-600'}`} />
              </button>

              <button
                onClick={() => {
                  setIsTouchUpEnabled(!isTouchUpEnabled);
                  soundEffects.playTapSound();
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  isTouchUpEnabled
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Wand2 className="w-4 h-4 text-rose-400" />
                  <span>Touch-Up</span>
                </span>
                <span className={`w-2 h-2 rounded-full ${isTouchUpEnabled ? 'bg-rose-400' : 'bg-slate-600'}`} />
              </button>
            </div>

            {/* Virtual Backgrounds */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Virtual Backgrounds & Blur
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'none', label: 'None' },
                  { id: 'blur-soft', label: 'Soft Blur' },
                  { id: 'blur-heavy', label: 'Studio Blur' },
                  { id: 'beach', label: 'Beach 🌴' },
                  { id: 'office', label: 'Modern Office' },
                  { id: 'cafe', label: 'Artisan Cafe' },
                  { id: 'cyber', label: 'Cyber Neon' },
                  { id: 'stars', label: 'Cosmos ✨' },
                ].map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => {
                      setActiveBackground(bg.id as any);
                      soundEffects.playTapSound();
                    }}
                    className={`px-2 py-1.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                      activeBackground === bg.id
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                        : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Real-time Color Filters */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Color Filters
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'normal', label: 'Normal' },
                  { id: 'warm', label: 'Warm Glow' },
                  { id: 'cool', label: 'Cool Mist' },
                  { id: 'vintage', label: 'Vintage' },
                  { id: 'bw', label: 'B&W Noir' },
                  { id: 'cyber', label: 'Cyberpunk' },
                  { id: 'studio', label: 'Ring Light' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setActiveFilter(f.id as any);
                      soundEffects.playTapSound();
                    }}
                    className={`px-2 py-1.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                      activeFilter === f.id
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          4. AUDIO ROUTE / SPEAKER SETTINGS DRAWER
          ======================================================== */}
      {showAudioDrawer && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-sm bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl p-4 shadow-2xl z-40 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-bold text-white">Audio Device & Output</h4>
            </div>
            <button onClick={() => setShowAudioDrawer(false)} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5 pt-3">
            {[
              { id: 'speaker', label: 'Loudspeaker (Default)', icon: Volume2 },
              { id: 'earpiece', label: 'Device Earpiece / Headset', icon: Volume1 },
              { id: 'bluetooth', label: 'Bluetooth Wireless Headphones', icon: Headphones },
            ].map((route) => {
              const Icon = route.icon;
              const isSelected = audioRoute === route.id;
              return (
                <button
                  key={route.id}
                  onClick={() => {
                    setAudioRoute(route.id as any);
                    soundEffects.playTapSound();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-xs font-semibold ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{route.label}</span>
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </button>
              );
            })}

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setIsNoiseSuppression(!isNoiseSuppression);
                  soundEffects.playTapSound();
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  isNoiseSuppression
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800'
                }`}
              >
                <span>AI Background Noise Suppression</span>
                <span className={`w-2 h-2 rounded-full ${isNoiseSuppression ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. ADD PARTICIPANTS / GROUP CALL MODAL
          ======================================================== */}
      {showAddParticipantModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Add Contacts to Video Call</h3>
                <p className="text-xs text-emerald-400">Up to 32 participants in HD ChatMi group video</p>
              </div>
              <button
                onClick={() => setShowAddParticipantModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-3">
              <input
                type="text"
                value={participantSearch}
                onChange={(e) => setParticipantSearch(e.target.value)}
                placeholder="Search name or username..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {MOCK_USERS.filter((u) => u.id !== currentUser?.id && u.name.toLowerCase().includes(participantSearch.toLowerCase())).map((user) => {
                const isAlreadyIn = callParticipants.some((p) => p.id === user.id);
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:bg-slate-800/80 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{user.name}</h4>
                        <span className="text-[10px] text-slate-400">@{user.username || 'user'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddParticipant(user)}
                      disabled={isAlreadyIn}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-transform active:scale-95 ${
                        isAlreadyIn
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                      }`}
                    >
                      {isAlreadyIn ? 'In Call' : 'Add to Call'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
