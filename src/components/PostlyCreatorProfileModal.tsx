import React, { useState, useMemo } from 'react';
import {
  X,
  BadgeCheck,
  UserPlus,
  UserCheck,
  Heart,
  Eye,
  MessageCircle,
  Share2,
  Gift,
  Music,
  Sparkles,
  Layers,
  Flame,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  Building2,
  User as UserIcon,
  Play,
  Copy,
  Check,
  Radio,
  Send,
} from 'lucide-react';
import { PostlyVideo, User } from '../types';
import { soundEffects } from '../utils/audio';

export interface CreatorProfileData {
  userId: string;
  userName: string;
  userUsername: string;
  userAvatar: string;
  bio?: string;
  isVerified?: boolean;
  verificationType?: 'individual' | 'company';
  followingCount?: number;
  followersCount?: number;
  totalLikes?: number;
  creatorLevel?: string;
  websiteUrl?: string;
  category?: string;
  badges?: string[];
  bannerGradient?: string;
}

interface PostlyCreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: string;
  allVideos: PostlyVideo[];
  currentUser: User;
  onSelectVideo: (video: PostlyVideo) => void;
  onToggleFollow?: (userId: string) => void;
  onOpenDirectChat?: (userId: string, userName: string) => void;
  onSendTip?: (video: PostlyVideo) => void;
  onOpenVerificationInfo?: (userName: string, tier: 'individual' | 'company') => void;
}

// Curated rich profile data for creators in Postly
const CREATOR_PROFILES_MAP: Record<string, Partial<CreatorProfileData>> = {
  user_sophia: {
    bio: 'AI Research Scientist & Gemini Vision Pioneer 🧠 🚀 Building real-time multi-modal neural interfaces & streaming models.',
    followingCount: 284,
    followersCount: 184500,
    totalLikes: 2840000,
    creatorLevel: '⭐ Top 1% AI Innovator',
    category: 'AI & Engineering',
    websiteUrl: 'https://research.google.com',
    badges: ['🚀 Vision Pioneer', '🏆 Hackathon Winner', '🤖 Gemini Pro'],
    bannerGradient: 'from-amber-700 via-rose-800 to-purple-900',
  },
  user_elena: {
    bio: 'Lead Product Designer & Design Systems Geek 🎨 ✨ Crafting buttery micro-interactions, dark glass UI & Tailwind CSS stacks.',
    followingCount: 192,
    followersCount: 94800,
    totalLikes: 1420000,
    creatorLevel: '✨ Master UI Artisan',
    category: 'UI/UX & Frontend',
    websiteUrl: 'https://dribbble.com/elena_design',
    badges: ['🎨 Design Lead', '💎 Glassmorphism Pro', '⭐ UI Trends 2026'],
    bannerGradient: 'from-purple-800 via-indigo-900 to-pink-900',
  },
  user_marcus: {
    bio: 'Distributed Systems & Cloud Run Performance Architect ⚡ 50k WebSocket streaming pipelines with zero-allocation buffers.',
    followingCount: 412,
    followersCount: 210400,
    totalLikes: 3150000,
    creatorLevel: '⚡ Supercharged Host',
    category: 'Backend & Cloud',
    websiteUrl: 'https://github.com/marcusvance',
    badges: ['⚡ WebSocket Master', '☁️ Cloud Run Champion', '🛡️ Security Pro'],
    bannerGradient: 'from-blue-900 via-cyan-950 to-slate-900',
  },
  user_me: {
    bio: 'Full Stack Engineer & Creator of ChatWave & Postly 🚀 Building the next-generation real-time communication platform.',
    followingCount: 145,
    followersCount: 52800,
    totalLikes: 890000,
    creatorLevel: '🚀 Postly Pioneer',
    category: 'Full Stack Dev',
    websiteUrl: 'https://chatwave.app',
    badges: ['👑 App Founder', '🔥 Core Contributor', '✨ Verified Admin'],
    bannerGradient: 'from-emerald-800 via-teal-900 to-slate-900',
  },
  user_sponsor_cloudpulse: {
    bio: 'The Global Edge Cloud Platform for Modern Builders 🌐 Instant serverless deployments with sub-15ms edge compute worldwide.',
    followingCount: 48,
    followersCount: 320000,
    totalLikes: 4500000,
    creatorLevel: '🏢 Official Partner Enterprise',
    category: 'Developer Tools & Cloud',
    websiteUrl: 'https://cloudpulse.io',
    badges: ['🏢 Verified Company', '🌐 35 Edge Regions', '⚡ 99.999% SLA'],
    bannerGradient: 'from-indigo-800 via-blue-900 to-cyan-900',
  },
};

