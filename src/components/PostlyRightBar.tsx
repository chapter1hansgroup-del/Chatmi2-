import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Gift,
  Disc3,
  Plus,
  Check,
  Sparkles,
  BadgeCheck,
} from 'lucide-react';
import { PostlyVideo } from '../types';
import { soundEffects } from '../utils/audio';

interface PostlyRightBarProps {
  video: PostlyVideo;
  isLiked?: boolean;
  isSaved?: boolean;
  isFollowing?: boolean;
  likesCount?: number;
  commentsCount?: number;
  savesCount?: number;
  sharesCount?: number;
  isPlaying?: boolean;
  onToggleLike: () => void;
  onToggleFollow: () => void;
  onOpenComments: () => void;
  onToggleSave: () => void;
  onShare: () => void;
  onOpenGift: () => void;
  onMusicClick?: () => void;
  onOpenVerification?: () => void;
  onOpenProfile?: () => void;
}

export const PostlyRightBar: React.FC<PostlyRightBarProps> = ({
  video,
  isLiked = false,
  isSaved = false,
  isFollowing = false,
  likesCount = 42500,
  commentsCount = 1204,
  savesCount = 890,
  sharesCount = 350,
  isPlaying = true,
  onToggleLike,
  onToggleFollow,
  onOpenComments,
  onToggleSave,
  onShare,
  onOpenGift,
  onMusicClick,
  onOpenVerification,
  onOpenProfile,
}) => {
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [followAnimating, setFollowAnimating] = useState(false);
  const [giftAnimating, setGiftAnimating] = useState(false);

  // Format large numbers (e.g. 42500 -> 42.5K, 1204 -> 1,204)
  const formatCount = (num: number, useKFormat = true): string => {
    if (useKFormat && num >= 10000) {
      return (num / 1000).toFixed(1).replace('.0', '') + 'K';
    }
    return num.toLocaleString();
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLikeAnimating(true);
    setTimeout(() => setLikeAnimating(false), 500);
    onToggleLike();
  };

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFollowAnimating(true);
    setTimeout(() => setFollowAnimating(false), 400);
    onToggleFollow();
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenProfile) {
      onOpenProfile();
    } else {
      handleFollowClick(e);
    }
  };

  const handleGiftClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGiftAnimating(true);
    setTimeout(() => setGiftAnimating(false), 600);
    soundEffects.playLevelUp();
    onOpenGift();
  };

  return (
    <aside
      id="postly-custom-right-bar"
      className="absolute right-2 sm:right-3 bottom-12 sm:bottom-14 z-30 flex flex-col items-center pointer-events-auto select-none"
      aria-label="Postly Action Bar"
    >
      {/* Ultra-Clear See-Through Glass Tube (Translucent crystal styling allowing full visibility of background post/video) */}
      <div className="w-[54px] sm:w-[60px] bg-black/15 hover:bg-black/25 backdrop-blur-[3px] border border-white/20 hover:border-white/35 rounded-[32px] sm:rounded-[36px] py-2.5 sm:py-3 px-1 flex flex-col items-center gap-2.5 sm:gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_2px_rgba(255,255,255,0.25)] transition-all">
        
        {/* 1. Profile Picture with Green Ring + Plus Follow Badge + Verified Badge */}
        <div className="flex flex-col items-center gap-1.5 pt-0.5">
          <div
            className="relative group cursor-pointer"
            onClick={handleAvatarClick}
            title={`View @${video.userUsername}'s profile and posts`}
          >
            {/* Outer Green Glow Ring */}
            <div className="relative p-0.5 rounded-full bg-gradient-to-b from-[#2ECC71] to-[#27ae60] shadow-[0_0_12px_rgba(46,204,113,0.7)] transition-transform group-hover:scale-105">
              <img
                src={video.userAvatar}
                alt={video.userName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-black/80"
              />
            </div>

            {/* Verified Badge Indicator */}
            {video.isVerified && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenProfile) {
                    onOpenProfile();
                  } else if (onOpenVerification) {
                    onOpenVerification();
                  }
                }}
                className={`absolute -top-1 -right-1 p-0.5 rounded-full shadow-md z-10 transition-transform hover:scale-125 ${
                  video.verificationType === 'company'
                    ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-300'
                    : 'bg-cyan-500 text-slate-950 ring-1 ring-cyan-300'
                }`}
                title={`Verified ${video.verificationType === 'company' ? 'Company' : 'Creator'} (Postly Official)`}
              >
                <BadgeCheck className="w-3.5 h-3.5 fill-current" />
              </button>
            )}

            {/* Overlaid Neon Green Plus Button (if not already followed) */}
            {!isFollowing && (
              <button
                type="button"
                onClick={handleFollowClick}
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#2ECC71] text-black flex items-center justify-center font-black text-[10px] shadow-[0_0_8px_rgba(46,204,113,0.9)] hover:scale-110 active:scale-90 transition-transform"
                title="Quick Follow"
              >
                <Plus className="w-3 h-3 stroke-[3]" />
              </button>
            )}

            {isFollowing && (
              <span
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-md ring-1 ring-black"
                title="Following"
              >
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
          </div>

          {/* 2. Follow Button: + Follow (Green Pill) */}
          <button
            type="button"
            onClick={handleFollowClick}
            className={`w-full py-0.5 px-1 rounded-full text-[9px] font-extrabold tracking-tight transition-all duration-200 flex items-center justify-center gap-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.6)] ${
              isFollowing
                ? 'bg-black/60 text-slate-200 border border-white/20 hover:bg-black/80'
                : 'bg-[#2ECC71] hover:bg-[#27ae60] text-black shadow-[0_0_12px_rgba(46,204,113,0.7)]'
            } ${followAnimating ? 'scale-110' : 'scale-100'}`}
            title={isFollowing ? 'Following' : 'Follow Creator'}
          >
            {isFollowing ? (
              <span className="truncate drop-shadow">Following</span>
            ) : (
              <>
                <Plus className="w-2.5 h-2.5 stroke-[3]" />
                <span className="truncate">Follow</span>
              </>
            )}
          </button>
        </div>

        {/* Divider Glow */}
        <div className="w-7 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* 3. Like: Heart icon - 42.5K */}
        <button
          type="button"
          onClick={handleLikeClick}
          className="flex flex-col items-center gap-0.5 group w-full cursor-pointer focus:outline-none"
          title="Like Video"
        >
          <div
            className={`p-1.5 rounded-full transition-all duration-300 relative ${
              isLiked
                ? 'bg-[#2ECC71]/30 text-[#2ECC71] drop-shadow-[0_0_12px_rgba(46,204,113,0.9)] shadow-[0_0_15px_rgba(46,204,113,0.5)] ring-1 ring-[#2ECC71]/60'
                : 'text-white hover:text-[#2ECC71] hover:bg-white/10'
            } ${likeAnimating ? 'scale-130 rotate-[-12deg]' : 'group-hover:scale-110'}`}
          >
            <Heart
              className={`w-6 h-6 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] transition-all duration-300 ${
                isLiked
                  ? 'fill-[#2ECC71] stroke-[#2ECC71] scale-110 drop-shadow-[0_0_8px_rgba(46,204,113,0.95)]'
                  : 'stroke-[2.2] group-hover:stroke-[#2ECC71]'
              }`}
            />
          </div>
          <span
            className={`text-[10px] font-black tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] transition-colors ${
              isLiked ? 'text-[#2ECC71]' : 'text-white group-hover:text-[#2ECC71]'
            }`}
          >
            {likesCount > 0 ? formatCount(likesCount, true) : '42.5K'}
          </span>
        </button>

        {/* 4. Comment: Bubble icon - 1,204 */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenComments();
          }}
          className="flex flex-col items-center gap-0.5 group w-full cursor-pointer focus:outline-none"
          title="View Comments"
        >
          <div className="p-1.5 rounded-full text-white hover:text-[#2ECC71] hover:bg-white/10 transition-all duration-200 group-hover:scale-110 group-active:scale-95">
            <MessageCircle className="w-6 h-6 stroke-[2.2] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] group-hover:stroke-[#2ECC71] group-hover:drop-shadow-[0_0_8px_rgba(46,204,113,0.7)]" />
          </div>
          <span className="text-[10px] font-black text-white group-hover:text-[#2ECC71] tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] transition-colors">
            {commentsCount > 0 ? formatCount(commentsCount, false) : '1,204'}
          </span>
        </button>

        {/* 5. Save: Bookmark icon - 890 */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave();
          }}
          className="flex flex-col items-center gap-0.5 group w-full cursor-pointer focus:outline-none"
          title="Save Video"
        >
          <div
            className={`p-1.5 rounded-full transition-all duration-200 ${
              isSaved
                ? 'bg-[#2ECC71]/30 text-[#2ECC71] ring-1 ring-[#2ECC71]/60 drop-shadow-[0_0_8px_rgba(46,204,113,0.8)]'
                : 'text-white hover:text-[#2ECC71] hover:bg-white/10'
            } group-hover:scale-110 group-active:scale-95`}
          >
            <Bookmark
              className={`w-6 h-6 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] transition-all ${
                isSaved ? 'fill-[#2ECC71] stroke-[#2ECC71]' : 'stroke-[2.2] group-hover:stroke-[#2ECC71]'
              }`}
            />
          </div>
          <span
            className={`text-[10px] font-black tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] transition-colors ${
              isSaved ? 'text-[#2ECC71]' : 'text-white group-hover:text-[#2ECC71]'
            }`}
          >
            {savesCount > 0 ? formatCount(savesCount, false) : '890'}
          </span>
        </button>

        {/* 6. Share: Arrow icon - Share */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onShare();
          }}
          className="flex flex-col items-center gap-0.5 group w-full cursor-pointer focus:outline-none"
          title="Share Video"
        >
          <div className="p-1.5 rounded-full text-white hover:text-[#2ECC71] hover:bg-white/10 transition-all duration-200 group-hover:scale-110 group-active:scale-95">
            <Share2 className="w-6 h-6 stroke-[2.2] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] group-hover:stroke-[#2ECC71] group-hover:drop-shadow-[0_0_8px_rgba(46,204,113,0.7)]" />
          </div>
          <span className="text-[10px] font-black text-white group-hover:text-[#2ECC71] tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] transition-colors">
            Share
          </span>
        </button>

        {/* 7. Gift: Gift box icon - Gift */}
        <button
          type="button"
          onClick={handleGiftClick}
          className="flex flex-col items-center gap-0.5 group w-full cursor-pointer focus:outline-none"
          title="Send Gift / Tip to Creator"
        >
          <div
            className={`p-1.5 rounded-full relative transition-all duration-300 ${
              giftAnimating
                ? 'bg-[#2ECC71] text-black scale-125 shadow-[0_0_20px_rgba(46,204,113,0.9)]'
                : 'text-[#2ECC71] hover:bg-[#2ECC71]/20 group-hover:scale-110 group-active:scale-95'
            }`}
          >
            <Gift className="w-6 h-6 stroke-[2.4] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]" />
            <Sparkles className="w-3 h-3 absolute -top-0.5 -right-0.5 text-yellow-300 animate-spin" />
          </div>
          <span className="text-[10px] font-black text-[#2ECC71] tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
            Gift
          </span>
        </button>

        {/* 8. Music: Disc icon - Music */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onMusicClick) onMusicClick();
            else soundEffects.playTapSound();
          }}
          className="flex flex-col items-center gap-0.5 group w-full cursor-pointer focus:outline-none pb-0.5"
          title="Audio Track: Music"
        >
          <div className="relative p-1 rounded-full text-white hover:text-[#2ECC71] group-hover:scale-110 transition-all">
            {/* Spinning Green Concentric Disc */}
            <div
              className={`w-7 h-7 rounded-full bg-black/80 border-2 border-[#2ECC71] flex items-center justify-center shadow-[0_0_10px_rgba(46,204,113,0.7)] ${
                isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
              }`}
            >
              <Disc3 className="w-4 h-4 text-[#2ECC71]" />
            </div>
            {/* Sound Wave Ripple Effect */}
            {isPlaying && (
              <span className="absolute inset-0 rounded-full border border-[#2ECC71]/40 animate-ping pointer-events-none" />
            )}
          </div>
          <span className="text-[10px] font-black text-white group-hover:text-[#2ECC71] tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] transition-colors">
            Music
          </span>
        </button>

      </div>
    </aside>
  );
};
