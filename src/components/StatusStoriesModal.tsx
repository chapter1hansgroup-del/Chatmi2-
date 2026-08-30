import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Images,
  Eye,
  Send,
  Sparkles,
  Radio,
  Users,
  Play,
  Pause,
  Wifi,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Coins,
  Flame,
  TrendingUp,
  Clock,
  History,
  Check,
  Volume2,
  VolumeX,
  Award,
  BarChart3,
  CheckCircle2,
  PlusCircle,
  Download,
  Smile,
  Filter,
  ThumbsUp,
  Wand2,
  Zap,
  SlidersHorizontal,
  Layers,
  Headphones,
  Copy,
  ArrowRight,
  RefreshCw,
  Gift,
  Gauge,
  Video,
  MessageSquare,
  Star,
  PhoneCall,
  Maximize2,
  Minimize2,
  Info,
  ExternalLink,
  ShieldCheck,
  EyeOff,
  ShoppingBag,
  Tag,
  AlertCircle,
  BadgeCheck,
  Building2,
  UserCheck,
  DollarSign,
  Inbox,
} from 'lucide-react';
import { StatusStory, LiveStream, PostlyVideo, User } from '../types';
import { MOCK_POSTLY_VIDEOS } from '../data/mockData';
import { soundEffects } from '../utils/audio';
import { PostlyRightBar } from './PostlyRightBar';
import { PostlyVerificationModal } from './PostlyVerificationModal';
import { TikTokCreatorStudio } from './TikTokCreatorStudio';
import { PostlyCreatorProfileModal } from './PostlyCreatorProfileModal';
import { PostlyInboxView } from './PostlyInboxView';
import { PostlyDirectChatModal, PostlyConversation, PostlyDirectMessage } from './PostlyDirectChatModal';

interface StatusStoriesModalProps {
  stories: StatusStory[];
  liveStreams?: LiveStream[];
  currentUser: User;
  onClose: () => void;
  onAddStory: (story: Omit<StatusStory, 'id' | 'timestamp' | 'viewers'>) => void;
  onReplyToStory: (story: StatusStory, replyMessage: string) => void;
  onStartGoLive: (mode: 'host' | 'viewer', stream?: LiveStream) => void;
  onNavigateToTab?: (tab: 'chats' | 'stories' | 'starred' | 'calls' | 'ai') => void;
}

type VisualFilter = 'normal' | 'cyberpunk' | 'golden_hour' | 'vhs_glitch' | 'noir' | 'crystal';

interface HeartBurst {
  id: string;
  x: number;
  y: number;
}

