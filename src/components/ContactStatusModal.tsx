import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Send,
  Lock,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Smile,
  ShieldCheck,
  Clock,
  Sparkles,
  Users,
  Image as ImageIcon,
  Type,
  Check,
  Heart,
  Flame,
  MessageCircle,
  Camera,
  Upload,
  User as UserIcon,
  RefreshCw,
  Sparkle,
} from 'lucide-react';
import { StatusStory, User } from '../types';
import { soundEffects } from '../utils/audio';

interface ContactStatusModalProps {
  stories: StatusStory[];
  currentUser: User;
  onClose: () => void;
  onAddStory: (story: {
    userId: string;
    userName: string;
    userAvatar: string;
    type: 'text' | 'image';
    content: string;
    bgGradient?: string;
    caption?: string;
    privacy?: 'contacts' | 'contacts_except' | 'only_share_with';
  }) => void;
  onReplyToStory: (story: StatusStory, replyMessage: string) => void;
  onUpdateAvatar?: (newAvatarUrl: string) => void;
  initialStoryIndex?: number;
  initialCreateMode?: boolean;
}

const TEXT_GRADIENTS = [
  'from-emerald-600 via-teal-600 to-cyan-700',
  'from-indigo-600 via-purple-600 to-pink-600',
  'from-amber-600 via-orange-600 to-rose-700',
  'from-blue-600 via-indigo-700 to-slate-900',
  'from-rose-600 via-pink-600 to-purple-800',
  'from-teal-700 via-emerald-800 to-slate-950',
];

const PRESET_PHOTOS = [
  {
    name: '☕ Morning Coffee',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&auto=format&fit=crop&q=80',
    caption: 'Quiet morning planning the next big release ☕💻',
  },
  {
    name: '🌿 Weekend Nature',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&auto=format&fit=crop&q=80',
    caption: 'Recharging in the mountains! No laptops allowed 🌲⛰️',
  },
  {
    name: '🚀 Coding Sprint',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&auto=format&fit=crop&q=80',
    caption: 'Cracking down on 0ms WebSocket edge latency 🔥',
  },
  {
    name: '🌃 City Sunset',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=900&auto=format&fit=crop&q=80',
    caption: 'Golden hour in the city ✨ Hope everyone had a great day!',
  },
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
];

const EMOJI_REACTIONS = ['❤️', '😂', '😮', '👏', '🔥', '🎉', '🙌', '💯'];

