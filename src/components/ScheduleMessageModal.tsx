import React, { useState } from 'react';
import { Clock, Send, X, Calendar, Sparkles } from 'lucide-react';

interface ScheduleMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleMessage: (scheduledTimestamp: number, customText?: string) => void;
  currentDraftText: string;
}

export const ScheduleMessageModal: React.FC<ScheduleMessageModalProps> = ({
  isOpen,
  onClose,
  onScheduleMessage,
  currentDraftText,
}) => {
  const [draft, setDraft] = useState(currentDraftText);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(5);

  if (!isOpen) return null;

  const presets = [
    { label: 'In 1 minute', minutes: 1 },
    { label: 'In 5 minutes', minutes: 5 },
    { label: 'In 15 minutes', minutes: 15 },
    { label: 'In 1 hour', minutes: 60 },
    { label: 'In 4 hours', minutes: 240 },
    { label: 'Tomorrow 9 AM', minutes: 720 },
  ];

  const handleConfirm = () => {
    const scheduledTime = Date.now() + selectedMinutes * 60 * 1000;
    onScheduleMessage(scheduledTime, draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Schedule Message</h3>
              <p className="text-[11px] text-slate-400">Automatically send at a designated future time</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-4">
          {/* Message preview or edit */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Message Content</label>
            <textarea
              rows={3}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type the message to be scheduled..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 resize-none"
            />
          </div>

          {/* Quick timing presets */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Choose Delivery Time</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((p) => {
                const isSelected = selectedMinutes === p.minutes;
                return (
                  <button
                    key={p.minutes}
                    type="button"
                    onClick={() => setSelectedMinutes(p.minutes)}
                    className={`p-2.5 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/80 text-amber-300 font-semibold shadow-sm'
                        : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{p.label}</span>
                    {isSelected && <Sparkles className="w-3 h-3 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!draft.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Set Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
};
