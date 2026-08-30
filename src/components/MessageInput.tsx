import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Mic,
  Smile,
  Sparkles,
  BarChart2,
  Code,
  MapPin,
  Image as ImageIcon,
  X,
  Wand2,
  Gamepad2,
  Clock,
  Flame,
  Palette,
  Sticker,
  HelpCircle,
  Grid3X3,
  PartyPopper,
  Rocket,
  Terminal,
  Heart,
  DollarSign,
} from 'lucide-react';
import { Message, MessageType, ScreenFxType, User } from '../types';
import { soundEffects, formatDuration } from '../utils/audio';
import { StickerGifPicker } from './StickerGifPicker';

interface MessageInputProps {
  currentUser: User;
  onSendMessage: (
    content: string,
    type?: MessageType,
    extraData?: Record<string, unknown>
  ) => void;
  replyingToMessage: Message | null;
  onCancelReply: () => void;
  smartReplies: string[];
  onOpenPollCreator: () => void;
  onPolishDraft: (draft: string, tone: string) => Promise<string>;
  onOpenDoodle: () => void;
  onOpenSchedule: () => void;
  onOpenLocationPicker: () => void;
  onLaunchGame: (gameType: 'tictactoe' | 'trivia') => void;
  onOpenGoogleForms?: () => void;
  onTriggerFx?: (fx: ScreenFxType) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  currentUser,
  onSendMessage,
  replyingToMessage,
  onCancelReply,
  smartReplies,
  onOpenPollCreator,
  onPolishDraft,
  onOpenDoodle,
  onOpenSchedule,
  onOpenLocationPicker,
  onLaunchGame,
  onOpenGoogleForms,
  onTriggerFx,
}) => {
  const [text, setText] = useState('');
  const [showAttachmentsMenu, setShowAttachmentsMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showGamesMenu, setShowGamesMenu] = useState(false);
  const [showTimerMenu, setShowTimerMenu] = useState(false);
  const [showPolishMenu, setShowPolishMenu] = useState(false);
  const [showFxMenu, setShowFxMenu] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);

  // Disappearing messages timer (0 = off, otherwise seconds)
  const [ephemeralSeconds, setEphemeralSeconds] = useState<number>(0);

  // Voice Recording state
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim()) return;
    const extra: Record<string, unknown> = {};
    if (ephemeralSeconds > 0) {
      extra.disappearingDuration = ephemeralSeconds;
      extra.expiresAt = Date.now() + ephemeralSeconds * 1000;
    }

    // Auto-detect keyword triggers for Screen FX
    if (onTriggerFx) {
      const lower = text.toLowerCase();
      if (lower.includes('congrat') || lower.includes('celebrat') || lower.includes('party') || lower.includes('cheer')) {
        onTriggerFx('confetti');
      } else if (lower.includes('rocket') || lower.includes('launch') || lower.includes('moon') || lower.includes('ship')) {
        onTriggerFx('rocket');
      } else if (lower.includes('matrix') || lower.includes('cyber') || lower.includes('hack') || lower.includes('terminal')) {
        onTriggerFx('matrix');
      } else if (lower.includes('fire') || lower.includes('lit') || lower.includes('burn') || lower.includes('flame')) {
        onTriggerFx('fire');
      } else if (lower.includes('love') || lower.includes('heart') || lower.includes('crush') || lower.includes('adore')) {
        onTriggerFx('hearts');
      } else if (lower.includes('money') || lower.includes('cash') || lower.includes('dollar') || lower.includes('rich') || lower.includes('crypto')) {
        onTriggerFx('cash');
      }
    }

    onSendMessage(text, 'text', extra);
    setText('');
    soundEffects.playSendSound();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Voice Note Recording Simulator
  const startVoiceRecording = () => {
    setIsRecordingVoice(true);
    setRecordingDuration(0);
    soundEffects.playSendSound();

    recordingTimerRef.current = setInterval(() => {
      setRecordingDuration((prev) => prev + 1);
    }, 1000);
  };

  const cancelVoiceRecording = () => {
    setIsRecordingVoice(false);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
  };

  const stopAndSendVoiceRecording = () => {
    setIsRecordingVoice(false);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);

    const extra: Record<string, unknown> = {
      audioDuration: recordingDuration || 5,
    };
    if (ephemeralSeconds > 0) {
      extra.disappearingDuration = ephemeralSeconds;
      extra.expiresAt = Date.now() + ephemeralSeconds * 1000;
    }

    onSendMessage('Voice Note', 'audio', extra);
    soundEffects.playSendSound();
  };

  // Polish draft with AI
  const handleApplyPolish = async (tone: string) => {
    if (!text.trim()) return;
    setIsPolishing(true);
    try {
      const polished = await onPolishDraft(text, tone);
      setText(polished);
    } catch {
      // ignore
    } finally {
      setIsPolishing(false);
      setShowPolishMenu(false);
    }
  };

  const sampleEmojis = ['😊', '😂', '🔥', '👍', '❤️', '🎉', '🚀', '✨', '🧠', '💼', '✅', '🙏'];

  return (
    <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-col gap-2 relative z-10">
      {/* Ephemeral Timer Bar Indicator (If active) */}
      {ephemeralSeconds > 0 && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs animate-in fade-in">
          <div className="flex items-center gap-1.5 font-medium">
            <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>Self-destruct timer: <strong>{ephemeralSeconds}s</strong> per message</span>
          </div>
          <button
            onClick={() => setEphemeralSeconds(0)}
            className="text-[11px] underline hover:text-white"
          >
            Disable
          </button>
        </div>
      )}

      {/* Smart Reply Chips */}
      {smartReplies.length > 0 && !isRecordingVoice && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-purple-400 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3" /> AI Smart Reply:
          </span>
          {smartReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => {
                const extra: Record<string, unknown> = {};
                if (ephemeralSeconds > 0) {
                  extra.disappearingDuration = ephemeralSeconds;
                  extra.expiresAt = Date.now() + ephemeralSeconds * 1000;
                }
                onSendMessage(reply, 'text', extra);
                soundEffects.playSendSound();
              }}
              className="text-xs px-3 py-1 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 border border-purple-500/20 whitespace-nowrap transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Replying-To Quote Banner */}
      {replyingToMessage && (
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/90 border-l-4 border-emerald-500 text-xs">
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-emerald-400">
              Replying to {replyingToMessage.senderName}
            </span>
            <span className="text-slate-300 truncate">{replyingToMessage.content}</span>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 hover:bg-slate-700 text-slate-400 hover:text-white rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Attachments Menu Popover */}
      {showAttachmentsMenu && (
        <div className="absolute bottom-16 left-2 sm:left-4 max-w-[calc(100vw-24px)] bg-slate-800 border border-slate-700 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 z-30 w-56 animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={() => {
              setShowAttachmentsMenu(false);
              onOpenDoodle();
            }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-slate-200 hover:bg-slate-700 active:bg-slate-600 transition-colors"
          >
            <Palette className="w-4 h-4 text-emerald-400" />
            <span>Interactive Doodle</span>
          </button>

          <button
            onClick={() => {
              setShowAttachmentsMenu(false);
              setShowGamesMenu(true);
            }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-slate-200 hover:bg-slate-700 active:bg-slate-600 transition-colors"
          >
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            <span>Play In-Chat Games</span>
          </button>

          <button
            onClick={() => {
              setShowAttachmentsMenu(false);
              onOpenLocationPicker();
            }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-slate-200 hover:bg-slate-700 active:bg-slate-600 transition-colors"
          >
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>Share Location Pin</span>
          </button>

          <button
            onClick={() => {
              setShowAttachmentsMenu(false);
              onOpenSchedule();
            }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-slate-200 hover:bg-slate-700 active:bg-slate-600 transition-colors"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Schedule Message</span>
          </button>

          <button
            onClick={() => {
              setShowAttachmentsMenu(false);
              setShowTimerMenu(true);
            }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-slate-200 hover:bg-slate-700 active:bg-slate-600 transition-colors"
          >
            <Flame className="w-4 h-4 text-rose-500" />
            <span>Self-Destruct Timer</span>
          </button>

          <div className="h-px bg-slate-700 my-1" />

          {onOpenGoogleForms && (
            <button
              onClick={() => {
                setShowAttachmentsMenu(false);
                onOpenGoogleForms();
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-purple-300 hover:bg-slate-700 active:bg-slate-600 transition-colors"
            >
              <BarChart2 className="w-4 h-4 text-purple-400" />
              <span>Google Form / Survey</span>
            </button>
          )}

          <button
            onClick={() => {
              setShowAttachmentsMenu(false);
              onOpenPollCreator();
            }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-slate-200 hover:bg-slate-700 active:bg-slate-600 transition-colors"
          >
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            <span>Create Quick Poll</span>
          </button>

          <button
            onClick={() => {
              setShowAttachmentsMenu(false);
              onSendMessage(
                `// Sample Code\nfunction calculateMetrics(records) {\n  return records.map(r => r.score * 1.5);\n}`,
                'code',
                { codeLanguage: 'typescript' }
              );
            }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-slate-200 hover:bg-slate-700 active:bg-slate-600 transition-colors"
          >
            <Code className="w-4 h-4 text-emerald-400" />
            <span>Code Snippet</span>
          </button>

          <button
            onClick={() => {
              setShowAttachmentsMenu(false);
              onSendMessage('Tech Architecture Roadmap.pdf', 'file');
            }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-slate-200 hover:bg-slate-700 active:bg-slate-600 transition-colors"
          >
            <Paperclip className="w-4 h-4 text-blue-400" />
            <span>Document / File</span>
          </button>
        </div>
      )}

      {/* Games Selection Submenu */}
      {showGamesMenu && (
        <div className="absolute bottom-16 left-2 sm:left-6 max-w-[calc(100vw-24px)] bg-slate-800 border border-slate-700 rounded-2xl p-2.5 shadow-2xl flex flex-col gap-2 z-30 w-60 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-700">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4" /> Start In-Chat Game
            </span>
            <button onClick={() => setShowGamesMenu(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => {
              setShowGamesMenu(false);
              onLaunchGame('tictactoe');
            }}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-700 border border-slate-700/60 text-left flex items-center gap-2.5 transition-all"
          >
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
              <Grid3X3 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100">Tic-Tac-Toe Duel</p>
              <p className="text-[10px] text-slate-400">Play live turn-by-turn with friends or AI</p>
            </div>
          </button>

          <button
            onClick={() => {
              setShowGamesMenu(false);
              onLaunchGame('trivia');
            }}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-700 border border-slate-700/60 text-left flex items-center gap-2.5 transition-all"
          >
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100">Brain Trivia Challenge</p>
              <p className="text-[10px] text-slate-400">Speed quiz with XP rewards</p>
            </div>
          </button>
        </div>
      )}

      {/* Disappearing Messages Timer Submenu */}
      {showTimerMenu && (
        <div className="absolute bottom-16 left-2 sm:left-8 max-w-[calc(100vw-24px)] bg-slate-800 border border-slate-700 rounded-2xl p-2.5 shadow-2xl flex flex-col gap-1.5 z-30 w-56 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-700">
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500" /> Ephemeral Timer
            </span>
            <button onClick={() => setShowTimerMenu(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {[
            { label: 'Off (Keep Forever)', seconds: 0 },
            { label: '10 Seconds', seconds: 10 },
            { label: '30 Seconds', seconds: 30 },
            { label: '1 Minute', seconds: 60 },
            { label: '5 Minutes', seconds: 300 },
          ].map((t) => (
            <button
              key={t.seconds}
              onClick={() => {
                setEphemeralSeconds(t.seconds);
                setShowTimerMenu(false);
              }}
              className={`text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                ephemeralSeconds === t.seconds
                  ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40'
                  : 'text-slate-200 hover:bg-slate-700'
              }`}
            >
              <span>{t.label}</span>
              {ephemeralSeconds === t.seconds && <span>✓</span>}
            </button>
          ))}
        </div>
      )}

      {/* AI Tone Polish Popover */}
      {showPolishMenu && (
        <div className="absolute bottom-16 left-2 sm:left-12 max-w-[calc(100vw-24px)] bg-slate-800 border border-slate-700 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 z-30 w-52 animate-in fade-in slide-in-from-bottom-2">
          <div className="px-2 py-1 text-[11px] font-bold text-purple-400 flex items-center gap-1">
            <Wand2 className="w-3.5 h-3.5" /> Rephrase Draft Tone
          </div>
          <button
            onClick={() => handleApplyPolish('professional')}
            className="text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-700 active:bg-slate-600 transition-colors"
          >
            💼 Professional
          </button>
          <button
            onClick={() => handleApplyPolish('concise')}
            className="text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-700 active:bg-slate-600 transition-colors"
          >
            ⚡ Short & Concise
          </button>
          <button
            onClick={() => handleApplyPolish('executive')}
            className="text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-700 active:bg-slate-600 transition-colors"
          >
            👑 Executive Summary
          </button>
        </div>
      )}

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 right-2 sm:right-auto sm:left-24 max-w-[calc(100vw-24px)] bg-slate-800 border border-slate-700 rounded-2xl p-3 shadow-2xl grid grid-cols-6 sm:grid-cols-4 gap-2 z-30">
          {sampleEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                setText((prev) => prev + emoji);
                setShowEmojiPicker(false);
              }}
              className="p-2 min-w-[36px] min-h-[36px] hover:bg-slate-700 active:bg-slate-600 rounded-xl text-xl flex items-center justify-center transition-transform hover:scale-125"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Stickers & GIF Picker Popover */}
      {showStickerPicker && (
        <StickerGifPicker
          onClose={() => setShowStickerPicker(false)}
          onSelectSticker={(url) => {
            const extra: Record<string, unknown> = { mediaUrl: url };
            if (ephemeralSeconds > 0) {
              extra.disappearingDuration = ephemeralSeconds;
              extra.expiresAt = Date.now() + ephemeralSeconds * 1000;
            }
            onSendMessage(url, 'sticker', extra);
            soundEffects.playSendSound();
            setShowStickerPicker(false);
          }}
          onSelectGif={(url) => {
            const extra: Record<string, unknown> = { mediaUrl: url };
            if (ephemeralSeconds > 0) {
              extra.disappearingDuration = ephemeralSeconds;
              extra.expiresAt = Date.now() + ephemeralSeconds * 1000;
            }
            onSendMessage(url, 'gif', extra);
            soundEffects.playSendSound();
            setShowStickerPicker(false);
          }}
        />
      )}

      {/* Screen Effects Popover */}
      {showFxMenu && (
        <div className="absolute bottom-16 left-2 sm:left-24 max-w-[calc(100vw-24px)] bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 z-30 w-56 animate-in fade-in slide-in-from-bottom-2">
          <div className="px-2 py-1 text-[11px] font-bold text-amber-400 flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1">
            <span className="flex items-center gap-1">
              <PartyPopper className="w-3.5 h-3.5" /> Fullscreen FX
            </span>
            <button onClick={() => setShowFxMenu(false)} className="text-slate-400 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
          {[
            { id: 'confetti', label: '🎉 Confetti Cannon', desc: 'Festive celebration burst' },
            { id: 'rocket', label: '🚀 Rocket Launch', desc: 'To the moon animation' },
            { id: 'matrix', label: '⚡ Matrix Code Rain', desc: 'Cyberpunk green terminal' },
            { id: 'fire', label: '🔥 Firestorm Inferno', desc: 'Hot particle flames' },
            { id: 'hearts', label: '💖 Floating Hearts', desc: 'Love & appreciation' },
            { id: 'cash', label: '💵 Money Rain', desc: 'Dollar drops & diamonds' },
          ].map((fx) => (
            <button
              key={fx.id}
              onClick={() => {
                if (onTriggerFx) onTriggerFx(fx.id as ScreenFxType);
                setShowFxMenu(false);
              }}
              className="text-left px-2.5 py-1.5 rounded-xl text-xs text-slate-200 hover:bg-slate-800 active:bg-slate-700 transition-colors flex flex-col"
            >
              <span className="font-semibold">{fx.label}</span>
              <span className="text-[10px] text-slate-400">{fx.desc}</span>
            </button>
          ))}
        </div>
      )}

      {/* VOICE RECORDING BAR */}
      {isRecordingVoice ? (
        <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-slate-800 border border-red-500/40 text-red-400 animate-pulse gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping shrink-0" />
            <span className="font-mono font-bold text-xs sm:text-sm truncate">
              {formatDuration(recordingDuration)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={cancelVoiceRecording}
              className="px-2.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium min-h-[36px]"
            >
              Cancel
            </button>
            <button
              onClick={stopAndSendVoiceRecording}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 text-xs font-bold flex items-center gap-1 shadow min-h-[36px]"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </div>
        </div>
      ) : (
        /* STANDARD INPUT BAR */
        <div className="flex items-end gap-1.5 sm:gap-2 bg-slate-950/80 rounded-2xl p-1.5 sm:p-2 border border-slate-800 focus-within:border-indigo-500/80 transition-all">
          {/* Attachments Button */}
          <button
            onClick={() => {
              setShowAttachmentsMenu(!showAttachmentsMenu);
              setShowGamesMenu(false);
              setShowTimerMenu(false);
              setShowStickerPicker(false);
              setShowFxMenu(false);
            }}
            className="p-2 sm:p-2.5 text-slate-400 hover:text-slate-200 active:bg-slate-800 rounded-xl transition-colors shrink-0 min-w-[38px] min-h-[38px] flex items-center justify-center"
            title="Attach Media, Games & Doodles"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Stickers & GIFs Button */}
          <button
            onClick={() => {
              setShowStickerPicker(!showStickerPicker);
              setShowAttachmentsMenu(false);
              setShowEmojiPicker(false);
              setShowFxMenu(false);
            }}
            className="p-2 sm:p-2.5 text-slate-400 hover:text-emerald-400 active:bg-slate-800 rounded-xl transition-colors shrink-0 min-w-[38px] min-h-[38px] flex items-center justify-center"
            title="Stickers & GIFs"
          >
            <Sticker className="w-5 h-5" />
          </button>

          {/* Screen FX Trigger Button */}
          <button
            onClick={() => {
              setShowFxMenu(!showFxMenu);
              setShowAttachmentsMenu(false);
              setShowEmojiPicker(false);
              setShowStickerPicker(false);
            }}
            className="p-2 sm:p-2.5 text-slate-400 hover:text-amber-400 active:bg-slate-800 rounded-xl transition-colors shrink-0 min-w-[38px] min-h-[38px] flex items-center justify-center"
            title="Party Screen Effects (Confetti, Rocket, Matrix...)"
          >
            <Sparkles className="w-5 h-5" />
          </button>

          {/* AI Polish Button */}
          <button
            onClick={() => setShowPolishMenu(!showPolishMenu)}
            className={`p-2 sm:p-2.5 rounded-xl transition-colors shrink-0 min-w-[38px] min-h-[38px] flex items-center justify-center ${
              text.trim()
                ? 'text-purple-400 hover:bg-purple-500/20 active:scale-95'
                : 'text-slate-600 cursor-not-allowed'
            }`}
            disabled={!text.trim() || isPolishing}
            title="Rephrase with AI"
          >
            <Wand2 className={`w-5 h-5 ${isPolishing ? 'animate-spin' : ''}`} />
          </button>

          {/* Text Area Input */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Shift+Enter for new line)"
            rows={1}
            className="flex-1 bg-transparent text-slate-100 text-sm placeholder-slate-400 focus:outline-none resize-none py-2 px-1 max-h-32 leading-relaxed"
          />

          {/* Emoji Toggle */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="hidden xs:flex p-2 sm:p-2.5 text-slate-400 hover:text-slate-200 active:bg-slate-800 rounded-xl transition-colors shrink-0 min-w-[38px] min-h-[38px] items-center justify-center"
            title="Emojis"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Send / Mic Button */}
          {text.trim() ? (
            <button
              onClick={handleSend}
              className="p-2.5 sm:p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white transition-transform shrink-0 shadow-md shadow-indigo-600/25 min-w-[40px] min-h-[40px] flex items-center justify-center"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={startVoiceRecording}
              className="p-2.5 sm:p-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-indigo-400 transition-transform shrink-0 min-w-[40px] min-h-[40px] flex items-center justify-center"
              title="Record Voice Note"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
