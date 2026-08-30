import React, { useState } from 'react';
import { MapPin, Navigation, Send, X, Globe, Building2, Coffee, Sparkles } from 'lucide-react';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShareLocation: (location: {
    lat: number;
    lng: number;
    address: string;
    mapPreview?: string;
  }) => void;
}

const PRESET_LOCATIONS = [
  {
    name: 'Current Device Location',
    address: 'Near Tech Central Hub, London',
    lat: 51.5074,
    lng: -0.1278,
    icon: Navigation,
    preview: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Silicon Valley AI Campus',
    address: '100 Infinite Loop, Cupertino, CA',
    lat: 37.3318,
    lng: -122.0311,
    icon: Building2,
    preview: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Shibuya Crossing Hub',
    address: 'Shibuya City, Tokyo, Japan',
    lat: 35.6595,
    lng: 139.7005,
    icon: Globe,
    preview: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Artisan Espresso Café',
    address: '42 Roasters Avenue, Midtown',
    lat: 40.7580,
    lng: -73.9855,
    icon: Coffee,
    preview: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
  },
];

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  onShareLocation,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [customAddress, setCustomAddress] = useState<string>('');

  if (!isOpen) return null;

  const handleShare = () => {
    const chosen = PRESET_LOCATIONS[selectedIndex];
    onShareLocation({
      lat: chosen.lat,
      lng: chosen.lng,
      address: customAddress.trim() || chosen.address,
      mapPreview: chosen.preview,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Share Live Location</h3>
              <p className="text-[11px] text-slate-400">Send pinpoint GPS or landmark with directions</p>
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
        <div className="p-4 flex flex-col gap-3.5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">Select Location Pin</label>
            <div className="flex flex-col gap-2">
              {PRESET_LOCATIONS.map((loc, idx) => {
                const Icon = loc.icon;
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/40'
                        : 'bg-slate-800/80 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${
                        isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-100 truncate">{loc.name}</span>
                        {isSelected && <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{loc.address}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional address customization */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-slate-400">Custom Address or Place Note (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Table 4 near the back garden"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80"
            />
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
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Location</span>
          </button>
        </div>
      </div>
    </div>
  );
};
