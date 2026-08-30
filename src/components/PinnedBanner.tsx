import React, { useState } from 'react';
import { Pin, ChevronRight, X, Sparkles, AlertCircle, Check } from 'lucide-react';
import { Message } from '../types';

interface PinnedBannerProps {
  pinnedMessage?: Message | null;
  channelName: string;
  onUnpin?: () => void;
  onClickJump?: (messageId: string) => void;
}

export const PinnedBanner: React.FC<PinnedBannerProps> = ({
  pinnedMessage,
  channelName,
  onUnpin,
  onClickJump,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !pinnedMessage) return null;

  return (
    <div className="px-4 py-2 bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-purple-950/70 border-b border-indigo-500/20 flex items-center justify-between gap-3 text-xs backdrop-blur-md z-10 select-none shadow-sm">
      <div
        onClick={() => onClickJump?.(pinnedMessage.id)}
        className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1"
      >
        <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-110 transition-transform">
          <Pin className="w-3.5 h-3.5 fill-indigo-400/40" />
        </div>

        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 shrink-0">
            Pinned
          </span>
          <span className="text-slate-300 truncate font-medium group-hover:text-white transition-colors">
            {pinnedMessage.content}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onClickJump?.(pinnedMessage.id)}
          className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5 hover:underline"
        >
          <span>View</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {onUnpin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUnpin();
            }}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors ml-1"
            title="Unpin Message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