export const ContactStatusModal: React.FC<ContactStatusModalProps> = ({
  stories,
  currentUser,
  onClose,
  onAddStory,
  onReplyToStory,
  onUpdateAvatar,
  initialStoryIndex = 0,
  initialCreateMode = false,
}) => {
  // Navigation tabs in the hub: 'stories' | 'create' | 'avatar'
  const [activeView, setActiveView] = useState<'stories' | 'create' | 'avatar'>(
    initialCreateMode ? 'create' : 'stories'
  );
  const [activeStoryIdx, setActiveStoryIdx] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replySentFeedback, setReplySentFeedback] = useState<string | null>(null);
  const [showViewersSheet, setShowViewersSheet] = useState(false);

  // Status Creator state
  const [createType, setCreateType] = useState<'text' | 'image'>('text');
  const [textContent, setTextContent] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(TEXT_GRADIENTS[0]);
  const [selectedFont, setSelectedFont] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [imageUrl, setImageUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [privacySetting, setPrivacySetting] = useState<'contacts' | 'contacts_except' | 'only_share_with'>('contacts');

  // Avatar / Profile photo state
  const [newAvatarPreview, setNewAvatarPreview] = useState(currentUser.avatar);
  const [customAvatarUrlInput, setCustomAvatarUrlInput] = useState('');
  const [avatarSaveFeedback, setAvatarSaveFeedback] = useState(false);
  const [isTakingSnapshot, setIsTakingSnapshot] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentStory = stories[activeStoryIdx] || stories[0];
  const isOwnStory = currentStory && currentStory.userId === currentUser.id;

  // Auto-progress timer for viewing stories
  useEffect(() => {
    if (activeView !== 'stories' || isPaused || !currentStory) return;

    const interval = 50; // 50ms ticks
    const step = 100 / (5000 / interval); // 5 seconds duration

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextStory();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeStoryIdx, isPaused, activeView, stories.length]);

  const handleNextStory = () => {
    setProgress(0);
    if (activeStoryIdx < stories.length - 1) {
      setActiveStoryIdx((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrevStory = () => {
    setProgress(0);
    if (activeStoryIdx > 0) {
      setActiveStoryIdx((prev) => prev - 1);
    }
  };

  const handleSendReply = (textToSend?: string) => {
    const text = (textToSend || replyText).trim();
    if (!text || !currentStory) return;

    soundEffects.playSendSound();
    onReplyToStory(currentStory, text);
    setReplyText('');
    setReplySentFeedback(`Reply sent to ${currentStory.userName} in Chat!`);
    setTimeout(() => setReplySentFeedback(null), 3000);
  };

  const handlePublishStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (createType === 'text' && !textContent.trim()) return;
    if (createType === 'image' && !imageUrl.trim()) return;

    soundEffects.playCelebrationChime();
    onAddStory({
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      type: createType,
      content: createType === 'text' ? textContent.trim() : imageUrl.trim(),
      bgGradient: createType === 'text' ? selectedGradient : undefined,
      caption: createType === 'image' ? photoCaption.trim() : undefined,
      privacy: privacySetting,
    });

    setActiveView('stories');
    setTextContent('');
    setImageUrl('');
    setPhotoCaption('');
    setActiveStoryIdx(0);
  };

  const handleSaveAvatar = () => {
    if (!newAvatarPreview) return;
    soundEffects.playCelebrationChime();
    if (onUpdateAvatar) {
      onUpdateAvatar(newAvatarPreview);
    }
    setAvatarSaveFeedback(true);
    setTimeout(() => setAvatarSaveFeedback(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewAvatarPreview(reader.result);
          soundEffects.playTapSound();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimulateCamera = () => {
    setIsTakingSnapshot(true);
    soundEffects.playTapSound();
    setTimeout(() => {
      // Pick a fresh portrait avatar from curated collection
      const randomAvatar = AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)];
      setNewAvatarPreview(randomAvatar);
      setIsTakingSnapshot(false);
      soundEffects.playSparkleSound();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-0 md:p-4 select-none">
      {/* Container simulating WhatsApp Status Mobile Viewport */}
      <div className="relative w-full max-w-md h-full md:h-[88vh] md:max-h-[820px] bg-slate-950 md:rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
        
        {/* Top Tab Navigation Bar */}
        <div className="p-3 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between z-30">
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => {
                setActiveView('stories');
                soundEffects.playTapSound();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'stories'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Contact Stories</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-emerald-200">
                {stories.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveView('create');
                soundEffects.playTapSound();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'create'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Status</span>
            </button>

            <button
              onClick={() => {
                setActiveView('avatar');
                soundEffects.playTapSound();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'avatar'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Profile Pic</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* --- VIEW 1: CONTACT STORIES VIEWER --- */}
        {activeView === 'stories' && (
          <div className="flex-1 flex flex-col justify-between relative overflow-hidden bg-slate-950">
            {/* Top Contact Story Quick Selectors */}
            <div className="px-3 py-2 bg-slate-900/80 border-b border-slate-800/80 flex items-center gap-2.5 overflow-x-auto no-scrollbar shrink-0 z-20">
              {stories.map((s, idx) => (
                <button
                  key={s.id || idx}
                  onClick={() => {
                    setActiveStoryIdx(idx);
                    setProgress(0);
                    soundEffects.playTapSound();
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-all border ${
                    activeStoryIdx === idx
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <img src={s.userAvatar} alt={s.userName} className="w-4 h-4 rounded-full object-cover" />
                  <span className="truncate max-w-[80px]">{s.userName.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Viewer Content */}
            <div
              className="flex-1 flex flex-col justify-between relative"
              onMouseDown={() => setIsPaused(true)}
              onMouseUp={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              {/* Multi-Story Progress Segments */}
              <div className="absolute top-2 inset-x-3 z-30 flex items-center gap-1.5">
                {stories.map((story, sIdx) => {
                  let barWidth = '0%';
                  if (sIdx < activeStoryIdx) barWidth = '100%';
                  else if (sIdx === activeStoryIdx) barWidth = `${progress}%`;

                  return (
                    <div key={story.id || sIdx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-75 ease-linear"
                        style={{ width: barWidth }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Top User Info & Privacy Indicator */}
              <div className="absolute top-5 inset-x-3 z-30 flex items-center justify-between text-white drop-shadow-md">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handlePrevStory}
                    disabled={activeStoryIdx === 0}
                    className="p-1 rounded-full hover:bg-black/30 text-white disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <img
                    src={currentStory?.userAvatar}
                    alt={currentStory?.userName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500 shadow-md"
                  />

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold truncate max-w-[140px]">
                        {isOwnStory ? 'My Status' : currentStory?.userName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-200 font-medium flex items-center gap-1 border border-emerald-400/30">
                        <Lock className="w-2.5 h-2.5" /> Contacts
                      </span>
                    </div>
                    <span className="text-[11px] text-white/80 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {currentStory?.timestamp || 'Today, 10:42 AM'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveView('create')}
                    className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                    title="Add New Status"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Left / Right Tap Zones to Navigate */}
              <div
                className="absolute inset-y-16 left-0 w-1/3 z-20 cursor-pointer"
                onClick={handlePrevStory}
                title="Previous Story"
              />
              <div
                className="absolute inset-y-16 right-0 w-1/3 z-20 cursor-pointer"
                onClick={handleNextStory}
                title="Next Story"
              />

              {/* Center Story Content */}
              <div className="w-full h-full flex flex-col justify-center items-center relative overflow-hidden bg-slate-950">
                {currentStory?.type === 'text' ? (
                  <div
                    className={`w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-tr ${
                      currentStory.bgGradient || 'from-emerald-600 via-teal-600 to-cyan-800'
                    }`}
                  >
                    <p className="text-center text-white text-2xl md:text-3xl font-extrabold leading-relaxed drop-shadow-lg max-w-xs">
                      {currentStory.content}
                    </p>
                  </div>
                ) : (
                  <div className="w-full h-full relative flex items-center justify-center bg-black">
                    <img
                      src={currentStory?.content}
                      alt="Status Content"
                      className="w-full h-full object-contain"
                    />
                    {currentStory?.caption && (
                      <div className="absolute bottom-20 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-center z-10">
                        <p className="text-white text-sm font-medium drop-shadow-md max-w-sm mx-auto">
                          {currentStory.caption}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Feedback notification when reply sent */}
              {replySentFeedback && (
                <div className="absolute top-20 inset-x-6 z-40 bg-emerald-600 text-white px-4 py-2 rounded-2xl shadow-xl text-center text-xs font-bold animate-bounce flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{replySentFeedback}</span>
                </div>
              )}

              {/* Bottom Action Area: Reply Bar (for contacts) OR Viewer Stats (for own status) */}
              <div className="p-3 bg-gradient-to-t from-black via-black/80 to-transparent z-30 flex flex-col gap-2">
                {isOwnStory ? (
                  /* My Status Viewers Receipt */
                  <div className="flex items-center justify-between bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800">
                    <div
                      onClick={() => setShowViewersSheet(!showViewersSheet)}
                      className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-emerald-400 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold">
                        Seen by {currentStory?.viewers?.length || 14} contacts
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveView('create')}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Status
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Reply to Contact Story Bar (Direct to Chat DM) */
                  <div className="flex flex-col gap-2">
                    {/* Quick Reaction Emojis Strip */}
                    <div className="flex items-center justify-around px-2 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                      {EMOJI_REACTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleSendReply(emoji)}
                          className="text-lg hover:scale-125 transition-transform active:scale-95"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    {/* Text Input to Reply to Chat */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendReply();
                          }}
                          onFocus={() => setIsPaused(true)}
                          onBlur={() => setIsPaused(false)}
                          placeholder={`Reply to ${currentStory?.userName}...`}
                          className="w-full bg-slate-900/90 text-white text-xs pl-4 pr-10 py-2.5 rounded-full border border-slate-700/80 focus:outline-none focus:border-emerald-500 placeholder-slate-400 shadow-lg"
                        />
                        <MessageCircle className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                      </div>

                      <button
                        onClick={() => handleSendReply()}
                        disabled={!replyText.trim()}
                        className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white shadow-lg shadow-emerald-600/30 transition-transform active:scale-95"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Expandable Viewers Drawer for Own Status */}
              {showViewersSheet && isOwnStory && (
                <div className="absolute inset-x-0 bottom-0 max-h-[60%] bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 rounded-t-3xl p-4 z-40 flex flex-col gap-3 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-bold text-slate-200">
                        Viewed by ({currentStory?.viewers?.length || 3} contacts)
                      </h4>
                    </div>
                    <button
                      onClick={() => setShowViewersSheet(false)}
                      className="text-slate-400 hover:text-white text-xs font-semibold"
                    >
                      Close
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 overflow-y-auto divide-y divide-slate-800/60 pr-1">
                    {[
                      { name: 'Elena Rostova', time: '5m ago', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
                      { name: 'Marcus Vance', time: '18m ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
                      { name: 'Sophia Chen', time: '1h ago', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80' },
                    ].map((v, vIdx) => (
                      <div key={vIdx} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2.5">
                          <img src={v.avatar} alt={v.name} className="w-7 h-7 rounded-full object-cover" />
                          <span className="text-xs font-medium text-slate-200">{v.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{v.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- VIEW 2: CREATE NEW STATUS --- */}
        {activeView === 'create' && (
          <div className="flex-1 flex flex-col justify-between bg-slate-950 overflow-hidden">
            {/* Type Switcher */}
            <div className="p-3 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>New Status</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Contacts Only
                  </span>
                </h3>
              </div>

              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setCreateType('text')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    createType === 'text'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" /> Text
                </button>
                <button
                  onClick={() => setCreateType('image')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    createType === 'image'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Photo
                </button>
              </div>
            </div>

            {/* Middle Canvas: Text or Image */}
            {createType === 'text' ? (
              <div
                className={`flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-tr ${selectedGradient} transition-all duration-300 relative overflow-hidden`}
              >
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Type a status update..."
                  rows={5}
                  maxLength={300}
                  className={`w-full max-w-xs text-center text-white text-2xl font-bold bg-transparent placeholder-white/50 focus:outline-none resize-none drop-shadow-md ${
                    selectedFont === 'serif' ? 'font-serif italic' : selectedFont === 'mono' ? 'font-mono' : 'font-sans'
                  }`}
                  autoFocus
                />

                {/* Floating font toggle */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                  <button
                    onClick={() =>
                      setSelectedFont((prev) => (prev === 'sans' ? 'serif' : prev === 'serif' ? 'mono' : 'sans'))
                    }
                    className="text-xs font-black text-white hover:text-emerald-300 uppercase tracking-wider"
                  >
                    Font: {selectedFont}
                  </button>
                </div>

                {/* Color Gradient Palette */}
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-center gap-2 overflow-x-auto py-2 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
                  {TEXT_GRADIENTS.map((g, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedGradient(g)}
                      className={`w-7 h-7 rounded-full bg-gradient-to-tr ${g} ring-2 transition-transform ${
                        selectedGradient === g ? 'ring-white scale-125 shadow-lg' : 'ring-transparent opacity-80'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Photo Status Creator */
              <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto bg-slate-900/90 gap-4">
                <div className="flex flex-col gap-3">
                  {imageUrl ? (
                    <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-slate-700 group">
                      <img src={imageUrl} alt="Status Preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setImageUrl('')}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-40 rounded-2xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-400 gap-2 p-4 text-center">
                      <ImageIcon className="w-8 h-8 text-emerald-400 opacity-80" />
                      <span className="text-xs font-semibold text-slate-300">Paste Image URL or choose preset</span>
                    </div>
                  )}

                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste Image URL (https://...)"
                    className="w-full bg-slate-950 text-slate-100 text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                  />

                  {/* Preset Photos for Instant Status */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400">Quick Sample Photos:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESET_PHOTOS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setImageUrl(p.url);
                            setPhotoCaption(p.caption);
                            soundEffects.playTapSound();
                          }}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left flex items-center gap-2 group transition-all"
                        >
                          <img src={p.url} alt={p.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-emerald-400">
                              {p.name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">1-tap select</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    placeholder="Add a caption..."
                    className="w-full bg-slate-950 text-slate-100 text-sm p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Bottom Publishing Bar & Privacy Selector */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px]">
                  Visible to: <strong className="text-slate-200">My Contacts (24h)</strong>
                </span>
              </div>

              <button
                onClick={handlePublishStatus}
                disabled={(createType === 'text' && !textContent.trim()) || (createType === 'image' && !imageUrl.trim())}
                className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-transform active:scale-95"
              >
                <span>Send to Status</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* --- VIEW 3: UPDATE PROFILE PICTURE (AVATAR STUDIO) --- */}
        {activeView === 'avatar' && (
          <div className="flex-1 flex flex-col justify-between p-5 bg-slate-950 overflow-y-auto">
            <div className="flex flex-col items-center gap-5">
              {/* Current & Preview Avatar Ring */}
              <div className="relative flex flex-col items-center">
                <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-indigo-500/20">
                  <img
                    src={newAvatarPreview}
                    alt="Avatar Preview"
                    className="w-full h-full rounded-full object-cover ring-4 ring-slate-950"
                  />
                  {isTakingSnapshot && (
                    <div className="absolute inset-0 rounded-full bg-white/80 animate-ping flex items-center justify-center" />
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg ring-2 ring-slate-950 transition-transform active:scale-95"
                    title="Upload Photo"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <p className="text-xs font-bold text-slate-200 mt-2">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400 font-mono">@{currentUser.username}</p>
              </div>

              {/* Action Buttons: Camera Snapshot & File Upload */}
              <div className="w-full grid grid-cols-2 gap-3">
                <button
                  onClick={handleSimulateCamera}
                  disabled={isTakingSnapshot}
                  className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white flex flex-col items-center justify-center gap-1.5 group transition-all"
                >
                  <Camera className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold">Take Snapshot</span>
                  <span className="text-[10px] text-slate-400">Instant AI Camera</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white flex flex-col items-center justify-center gap-1.5 group transition-all"
                >
                  <Upload className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold">Upload Photo</span>
                  <span className="text-[10px] text-slate-400">From Device</span>
                </button>
              </div>

              {/* Preset Avatars Gallery */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Preset Avatars Collection</span>
                  <span className="text-[10px] text-slate-400 font-normal">Tap to choose</span>
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {AVATAR_PRESETS.map((avatarUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setNewAvatarPreview(avatarUrl);
                        soundEffects.playTapSound();
                      }}
                      className={`relative aspect-square rounded-2xl overflow-hidden ring-2 transition-all group ${
                        newAvatarPreview === avatarUrl
                          ? 'ring-indigo-500 scale-105 shadow-md shadow-indigo-500/30'
                          : 'ring-slate-800 opacity-70 hover:opacity-100 hover:ring-slate-600'
                      }`}
                    >
                      <img src={avatarUrl} alt="Avatar option" className="w-full h-full object-cover" />
                      {newAvatarPreview === avatarUrl && (
                        <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white drop-shadow-md stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image URL Input */}
              <div className="w-full flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-slate-400">Or Paste Image URL:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customAvatarUrlInput}
                    onChange={(e) => {
                      setCustomAvatarUrlInput(e.target.value);
                      if (e.target.value.startsWith('http')) {
                        setNewAvatarPreview(e.target.value);
                      }
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-slate-900 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  {customAvatarUrlInput && (
                    <button
                      onClick={() => {
                        setNewAvatarPreview(customAvatarUrlInput);
                        soundEffects.playTapSound();
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 text-xs text-indigo-400 font-semibold hover:bg-slate-700"
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Save Profile Picture Button */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              {avatarSaveFeedback && (
                <div className="bg-emerald-600 text-white text-xs font-bold py-2 px-3 rounded-xl text-center flex items-center justify-center gap-2 shadow-lg animate-bounce">
                  <Check className="w-4 h-4" />
                  <span>Profile picture updated successfully!</span>
                </div>
              )}

              <button
                onClick={handleSaveAvatar}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Save as Profile Picture</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
