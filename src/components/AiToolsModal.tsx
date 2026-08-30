import React, { useState } from 'react';
import { X, Sparkles, Bot, FileText, Image as ImageIcon, Send, Copy, Check } from 'lucide-react';

interface AiToolsModalProps {
  onClose: () => void;
  onSummarizeThread: () => Promise<string>;
  onGenerateImage: (prompt: string) => Promise<string>;
}

export const AiToolsModal: React.FC<AiToolsModalProps> = ({
  onClose,
  onSummarizeThread,
  onGenerateImage,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'image' | 'writer'>('summary');
  const [summaryOutput, setSummaryOutput] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Image Gen State
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Copied State
  const [copied, setCopied] = useState(false);

  const handleRunSummary = async () => {
    setIsSummarizing(true);
    try {
      const result = await onSummarizeThread();
      setSummaryOutput(result);
    } catch {
      setSummaryOutput('Failed to generate summary.');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleRunImageGen = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    try {
      const url = await onGenerateImage(imagePrompt);
      setGeneratedImageUrl(url);
    } catch {
      // ignore
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleCopy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" /> Gemini 3.6 AI Suite
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 p-1 bg-slate-800/80 rounded-2xl">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'summary'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" /> Summarize Thread
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'image'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Generate Image
          </button>
        </div>

        {/* SUMMARY TAB */}
        {activeTab === 'summary' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-slate-300">
              Summarize all unread or recent messages in the active conversation into bullet points and key takeaways.
            </p>

            <button
              onClick={handleRunSummary}
              disabled={isSummarizing}
              className="py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
            >
              <Sparkles className={`w-4 h-4 ${isSummarizing ? 'animate-spin' : ''}`} />
              {isSummarizing ? 'Analyzing Chat History...' : 'Generate Executive Summary'}
            </button>

            {summaryOutput && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 text-slate-200 text-xs leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap relative">
                <button
                  onClick={() => handleCopy(summaryOutput)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Copy Summary"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                {summaryOutput}
              </div>
            )}
          </div>
        )}

        {/* IMAGE GENERATION TAB */}
        {activeTab === 'image' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-slate-300">
              Generate team mockups, diagrams, or visual assets using Gemini 3.1 Flash Image.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="e.g. Minimalist vector icon of a futuristic server network..."
                className="flex-1 bg-slate-800 text-slate-100 text-xs p-3 rounded-xl border border-slate-700"
              />
              <button
                onClick={handleRunImageGen}
                disabled={isGeneratingImage || !imagePrompt.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shrink-0"
              >
                {isGeneratingImage ? 'Generating...' : 'Generate'}
              </button>
            </div>

            {generatedImageUrl && (
              <div className="flex flex-col items-center gap-2 mt-2">
                <img
                  src={generatedImageUrl}
                  alt="Generated"
                  className="w-full max-h-56 rounded-2xl object-cover border border-purple-500/40"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
