import React, { useState, useEffect } from 'react';
import {
  CheckCheck,
  Star,
  Play,
  Pause,
  Copy,
  Check,
  Bot,
  MapPin,
  Sparkles,
  MoreHorizontal,
  Reply,
  Languages,
  Trash2,
  Edit3,
  FileText,
  Volume2,
  ShieldCheck,
  Flame,
  Clock,
  ExternalLink,
  Compass,
} from 'lucide-react';
import { Message, User, PollOption } from '../types';
import { soundEffects, formatDuration } from '../utils/audio';
import { GameCard } from './GameCard';

interface MessageItemProps {
  message: Message;
  currentUser: User;
  onReact: (messageId: string, emoji: string) => void;
  onReply: (message: Message) => void;
  onStar: (messageId: string) => void;
  onVotePoll: (messageId: string, optionId: string) => void;
  onTranslate: (messageId: string, text: string) => void;
  onTranscribeAudio: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onMakeMove?: (gameId: string, cellIndex: number) => void;
  onAnswerTrivia?: (gameId: string, optionIndex: number) => void;
  onRematch?: (gameId: string) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  currentUser,
  onReact,
  onReply,
  onStar,
  onVotePoll,
  onTranslate,
  onTranscribeAudio,
  onDeleteMessage,
  onMakeMove,
  onAnswerTrivia,
  onRematch,
}) => {
  const isMe = message.senderId === currentUser.id;
  const isAi = message.isAiGenerated;

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showReactionsMenu, setShowReactionsMenu] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Self-destruct live countdown calculation
  useEffect(() => {
    if (!message.expiresAt) return;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.round((message.expiresAt! - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        onDeleteMessage(message.id);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [message.expiresAt, message.id, onDeleteMessage]);

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      soundEffects.playReceiveSound();
    }
  };

  const quickEmojis = ['👍', '❤️', '😂', '🔥', '✨', '🙏'];

  return (
    <div
      className={`group relative flex gap-3 px-4 py-2 hover:bg-slate-800/30 transition-colors ${
        isMe ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Sender Avatar */}
      <img
        src={message.senderAvatar}
        alt={message.senderName}
        className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 ring-1 ring-slate-700"
      />

      {/* Main Message Bubble Wrapper */}
      <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
        {/* Sender Name & Timestamp */}
        <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300 flex items-center gap-1">
            {isMe ? 'You' : message.senderName}
            {message.isAuthenticated !== false && (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" title="Verified Authenticated Message" />
            )}
          </span>
          <span>•</span>
          <span>{message.timestamp}</span>
          {message.isStarred && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
          {isAi && (
            <span className="flex items-center gap-0.5 text-purple-400 font-medium">
              <Sparkles className="w-3 h-3" /> AI
            </span>
          )}
          {/* Ephemeral Flame Countdown badge */}
          {timeLeft !== null && timeLeft > 0 && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/50 text-[10px] font-bold text-rose-400 animate-pulse">
              <Flame className="w-3 h-3 text-rose-500" />
              <span>{timeLeft}s</span>
            </span>
          )}
        </div>

        {/* Reply Quote Banner */}
        {message.replyTo && (
          <div className="mb-1 p-2 rounded-lg bg-slate-800/90 border-l-3 border-indigo-500 text-xs text-slate-300 w-full">
            <span className="font-semibold text-indigo-400">{message.replyTo.senderName}: </span>
            <span className="line-clamp-1">{message.replyTo.content}</span>
          </div>
        )}

        {/* Bubble Box or Card Container */}
        {message.type === 'game' && message.game ? (
          <GameCard
            game={message.game}
            currentUser={currentUser}
            onMakeMove={onMakeMove}
            onAnswerTrivia={onAnswerTrivia}
            onRematch={onRematch}
          />
        ) : message.type === 'sticker' || message.type === 'gif' ? (
          <div className="flex flex-col gap-1 my-1">
            <div className="relative rounded-2xl overflow-hidden bg-slate-900/60 p-1.5 border border-slate-800 shadow-xl max-w-[240px] sm:max-w-[280px]">
              <img
                src={message.mediaUrl || message.content}
                alt="Animated Sticker"
                referrerPolicy="no-referrer"
                className="w-full max-h-56 object-contain rounded-xl"
              />
              <span className="absolute bottom-2 right-2 text-[9px] bg-slate-950/80 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                {message.type.toUpperCase()}
              </span>
            </div>
            {message.content && message.content !== message.mediaUrl && (
              <p className="text-xs text-slate-300 px-1">{message.content}</p>
            )}
          </div>
        ) : message.type === 'doodle' ? (
          <div className="flex flex-col gap-1 my-1">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 p-2 border border-emerald-500/40 shadow-xl max-w-[280px] sm:max-w-[320px]">
              <img
                src={message.mediaUrl || message.content}
                alt="Handwritten Doodle"
                className="w-full h-auto rounded-xl object-contain bg-slate-950"
              />
              <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-emerald-400 font-medium">
                <span>🎨 Handwritten Doodle</span>
                <span className="text-slate-400">{message.timestamp}</span>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`relative rounded-2xl p-3 shadow-md ${
              isMe
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/10'
                : isAi
                ? 'bg-slate-800/90 border border-purple-500/30 text-slate-100 rounded-tl-none'
                : 'bg-slate-800/90 border border-slate-700/50 text-slate-100 rounded-tl-none'
            }`}
          >
            {/* TEXT MESSAGE */}
            {message.type === 'text' && (
              <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {message.content}
              </div>
            )}

            {/* CODE BLOCK */}
            {message.type === 'code' && (
              <div className="w-full my-1 rounded-xl bg-slate-950/90 border border-slate-700/80 overflow-hidden text-xs">
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-slate-400">
                  <span className="font-mono text-[11px] uppercase">{message.codeLanguage || 'code'}</span>
                  <button
                    onClick={() => handleCopyCode(message.content)}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 font-mono overflow-x-auto text-emerald-300 leading-relaxed">
                  <code>{message.content}</code>
                </pre>
              </div>
            )}

            {/* VOICE NOTE */}
            {message.type === 'audio' && (
              <div className="flex flex-col gap-2 min-w-[220px]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleAudio}
                    className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shrink-0 transition-transform active:scale-95"
                  >
                    {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>

                  {/* Simulated Waveform */}
                  <div className="flex-1 flex items-center gap-1 h-8">
                    {[40, 70, 30, 90, 60, 100, 50, 80, 40, 60, 90, 30, 70, 50, 80].map((h, idx) => (
                      <span
                        key={idx}
                        style={{ height: `${h}%` }}
                        className={`w-1 rounded-full transition-all ${
                          isPlayingAudio ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-xs font-mono opacity-80 shrink-0">
                    {formatDuration(message.audioDuration || 15)}
                  </span>
                </div>

                {/* Transcription & AI Summary */}
                {message.transcription ? (
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/50 text-xs text-slate-300">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1 mb-0.5">
                      <Volume2 className="w-3 h-3" /> Transcribed Speech:
                    </span>
                    {message.transcription}
                  </div>
                ) : (
                  <button
                    onClick={() => onTranscribeAudio(message.id)}
                    className="text-xs text-purple-300 hover:text-purple-200 flex items-center gap-1 font-medium underline"
                  >
                    <Sparkles className="w-3 h-3" /> AI Transcribe & Summarize
                  </button>
                )}
              </div>
            )}

            {/* IMAGE */}
            {message.type === 'image' && message.mediaUrl && (
              <div className="flex flex-col gap-2">
                <img
                  src={message.mediaUrl}
                  alt="Attachment"
                  className="rounded-xl max-h-64 object-cover w-full cursor-pointer hover:opacity-95 transition-opacity"
                />
                {message.content && <p className="text-sm mt-1">{message.content}</p>}
              </div>
            )}

            {/* POLL */}
            {message.type === 'poll' && message.poll && (
              <div className="flex flex-col gap-3 min-w-[240px] sm:min-w-[280px]">
                <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                  📊 {message.poll.question}
                </h4>

                <div className="flex flex-col gap-2">
                  {message.poll.options.map((opt: PollOption) => {
                    const voteCount = opt.votes.length;
                    const total = message.poll?.totalVotes || 1;
                    const percentage = Math.round((voteCount / (total || 1)) * 100);
                    const hasVoted = opt.votes.includes(currentUser.id);

                    return (
                      <div
                        key={opt.id}
                        onClick={() => onVotePoll(message.id, opt.id)}
                        className={`relative overflow-hidden p-2.5 rounded-xl border cursor-pointer transition-all ${
                          hasVoted
                            ? 'bg-emerald-500/20 border-emerald-500/80'
                            : 'bg-slate-900/60 border-slate-700/70 hover:border-slate-500'
                        }`}
                      >
                        {/* Percentage Bar Fill */}
                        <div
                          style={{ width: `${percentage}%` }}
                          className="absolute inset-y-0 left-0 bg-emerald-500/20 transition-all duration-500"
                        />

                        <div className="relative flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-200">{opt.text}</span>
                          <span className="font-mono text-slate-400">
                            {voteCount} ({percentage}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <span className="text-[11px] text-slate-400 text-right">
                  {message.poll.totalVotes} total votes
                </span>
              </div>
            )}

            {/* LOCATION CARD */}
            {message.type === 'location' && message.location && (
              <div className="flex flex-col gap-2 min-w-[240px] sm:min-w-[280px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
                    <MapPin className="w-4 h-4" />
                    <span>{message.content || 'Shared Location'}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono">
                    GPS PIN
                  </span>
                </div>

                {message.location.mapPreview ? (
                  <div className="relative rounded-xl overflow-hidden h-32 border border-slate-700">
                    <img
                      src={message.location.mapPreview}
                      alt="Location Map Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-2">
                      <p className="text-[11px] text-slate-200 font-medium truncate">{message.location.address}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded-xl border border-slate-700">
                    {message.location.address}
                  </p>
                )}

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${message.location.lat},${message.location.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Open Maps & Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* GOOGLE FORM CARD */}
            {(message.type === 'google_form' || message.googleForm) && message.googleForm && (
              <div className="flex flex-col gap-3 min-w-[260px] sm:min-w-[320px] bg-slate-950/60 p-3.5 rounded-2xl border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wide">
                      Google Form &middot; Survey
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    Active
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {message.googleForm.title}
                  </h4>
                  {message.googleForm.description && (
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {message.googleForm.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={message.googleForm.responderUri}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/20"
                  >
                    <span>Fill Out Form</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {message.googleForm.editUri && (
                    <a
                      href={message.googleForm.editUri}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                      title="Edit or view responses in Google Forms"
                    >
                      <span>Manage</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* TRANSLATED TEXT DISPLAY */}
            {message.translatedText && (
              <div className="mt-2 pt-2 border-t border-slate-700/60 text-xs text-cyan-300">
                <span className="font-semibold flex items-center gap-1 mb-0.5">
                  <Languages className="w-3 h-3" /> Translated ({message.translationLang}):
                </span>
                {message.translatedText}
              </div>
            )}

            {/* Bottom Indicators */}
            <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] opacity-80">
              {message.isEdited && <span>(edited)</span>}
              {isMe && <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />}
            </div>
          </div>
        )}

        {/* Message Reactions List */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {message.reactions.map((r, i) => (
              <button
                key={i}
                onClick={() => onReact(message.id, r.emoji)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs hover:border-slate-500 transition-colors"
              >
                <span>{r.emoji}</span>
                <span className="text-[10px] text-slate-300 font-bold">{r.users.length}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hover Toolbar Actions */}
      <div
        className={`absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1 shadow-lg z-10 ${
          isMe ? 'right-full mr-2' : 'left-full ml-2'
        }`}
      >
        {/* Quick Reactions */}
        <div className="flex items-center gap-0.5 border-r border-slate-700 pr-1">
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onReact(message.id, emoji)}
              className="p-1 hover:bg-slate-700 rounded transition-transform hover:scale-125 text-xs"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Reply */}
        <button
          onClick={() => onReply(message)}
          className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded"
          title="Reply"
        >
          <Reply className="w-3.5 h-3.5" />
        </button>

        {/* Star */}
        <button
          onClick={() => onStar(message.id)}
          className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-amber-400 rounded"
          title="Star Message"
        >
          <Star className="w-3.5 h-3.5" />
        </button>

        {/* AI Translate */}
        {message.type === 'text' && (
          <button
            onClick={() => onTranslate(message.id, message.content)}
            className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 rounded"
            title="Translate"
          >
            <Languages className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Delete Message (Owner) */}
        {isMe && (
          <button
            onClick={() => onDeleteMessage(message.id)}
            className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-red-400 rounded"
            title="Delete for Everyone"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
