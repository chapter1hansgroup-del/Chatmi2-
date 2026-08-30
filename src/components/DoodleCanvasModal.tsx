import React, { useRef, useState, useEffect } from 'react';
import { Palette, Eraser, RotateCcw, Send, X, Brush } from 'lucide-react';

interface DoodleCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendDoodle: (dataUrl: string) => void;
}

const COLORS = [
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#ffffff', // White
  '#0f172a', // Dark (slate-900)
];

export const DoodleCanvasModal: React.FC<DoodleCanvasModalProps> = ({
  isOpen,
  onClose,
  onSendDoodle,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState<string>('#10b981');
  const [lineWidth, setLineWidth] = useState<number>(4);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill background with dark canvas
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? '#020617' : color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSend = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSendDoodle(dataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Interactive Doodle Canvas</h3>
              <p className="text-[11px] text-slate-400">Draw a quick sketch, signature, or handwritten note</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="p-3 sm:p-4 flex flex-col items-center justify-center bg-slate-950/40">
          <canvas
            ref={canvasRef}
            width={500}
            height={320}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full max-w-[480px] h-64 sm:h-72 rounded-xl border border-slate-800 shadow-inner cursor-crosshair touch-none bg-slate-950"
          />
        </div>

        {/* Palette & Controls Toolbar */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col gap-3">
          {/* Colors & Brush Size */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setColor(c);
                    setIsEraser(false);
                  }}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    color === c && !isEraser
                      ? 'scale-125 border-white ring-2 ring-emerald-500'
                      : 'border-slate-700 hover:scale-110'
                  }`}
                />
              ))}
            </div>

            {/* Stroke Width Slider */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Brush className="w-3.5 h-3.5" />
              <input
                type="range"
                min="2"
                max="20"
                value={lineWidth}
                onChange={(e) => setLineWidth(Number(e.target.value))}
                className="w-20 accent-emerald-500 cursor-pointer"
              />
              <span className="w-4 text-center font-mono">{lineWidth}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEraser(!isEraser)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isEraser
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Eraser</span>
              </button>

              <button
                onClick={handleClear}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>

            <button
              onClick={handleSend}
              disabled={!hasDrawn}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Doodle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
