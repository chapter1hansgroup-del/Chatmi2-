import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Music,
  RotateCcw,
  Sparkles,
  Timer,
  Zap,
  Sliders,
  Check,
  Play,
  Pause,
  Upload,
  Image as ImageIcon,
  Smile,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  Flame,
  Globe,
  Lock,
  Users,
  Film,
  Camera,
  Layers,
  Wand2,
  Type,
  Tag,
  Hash,
  MapPin,
  Mic,
  Sun,
  Palette,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  AlertCircle,
  HelpCircle,
  BarChart3,
} from 'lucide-react';
import { User, PostlyVideo } from '../types';
import { soundEffects } from '../utils/audio';

interface TikTokCreatorStudioProps {
  currentUser: User;
  onClose: () => void;
  onPublish: (postData: {
    type: 'text' | 'image' | 'video';
    caption: string;
    hashtags: string[];
    contentUrl?: string;
    photos?: string[];
    bgGradient?: string;
    audioTrack?: string;
    privacy: 'public' | 'friends' | 'private';
    allowComments: boolean;
    allowDuet: boolean;
    filterApplied?: string;
  }) => void;
  onOpenAiStudio?: () => void;
}

interface AudioTrackOption {
  id: string;
  title: string;
  artist: string;
  duration: string;
  genre: string;
  isTrending?: boolean;
}

const TRENDING_SOUNDS: AudioTrackOption[] = [
  { id: 'sound_1', title: 'Postly Cyber Synth Beat', artist: 'Postly SoundLab', duration: '0:15', genre: 'Electronic', isTrending: true },
  { id: 'sound_2', title: 'Viral Summer Trap 2026', artist: 'DJ Metro', duration: '0:30', genre: 'Hip Hop', isTrending: true },
  { id: 'sound_3', title: 'Lo-Fi Night Code Flow', artist: 'Chillhop Devs', duration: '0:45', genre: 'Lo-Fi', isTrending: true },
  { id: 'sound_4', title: 'Futuristic Hyperpop Glow', artist: 'Nova Beat', duration: '0:20', genre: 'Hyperpop' },
  { id: 'sound_5', title: 'Aesthetic Sunset Vibe', artist: 'Elena Rostova', duration: '0:35', genre: 'Indie' },
  { id: 'sound_6', title: 'Bass Drop Speed Runway', artist: 'Club Postly', duration: '0:15', genre: 'Dance', isTrending: true },
];

const FILTER_PRESETS = [
  { id: 'normal', name: 'Normal', css: '', previewColor: 'bg-slate-700' },
  { id: 'caramel', name: 'Portrait', css: 'sepia-[0.25] contrast-105 saturate-125 brightness-105', previewColor: 'bg-amber-600' },
  { id: 'cyberpunk', name: 'Cyberpunk', css: 'contrast-125 saturate-150 hue-rotate-15 filter brightness-110', previewColor: 'bg-cyan-500' },
  { id: 'tokyo_neon', name: 'Tokyo Neon', css: 'contrast-125 saturate-200 hue-rotate-90', previewColor: 'bg-fuchsia-600' },
  { id: 'golden_hour', name: 'Golden', css: 'sepia-[0.4] contrast-110 saturate-140 brightness-110', previewColor: 'bg-yellow-500' },
  { id: 'vintage_film', name: 'Vintage', css: 'contrast-115 saturate-80 sepia-[0.35]', previewColor: 'bg-stone-500' },
  { id: 'noir', name: 'Noir B&W', css: 'grayscale contrast-150 brightness-95', previewColor: 'bg-neutral-900' },
];

const EFFECTS_PRESETS = [
  { id: 'none', name: 'None', icon: '✨' },
  { id: 'green_screen', name: 'Green Screen', icon: '🟩', desc: 'Custom studio background' },
  { id: 'sparkles', name: 'Sparkles', icon: '✨', desc: 'Glitter particles' },
  { id: 'cyber_glitch', name: 'Cyber Glitch', icon: '⚡', desc: 'RGB shift scanline' },
  { id: 'heart_burst', name: 'Hearts', icon: '💖', desc: 'Floating love aura' },
  { id: 'neon_glow', name: 'Neon Glow', icon: '🌟', desc: 'Vibrant edge highlights' },
  { id: 'face_retouch', name: 'AI Smooth', icon: '🪄', desc: 'Studio skin polish' },
];

const VIRAL_MEDIA_PRESETS = [
  {
    id: 'preset_dev',
    title: '💻 Dev Workspace Pro',
    category: 'Tech & Code',
    urls: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80',
    ],
    defaultCaption: 'Building the next-gen real-time web stack on Postly 🚀✨ #DevLife #WebDev #Postly #Code #TechTok',
  },
  {
    id: 'preset_cyber',
    title: '🌌 Tokyo Cyberpunk Night',
    category: 'Vibes & Aesthetics',
    urls: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80',
    ],
    defaultCaption: 'Midnight neon frequencies in Neo Tokyo 🌃✨ #Cyberpunk #Aesthetic #Tokyo #Vibes #FYP',
  },
  {
    id: 'preset_sunset',
    title: '🌅 Golden Hour Horizon',
    category: 'Travel & Lifestyle',
    urls: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&auto=format&fit=crop&q=80',
    ],
    defaultCaption: 'Chasing sunset horizons along the coast 🌅🌊 #GoldenHour #Travel #SunsetLovers #SummerVibes',
  },
  {
    id: 'preset_studio',
    title: '🎙️ Creator Studio Setup',
    category: 'Creators & Podcasting',
    urls: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=900&auto=format&fit=crop&q=80',
    ],
    defaultCaption: 'Behind the mic creating the newest audio drop 🎙️🔥 #CreatorStudio #Podcast #Viral #PostlyFam',
  },
];