export const StatusStoriesModal: React.FC<StatusStoriesModalProps> = ({
  stories,
  liveStreams = [],
  currentUser,
  onClose,
  onAddStory,
  onReplyToStory,
  onStartGoLive,
  onNavigateToTab,
}) => {
  // Postly Videos state
  const [videos, setVideos] = useState<PostlyVideo[]>(MOCK_POSTLY_VIDEOS);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Watch History state
  const [watchHistory, setWatchHistory] = useState<{ video: PostlyVideo; viewedAt: string }[]>([
    { video: MOCK_POSTLY_VIDEOS[0], viewedAt: '10m ago' },
  ]);

  // Tab state: 'foryou' | 'sponsored' | 'history' | 'saved' | 'analytics' | 'live' | 'create' | 'ai_studio' | 'duet' | 'inbox'
  const [activeTab, setActiveTab] = useState<
    'foryou' | 'sponsored' | 'history' | 'saved' | 'analytics' | 'live' | 'create' | 'ai_studio' | 'duet' | 'inbox'
  >('foryou');

  // Postly Isolated Direct Messages / Inbox State (NEVER touches private chats)
  const [postlyConversations, setPostlyConversations] = useState<PostlyConversation[]>(() => {
    try {
      const saved = localStorage.getItem('postly_conversations_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'conv_sophia',
        creatorId: 'user_sophia',
        creatorName: 'Sophia Chen',
        creatorUsername: 'sophia_c',
        creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        isVerified: true,
        verificationType: 'individual',
        lastMessage: 'Hey! Loved your feedback on the Gemini multimodal live demo. Let’s do a collab stream soon! 🚀',
        lastMessageTime: '12m ago',
        unreadCount: 1,
        category: 'collab',
        messages: [
          {
            id: 'm1',
            senderId: 'user_sophia',
            senderName: 'Sophia Chen',
            senderUsername: 'sophia_c',
            senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            text: 'Hey! Loved your feedback on the Gemini multimodal live demo. Let’s do a collab stream soon! 🚀',
            timestamp: '12m ago',
            createdAt: Date.now() - 1000 * 60 * 12,
            isRead: false,
            isFromCreator: true,
          },
        ],
      },
      {
        id: 'conv_elena',
        creatorId: 'user_elena',
        creatorName: 'Elena Rostova',
        creatorUsername: 'elena_design',
        creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
        isVerified: true,
        verificationType: 'individual',
        lastMessage: 'Thanks for checking out the glassmorphism UI tokens! What do you think of the new glow radii?',
        lastMessageTime: '1h ago',
        unreadCount: 0,
        category: 'creator',
        messages: [
          {
            id: 'm2',
            senderId: 'user_elena',
            senderName: 'Elena Rostova',
            senderUsername: 'elena_design',
            senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
            text: 'Thanks for checking out the glassmorphism UI tokens! What do you think of the new glow radii?',
            timestamp: '1h ago',
            createdAt: Date.now() - 1000 * 60 * 60,
            isRead: true,
            isFromCreator: true,
          },
        ],
      },
      {
        id: 'conv_system',
        creatorId: 'user_system',
        creatorName: 'Postly Creator Network',
        creatorUsername: 'postly_official',
        creatorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
        isVerified: true,
        verificationType: 'company',
        lastMessage: '🔒 Welcome to Postly Creator DMs! All messages here are kept strictly on Postly and never appear in your private personal chats.',
        lastMessageTime: 'Yesterday',
        unreadCount: 0,
        category: 'system',
        messages: [
          {
            id: 'm3',
            senderId: 'user_system',
            senderName: 'Postly Creator Network',
            senderUsername: 'postly_official',
            senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
            text: '🔒 Welcome to Postly Creator DMs! All messages here are kept strictly on Postly and never appear in your private personal chats.',
            timestamp: 'Yesterday',
            createdAt: Date.now() - 1000 * 60 * 60 * 24,
            isRead: true,
            isFromCreator: true,
          },
        ],
      },
    ];
  });

  // Save Postly direct messages to localStorage (Strictly separated from private chats)
  useEffect(() => {
    try {
      localStorage.setItem('postly_conversations_v2', JSON.stringify(postlyConversations));
    } catch (e) {}
  }, [postlyConversations]);

  // Selected Creator for Postly Direct Chat
  const [selectedDirectChatCreatorId, setSelectedDirectChatCreatorId] = useState<string | null>(null);

  // Send Postly Direct Message Handler
  const handleSendPostlyDirectMessage = (creatorId: string, text: string) => {
    const isMe = true;
    const now = new Date();
    const timeString = 'Just now';

    setPostlyConversations((prev) => {
      const existingConvIndex = prev.findIndex((c) => c.creatorId === creatorId);

      const newMsg: PostlyDirectMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderUsername: currentUser.username || currentUser.name.toLowerCase().replace(/\s+/g, '_'),
        senderAvatar: currentUser.avatar,
        text,
        timestamp: timeString,
        createdAt: Date.now(),
        isRead: true,
        isFromCreator: false,
      };

      if (existingConvIndex !== -1) {
        const updated = [...prev];
        const conv = updated[existingConvIndex];
        updated[existingConvIndex] = {
          ...conv,
          lastMessage: text,
          lastMessageTime: timeString,
          messages: [...conv.messages, newMsg],
        };
        return updated;
      }

      // Create new conversation if none exists
      const targetVideo = videos.find((v) => v.userId === creatorId);
      const creatorName = targetVideo ? targetVideo.userName : 'Creator';
      const creatorUsername = targetVideo ? targetVideo.userUsername : 'creator';
      const creatorAvatar = targetVideo ? targetVideo.userAvatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
      const isVerified = targetVideo ? targetVideo.isVerified : false;
      const verificationType = targetVideo ? targetVideo.verificationType : 'individual';

      const newConv: PostlyConversation = {
        id: `conv_${creatorId}_${Date.now()}`,
        creatorId,
        creatorName,
        creatorUsername,
        creatorAvatar,
        isVerified,
        verificationType,
        lastMessage: text,
        lastMessageTime: timeString,
        unreadCount: 0,
        category: 'creator',
        messages: [newMsg],
      };

      return [newConv, ...prev];
    });
  };

  // Creator Profile Modal state
  const [selectedProfileCreatorId, setSelectedProfileCreatorId] = useState<string | null>(null);

  // Ad & Sponsor State (Strictly isolated to Postly - Zero chat interruptions)
  const [showAdInfoModal, setShowAdInfoModal] = useState(false);
  const [showAdCtaModal, setShowAdCtaModal] = useState(false);
  const [selectedAdForModal, setSelectedAdForModal] = useState<PostlyVideo | null>(null);
  const [hiddenAdIds, setHiddenAdIds] = useState<string[]>([]);

  // Video playback simulation controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [activeFilter, setActiveFilter] = useState<VisualFilter>('normal');
  const [showFilterPicker, setShowFilterPicker] = useState(false);

  // Double-tap heart bursts
  const [heartBursts, setHeartBursts] = useState<HeartBurst[]>([]);

  // Comments Sheet / Drawer
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  // Emoji Comment Section state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [commentEmojiFilter, setCommentEmojiFilter] = useState<string>('all');
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: string; emoji: string; x: number }[]>([]);

  // Creator Support Modal
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [selectedTipCoins, setSelectedTipCoins] = useState(100);
  const [tipMessage, setTipMessage] = useState('');
  const [supportSuccessMessage, setSupportSuccessMessage] = useState<string | null>(null);

  // Download Postly Video state
  const [downloadingVideoId, setDownloadingVideoId] = useState<string | null>(null);

  // Create Story / Video Form State
  const [newType, setNewType] = useState<'text' | 'image'>('text');
  const [newContent, setNewContent] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [selectedGradient, setSelectedGradient] = useState('from-violet-600 via-purple-600 to-indigo-700');

  // AI Creative Studio State
  const [aiTopic, setAiTopic] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiGeneratedData, setAiGeneratedData] = useState<{
    hooks: string[];
    hashtags: string[];
    recommendedAudio: string;
    viralScore: number;
    strategicTip: string;
  } | null>(null);

  // AI Video Summary Modal
  const [showAiSummaryModal, setShowAiSummaryModal] = useState(false);
  const [isAiSummarizing, setIsAiSummarizing] = useState(false);
  const [videoSummary, setVideoSummary] = useState<{
    takeaways: string[];
    viralScore: number;
    sentiment: string;
    category: string;
  } | null>(null);

  // Duet / Remix mode state
  const [duetNote, setDuetNote] = useState('');
  const [duetRecorded, setDuetRecorded] = useState(false);

  // Auto-hide controls & navigation on scroll to maximize post view
  const [isControlsHidden, setIsControlsHidden] = useState(false);

  // Fullscreen expanded toggle state
  const [isFullScreen, setIsFullScreen] = useState(false);

  // TikTok Creator Studio Modal State
  const [showTikTokStudio, setShowTikTokStudio] = useState(false);

  // Postly Official Verification Modal & Verified Users Registry
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verifiedUsers, setVerifiedUsers] = useState<Record<string, { tier: 'individual' | 'company' }>>({
    user_elena: { tier: 'individual' },
    user_sponsor_cloudpulse: { tier: 'company' },
    user_sponsor_lumina: { tier: 'company' },
  });
  const [verifiedBadgeInfoModal, setVerifiedBadgeInfoModal] = useState<{
    userName: string;
    tier: 'individual' | 'company';
  } | null>(null);

  const handleVerificationApproved = (tier: 'individual' | 'company') => {
    setVerifiedUsers((prev) => ({ ...prev, [currentUser.id]: { tier } }));
    setVideos((prev) =>
      prev.map((v) =>
        v.userId === currentUser.id ? { ...v, isVerified: true, verificationType: tier } : v
      )
    );
    soundEffects.playCelebrationChime();
    setSupportSuccessMessage(
      `🎉 Official Verified ${tier === 'individual' ? 'Creator' : 'Company'} Badge Activated!`
    );
    setTimeout(() => setSupportSuccessMessage(null), 4000);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<number>(0);

  const gradients = [
    'from-violet-600 via-purple-600 to-indigo-700',
    'from-emerald-600 via-teal-600 to-cyan-700',
    'from-rose-600 via-pink-600 to-orange-600',
    'from-amber-600 via-orange-600 to-yellow-600',
    'from-cyan-600 via-blue-600 to-indigo-900',
    'from-fuchsia-600 via-rose-600 to-pink-600',
  ];

  const quickEmojiPresets = [
    { emoji: '🔥', label: 'Fire' },
    { emoji: '❤️', label: 'Love' },
    { emoji: '👏', label: 'Bravo' },
    { emoji: '😂', label: 'Funny' },
    { emoji: '💯', label: '100%' },
    { emoji: '🚀', label: 'Rocket' },
    { emoji: '🤩', label: 'Wow' },
    { emoji: '🎉', label: 'Party' },
    { emoji: '💡', label: 'Smart' },
    { emoji: '🙌', label: 'Praise' },
  ];

  const fullEmojiGrid = [
    '🔥', '❤️', '💖', '👏', '😂', '💯', '🚀', '🤩', '🎉', '💡', '🙌', '🥳', '👍', '✨', '💥', '🎯',
    '😍', '😎', '🤯', '🧐', '🤖', '👾', '🌟', '⚡️', '🧠', '👑', '💎', '🍿', '🎧', '🏆', '🎁', '🤙',
  ];

  const displayVideos = activeTab === 'sponsored'
    ? videos.filter((v) => v.isSponsored && !hiddenAdIds.includes(v.id))
    : videos.filter((v) => !hiddenAdIds.includes(v.id));

  const totalPostlyUnread = postlyConversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const currentVideo = displayVideos[currentVideoIndex] || displayVideos[0] || videos[0];

  // Photo Carousel State (tracks current photo index per post ID)
  const [photoIndices, setPhotoIndices] = useState<Record<string, number>>({});

  const currentPhotos =
    currentVideo.photos && currentVideo.photos.length > 0
      ? currentVideo.photos
      : currentVideo.coverImage
      ? [currentVideo.coverImage]
      : [];

  const activePhotoIndex = photoIndices[currentVideo.id] || 0;
  const currentPhoto = currentPhotos[activePhotoIndex] || currentPhotos[0] || currentVideo.coverImage;

  const handleNextPhoto = () => {
    if (currentPhotos.length > 1) {
      setPhotoIndices((prev) => {
        const cur = prev[currentVideo.id] || 0;
        const next = (cur + 1) % currentPhotos.length;
        return { ...prev, [currentVideo.id]: next };
      });
      soundEffects.playTapSound();
    }
  };

  const handlePrevPhoto = () => {
    if (currentPhotos.length > 1) {
      setPhotoIndices((prev) => {
        const cur = prev[currentVideo.id] || 0;
        const prevIdx = cur === 0 ? currentPhotos.length - 1 : cur - 1;
        return { ...prev, [currentVideo.id]: prevIdx };
      });
      soundEffects.playTapSound();
    }
  };

  const handleSelectPhoto = (index: number) => {
    setPhotoIndices((prev) => ({ ...prev, [currentVideo.id]: index }));
    soundEffects.playClickSound();
  };

  // Touch / Drag Gesture Detection (Horizontal Photo Swipe & Vertical Reel Swipe)
  const gestureStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const [swipeDelta, setSwipeDelta] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isSwipingGesture, setIsSwipingGesture] = useState(false);

  const onGestureStart = (clientX: number, clientY: number) => {
    gestureStartRef.current = {
      x: clientX,
      y: clientY,
      time: Date.now(),
    };
    setIsSwipingGesture(true);
  };

  const onGestureMove = (clientX: number, clientY: number) => {
    if (!gestureStartRef.current) return;
    const dx = clientX - gestureStartRef.current.x;
    const dy = clientY - gestureStartRef.current.y;
    setSwipeDelta({ x: dx, y: dy });

    // The moment the user starts scrolling/swiping, hide header and bottom bars for maximum post view
    if (Math.abs(dy) > 10 || Math.abs(dx) > 12) {
      if (!isControlsHidden) {
        setIsControlsHidden(true);
      }
    }
  };

  const onGestureEnd = (clientX: number, clientY: number, targetBoundingRect?: DOMRect) => {
    if (!gestureStartRef.current) return;
    const start = gestureStartRef.current;
    const dx = clientX - start.x;
    const dy = clientY - start.y;
    const duration = Date.now() - start.time;

    gestureStartRef.current = null;
    setIsSwipingGesture(false);
    setSwipeDelta({ x: 0, y: 0 });

    const HORIZONTAL_SWIPE_THRESHOLD = 35;
    const VERTICAL_SWIPE_THRESHOLD = 45;

    // 1. Horizontal Swipe: Photo Carousel
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > HORIZONTAL_SWIPE_THRESHOLD) {
      setIsControlsHidden(true);
      if (dx < 0) {
        // Swiped left -> Next photo
        if (currentPhotos.length > 1) {
          handleNextPhoto();
        }
      } else {
        // Swiped right -> Previous photo
        if (currentPhotos.length > 1) {
          handlePrevPhoto();
        }
      }
      return;
    }

    // 2. Vertical Swipe: Next / Previous Video
    if (Math.abs(dy) >= Math.abs(dx) && Math.abs(dy) > VERTICAL_SWIPE_THRESHOLD) {
      setIsControlsHidden(true);
      if (dy < 0) {
        // Swiped up -> Next video
        handleNextVideo();
      } else {
        // Swiped down -> Previous video
        handlePrevVideo();
      }
      return;
    }

    // 3. Tap / Click
    if (Math.abs(dx) < 15 && Math.abs(dy) < 15 && duration < 350) {
      const now = Date.now();
      const DOUBLE_TAP_DELAY = 300;
      const clickX = targetBoundingRect ? clientX - targetBoundingRect.left : clientX;
      const clickY = targetBoundingRect ? clientY - targetBoundingRect.top : clientY;

      // If bars are hidden and user taps at the top area (within top 110px), bring them back
      if (isControlsHidden && clickY < 110) {
        setIsControlsHidden(false);
        soundEffects.playTapSound();
        return;
      }

      if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
        // Double tap detected -> Heart Burst!
        const burstId = `burst_${Date.now()}`;
        setHeartBursts((prev) => [...prev, { id: burstId, x: clickX, y: clickY }]);
        soundEffects.playReceiveSound();

        if (!currentVideo.isLiked) {
          handleToggleLike(currentVideo.id);
        }
        triggerFloatingEmoji('💖');

        setTimeout(() => {
          setHeartBursts((prev) => prev.filter((b) => b.id !== burstId));
        }, 1000);
      } else {
        // Single tap -> toggle playback
        setIsPlaying((prev) => !prev);
        soundEffects.playClickSound();
      }
      lastTapRef.current = now;
    }
  };

  // Track video viewing history whenever currentVideoIndex changes
  useEffect(() => {
    if (activeTab === 'foryou' && currentVideo) {
      setWatchHistory((prev) => {
        const filtered = prev.filter((item) => item.video.id !== currentVideo.id);
        return [{ video: currentVideo, viewedAt: 'Just now' }, ...filtered];
      });
    }
  }, [currentVideoIndex, activeTab]);

  // Keyboard navigation for power users (ArrowUp / ArrowDown / ArrowLeft / ArrowRight / L for like / M for mute / Space for play)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((document.activeElement?.tagName || '').toLowerCase())) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        handleNextVideo();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        handlePrevVideo();
      } else if (e.key === 'ArrowRight') {
        if (currentPhotos.length > 1) {
          e.preventDefault();
          handleNextPhoto();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentPhotos.length > 1) {
          e.preventDefault();
          handlePrevPhoto();
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
        soundEffects.playClickSound();
      } else if (e.key.toLowerCase() === 'l' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleToggleLike(currentVideo.id);
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setIsMuted((prev) => !prev);
      } else if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setShowCommentsDrawer((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVideoIndex, videos, currentVideo, currentPhotos.length]);

  const triggerFloatingEmoji = (emoji: string) => {
    const id = `f_${Date.now()}_${Math.random()}`;
    const x = Math.floor(Math.random() * 60) + 20;
    setFloatingEmojis((prev) => [...prev, { id, emoji, x }]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== id));
    }, 2200);
  };

  // Double-tap or double-click to burst heart and like
  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected!
      const burstId = `burst_${Date.now()}`;
      setHeartBursts((prev) => [...prev, { id: burstId, x: clickX, y: clickY }]);
      soundEffects.playReceiveSound();

      if (!currentVideo.isLiked) {
        handleToggleLike(currentVideo.id);
      }
      triggerFloatingEmoji('💖');

      setTimeout(() => {
        setHeartBursts((prev) => prev.filter((b) => b.id !== burstId));
      }, 1000);
    } else {
      // Single tap -> toggle playback
      setIsPlaying((prev) => !prev);
      soundEffects.playClickSound();
    }
    lastTapRef.current = now;
  };

  const handleSendQuickEmojiComment = (emoji: string, label?: string) => {
    soundEffects.playSendSound();
    triggerFloatingEmoji(emoji);

    const commentText = label ? `${emoji} ${label}!` : `${emoji}`;
    const newComment = {
      id: `c_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userStatus: currentUser.status,
      text: commentText,
      timestamp: 'Just now',
      likes: 1,
      emojiReactions: [
        { emoji, count: 1, reactedByMe: true },
        { emoji: '❤️', count: 2, reactedByMe: false },
      ],
    };

    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === currentVideo.id) {
          return {
            ...v,
            commentsCount: v.commentsCount + 1,
            comments: [newComment, ...v.comments],
          };
        }
        return v;
      })
    );
  };

  const handleToggleCommentReaction = (commentId: string, emoji: string) => {
    soundEffects.playClickSound();
    triggerFloatingEmoji(emoji);

    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === currentVideo.id) {
          const updatedComments = v.comments.map((c) => {
            if (c.id === commentId) {
              const currentReactions = c.emojiReactions || [
                { emoji: '❤️', count: 3, reactedByMe: false },
                { emoji: '🔥', count: 5, reactedByMe: false },
              ];
              const existingIdx = currentReactions.findIndex((r) => r.emoji === emoji);
              let newReactions = [...currentReactions];

              if (existingIdx !== -1) {
                const item = newReactions[existingIdx];
                if (item.reactedByMe) {
                  newReactions[existingIdx] = {
                    ...item,
                    count: Math.max(1, item.count - 1),
                    reactedByMe: false,
                  };
                } else {
                  newReactions[existingIdx] = {
                    ...item,
                    count: item.count + 1,
                    reactedByMe: true,
                  };
                }
              } else {
                newReactions.push({ emoji, count: 1, reactedByMe: true });
              }
              return { ...c, emojiReactions: newReactions };
            }
            return c;
          });
          return { ...v, comments: updatedComments };
        }
        return v;
      })
    );
  };

  // Handle Like Interaction
  const handleToggleLike = (videoId: string) => {
    soundEffects.playClickSound();
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const isLiked = !v.isLiked;
          return {
            ...v,
            isLiked,
            likes: isLiked ? v.likes + 1 : v.likes - 1,
          };
        }
        return v;
      })
    );
  };

  // Handle Save / Watch Later Interaction
  const handleToggleSave = (videoId: string) => {
    soundEffects.playClickSound();
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          return { ...v, isSaved: !v.isSaved };
        }
        return v;
      })
    );
  };

  // Handle Download Postly Video / Post
  const handleDownloadVideo = async (video: PostlyVideo) => {
    soundEffects.playSendSound();
    setDownloadingVideoId(video.id);

    try {
      if (video.coverImage) {
        const res = await fetch(video.coverImage);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Postly_${video.userUsername}_${video.id}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const textContent = `Postly Post by ${video.userName} (@${video.userUsername})\nCaption: ${video.caption}\nAudio: ${video.audioTrack || 'Original Sound'}\nHashtags: ${video.hashtags?.join(' ') || ''}\nPosted: ${video.postedAt}\n`;
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Postly_${video.userUsername}_${video.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch {
      const textContent = `Postly Post by ${video.userName} (@${video.userUsername})\nCaption: ${video.caption}\nAudio: ${video.audioTrack || ''}\nImage URL: ${video.coverImage || 'None'}\n`;
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Postly_${video.userUsername}_${video.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === video.id) {
          return { ...v, downloads: (v.downloads || 0) + 1 };
        }
        return v;
      })
    );

    setTimeout(() => {
      setDownloadingVideoId(null);
      setSupportSuccessMessage(`📥 Postly post downloaded! Saved to your downloads folder.`);
      setTimeout(() => setSupportSuccessMessage(null), 3500);
    }, 800);
  };

  // Handle Follow Creator Toggle
  const handleToggleFollow = (userId: string) => {
    soundEffects.playSendSound();
    setVideos((prev) =>
      prev.map((v) => {
        if (v.userId === userId) {
          return { ...v, isFollowing: !v.isFollowing };
        }
        return v;
      })
    );
  };

  // Handle Send Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    soundEffects.playSendSound();

    const match = commentInput.match(/\p{Extended_Pictographic}/u);
    if (match) {
      triggerFloatingEmoji(match[0]);
    } else {
      triggerFloatingEmoji('💬');
    }

    const newComment = {
      id: `c_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userStatus: currentUser.status,
      text: commentInput,
      timestamp: 'Just now',
      likes: 1,
      emojiReactions: [
        { emoji: '❤️', count: 1, reactedByMe: true },
        { emoji: '🔥', count: 1, reactedByMe: false },
      ],
    };

    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === currentVideo.id) {
          return {
            ...v,
            commentsCount: v.commentsCount + 1,
            comments: [newComment, ...v.comments],
          };
        }
        return v;
      })
    );

    setCommentInput('');
    setShowEmojiPicker(false);
  };

  // Handle Creator Support Tip
  const handleSendCreatorSupport = () => {
    soundEffects.playCashSound();
    soundEffects.playLevelUp();
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === currentVideo.id) {
          return { ...v, supportReceived: v.supportReceived + selectedTipCoins };
        }
        return v;
      })
    );

    setSupportSuccessMessage(`🎉 You sent ${selectedTipCoins} Postly coins to ${currentVideo.userName}!`);
    setShowSupportModal(false);
    setTipMessage('');

    setTimeout(() => {
      setSupportSuccessMessage(null);
    }, 4000);
  };

  // Handle Next/Previous Video Navigation
  const handleNextVideo = () => {
    if (currentVideoIndex < displayVideos.length - 1) {
      setCurrentVideoIndex((prev) => prev + 1);
      setIsControlsHidden(true);
      soundEffects.playClickSound();
    }
  };

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex((prev) => prev - 1);
      setIsControlsHidden(true);
      soundEffects.playClickSound();
    }
  };

  // Generate Viral Hooks with AI Co-Pilot
  const handleGenerateAiHooks = async () => {
    setIsAiGenerating(true);
    soundEffects.playOrbChime();

    try {
      const res = await fetch('/api/ai/postly-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'generate_viral',
          topic: aiTopic || newCaption || 'Modern Web App Development',
        }),
      });
      const json = await res.json();
      if (json.data) {
        setAiGeneratedData(json.data);
      }
    } catch {
      setAiGeneratedData({
        hooks: [
          '🚀 The secret behind our next-gen release — wait till the end! ✨',
          '⚡ How we engineered lightning-fast real-time streams in 60 seconds.',
          '🔥 Top 3 tips every modern team needs to know right now! 👇',
        ],
        hashtags: ['#Postly', '#Engineering', '#UIUX', '#DesignTrends', '#Productivity', '#TechReels'],
        recommendedAudio: '🎵 Synthwave Chill Lofi (120 BPM)',
        viralScore: 94,
        strategicTip: 'Use fast-paced cuts in the first 3 seconds to maximize the 91% retention curve.',
      });
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Generate Video TL;DR Summary with AI
  const handleSummarizeActiveVideo = async () => {
    setShowAiSummaryModal(true);
    setIsAiSummarizing(true);
    soundEffects.playOrbChime();

    try {
      const res = await fetch('/api/ai/postly-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'summarize_video',
          topic: currentVideo.userName,
          caption: currentVideo.caption,
        }),
      });
      const json = await res.json();
      if (json.data) {
        setVideoSummary(json.data);
      }
    } catch {
      setVideoSummary({
        takeaways: [
          'Architectural breakdown of real-time state synchronization',
          'Interactive UI micro-interactions and low-latency audio synthesis',
          'Optimized for high retention across mobile and desktop interfaces',
        ],
        viralScore: 92,
        sentiment: 'High Energy 🔥',
        category: 'Tech & Innovation',
      });
    } finally {
      setIsAiSummarizing(false);
    }
  };

  // Publish Remix / Duet
  const handlePublishDuet = () => {
    soundEffects.playCelebrationChime();
    const remixVideo: PostlyVideo = {
      id: `duet_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userUsername: currentUser.username || currentUser.id,
      userAvatar: currentUser.avatar,
      userStatus: 'online',
      isFollowing: false,
      coverImage: currentVideo.coverImage,
      bgGradient: 'from-fuchsia-950 via-slate-900 to-indigo-950',
      caption: `🎬 Duet with @${currentVideo.userUsername}: "${duetNote || 'Mind blown by this technique!'}"`,
      hashtags: ['#PostlyDuet', '#Remix', '#Collaboration', ...(currentVideo.hashtags || [])],
      audioTrack: currentVideo.audioTrack,
      likes: 1,
      isLiked: true,
      isSaved: false,
      commentsCount: 0,
      shares: 0,
      downloads: 0,
      views: 1,
      supportReceived: 0,
      postedAt: 'Just now',
      comments: [],
    };

    setVideos((prev) => [remixVideo, ...prev]);
    setCurrentVideoIndex(0);
    setActiveTab('foryou');
    setDuetNote('');
    setSupportSuccessMessage(`✨ Duet published to Postly Feed!`);
    setTimeout(() => setSupportSuccessMessage(null), 3500);
  };

  // Publish from TikTok Creator Studio
  const handlePublishFromTikTokStudio = (postData: {
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
  }) => {
    soundEffects.playCelebrationChime();

    const isUserVerified = verifiedUsers[currentUser.id] !== undefined;
    const userVerificationTier = verifiedUsers[currentUser.id]?.tier;

    const createdVideo: PostlyVideo = {
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userUsername: currentUser.username || currentUser.id,
      userAvatar: currentUser.avatar,
      userStatus: 'online',
      isFollowing: false,
      coverImage: postData.photos?.[0] || postData.contentUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&auto=format&fit=crop&q=80',
      photos: postData.photos && postData.photos.length > 1 ? postData.photos : undefined,
      bgGradient: postData.type === 'text' ? (postData.bgGradient || selectedGradient) : undefined,
      caption: postData.caption,
      hashtags: postData.hashtags.length > 0 ? postData.hashtags : ['#Postly', '#FYP', '#Trending'],
      audioTrack: postData.audioTrack || '🎵 ' + currentUser.name + ' - Original Audio',
      likes: 1,
      isLiked: true,
      isSaved: false,
      commentsCount: 0,
      shares: 0,
      downloads: 0,
      views: 1,
      supportReceived: 0,
      postedAt: 'Just now',
      isVerified: isUserVerified,
      verificationType: userVerificationTier,
      comments: [],
    };

    setVideos((prev) => [createdVideo, ...prev]);
    setCurrentVideoIndex(0);

    setActiveTab('foryou');
    setShowTikTokStudio(false);
    setNewContent('');
    setNewCaption('');
    setSupportSuccessMessage(`🎉 ${postData.photos && postData.photos.length > 1 ? 'Multi-Photo Reel' : 'Reel'} published live to Postly!`);
    setTimeout(() => setSupportSuccessMessage(null), 3500);
  };

  // Create Post Story submit
  const handleCreateStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() && !newCaption.trim()) return;

    soundEffects.playCelebrationChime();

    const photosArray =
      newType === 'image' && newContent
        ? newContent
            .split(/[\n,]+/)
            .map((s) => s.trim())
            .filter((s) => s.length > 5)
        : [];

    const isUserVerified = verifiedUsers[currentUser.id] !== undefined;
    const userVerificationTier = verifiedUsers[currentUser.id]?.tier;

    const createdVideo: PostlyVideo = {
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userUsername: currentUser.username || currentUser.id,
      userAvatar: currentUser.avatar,
      userStatus: 'online',
      isFollowing: false,
      coverImage: photosArray[0] || (newType === 'image' && newContent ? newContent : undefined),
      photos: photosArray.length > 1 ? photosArray : undefined,
      bgGradient: newType === 'text' ? selectedGradient : undefined,
      caption: newCaption || newContent,
      hashtags: ['#Postly', '#NewUpdate', '#Trending'],
      audioTrack: '🎵 ' + currentUser.name + ' - Original Postly Beat',
      likes: 1,
      isLiked: true,
      isSaved: false,
      commentsCount: 0,
      shares: 0,
      downloads: 0,
      views: 1,
      supportReceived: 0,
      postedAt: 'Just now',
      isVerified: isUserVerified,
      verificationType: userVerificationTier,
      comments: [],
    };

    setVideos((prev) => [createdVideo, ...prev]);
    setCurrentVideoIndex(0);

    setActiveTab('foryou');
    setShowTikTokStudio(false);
    setNewContent('');
    setNewCaption('');
    setSupportSuccessMessage(`🎉 ${photosArray.length > 1 ? 'Multi-Photo Reel' : 'Reel'} published live to Postly!`);
    setTimeout(() => setSupportSuccessMessage(null), 3500);
  };

  // Filter saved videos for Watch Later tab
  const savedVideos = videos.filter((v) => v.isSaved);

  // User's own video for Post Analytics
  const myPost = videos.find((v) => v.userId === currentUser.id) || videos[1] || videos[0];

  // Visual filter CSS classes
  const getFilterStyle = (filter: VisualFilter) => {
    switch (filter) {
      case 'cyberpunk':
        return 'contrast-125 saturate-150 hue-rotate-15 filter brightness-110';
      case 'golden_hour':
        return 'sepia-[0.3] contrast-110 saturate-125 brightness-105';
      case 'vhs_glitch':
        return 'contrast-125 saturate-200 hue-rotate-90';
      case 'noir':
        return 'grayscale contrast-150 brightness-90';
      case 'crystal':
        return 'saturate-150 contrast-110 brightness-115 hue-rotate-[-20deg]';
      default:
        return '';
    }
  };

  return (
    <div className={`fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-50 flex items-center justify-center select-none animate-in fade-in duration-200 ${
      isFullScreen ? 'p-0' : 'p-2 sm:p-4'
    }`}>
      {/* Dynamic Ambient Glow Backdrop that mirrors active video */}
      <div
        className={`absolute -inset-20 opacity-35 blur-3xl pointer-events-none transition-all duration-700 ${
          currentVideo.bgGradient || 'bg-gradient-to-tr from-rose-600 via-purple-700 to-indigo-900'
        }`}
      />

      {/* Top Floating Controls (Fullscreen Toggle + Close) */}
      <div
        className={`absolute top-4 right-4 z-50 flex items-center gap-2 transition-all duration-300 ${
          isControlsHidden
            ? 'opacity-0 -translate-y-4 pointer-events-none'
            : 'opacity-100 translate-y-0 pointer-events-auto'
        }`}
      >
        <button
          onClick={() => {
            setIsFullScreen(!isFullScreen);
            soundEffects.playTapSound();
          }}
          className="p-3 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white transition-all shadow-2xl border border-slate-700 hover:scale-105"
          title={isFullScreen ? 'Exit Full Screen' : 'Full Screen View'}
        >
          {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>

        <button
          onClick={onClose}
          className="p-3 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white transition-all shadow-2xl border border-slate-700 hover:scale-105"
          title="Close Postly"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Support Success Notification Banner */}
      {supportSuccessMessage && (
        <div className="absolute top-6 inset-x-0 z-50 flex justify-center pointer-events-none">
          <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white px-5 py-2.5 rounded-full text-xs font-black shadow-2xl flex items-center gap-2 animate-bounce border border-white/20">
            <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" />
            <span>{supportSuccessMessage}</span>
          </div>
        </div>
      )}

      {/* Main Container Frame (Full Size immersive layout) */}
      <div
        ref={containerRef}
        className={`w-full bg-slate-900/90 backdrop-blur-2xl overflow-hidden shadow-2xl flex flex-col relative border border-slate-800/90 transition-all duration-300 ${
          isFullScreen
            ? 'h-full max-h-screen max-w-2xl rounded-none sm:rounded-3xl sm:h-[98vh]'
            : 'max-w-xl h-[95vh] max-h-[920px] rounded-3xl'
        }`}
      >
        {/* Postly Top Nav Header */}
        <div
          className={`bg-slate-950/95 border-b border-slate-800/80 flex items-center justify-between z-40 shrink-0 gap-2 transition-all duration-300 ease-in-out ${
            isControlsHidden
              ? '-translate-y-full opacity-0 max-h-0 py-0 px-3 overflow-hidden border-b-0 pointer-events-none'
              : 'translate-y-0 opacity-100 max-h-24 p-3 pointer-events-auto'
          }`}
        >
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-full border border-slate-800/80 overflow-x-auto no-scrollbar max-w-[290px] sm:max-w-none">
            <button
              onClick={() => {
                setActiveTab('foryou');
                setIsControlsHidden(false);
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'foryou' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-300" />
              For You
            </button>

            <button
              onClick={() => {
                setActiveTab('sponsored');
                setCurrentVideoIndex(0);
                setIsControlsHidden(false);
                soundEffects.playClickSound();
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'sponsored'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black shadow-md'
                  : 'text-amber-300 hover:text-amber-200'
              }`}
              title="Postly Sponsored Ads & Partner Spotlights"
            >
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              Spotlight
            </button>

            <button
              onClick={() => {
                setActiveTab('ai_studio');
                setIsControlsHidden(false);
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'ai_studio'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
              title="AI Viral Co-Pilot & Studio"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
              AI Studio
            </button>

            <button
              onClick={() => {
                setActiveTab('analytics');
                setIsControlsHidden(false);
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'analytics' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Check how your post is progressing"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Radar
            </button>

            <button
              onClick={() => {
                setActiveTab('saved');
                setIsControlsHidden(false);
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'saved' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Saved Videos to Watch Later"
            >
              <Bookmark className="w-3.5 h-3.5" />
              Saved
            </button>

            <button
              onClick={() => {
                setActiveTab('inbox');
                setIsControlsHidden(false);
                soundEffects.playTapSound();
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1.5 relative ${
                activeTab === 'inbox'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Postly Creator Inbox (Isolated from private chats)"
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Inbox</span>
              {totalPostlyUnread > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black animate-pulse">
                  {totalPostlyUnread}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('history');
                setIsControlsHidden(false);
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'history' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Video Viewing History"
            >
              <History className="w-3.5 h-3.5" />
              History
            </button>

            <button
              onClick={() => {
                setActiveTab('live');
                setIsControlsHidden(false);
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'live' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5 animate-pulse text-rose-300" />
              Live
            </button>

            {/* Postly Verification Hub Button */}
            <button
              onClick={() => {
                setShowVerificationModal(true);
                soundEffects.playTapSound();
              }}
              className="px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 text-cyan-300 border border-cyan-500/40 shadow-sm"
              title="Apply for Postly Verification ($2 Creator / $5 Company - Non-Refundable Fee)"
            >
              <BadgeCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Get Verified</span>
              <span className="text-[9px] bg-cyan-400/20 px-1 rounded text-cyan-200 font-mono">$2 / $5</span>
            </button>
          </div>

          {/* Action Hub (Go Live + Create) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onStartGoLive('host')}
              className="px-2.5 py-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black tracking-wider flex items-center gap-1 shadow-md shadow-rose-600/30 transition-transform active:scale-95"
            >
              <Radio className="w-3 h-3 animate-ping" />
              LIVE
            </button>

            <button
              onClick={() => {
                setShowTikTokStudio(true);
                soundEffects.playTapSound();
              }}
              className="p-1.5 rounded-full bg-gradient-to-tr from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-md shadow-rose-600/30 transition-transform active:scale-95 flex items-center justify-center"
              title="Open TikTok Creator Camera & Studio"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* TikTok Discovery Trending Topics Strip */}
        <div
          className={`bg-slate-950/80 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 transition-all duration-300 ease-in-out ${
            isControlsHidden
              ? '-translate-y-full opacity-0 max-h-0 py-0 px-3 overflow-hidden border-b-0 pointer-events-none'
              : 'translate-y-0 opacity-100 max-h-20 px-3 py-2 pointer-events-auto'
          }`}
        >
          {[
            { tag: '✨ For You', count: '1.2M' },
            { tag: '🔥 Trending', count: '850K' },
            { tag: '🎵 Viral Sounds', count: '420K' },
            { tag: '🤖 AI Studio', count: '310K' },
            { tag: '💻 TechTok', count: '640K' },
            { tag: '🎨 UI & UX', count: '190K' },
            { tag: '🚀 Startups', count: '145K' },
          ].map((topic, tIdx) => (
            <button
              key={tIdx}
              onClick={() => {
                setActiveTab('foryou');
                soundEffects.playClickSound();
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                tIdx === 0
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm shadow-rose-600/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span>{topic.tag}</span>
              <span className="text-[9px] opacity-70 font-mono">{topic.count}</span>
            </button>
          ))}
        </div>

        {/* MAIN BODY DISPLAY */}
        {activeTab === 'foryou' || activeTab === 'sponsored' ? (
          /* VERTICAL REEL FEED SCREEN WITH MULTI-PHOTO SWIPING & GESTURES */
          <div
            onTouchStart={(e) => onGestureStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => onGestureMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={(e) =>
              onGestureEnd(
                e.changedTouches[0].clientX,
                e.changedTouches[0].clientY,
                e.currentTarget.getBoundingClientRect()
              )
            }
            onMouseDown={(e) => onGestureStart(e.clientX, e.clientY)}
            onMouseMove={(e) => onGestureMove(e.clientX, e.clientY)}
            onMouseUp={(e) =>
              onGestureEnd(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect())
            }
            onMouseLeave={() => {
              gestureStartRef.current = null;
              setIsSwipingGesture(false);
              setSwipeDelta({ x: 0, y: 0 });
            }}
            onWheel={(e) => {
              if (Math.abs(e.deltaY) > 8) {
                if (!isControlsHidden) {
                  setIsControlsHidden(true);
                }
                if (e.deltaY > 60) {
                  handleNextVideo();
                } else if (e.deltaY < -60) {
                  handlePrevVideo();
                }
              }
            }}
            className="flex-1 relative overflow-hidden bg-slate-950 flex flex-col justify-between select-none touch-none"
          >
            {/* Top Tap Zone & Indicator to restore header & navigation when hidden */}
            {isControlsHidden && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsControlsHidden(false);
                  soundEffects.playTapSound();
                }}
                className="absolute top-0 inset-x-0 h-20 z-40 flex items-start justify-center pt-2.5 cursor-pointer group"
                title="Tap at the top to bring back navigation & menu"
              >
                <div className="bg-slate-950/80 hover:bg-slate-900/95 text-white/95 text-[11px] font-bold px-3.5 py-1.5 rounded-full border border-white/20 shadow-2xl backdrop-blur-md flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-top-2 duration-300">
                  <ChevronDown className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                  <span>Tap to show menu & navigation</span>
                </div>
              </div>
            )}
            {/* Top Multi-Photo Story Segment Progress Bars */}
            {currentPhotos.length > 1 && (
              <div className="absolute top-2 inset-x-4 z-30 flex items-center gap-1.5 pointer-events-none">
                {currentPhotos.map((_, pIdx) => (
                  <div
                    key={pIdx}
                    className="h-1 flex-1 rounded-full overflow-hidden bg-white/25 backdrop-blur-md shadow-sm"
                  >
                    <div
                      className={`h-full transition-all duration-300 ${
                        pIdx === activePhotoIndex
                          ? 'bg-rose-500 w-full'
                          : pIdx < activePhotoIndex
                          ? 'bg-white/85 w-full'
                          : 'w-0'
                      }`}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Video / Photo Background Stage */}
            <div
              style={{
                transform:
                  isSwipingGesture && Math.abs(swipeDelta.x) > Math.abs(swipeDelta.y)
                    ? `translateX(${swipeDelta.x * 0.35}px)`
                    : 'none',
              }}
              className={`absolute inset-0 z-0 cursor-grab active:cursor-grabbing transition-transform duration-150 ${getFilterStyle(
                activeFilter
              )}`}
            >
              {currentPhoto ? (
                <div className="w-full h-full relative overflow-hidden">
                  <img
                    key={`${currentVideo.id}_${activePhotoIndex}`}
                    src={currentPhoto}
                    alt={currentVideo.caption}
                    draggable={false}
                    className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-slate-950/40 pointer-events-none" />
                </div>
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-tr ${
                    currentVideo.bgGradient || 'from-purple-900 to-indigo-950'
                  } flex items-center justify-center p-8 text-center`}
                >
                  <p className="text-xl font-extrabold text-white leading-relaxed drop-shadow-md">
                    {currentVideo.caption}
                  </p>
                </div>
              )}
            </div>

            {/* Tap-to-Play/Pause Overlay (only if not a photo carousel or paused) */}
            {!isPlaying && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl animate-in zoom-in-50">
                  <Play className="w-8 h-8 fill-current ml-1 text-rose-400" />
                </div>
              </div>
            )}

            {/* Multi-Photo Carousel Left/Right Buttons */}
            {currentPhotos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevPhoto();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/15 transition-all shadow-xl hover:scale-110 active:scale-95 group pointer-events-auto"
                  title="Previous Photo (Swipe Right / Left Arrow)"
                >
                  <ChevronLeft className="w-5 h-5 text-white group-hover:text-rose-400 transition-colors" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextPhoto();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/15 transition-all shadow-xl hover:scale-110 active:scale-95 group pointer-events-auto"
                  title="Next Photo (Swipe Left / Right Arrow)"
                >
                  <ChevronRight className="w-5 h-5 text-white group-hover:text-rose-400 transition-colors" />
                </button>
              </>
            )}

            {/* Heart Burst Particle Animations from double-taps */}
            {heartBursts.map((burst) => (
              <div
                key={burst.id}
                style={{ left: burst.x - 30, top: burst.y - 30 }}
                className="absolute z-30 pointer-events-none animate-in zoom-in-50 fade-out duration-1000 scale-150"
              >
                <Heart className="w-16 h-16 text-rose-500 fill-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.8)] animate-ping" />
              </div>
            ))}

            {/* Floating Emojis Layer */}
            <div className="absolute right-14 bottom-24 z-20 pointer-events-none h-64 w-36 overflow-hidden">
              {floatingEmojis.map((f) => (
                <div
                  key={f.id}
                  style={{ left: `${f.x}%` }}
                  className="absolute bottom-0 text-3xl animate-bounce transition-all duration-1000 opacity-90 scale-125"
                >
                  {f.emoji}
                </div>
              ))}
            </div>

            {/* Top Toolbar (Sound Track + Filter + Speed Chips + Multi-Photo Pill) */}
            <div className="relative z-20 p-3 pt-3 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800/80 text-xs text-slate-200">
                  <Headphones className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  <span className="font-semibold truncate max-w-[120px] sm:max-w-[170px]">
                    {currentVideo.audioTrack || '🎵 Original Beat - Postly'}
                  </span>
                </div>

                {/* Multi-Photo Carousel Indicator Badge */}
                {currentPhotos.length > 1 && (
                  <div className="bg-rose-600/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-rose-400/40 text-[10px] font-black text-white flex items-center gap-1.5 shadow-md animate-in fade-in">
                    <Images className="w-3.5 h-3.5" />
                    <span>
                      {activePhotoIndex + 1}/{currentPhotos.length}
                    </span>
                    <span className="text-[9px] text-rose-200 font-normal">Swipe ↔</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {/* Playback Speed Controller Chip */}
                <button
                  onClick={() => {
                    const speeds = [0.5, 1.0, 1.5, 2.0];
                    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                    setPlaybackSpeed(speeds[nextIdx]);
                    soundEffects.playClickSound();
                  }}
                  className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-[11px] font-mono font-bold text-slate-200 border border-slate-800 hover:border-rose-500/50"
                  title="Playback Speed"
                >
                  {playbackSpeed}x
                </button>

                {/* Filter Selector Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilterPicker(!showFilterPicker)}
                    className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                      activeFilter !== 'normal'
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                        : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:text-white'
                    }`}
                    title="Video Visual Filters / VFX"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>

                  {/* Filter Dropdown */}
                  {showFilterPicker && (
                    <div className="absolute right-0 top-10 w-44 bg-slate-900/95 border border-slate-700 rounded-2xl p-2 shadow-2xl z-40 flex flex-col gap-1 backdrop-blur-md animate-in fade-in zoom-in-95">
                      <span className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1">
                        Visual LUT Filters
                      </span>
                      {[
                        { id: 'normal', label: '✨ Normal / Original' },
                        { id: 'cyberpunk', label: '⚡ Cyberpunk Neon' },
                        { id: 'golden_hour', label: '🌅 Golden Hour' },
                        { id: 'vhs_glitch', label: '📼 VHS Glitch' },
                        { id: 'noir', label: '🎬 Cinematic Noir' },
                        { id: 'crystal', label: '💎 Crystal Prism' },
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() => {
                            setActiveFilter(f.id as VisualFilter);
                            setShowFilterPicker(false);
                            soundEffects.playClickSound();
                          }}
                          className={`text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            activeFilter === f.id
                              ? 'bg-rose-600 text-white'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mute Button */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-slate-950/70 backdrop-blur-md text-slate-300 border border-slate-800 hover:text-white"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* CUSTOM POSTLY RIGHT BAR (Neon Green #2ECC71 on Black Glass, 60px wide) */}
            <PostlyRightBar
              video={currentVideo}
              isLiked={currentVideo.isLiked}
              isSaved={currentVideo.isSaved}
              isFollowing={currentVideo.isFollowing}
              likesCount={currentVideo.likes}
              commentsCount={currentVideo.commentsCount}
              savesCount={currentVideo.isSaved ? 891 : 890}
              sharesCount={currentVideo.shares}
              isPlaying={isPlaying}
              onToggleLike={() => handleToggleLike(currentVideo.id)}
              onToggleFollow={() => handleToggleFollow(currentVideo.userId)}
              onOpenComments={() => setShowCommentsDrawer(true)}
              onToggleSave={() => handleToggleSave(currentVideo.id)}
              onShare={() => {
                soundEffects.playSendSound();
                setSupportSuccessMessage(`Link copied! Shared @${currentVideo.userUsername}'s post.`);
                setTimeout(() => setSupportSuccessMessage(null), 3000);
              }}
              onOpenGift={() => setShowSupportModal(true)}
              onMusicClick={() => {
                soundEffects.playTapSound();
                setSupportSuccessMessage(`Audio: ${currentVideo.audioTrack || 'Original Beat - Postly'}`);
                setTimeout(() => setSupportSuccessMessage(null), 2500);
              }}
              onOpenVerification={() => {
                setShowVerificationModal(true);
                soundEffects.playTapSound();
              }}
              onOpenProfile={() => {
                setSelectedProfileCreatorId(currentVideo.userId);
                soundEffects.playTapSound();
              }}
            />

            {/* Floating Navigation Controls (Up / Down Arrows + AI TL;DR Quick Pill) */}
            <div className="absolute right-3 top-14 z-20 flex flex-col gap-1.5 pointer-events-auto">
              <button
                onClick={handlePrevVideo}
                disabled={currentVideoIndex === 0}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white disabled:opacity-20 border border-white/10 hover:border-[#2ECC71]/50 hover:text-[#2ECC71] transition-all shadow-lg"
                title="Previous Video (Arrow Up)"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextVideo}
                disabled={currentVideoIndex === displayVideos.length - 1}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white disabled:opacity-20 border border-white/10 hover:border-[#2ECC71]/50 hover:text-[#2ECC71] transition-all shadow-lg"
                title="Next Video (Arrow Down)"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={handleSummarizeActiveVideo}
                className="p-2 rounded-full bg-purple-600/80 hover:bg-purple-600 backdrop-blur-md text-white border border-purple-400/40 shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
                title="AI Key Highlights & TL;DR"
              >
                <Sparkles className="w-4 h-4 animate-pulse text-yellow-200" />
              </button>
            </div>

            {/* BOTTOM-LEFT OVERLAY (Creator Info, Caption, Audio Spectrum & Sponsored Cards) */}
            <div className="relative z-20 p-4 pb-4 max-w-[78%] flex flex-col gap-2 pointer-events-auto">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProfileCreatorId(currentVideo.userId);
                    soundEffects.playTapSound();
                  }}
                  className="text-base font-black text-white drop-shadow flex items-center gap-1 hover:text-[#2ECC71] transition-colors cursor-pointer group"
                  title={`View @${currentVideo.userUsername}'s full profile & posts`}
                >
                  <span className="group-hover:underline">@{currentVideo.userUsername}</span>
                </button>

                {/* Verified Account Badge Indicator */}
                {(currentVideo.isVerified || verifiedUsers[currentVideo.userId] !== undefined) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const tier =
                        currentVideo.verificationType ||
                        verifiedUsers[currentVideo.userId]?.tier ||
                        'individual';
                      setVerifiedBadgeInfoModal({
                        userName: currentVideo.userName,
                        tier,
                      });
                      soundEffects.playTapSound();
                    }}
                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black shadow-sm transition-transform hover:scale-105 ${
                      (currentVideo.verificationType || verifiedUsers[currentVideo.userId]?.tier) ===
                      'company'
                        ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-300'
                        : 'bg-cyan-500 text-slate-950 ring-1 ring-cyan-300'
                    }`}
                    title="Verified Account (Postly Official) - Click for Verification Info"
                  >
                    <BadgeCheck className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {(currentVideo.verificationType || verifiedUsers[currentVideo.userId]?.tier) ===
                      'company'
                        ? 'Official'
                        : 'Verified'}
                    </span>
                  </button>
                )}

                {/* Sponsored / Promoted Badge */}
                {currentVideo.isSponsored ? (
                  <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-500/40 backdrop-blur-md shadow-sm">
                    <Tag className="w-3 h-3 text-amber-400" />
                    <span>{currentVideo.sponsorBadge || 'Sponsored'}</span>
                    {currentVideo.sponsorCategory && (
                      <span className="text-[9px] text-amber-200/70 font-normal">
                        • {currentVideo.sponsorCategory}
                      </span>
                    )}
                  </div>
                ) : currentVideo.userStatus === 'online' ? (
                  <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Online
                  </span>
                ) : null}
              </div>

              {/* Multi-Photo Carousel Dot Indicators */}
              {currentPhotos.length > 1 && (
                <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 w-fit my-0.5 animate-in fade-in">
                  {currentPhotos.map((_, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPhoto(pIdx);
                      }}
                      className={`h-1.5 rounded-full transition-all ${
                        pIdx === activePhotoIndex
                          ? 'w-5 bg-gradient-to-r from-rose-500 to-amber-400'
                          : 'w-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                      title={`Go to photo ${pIdx + 1}`}
                    />
                  ))}
                  <span className="text-[9px] text-slate-300 font-semibold ml-1">
                    {activePhotoIndex + 1}/{currentPhotos.length}
                  </span>
                </div>
              )}

              {/* Caption & Hashtags */}
              <p className="text-xs text-slate-100 font-medium leading-relaxed drop-shadow line-clamp-3">
                {currentVideo.caption}
              </p>

              {currentVideo.hashtags && (
                <div className="flex flex-wrap gap-1.5 mt-0.5">
                  {currentVideo.hashtags.map((ht) => (
                    <span key={ht} className="text-[11px] font-bold text-rose-300 drop-shadow hover:underline cursor-pointer">
                      {ht}
                    </span>
                  ))}
                </div>
              )}

              {/* NATIVE POSTLY SPONSORED CTA CARD (Only on Postly - 100% Ad-Free Chat Policy) */}
              {currentVideo.isSponsored ? (
                <div className="mt-1 p-2.5 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-amber-500/40 shadow-2xl flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-400 to-rose-500 text-slate-950 flex items-center justify-center font-black text-[11px] shadow-sm">
                        {currentVideo.userName.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <div className="text-[11px] font-black text-white flex items-center gap-1 leading-tight">
                          <span>{currentVideo.sponsorName || currentVideo.userName}</span>
                          <CheckCircle2 className="w-3 h-3 text-cyan-400 inline" />
                        </div>
                        {currentVideo.sponsorTagline && (
                          <span className="text-[9px] text-slate-300 truncate max-w-[160px]">
                            {currentVideo.sponsorTagline}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedAdForModal(currentVideo);
                        setShowAdInfoModal(true);
                        soundEffects.playClickSound();
                      }}
                      className="p-1 rounded-full text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
                      title="Postly Ad Transparency & Ad-Free Chat Policy"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Interactive Action Button */}
                  <button
                    onClick={() => {
                      setSelectedAdForModal(currentVideo);
                      setShowAdCtaModal(true);
                      soundEffects.playSendSound();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:from-amber-300 hover:via-rose-400 hover:to-purple-500 text-slate-950 font-black text-[11px] flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/25 transition-transform active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>{currentVideo.sponsorCta || 'Learn More'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Chat is 100% Ad-Free
                    </span>
                    <button
                      onClick={() => {
                        setHiddenAdIds((prev) => [...prev, currentVideo.id]);
                        setSupportSuccessMessage('Ad dismissed. Postly tailored to your taste.');
                        setTimeout(() => setSupportSuccessMessage(null), 3000);
                      }}
                      className="text-slate-500 hover:text-slate-300 flex items-center gap-0.5"
                    >
                      <EyeOff className="w-2.5 h-2.5" />
                      Hide Ad
                    </button>
                  </div>
                </div>
              ) : (
                /* Creator Support Received Metric Badge */
                <div className="flex items-center gap-2 mt-1">
                  <div className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-amber-500/30 text-[10px] font-bold text-amber-300 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentVideo.supportReceived} Creator Coins Earned</span>
                  </div>
                </div>
              )}

              {/* Interactive Audio Spectrum Wave Visualizer */}
              <div className="flex items-center gap-1 pt-1 opacity-80">
                {[12, 24, 18, 32, 28, 14, 26, 30, 20, 16, 28, 22].map((height, i) => (
                  <div
                    key={i}
                    style={{
                      height: isPlaying ? `${height}px` : '4px',
                      animationDelay: `${i * 0.08}s`,
                    }}
                    className={`w-1 rounded-full bg-gradient-to-t from-rose-500 to-purple-400 ${
                      isPlaying ? 'animate-pulse' : ''
                    } transition-all duration-200`}
                  />
                ))}
              </div>
            </div>

            {/* Video Progress Line */}
            <div className="w-full h-1 bg-slate-800/80 relative z-20">
              <div className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-amber-400 w-3/4 animate-pulse" />
            </div>
          </div>
        ) : activeTab === 'ai_studio' ? (
          /* AI VIRAL CO-PILOT & STUDIO */
          <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                <div>
                  <h3 className="text-base font-extrabold text-white">AI Postly Growth Co-Pilot</h3>
                  <p className="text-xs text-slate-400">Generate high-converting hooks & viral tags with Gemini</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold border border-purple-500/30">
                Gemini Pro
              </span>
            </div>

            {/* Input Form */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/30 flex flex-col gap-3">
              <label className="text-xs font-bold text-slate-200">What is your video / update about?</label>
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="e.g. Next.js 15 Server Actions, Tailwind UI animation, Cloud latency"
                className="w-full bg-slate-800 text-slate-100 text-sm p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500"
              />

              <button
                onClick={handleGenerateAiHooks}
                disabled={isAiGenerating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-purple-600/25 disabled:opacity-50"
              >
                {isAiGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Viral Recommendations...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate Viral Hooks & Tags
                  </>
                )}
              </button>
            </div>

            {/* Generated Results */}
            {aiGeneratedData && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                {/* Viral Readiness Score */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase">Estimated Viral Potential</span>
                    <span className="text-2xl font-black text-emerald-400">{aiGeneratedData.viralScore}/100</span>
                    <span className="text-[10px] text-slate-400">High engagement threshold</span>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 font-black">
                    <Zap className="w-7 h-7" />
                  </div>
                </div>

                {/* Catchy Hooks */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-300">🔥 Top Catchy Hooks (Tap to Use):</span>
                  {aiGeneratedData.hooks.map((hook, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setNewCaption(hook);
                        setActiveTab('create');
                        soundEffects.playSendSound();
                      }}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/60 cursor-pointer flex items-center justify-between group transition-all"
                    >
                      <p className="text-xs font-semibold text-slate-200 group-hover:text-purple-300">{hook}</p>
                      <button className="px-2 py-1 rounded-lg bg-purple-600/20 text-purple-300 text-[10px] font-bold shrink-0 ml-2 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        Use Hook
                      </button>
                    </div>
                  ))}
                </div>

                {/* Hashtags */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-300">🏷️ Trending Hashtags:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {aiGeneratedData.hashtags.map((tag) => (
                      <span
                        key={tag}
                        onClick={() => {
                          navigator.clipboard.writeText(tag);
                          setSupportSuccessMessage(`Copied ${tag}!`);
                          setTimeout(() => setSupportSuccessMessage(null), 2000);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-rose-300 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Growth Strategy Tip */}
                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-purple-200 leading-snug">
                    <strong className="text-white">Growth Advisor:</strong> {aiGeneratedData.strategicTip}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'duet' ? (
          /* REMIX / DUET WITH CREATOR MODE */
          <div className="p-5 flex-1 flex flex-col justify-between overflow-y-auto bg-slate-950">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      Remix with @{currentVideo.userUsername}
                    </h3>
                    <p className="text-xs text-slate-400">Record side-by-side reaction or comment response</p>
                  </div>
                </div>
                <button onClick={() => setActiveTab('foryou')} className="text-xs text-slate-400 hover:text-white">
                  Cancel
                </button>
              </div>

              {/* Side-by-side Split Stage Preview */}
              <div className="grid grid-cols-2 gap-3 h-56 rounded-2xl overflow-hidden border border-indigo-500/30 bg-slate-900 p-2">
                {/* Creator Original Side */}
                <div className="relative rounded-xl overflow-hidden bg-slate-950 flex flex-col justify-between p-2">
                  {currentVideo.coverImage ? (
                    <img src={currentVideo.coverImage} alt="Creator" className="absolute inset-0 w-full h-full object-cover brightness-75" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 to-indigo-950" />
                  )}
                  <span className="relative z-10 text-[9px] font-black px-2 py-0.5 bg-slate-950/80 rounded text-white self-start">
                    Original @{currentVideo.userUsername}
                  </span>
                  <p className="relative z-10 text-[10px] text-white font-medium line-clamp-2 bg-slate-950/80 p-1 rounded">
                    {currentVideo.caption}
                  </p>
                </div>

                {/* User Remix Reaction Side */}
                <div className="relative rounded-xl overflow-hidden bg-gradient-to-tr from-indigo-950 to-slate-900 border border-indigo-500/40 flex flex-col items-center justify-center p-3 text-center">
                  <img src={currentUser.avatar} alt="You" className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-400 mb-2" />
                  <span className="text-xs font-bold text-white">Your Duet Reaction</span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    {duetNote ? `"${duetNote}"` : 'Type your reaction response below'}
                  </span>
                </div>
              </div>

              {/* Duet Message Form */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-200">Your Remix Caption & Reaction:</label>
                <textarea
                  value={duetNote}
                  onChange={(e) => setDuetNote(e.target.value)}
                  placeholder={`Agreeing with @${currentVideo.userUsername} on line 42...`}
                  rows={3}
                  className="w-full bg-slate-800 text-slate-100 text-sm p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              onClick={handlePublishDuet}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:opacity-90 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Layers className="w-4 h-4" />
              Publish Remix to Postly
            </button>
          </div>
        ) : activeTab === 'history' ? (
          /* VIDEO VIEWING HISTORY PAGE */
          <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-extrabold text-white">Video Viewing History</h3>
              </div>
              <button
                onClick={() => setWatchHistory([])}
                className="text-xs text-slate-400 hover:text-rose-400 font-semibold"
              >
                Clear History
              </button>
            </div>

            {watchHistory.length === 0 ? (
              <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-3">
                <Clock className="w-10 h-10 text-slate-600" />
                <p className="text-sm font-semibold">No watch history yet</p>
                <span className="text-xs text-slate-500">
                  Videos you watch in the 'For You' feed will automatically appear here.
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {watchHistory.map((item, idx) => (
                  <div
                    key={`${item.video.id}_${idx}`}
                    onClick={() => {
                      const foundIdx = videos.findIndex((v) => v.id === item.video.id);
                      if (foundIdx !== -1) setCurrentVideoIndex(foundIdx);
                      setActiveTab('foryou');
                      soundEffects.playClickSound();
                    }}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                        {item.video.coverImage ? (
                          <img
                            src={item.video.coverImage}
                            alt="Cover"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-indigo-900 flex items-center justify-center text-xs font-bold text-white">
                            Postly
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 p-1 bg-slate-950/80 rounded-full text-white">
                          <Play className="w-2.5 h-2.5 fill-current" />
                        </span>
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white truncate">
                            @{item.video.userUsername}
                          </span>
                          {item.video.userStatus === 'online' && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400" title="Online" />
                          )}
                        </div>
                        <p className="text-xs text-slate-300 truncate mt-0.5">{item.video.caption}</p>
                        <span className="text-[10px] text-slate-500 mt-1 font-mono">Watched {item.viewedAt}</span>
                      </div>
                    </div>

                    <button className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors shrink-0">
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'saved' ? (
          /* SAVED VIDEOS (WATCH LATER) PAGE */
          <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-400 fill-current" />
                <h3 className="text-base font-extrabold text-white">Saved to Watch Later</h3>
              </div>
              <span className="text-xs text-slate-400 font-bold">{savedVideos.length} Saved</span>
            </div>

            {savedVideos.length === 0 ? (
              <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-3">
                <Bookmark className="w-10 h-10 text-slate-600" />
                <p className="text-sm font-semibold">No saved videos yet</p>
                <span className="text-xs text-slate-500">
                  Tap the bookmark icon on any Postly video to watch it later.
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {savedVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => {
                      const foundIdx = videos.findIndex((v) => v.id === video.id);
                      if (foundIdx !== -1) setCurrentVideoIndex(foundIdx);
                      setActiveTab('foryou');
                      soundEffects.playClickSound();
                    }}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden h-48"
                  >
                    {video.coverImage ? (
                      <img
                        src={video.coverImage}
                        alt="Cover"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform brightness-75"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 to-indigo-950" />
                    )}

                    <div className="relative z-10 flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProfileCreatorId(video.userId);
                          soundEffects.playTapSound();
                        }}
                        className="flex items-center gap-1.5 bg-slate-950/80 hover:bg-slate-900 px-2 py-1 rounded-full text-[10px] text-white font-bold backdrop-blur border border-white/10 hover:border-[#2ECC71]/50 transition-all cursor-pointer"
                        title={`View @${video.userUsername}'s profile`}
                      >
                        <img src={video.userAvatar} alt="Avatar" className="w-4 h-4 rounded-full object-cover" />
                        <span>@{video.userUsername}</span>
                        {video.userStatus === 'online' && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadVideo(video);
                          }}
                          className="p-1.5 rounded-full bg-slate-900/80 hover:bg-indigo-600 text-white font-bold transition-colors"
                          title="Download Postly Post"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSave(video.id);
                          }}
                          className="p-1.5 rounded-full bg-amber-500 text-slate-950 font-bold"
                          title="Remove from Saved"
                        >
                          <Bookmark className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    </div>

                    <div className="relative z-10 bg-slate-950/80 p-2 rounded-xl backdrop-blur">
                      <p className="text-xs text-white font-bold line-clamp-1">{video.caption}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-300 mt-1">
                        <span>{video.views.toLocaleString()} views</span>
                        <Play className="w-3 h-3 text-amber-400 fill-current" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'analytics' ? (
          /* POST PROGRESS & VIRAL RADAR */
          <div className="p-5 flex-1 flex flex-col gap-5 overflow-y-auto bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-extrabold text-white">Viral Radar & Analytics</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-xs border border-emerald-500/30">
                {myPost.analytics?.progressStatus || 'Viral Velocity 🚀'}
              </span>
            </div>

            {/* Overview Card */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-purple-500/30 flex flex-col gap-3 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-3">
                <img
                  src={myPost.userAvatar}
                  alt={myPost.userName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    {myPost.userName}
                    {myPost.userStatus === 'online' && <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />}
                  </span>
                  <span className="text-xs text-slate-400">Published {myPost.postedAt}</span>
                </div>
              </div>

              <p className="text-xs text-slate-200 font-medium italic bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                "{myPost.caption}"
              </p>

              {/* Progress Retention Bar */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Audience Retention Curve</span>
                  <span className="text-purple-400">{myPost.analytics?.completionRate || 91}% Retention</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-rose-500 rounded-full w-[91%] animate-pulse" />
                </div>
                <span className="text-[10px] text-purple-300 font-mono">
                  ✨ {myPost.analytics?.audienceReach || '+68% reach boost in For You algorithm'}
                </span>
              </div>
            </div>

            {/* Metric KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Views</span>
                <span className="text-lg font-black text-white">{myPost.views.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">+24.2% velocity</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Likes</span>
                <span className="text-lg font-black text-rose-400">{myPost.likes.toLocaleString()}</span>
                <span className="text-[10px] text-rose-300 font-semibold">9.4% engagement</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Comments</span>
                <span className="text-lg font-black text-cyan-400">{myPost.commentsCount}</span>
                <span className="text-[10px] text-slate-400">142 threads</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Shares</span>
                <span className="text-lg font-black text-emerald-400">{myPost.shares}</span>
                <span className="text-[10px] text-slate-400">Viral re-shares</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Watch Later Saves</span>
                <span className="text-lg font-black text-amber-400">580</span>
                <span className="text-[10px] text-slate-400">Bookmarked</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Creator Coin Vault</span>
                <span className="text-lg font-black text-amber-300 flex items-center gap-1">
                  <Coins className="w-4 h-4 text-amber-400" />
                  {myPost.supportReceived}
                </span>
                <span className="text-[10px] text-amber-400 font-semibold">Coins earned</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActiveTab('create')}
                className="flex-1 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30"
              >
                <PlusCircle className="w-4 h-4" />
                Post Another Reel
              </button>
            </div>
          </div>
        ) : activeTab === 'live' ? (
          /* POSTLY LIVE DISCOVERY PAGE */
          <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto bg-slate-950">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-rose-500 animate-pulse" /> Active Postly Streams
                </h3>
                <p className="text-xs text-slate-400">Broadcast live to your team & subscribers in 1080p</p>
              </div>
            </div>

            <div
              onClick={() => onStartGoLive('host')}
              className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border border-rose-500/30 flex items-center justify-between cursor-pointer hover:border-rose-500/60 transition-all group shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-rose-600/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">Start Your Live Broadcast</span>
                  <span className="text-xs text-slate-400">Share screen, host live Q&A, or demo code</span>
                </div>
              </div>
              <span className="px-3.5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shrink-0 shadow-lg shadow-rose-600/30">
                Go Live Now
              </span>
            </div>

            <div className="flex flex-col gap-3 mt-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Live Channels ({liveStreams.length})
              </span>

              {liveStreams.map((stream) => (
                <div
                  key={stream.id}
                  onClick={() => onStartGoLive('viewer', stream)}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={stream.userAvatar}
                        alt={stream.userName}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-500"
                      />
                      <span className="absolute -bottom-1 -right-1 px-1 py-0.5 bg-rose-600 text-white text-[8px] font-black rounded uppercase animate-pulse">
                        LIVE
                      </span>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-white truncate">{stream.title}</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="text-rose-400 font-semibold">{stream.userName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <Users className="w-3 h-3 text-rose-400" /> {stream.viewerCount} watching
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="p-2.5 rounded-xl bg-rose-600/20 group-hover:bg-rose-600 text-rose-400 group-hover:text-white transition-colors shrink-0">
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'inbox' ? (
          /* POSTLY DIRECT INBOX (100% Isolated from private chats) */
          <PostlyInboxView
            conversations={postlyConversations}
            allVideos={videos}
            currentUser={currentUser}
            onOpenConversation={(conv) => {
              setPostlyConversations((prev) =>
                prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
              );
              setSelectedDirectChatCreatorId(conv.creatorId);
            }}
            onNewMessage={(creatorId) => {
              setSelectedDirectChatCreatorId(creatorId);
            }}
            onDeleteConversation={(convId) => {
              setPostlyConversations((prev) => prev.filter((c) => c.id !== convId));
            }}
            onOpenProfile={(creatorId) => {
              setSelectedProfileCreatorId(creatorId);
            }}
          />
        ) : (
          /* TIKTOK CREATOR STUDIO INTERFACE */
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
            <TikTokCreatorStudio
              currentUser={currentUser}
              onClose={() => setActiveTab('foryou')}
              onPublish={handlePublishFromTikTokStudio}
              onOpenAiStudio={() => setActiveTab('ai_studio')}
            />
          </div>
        )}

        {/* COMMENTS BOTTOM DRAWER / SHEET */}
        {showCommentsDrawer && (
          <div className="absolute inset-x-0 bottom-0 h-[72%] bg-slate-900 border-t border-slate-800 z-40 rounded-t-3xl p-4 flex flex-col justify-between shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex flex-col gap-2 border-b border-slate-800 pb-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-bold text-slate-200">
                    {currentVideo.commentsCount} Comments on @{currentVideo.userUsername}
                  </span>
                </div>
                <button
                  onClick={() => setShowCommentsDrawer(false)}
                  className="p-1 rounded-full bg-slate-800 text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Emoji Comment Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 shrink-0">
                  <Filter className="w-3 h-3 text-rose-400" /> Filter:
                </span>
                {[
                  { id: 'all', label: 'All' },
                  { id: '🔥', label: '🔥 Fire' },
                  { id: '❤️', label: '❤️ Love' },
                  { id: '😂', label: '😂 Funny' },
                  { id: '🚀', label: '🚀 Tech' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setCommentEmojiFilter(f.id)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all shrink-0 ${
                      commentEmojiFilter === f.id
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Feed */}
            <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-3">
              {currentVideo.comments.length === 0 ? (
                <p className="text-center text-xs text-slate-500 py-6">
                  No comments yet. Be the first to comment on this Postly reel!
                </p>
              ) : (
                currentVideo.comments
                  .filter((c) => commentEmojiFilter === 'all' || c.text.includes(commentEmojiFilter))
                  .map((c) => (
                    <div
                      key={c.id}
                      className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80"
                    >
                      <div
                        className="relative shrink-0 cursor-pointer group"
                        onClick={() => {
                          setSelectedProfileCreatorId(c.userId);
                          soundEffects.playTapSound();
                        }}
                        title={`View ${c.userName}'s profile`}
                      >
                        <img
                          src={c.userAvatar}
                          alt={c.userName}
                          className="w-7 h-7 rounded-full object-cover mt-0.5 ring-1 ring-slate-700 group-hover:ring-[#2ECC71] transition-all"
                        />
                        {c.userStatus === 'online' && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-1 ring-slate-950" />
                        )}
                      </div>

                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => {
                              setSelectedProfileCreatorId(c.userId);
                              soundEffects.playTapSound();
                            }}
                            className="flex items-center gap-1 text-left hover:text-white group cursor-pointer"
                          >
                            <span className="text-xs font-bold text-rose-300 group-hover:text-[#2ECC71] group-hover:underline transition-colors">{c.userName}</span>
                            {(verifiedUsers[c.userId] || c.userId === 'user_elena') && (
                              <BadgeCheck
                                className={`w-3.5 h-3.5 fill-current ${
                                  verifiedUsers[c.userId]?.tier === 'company'
                                    ? 'text-amber-400'
                                    : 'text-cyan-400'
                                }`}
                                title={`Verified ${
                                  verifiedUsers[c.userId]?.tier === 'company' ? 'Company' : 'Creator'
                                }`}
                              />
                            )}
                          </button>
                          <span className="text-[10px] text-slate-500">{c.timestamp}</span>
                        </div>

                        <p className="text-xs text-slate-200 leading-snug mt-1 break-words">{c.text}</p>

                        {/* Interactive Emoji Reactions on Comment */}
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {(
                            c.emojiReactions || [
                              { emoji: '❤️', count: 3, reactedByMe: false },
                              { emoji: '🔥', count: 5, reactedByMe: false },
                            ]
                          ).map((r) => (
                            <button
                              key={r.emoji}
                              onClick={() => handleToggleCommentReaction(c.id, r.emoji)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 transition-all ${
                                r.reactedByMe
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <span>{r.emoji}</span>
                              <span>{r.count}</span>
                            </button>
                          ))}

                          {['🔥', '❤️', '👏', '😂', '🚀'].map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleToggleCommentReaction(c.id, emoji)}
                              className="text-xs opacity-50 hover:opacity-100 hover:scale-125 transition-all p-0.5"
                              title={`React with ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Quick Emoji Toolbar */}
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2 bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Quick Comments:
                </span>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors ${
                    showEmojiPicker ? 'bg-rose-600 text-white' : 'text-rose-400 hover:text-rose-300'
                  }`}
                >
                  <Smile className="w-3.5 h-3.5" />
                  {showEmojiPicker ? 'Close' : 'Grid'}
                </button>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {quickEmojiPresets.map((item) => (
                  <button
                    key={item.emoji}
                    type="button"
                    onClick={() => handleSendQuickEmojiComment(item.emoji, item.label)}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-rose-600/30 text-xs font-bold text-slate-200 border border-slate-700 hover:border-rose-500/50 transition-all shrink-0 flex items-center gap-1.5 active:scale-95"
                  >
                    <span>{item.emoji}</span>
                    <span className="text-[10px] text-slate-300">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Emoji Picker Grid */}
              {showEmojiPicker && (
                <div className="p-2.5 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-8 gap-1.5 max-h-32 overflow-y-auto animate-in fade-in duration-150">
                  {fullEmojiGrid.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setCommentInput((prev) => prev + emoji);
                        triggerFloatingEmoji(emoji);
                      }}
                      className="text-lg p-1.5 hover:bg-slate-800 rounded-xl hover:scale-125 transition-transform flex items-center justify-center"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Comment Input */}
              <form onSubmit={handleAddComment} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder={`Comment for @${currentVideo.userUsername}...`}
                    className="w-full bg-slate-800 text-slate-100 text-xs pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-transform active:scale-95 shadow-md shadow-rose-600/30"
                  title="Post Comment"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* SUPPORT CREATOR MODAL */}
        {showSupportModal && (
          <div className="absolute inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in zoom-in-95">
            <div className="w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-3xl p-5 flex flex-col gap-4 shadow-2xl relative">
              <button
                onClick={() => setShowSupportModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Coins className="w-6 h-6 animate-bounce" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-extrabold text-white">Support @{currentVideo.userUsername}</h4>
                  <span className="text-xs text-slate-400">Send Postly Creator Coins</span>
                </div>
              </div>

              {/* Tip Amount Tiers */}
              <div className="flex items-center justify-around gap-2 py-1">
                {[50, 100, 250, 500].map((coins) => (
                  <button
                    key={coins}
                    onClick={() => {
                      setSelectedTipCoins(coins);
                      soundEffects.playClickSound();
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                      selectedTipCoins === coins
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <Coins className="w-4 h-4" />
                    <span>{coins} Coins</span>
                  </button>
                ))}
              </div>

              <textarea
                value={tipMessage}
                onChange={(e) => setTipMessage(e.target.value)}
                placeholder="Add an encouraging note to creator..."
                rows={2}
                className="w-full bg-slate-800 text-slate-100 text-xs p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500"
              />

              <button
                onClick={handleSendCreatorSupport}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-black text-xs transition-transform active:scale-95 shadow-xl flex items-center justify-center gap-1.5"
              >
                <Coins className="w-4 h-4 fill-current" />
                SEND {selectedTipCoins} CREATOR COINS
              </button>
            </div>
          </div>
        )}

        {/* AI SUMMARY POPUP MODAL */}
        {showAiSummaryModal && (
          <div className="absolute inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in zoom-in-95">
            <div className="w-full max-w-sm bg-slate-900 border border-purple-500/40 rounded-3xl p-5 flex flex-col gap-4 shadow-2xl relative">
              <button
                onClick={() => setShowAiSummaryModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-extrabold text-white">AI Video TL;DR Highlights</h4>
                  <span className="text-xs text-purple-300">Generated for @{currentVideo.userUsername}</span>
                </div>
              </div>

              {isAiSummarizing ? (
                <div className="py-8 flex flex-col items-center justify-center gap-3 text-purple-300">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                  <span className="text-xs font-semibold">Synthesizing key insights...</span>
                </div>
              ) : videoSummary ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                    <span className="text-slate-400">Viral Sentiment:</span>
                    <span className="font-bold text-emerald-400">{videoSummary.sentiment}</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-300">Key Takeaways:</span>
                    {videoSummary.takeaways.map((point, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-200 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <button
                onClick={() => setShowAiSummaryModal(false)}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                Close Summary
              </button>
            </div>
          </div>
        )}

        {/* POSTLY AD TRANSPARENCY & CHAT PRIVACY MODAL */}
        {showAdInfoModal && selectedAdForModal && (
          <div className="absolute inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in zoom-in-95">
            <div className="w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-3xl p-5 flex flex-col gap-4 shadow-2xl relative">
              <button
                onClick={() => setShowAdInfoModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <ShieldCheck className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-extrabold text-white">Postly Ad & Privacy Policy</h4>
                  <span className="text-xs text-amber-300">100% Ad-Free Chat Guarantee</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-start gap-2.5">
                  <span className="text-base">📍</span>
                  <div>
                    <strong className="text-white block font-bold">Exclusively on Postly Reels</strong>
                    All sponsored posts and partner announcements are strictly confined to Postly video feeds.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-base">🚫</span>
                  <div>
                    <strong className="text-white block font-bold">Zero Interruptions in Chat</strong>
                    Your direct messages, group chats, voice messages, files, and video calls never contain ads, popups, or banner banners.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-base">🔒</span>
                  <div>
                    <strong className="text-white block font-bold">Zero Private Data Targeting</strong>
                    Your private conversation transcripts and contact list are never indexed, analyzed, or shared with ad networks.
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400">Sponsor:</span>
                <span className="font-bold text-amber-300">{selectedAdForModal.sponsorName || selectedAdForModal.userName}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setHiddenAdIds((prev) => [...prev, selectedAdForModal.id]);
                    setShowAdInfoModal(false);
                    setSupportSuccessMessage('Ad hidden from your feed.');
                    setTimeout(() => setSupportSuccessMessage(null), 3000);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  Hide This Ad
                </button>
                <button
                  onClick={() => setShowAdInfoModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SPONSORED CTA & PROMO VOUCHER MODAL */}
        {showAdCtaModal && selectedAdForModal && (
          <div className="absolute inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in zoom-in-95">
            <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-5 flex flex-col gap-4 shadow-2xl relative">
              <button
                onClick={() => setShowAdCtaModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-md">
                  {selectedAdForModal.userName.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <h4 className="text-sm font-black text-white">{selectedAdForModal.sponsorName || selectedAdForModal.userName}</h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <span className="text-[11px] text-amber-300 font-semibold">{selectedAdForModal.sponsorCategory || 'Featured Partner'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {selectedAdForModal.caption}
                </p>

                {selectedAdForModal.sponsorTagline && (
                  <div className="text-[10px] text-amber-300/90 font-mono bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    💡 {selectedAdForModal.sponsorTagline}
                  </div>
                )}
              </div>

              {/* Promo Code Voucher Box */}
              <div className="p-3 rounded-xl bg-amber-500/15 border border-dashed border-amber-400/50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Postly Exclusive Code</span>
                  <span className="text-sm font-mono font-black text-white">POSTLY2026</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText('POSTLY2026');
                    soundEffects.playSendSound();
                    setSupportSuccessMessage('Promo code POSTLY2026 copied to clipboard!');
                    setTimeout(() => setSupportSuccessMessage(null), 3000);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowAdCtaModal(false);
                    soundEffects.playTapSound();
                    setSupportSuccessMessage(`Opening offer for ${selectedAdForModal.sponsorName || 'partner'}!`);
                    setTimeout(() => setSupportSuccessMessage(null), 3000);
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl hover:opacity-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Claim Partner Offer & Launch</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VERIFIED BADGE INFO MODAL */}
        {verifiedBadgeInfoModal && (
          <div className="absolute inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in zoom-in-95">
            <div className="w-full max-w-sm bg-slate-900 border border-cyan-500/40 rounded-3xl p-5 flex flex-col gap-4 shadow-2xl relative">
              <button
                onClick={() => setVerifiedBadgeInfoModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-2xl border ${
                    verifiedBadgeInfoModal.tier === 'company'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  }`}
                >
                  <BadgeCheck className="w-7 h-7 fill-current" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-extrabold text-white">
                      {verifiedBadgeInfoModal.userName}
                    </h4>
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                        verifiedBadgeInfoModal.tier === 'company'
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-cyan-400 text-slate-950'
                      }`}
                    >
                      {verifiedBadgeInfoModal.tier === 'company' ? 'Company' : 'Creator'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">Postly Verified Account</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    This account underwent identity verification and compliance review by the Postly
                    Trust & Safety Team.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-slate-400">
                    Application fee: <strong className="text-white">$2 (Creator)</strong> /{' '}
                    <strong className="text-white">$5 (Company)</strong>. All review fees are
                    strictly non-refundable.
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setVerifiedBadgeInfoModal(null);
                    setShowVerificationModal(true);
                    soundEffects.playTapSound();
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-transform"
                >
                  <BadgeCheck className="w-4 h-4 fill-current" />
                  Apply for Verification
                </button>
                <button
                  onClick={() => setVerifiedBadgeInfoModal(null)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* POSTLY VERIFICATION APPLICATION MODAL */}
        <PostlyVerificationModal
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          currentUser={currentUser}
          onVerificationApproved={handleVerificationApproved}
        />

        {/* TIKTOK CREATOR STUDIO FULL-SCREEN OVERLAY */}
        {showTikTokStudio && (
          <TikTokCreatorStudio
            currentUser={currentUser}
            onClose={() => setShowTikTokStudio(false)}
            onPublish={handlePublishFromTikTokStudio}
            onOpenAiStudio={() => {
              setShowTikTokStudio(false);
              setActiveTab('ai_studio');
            }}
          />
        )}

        {/* TIKTOK-STYLE CREATOR PROFILE MODAL */}
        <PostlyCreatorProfileModal
          isOpen={Boolean(selectedProfileCreatorId)}
          onClose={() => setSelectedProfileCreatorId(null)}
          creatorId={selectedProfileCreatorId || ''}
          allVideos={videos}
          currentUser={currentUser}
          onSelectVideo={(v) => {
            const idx = displayVideos.findIndex((item) => item.id === v.id);
            if (idx !== -1) {
              setCurrentVideoIndex(idx);
            } else {
              const mainIdx = videos.findIndex((item) => item.id === v.id);
              if (mainIdx !== -1) {
                setActiveTab('foryou');
                setCurrentVideoIndex(mainIdx);
              }
            }
            setSelectedProfileCreatorId(null);
          }}
          onToggleFollow={(userId) => handleToggleFollow(userId)}
          onOpenDirectChat={(userId, userName) => {
            setSelectedProfileCreatorId(null);
            setSelectedDirectChatCreatorId(userId);
            soundEffects.playTapSound();
          }}
          onSendTip={(video) => {
            setSelectedProfileCreatorId(null);
            setShowSupportModal(true);
          }}
          onOpenVerificationInfo={(userName, tier) => {
            setVerifiedBadgeInfoModal({ userName, tier });
          }}
        />

        {/* POSTLY DIRECT CREATOR CHAT / DM MODAL (100% Isolated from private chats) */}
        {selectedDirectChatCreatorId && (() => {
          const targetVideo = videos.find((v) => v.userId === selectedDirectChatCreatorId);
          const activeConv = postlyConversations.find((c) => c.creatorId === selectedDirectChatCreatorId);
          const creatorName = activeConv?.creatorName || targetVideo?.userName || 'Creator';
          const creatorUsername = activeConv?.creatorUsername || targetVideo?.userUsername || 'creator';
          const creatorAvatar = activeConv?.creatorAvatar || targetVideo?.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
          const isVerified = activeConv?.isVerified ?? targetVideo?.isVerified ?? false;
          const verificationType = activeConv?.verificationType || targetVideo?.verificationType || 'individual';

          return (
            <PostlyDirectChatModal
              isOpen={Boolean(selectedDirectChatCreatorId)}
              onClose={() => setSelectedDirectChatCreatorId(null)}
              creatorId={selectedDirectChatCreatorId}
              creatorName={creatorName}
              creatorUsername={creatorUsername}
              creatorAvatar={creatorAvatar}
              isVerified={isVerified}
              verificationType={verificationType}
              currentUser={currentUser}
              conversation={activeConv}
              onSendMessage={handleSendPostlyDirectMessage}
              onOpenProfile={(cid) => {
                setSelectedDirectChatCreatorId(null);
                setSelectedProfileCreatorId(cid);
              }}
            />
          );
        })()}
        {/* Persistent Bottom Navigation Dock Bar */}
        <div
          className={`bg-slate-950/95 border-t border-slate-800/80 flex items-center justify-around z-40 shrink-0 select-none transition-all duration-300 ease-in-out ${
            isControlsHidden
              ? 'translate-y-full opacity-0 max-h-0 py-0 px-2 overflow-hidden border-t-0 pointer-events-none'
              : 'translate-y-0 opacity-100 max-h-24 p-2 pointer-events-auto'
          }`}
        >
          <button
            onClick={() => {
              onClose();
              if (onNavigateToTab) onNavigateToTab('chats');
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 gap-1 rounded-xl text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-[9px] font-semibold leading-none">Chats</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onNavigateToTab) onNavigateToTab('ai');
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 gap-1 rounded-xl text-slate-400 hover:text-purple-300 transition-colors relative"
          >
            <div className="relative">
              <img src="/alpha-logo.svg" alt="Alpha" className="w-4 h-4 object-contain rounded-full" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <span className="text-[9px] font-semibold leading-none">Alpha</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('foryou');
              setIsControlsHidden(false);
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 gap-1 rounded-xl text-rose-400 font-bold scale-105"
          >
            <Wifi className="w-4 h-4" />
            <span className="text-[9px] leading-none">Postly</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onNavigateToTab) onNavigateToTab('starred');
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 gap-1 rounded-xl text-slate-400 hover:text-amber-400 transition-colors"
          >
            <Star className="w-4 h-4" />
            <span className="text-[9px] font-semibold leading-none">Saved</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onNavigateToTab) onNavigateToTab('calls');
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 gap-1 rounded-xl text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span className="text-[9px] font-semibold leading-none">Calls</span>
          </button>
        </div>
      </div>
    </div>
  );
};