export const PostlyCreatorProfileModal: React.FC<PostlyCreatorProfileModalProps> = ({
  isOpen,
  onClose,
  creatorId,
  allVideos,
  currentUser,
  onSelectVideo,
  onToggleFollow,
  onOpenDirectChat,
  onSendTip,
  onOpenVerificationInfo,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'popular' | 'duets' | 'badges'>('posts');
  const [copiedLink, setCopiedLink] = useState(false);
  const [localFollowing, setLocalFollowing] = useState<boolean | null>(null);
  const [extraFollowerOffset, setExtraFollowerOffset] = useState(0);

  // Find all videos by this creator
  const creatorVideos = useMemo(() => {
    return allVideos.filter(
      (v) => v.userId === creatorId || v.userUsername === creatorId
    );
  }, [allVideos, creatorId]);

  // Primary creator info extracted from video or predefined map
  const sampleVideo = creatorVideos[0] || allVideos.find((v) => v.userId === creatorId);

  const customInfo = CREATOR_PROFILES_MAP[creatorId] || {};

  const userName = sampleVideo?.userName || 'Postly Creator';
  const userUsername = sampleVideo?.userUsername || creatorId.replace('user_', '');
  const userAvatar =
    sampleVideo?.userAvatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const isVerified = sampleVideo?.isVerified ?? (customInfo.isVerified || Boolean(customInfo.verificationType));
  const verificationType = sampleVideo?.verificationType || customInfo.verificationType || 'individual';
  const bio =
    customInfo.bio ||
    sampleVideo?.caption ||
    'Creating original content, coding tutorials and high-energy live shows on Postly ✨';
  const creatorLevel = customInfo.creatorLevel || '⭐ Active Postly Creator';
  const category = customInfo.category || 'Creator & Tech';
  const websiteUrl = customInfo.websiteUrl || 'https://postly.live';
  const badges = customInfo.badges || ['✨ Postly Creator', '🔥 Trending Author'];
  const bannerGradient =
    customInfo.bannerGradient ||
    sampleVideo?.bgGradient ||
    'from-rose-900 via-purple-950 to-slate-950';

  // Calculate sum of likes, views, and followers
  const totalLikesCalculated = useMemo(() => {
    if (customInfo.totalLikes) return customInfo.totalLikes;
    const sum = creatorVideos.reduce((acc, v) => acc + (v.likes || 0), 0);
    return Math.max(sum, 14200);
  }, [creatorVideos, customInfo.totalLikes]);

  const baseFollowers = customInfo.followersCount || 48200;
  const isCurrentlyFollowing =
    localFollowing !== null ? localFollowing : sampleVideo?.isFollowing ?? false;

  const followersDisplay = baseFollowers + extraFollowerOffset + (isCurrentlyFollowing ? 1 : 0);
  const followingDisplay = customInfo.followingCount || 215;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
    }
    if (num >= 10000) {
      return (num / 1000).toFixed(1).replace('.0', '') + 'K';
    }
    return num.toLocaleString();
  };

  // Filter videos according to tab
  const displayedPosts = useMemo(() => {
    if (activeTab === 'popular') {
      return [...creatorVideos].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    if (activeTab === 'duets') {
      return creatorVideos.filter((v) => v.caption.toLowerCase().includes('duet') || v.caption.toLowerCase().includes('remix'));
    }
    return creatorVideos;
  }, [creatorVideos, activeTab]);

  const handleFollowToggle = () => {
    const nextState = !isCurrentlyFollowing;
    setLocalFollowing(nextState);
    if (nextState) {
      setExtraFollowerOffset((prev) => prev);
      soundEffects.playCelebrationChime();
    } else {
      soundEffects.playClickSound();
    }
    if (onToggleFollow) {
      onToggleFollow(creatorId);
    }
  };

  const handleCopyProfile = () => {
    const url = `https://chatwave.app/@${userUsername}`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    soundEffects.playTapSound();
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl max-h-[92vh] bg-slate-950 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP BANNER & ACTION BAR */}
        <div className={`relative h-32 sm:h-36 bg-gradient-to-r ${bannerGradient} p-4 flex items-start justify-between shrink-0 overflow-hidden`}>
          {/* Subtle geometric particles pattern */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Category Pill */}
          <div className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-xs font-bold text-slate-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>{category}</span>
          </div>

          {/* Top Actions: Copy link + Close */}
          <div className="relative z-10 flex items-center gap-2">
            <button
              onClick={handleCopyProfile}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-slate-200 hover:text-white border border-white/15 transition-all hover:scale-105 active:scale-95 shadow-md flex items-center gap-1 text-xs font-semibold"
              title="Share Profile Link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-slate-300 hover:text-white border border-white/15 transition-all hover:scale-105 active:scale-95 shadow-md"
              title="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PROFILE HEADER & STATS (TikTok Style with Premium Accents) */}
        <div className="relative px-5 sm:px-6 pt-0 pb-3 border-b border-slate-800/80 bg-slate-950 flex flex-col gap-3 shrink-0">
          {/* Avatar (overlapping banner) + Follow & Message Buttons */}
          <div className="flex items-end justify-between -mt-12 sm:-mt-14 gap-3">
            {/* Creator Avatar with Glowing Ring */}
            <div className="relative">
              <div className="p-1 rounded-full bg-gradient-to-tr from-[#2ECC71] via-emerald-400 to-indigo-500 shadow-xl ring-4 ring-slate-950">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-2 ring-black"
                />
              </div>

              {/* Verified Badge on Avatar */}
              {isVerified && (
                <div
                  onClick={() => onOpenVerificationInfo?.(userName, verificationType)}
                  className={`absolute bottom-0 right-0 p-1 rounded-full shadow-lg cursor-pointer ring-2 ring-slate-950 transition-transform hover:scale-125 ${
                    verificationType === 'company'
                      ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-300'
                      : 'bg-cyan-500 text-slate-950 ring-1 ring-cyan-300'
                  }`}
                  title={`Verified ${verificationType === 'company' ? 'Company' : 'Creator'} (Postly Official)`}
                >
                  <BadgeCheck className="w-4 h-4 fill-current stroke-slate-950 stroke-[2.5]" />
                </div>
              )}
            </div>

            {/* Main Action Buttons */}
            <div className="flex items-center gap-2 pb-1">
              {currentUser.id !== creatorId ? (
                <>
                  {/* Follow Button */}
                  <button
                    onClick={handleFollowToggle}
                    className={`px-4 sm:px-5 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                      isCurrentlyFollowing
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        : 'bg-[#2ECC71] hover:bg-[#27ae60] text-black shadow-[#2ECC71]/30 hover:scale-105'
                    }`}
                  >
                    {isCurrentlyFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>

                  {/* Message Button */}
                  <button
                    onClick={() => {
                      if (onOpenDirectChat) {
                        onOpenDirectChat(creatorId, userName);
                        onClose();
                      }
                    }}
                    className="p-2 sm:px-3.5 sm:py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-sm"
                    title="Send Direct Chat Message"
                  >
                    <Send className="w-4 h-4 text-indigo-400" />
                    <span className="hidden sm:inline">Message</span>
                  </button>

                  {/* Tip / Send Gift */}
                  {sampleVideo && (
                    <button
                      onClick={() => {
                        if (onSendTip) onSendTip(sampleVideo);
                      }}
                      className="p-2 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold transition-all hover:scale-105 active:scale-95 shadow-sm"
                      title="Send Postly Coins / Tip"
                    >
                      <Gift className="w-4 h-4" />
                    </button>
                  )}
                </>
              ) : (
                <div className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
                  Your Profile
                </div>
              )}
            </div>
          </div>

          {/* Name & Handle & Verification Breakdown */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {userName}
              </h2>

              {/* Verified Badge Pill */}
              {isVerified && (
                <button
                  onClick={() => onOpenVerificationInfo?.(userName, verificationType)}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black shadow-sm transition-transform hover:scale-105 ${
                    verificationType === 'company'
                      ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-300'
                      : 'bg-cyan-500 text-slate-950 ring-1 ring-cyan-300'
                  }`}
                  title="Click to view Postly Official Verification details"
                >
                  <BadgeCheck className="w-3.5 h-3.5 fill-current" />
                  <span>{verificationType === 'company' ? 'Verified Company' : 'Verified Creator'}</span>
                </button>
              )}

              {/* Creator Level Pill */}
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/80">
                {creatorLevel}
              </span>
            </div>

            <span className="text-sm font-semibold text-slate-400">
              @{userUsername}
            </span>
          </div>

          {/* TikTok-Style Numbers Bar: Following | Followers | Likes */}
          <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-center select-none shadow-inner">
            <div className="flex flex-col items-center justify-center">
              <span className="text-lg sm:text-xl font-black text-white tracking-tight">
                {formatNumber(followingDisplay)}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Following
              </span>
            </div>

            <div className="flex flex-col items-center justify-center border-x border-slate-800">
              <span className="text-lg sm:text-xl font-black text-emerald-400 tracking-tight">
                {formatNumber(followersDisplay)}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Followers
              </span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <span className="text-lg sm:text-xl font-black text-rose-400 tracking-tight flex items-center gap-1">
                <Heart className="w-4 h-4 fill-rose-500 stroke-none" />
                {formatNumber(totalLikesCalculated)}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Likes
              </span>
            </div>
          </div>

          {/* Bio text */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            {bio}
          </p>

          {/* Badges / Creator Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {badges.map((b, idx) => (
              <span
                key={idx}
                className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60"
              >
                {b}
              </span>
            ))}
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-indigo-950/60 text-indigo-300 border border-indigo-700/50 hover:text-indigo-200 flex items-center gap-1 transition-colors"
              >
                <ExternalLink className="w-2.5 h-2.5" />
                <span>{websiteUrl.replace('https://', '')}</span>
              </a>
            )}
          </div>
        </div>

        {/* TIKTOK-STYLE POST TABS */}
        <div className="bg-slate-950/90 px-4 pt-2 border-b border-slate-800/80 flex items-center justify-around shrink-0">
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all relative ${
              activeTab === 'posts'
                ? 'text-white font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Posts ({creatorVideos.length})</span>
            {activeTab === 'posts' && (
              <span className="absolute bottom-0 inset-x-2 h-0.5 bg-[#2ECC71] rounded-full shadow-[0_0_8px_rgba(46,204,113,0.8)]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('popular')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all relative ${
              activeTab === 'popular'
                ? 'text-rose-400 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4 text-rose-500" />
            <span>Popular 🔥</span>
            {activeTab === 'popular' && (
              <span className="absolute bottom-0 inset-x-2 h-0.5 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('duets')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all relative ${
              activeTab === 'duets'
                ? 'text-indigo-400 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Music className="w-4 h-4 text-indigo-400" />
            <span>Duets & Remixes</span>
            {activeTab === 'duets' && (
              <span className="absolute bottom-0 inset-x-2 h-0.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all relative ${
              activeTab === 'badges'
                ? 'text-cyan-400 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Verified Info</span>
            {activeTab === 'badges' && (
              <span className="absolute bottom-0 inset-x-2 h-0.5 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            )}
          </button>
        </div>

        {/* POSTS GRID & TAB CONTENT (TikTok 3-Column Grid) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-slate-950/60 min-h-[260px]">
          {activeTab !== 'badges' ? (
            displayedPosts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                {displayedPosts.map((video, idx) => {
                  const hasMultiplePhotos = (video.photos && video.photos.length > 1);
                  const isTopLiked = (video.likes || 0) > 3000;

                  return (
                    <div
                      key={video.id || idx}
                      onClick={() => {
                        onSelectVideo(video);
                        onClose();
                        soundEffects.playTapSound();
                      }}
                      className="group relative aspect-[9/14] sm:aspect-[9/13] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 cursor-pointer transition-all hover:scale-[1.02] hover:border-[#2ECC71]/60 shadow-md hover:shadow-xl hover:shadow-[#2ECC71]/10"
                    >
                      {/* Thumbnail Cover Photo / Gradient */}
                      {video.coverImage || (video.photos && video.photos[0]) ? (
                        <img
                          src={video.coverImage || (video.photos && video.photos[0])}
                          alt={video.caption}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-tr ${video.bgGradient || 'from-purple-900 via-slate-900 to-indigo-950'} flex items-center justify-center p-3 text-center text-xs font-bold text-slate-300`}>
                          {video.caption.slice(0, 50)}...
                        </div>
                      )}

                      {/* Top Badges (Pinned / Multi-Photo) */}
                      <div className="absolute top-2 inset-x-2 flex items-center justify-between pointer-events-none z-10">
                        {idx === 0 || isTopLiked ? (
                          <span className="px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-black shadow-sm flex items-center gap-0.5">
                            📌 Pinned
                          </span>
                        ) : <span />}

                        {hasMultiplePhotos && (
                          <span className="px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[9px] font-bold shadow-sm border border-white/10">
                            📸 {video.photos?.length}
                          </span>
                        )}
                      </div>

                      {/* Bottom Overlay (Views & Likes Count with Glass Gradient) */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-2 pt-6 flex flex-col justify-end gap-1">
                        <p className="text-[11px] text-slate-200 font-semibold line-clamp-2 leading-tight drop-shadow">
                          {video.caption}
                        </p>
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-300">
                          <span className="flex items-center gap-1 text-slate-300">
                            <Play className="w-3 h-3 fill-slate-300" />
                            {formatNumber(video.views || 12000)}
                          </span>
                          <span className="flex items-center gap-0.5 text-rose-400">
                            <Heart className="w-3 h-3 fill-rose-500 stroke-none" />
                            {formatNumber(video.likes || 1400)}
                          </span>
                        </div>
                      </div>

                      {/* Hover Play Button Glow */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-[#2ECC71] text-black flex items-center justify-center shadow-lg shadow-[#2ECC71]/40 transform scale-90 group-hover:scale-100 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                  <Layers className="w-7 h-7" />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-base font-bold text-slate-200">No Posts in this Tab</h4>
                  <p className="text-xs text-slate-400 max-w-xs">
                    @{userUsername} hasn't published any posts under this category yet.
                  </p>
                </div>
              </div>
            )
          ) : (
            /* VERIFICATION & CREDIBILITY BREAKDOWN TAB */
            <div className="flex flex-col gap-3 py-2">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-2xl shrink-0 shadow-md ${
                    verificationType === 'company'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}
                >
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-white">
                      {isVerified
                        ? `Official Postly ${verificationType === 'company' ? 'Company' : 'Creator'} Verification`
                        : 'Standard Creator Account'}
                    </h4>
                    {isVerified && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        Active & Compliant
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isVerified
                      ? `This account @${userUsername} underwent full identity, creative portfolio, and safety screening under Postly Verified standards.`
                      : `@${userUsername} has published ${creatorVideos.length} original post(s) to Postly.`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Total Post Engagement
                  </span>
                  <span className="text-lg font-black text-white">
                    {formatNumber(totalLikesCalculated)} Likes &middot; {formatNumber(creatorVideos.reduce((a, v) => a + (v.views || 0), 0) || 120000)} Views
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Community Trust Score
                  </span>
                  <span className="text-lg font-black text-emerald-400">
                    99.8% Safety & Quality ⭐
                  </span>
                </div>
              </div>

              {/* Creator Support CTA */}
              {currentUser.id !== creatorId && sampleVideo && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 flex items-center justify-between gap-3 mt-1">
                  <div className="flex items-center gap-3">
                    <Gift className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-white">Support @{userUsername}'s Work</h5>
                      <p className="text-[11px] text-slate-400">Send Postly creator coins or tip directly.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (onSendTip) onSendTip(sampleVideo);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all hover:scale-105 active:scale-95 shadow-md shadow-emerald-500/20"
                  >
                    Tip Coins
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
