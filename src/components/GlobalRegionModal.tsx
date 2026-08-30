import React, { useState, useEffect } from 'react';
import {
  Globe,
  Languages,
  Server,
  Zap,
  Check,
  X,
  Radio,
  Wifi,
  Shield,
  Activity,
  ArrowUpDown,
  Search,
  Sparkles,
} from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  GLOBAL_EDGE_REGIONS,
  CountryLanguage,
  EdgeRegion,
} from '../utils/i18n';
import { soundEffects } from '../utils/audio';

interface GlobalRegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
  onSelectLanguage: (lang: CountryLanguage) => void;
  selectedRegion: string;
  onSelectRegion: (region: EdgeRegion) => void;
  dataSaverMode: boolean;
  onToggleDataSaver: (enabled: boolean) => void;
  autoTranslateIncoming: boolean;
  onToggleAutoTranslate: (enabled: boolean) => void;
}

export const GlobalRegionModal: React.FC<GlobalRegionModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
  selectedRegion,
  onSelectRegion,
  dataSaverMode,
  onToggleDataSaver,
  autoTranslateIncoming,
  onToggleAutoTranslate,
}) => {
  const [tab, setTab] = useState<'languages' | 'regions' | 'network'>('languages');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('All');
  const [pings, setPings] = useState<Record<string, number>>({});

  useEffect(() => {
    // Generate realistic dynamic latency jitter for global edge regions
    const jitter: Record<string, number> = {};
    GLOBAL_EDGE_REGIONS.forEach((r) => {
      jitter[r.id] = Math.max(8, r.latencyMs + Math.floor(Math.random() * 8 - 4));
    });
    setPings(jitter);
  }, [isOpen]);

  if (!isOpen) return null;

  const CONTINENT_FILTERS = [
    'All',
    'Americas',
    'Europe',
    'Africa',
    'Asia',
    'Middle East',
    'Caribbean',
    'Oceania',
    'Central Asia',
    'Caucasus',
  ];

  const filteredLanguages = SUPPORTED_LANGUAGES.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesContinent =
      selectedContinent === 'All' || l.region.toLowerCase().includes(selectedContinent.toLowerCase());

    return matchesSearch && matchesContinent;
  });

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">Global Availability & Locale</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  500+ Worldwide Locales
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Anycast edge routing with native support for {SUPPORTED_LANGUAGES.length} country languages & dialects
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 p-1.5 gap-1.5">
          <button
            onClick={() => setTab('languages')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              tab === 'languages'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>Languages & Locale ({SUPPORTED_LANGUAGES.length})</span>
          </button>

          <button
            onClick={() => setTab('regions')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              tab === 'regions'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Edge Data Centers ({GLOBAL_EDGE_REGIONS.length})</span>
          </button>

          <button
            onClick={() => setTab('network')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              tab === 'network'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Resilience & AI</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {tab === 'languages' && (
            <div className="flex flex-col gap-3">
              {/* Search & Stats */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by country, native name, script, or ISO code (e.g. Yoruba, Maya, Quechua, 한국어, Hindi, Jamaican)..."
                    className="w-full bg-slate-950 text-slate-100 text-xs pl-10 pr-4 py-2.5 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="px-3 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-center shrink-0">
                  <span className="font-semibold text-slate-200">{filteredLanguages.length}</span>
                  <span className="ml-1 text-slate-500">/ {SUPPORTED_LANGUAGES.length} shown</span>
                </div>
              </div>

              {/* Regional Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {CONTINENT_FILTERS.map((cont) => {
                  const isActive = selectedContinent === cont;
                  return (
                    <button
                      key={cont}
                      onClick={() => setSelectedContinent(cont)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                          : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {cont}
                    </button>
                  );
                })}
              </div>

              {/* Languages Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[52vh] overflow-y-auto pr-1">
                {filteredLanguages.map((lang) => {
                  const isSelected = currentLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSelectLanguage(lang);
                        soundEffects.playCelebrationChime();
                      }}
                      className={`p-2.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/50'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg shrink-0">{lang.flag}</span>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold truncate">{lang.nativeName}</span>
                            {lang.rtl && (
                              <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                                RTL
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 truncate">
                            {lang.name}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 ml-2">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
                {filteredLanguages.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-500 text-xs">
                    No country language found matching &ldquo;{searchQuery}&rdquo;. Try another country name or script.
                  </div>
                )}
              </div>
            </div>
          )}


          {tab === 'regions' && (
            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between text-xs text-cyan-300">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Global Anycast Smart Routing is Active</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">99.999% SLA</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto pr-1">
                {GLOBAL_EDGE_REGIONS.map((region) => {
                  const isSelected = selectedRegion === region.id;
                  const latency = pings[region.id] || region.latencyMs;
                  return (
                    <button
                      key={region.id}
                      onClick={() => {
                        onSelectRegion(region);
                        soundEffects.playLevelUp();
                      }}
                      className={`p-3 rounded-2xl border flex items-center justify-between text-left transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/50'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl shrink-0">{region.flag}</span>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold truncate">{region.name}</span>
                          <span className="text-[11px] text-slate-400 truncate">{region.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            latency < 25
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : latency < 40
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {latency}ms
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'network' && (
            <div className="flex flex-col gap-4">
              {/* Data Saver Mode */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Wifi className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">
                      Low-Bandwidth & 2G/3G Data Saver Mode
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Optimizes compressed payloads for developing regions with limited connectivity
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onToggleDataSaver(!dataSaverMode)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    dataSaverMode ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-slate-950 absolute top-0.5 transition-transform ${
                      dataSaverMode ? 'translate-x-5.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Automatic Multilingual Translation */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">
                      Auto-Translate Incoming Foreign Messages
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Seamlessly renders messages in {currentLangObj.nativeName} ({currentLangObj.name})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onToggleAutoTranslate(!autoTranslateIncoming)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    autoTranslateIncoming ? 'bg-purple-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-slate-950 absolute top-0.5 transition-transform ${
                      autoTranslateIncoming ? 'translate-x-5.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Global Protocol Guarantee */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/40 border border-indigo-500/20 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Unrestricted Global Accessibility Guarantee</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Chatmi operates across zero-trust distributed WebSocket relays and IPv4/IPv6 dual-stack tunnels to ensure uninterrupted connectivity in all 195+ countries without geographical barriers.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span>Active Locale:</span>
            <span className="text-slate-200 font-bold flex items-center gap-1.5">
              <span>{currentLangObj.flag}</span>
              <span>{currentLangObj.nativeName}</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
