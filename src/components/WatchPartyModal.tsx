import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Users,
  Film,
  Sparkles,
  Maximize2,
  Send,
  Radio,
  Share2,
  Check,
} from 'lucide-react';
import { User, WatchPartyVideo, WatchPartySession } from '../types';
import { soundEffects } from '../utils/audio';

const PRESET_VIDEOS: WatchPartyVideo[] = [
  {
    id: 'vid_cyberpunk',
    title: 'Cyberpunk 2099: Neon Skyline & Synth Beats (4K HDR)',
    category: 'Music & Vibes',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    duration: 734,
    creator: 'Pulse Studio Cinema',
  },
  {
    id: 'vid_tech',
    title: 'Alpha AI 3.6: The Architecture of Real-Time Intelligence',
    category: 'Technology Keynote',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    duration: 596,
    creator: 'DeepMind Tech Team',
  },
  {
    id: 'vid_space',
    title: 'James Webb Space Telescope: Deep Nebula & Cosmic Journey',
    category: 'Science & Cosmos',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    duration: 653,
    creator: 'Cosmic Horizons',
  },
  {
    id: 'vid_lofi',
    title: 'Lofi Coding Session ~ Cozy Night Coding Room',
    category: 'Relax & Focus',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80',
    duration: 412,
    creator: 'Chill Beats Collective',
  },
];

interface WatchPartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  chatTitle: string;
  onBroadcastPartyEvent?: (event: Record<string, unknown>) => void;
}

export const WatchPartyModal: React.FC<WatchPartyModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  chatTitle,
  onBroadcastPartyEvent,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<WatchPartyVideo>(PRESET_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [floatingReactions, setFloatingReactions] = useState<{ id: string; emoji: string; x: number }[]>([]);
  const [inRoomMessages, setInRoomMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Alex Chen', text: 'Welcome to the synchronized watch party! 🍿', time: 'Just now' },
    { sender: 'Alpha AI', text: 'Video stream synchronized across all connected session peers.', time: 'Just now' },
  ]);
  const [chatDraft, setChatDraft] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
    }
  }, [isOpen]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      soundEffects.playClickSound();
    }

    if (onBroadcastPartyEvent) {
      onBroadcastPartyEvent({
        type: 'watchparty:sync',
        action: isPlaying ? 'pause' : 'play',
        time: videoRef.current.currentTime,
        videoId: selectedVideo.id,
      });
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || selectedVideo.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSendReaction = (emoji: string) => {
    soundEffects.reaction();
    const newReaction = {
      id: `react_${Date.now()}_${Math.random()}`,
      emoji,
      x: Math.floor(Math.random() * 70) + 15,
    };
    setFloatingReactions((prev) => [...prev, newReaction]);

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 2500);

    if (onBroadcastPartyEvent) {
      onBroadcastPartyEvent({
        type: 'watchparty:reaction',
        emoji,
      });
    }
  };

  const handleSendRoomChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatDraft.trim()) return;

    const newMsg = {
      sender: currentUser.name,
      text: chatDraft.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setInRoomMessages((prev) => [...prev, newMsg]);
    setChatDraft('');
    soundEffects.playSendSound();
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!isOpen) return null;

  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl h-[92vh] sm:h-[86vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white shadow-md">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-100">Synchronized Watch Party</h3>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  <Radio className="w-3 h-3 animate-pulse" /> Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">Streaming with {chatTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyInvite}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-slate-200 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied Link' : 'Invite'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Left: Video Cinema Player */}
          <div className="flex-1 flex flex-col bg-black relative min-h-0">
            {/* Video Element */}
            <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden group">
              <video
                ref={videoRef}
                src={selectedVideo.videoUrl}
                poster={selectedVideo.thumbnail}
                onTimeUpdate={handleTimeUpdate}
                muted={isMuted}
                playsInline
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
              />

              {/* Floating Live Reactions Layer */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {floatingReactions.map((r) => (
                  <div
                    key={r.id}
                    style={{ left: `${r.x}%` }}
                    className="absolute bottom-16 text-3xl animate-bounce duration-1000 transition-all opacity-90 select-none drop-shadow-lg"
                  >
                    {r.emoji}
                  </div>
                ))}
              </div>

              {/* Central Play Overlay Button when paused */}
              {!isPlaying && (
                <button
                  onClick={togglePlay}
                  className="absolute p-5 rounded-full bg-indigo-600/90 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all backdrop-blur-sm"
                >
                  <Play className="w-8 h-8 ml-1" />
                </button>
              )}
            </div>

            {/* Video Controls Bar */}
            <div className="bg-slate-950/95 border-t border-slate-800 px-4 py-2.5 flex flex-col gap-1.5">
              {/* Scrubber Slider */}
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span>{formatSecs(currentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <span>{formatSecs(duration || selectedVideo.duration)}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <div className="hidden sm:block text-xs font-medium text-slate-300 truncate max-w-xs">
                    {selectedVideo.title}
                  </div>
                </div>

                {/* Floating Reaction Bar Buttons */}
                <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-full px-2 py-1">
                  {['🍿', '🔥', '😍', '🚀', '👏', '⚡'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleSendReaction(emoji)}
                      className="p-1 hover:scale-125 transition-transform active:scale-95 text-sm"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Playlist & In-Room Theater Chat */}
          <div className="w-full lg:w-80 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-64 lg:h-auto">
            {/* Playlist Tabs Header */}
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-indigo-400" /> Cinema Queue
              </h4>
              <span className="text-[11px] text-slate-400">{PRESET_VIDEOS.length} Videos</span>
            </div>

            {/* Video Selector list */}
            <div className="p-2 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto max-h-36 lg:max-h-48 border-b border-slate-800 scrollbar-thin">
              {PRESET_VIDEOS.map((vid) => {
                const isSelected = vid.id === selectedVideo.id;
                return (
                  <div
                    key={vid.id}
                    onClick={() => {
                      setSelectedVideo(vid);
                      setCurrentTime(0);
                      setIsPlaying(true);
                      if (videoRef.current) {
                        videoRef.current.currentTime = 0;
                        videoRef.current.play().catch(() => {});
                      }
                    }}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 cursor-pointer shrink-0 lg:shrink transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500/80 shadow-md'
                        : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-14 h-9 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-200 truncate">{vid.title}</p>
                      <p className="text-[10px] text-slate-400 truncate">{vid.category}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* In-Room Live Chat */}
            <div className="flex-1 flex flex-col min-h-0 bg-slate-950/40">
              <div className="p-2 text-[11px] font-semibold text-slate-400 border-b border-slate-800/80 flex items-center gap-1">
                <Users className="w-3 h-3 text-emerald-400" /> Watch Party Live Chat
              </div>

              <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-2 text-xs">
                {inRoomMessages.map((msg, i) => (
                  <div key={i} className="flex flex-col bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                      <span className="font-bold text-indigo-400">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-slate-200">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendRoomChat} className="p-2 border-t border-slate-800 flex gap-1.5">
                <input
                  type="text"
                  value={chatDraft}
                  onChange={(e) => setChatDraft(e.target.value)}
                  placeholder="Chat with watchers..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
