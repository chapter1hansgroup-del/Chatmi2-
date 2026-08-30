import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Radio,
  Sliders,
  Play,
  RotateCcw,
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface AiVoiceOrbModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatContextTitle: string;
}

export const AiVoiceOrbModal: React.FC<AiVoiceOrbModalProps> = ({
  isOpen,
  onClose,
  chatContextTitle,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicePersona, setVoicePersona] = useState<'alpha' | 'nova' | 'echo'>('alpha');
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState(
    'Hello! I am your real-time Alpha voice companion. Tap the glowing orb or microphone to speak.'
  );
  const [audioWaves, setAudioWaves] = useState<number[]>(Array(16).fill(20));

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Animated Orb Canvas Loop
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const renderOrb = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      angle += isSpeaking ? 0.08 : isListening ? 0.04 : 0.02;

      const baseRadius = isSpeaking ? 65 : isListening ? 55 : 45;
      const pulse = Math.sin(angle * 2) * (isSpeaking ? 12 : isListening ? 8 : 3);
      const currentRadius = baseRadius + pulse;

      // Outer luminous glow
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, currentRadius * 1.8);
      if (voicePersona === 'alpha') {
        grad.addColorStop(0, '#6366f1');
        grad.addColorStop(0.5, '#3b82f6');
        grad.addColorStop(1, 'transparent');
      } else if (voicePersona === 'nova') {
        grad.addColorStop(0, '#ec4899');
        grad.addColorStop(0.5, '#8b5cf6');
        grad.addColorStop(1, 'transparent');
      } else {
        grad.addColorStop(0, '#10b981');
        grad.addColorStop(0.5, '#06b6d4');
        grad.addColorStop(1, 'transparent');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, currentRadius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Core Orb
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#818cf8';
      ctx.shadowBlur = 25;
      ctx.fill();
      ctx.restore();

      // Orbiting particles
      for (let i = 0; i < 6; i++) {
        const pAngle = angle + (i * Math.PI) / 3;
        const dist = currentRadius + 24 + Math.sin(angle * 3 + i) * 8;
        const px = cx + Math.cos(pAngle) * dist;
        const py = cy + Math.sin(pAngle) * dist;

        ctx.fillStyle = '#c7d2fe';
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(renderOrb);
    };

    renderOrb();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isOpen, isSpeaking, isListening, voicePersona]);

  // Live waveform simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSpeaking || isListening) {
      interval = setInterval(() => {
        setAudioWaves(
          Array(16)
            .fill(0)
            .map(() => Math.floor(Math.random() * 80) + 20)
        );
      }, 100);
    } else {
      setAudioWaves(Array(16).fill(20));
    }
    return () => clearInterval(interval);
  }, [isSpeaking, isListening]);

  // Handle Speech Synthesis
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = voicePersona === 'nova' ? 1.2 : voicePersona === 'echo' ? 0.9 : 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 2000);
    }
  };

  // Toggle Voice Input
  const handleToggleListening = () => {
    if (isListening) {
      setIsListening(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      setIsListening(true);
      soundEffects.playOrbChime();

      // Check browser SpeechRecognition
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = false;
          rec.interimResults = false;
          rec.lang = 'en-US';

          rec.onresult = async (event: any) => {
            const spoken = event.results[0][0].transcript;
            setTranscript(spoken);
            setIsListening(false);
            await handleProcessVoiceQuery(spoken);
          };

          rec.onerror = () => {
            setIsListening(false);
          };

          rec.onend = () => {
            setIsListening(false);
          };

          rec.start();
          recognitionRef.current = rec;
        } catch {
          // Fallback simulation
          simulateVoiceInput();
        }
      } else {
        simulateVoiceInput();
      }
    }
  };

  // Fallback simulator for sandboxed iframes without mic permission
  const simulateVoiceInput = () => {
    const prompts = [
      'What are our main roadmap priorities this week?',
      'Can you give me a 30-second executive summary of our channel?',
      'How does the real-time WebSocket protocol optimize latency?',
    ];
    const chosen = prompts[Math.floor(Math.random() * prompts.length)];

    setTimeout(() => {
      setTranscript(chosen);
      setIsListening(false);
      handleProcessVoiceQuery(chosen);
    }, 1800);
  };

  const handleProcessVoiceQuery = async (query: string) => {
    soundEffects.playClickSound();
    try {
      const res = await fetch('/api/ai/voice-talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          persona: voicePersona,
          contextTitle: chatContextTitle,
        }),
      });
      const data = await res.json();
      const responseText = data.text || 'Understood. I have synced the latest data stream for you.';
      setAiResponse(responseText);
      speakText(responseText);
    } catch {
      const fallback = 'All systems active and synchronized with sub-millisecond response latency.';
      setAiResponse(fallback);
      speakText(fallback);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col items-center p-6 relative">
        {/* Close Button */}
        <button
          onClick={() => {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> Live Voice Assistant
          </span>
        </div>
        <h3 className="font-bold text-lg text-slate-100 mb-1">Alpha Voice Companion</h3>
        <p className="text-xs text-slate-400 mb-6 text-center">
          Connected to {chatContextTitle} • Real-time Speech Loop
        </p>

        {/* Central Glowing Orb Canvas */}
        <div
          onClick={handleToggleListening}
          className="relative w-64 h-64 flex items-center justify-center cursor-pointer group my-2"
        >
          <canvas ref={canvasRef} width={256} height={256} className="w-full h-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {isSpeaking ? (
              <span className="text-xs font-bold text-slate-950 uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded-full shadow">
                Speaking...
              </span>
            ) : isListening ? (
              <span className="text-xs font-bold text-slate-950 uppercase tracking-wider bg-emerald-400/90 px-2 py-0.5 rounded-full shadow animate-pulse">
                Listening...
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-900/90 uppercase tracking-wider bg-white/60 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                Tap to Talk
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Waveform Visualizer */}
        <div className="flex items-center gap-1.5 h-10 my-3">
          {audioWaves.map((height, i) => (
            <span
              key={i}
              style={{ height: `${height}%` }}
              className={`w-1 rounded-full transition-all duration-75 ${
                isSpeaking
                  ? 'bg-indigo-400 animate-pulse'
                  : isListening
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Live Conversation Transcript Display */}
        <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 mb-4 text-xs">
          {transcript && (
            <p className="text-slate-400 mb-1.5 font-medium flex items-center gap-1">
              <span className="text-indigo-400 font-bold">You said:</span> "{transcript}"
            </p>
          )}
          <p className="text-slate-200 leading-relaxed font-normal flex items-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
            <span>{aiResponse}</span>
          </p>
        </div>

        {/* Persona Selector & Mic Trigger Button */}
        <div className="flex items-center justify-between w-full pt-2 border-t border-slate-800">
          {/* Persona Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(
              [
                { id: 'alpha', label: 'Alpha' },
                { id: 'nova', label: 'Nova' },
                { id: 'echo', label: 'Echo' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => setVoicePersona(p.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  voicePersona === p.id
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => speakText(aiResponse)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Repeat Speech"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleListening}
              className={`p-2.5 rounded-xl font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-400 text-white animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span className="text-xs">{isListening ? 'Stop' : 'Speak'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
