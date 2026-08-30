import React from 'react';
import {
  MessageSquare,
  Wifi,
  Star,
  PhoneCall,
  Settings,
  Sparkles,
  Bot,
  User as UserIcon,
  ShieldCheck,
  Command,
  Globe,
  Zap,
  Users,
  FileText,
} from 'lucide-react';
import { User } from '../types';
import { ChatWaveLogo } from './ChatWaveLogo';

interface SidebarNavProps {
  activeTab: 'chats' | 'stories' | 'starred' | 'calls' | 'ai';
  setActiveTab: (tab: 'chats' | 'stories' | 'starred' | 'calls' | 'ai') => void;
  currentUser: User;
  onOpenSettings: () => void;
  onOpenAuthModal: () => void;
  onOpenGoogleContacts?: () => void;
  onOpenGoogleForms?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenGlobalModal?: () => void;
  currentLanguageFlag?: string;
  unseenStoriesCount: number;
  starredMessagesCount: number;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenSettings,
  onOpenAuthModal,
  onOpenGoogleContacts,
  onOpenGoogleForms,
  onOpenCommandPalette,
  onOpenGlobalModal,
  currentLanguageFlag = '🌐',
  unseenStoriesCount,
  starredMessagesCount,
}) => {
  return (
    <>
      {/* Desktop & Tablet Vertical Navigation Rail (md and up) */}
      <aside className="hidden md:flex w-16 lg:w-18 bg-slate-950 border-r border-slate-800/80 flex-col justify-between items-center py-4 select-none shrink-0 z-20">
        {/* Top Section: App Logo & Core Navigation */}
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Brand Icon */}
          <div className="relative group cursor-pointer" onClick={() => setActiveTab('chats')}>
            <div className="p-1 rounded-2xl group-hover:scale-105 transition-all">
              <ChatWaveLogo iconOnly size="md" />
            </div>
            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2.5 py-1 rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none font-medium border border-slate-700/50 flex items-center gap-1.5">
              <span>ChatMi</span>
              <kbd className="px-1 py-0.2 bg-slate-700 text-[10px] rounded text-slate-300">1</kbd>
            </span>
          </div>

          {/* Navigation Rail */}
          <nav className="flex flex-col items-center gap-2 w-full px-2">
            {/* Chats */}
            <button
              onClick={() => setActiveTab('chats')}
              className={`relative p-3 rounded-2xl transition-all duration-200 group w-11 h-11 flex items-center justify-center ${
                activeTab === 'chats'
                  ? 'bg-indigo-600/20 text-indigo-400 font-semibold border border-indigo-500/30 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title="Chats [1]"
            >
              {activeTab === 'chats' && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full shadow-lg shadow-indigo-500/50" />
              )}
              <MessageSquare className="w-5 h-5" />
              <span className="absolute left-16 bg-slate-800 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none font-medium border border-slate-700/50 flex items-center gap-1.5 shadow-xl">
                <span>Conversations</span>
                <kbd className="px-1 py-0.2 bg-slate-700 text-[10px] rounded text-slate-300">1</kbd>
              </span>
            </button>

            {/* Alpha Direct */}
            <button
              onClick={() => setActiveTab('ai')}
              className={`relative p-3 rounded-2xl transition-all duration-200 group w-11 h-11 flex items-center justify-center ${
                activeTab === 'ai'
                  ? 'bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30 ring-1 ring-purple-500/40 shadow-inner'
                  : 'text-slate-400 hover:text-purple-300 hover:bg-slate-800/60'
              }`}
              title="Alpha AI Copilot [2]"
            >
              {activeTab === 'ai' && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-purple-500 rounded-r-full shadow-lg shadow-purple-500/50" />
              )}
              <img src="/alpha-logo.svg" alt="Alpha" className="w-6 h-6 object-contain rounded-full shadow-sm" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="absolute left-16 bg-slate-800 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none font-medium border border-slate-700/50 flex items-center gap-1.5 shadow-xl">
                <span className="text-purple-300 font-semibold">Alpha AI Copilot</span>
                <kbd className="px-1 py-0.2 bg-slate-700 text-[10px] rounded text-slate-300">2</kbd>
              </span>
            </button>

            {/* Status Stories -> Postly */}
            <button
              onClick={() => setActiveTab('stories')}
              className={`relative p-3 rounded-2xl transition-all duration-200 group w-11 h-11 flex items-center justify-center ${
                activeTab === 'stories'
                  ? 'bg-rose-600/20 text-rose-400 font-semibold border border-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title="Postly Stories & Reels [3]"
            >
              {activeTab === 'stories' && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-rose-500 rounded-r-full shadow-lg shadow-rose-500/50" />
              )}
              <Wifi className="w-5 h-5" />
              {unseenStoriesCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-slate-950 animate-pulse" />
              )}
              <span className="absolute left-16 bg-slate-800 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none font-medium border border-slate-700/50 flex items-center gap-1.5 shadow-xl">
                <span>Postly Reels ({unseenStoriesCount})</span>
                <kbd className="px-1 py-0.2 bg-slate-700 text-[10px] rounded text-slate-300">3</kbd>
              </span>
            </button>

            {/* Starred Messages */}
            <button
              onClick={() => setActiveTab('starred')}
              className={`relative p-3 rounded-2xl transition-all duration-200 group w-11 h-11 flex items-center justify-center ${
                activeTab === 'starred'
                  ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title="Saved & Starred Messages [4]"
            >
              {activeTab === 'starred' && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-amber-500 rounded-r-full shadow-lg shadow-amber-500/50" />
              )}
              <Star className="w-5 h-5" />
              {starredMessagesCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 flex items-center justify-center">
                  {starredMessagesCount}
                </span>
              )}
              <span className="absolute left-16 bg-slate-800 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none font-medium border border-slate-700/50 flex items-center gap-1.5 shadow-xl">
                <span>Saved Messages ({starredMessagesCount})</span>
                <kbd className="px-1 py-0.2 bg-slate-700 text-[10px] rounded text-slate-300">4</kbd>
              </span>
            </button>

            {/* Calls */}
            <button
              onClick={() => setActiveTab('calls')}
              className={`relative p-3 rounded-2xl transition-all duration-200 group w-11 h-11 flex items-center justify-center ${
                activeTab === 'calls'
                  ? 'bg-indigo-600/20 text-indigo-400 font-semibold border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title="Voice & Video Calls [5]"
            >
              {activeTab === 'calls' && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full shadow-lg shadow-indigo-500/50" />
              )}
              <PhoneCall className="w-5 h-5" />
              <span className="absolute left-16 bg-slate-800 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none font-medium border border-slate-700/50 flex items-center gap-1.5 shadow-xl">
                <span>Calls & Meetings</span>
                <kbd className="px-1 py-0.2 bg-slate-700 text-[10px] rounded text-slate-300">5</kbd>
              </span>
            </button>

            {/* Google Contacts Hub */}
            {onOpenGoogleContacts && (
              <button
                onClick={onOpenGoogleContacts}
                className="relative p-3 rounded-2xl transition-all duration-200 group w-11 h-11 flex items-center justify-center text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/15 border border-indigo-500/20"
                title="Google Contacts Directory"
              >
                <Users className="w-5 h-5" />
                <span className="absolute left-16 bg-slate-800 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none font-medium border border-slate-700/50 flex items-center gap-1.5 shadow-xl">
                  <span>Google Contacts</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Workspace</span>
                </span>
              </button>
            )}

            {/* Google Forms & Surveys Hub */}
            {onOpenGoogleForms && (
              <button
                onClick={onOpenGoogleForms}
                className="relative p-3 rounded-2xl transition-all duration-200 group w-11 h-11 flex items-center justify-center text-purple-400 hover:text-purple-300 hover:bg-purple-500/15 border border-purple-500/20"
                title="Google Forms & Surveys"
              >
                <FileText className="w-5 h-5" />
                <span className="absolute left-16 bg-slate-800 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none font-medium border border-slate-700/50 flex items-center gap-1.5 shadow-xl">
                  <span>Google Forms & Surveys</span>
                  <span className="text-[10px] text-purple-400 font-mono">Workspace</span>
                </span>
              </button>
            )}

            {/* Quick Command Launcher (Cmd+K) */}
            {onOpenCommandPalette && (
              <button
                onClick={onOpenCommandPalette}
                className="relative p-3 rounded-2xl transition-all duration-200 group w-11 h-11 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/20"
                title="Command Palette (Cmd+K)"
              >
                <Command className="w-5 h-5" />
                <span className="absolute left-16 bg-slate-800 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none font-medium border border-slate-700/50 flex items-center gap-1.5 shadow-xl">
                  <span>Command Center</span>
                  <kbd className="px-1 py-0.2 bg-slate-700 text-[10px] rounded text-slate-300">⌘K</kbd>
                </span>
              </button>
            )}
          </nav>
        </div>

        {/* Bottom Section: Settings & User Profile */}
        <div className="flex flex-col items-center gap-2.5 w-full px-2">
          {/* Global Availability / Language / Edge Selector */}
          {onOpenGlobalModal && (
            <button
              onClick={onOpenGlobalModal}
              className="p-2.5 rounded-2xl text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/15 border border-cyan-500/20 transition-all group relative w-11 h-11 flex items-center justify-center"
              title="Global Availability & Language"
            >
              <span className="text-base leading-none">{currentLanguageFlag}</span>
              <span className="absolute left-16 bg-slate-800 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none font-medium border border-slate-700/50 flex items-center gap-1.5 shadow-xl">
                <Globe className="w-3 h-3 text-cyan-400" />
                <span>Global Region & Language</span>
              </span>
            </button>
          )}

          {/* Auth Session Button */}
          <button
            onClick={onOpenAuthModal}
            className="p-3 rounded-2xl text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/15 border border-emerald-500/20 transition-all group relative w-11 h-11 flex items-center justify-center shadow-md shadow-emerald-950/40"
            title="Authentication & Account Session"
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none font-medium border border-slate-700/50 shadow-xl">
              Auth: {currentUser.name}
            </span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-3 rounded-2xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors group relative w-11 h-11 flex items-center justify-center"
            title="App Settings"
          >
            <Settings className="w-5 h-5" />
            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none font-medium border border-slate-700/50 shadow-xl">
              Settings & Preferences
            </span>
          </button>

          {/* User Profile Avatar */}
          <div className="relative group cursor-pointer" onClick={onOpenAuthModal}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/70 hover:ring-emerald-400 transition-all shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-slate-950" />
            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none font-medium border border-slate-700/50 shadow-xl">
              {currentUser.name}
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile Smartphone Bottom Navigation Bar (Persistent across all views) */}
      <nav
        id="chatmi-bottom-control-panel"
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 flex items-center justify-around px-1 z-50 select-none shadow-[0_-8px_25px_rgba(0,0,0,0.6)]"
      >
        {/* Chats Tab */}
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 rounded-xl transition-all ${
            activeTab === 'chats'
              ? 'text-indigo-400 font-bold scale-105 bg-indigo-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Chats & Conversations"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] leading-none tracking-tight">Chats</span>
        </button>

        {/* Alpha AI Tab */}
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 rounded-xl transition-all relative ${
            activeTab === 'ai'
              ? 'text-purple-300 font-bold scale-105 bg-purple-500/10'
              : 'text-slate-400 hover:text-purple-300'
          }`}
          title="Alpha AI Copilot"
        >
          <div className="relative">
            <img src="/alpha-logo.svg" alt="Alpha" className="w-5 h-5 object-contain rounded-full shadow" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse ring-1 ring-slate-950" />
          </div>
          <span className="text-[10px] leading-none tracking-tight">Alpha</span>
        </button>

        {/* Postly / Stories Tab */}
        <button
          onClick={() => setActiveTab('stories')}
          className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 rounded-xl transition-all relative ${
            activeTab === 'stories'
              ? 'text-rose-400 font-bold scale-105 bg-rose-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Postly Stories & Reels"
        >
          <div className="relative">
            <Wifi className="w-5 h-5" />
            {unseenStoriesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-slate-950 animate-pulse" />
            )}
          </div>
          <span className="text-[10px] leading-none tracking-tight">Postly</span>
        </button>

        {/* Starred Messages Tab */}
        <button
          onClick={() => setActiveTab('starred')}
          className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 rounded-xl transition-all relative ${
            activeTab === 'starred'
              ? 'text-amber-400 font-bold scale-105 bg-amber-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Starred Messages"
        >
          <div className="relative">
            <Star className={`w-5 h-5 ${activeTab === 'starred' ? 'fill-amber-400' : ''}`} />
            {starredMessagesCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[15px] h-3.5 px-0.5 rounded-full bg-amber-500 text-[9px] font-bold text-slate-950 flex items-center justify-center ring-1 ring-slate-950">
                {starredMessagesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-none tracking-tight">Saved</span>
        </button>

        {/* Calls Tab */}
        <button
          onClick={() => setActiveTab('calls')}
          className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 rounded-xl transition-all ${
            activeTab === 'calls'
              ? 'text-indigo-400 font-bold scale-105 bg-indigo-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Calls & Meetings"
        >
          <PhoneCall className="w-5 h-5" />
          <span className="text-[10px] leading-none tracking-tight">Calls</span>
        </button>

        {/* Contacts Tab */}
        {onOpenGoogleContacts && (
          <button
            onClick={onOpenGoogleContacts}
            className="flex flex-col items-center justify-center flex-1 py-1 gap-1 rounded-xl text-slate-400 hover:text-indigo-300 transition-all active:scale-95"
            title="Google Contacts"
          >
            <Users className="w-5 h-5 text-indigo-400" />
            <span className="text-[10px] leading-none tracking-tight font-medium text-indigo-400">Contacts</span>
          </button>
        )}

        {/* Settings / You Tab */}
        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center justify-center flex-1 py-1 gap-1 rounded-xl text-slate-400 hover:text-emerald-400 transition-all active:scale-95"
          title="ChatMi Settings & Identity"
        >
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-500/80 shadow-sm"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-slate-950" />
          </div>
          <span className="text-[10px] leading-none tracking-tight font-medium text-emerald-400">Settings</span>
        </button>
      </nav>
    </>
  );
};