const GRADIENT_PRESETS = [
  'from-rose-600 via-purple-600 to-indigo-800',
  'from-cyan-500 via-blue-600 to-indigo-900',
  'from-emerald-500 via-teal-600 to-slate-900',
  'from-amber-500 via-rose-600 to-purple-900',
  'from-fuchsia-600 via-pink-600 to-rose-700',
  'from-violet-600 via-purple-800 to-slate-950',
];

const VIRAL_HASHTAGS = [
  '#fyp',
  '#foryou',
  '#viral',
  '#Postly',
  '#trending',
  '#TechTok',
  '#devlife',
  '#CreatorHub',
  '#foryoupage',
];

const AI_VIRAL_HOOKS = [
  'Wait until the end... you won\'t believe this result! 🤯✨ #viral #fyp',
  '3 secret developer tools that feel illegal to know in 2026 💻🔥 #TechTok #devlife',
  'Nobody is talking about this game-changing technique... until now 👀🚀 #Postly #trending',
  'POV: You finally cracked the algorithm and your reel blows up 📈💫 #CreatorHub #fyp',
  'Day 1 of building something insane from scratch — let me know your thoughts! 🛠️ #BuildInPublic',
];

export const TikTokCreatorStudio: React.FC<TikTokCreatorStudioProps> = ({
  currentUser,
  onClose,
  onPublish,
  onOpenAiStudio,
}) => {
  // Stage Flow: 'camera' -> 'edit_post'
  const [stage, setStage] = useState<'camera' | 'edit_post'>('camera');

  // Camera & Mode State
  const [cameraMode, setCameraMode] = useState<'15s' | '60s' | '10m' | 'photo' | 'text' | 'templates'>('15s');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedClips, setRecordedClips] = useState<{ duration: number; previewUrl?: string }[]>([]);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [speed, setSpeed] = useState<number>(1);
  const [selectedFilter, setSelectedFilter] = useState(FILTER_PRESETS[0]);
  const [selectedEffect, setSelectedEffect] = useState(EFFECTS_PRESETS[0]);
  const [beautyRetouch, setBeautyRetouch] = useState(50);
  const [isBeautyOn, setIsBeautyOn] = useState(true);
  const [flashLightOn, setFlashLightOn] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '4:5'>('9:16');
  const [timerCountdown, setTimerCountdown] = useState<3 | 10 | null>(null);
  const [countingDownNumber, setCountingDownNumber] = useState<number | null>(null);

  // Sound State
  const [selectedSound, setSelectedSound] = useState<AudioTrackOption>(TRENDING_SOUNDS[0]);
  const [showSoundPicker, setShowSoundPicker] = useState(false);
  const [isPlayingSoundPreview, setIsPlayingSoundPreview] = useState<string | null>(null);

  // Drawers & Sub-modals
  const [showSpeedBar, setShowSpeedBar] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showEffectsDrawer, setShowEffectsDrawer] = useState(false);
  const [showBeautyDrawer, setShowBeautyDrawer] = useState(false);
  const [showUploadGallery, setShowUploadGallery] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [showVoiceFxDrawer, setShowVoiceFxDrawer] = useState(false);
  const [selectedVoiceFx, setSelectedVoiceFx] = useState('Studio Standard');

  // Content Data
  const [mediaType, setMediaType] = useState<'video' | 'image' | 'text'>('video');
  const [capturedMediaUrl, setCapturedMediaUrl] = useState<string>('');
  const [carouselPhotos, setCarouselPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop&q=80',
  ]);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_PRESETS[0]);

  // Post Details & TikTok Settings
  const [caption, setCaption] = useState('Creating viral magic with the new TikTok-style creator studio ✨🚀 #Postly #FYP');
  const [postPrivacy, setPostPrivacy] = useState<'public' | 'friends' | 'private'>('public');
  const [allowComments, setAllowComments] = useState(true);
  const [allowDuet, setAllowDuet] = useState(true);
  const [highQualityUpload, setHighQualityUpload] = useState(true);
  const [saveToDevice, setSaveToDevice] = useState(false);
  const [locationTag, setLocationTag] = useState('Global Edge Network');
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Interactive Text Stickers on Video
  const [textStickers, setTextStickers] = useState<{ id: string; text: string; color: string; style: string; x: number; y: number }[]>([
    { id: 'st_1', text: '🔥 TRENDING NOW', color: '#FFFFFF', style: 'bg-rose-600 px-3 py-1 font-black rounded-lg', x: 20, y: 15 },
  ]);
  const [newStickerText, setNewStickerText] = useState('');
  const [showTextEditor, setShowTextEditor] = useState(false);

  // Refs for Webcam & Video
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Max duration mapping based on mode
  const maxDuration = cameraMode === '15s' ? 15 : cameraMode === '60s' ? 60 : cameraMode === '10m' ? 600 : 15;

  // Initialize Real Webcam stream with graceful fallbacks
  useEffect(() => {
    let active = true;

    async function setupCamera() {
      if (stage !== 'camera') return;
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode, width: { ideal: 1080 }, height: { ideal: 1920 } },
            audio: false,
          });
          if (active) {
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play().catch(() => {});
            }
          }
        }
      } catch (err) {
        // Camera permission denied or not available - will show high-def dynamic creator viewfinder canvas
        console.log('Webcam not active, using interactive simulator viewfinder:', err);
      }
    }

    setupCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [facingMode, stage]);

  // Handle Recording Timer Tick
  useEffect(() => {
    if (isRecording) {
      recordIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev + 1 >= maxDuration) {
            handleStopRecording();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (recordIntervalRef.current) {
        clearInterval(recordIntervalRef.current);
      }
    }
    return () => {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    };
  }, [isRecording, maxDuration, speed]);

  // Flip Camera
  const handleFlipCamera = () => {
    soundEffects.playTapSound();
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Start Hands-free Timer with 3s/10s Countdown
  const handleStartTimerCountdown = (seconds: 3 | 10) => {
    setShowTimerModal(false);
    setTimerCountdown(seconds);
    setCountingDownNumber(seconds);
    soundEffects.playCountdownBeep(false);

    let current = seconds;
    const cdInterval = setInterval(() => {
      current -= 1;
      if (current > 0) {
        setCountingDownNumber(current);
        soundEffects.playCountdownBeep(false);
      } else if (current === 0) {
        setCountingDownNumber(0);
        soundEffects.playCountdownBeep(true);
      } else {
        clearInterval(cdInterval);
        setCountingDownNumber(null);
        setTimerCountdown(null);
        handleStartRecording();
      }
    }, 1000);
  };

  // Start Recording
  const handleStartRecording = () => {
    soundEffects.playClickSound();
    setIsRecording(true);
  };

  // Stop Recording
  const handleStopRecording = () => {
    soundEffects.playClickSound();
    setIsRecording(false);
    const newDuration = recordingSeconds || 1;
    setRecordedClips((prev) => [...prev, { duration: newDuration }]);
  };

  // Finish Recording & Proceed to TikTok Post Editor
  const handleDoneRecording = () => {
    soundEffects.playCelebrationChime();
    setMediaType('video');
    setCapturedMediaUrl(
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&auto=format&fit=crop&q=80'
    );
    setStage('edit_post');
  };

  // Capture Instant Photo Snapshot
  const handleTakeSnapshot = () => {
    soundEffects.playShutterSound();
    setMediaType('image');
    setCapturedMediaUrl(
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&auto=format&fit=crop&q=80'
    );
    setStage('edit_post');
  };

  // Upload Custom Media from Computer / Phone
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    soundEffects.playTapSound();
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = URL.createObjectURL(files[i]);
      urls.push(url);
    }

    if (urls.length > 1) {
      setCarouselPhotos(urls);
      setMediaType('image');
      setCapturedMediaUrl(urls[0]);
    } else {
      setMediaType('image');
      setCapturedMediaUrl(urls[0]);
    }

    setShowUploadGallery(false);
    setStage('edit_post');
  };

  // Select Curated Preset
  const handleSelectPreset = (preset: (typeof VIRAL_MEDIA_PRESETS)[0]) => {
    soundEffects.playTapSound();
    setCarouselPhotos(preset.urls);
    setCapturedMediaUrl(preset.urls[0]);
    setMediaType('image');
    setCaption(preset.defaultCaption);
    setShowUploadGallery(false);
    setStage('edit_post');
  };

  // AI Hook Generator
  const handleGenerateAiHook = () => {
    soundEffects.playSparkleSound();
    const randomHook = AI_VIRAL_HOOKS[Math.floor(Math.random() * AI_VIRAL_HOOKS.length)];
    setCaption(randomHook);
  };

  // Append Hashtag
  const handleAddHashtag = (tag: string) => {
    soundEffects.playTapSound();
    if (!caption.includes(tag)) {
      setCaption((prev) => (prev ? `${prev} ${tag}` : tag));
    }
  };

  // Add Sticker to Video Preview
  const handleAddTextSticker = () => {
    if (!newStickerText.trim()) return;
    soundEffects.playTapSound();
    setTextStickers((prev) => [
      ...prev,
      {
        id: `st_${Date.now()}`,
        text: newStickerText,
        color: '#FFFFFF',
        style: 'bg-black/75 px-3 py-1.5 font-extrabold rounded-xl border border-white/20 shadow-xl',
        x: 25,
        y: 40 + prev.length * 12,
      },
    ]);
    setNewStickerText('');
    setShowTextEditor(false);
  };

  // Final Publish Handler
  const handleFinalPublish = () => {
    soundEffects.playCelebrationChime();

    // Extract hashtags
    const matchedHashtags = caption.match(/#[a-zA-Z0-9_]+/g) || ['#Postly', '#FYP'];

    onPublish({
      type: mediaType,
      caption: caption || 'New viral update from creator studio ✨',
      hashtags: matchedHashtags,
      contentUrl: capturedMediaUrl,
      photos: carouselPhotos.length > 1 ? carouselPhotos : undefined,
      bgGradient: mediaType === 'text' ? selectedGradient : undefined,
      audioTrack: `🎵 ${selectedSound.title} - ${selectedSound.artist}`,
      privacy: postPrivacy,
      allowComments,
      allowDuet,
      filterApplied: selectedFilter.name,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden font-sans">
      {/* Hidden file input for gallery upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Main Studio Frame (Simulating Full TikTok Camera/Post Screen with 9:16 responsiveness) */}
      <div className="relative w-full h-full max-w-md bg-slate-950 flex flex-col justify-between overflow-hidden shadow-2xl md:rounded-[40px] md:h-[95vh] md:max-h-[920px] md:border md:border-white/15">
        
        {/* ========================================================================= */}
        {/* STAGE 1: TIKTOK LIVE CAMERA & RECORDING VIEWFINDER                        */}
        {/* ========================================================================= */}
        {stage === 'camera' && (
          <div className="relative w-full h-full flex flex-col justify-between bg-black overflow-hidden">
            
            {/* Viewfinder Background (Live Stream or Simulated Creator Stage) */}
            <div className="absolute inset-0 z-0 bg-neutral-900 flex items-center justify-center overflow-hidden">
              {cameraMode === 'text' ? (
                /* Text Story Gradient Canvas */
                <div className={`w-full h-full bg-gradient-to-tr ${selectedGradient} flex items-center justify-center p-6 transition-all duration-500`}>
                  <div className="text-center text-white px-4 py-8 rounded-3xl bg-black/20 backdrop-blur-md border border-white/20 shadow-2xl max-w-xs">
                    <p className="text-lg font-black tracking-wide drop-shadow-md">
                      {caption || 'Tap anywhere to type your TikTok story hook... ✨'}
                    </p>
                  </div>
                </div>
              ) : (
                /* Video / Camera Viewfinder with Filters & Effects */
                <div className={`relative w-full h-full flex items-center justify-center ${selectedFilter.css}`}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                  />

                  {/* Fallback Animated Creator Grid if Webcam is Simulated/Inactive */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 flex flex-col items-center justify-center pointer-events-none">
                    <div className="p-4 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/15 text-center flex flex-col items-center gap-2 max-w-[260px] shadow-2xl animate-in fade-in">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-rose-500 flex items-center justify-center text-white shadow-lg">
                        <Camera className="w-6 h-6 animate-pulse" />
                      </div>
                      <span className="text-xs font-bold text-white tracking-wider">TikTok Live Viewfinder</span>
                      <span className="text-[10px] text-slate-300">
                        {isRecording ? `🔴 Recording at ${speed}x speed` : 'Ready to capture 1080p vertical reel'}
                      </span>
                    </div>
                  </div>

                  {/* Flash / Ring Light Overlay Simulation */}
                  {flashLightOn && (
                    <div className="absolute inset-0 pointer-events-none ring-[16px] ring-yellow-200/80 bg-yellow-100/10 backdrop-brightness-125 z-10 transition-all duration-300" />
                  )}

                  {/* Active Effect Overlay (e.g. Sparkles, Cyber Glitch, Hearts) */}
                  {selectedEffect.id === 'sparkles' && (
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#ffd700_1px,transparent_1px)] [background-size:24px_24px] opacity-60 animate-pulse z-10" />
                  )}
                  {selectedEffect.id === 'cyber_glitch' && (
                    <div className="absolute inset-0 pointer-events-none bg-cyan-500/10 mix-blend-color-dodge animate-pulse z-10 border-y-2 border-cyan-400/40" />
                  )}
                  {selectedEffect.id === 'heart_burst' && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30 z-10">
                      <Flame className="w-48 h-48 text-rose-500 animate-bounce" />
                    </div>
                  )}
                </div>
              )}

              {/* Big Hands-free Countdown Overlay (3... 2... 1...) */}
              {countingDownNumber !== null && (
                <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center animate-in zoom-in-50">
                  <div className="w-32 h-32 rounded-full bg-rose-600/90 text-white flex items-center justify-center text-6xl font-black shadow-[0_0_60px_rgba(225,29,72,0.8)] animate-ping">
                    {countingDownNumber === 0 ? 'GO!' : countingDownNumber}
                  </div>
                  <span className="text-white font-extrabold text-lg mt-6 drop-shadow">Get Ready!</span>
                </div>
              )}
            </div>

            {/* ===================================================================== */}
            {/* TOP BAR: Segments Progress Bar + Sound Pill + Close Button            */}
            {/* ===================================================================== */}
            <div className="relative z-20 pt-3 px-3 flex flex-col gap-2.5">
              
              {/* Multi-Clip Segment Progress Bar (TikTok iconic multi-clip indicator) */}
              <div className="w-full h-1.5 bg-white/25 rounded-full overflow-hidden flex gap-0.5">
                {/* Previous saved clips */}
                {recordedClips.map((c, i) => (
                  <div
                    key={i}
                    style={{ width: `${(c.duration / maxDuration) * 100}%` }}
                    className="h-full bg-cyan-400 rounded-full"
                  />
                ))}
                {/* Active recording progress */}
                {isRecording && (
                  <div
                    style={{ width: `${(recordingSeconds / maxDuration) * 100}%` }}
                    className="h-full bg-rose-500 animate-pulse rounded-full"
                  />
                )}
              </div>

              <div className="flex items-center justify-between">
                {/* Close Studio Button */}
                <button
                  onClick={() => {
                    soundEffects.playTapSound();
                    onClose();
                  }}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 transition-transform active:scale-90"
                  title="Close Creator Studio"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Iconic TikTok "Add Sound" Pill */}
                <button
                  onClick={() => {
                    soundEffects.playTapSound();
                    setShowSoundPicker(true);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xl border border-white/20 flex items-center gap-2 text-xs font-bold shadow-lg transition-transform active:scale-95"
                >
                  <Music className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                  <span className="truncate max-w-[130px]">{selectedSound.title}</span>
                </button>

                {/* Flip Camera Tool in Top Bar */}
                <button
                  onClick={handleFlipCamera}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 transition-transform active:scale-90"
                  title="Flip Camera (Front/Back)"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* RIGHT FLOATING TOOLBAR: Speed, Beauty, Filters, Timer, Flash, Effects */}
            {/* ===================================================================== */}
            <div className="relative z-20 self-end mr-3 flex flex-col items-center gap-3.5 py-2">
              
              {/* 1. Flip Camera */}
              <button
                onClick={handleFlipCamera}
                className="flex flex-col items-center gap-1 text-white group"
              >
                <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-rose-600 transition-all shadow-lg">
                  <RotateCcw className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-bold drop-shadow">Flip</span>
              </button>

              {/* 2. Speed Modifier */}
              <button
                onClick={() => {
                  soundEffects.playTapSound();
                  setShowSpeedBar(!showSpeedBar);
                }}
                className={`flex flex-col items-center gap-1 text-white group ${speed !== 1 ? 'text-cyan-400' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-lg ${
                  showSpeedBar || speed !== 1 ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-black/50 group-hover:bg-cyan-500/80'
                }`}>
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold drop-shadow">{speed}x</span>
              </button>

              {/* 3. Beauty / Retouch */}
              <button
                onClick={() => {
                  soundEffects.playTapSound();
                  setShowBeautyDrawer(true);
                }}
                className="flex flex-col items-center gap-1 text-white group"
              >
                <div className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-lg ${
                  isBeautyOn ? 'bg-rose-500/80 text-white' : 'bg-black/50 group-hover:bg-rose-500/80'
                }`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold drop-shadow">Beauty</span>
              </button>

              {/* 4. Filters */}
              <button
                onClick={() => {
                  soundEffects.playTapSound();
                  setShowFilterDrawer(true);
                }}
                className="flex flex-col items-center gap-1 text-white group"
              >
                <div className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-lg ${
                  selectedFilter.id !== 'normal' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-black/50 group-hover:bg-amber-500'
                }`}>
                  <Palette className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold drop-shadow">Filters</span>
              </button>

              {/* 5. Timer (3s / 10s hands-free) */}
              <button
                onClick={() => {
                  soundEffects.playTapSound();
                  setShowTimerModal(true);
                }}
                className="flex flex-col items-center gap-1 text-white group"
              >
                <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-purple-600 transition-all shadow-lg">
                  <Timer className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-bold drop-shadow">Timer</span>
              </button>

              {/* 6. Flash / Ring Light */}
              <button
                onClick={() => {
                  soundEffects.playTapSound();
                  setFlashLightOn(!flashLightOn);
                }}
                className={`flex flex-col items-center gap-1 text-white group ${flashLightOn ? 'text-yellow-300' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-lg ${
                  flashLightOn ? 'bg-yellow-400 text-slate-950 font-black' : 'bg-black/50 group-hover:bg-yellow-400/80'
                }`}>
                  <Sun className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold drop-shadow">Flash</span>
              </button>

              {/* 7. AI Script & Hook Studio */}
              <button
                onClick={() => {
                  soundEffects.playSparkleSound();
                  if (onOpenAiStudio) onOpenAiStudio();
                  else handleGenerateAiHook();
                }}
                className="flex flex-col items-center gap-1 text-purple-300 group"
              >
                <div className="w-10 h-10 rounded-full bg-purple-600/80 backdrop-blur-md border border-purple-400 flex items-center justify-center group-hover:scale-110 transition-all shadow-lg shadow-purple-600/40">
                  <Wand2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-black drop-shadow">AI Assist</span>
              </button>
            </div>

            {/* Horizontal Speed Bar Overlay (if toggled) */}
            {showSpeedBar && (
              <div className="relative z-20 mx-4 py-2 px-3 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-around animate-in slide-in-from-right duration-200">
                {[0.3, 0.5, 1, 2, 3].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      soundEffects.playTapSound();
                      setSpeed(val);
                      setShowSpeedBar(false);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                      speed === val ? 'bg-cyan-400 text-slate-950 scale-110 shadow-md' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {val}x
                  </button>
                ))}
              </div>
            )}

            {/* Gradient Selector for Text Story Mode */}
            {cameraMode === 'text' && (
              <div className="relative z-20 mx-4 py-2 px-3 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-around">
                {GRADIENT_PRESETS.map((g, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      soundEffects.playTapSound();
                      setSelectedGradient(g);
                    }}
                    className={`w-7 h-7 rounded-full bg-gradient-to-tr ${g} ring-2 transition-transform ${
                      selectedGradient === g ? 'ring-white scale-125' : 'ring-transparent'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* ===================================================================== */}
            {/* BOTTOM DOCK: Effects Button + Record Button + Gallery Upload Button   */}
            {/* ===================================================================== */}
            <div className="relative z-20 pb-4 pt-2 flex flex-col gap-3">
              
              {/* Main Record Control Trio */}
              <div className="flex items-center justify-around px-6">
                
                {/* 1. Effects Gallery Button (Left) */}
                <button
                  onClick={() => {
                    soundEffects.playTapSound();
                    setShowEffectsDrawer(true);
                  }}
                  className="flex flex-col items-center gap-1 text-white group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg">
                    <span className="text-xl">{selectedEffect.icon}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-200">Effects</span>
                </button>

                {/* 2. ICONIC BIG TIKTOK RED RECORD BUTTON (Center) */}
                <div className="relative flex items-center justify-center">
                  {cameraMode === 'photo' ? (
                    /* Photo Snapshot Shutter Button */
                    <button
                      onClick={handleTakeSnapshot}
                      className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1.5 transition-transform active:scale-90 shadow-2xl"
                    >
                      <div className="w-full h-full bg-white rounded-full transition-all" />
                    </button>
                  ) : (
                    /* Video Record Button with Pulsing Red Ring */
                    <button
                      onClick={isRecording ? handleStopRecording : handleStartRecording}
                      className={`relative w-20 h-20 rounded-full border-4 flex items-center justify-center p-1.5 transition-all shadow-2xl ${
                        isRecording ? 'border-rose-500 animate-pulse scale-105' : 'border-white hover:scale-105'
                      }`}
                    >
                      <div
                        className={`transition-all duration-300 ${
                          isRecording
                            ? 'w-7 h-7 bg-rose-600 rounded-lg'
                            : 'w-full h-full bg-rose-600 rounded-full hover:bg-rose-500'
                        }`}
                      />
                    </button>
                  )}

                  {/* Proceed to Edit / Checkmark Button (if clips exist or recording completed) */}
                  {(recordedClips.length > 0 || recordingSeconds > 0) && !isRecording && (
                    <button
                      onClick={handleDoneRecording}
                      className="absolute -right-14 w-11 h-11 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-600/40 animate-in zoom-in-50 transition-transform active:scale-95"
                      title="Next: Edit & Post"
                    >
                      <Check className="w-6 h-6 stroke-[3]" />
                    </button>
                  )}

                  {/* Delete Last Clip Button (if clips recorded) */}
                  {recordedClips.length > 0 && !isRecording && (
                    <button
                      onClick={() => {
                        soundEffects.playTapSound();
                        setRecordedClips((prev) => prev.slice(0, -1));
                        setRecordingSeconds(0);
                      }}
                      className="absolute -left-14 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-slate-300 flex items-center justify-center border border-white/20 shadow-lg transition-transform active:scale-95"
                      title="Delete Last Clip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* 3. Upload Gallery Button (Right) */}
                <button
                  onClick={() => {
                    soundEffects.playTapSound();
                    setShowUploadGallery(true);
                  }}
                  className="flex flex-col items-center gap-1 text-white group"
                >
                  <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
                    <img
                      src={carouselPhotos[0] || currentUser.avatar}
                      alt="Upload"
                      className="w-full h-full rounded-[14px] object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Upload className="w-4 h-4 text-white drop-shadow" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-200">Upload</span>
                </button>
              </div>

              {/* TikTok Modes Carousel Strip: 15s • 60s • 10m • Photo • Text • Templates */}
              <div className="flex items-center justify-center gap-5 overflow-x-auto no-scrollbar py-1 text-xs font-black tracking-wider uppercase">
                {[
                  { id: '15s', label: '15s' },
                  { id: '60s', label: '60s' },
                  { id: '10m', label: '10m' },
                  { id: 'photo', label: 'Photo' },
                  { id: 'text', label: 'Text Story' },
                  { id: 'templates', label: 'Templates' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      soundEffects.playTapSound();
                      setCameraMode(mode.id as any);
                      if (mode.id === 'text') setMediaType('text');
                      else if (mode.id === 'photo') setMediaType('image');
                      else setMediaType('video');
                    }}
                    className={`transition-all whitespace-nowrap ${
                      cameraMode === mode.id
                        ? 'text-white scale-110 border-b-2 border-white pb-0.5'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 2: TIKTOK POST & EDIT REVIEW SCREEN                                 */}
        {/* ========================================================================= */}
        {stage === 'edit_post' && (
          <div className="relative w-full h-full flex flex-col justify-between bg-slate-950 overflow-y-auto">
            
            {/* Top Navigation Bar in Post Editor */}
            <div className="sticky top-0 z-30 px-4 py-3 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  soundEffects.playTapSound();
                  setStage('camera');
                }}
                className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Camera
              </button>
              <span className="text-sm font-black text-white">Post Studio</span>
              <button
                onClick={() => {
                  soundEffects.playSparkleSound();
                  handleGenerateAiHook();
                }}
                className="px-2.5 py-1 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/40 text-[11px] font-bold flex items-center gap-1 hover:bg-purple-600 hover:text-white transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" /> AI Hook
              </button>
            </div>

            {/* Main Post Editor Content */}
            <div className="p-4 flex flex-col gap-4 flex-1">
              
              {/* Media Preview Stage + Interactive Text Overlays */}
              <div className="relative w-full h-72 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center group">
                
                {mediaType === 'text' ? (
                  <div className={`w-full h-full bg-gradient-to-tr ${selectedGradient} flex items-center justify-center p-6 text-center`}>
                    <p className="text-white font-black text-base drop-shadow-md max-w-xs">{caption}</p>
                  </div>
                ) : (
                  <img
                    src={carouselPhotos[currentPhotoIdx] || capturedMediaUrl}
                    alt="Preview"
                    className={`w-full h-full object-cover ${selectedFilter.css}`}
                  />
                )}

                {/* Interactive Drag/Repositionable Text Stickers */}
                {textStickers.map((st) => (
                  <div
                    key={st.id}
                    style={{ top: `${st.y}%`, left: `${st.x}%` }}
                    className={`absolute z-10 text-white ${st.style} select-none shadow-2xl flex items-center gap-1.5`}
                  >
                    <span>{st.text}</span>
                    <button
                      onClick={() => setTextStickers((prev) => prev.filter((item) => item.id !== st.id))}
                      className="p-0.5 rounded-full hover:bg-white/20 text-white/70 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Multi-Photo Carousel Indicators & Arrows if multiple photos */}
                {carouselPhotos.length > 1 && mediaType === 'image' && (
                  <>
                    <button
                      onClick={() => setCurrentPhotoIdx((prev) => (prev > 0 ? prev - 1 : carouselPhotos.length - 1))}
                      className="absolute left-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPhotoIdx((prev) => (prev < carouselPhotos.length - 1 ? prev + 1 : 0))}
                      className="absolute right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
                      {carouselPhotos.map((_, pIdx) => (
                        <div
                          key={pIdx}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            currentPhotoIdx === pIdx ? 'bg-white w-4' : 'bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Floating On-Screen Editor Tools Overlay */}
                <div className="absolute right-3 top-3 flex flex-col gap-2 z-20">
                  <button
                    onClick={() => setShowTextEditor(!showTextEditor)}
                    className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black"
                    title="Add Text Sticker"
                  >
                    <Type className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      soundEffects.playTapSound();
                      setShowFilterDrawer(true);
                    }}
                    className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black"
                    title="Change Filter"
                  >
                    <Palette className="w-4 h-4" />
                  </button>
                </div>

                {/* Sound Pill Overlay */}
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5">
                  <Music className="w-3 h-3 text-cyan-400 animate-spin" />
                  <span className="truncate max-w-[140px]">{selectedSound.title}</span>
                </div>
              </div>

              {/* Text Sticker Prompt Input (if toggled) */}
              {showTextEditor && (
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center gap-2 animate-in slide-in-from-top-2">
                  <input
                    type="text"
                    value={newStickerText}
                    onChange={(e) => setNewStickerText(e.target.value)}
                    placeholder="Enter on-screen text sticker..."
                    className="flex-1 bg-slate-950 text-white text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-rose-500"
                  />
                  <button
                    onClick={handleAddTextSticker}
                    className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shrink-0"
                  >
                    Add Sticker
                  </button>
                </div>
              )}

              {/* Caption & Hashtag Input Box */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Caption & Viral Hashtags</span>
                  <span className="text-[10px] text-slate-500">{caption.length}/2200</span>
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Describe your video, add hooks, or ask a question..."
                  rows={3}
                  className="w-full bg-slate-900 text-white text-xs p-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:border-rose-500 resize-none leading-relaxed"
                />

                {/* 1-Tap Viral Hashtag Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-0.5 shrink-0">
                    <Hash className="w-3 h-3 text-rose-400" /> Viral:
                  </span>
                  {VIRAL_HASHTAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleAddHashtag(tag)}
                      className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-[10px] font-bold border border-slate-800 transition-colors shrink-0"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* TikTok Settings Section (Who Can View, Comments, Duet, Quality) */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3 text-xs">
                
                {/* Privacy Setting */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>Who can watch this video</span>
                  </div>
                  <select
                    value={postPrivacy}
                    onChange={(e) => setPostPrivacy(e.target.value as any)}
                    className="bg-slate-950 text-white text-xs font-bold py-1 px-2.5 rounded-xl border border-slate-800 focus:outline-none"
                  >
                    <option value="public">Everyone (Public)</option>
                    <option value="friends">Friends only</option>
                    <option value="private">Only Me (Private)</option>
                  </select>
                </div>

                {/* Allow Comments Switch */}
                <div className="flex items-center justify-between border-t border-slate-800/60 pt-2.5">
                  <span className="text-slate-300">Allow comments</span>
                  <button
                    onClick={() => setAllowComments(!allowComments)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      allowComments ? 'bg-rose-600' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        allowComments ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Allow Duet & Stitch */}
                <div className="flex items-center justify-between border-t border-slate-800/60 pt-2.5">
                  <span className="text-slate-300">Allow Duet & Stitch</span>
                  <button
                    onClick={() => setAllowDuet(!allowDuet)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      allowDuet ? 'bg-rose-600' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        allowDuet ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* High-Quality Uploads */}
                <div className="flex items-center justify-between border-t border-slate-800/60 pt-2.5">
                  <span className="text-slate-300">Allow high-quality uploads</span>
                  <button
                    onClick={() => setHighQualityUpload(!highQualityUpload)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      highQualityUpload ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        highQualityUpload ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Sticky Action Buttons (Drafts + Post) */}
            <div className="sticky bottom-0 z-30 p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
              <button
                onClick={() => {
                  soundEffects.playTapSound();
                  onClose();
                }}
                className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 transition-colors"
              >
                Save Draft
              </button>
              <button
                onClick={handleFinalPublish}
                className="flex-2 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm transition-transform active:scale-95 shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                Post to Feed
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODAL 1: TIKTOK TRENDING SOUND PICKER DRAWER                          */}
        {/* ========================================================================= */}
        {showSoundPicker && (
          <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between animate-in slide-in-from-bottom duration-200">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm font-extrabold text-white">Select Sound / Music</h3>
              </div>
              <button
                onClick={() => setShowSoundPicker(false)}
                className="p-1 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-2.5">
              {TRENDING_SOUNDS.map((sound) => {
                const isSelected = selectedSound.id === sound.id;
                return (
                  <div
                    key={sound.id}
                    onClick={() => {
                      soundEffects.playTapSound();
                      setSelectedSound(sound);
                    }}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-950/40 border-rose-500 text-white shadow-lg'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
                        <Music className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">{sound.title}</span>
                          {sound.isTrending && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-600/30 text-rose-300 text-[9px] font-black uppercase">
                              Viral
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{sound.artist} • {sound.duration}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundEffects.playTapSound();
                        setSelectedSound(sound);
                        setShowSoundPicker(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                        isSelected ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Use'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950">
              <button
                onClick={() => setShowSoundPicker(false)}
                className="w-full py-3 rounded-2xl bg-rose-600 text-white font-bold text-xs shadow-lg"
              >
                Confirm Sound
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODAL 2: TIKTOK FILTERS DRAWER                                        */}
        {/* ========================================================================= */}
        {showFilterDrawer && (
          <div className="absolute inset-x-0 bottom-0 z-50 bg-slate-950/95 border-t border-slate-800 rounded-t-3xl p-4 flex flex-col gap-3 backdrop-blur-xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white">Visual Filters</span>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="p-1 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
              {FILTER_PRESETS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    soundEffects.playTapSound();
                    setSelectedFilter(f);
                  }}
                  className="flex flex-col items-center gap-1.5 shrink-0 group"
                >
                  <div className={`w-14 h-14 rounded-2xl ${f.previewColor} border-2 flex items-center justify-center text-white transition-transform ${
                    selectedFilter.id === f.id ? 'border-rose-500 scale-105 shadow-lg shadow-rose-600/30' : 'border-transparent group-hover:scale-95'
                  }`}>
                    {selectedFilter.id === f.id && <Check className="w-5 h-5 stroke-[3]" />}
                  </div>
                  <span className={`text-[10px] font-bold ${selectedFilter.id === f.id ? 'text-rose-400' : 'text-slate-400'}`}>
                    {f.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODAL 3: TIKTOK EFFECTS DRAWER                                        */}
        {/* ========================================================================= */}
        {showEffectsDrawer && (
          <div className="absolute inset-x-0 bottom-0 z-50 bg-slate-950/95 border-t border-slate-800 rounded-t-3xl p-4 flex flex-col gap-3 backdrop-blur-xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white">Special Effects</span>
              <button
                onClick={() => setShowEffectsDrawer(false)}
                className="p-1 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2.5 py-1">
              {EFFECTS_PRESETS.map((eff) => (
                <button
                  key={eff.id}
                  onClick={() => {
                    soundEffects.playSparkleSound();
                    setSelectedEffect(eff);
                    setShowEffectsDrawer(false);
                  }}
                  className={`p-2 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                    selectedEffect.id === eff.id
                      ? 'bg-rose-950/50 border-rose-500 text-white shadow-lg'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl">{eff.icon}</span>
                  <span className="text-[10px] font-bold truncate max-w-full">{eff.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODAL 4: BEAUTY / RETOUCH DRAWER                                      */}
        {/* ========================================================================= */}
        {showBeautyDrawer && (
          <div className="absolute inset-x-0 bottom-0 z-50 bg-slate-950/95 border-t border-slate-800 rounded-t-3xl p-4 flex flex-col gap-4 backdrop-blur-xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-black text-white">Beauty & AI Retouch</span>
              </div>
              <button
                onClick={() => setShowBeautyDrawer(false)}
                className="p-1 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Smooth skin & studio lighting</span>
                <span className="font-mono text-rose-400 font-bold">{beautyRetouch}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={beautyRetouch}
                onChange={(e) => setBeautyRetouch(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>

            <button
              onClick={() => {
                soundEffects.playTapSound();
                setIsBeautyOn(!isBeautyOn);
              }}
              className={`w-full py-2.5 rounded-xl text-xs font-black transition-all ${
                isBeautyOn ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isBeautyOn ? 'Beauty Enabled ✨' : 'Beauty Off'}
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODAL 5: TIMER / COUNTDOWN MODAL                                      */}
        {/* ========================================================================= */}
        {showTimerModal && (
          <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col gap-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-purple-400" />
                  <h4 className="text-sm font-black text-white">Hands-Free Countdown</h4>
                </div>
                <button
                  onClick={() => setShowTimerModal(false)}
                  className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Set a countdown timer before recording starts automatically.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleStartTimerCountdown(3)}
                  className="py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm flex items-center justify-center gap-1 shadow-lg shadow-purple-600/30 transition-transform active:scale-95"
                >
                  <Timer className="w-4 h-4" /> 3 Seconds
                </button>
                <button
                  onClick={() => handleStartTimerCountdown(10)}
                  className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm flex items-center justify-center gap-1 border border-slate-700 transition-transform active:scale-95"
                >
                  <Timer className="w-4 h-4" /> 10 Seconds
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODAL 6: UPLOAD GALLERY & VIRAL MEDIA PRESETS                         */}
        {/* ========================================================================= */}
        {showUploadGallery && (
          <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between animate-in slide-in-from-bottom duration-200">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm font-extrabold text-white">Upload Media or Choose Preset</h3>
              </div>
              <button
                onClick={() => setShowUploadGallery(false)}
                className="p-1 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4">
              
              {/* Custom Device Upload Trigger */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 rounded-3xl border-2 border-dashed border-rose-500/50 hover:border-rose-400 bg-rose-950/20 hover:bg-rose-950/30 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group shadow-xl"
              >
                <div className="w-12 h-12 rounded-full bg-rose-600/30 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-black text-white">Select Video or Photos from Device</span>
                <span className="text-[10px] text-slate-400">Supports multi-photo swipe carousels & vertical reels</span>
              </div>

              {/* Curated Viral Presets */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  🔥 Viral Creator Preset Packs
                </span>

                <div className="grid grid-cols-1 gap-2.5">
                  {VIRAL_MEDIA_PRESETS.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500 transition-all cursor-pointer flex items-center justify-between group shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-4 shrink-0">
                          {preset.urls.slice(0, 2).map((u, ui) => (
                            <img
                              key={ui}
                              src={u}
                              alt="thumbnail"
                              className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-900"
                            />
                          ))}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-extrabold text-white group-hover:text-rose-400 transition-colors">
                            {preset.title}
                          </span>
                          <span className="text-[10px] text-slate-400">{preset.category} • {preset.urls.length} media items</span>
                        </div>
                      </div>

                      <button className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold shrink-0">
                        Use Pack
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950">
              <button
                onClick={() => setShowUploadGallery(false)}
                className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
