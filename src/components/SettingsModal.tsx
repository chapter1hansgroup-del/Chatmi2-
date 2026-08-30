import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  Search,
  User,
  Key,
  Lock,
  Smile,
  MessageSquare,
  Bell,
  HardDrive,
  Globe,
  HelpCircle,
  Users,
  QrCode,
  Check,
  CheckCheck,
  ChevronRight,
  Shield,
  ShieldCheck,
  Smartphone,
  UploadCloud,
  Download,
  Trash2,
  Sparkles,
  Zap,
  Volume2,
  Radio,
  Palette,
  Camera,
  Share2,
  Copy,
  ExternalLink,
  Info,
  Flame,
  BadgeCheck,
  DollarSign,
  Fingerprint,
  Layers,
  Activity,
  Wifi,
  Eye,
  EyeOff,
  Video,
  Bot,
  Sliders,
  FileText,
  AlertTriangle,
  Monitor,
  PhoneCall,
  Mic,
  Moon,
  Laptop,
  CheckCircle2,
} from 'lucide-react';
import { User as UserType } from '../types';
import { soundEffects } from '../utils/audio';

interface SettingsModalProps {
  currentUser: UserType;
  onClose: () => void;
  onUpdateProfile: (statusText?: string, name?: string, avatar?: string) => void;
  onExportData?: () => void;
  onOpenGlobalModal?: () => void;
  onOpenAuthModal?: () => void;
  onOpenGoogleContacts?: () => void;
  onOpenGoogleForms?: () => void;
  onLogout?: () => void;
  currentLanguageName?: string;
  currentLanguageFlag?: string;
}

