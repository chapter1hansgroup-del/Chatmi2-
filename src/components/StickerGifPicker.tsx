import React, { useState } from 'react';
import { Search, Sparkles, Smile, Flame, PartyPopper, Cat, Rocket, Heart, Bot } from 'lucide-react';

interface StickerItem {
  id: string;
  title: string;
  url: string;
  category: 'trending' | 'reactions' | 'memes' | 'celebration' | 'cute' | 'tech';
}

const STICKERS_DATA: StickerItem[] = [
  // Trending & Memes
  {
    id: 's1',
    title: 'Mind Blown',
    url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif',
    category: 'trending',
  },
  {
    id: 's2',
    title: 'Party Cat Dancing',
    url: 'https://media.giphy.com/media/unQ3IJU2RG7DO/giphy.gif',
    category: 'cute',
  },
  {
    id: 's3',
    title: 'Hacker Typing Fast',
    url: 'https://media.giphy.com/media/ule4akeEDWAYE/giphy.gif',
    category: 'tech',
  },
  {
    id: 's4',
    title: 'Thumbs Up Doge',
    url: 'https://media.giphy.com/media/9C1nyePmmMLwnmnetx/giphy.gif',
    category: 'memes',
  },
  {
    id: 's5',
    title: 'Confetti Celebration',
    url: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif',
    category: 'celebration',
  },
  {
    id: 's6',
    title: 'Robot AI Wave',
    url: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
    category: 'tech',
  },
  {
    id: 's7',
    title: 'Popcorn Chill',
    url: 'https://media.giphy.com/media/t3cL1If5STPsY/giphy.gif',
    category: 'reactions',
  },
  {
    id: 's8',
    title: 'Fire Flame Lit',
    url: 'https://media.giphy.com/media/5nsG5H0fF5N20/giphy.gif',
    category: 'trending',
  },
  {
    id: 's9',
    title: 'Cat Typing Coding',
    url: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
    category: 'cute',
  },
  {
    id: 's10',
    title: 'Love Heart Glowing',
    url: 'https://media.giphy.com/media/26FLdm964upUNI6xG/giphy.gif',
    category: 'reactions',
  },
  {
    id: 's11',
    title: 'Rocket Launch',
    url: 'https://media.giphy.com/media/mi6DsSSKsJAoE/giphy.gif',
    category: 'tech',
  },
  {
    id: 's12',
    title: 'Cheering Crowd',
    url: 'https://media.giphy.com/media/31lPv5L3aIvH24RvJa/giphy.gif',
    category: 'celebration',
  },
];

interface StickerGifPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSticker: (url: string, title: string) => void;
}

export const StickerGifPicker: React.FC<StickerGifPickerProps> = ({
  isOpen,
  onClose,
  onSelectSticker,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All', icon: Sparkles },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'reactions', label: 'Reactions', icon: Smile },
    { id: 'tech', label: 'Tech & AI', icon: Bot },
    { id: 'cute', label: 'Cute', icon: Cat },
    { id: 'celebration', label: 'Party', icon: PartyPopper },
  ];

  const filteredStickers = STICKERS_DATA.filter((stk) => {
    const matchesCat = selectedCategory === 'all' || stk.category === selectedCategory;
    const matchesSearch =
      stk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stk.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="absolute bottom-20 left-2 sm:left-4 z-40 w-[340px] sm:w-[380px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[420px] animate-in fade-in zoom-in-95 duration-200">
      {/* Header & Search */}
      <div className="p-3 border-b border-slate-800 flex flex-col gap-2.5 bg-slate-950/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Stickers & Animated GIFs</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-xs px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700"
          >
            Close
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search stickers, GIFs, memes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stickers Grid */}
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2 max-h-72">
        {filteredStickers.map((sticker) => (
          <button
            key={sticker.id}
            onClick={() => {
              onSelectSticker(sticker.url, sticker.title);
              onClose();
            }}
            className="group relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-emerald-500/80 transition-all hover:scale-[1.02] flex flex-col items-center justify-center p-1.5 aspect-[4/3]"
          >
            <img
              src={sticker.url}
              alt={sticker.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-lg"
              loading="lazy"
            />
            <span className="absolute bottom-1 left-1 right-1 bg-slate-950/80 text-[10px] text-slate-300 text-center py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity truncate px-1">
              {sticker.title}
            </span>
          </button>
        ))}

        {filteredStickers.length === 0 && (
          <div className="col-span-2 py-8 text-center text-xs text-slate-400">
            No stickers found for &ldquo;{searchQuery}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
};
