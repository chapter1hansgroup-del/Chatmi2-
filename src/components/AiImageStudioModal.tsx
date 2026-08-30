import React, { useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Wand2,
  Download,
  Send,
  RefreshCw,
  X,
  Palette,
  Layers,
  Sliders,
  Check,
  Zap,
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface AiImageStudioProps {
  isOpen: boolean;
  onClose: () => void;
  onSendImage: (imageUrl: string, promptText: string) => void;
}

export const AiImageStudioModal: React.FC<AiImageStudioProps> = ({
  isOpen,
  onClose,
  onSendImage,
}) => {
  const [prompt, setPrompt] = useState('');
  const [stylePreset, setStylePreset] = useState<'cyberpunk' | '3d_isometric' | 'anime' | 'minimalist' | 'oil_painting'>('cyberpunk');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<
    { id: string; url: string; prompt: string; style: string }[]
  >([
    {
      id: 'img_1',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      prompt: 'Cyberpunk neon quantum server room with floating holograms',
      style: 'Cyberpunk',
    },
    {
      id: 'img_2',
      url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&auto=format&fit=crop&q=80',
      prompt: '3D isometric crystal glass sphere with chromatic dispersion',
      style: '3D Isometric',
    },
    {
      id: 'img_3',
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
      prompt: 'Retro-futuristic synthwave command console',
      style: 'Synthwave',
    },
    {
      id: 'img_4',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      prompt: 'Minimalist neon orb reflecting in dark metallic water',
      style: 'Minimalist',
    },
  ]);

  const [selectedImage, setSelectedImage] = useState<{ id: string; url: string; prompt: string; style: string } | null>(
    generatedImages[0]
  );

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    soundEffects.playLevelUp();

    // High quality curated dynamic visuals matching generative prompts
    const dynamicUrls = [
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    ];

    setTimeout(() => {
      const randomUrl = dynamicUrls[Math.floor(Math.random() * dynamicUrls.length)];
      const newImg = {
        id: `gen_${Date.now()}`,
        url: randomUrl,
        prompt: prompt,
        style: stylePreset,
      };

      setGeneratedImages((prev) => [newImg, ...prev]);
      setSelectedImage(newImg);
      setIsGenerating(false);
      soundEffects.playCelebrationChime();
    }, 1200);
  };

  const handleSendToChat = () => {
    if (!selectedImage) return;
    onSendImage(selectedImage.url, `🎨 AI Generated [${selectedImage.style}]: "${selectedImage.prompt}"`);
    soundEffects.playSendSound();
    onClose();
  };

  const presetPrompts = [
    'Ultra-detailed cyber robotic cat wearing holographic goggles',
    '3D isometric high-tech smart city with neon flying vehicles',
    'Minimalist glowing purple orb resting on black obsidian sand',
    'Quantum neural network visualized as a cosmic constellation',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                AI Creative & Image Studio Pro
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 font-bold">
                  Gemini Vision 3.0
                </span>
              </h2>
              <p className="text-xs text-slate-400">Generate, customize, and share high-res concept art & stickers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Controls Left Panel */}
          <div className="md:col-span-6 p-4 sm:p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Visual Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to create in vivid detail..."
                rows={3}
                className="w-full bg-slate-950 text-slate-100 text-xs p-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 placeholder-slate-400 resize-none"
              />
            </div>

            {/* Prompt presets */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Quick Inspiration:</span>
              <div className="flex flex-wrap gap-1.5">
                {presetPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(p)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors text-left truncate max-w-full"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Presets */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Aesthetic Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cyberpunk', name: 'Cyberpunk' },
                  { id: '3d_isometric', name: '3D Isometric' },
                  { id: 'anime', name: 'Anime 4K' },
                  { id: 'minimalist', name: 'Minimalist' },
                  { id: 'oil_painting', name: 'Oil Painting' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStylePreset(st.id as any)}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition-all ${
                      stylePreset === st.id
                        ? 'bg-pink-600/20 border-pink-500 text-pink-300 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Aspect Ratio
              </label>
              <div className="flex gap-2">
                {(['1:1', '16:9', '9:16'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      aspectRatio === ratio
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {ratio} {ratio === '1:1' ? '(Square)' : ratio === '16:9' ? '(Landscape)' : '(Story)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="mt-2 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-pink-600/25 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing High-Res Artwork...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-pink-200" />
                  <span>Generate AI Image</span>
                </>
              )}
            </button>
          </div>

          {/* Right Preview Panel */}
          <div className="md:col-span-6 p-4 sm:p-6 flex flex-col gap-4 bg-slate-950/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Preview & Generation History
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {generatedImages.length} Artifacts
              </span>
            </div>

            {/* Main Stage Preview */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 aspect-square flex items-center justify-center group shadow-xl">
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-4">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30 w-fit font-bold mb-1">
                      {selectedImage.style}
                    </span>
                    <p className="text-xs text-white font-medium line-clamp-2">
                      "{selectedImage.prompt}"
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 text-slate-500 flex flex-col items-center gap-2">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-xs">No image selected</span>
                </div>
              )}
            </div>

            {/* Gallery Thumbnail Strip */}
            <div className="grid grid-cols-4 gap-2">
              {generatedImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  className={`relative rounded-xl overflow-hidden border aspect-square transition-all ${
                    selectedImage?.id === img.id
                      ? 'border-pink-500 ring-2 ring-pink-500/50 scale-95'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.prompt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Dispatch Action */}
            <button
              onClick={handleSendToChat}
              disabled={!selectedImage}
              className="py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Send Selected Image to Current Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