type SettingsSubView =
  | 'main'
  | 'profile'
  | 'qr'
  | 'account'
  | 'privacy'
  | 'avatar'
  | 'chats'
  | 'notifications'
  | 'storage'
  | 'creator'
  | 'devices'
  | 'ai'
  | 'help';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentUser,
  onClose,
  onUpdateProfile,
  onExportData,
  onOpenGlobalModal,
  onOpenAuthModal,
  onOpenGoogleContacts,
  onOpenGoogleForms,
  onLogout,
  currentLanguageName = 'English (US)',
  currentLanguageFlag = '🇺🇸',
}) => {
  // Navigation & Search State
  const [currentView, setCurrentView] = useState<SettingsSubView>('main');
  const [searchQuery, setSearchQuery] = useState('');

  // Profile Edit State
  const [editName, setEditName] = useState(currentUser.name || '');
  const [editStatusText, setEditStatusText] = useState(
    currentUser.statusText || '⚡ Available | ChatWave & Postly Ultra'
  );
  const [editAvatar, setEditAvatar] = useState(currentUser.avatar || '');
  const [copiedLink, setCopiedLink] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // WhatsApp-style Settings Configuration States (Persisted in localStorage)
  const [readReceipts, setReadReceipts] = useState(() => {
    return localStorage.getItem('cw_setting_read_receipts') !== 'false';
  });
  const [lastSeenPrivacy, setLastSeenPrivacy] = useState<'everyone' | 'contacts' | 'nobody'>(() => {
    return (localStorage.getItem('cw_setting_last_seen') as any) || 'everyone';
  });
  const [profilePhotoPrivacy, setProfilePhotoPrivacy] = useState<'everyone' | 'contacts' | 'nobody'>('everyone');
  const [disappearingTimer, setDisappearingTimer] = useState<'off' | '24h' | '7d' | '90d'>('off');
  const [protectIpCalls, setProtectIpCalls] = useState(true);
  const [silenceUnknownCallers, setSilenceUnknownCallers] = useState(false);
  const [twoStepEnabled, setTwoStepEnabled] = useState(true);
  const [securityNotifs, setSecurityNotifs] = useState(true);
  const [passkeyEnabled, setPasskeyEnabled] = useState(true);
  const [appLockFingerprint, setAppLockFingerprint] = useState(false);
  const [blockScreenshots, setBlockScreenshots] = useState(true);

  // Chat & Media States
  const [themeMode, setThemeMode] = useState<'dark' | 'emerald-dark' | 'midnight' | 'sunset'>('dark');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [enterIsSend, setEnterIsSend] = useState(false);
  const [instantVideoMessages, setInstantVideoMessages] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedRingtone, setSelectedRingtone] = useState('Cosmic Wave');
  const [vibrateCalls, setVibrateCalls] = useState(true);
  const [reactionNotifications, setReactionNotifications] = useState(true);
  const [inAppPreview, setInAppPreview] = useState(true);

  // Storage & Backup States
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [lastBackupTime, setLastBackupTime] = useState('Today at 4:32 AM (1.4 GB)');
  const [cacheCleaned, setCacheCleaned] = useState(false);
  const [lowDataForCalls, setLowDataForCalls] = useState(false);
  const [autoDownloadWifi, setAutoDownloadWifi] = useState(true);
  const [autoDownloadCellular, setAutoDownloadCellular] = useState(false);
  const [autoDownloadRoaming, setAutoDownloadRoaming] = useState(false);

  // AI & Assistant Settings
  const [aiAutoTranslate, setAiAutoTranslate] = useState(true);
  const [aiVoiceSynthesis, setAiVoiceSynthesis] = useState(true);
  const [aiSmartReply, setAiSmartReply] = useState(true);
  const [aiModelTier, setAiModelTier] = useState<'flash' | 'pro' | 'ultra'>('flash');

  // Creator & Postly States
  const [hdUploadQuality, setHdUploadQuality] = useState(true);
  const [creatorAnalyticsOptIn, setCreatorAnalyticsOptIn] = useState(true);
  const [creatorTipJarBalance, setCreatorTipJarBalance] = useState(3420);
  const [postlyAutoShare, setPostlyAutoShare] = useState(false);

  // Avatar Creator States
  const [avatarSkinTone, setAvatarSkinTone] = useState('tone3');
  const [avatarHairStyle, setAvatarHairStyle] = useState('curly');
  const [avatarOutfit, setAvatarOutfit] = useState('cyber');

  // Linked Devices State
  const [linkedDevices, setLinkedDevices] = useState([
    { id: '1', name: 'Google Chrome on macOS (Apple Silicon)', location: 'London, UK', active: 'Active now', isCurrent: true, icon: Laptop },
    { id: '2', name: 'ChatMi Web - Safari on iPad Pro', location: 'London, UK', active: 'Yesterday at 11:20 PM', isCurrent: false, icon: Monitor },
    { id: '3', name: 'ChatMi Desktop Client for Windows', location: 'Frankfurt, Germany', active: 'Oct 14 at 2:15 PM', isCurrent: false, icon: Laptop },
  ]);

  // QR Code Tab in QR View
  const [qrTab, setQrTab] = useState<'my_code' | 'scan'>('my_code');

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200',
  ];

  const statusPresets = [
    '⚡ Available | ChatWave & Postly Ultra',
    '🚀 Building with AI Studio',
    '🎬 Live Streaming & Creating Content',
    '🎙️ In a Voice / Video Call',
    '🔋 Battery about to die',
    '🎧 Focused on high-speed coding',
    '✈️ Traveling | Low Latency Edge',
    '🔒 End-to-End Encrypted',
  ];

  // Save changes handler
  const handleSaveProfile = () => {
    onUpdateProfile(editStatusText, editName, editAvatar);
    soundEffects.playCashSound();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Run Cloud Backup Simulator
  const handleTriggerBackup = () => {
    if (isBackingUp) return;
    setIsBackingUp(true);
    setBackupProgress(10);
    soundEffects.playTapSound();

    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          setLastBackupTime(`Just now (${(Math.random() * 0.4 + 1.2).toFixed(1)} GB)`);
          soundEffects.playCelebrationChime();
          return 100;
        }
        return prev + 18;
      });
    }, 300);
  };

  const handleCleanStorage = () => {
    soundEffects.playCelebrationChime();
    setCacheCleaned(true);
    setTimeout(() => setCacheCleaned(false), 3000);
  };

  const handleCopyInvite = () => {
    soundEffects.playTapSound();
    navigator.clipboard?.writeText?.(
      `https://chatwave.app/join/${currentUser.username || 'user'}?invite=60B_SECURITY`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Search filtered main menu items
  const menuItems = [
    {
      id: 'account',
      title: 'Account & Security',
      subtitle: 'Passkeys, 2-Step Verification, Change Number, Request Info',
      icon: Key,
      iconBg: 'bg-blue-500/20 text-blue-400',
      badge: 'Protected',
    },
    {
      id: 'privacy',
      title: 'Privacy & Permissions',
      subtitle: 'Last seen, read receipts, disappearing chats, app lock',
      icon: Lock,
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      badge: 'E2EE Active',
    },
    {
      id: 'avatar',
      title: 'Avatar & 3D Identity',
      subtitle: 'Create personalized 3D avatar, outfit styling, sticker packs',
      icon: Smile,
      iconBg: 'bg-purple-500/20 text-purple-400',
      badge: 'Customizable',
    },
    {
      id: 'devices',
      title: 'Linked Devices',
      subtitle: 'Manage active sessions on Mac, Windows, Web & Tablets',
      icon: Laptop,
      iconBg: 'bg-cyan-500/20 text-cyan-400',
      badge: `${linkedDevices.length} Connected`,
    },
    {
      id: 'chats',
      title: 'Chats & Wallpapers',
      subtitle: 'Themes, text sizing, instant video notes, Google Drive backup',
      icon: MessageSquare,
      iconBg: 'bg-teal-500/20 text-teal-400',
    },
    {
      id: 'ai',
      title: 'AI Studio & Smart Features',
      subtitle: 'Smart reply, real-time voice translation, transcription model',
      icon: Bot,
      iconBg: 'bg-violet-500/20 text-violet-400',
      badge: 'Gemini 2.5',
    },
    {
      id: 'notifications',
      title: 'Notifications & Tones',
      subtitle: 'Message, group & call ringtones, reaction alerts, haptics',
      icon: Bell,
      iconBg: 'bg-amber-500/20 text-amber-400',
    },
    {
      id: 'storage',
      title: 'Storage & Network Data',
      subtitle: 'Manage storage, clean cache, auto-download, low-data calls',
      icon: HardDrive,
      iconBg: 'bg-rose-500/20 text-rose-400',
      badge: '1.8 GB Used',
    },
    {
      id: 'creator',
      title: 'Postly Creator Economy',
      subtitle: 'Monetization wallet, 4K HD upload, sandbox isolation',
      icon: Flame,
      iconBg: 'bg-pink-500/20 text-pink-400',
      badge: `${creatorTipJarBalance} Coins`,
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q);
  });

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-slate-950 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] h-[860px] text-white animate-in zoom-in-95 duration-200 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================================= */}
        {/* TOP HEADER / APP BAR */}
        {/* ========================================================================= */}
        <div className="p-4 bg-slate-950/95 border-b border-slate-800/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {currentView !== 'main' && (
              <button
                onClick={() => {
                  setCurrentView('main');
                  soundEffects.playTapSound();
                }}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Back to Settings"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                {currentView === 'main' && 'Settings'}
                {currentView === 'profile' && 'Profile & Identity'}
                {currentView === 'qr' && 'ChatMi QR Code'}
                {currentView === 'account' && 'Account & Security'}
                {currentView === 'privacy' && 'Privacy Controls'}
                {currentView === 'avatar' && 'Avatar & Personas'}
                {currentView === 'devices' && 'Linked Devices'}
                {currentView === 'chats' && 'Chats & Wallpapers'}
                {currentView === 'ai' && 'AI Studio & Smart Tools'}
                {currentView === 'notifications' && 'Notifications & Tones'}
                {currentView === 'storage' && 'Storage and Network'}
                {currentView === 'creator' && 'Postly & Creator Economy'}
                {currentView === 'help' && 'Help & System Status'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {currentView === 'main'
                  ? 'Enterprise ChatMi & Creator configuration'
                  : 'ChatMi 60B Global Architecture'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentView === 'main' && (
              <button
                onClick={() => {
                  setCurrentView('qr');
                  soundEffects.playTapSound();
                }}
                className="p-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all shadow-sm"
                title="View My ChatMi QR Code"
              >
                <QrCode className="w-5 h-5 text-[#2ECC71]" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: MAIN SETTINGS DASHBOARD (WHATSAPP STRUCTURE) */}
        {/* ========================================================================= */}
        {currentView === 'main' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* 1. WHATSAPP PROFILE CARD (Clickable to Edit Profile) */}
            <div
              onClick={() => {
                setCurrentView('profile');
                soundEffects.playTapSound();
              }}
              className="p-4 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/60 border border-slate-800/90 hover:border-[#2ECC71]/60 transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-lg hover:shadow-emerald-950/20"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative shrink-0">
                  <div className="p-0.5 rounded-full bg-gradient-to-b from-[#2ECC71] to-emerald-600 shadow-md">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-950"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-slate-950" />
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-base font-black text-white group-hover:text-[#2ECC71] transition-colors truncate">
                      {currentUser.name}
                    </h4>
                    {currentUser.isVerified && (
                      <BadgeCheck className="w-4 h-4 text-cyan-400 fill-current" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate max-w-[260px] leading-relaxed">
                    {currentUser.statusText || '⚡ Available | ChatWave & Postly Ultra'}
                  </p>
                  <span className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                    @{currentUser.username || 'user'} &middot; +1 (555) 019-2834
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentView('qr');
                    soundEffects.playTapSound();
                  }}
                  className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[#2ECC71] hover:scale-105 transition-all shadow-inner"
                  title="My QR Code"
                >
                  <QrCode className="w-5 h-5" />
                </button>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
              </div>
            </div>

            {/* 2. SEARCH BAR ACROSS SETTINGS */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search settings, privacy, storage, security..."
                className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2ECC71] transition-all"
              />
            </div>

            {/* 3. SETTINGS ITEMS LIST (WhatsApp Categories) */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl overflow-hidden divide-y divide-slate-800/70 shadow-sm">
              {filteredMenuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id as SettingsSubView);
                      soundEffects.playTapSound();
                    }}
                    className="w-full p-3.5 sm:p-4 flex items-center justify-between hover:bg-slate-850/80 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${item.iconBg}`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-100 group-hover:text-[#2ECC71] transition-colors">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 truncate">{item.subtitle}</span>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* 4. GOOGLE WORKSPACE & CONTACTS INTEGRATION CARD */}
            {onOpenGoogleContacts && (
              <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white block">Google Contacts</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        Workspace Active
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      Sync & manage contacts directly from your Google Account
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenGoogleContacts();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/20"
                >
                  Manage
                </button>
              </div>
            )}

            {/* 5. GOOGLE FORMS & SURVEYS INTEGRATION CARD */}
            {onOpenGoogleForms && (
              <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-500/30 rounded-3xl p-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white block">Google Forms & Surveys</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                        Workspace Active
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      Create live polls, surveys, and view responses from Google Drive
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenGoogleForms();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all shadow-md shadow-purple-600/20"
                >
                  Open Hub
                </button>
              </div>
            )}

            {/* 5. APP LANGUAGE & WORLDWIDE EDGE NETWORK */}
            {onOpenGlobalModal && (
              <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center text-lg shrink-0">
                    {currentLanguageFlag}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">App Language</span>
                    <span className="text-xs text-slate-400">
                      {currentLanguageName} &middot; 195+ Countries Low Latency
                    </span>
                  </div>
                </div>

                <button
                  onClick={onOpenGlobalModal}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-indigo-300 border border-slate-700 transition-colors"
                >
                  Change
                </button>
              </div>
            )}

            {/* 5. HELP & INVITE FRIENDS BUTTONS */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  setCurrentView('help');
                  soundEffects.playTapSound();
                }}
                className="p-3 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block group-hover:text-indigo-300">
                    Help Center
                  </span>
                  <span className="text-[10px] text-slate-400">24/7 AI Concierge</span>
                </div>
              </button>

              <button
                onClick={handleCopyInvite}
                className="p-3 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#2ECC71]/20 text-[#2ECC71] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block group-hover:text-[#2ECC71]">
                    {copiedLink ? 'Link Copied!' : 'Invite a Friend'}
                  </span>
                  <span className="text-[10px] text-slate-400">Share ChatMi</span>
                </div>
              </button>
            </div>

            {/* 6. ENTERPRISE FOOTER */}
            <div className="py-2 text-center flex flex-col items-center gap-1 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-400 tracking-wider uppercase text-[10px]">
                from CHATMI ENTERPRISE
              </span>
              <span>Version 26.4.12 (60B USD Cloud Infrastructure)</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: PROFILE & IDENTITY (WHATSAPP PROFILE SCREEN) */}
        {/* ========================================================================= */}
        {currentView === 'profile' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Avatar Centered with Change Camera Overlay */}
            <div className="flex flex-col items-center gap-3 py-3">
              <div className="relative group">
                <img
                  src={editAvatar}
                  alt={editName}
                  className="w-28 h-28 rounded-full object-cover ring-4 ring-slate-800 shadow-2xl group-hover:ring-[#2ECC71] transition-all"
                />
                <button
                  onClick={() => {
                    // Pick next avatar preset
                    const currentIndex = avatarPresets.indexOf(editAvatar);
                    const nextIndex = (currentIndex + 1) % avatarPresets.length;
                    setEditAvatar(avatarPresets[nextIndex]);
                    soundEffects.playClickSound();
                  }}
                  className="absolute bottom-1 right-1 p-2.5 rounded-full bg-[#2ECC71] hover:bg-[#27ae60] text-slate-950 shadow-lg shadow-[#2ECC71]/30 transition-transform active:scale-95"
                  title="Cycle Avatar Preset or Camera"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <span className="text-xs text-slate-400">Tap the camera to switch avatar style</span>

              {/* Avatar Presets Grid */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {avatarPresets.map((av, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setEditAvatar(av);
                      soundEffects.playClickSound();
                    }}
                    className={`w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 transition-all ${
                      editAvatar === av ? 'ring-[#2ECC71] scale-110' : 'ring-slate-800 hover:ring-slate-600'
                    }`}
                  >
                    <img src={av} alt="Avatar option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input Field */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#2ECC71]" /> Your Display Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2ECC71] transition-all"
                placeholder="Enter your name..."
              />
              <p className="text-[11px] text-slate-500">
                This name will be visible to your ChatWave contacts and Postly followers.
              </p>
            </div>

            {/* About / Status Field */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" /> About & Bio Status
              </label>
              <input
                type="text"
                value={editStatusText}
                onChange={(e) => setEditStatusText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2ECC71] transition-all"
                placeholder="e.g. ⚡ Available | ChatWave Pro"
              />

              {/* Status Presets */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                  Select from presets:
                </span>
                <div className="space-y-1">
                  {statusPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setEditStatusText(preset);
                        soundEffects.playTapSound();
                      }}
                      className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                        editStatusText === preset
                          ? 'bg-slate-800 text-[#2ECC71] font-bold'
                          : 'bg-slate-950/60 hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <span>{preset}</span>
                      {editStatusText === preset && <Check className="w-4 h-4 text-[#2ECC71]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Phone & Handle Info */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 block">Phone Number</span>
                <span className="text-sm font-semibold text-slate-200">+1 (555) 019-2834</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified
              </span>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveProfile}
              className="w-full py-3 rounded-2xl bg-[#2ECC71] hover:bg-[#27ae60] text-slate-950 font-black text-sm transition-all shadow-lg shadow-[#2ECC71]/30 active:scale-95 flex items-center justify-center gap-2"
            >
              {savedSuccess ? <Check className="w-5 h-5" /> : null}
              <span>{savedSuccess ? 'Profile Updated Successfully!' : 'Save Profile Changes'}</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: WHATSAPP QR CODE SCREEN */}
        {/* ========================================================================= */}
        {currentView === 'qr' && (
          <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-between gap-4">
            {/* Tabs (My Code vs Scan Code) */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xs shrink-0">
              <button
                onClick={() => setQrTab('my_code')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  qrTab === 'my_code' ? 'bg-[#2ECC71] text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                My Code
              </button>
              <button
                onClick={() => setQrTab('scan')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  qrTab === 'scan' ? 'bg-[#2ECC71] text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Scan Code
              </button>
            </div>

            {qrTab === 'my_code' ? (
              <div className="flex flex-col items-center text-center gap-4 my-auto">
                {/* QR CARD */}
                <div className="p-6 rounded-3xl bg-white text-slate-950 shadow-2xl flex flex-col items-center gap-4 relative border-4 border-[#2ECC71]">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500"
                    />
                    <div className="text-left">
                      <h4 className="text-sm font-black text-slate-950">{currentUser.name}</h4>
                      <span className="text-xs text-slate-600 font-semibold">
                        @{currentUser.username || 'user'}
                      </span>
                    </div>
                  </div>

                  {/* QR SVG Simulation */}
                  <div className="p-3 bg-slate-50 border-2 border-slate-900 rounded-2xl">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-48 h-48 fill-current text-slate-950"
                    >
                      {/* Corner 1 */}
                      <rect x="5" y="5" width="30" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="13" y="13" width="14" height="14" rx="2" fill="currentColor" />
                      {/* Corner 2 */}
                      <rect x="65" y="5" width="30" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="73" y="13" width="14" height="14" rx="2" fill="currentColor" />
                      {/* Corner 3 */}
                      <rect x="5" y="65" width="30" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="13" y="73" width="14" height="14" rx="2" fill="currentColor" />
                      {/* Random Matrix Dots */}
                      <rect x="42" y="10" width="8" height="8" rx="1" fill="currentColor" />
                      <rect x="42" y="24" width="8" height="8" rx="1" fill="currentColor" />
                      <rect x="10" y="42" width="8" height="8" rx="1" fill="currentColor" />
                      <rect x="24" y="42" width="8" height="8" rx="1" fill="currentColor" />
                      <rect x="42" y="42" width="16" height="16" rx="2" fill="#2ECC71" />
                      <rect x="65" y="42" width="8" height="8" rx="1" fill="currentColor" />
                      <rect x="80" y="42" width="8" height="8" rx="1" fill="currentColor" />
                      <rect x="42" y="65" width="8" height="8" rx="1" fill="currentColor" />
                      <rect x="55" y="75" width="8" height="8" rx="1" fill="currentColor" />
                      <rect x="70" y="65" width="12" height="12" rx="1" fill="currentColor" />
                      <rect x="85" y="85" width="8" height="8" rx="1" fill="currentColor" />
                    </svg>
                  </div>

                  <p className="text-xs text-slate-600 max-w-[220px]">
                    Your QR code is private. If you share it, others can scan it to message you on ChatWave.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopyInvite}
                    className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-white flex items-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <Copy className="w-4 h-4 text-[#2ECC71]" />
                    <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
                  </button>

                  <button
                    onClick={() => {
                      soundEffects.playCelebrationChime();
                      alert('QR Code Reset: A new private cryptographic key has been generated.');
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white flex items-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Reset QR Code</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center gap-4 my-auto p-6 rounded-3xl bg-slate-900 border border-slate-800 w-full max-w-sm">
                <div className="w-48 h-48 rounded-2xl border-2 border-dashed border-[#2ECC71] flex flex-col items-center justify-center gap-2 bg-slate-950/80 relative overflow-hidden">
                  <Camera className="w-10 h-10 text-emerald-400 animate-pulse" />
                  <span className="text-xs text-slate-400">Point camera at QR code</span>
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#2ECC71] to-transparent animate-bounce" />
                </div>
                <p className="text-xs text-slate-400">
                  Scan another user's ChatWave QR code to immediately start an encrypted chat or follow on Postly.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: ACCOUNT & SECURITY */}
        {/* ========================================================================= */}
        {currentView === 'account' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Security Status Header */}
            <div className="p-4 rounded-3xl bg-blue-950/40 border border-blue-500/30 flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-blue-400 shrink-0" />
              <div>
                <h4 className="text-xs font-black text-blue-300">Account Security: High Priority</h4>
                <p className="text-[11px] text-blue-200/80 leading-relaxed">
                  Your identity and cryptographic encryption keys are protected with multi-device hardware verification.
                </p>
              </div>
            </div>

            {/* Passkeys & Biometrics */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Passkeys (Face ID / Fingerprint)</h4>
                  <p className="text-xs text-slate-400">Sign in securely without passwords using device biometric credentials.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPasskeyEnabled(!passkeyEnabled);
                  soundEffects.playTapSound();
                }}
                className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                  passkeyEnabled ? 'bg-[#2ECC71]' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                    passkeyEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Two-Step Verification */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Two-Step Verification PIN</h4>
                  <p className="text-xs text-slate-400">Require a 6-digit PIN when registering your phone number again.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setTwoStepEnabled(!twoStepEnabled);
                  soundEffects.playTapSound();
                }}
                className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                  twoStepEnabled ? 'bg-[#2ECC71]' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                    twoStepEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Security Notifications Toggle */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Security Notifications</h4>
                  <p className="text-xs text-slate-400">Get notified immediately when a contact's security encryption code changes.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSecurityNotifs(!securityNotifs);
                  soundEffects.playTapSound();
                }}
                className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                  securityNotifs ? 'bg-[#2ECC71]' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                    securityNotifs ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Change Phone Number & Account Operations */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl divide-y divide-slate-800">
              <button
                onClick={() => {
                  soundEffects.playTapSound();
                  onClose();
                  onOpenAuthModal?.();
                }}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-sm font-bold text-white block">ChatMi Login & Verification</span>
                    <span className="text-xs text-slate-400">Phone SMS OTP, ChatMi Web QR & Passkey Authentication</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>

              <button
                onClick={() => {
                  soundEffects.playTapSound();
                  onClose();
                  onLogout?.();
                }}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 text-amber-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-sm font-bold text-amber-300 block">Switch Account / Log Out</span>
                    <span className="text-xs text-slate-400">Log out of this device or switch to another phone number</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-500/50" />
              </button>

              <button
                onClick={() => {
                  soundEffects.playTapSound();
                  alert('Request Account Report: Creating a downloadable ZIP containing your account configuration and Postly creator metadata.');
                }}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <span className="text-sm font-bold text-white block">Request Account Info</span>
                    <span className="text-xs text-slate-400">Download report of account metadata and settings</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>

              <button
                onClick={() => {
                  soundEffects.playTapSound();
                  if (confirm('Are you sure you want to delete your account? This will erase all E2EE chats, creator balance, and Postly media forever.')) {
                    alert('Account Deletion initiated in accordance with GDPR/CCPA.');
                  }
                }}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-rose-950/20 text-rose-400 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-rose-400 shrink-0" />
                  <div>
                    <span className="text-sm font-bold text-rose-400 block">Delete My Account</span>
                    <span className="text-xs text-rose-300/70">Permanently wipe conversation keys, coins & Postly profile</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-500/50" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: AVATAR & 3D IDENTITY */}
        {/* ========================================================================= */}
        {currentView === 'avatar' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Live 3D Avatar Preview Hero */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-purple-950/60 to-slate-900 border border-purple-500/30 flex flex-col items-center gap-4 text-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-3xl ring-4 ring-purple-500/50 overflow-hidden shadow-2xl bg-slate-950 flex items-center justify-center">
                  <img
                    src={editAvatar}
                    alt="Custom Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-purple-600 text-[10px] font-black uppercase text-white shadow-md">
                  3D Gen 2
                </span>
              </div>

              <div>
                <h4 className="text-base font-black text-white">{editName}'s Digital Avatar</h4>
                <p className="text-xs text-slate-400 max-w-xs mt-0.5">
                  Used across ChatWave video call filters, custom emoji reaction stickers, and Postly profiles.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const randomAvatar = avatarPresets[Math.floor(Math.random() * avatarPresets.length)];
                    setEditAvatar(randomAvatar);
                    soundEffects.playCelebrationChime();
                  }}
                  className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Style</span>
                </button>
                <button
                  onClick={() => {
                    soundEffects.playTapSound();
                    alert('Avatar Sticker Pack Generated! 32 dynamic emotional reaction stickers added to your keyboard.');
                  }}
                  className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-bold border border-slate-700 transition-all"
                >
                  Create Sticker Pack
                </button>
              </div>
            </div>

            {/* Customization Options */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Style & Wardrobe</h4>

              {/* Skin Tone Selector */}
              <div className="space-y-1.5">
                <span className="text-xs text-slate-300 font-bold block">Skin Undertone</span>
                <div className="flex items-center gap-2.5">
                  {['#FBD6B7', '#E5A073', '#C68642', '#8D5524', '#4B2A14'].map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setAvatarSkinTone(`tone${idx + 1}`);
                        soundEffects.playTapSound();
                      }}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        avatarSkinTone === `tone${idx + 1}` ? 'border-white scale-125 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Hairstyle */}
              <div className="space-y-1.5">
                <span className="text-xs text-slate-300 font-bold block">Hairstyle & Cut</span>
                <div className="grid grid-cols-4 gap-2">
                  {['Classic Fade', 'Curly Afro', 'Cyber Ponytail', 'Beanie Waves'].map((style) => (
                    <button
                      key={style}
                      onClick={() => {
                        setAvatarHairStyle(style);
                        soundEffects.playTapSound();
                      }}
                      className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold border transition-all ${
                        avatarHairStyle === style
                          ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Outfit Aesthetic */}
              <div className="space-y-1.5">
                <span className="text-xs text-slate-300 font-bold block">Outfit Archetype</span>
                <div className="grid grid-cols-3 gap-2">
                  {['Cyber Punk', 'Streetwear Casual', 'Executive Suite'].map((outfit) => (
                    <button
                      key={outfit}
                      onClick={() => {
                        setAvatarOutfit(outfit);
                        soundEffects.playTapSound();
                      }}
                      className={`py-2 px-2 text-center rounded-xl text-xs font-bold border transition-all ${
                        avatarOutfit === outfit
                          ? 'bg-[#2ECC71]/20 border-[#2ECC71] text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {outfit}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: LINKED DEVICES (WHATSAPP MULTI-DEVICE) */}
        {/* ========================================================================= */}
        {currentView === 'devices' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Multi-Device Banner */}
            <div className="p-4 rounded-3xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-3">
              <Laptop className="w-8 h-8 text-cyan-400 shrink-0" />
              <div>
                <h4 className="text-xs font-black text-cyan-300">Independent Multi-Device Sync</h4>
                <p className="text-[11px] text-cyan-200/80 leading-relaxed">
                  Use ChatWave and Postly on up to 4 companion devices simultaneously without keeping your main phone online.
                </p>
              </div>
            </div>

            {/* Link a Device Button */}
            <button
              onClick={() => {
                setCurrentView('qr');
                setQrTab('scan');
                soundEffects.playTapSound();
              }}
              className="w-full py-3.5 px-4 rounded-3xl bg-[#2ECC71] hover:bg-[#27ae60] text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#2ECC71]/20 active:scale-98 transition-all"
            >
              <QrCode className="w-5 h-5" />
              <span>Link a New Device</span>
            </button>

            {/* Device Status List */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Device Status</h4>
                <span className="text-xs text-slate-400 font-bold">{linkedDevices.length} Active</span>
              </div>

              <div className="divide-y divide-slate-800">
                {linkedDevices.map((dev) => {
                  const DevIcon = dev.icon;
                  return (
                    <div key={dev.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                          <DevIcon className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-bold text-white">{dev.name}</h5>
                            {dev.isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#2ECC71] text-[10px] font-black border border-emerald-500/30">
                                This Device
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span>{dev.location}</span>
                            <span>•</span>
                            <span className={dev.isCurrent ? 'text-[#2ECC71] font-bold' : 'text-slate-500'}>
                              {dev.active}
                            </span>
                          </p>
                        </div>
                      </div>

                      {!dev.isCurrent && (
                        <button
                          onClick={() => {
                            if (confirm(`Log out of ${dev.name}?`)) {
                              setLinkedDevices((prev) => prev.filter((d) => d.id !== dev.id));
                              soundEffects.playTapSound();
                            }
                          }}
                          className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                          title="Log Out Session"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: PRIVACY (WHATSAPP PRIVACY CONTROLS) */}
        {/* ========================================================================= */}
        {currentView === 'privacy' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* E2EE Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#2ECC71] shrink-0" />
              <div>
                <h4 className="text-xs font-black text-emerald-300">
                  Zero-Knowledge Privacy Architecture
                </h4>
                <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                  Your personal messages, media, and status updates are end-to-end encrypted. No third party or even server admins can read them.
                </p>
              </div>
            </div>

            {/* Read Receipts Toggle */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <CheckCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Read Receipts (Blue Ticks)</h4>
                  <p className="text-xs text-slate-400">
                    If turned off, you won't send or receive Read receipts. Always sent in group chats.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const next = !readReceipts;
                  setReadReceipts(next);
                  localStorage.setItem('cw_setting_read_receipts', String(next));
                  soundEffects.playTapSound();
                }}
                className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                  readReceipts ? 'bg-[#2ECC71]' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                    readReceipts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Last Seen & Online Selector */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Last Seen & Online</h4>
                  <p className="text-xs text-slate-400">Who can see when you were last active</p>
                </div>
                <span className="text-xs font-bold text-[#2ECC71] capitalize">{lastSeenPrivacy}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'everyone', label: 'Everyone' },
                  { id: 'contacts', label: 'My Contacts' },
                  { id: 'nobody', label: 'Nobody' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setLastSeenPrivacy(opt.id as any);
                      localStorage.setItem('cw_setting_last_seen', opt.id);
                      soundEffects.playTapSound();
                    }}
                    className={`py-2 px-3 rounded-2xl text-xs font-bold transition-all ${
                      lastSeenPrivacy === opt.id
                        ? 'bg-[#2ECC71] text-slate-950 shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Disappearing Messages Default Timer */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Default Disappearing Messages</h4>
                  <p className="text-xs text-slate-400">Start new chats with messages that disappear</p>
                </div>
                <span className="text-xs font-bold text-indigo-400 uppercase">{disappearingTimer}</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'off', label: 'Off' },
                  { id: '24h', label: '24 Hours' },
                  { id: '7d', label: '7 Days' },
                  { id: '90d', label: '90 Days' },
                ].map((timer) => (
                  <button
                    key={timer.id}
                    onClick={() => {
                      setDisappearingTimer(timer.id as any);
                      soundEffects.playTapSound();
                    }}
                    className={`py-2 px-1 text-center rounded-2xl text-xs font-bold transition-all ${
                      disappearingTimer === timer.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {timer.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Photo Privacy Selector */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Profile Photo Privacy</h4>
                  <p className="text-xs text-slate-400">Choose who can view your avatar and picture</p>
                </div>
                <span className="text-xs font-bold text-[#2ECC71] capitalize">{profilePhotoPrivacy}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'everyone', label: 'Everyone' },
                  { id: 'contacts', label: 'My Contacts' },
                  { id: 'nobody', label: 'Nobody' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setProfilePhotoPrivacy(opt.id as any);
                      soundEffects.playTapSound();
                    }}
                    className={`py-2 px-3 rounded-2xl text-xs font-bold transition-all ${
                      profilePhotoPrivacy === opt.id
                        ? 'bg-[#2ECC71] text-slate-950 shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* App Lock with Biometrics / Fingerprint */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">App Lock (Biometric / Face ID)</h4>
                  <p className="text-xs text-slate-400">
                    Require Touch ID or Face ID unlock when opening ChatWave.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setAppLockFingerprint(!appLockFingerprint);
                  soundEffects.playTapSound();
                }}
                className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                  appLockFingerprint ? 'bg-[#2ECC71]' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                    appLockFingerprint ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Block Screenshots in View Once */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <EyeOff className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Block Screenshots in View-Once</h4>
                  <p className="text-xs text-slate-400">
                    Disallow screen capture or screen recording of disappearing photos & video notes.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setBlockScreenshots(!blockScreenshots);
                  soundEffects.playTapSound();
                }}
                className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                  blockScreenshots ? 'bg-[#2ECC71]' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                    blockScreenshots ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Silence Unknown Callers */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white">Silence Unknown Callers</h4>
                <p className="text-xs text-slate-400">
                  Calls from unknown phone numbers will be silenced automatically.
                </p>
              </div>
              <button
                onClick={() => {
                  setSilenceUnknownCallers(!silenceUnknownCallers);
                  soundEffects.playTapSound();
                }}
                className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                  silenceUnknownCallers ? 'bg-[#2ECC71]' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                    silenceUnknownCallers ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Advanced: Protect IP Address in Calls */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white">Protect IP Address in Calls</h4>
                <p className="text-xs text-slate-400">
                  Relay all WebRTC calls through ChatMi low-latency edge servers to hide your IP address.
                </p>
              </div>
              <button
                onClick={() => {
                  setProtectIpCalls(!protectIpCalls);
                  soundEffects.playTapSound();
                }}
                className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                  protectIpCalls ? 'bg-[#2ECC71]' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                    protectIpCalls ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 5: CHATS & BACKUPS (WHATSAPP CHATS & DRIVE BACKUP) */}
        {/* ========================================================================= */}
        {currentView === 'chats' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Theme Selector */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-400" /> Chat Atmosphere & Theme
              </h4>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'dark', name: 'Dark Obsidian', color: 'bg-slate-950' },
                  { id: 'emerald-dark', name: 'Emerald Matrix', color: 'bg-emerald-950' },
                  { id: 'midnight', name: 'Midnight Sapphire', color: 'bg-indigo-950' },
                  { id: 'sunset', name: 'Sunset Rose', color: 'bg-rose-950' },
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => {
                      setThemeMode(th.id as any);
                      soundEffects.playTapSound();
                    }}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                      themeMode === th.id
                        ? 'border-[#2ECC71] ring-2 ring-[#2ECC71]/40 bg-slate-800 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${th.color} border border-slate-700`} />
                    <span className="text-[10px] font-bold truncate w-full text-center">{th.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size & Chat Bubble Scale */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Chat Font Size & Accessibility</h4>
                  <p className="text-xs text-slate-400">Scale message text for comfortable reading</p>
                </div>
                <span className="text-xs font-bold text-[#2ECC71] capitalize">{fontSize}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'small', label: 'Small (13px)' },
                  { id: 'medium', label: 'Medium (15px)' },
                  { id: 'large', label: 'Large (17px)' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setFontSize(opt.id as any);
                      soundEffects.playTapSound();
                    }}
                    className={`py-2 px-2 text-center rounded-2xl text-xs font-bold transition-all ${
                      fontSize === opt.id
                        ? 'bg-[#2ECC71] text-slate-950 shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Instant Video Messages & Enter is Send */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl divide-y divide-slate-800">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Instant Video & Audio Messages</h4>
                  <p className="text-xs text-slate-400">
                    Tap microphone to record audio, swipe to lock for hands-free video note.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setInstantVideoMessages(!instantVideoMessages);
                    soundEffects.playTapSound();
                  }}
                  className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                    instantVideoMessages ? 'bg-[#2ECC71]' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                      instantVideoMessages ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Enter is Send</h4>
                  <p className="text-xs text-slate-400">Enter key on physical keyboard will dispatch message immediately.</p>
                </div>
                <button
                  onClick={() => {
                    setEnterIsSend(!enterIsSend);
                    soundEffects.playTapSound();
                  }}
                  className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                    enterIsSend ? 'bg-[#2ECC71]' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                      enterIsSend ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Cloud Chat Backup (Google Drive / Cloud Run Storage) */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Cloud Chat Backup</h4>
                    <p className="text-xs text-slate-400">Last backup: {lastBackupTime}</p>
                  </div>
                </div>

                <button
                  onClick={handleTriggerBackup}
                  disabled={isBackingUp}
                  className="px-4 py-2 rounded-2xl bg-[#2ECC71] hover:bg-[#27ae60] disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 text-xs font-black transition-all shadow-md active:scale-95"
                >
                  {isBackingUp ? `Backing up ${backupProgress}%` : 'Back Up Now'}
                </button>
              </div>

              {isBackingUp && (
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-[#2ECC71] h-full transition-all duration-300"
                    style={{ width: `${backupProgress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Export Transcripts */}
            {onExportData && (
              <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Export Chat Transcripts</h4>
                  <p className="text-xs text-slate-400">Download formatted JSON transcript of all conversation logs</p>
                </div>
                <button
                  onClick={onExportData}
                  className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-indigo-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: AI STUDIO & SMART ASSISTANT */}
        {/* ========================================================================= */}
        {currentView === 'ai' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* AI Banner */}
            <div className="p-4 rounded-3xl bg-violet-950/40 border border-violet-500/30 flex items-center gap-3">
              <Bot className="w-8 h-8 text-violet-400 shrink-0" />
              <div>
                <h4 className="text-xs font-black text-violet-300">Gemini 2.5 Flash Autonomous Engine</h4>
                <p className="text-[11px] text-violet-200/80 leading-relaxed">
                  Real-time neural intelligence powering on-device transcriptions, smart contextual replies, and multi-lingual voice translation.
                </p>
              </div>
            </div>

            {/* AI Model Performance Tier */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Intelligence Profile</h4>
                  <p className="text-xs text-slate-400">Balance speed versus depth of reasoning</p>
                </div>
                <span className="text-xs font-bold text-violet-400 uppercase">{aiModelTier}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'flash', label: 'Gemini Flash', sub: 'Ultra Fast (<50ms)' },
                  { id: 'pro', label: 'Gemini Pro', sub: 'Deep Context' },
                  { id: 'ultra', label: 'Interactions API', sub: 'Agentic Tools' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => {
                      setAiModelTier(tier.id as any);
                      soundEffects.playTapSound();
                    }}
                    className={`py-2 px-1 text-center rounded-2xl text-xs font-bold border transition-all ${
                      aiModelTier === tier.id
                        ? 'bg-violet-600 border-violet-400 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="block">{tier.label}</span>
                    <span className="text-[9px] opacity-75 font-normal block">{tier.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Features Toggles */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl divide-y divide-slate-800">
              {/* Smart Quick Reply */}
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white">Contextual Smart Replies</h4>
                  <p className="text-xs text-slate-400">Generate 1-tap contextual reply chips above the message bar.</p>
                </div>
                <button
                  onClick={() => {
                    setAiSmartReply(!aiSmartReply);
                    soundEffects.playTapSound();
                  }}
                  className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                    aiSmartReply ? 'bg-[#2ECC71]' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                      aiSmartReply ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Real-time Voice & Audio Translation */}
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white">Live Voice Call Translation</h4>
                  <p className="text-xs text-slate-400">Simultaneously translate incoming voice notes into your local language.</p>
                </div>
                <button
                  onClick={() => {
                    setAiAutoTranslate(!aiAutoTranslate);
                    soundEffects.playTapSound();
                  }}
                  className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                    aiAutoTranslate ? 'bg-[#2ECC71]' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                      aiAutoTranslate ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Neural TTS Voice Synthesis */}
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white">Neural Voice Synthesis (TTS)</h4>
                  <p className="text-xs text-slate-400">Read out messages using realistic human speech waveforms.</p>
                </div>
                <button
                  onClick={() => {
                    setAiVoiceSynthesis(!aiVoiceSynthesis);
                    soundEffects.playTapSound();
                  }}
                  className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                    aiVoiceSynthesis ? 'bg-[#2ECC71]' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                      aiVoiceSynthesis ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 6: NOTIFICATIONS & TONES */}
        {/* ========================================================================= */}
        {currentView === 'notifications' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Conversation Tones */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Conversation Tones</h4>
                <p className="text-xs text-slate-400">Play synthesized audio SFX for incoming and outgoing messages</p>
              </div>
              <button
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  soundEffects.playTapSound();
                }}
                className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                  soundEnabled ? 'bg-[#2ECC71]' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Tone Selector & Sound Preview */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-400" /> Synthesized Notification Tones
              </h4>

              <div className="space-y-1.5">
                {['Cosmic Wave', 'Celebration Chime', 'Cash Coin', 'Radar Ping', 'Aurora Glow'].map((tone) => (
                  <button
                    key={tone}
                    onClick={() => {
                      setSelectedRingtone(tone);
                      if (tone === 'Celebration Chime') soundEffects.playCelebrationChime();
                      else if (tone === 'Cash Coin') soundEffects.playCashSound();
                      else soundEffects.playReceiveSound();
                    }}
                    className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-xs transition-all ${
                      selectedRingtone === tone
                        ? 'bg-[#2ECC71]/20 text-[#2ECC71] font-bold border border-[#2ECC71]/40'
                        : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <span>{tone}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">Test SFX</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reactions & Vibrate */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl divide-y divide-slate-800">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Reaction Notifications</h4>
                  <p className="text-xs text-slate-400">Show notifications when someone reacts to messages you send</p>
                </div>
                <button
                  onClick={() => {
                    setReactionNotifications(!reactionNotifications);
                    soundEffects.playTapSound();
                  }}
                  className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                    reactionNotifications ? 'bg-[#2ECC71]' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                      reactionNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Call Vibration</h4>
                  <p className="text-xs text-slate-400">Haptic vibration pattern for incoming video & voice calls</p>
                </div>
                <button
                  onClick={() => {
                    setVibrateCalls(!vibrateCalls);
                    soundEffects.playTapSound();
                  }}
                  className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                    vibrateCalls ? 'bg-[#2ECC71]' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                      vibrateCalls ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 7: STORAGE & DATA (WHATSAPP STORAGE CLEANER) */}
        {/* ========================================================================= */}
        {currentView === 'storage' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Storage Visual Breakdown Bar */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Storage Breakdown</h4>
                  <span className="text-xs text-slate-400">1.8 GB Used / 64 GB Free</span>
                </div>
                <button
                  onClick={handleCleanStorage}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/30 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{cacheCleaned ? 'Cache Cleared!' : 'Clean 450 MB Cache'}</span>
                </button>
              </div>

              {/* Progress visual */}
              <div className="w-full bg-slate-950 rounded-full h-3 flex overflow-hidden border border-slate-800">
                <div className="bg-blue-500 h-full w-[45%]" title="Chat Media (1.1 GB)" />
                <div className="bg-pink-500 h-full w-[35%]" title="Postly HD Videos (650 MB)" />
                <div className="bg-emerald-500 h-full w-[20%]" title="Transcripts & DB (50 MB)" />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Chat Media (1.1 GB)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-pink-500" /> Postly Videos (650 MB)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> App DB (50 MB)
                </span>
              </div>
            </div>

            {/* Media Auto-Download */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-3">
              <h4 className="text-sm font-bold text-white">Media Auto-Download</h4>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">When connected on Wi-Fi</span>
                  <span className="font-bold text-[#2ECC71]">All Media (Photos, Video, Audio)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">When using mobile data</span>
                  <span className="font-bold text-amber-400">Photos Only</span>
                </div>
              </div>
            </div>

            {/* Low Data Mode for Calls */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white">Use Less Data for Calls</h4>
                <p className="text-xs text-slate-400">
                  Dynamic Opus & VP9 bitrate adaptation for ultra low-bandwidth cellular environments.
                </p>
              </div>
              <button
                onClick={() => {
                  setLowDataForCalls(!lowDataForCalls);
                  soundEffects.playTapSound();
                }}
                className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                  lowDataForCalls ? 'bg-[#2ECC71]' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                    lowDataForCalls ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 8: POSTLY & CREATOR ECONOMY */}
        {/* ========================================================================= */}
        {currentView === 'creator' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Creator Monetization Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950 via-pink-950 to-slate-950 border border-rose-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-6 h-6 text-rose-400" />
                  <h4 className="text-base font-black text-white">Postly Creator Wallet</h4>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-xs font-black shadow-md">
                  Active Creator Tier
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-rose-300">{creatorTipJarBalance.toLocaleString()}</span>
                <span className="text-xs font-bold text-slate-400">Postly Coins (~$34.20 USD)</span>
              </div>

              <p className="text-xs text-slate-300">
                Earned from gifts, sticker tips, and video likes across your Postly feed.
              </p>
            </div>

            {/* 4K Ultra HD Upload Toggle */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white">Upload in High Quality (4K 60fps)</h4>
                <p className="text-xs text-slate-400">
                  Always upload videos and reels at maximum resolution without lossy compression.
                </p>
              </div>
              <button
                onClick={() => {
                  setHdUploadQuality(!hdUploadQuality);
                  soundEffects.playTapSound();
                }}
                className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                  hdUploadQuality ? 'bg-[#2ECC71]' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                    hdUploadQuality ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Privacy Isolation Notice */}
            <div className="p-4 rounded-3xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-indigo-300">Postly & Chat Sandbox Security</h4>
                <p className="text-[11px] text-indigo-200/80 leading-relaxed mt-0.5">
                  Postly public direct messages, comments, and followers are strictly segregated from your personal private chats and phone contacts.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 9: HELP & SYSTEM STATUS */}
        {/* ========================================================================= */}
        {currentView === 'help' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* System Status SLA */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">Global Edge Network Health</h4>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  99.999% Operational
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Latency</span>
                  <span className="font-bold text-white">14 ms</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">WebSockets</span>
                  <span className="font-bold text-emerald-400">Connected</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Encryption</span>
                  <span className="font-bold text-cyan-400">AES-256</span>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Contact 24/7 Concierge</h4>
                <p className="text-xs text-slate-400">Need help? Chat with our autonomous AI support agent</p>
              </div>
              <button
                onClick={() => {
                  soundEffects.playCelebrationChime();
                  alert('Connecting to 24/7 AI Enterprise Concierge...');
                }}
                className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
              >
                Start Chat
              </button>
            </div>

            {/* Terms & Privacy */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl divide-y divide-slate-800">
              <div className="p-3.5 flex items-center justify-between text-xs text-slate-300">
                <span>Terms of Service & EULA</span>
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </div>
              <div className="p-3.5 flex items-center justify-between text-xs text-slate-300">
                <span>Privacy Policy & Data Rights</span>
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </div>
              <div className="p-3.5 flex items-center justify-between text-xs text-slate-300">
                <span>Open Source Licenses & Patents</span>
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
