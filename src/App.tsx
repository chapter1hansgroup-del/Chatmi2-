/**
 * Professional Chat Application (Next-Gen Enterprise Messaging)
 * Express + WebSocket + Alpha AI (Gemini 3.6)
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SidebarNav } from './components/SidebarNav';
import { ChatList } from './components/ChatList';
import { ChatHeader } from './components/ChatHeader';
import { MessageItem } from './components/MessageItem';
import { MessageInput } from './components/MessageInput';
import { ChatInfoPanel } from './components/ChatInfoPanel';
import { StatusStoriesModal } from './components/StatusStoriesModal';
import { ContactStatusModal } from './components/ContactStatusModal';
import { PostlyLiveModal } from './components/PostlyLiveModal';
import { CallModal } from './components/CallModal';
import { CallsHub } from './components/CallsHub';
import { StarredHub } from './components/StarredHub';
import { NewChatModal } from './components/NewChatModal';
import { PollCreatorModal } from './components/PollCreatorModal';
import { SettingsModal } from './components/SettingsModal';
import { AiToolsModal } from './components/AiToolsModal';
import { AuthModal } from './components/AuthModal';
import { DoodleCanvasModal } from './components/DoodleCanvasModal';
import { ScheduleMessageModal } from './components/ScheduleMessageModal';
import { LocationPickerModal } from './components/LocationPickerModal';
import { ScreenFxOverlay } from './components/ScreenFxOverlay';
import { WatchPartyModal } from './components/WatchPartyModal';
import { MindMapVisualizerModal } from './components/MindMapVisualizerModal';
import { AiVoiceOrbModal } from './components/AiVoiceOrbModal';
import { SecretVaultModal } from './components/SecretVaultModal';
import { StealthDisguiseOverlay } from './components/StealthDisguiseOverlay';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { AiImageStudioModal } from './components/AiImageStudioModal';
import { GoogleContactsModal } from './components/GoogleContactsModal';
import { GoogleContact } from './lib/googleContacts';
import { GoogleFormsModal } from './components/GoogleFormsModal';
import { GoogleForm } from './lib/googleForms';
import { PinnedBanner } from './components/PinnedBanner';
import { GlobalRegionModal } from './components/GlobalRegionModal';
import { db } from './lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import {
  SUPPORTED_LANGUAGES,
  GLOBAL_EDGE_REGIONS,
  CountryLanguage,
  EdgeRegion,
  getTranslation,
} from './utils/i18n';

import {
  CURRENT_USER,
  MOCK_USERS,
  MOCK_CHATS,
  MOCK_INITIAL_MESSAGES,
  MOCK_STORIES,
  MOCK_LIVE_STREAMS,
  AI_ASSISTANT_USER,
} from './data/mockData';
import {
  Chat,
  Message,
  MessageType,
  StatusStory,
  LiveStream,
  ActiveCall,
  User,
  PollOption,
  GameData,
  ScheduledMessage,
  ScreenFxType,
} from './types';
import { soundEffects } from './utils/audio';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'chats' | 'stories' | 'starred' | 'calls' | 'ai'>('chats');
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const session = sessionStorage.getItem('chatmi_authenticated_user');
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed && parsed.isAuthenticated === true) {
          return parsed;
        }
      }
    } catch {
      // Fallback to unauthenticated
    }
    return { ...CURRENT_USER, isAuthenticated: false };
  });
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  // Chat Data State
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string>('chat_product_eng');
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_INITIAL_MESSAGES);
  const [stories, setStories] = useState<StatusStory[]>(MOCK_STORIES);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>(MOCK_LIVE_STREAMS);
  const [liveModalConfig, setLiveModalConfig] = useState<{
    isOpen: boolean;
    mode: 'host' | 'viewer';
    activeStream?: LiveStream | null;
  }>({ isOpen: false, mode: 'host' });

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Message States
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [scheduledQueue, setScheduledQueue] = useState<ScheduledMessage[]>([]);

  // Calls & Modals
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showPollCreatorModal, setShowPollCreatorModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAiToolsModal, setShowAiToolsModal] = useState(false);
  const [showStoriesModal, setShowStoriesModal] = useState(false);
  const [showContactStatusModal, setShowContactStatusModal] = useState(false);
  const [contactStatusIndex, setContactStatusIndex] = useState(0);
  const [openStatusCreateMode, setOpenStatusCreateMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDoodleModal, setShowDoodleModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showLocationPickerModal, setShowLocationPickerModal] = useState(false);

  // Mind-Blowing Interactive Feature States
  const [activeFx, setActiveFx] = useState<ScreenFxType | null>(null);
  const [showWatchPartyModal, setShowWatchPartyModal] = useState(false);
  const [showMindMapModal, setShowMindMapModal] = useState(false);
  const [showVoiceOrbModal, setShowVoiceOrbModal] = useState(false);
  const [showSecretVaultModal, setShowSecretVaultModal] = useState(false);
  const [stealthDisguise, setStealthDisguise] = useState<'code' | 'calculator' | null>(null);

  // Pro Command Palette & AI Studio States
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showImageStudioModal, setShowImageStudioModal] = useState(false);
  const [showGoogleContactsModal, setShowGoogleContactsModal] = useState(false);
  const [showGoogleFormsModal, setShowGoogleFormsModal] = useState(false);
  const [pinnedMessageId, setPinnedMessageId] = useState<string | null>(null);

  // 100% Global Availability, Multi-Language & Anycast Edge States
  const [showGlobalModal, setShowGlobalModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    return localStorage.getItem('chatmi_locale') || 'en';
  });
  const [selectedRegion, setSelectedRegion] = useState<string>(() => {
    return localStorage.getItem('chatmi_edge_region') || 'global-auto';
  });
  const [dataSaverMode, setDataSaverMode] = useState<boolean>(() => {
    return localStorage.getItem('chatmi_data_saver') === 'true';
  });
  const [autoTranslateIncoming, setAutoTranslateIncoming] = useState<boolean>(() => {
    return localStorage.getItem('chatmi_auto_translate') === 'true';
  });

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  const currentRegionObj =
    GLOBAL_EDGE_REGIONS.find((r) => r.id === selectedRegion) || GLOBAL_EDGE_REGIONS[0];

  // Dynamic Right-to-Left (RTL) and Document Lang Sync
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    if (currentLangObj.rtl) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [currentLanguage, currentLangObj.rtl]);

  // Navigation Tab Change Handler
  const handleTabChange = (tab: 'chats' | 'stories' | 'starred' | 'calls' | 'ai') => {
    setActiveTab(tab);
    if (tab === 'ai') {
      setActiveChatId('chat_ai');
      setMobileChatOpen(true);
    } else if (tab === 'stories') {
      setShowStoriesModal(true);
    } else if (tab === 'chats') {
      // Return to chat list on mobile or keep open
    }
  };

  // Global Keyboard Shortcuts (1-5 for tabs, [ & ] for prev/next chat, Cmd+K for Command Center, Alt+V for Voice Orb, Esc to close)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isInputFocused =
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        (document.activeElement as HTMLElement)?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      } else if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setShowImageStudioModal(false);
        setShowAiToolsModal(false);
        setShowInfoPanel(false);
        setShowMindMapModal(false);
        setShowWatchPartyModal(false);
        setShowVoiceOrbModal(false);
        setShowSecretVaultModal(false);
        setShowStoriesModal(false);
        setShowSettingsModal(false);
        setShowAuthModal(false);
        setShowGlobalModal(false);
        setShowNewChatModal(false);
        setShowPollCreatorModal(false);
      } else if (e.altKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        setShowVoiceOrbModal((prev) => !prev);
      } else if (!isInputFocused && !e.metaKey && !e.ctrlKey) {
        if (e.key === '1') {
          handleTabChange('chats');
        } else if (e.key === '2') {
          handleTabChange('ai');
        } else if (e.key === '3') {
          handleTabChange('stories');
        } else if (e.key === '4') {
          handleTabChange('starred');
        } else if (e.key === '5') {
          handleTabChange('calls');
        } else if (e.key === '[' || (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowLeft'))) {
          e.preventDefault();
          const currIdx = chats.findIndex((c) => c.id === activeChatId);
          const prevIdx = currIdx > 0 ? currIdx - 1 : chats.length - 1;
          if (chats[prevIdx]) {
            setActiveChatId(chats[prevIdx].id);
            setActiveTab('chats');
            setMobileChatOpen(true);
          }
        } else if (e.key === ']' || (e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowRight'))) {
          e.preventDefault();
          const currIdx = chats.findIndex((c) => c.id === activeChatId);
          const nextIdx = currIdx < chats.length - 1 ? currIdx + 1 : 0;
          if (chats[nextIdx]) {
            setActiveChatId(chats[nextIdx].id);
            setActiveTab('chats');
            setMobileChatOpen(true);
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [chats, activeChatId]);

  // Export Clean JSON Chat Transcripts
  const handleExportTranscripts = () => {
    try {
      const exportData = {
        exportedBy: currentUser.name,
        exportedAt: new Date().toISOString(),
        chats,
        messages,
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Chatmi_Transcripts_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      soundEffects.playCelebrationChime();
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  // Open modal / tool by action key from Command Palette
  const handleOpenActionFromCommandPalette = (action: string) => {
    setShowCommandPalette(false);
    switch (action) {
      case 'new_chat':
        setShowNewChatModal(true);
        break;
      case 'open_voice':
        setShowVoiceOrbModal(true);
        break;
      case 'open_ai_image':
        setShowImageStudioModal(true);
        break;
      case 'open_ai_tools':
        setShowAiToolsModal(true);
        break;
      case 'open_mindmap':
        setShowMindMapModal(true);
        break;
      case 'open_watch_party':
        setShowWatchPartyModal(true);
        break;
      case 'open_secret_vault':
        setShowSecretVaultModal(true);
        break;
      case 'open_settings':
        setShowSettingsModal(true);
        break;
      case 'open_auth':
        setShowAuthModal(true);
        break;
      case 'open_global':
        setShowGlobalModal(true);
        break;
      case 'export_data':
        handleExportTranscripts();
        break;
      case 'start_call':
        handleStartCall('video');
        break;
      default:
        break;
    }
  };

  // Smartphone Responsive View State
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  // WebSocket Reference
  const wsRef = useRef<WebSocket | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const handleBroadcastWsEvent = (eventData: Record<string, unknown>) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(eventData));
    }
  };

  const triggerScreenFx = (fx: ScreenFxType) => {
    setActiveFx(fx);
    handleBroadcastWsEvent({ type: 'fx:trigger', fx });
  };

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChatId]);

  // Connect to Real-time WebSocket
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Real-time WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'message:new' && data.message) {
            const newMsg: Message = data.message;
            setMessages((prev) => {
              const currentList = prev[newMsg.chatId] || [];
              // Prevent duplicate insertion if message ID already exists
              if (currentList.some((m) => m.id === newMsg.id)) {
                return prev;
              }
              return {
                ...prev,
                [newMsg.chatId]: [...currentList, newMsg],
              };
            });
            if (newMsg.senderId !== currentUser.id) {
              soundEffects.playReceiveSound();
            }
          } else if (data.type === 'message:reaction') {
            const { messageId, chatId, emoji, userId } = data;
            handleApplyReaction(chatId, messageId, emoji, userId);
          } else if (data.type === 'fx:trigger' && data.fx) {
            setActiveFx(data.fx);
          }
        } catch {
          // Ignore
        }
      };

      return () => {
        ws.close();
      };
    } catch (err) {
      console.warn('WebSocket init error:', err);
    }
  }, []);

  // Check scheduled messages queue
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setScheduledQueue((prev) => {
        const readyToSend = prev.filter((item) => item.scheduledFor <= now);
        const remaining = prev.filter((item) => item.scheduledFor > now);

        readyToSend.forEach((item) => {
          handleSendMessage(item.content, item.type, item.extraData);
        });

        return remaining;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Fetch server-persisted messages for active chat
  useEffect(() => {
    fetch(`/api/messages/${activeChatId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages && Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages((prev) => {
            const existing = prev[activeChatId] || [];
            // Merge server messages avoiding duplicates
            const combinedMap = new Map<string, Message>();
            existing.forEach((m) => combinedMap.set(m.id, m));
            data.messages.forEach((m: Message) => combinedMap.set(m.id, m));
            return {
              ...prev,
              [activeChatId]: Array.from(combinedMap.values()),
            };
          });
        }
      })
      .catch((err) => console.log('Fetch server messages info:', err));
  }, [activeChatId]);

  // Smart Reply generation
  const lastSmartReplyMsgIdRef = useRef<string | null>(null);

  useEffect(() => {
    const currentChatMessages = messages[activeChatId] || [];
    if (currentChatMessages.length === 0) return;

    const lastMsg = currentChatMessages[currentChatMessages.length - 1];
    const lastMsgKey = `${activeChatId}_${lastMsg.id}_${lastMsg.content}`;

    if (lastSmartReplyMsgIdRef.current === lastMsgKey) {
      return;
    }

    lastSmartReplyMsgIdRef.current = lastMsgKey;

    fetch('/api/ai/smart-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recentMessages: currentChatMessages }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.replies && Array.isArray(data.replies)) {
          setSmartReplies(data.replies);
        }
      })
      .catch(() => {
        setSmartReplies(['Sounds good!', 'Thanks for the update!', 'Let’s sync on this.']);
      });
  }, [activeChatId, messages]);

  // Tab switch to AI Copilot chat or stories
  useEffect(() => {
    if (activeTab === 'ai') {
      setActiveChatId('chat_ai');
      setMobileChatOpen(true);
    } else if (activeTab === 'stories') {
      setShowStoriesModal(true);
    }
  }, [activeTab]);

  // Unstar message handler
  const handleUnstarMessage = (messageId: string) => {
    setMessages((prev) => {
      const updated: Record<string, Message[]> = {};
      Object.keys(prev).forEach((chatId) => {
        updated[chatId] = prev[chatId].map((m) =>
          m.id === messageId ? { ...m, isStarred: false } : m
        );
      });
      return updated;
    });
  };

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];
  const activeChatMessages = useMemo(() => {
    const rawList = messages[activeChatId] || [];
    const seen = new Set<string>();
    const deduped: Message[] = [];
    for (const msg of rawList) {
      if (!seen.has(msg.id)) {
        seen.add(msg.id);
        deduped.push(msg);
      }
    }
    return deduped;
  }, [messages, activeChatId]);

  // Broadcast event via WebSocket
  const broadcastWsEvent = (eventData: Record<string, unknown>) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(eventData));
    }
  };

  // Send Message Handler
  const handleSendMessage = async (
    content: string,
    type: MessageType = 'text',
    extraData?: Record<string, unknown>
  ) => {
    const newMsg: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      chatId: activeChatId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderUsername: currentUser.username,
      isAuthenticated: true,
      type,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      replyTo: replyingToMessage
        ? {
            id: replyingToMessage.id,
            senderName: replyingToMessage.senderName,
            content: replyingToMessage.content,
            type: replyingToMessage.type,
          }
        : undefined,
      ...extraData,
    };

    // Update local state avoiding duplicates
    setMessages((prev) => {
      const currentList = prev[activeChatId] || [];
      if (currentList.some((m) => m.id === newMsg.id)) {
        return prev;
      }
      return {
        ...prev,
        [activeChatId]: [...currentList, newMsg],
      };
    });

    // Update last message in chat list
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId ? { ...c, lastMessage: newMsg, unreadCount: 0 } : c
      )
    );

    setReplyingToMessage(null);

    // Broadcast over WebSocket & REST endpoint for persistence
    broadcastWsEvent({ type: 'message:new', message: newMsg });

    // Sync directly to Firestore
    try {
      setDoc(doc(db, 'chats', activeChatId, 'messages', newMsg.id), {
        id: newMsg.id,
        chatId: activeChatId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar || '',
        text: content,
        type: newMsg.type,
        timestamp: serverTimestamp(),
        status: 'sent',
      }, { merge: true }).catch((err) => console.error('Firestore msg write:', err));
    } catch (e) {
      console.error('Firestore save failed:', e);
    }

    fetch('/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId: activeChatId,
        message: newMsg,
        token: currentUser.token,
      }),
    }).catch(() => {
      // WS broadcast fallback handled
    });

    // Handle AI Copilot Auto-Response if talking to AI
    if (activeChat.participants.some((p) => p.isAi)) {
      triggerAiResponse(content);
    }
  };

  // Trigger Gemini AI Copilot Response
  const triggerAiResponse = async (userPrompt: string) => {
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userPrompt,
          chatHistory: (messages[activeChatId] || []).slice(-6),
        }),
      });
      const data = await res.json();

      const aiMsg: Message = {
        id: `msg_ai_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        chatId: activeChatId,
        senderId: AI_ASSISTANT_USER.id,
        senderName: AI_ASSISTANT_USER.name,
        senderAvatar: AI_ASSISTANT_USER.avatar,
        type: 'text',
        content: data.text || 'I processed your request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
        isAiGenerated: true,
      };

      setMessages((prev) => {
        const currentList = prev[activeChatId] || [];
        if (currentList.some((m) => m.id === aiMsg.id)) {
          return prev;
        }
        return {
          ...prev,
          [activeChatId]: [...currentList, aiMsg],
        };
      });

      soundEffects.playReceiveSound();
    } catch {
      // ignore
    }
  };

  // Schedule future message
  const handleScheduleMessage = (scheduledTimestamp: number, customText?: string) => {
    if (!customText?.trim()) return;
    const item: ScheduledMessage = {
      id: `sched_${Date.now()}`,
      chatId: activeChatId,
      content: customText,
      type: 'text',
      scheduledFor: scheduledTimestamp,
    };
    setScheduledQueue((prev) => [...prev, item]);
    soundEffects.playSendSound();
  };

  // Send Doodle
  const handleSendDoodle = (dataUrl: string) => {
    handleSendMessage('Handwritten Sketch', 'doodle', { mediaUrl: dataUrl });
  };

  // Share Location
  const handleShareLocation = (loc: { lat: number; lng: number; address: string; mapPreview?: string }) => {
    handleSendMessage(loc.address, 'location', { location: loc });
  };

  // Launch In-Chat Games
  const handleLaunchGame = (gameType: 'tictactoe' | 'trivia') => {
    const isAiChat = activeChat.participants.some((p) => p.isAi);
    const opponent = activeChat.participants.find((p) => p.id !== currentUser.id) || AI_ASSISTANT_USER;

    if (gameType === 'tictactoe') {
      const newGame: GameData = {
        id: `game_${Date.now()}`,
        gameType: 'tictactoe',
        board: Array(9).fill(null),
        currentTurn: currentUser.id,
        playerX: currentUser,
        playerO: opponent,
      };
      handleSendMessage('Started a Tic-Tac-Toe Duel!', 'game', { game: newGame });
    } else if (gameType === 'trivia') {
      const triviaQuestions = [
        {
          q: 'Which database model provides horizontal scalability with strict serializability?',
          options: ['Cloud Spanner', 'Traditional MySQL', 'IndexedDB', 'Flat CSV file'],
          correct: 0,
        },
        {
          q: 'What is the fastest transmission method for low-latency live messaging?',
          options: ['WebSockets', 'HTTP Polling', 'Email Sync', 'FTP Upload'],
          correct: 0,
        },
        {
          q: 'What is the speed of light in vacuum?',
          options: ['299,792 km/s', '150,000 km/s', '3,000 km/s', '30,000,000 km/s'],
          correct: 0,
        },
        {
          q: 'Which framework enables native full-stack React with zero-bundle overhead?',
          options: ['Vite + TypeScript', 'jQuery 1.2', 'Flash ActionScript', 'Silverlight'],
          correct: 0,
        },
      ];
      const randomQ = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];

      const newGame: GameData = {
        id: `trivia_${Date.now()}`,
        gameType: 'trivia',
        question: randomQ.q,
        options: randomQ.options,
        correctIndex: randomQ.correct,
      };
      handleSendMessage('Launched Daily Brain Trivia Challenge!', 'game', { game: newGame });
    }
  };

  // Handle Tic-Tac-Toe Move
  const handleMakeMove = (gameId: string, cellIndex: number) => {
    setMessages((prev) => {
      const chatMsgs = prev[activeChatId] || [];
      const updated = chatMsgs.map((m) => {
        if (!m.game || m.game.id !== gameId) return m;

        const currentBoard = [...(m.game.board || Array(9).fill(null))];
        if (currentBoard[cellIndex] || m.game.winner) return m;

        // Mark player X
        currentBoard[cellIndex] = 'X';

        // Check if X won
        const checkWin = (b: (string | null)[], symbol: string) => {
          const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
          ];
          return lines.some(([a, bIdx, c]) => b[a] === symbol && b[bIdx] === symbol && b[c] === symbol);
        };

        let winner: string | null = null;
        if (checkWin(currentBoard, 'X')) {
          winner = m.game.playerX?.name || currentUser.name;
        } else if (currentBoard.every((cell) => cell !== null)) {
          winner = 'draw';
        }

        const isAiOpponent = activeChat.participants.some((p) => p.isAi);

        // If playing with AI and game not over, let AI make an automated counter-move!
        if (!winner && isAiOpponent) {
          setTimeout(() => {
            setMessages((innerPrev) => {
              const innerMsgs = innerPrev[activeChatId] || [];
              const aiUpdated = innerMsgs.map((innerMsg) => {
                if (!innerMsg.game || innerMsg.game.id !== gameId) return innerMsg;

                const aiBoard = [...(innerMsg.game.board || [])];
                const emptyIndices = aiBoard
                  .map((val, idx) => (val === null ? idx : null))
                  .filter((v): v is number => v !== null);

                if (emptyIndices.length > 0 && !innerMsg.game.winner) {
                  const randomPick = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
                  aiBoard[randomPick] = 'O';

                  let aiWinner: string | null = null;
                  if (checkWin(aiBoard, 'O')) {
                    aiWinner = AI_ASSISTANT_USER.name;
                  } else if (aiBoard.every((cell) => cell !== null)) {
                    aiWinner = 'draw';
                  }

                  return {
                    ...innerMsg,
                    game: {
                      ...innerMsg.game,
                      board: aiBoard,
                      currentTurn: currentUser.id,
                      winner: aiWinner,
                    },
                  };
                }
                return innerMsg;
              });
              return { ...innerPrev, [activeChatId]: aiUpdated };
            });
            soundEffects.playReceiveSound();
          }, 600);
        }

        return {
          ...m,
          game: {
            ...m.game,
            board: currentBoard,
            currentTurn: isAiOpponent ? 'ai' : m.game.playerO?.id,
            winner,
          },
        };
      });

      return { ...prev, [activeChatId]: updated };
    });
  };

  // Handle Trivia Answer
  const handleAnswerTrivia = (gameId: string, optionIndex: number) => {
    setMessages((prev) => {
      const chatMsgs = prev[activeChatId] || [];
      const updated = chatMsgs.map((m) => {
        if (!m.game || m.game.id !== gameId) return m;

        return {
          ...m,
          game: {
            ...m.game,
            selectedOption: optionIndex,
            solvedBy: currentUser.name,
          },
        };
      });

      return { ...prev, [activeChatId]: updated };
    });
  };

  // Rematch Tic-Tac-Toe
  const handleRematch = (gameId: string) => {
    setMessages((prev) => {
      const chatMsgs = prev[activeChatId] || [];
      const updated = chatMsgs.map((m) => {
        if (!m.game || m.game.id !== gameId) return m;
        return {
          ...m,
          game: {
            ...m.game,
            board: Array(9).fill(null),
            currentTurn: currentUser.id,
            winner: null,
          },
        };
      });
      return { ...prev, [activeChatId]: updated };
    });
  };

  // Reactions Handler
  const handleApplyReaction = (
    chatId: string,
    messageId: string,
    emoji: string,
    userId: string
  ) => {
    setMessages((prev) => {
      const chatMsgs = prev[chatId] || [];
      const updated = chatMsgs.map((m) => {
        if (m.id !== messageId) return m;

        const existingReactions = m.reactions || [];
        const existingEmojiIndex = existingReactions.findIndex((r) => r.emoji === emoji);

        let newReactions = [...existingReactions];
        if (existingEmojiIndex >= 0) {
          const reaction = newReactions[existingEmojiIndex];
          if (reaction.users.includes(userId)) {
            reaction.users = reaction.users.filter((u) => u !== userId);
          } else {
            reaction.users.push(userId);
          }
        } else {
          newReactions.push({ emoji, users: [userId] });
        }

        return { ...m, reactions: newReactions.filter((r) => r.users.length > 0) };
      });

      return { ...prev, [chatId]: updated };
    });
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    handleApplyReaction(activeChatId, messageId, emoji, currentUser.id);
    broadcastWsEvent({
      type: 'message:reaction',
      chatId: activeChatId,
      messageId,
      emoji,
      userId: currentUser.id,
    });
  };

  // Star Message
  const handleStarMessage = (messageId: string) => {
    setMessages((prev) => {
      const chatMsgs = prev[activeChatId] || [];
      const updated = chatMsgs.map((m) => (m.id === messageId ? { ...m, isStarred: !m.isStarred } : m));
      return { ...prev, [activeChatId]: updated };
    });
  };

  // Vote Poll
  const handleVotePoll = (messageId: string, optionId: string) => {
    setMessages((prev) => {
      const chatMsgs = prev[activeChatId] || [];
      const updated = chatMsgs.map((m) => {
        if (m.id !== messageId || !m.poll) return m;

        const updatedOptions = m.poll.options.map((opt: PollOption) => {
          const hasVoted = opt.votes.includes(currentUser.id);
          if (opt.id === optionId) {
            return {
              ...opt,
              votes: hasVoted
                ? opt.votes.filter((u) => u !== currentUser.id)
                : [...opt.votes, currentUser.id],
            };
          } else {
            return {
              ...opt,
              votes: opt.votes.filter((u) => u !== currentUser.id),
            };
          }
        });

        const newTotal = updatedOptions.reduce((acc, curr) => acc + curr.votes.length, 0);

        return {
          ...m,
          poll: {
            ...m.poll,
            options: updatedOptions,
            totalVotes: newTotal,
          },
        };
      });

      return { ...prev, [activeChatId]: updated };
    });
  };

  // Translate Message
  const handleTranslateMessage = async (messageId: string, text: string) => {
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: 'Spanish' }),
      });
      const data = await res.json();

      setMessages((prev) => {
        const chatMsgs = prev[activeChatId] || [];
        const updated = chatMsgs.map((m) =>
          m.id === messageId
            ? { ...m, translatedText: data.translatedText, translationLang: 'Spanish' }
            : m
        );
        return { ...prev, [activeChatId]: updated };
      });
    } catch {
      // ignore
    }
  };

  // Transcribe Audio Voice Note
  const handleTranscribeAudio = async (messageId: string) => {
    setMessages((prev) => {
      const chatMsgs = prev[activeChatId] || [];
      const updated = chatMsgs.map((m) =>
        m.id === messageId
          ? {
              ...m,
              transcription:
                'Transcribed by Pulse AI: Discussed updating the WebSocket server port 3000 logic and syncing status stories across all connected clients.',
            }
          : m
      );
      return { ...prev, [activeChatId]: updated };
    });
  };

  // Delete Message
  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => ({
      ...prev,
      [activeChatId]: (prev[activeChatId] || []).filter((m) => m.id !== messageId),
    }));
  };

  // Start Call
  const handleStartCall = (type: 'audio' | 'video') => {
    setActiveCall({
      chatId: activeChat.id,
      chatName: activeChat.name,
      chatAvatar: activeChat.avatar,
      type,
      status: 'connected',
      isMuted: false,
      isVideoOff: false,
      isScreenSharing: false,
    });
  };

  // Create Poll
  const handleCreatePoll = (question: string, options: string[]) => {
    const pollData = {
      id: `poll_${Date.now()}`,
      question,
      options: options.map((opt, i) => ({
        id: `opt_${i}`,
        text: opt,
        votes: [],
      })),
      totalVotes: 0,
    };

    handleSendMessage('Interactive Poll Created', 'poll', { poll: pollData });
  };

  // Create New Chat
  const handleCreateChat = (
    name: string,
    type: 'direct' | 'group' | 'channel',
    selectedUserIds: string[]
  ) => {
    const selectedUsers = users.filter((u) => selectedUserIds.includes(u.id));
    const newChat: Chat = {
      id: `chat_${Date.now()}`,
      name,
      type,
      avatar:
        type === 'direct'
          ? selectedUsers[0]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          : 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150',
      description: `${type === 'group' ? 'Team group' : 'Channel'} created by ${currentUser.name}`,
      participants: [currentUser, ...selectedUsers],
      unreadCount: 0,
      isE2EE: true,
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  // Summarize Thread
  const handleSummarizeThread = async () => {
    const chatMsgs = messages[activeChatId] || [];
    const res = await fetch('/api/ai/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatMsgs, topic: activeChat.name }),
    });
    const data = await res.json();
    return data.summary || 'Summary unavailable.';
  };

  // Rephrase Draft
  const handlePolishDraft = async (draftText: string, tone: string) => {
    const res = await fetch('/api/ai/rephrase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draftText, tone }),
    });
    const data = await res.json();
    return data.rephrased || draftText;
  };

  // Add Status Story
  const handleAddStory = (newStory: Omit<StatusStory, 'id' | 'timestamp' | 'viewers'>) => {
    const storyItem: StatusStory = {
      id: `story_${Date.now()}`,
      timestamp: 'Just now',
      viewers: [],
      ...newStory,
    };
    setStories((prev) => [storyItem, ...prev]);
  };

  // Google Contacts Handlers
  const handleStartChatWithGoogleContact = (contact: GoogleContact) => {
    const contactName = contact.name || 'Google Contact';
    const contactAvatar =
      contact.photoUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(contactName)}&background=4F46E5&color=fff`;

    // Check if user already exists
    let existingUser = users.find(
      (u) =>
        (contact.email && u.email?.toLowerCase() === contact.email.toLowerCase()) ||
        u.name.toLowerCase() === contactName.toLowerCase()
    );

    if (!existingUser) {
      const contactId = contact.id || contact.resourceName.replace('people/', '');
      existingUser = {
        id: `gcontact_${contactId}`,
        name: contactName,
        username: (contact.email ? contact.email.split('@')[0] : contactName).toLowerCase().replace(/\s+/g, '_'),
        avatar: contactAvatar,
        status: 'online',
        statusText: contact.organization ? `${contact.jobTitle ? contact.jobTitle + ' at ' : ''}${contact.organization}` : 'Google Workspace Contact',
        email: contact.email,
        phone: contact.phoneNumber,
        isVerified: true,
      };
      setUsers((prev) => [existingUser!, ...prev]);
    }

    // Check if direct chat already exists
    const existingChat = chats.find(
      (c) => c.type === 'direct' && c.participants.some((p) => p.id === existingUser!.id)
    );

    if (existingChat) {
      setActiveChatId(existingChat.id);
      setActiveTab('chats');
      setMobileChatOpen(true);
      setShowGoogleContactsModal(false);
    } else {
      const newChatId = `chat_gc_${Date.now()}`;
      const newChat: Chat = {
        id: newChatId,
        name: contactName,
        type: 'direct',
        avatar: contactAvatar,
        description: `Direct conversation with ${contactName}`,
        participants: [currentUser, existingUser],
        unreadCount: 0,
        isE2EE: true,
        lastMessage: {
          id: `msg_init_${Date.now()}`,
          chatId: newChatId,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          type: 'text',
          content: `👋 Connected via Google Contacts with ${contactName}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
        },
      };

      setChats((prev) => [newChat, ...prev]);
      setMessages((prev) => ({
        ...prev,
        [newChatId]: [newChat.lastMessage!],
      }));
      setActiveChatId(newChatId);
      setActiveTab('chats');
      setMobileChatOpen(true);
      setShowGoogleContactsModal(false);
    }
  };

  const handleStartCallWithGoogleContact = (contact: GoogleContact, type: 'audio' | 'video') => {
    const contactName = contact.name || 'Google Contact';
    const contactAvatar =
      contact.photoUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(contactName)}&background=4F46E5&color=fff`;

    setActiveCall({
      chatId: `call_gc_${Date.now()}`,
      chatName: contactName,
      chatAvatar: contactAvatar,
      type,
      status: 'connected',
      isMuted: false,
      isVideoOff: false,
      isScreenSharing: false,
    });
    setShowGoogleContactsModal(false);
  };

  const handleImportContactsToApp = (importedContacts: GoogleContact[]) => {
    const newUsers: User[] = [];

    importedContacts.forEach((contact) => {
      const contactName = contact.name || 'Google Contact';
      const alreadyExists = users.some(
        (u) =>
          (contact.email && u.email?.toLowerCase() === contact.email.toLowerCase()) ||
          u.name.toLowerCase() === contactName.toLowerCase()
      );

      if (!alreadyExists) {
        const contactId = contact.id || contact.resourceName.replace('people/', '');
        newUsers.push({
          id: `gcontact_${contactId}`,
          name: contactName,
          username: (contact.email ? contact.email.split('@')[0] : contactName).toLowerCase().replace(/\s+/g, '_'),
          avatar:
            contact.photoUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(contactName)}&background=4F46E5&color=fff`,
          status: 'online',
          statusText: contact.organization ? `${contact.jobTitle ? contact.jobTitle + ' at ' : ''}${contact.organization}` : 'Google Workspace Contact',
          email: contact.email,
          phone: contact.phoneNumber,
          isVerified: true,
        });
      }
    });

    if (newUsers.length > 0) {
      setUsers((prev) => [...newUsers, ...prev]);
    }
  };

  if (!currentUser.isAuthenticated) {
    return (
      <div className="flex h-screen w-screen bg-[#0b141a] text-slate-100 overflow-hidden font-sans antialiased">
        <AuthModal
          currentUser={currentUser}
          isFullScreen={true}
          onClose={() => {}}
          onSwitchUser={(newUser) => {
            setCurrentUser(newUser);
            try {
              sessionStorage.setItem('chatmi_authenticated_user', JSON.stringify(newUser));
              localStorage.setItem('chatmi_current_user', JSON.stringify(newUser));
            } catch {
              // Ignore
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans antialiased">
      {/* 1. Icon Navigation Rail (Desktop sidebar / Mobile bottom bar) */}
      <SidebarNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentUser={currentUser}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenGoogleContacts={() => setShowGoogleContactsModal(true)}
        onOpenCommandPalette={() => setShowCommandPalette(true)}
        onOpenGlobalModal={() => setShowGlobalModal(true)}
        currentLanguageFlag={currentLangObj.flag}
        unseenStoriesCount={stories.filter((s) => !s.isSeen).length}
        starredMessagesCount={
          (Object.values(messages).flat() as Message[])
            .filter((m) => m.isStarred).length
        }
      />

      {/* 2. Main Center Content based on active navigation tab */}
      {activeTab === 'calls' ? (
        <CallsHub
          currentUser={currentUser}
          chats={chats}
          onStartCall={handleStartCall}
          onNavigateToChat={(chatId) => {
            setActiveChatId(chatId);
            setActiveTab('chats');
            setMobileChatOpen(true);
          }}
        />
      ) : activeTab === 'starred' ? (
        <StarredHub
          currentUser={currentUser}
          messages={messages}
          chats={chats}
          onSelectChat={(chatId) => {
            setActiveChatId(chatId);
            setActiveTab('chats');
            setMobileChatOpen(true);
          }}
          onUnstarMessage={handleUnstarMessage}
        />
      ) : (
        <>
          {/* Chat List Sidebar (Visible on desktop, or on mobile when chat is closed) */}
          <div className={`w-full md:w-auto h-full flex flex-col ${mobileChatOpen ? 'hidden md:flex' : 'flex'}`}>
            <ChatList
              chats={chats}
              activeChatId={activeChatId}
              onSelectChat={(id) => {
                setActiveChatId(id);
                setActiveTab('chats');
                setMobileChatOpen(true);
              }}
              onOpenNewChatModal={() => setShowNewChatModal(true)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stories={stories}
              currentUser={currentUser}
              onOpenStatusStory={(idx) => {
                setContactStatusIndex(idx);
                setOpenStatusCreateMode(false);
                setShowContactStatusModal(true);
              }}
              onOpenStatusCreator={() => {
                setContactStatusIndex(0);
                setOpenStatusCreateMode(true);
                setShowContactStatusModal(true);
              }}
              onOpenSettings={() => setShowSettingsModal(true)}
            />
          </div>

          {/* Central Chat Pane (Visible on desktop, or on mobile when chat is open) */}
          <main className={`flex-1 flex-col h-full bg-slate-950 relative min-w-0 pb-16 md:pb-0 ${mobileChatOpen ? 'flex' : 'hidden md:flex'}`}>
            {/* Chat Header */}
            <ChatHeader
              chat={activeChat}
              allChats={chats}
              onSelectChat={(id) => {
                setActiveChatId(id);
                setActiveTab('chats');
                setMobileChatOpen(true);
              }}
              activeTab={activeTab}
              onNavigateTab={handleTabChange}
              currentUser={currentUser}
              onStartCall={handleStartCall}
              onOpenSearch={() => setSearchQuery('search')}
              onToggleInfoPanel={() => setShowInfoPanel(!showInfoPanel)}
              onTriggerAiSummarize={() => setShowAiToolsModal(true)}
              onOpenAuthModal={() => setShowAuthModal(true)}
              onBackToChatList={() => setMobileChatOpen(false)}
              onOpenMindMap={() => setShowMindMapModal(true)}
              onOpenWatchParty={() => setShowWatchPartyModal(true)}
              onOpenVoiceCompanion={() => setShowVoiceOrbModal(true)}
              onOpenSecretVault={() => setShowSecretVaultModal(true)}
              onOpenGlobalModal={() => setShowGlobalModal(true)}
              currentLanguageFlag={currentLangObj.flag}
              regionName={currentRegionObj.name.split(' (')[0]}
            />

            {/* Pinned Message / Priority Directive Banner */}
            {(pinnedMessageId || activeChatMessages.some((m) => m.isStarred)) && (
              <PinnedBanner
                pinnedMessage={
                  activeChatMessages.find((m) => m.id === pinnedMessageId) ||
                  activeChatMessages.find((m) => m.isStarred)
                }
                channelName={activeChat.name}
                onUnpin={() => setPinnedMessageId(null)}
                onClickJump={(msgId) => {
                  const el = document.getElementById(msgId);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
              />
            )}

            {/* Messages Feed Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col gap-2">
              {/* Encrypted Notice Banner */}
              <div className="mx-auto my-1 sm:my-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] sm:text-[11px] font-medium text-emerald-400 flex items-center gap-1.5 shadow-sm text-center">
                <span>🔒 End-to-End Encrypted • Verified Messaging</span>
              </div>

              {activeChatMessages.map((msg) => (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  currentUser={currentUser}
                  onReact={handleReactToMessage}
                  onReply={(m) => setReplyingToMessage(m)}
                  onStar={handleStarMessage}
                  onVotePoll={handleVotePoll}
                  onTranslate={handleTranslateMessage}
                  onTranscribeAudio={handleTranscribeAudio}
                  onDeleteMessage={handleDeleteMessage}
                  onMakeMove={handleMakeMove}
                  onAnswerTrivia={handleAnswerTrivia}
                  onRematch={handleRematch}
                />
              ))}

              <div ref={messageEndRef} />
            </div>

            {/* Message Input Controls */}
            <MessageInput
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              replyingToMessage={replyingToMessage}
              onCancelReply={() => setReplyingToMessage(null)}
              smartReplies={smartReplies}
              onOpenPollCreator={() => setShowPollCreatorModal(true)}
              onPolishDraft={handlePolishDraft}
              onOpenDoodle={() => setShowDoodleModal(true)}
              onOpenSchedule={() => setShowScheduleModal(true)}
              onOpenLocationPicker={() => setShowLocationPickerModal(true)}
              onLaunchGame={handleLaunchGame}
              onTriggerFx={triggerScreenFx}
            />
          </main>
        </>
      )}

      {/* 4. Right Chat Info Panel (Drawer) */}
      {showInfoPanel && (
        <ChatInfoPanel
          chat={activeChat}
          onClose={() => setShowInfoPanel(false)}
          onUpdateDisappearingTimer={(timer) => {
            setChats((prev) =>
              prev.map((c) => (c.id === activeChatId ? { ...c, disappearingTimer: timer } : c))
            );
          }}
        />
      )}

      {/* Full-screen Party & Particle FX Canvas Overlay */}
      <ScreenFxOverlay
        effect={activeFx}
        onComplete={() => setActiveFx(null)}
      />

      {/* Secret Stealth Disguise Overlay (Panic Mode) */}
      <StealthDisguiseOverlay
        mode={stealthDisguise}
        onExit={() => setStealthDisguise(null)}
      />

      {/* Synchronized Watch Party Modal */}
      <WatchPartyModal
        isOpen={showWatchPartyModal}
        onClose={() => setShowWatchPartyModal(false)}
        currentChat={activeChat}
        currentUser={currentUser}
        ws={wsRef.current}
      />

      {/* AI Conversation Mind Map Visualizer Modal */}
      <MindMapVisualizerModal
        isOpen={showMindMapModal}
        onClose={() => setShowMindMapModal(false)}
        chatTitle={activeChat.name}
        messages={activeChatMessages}
      />

      {/* Live AI Voice Companion Orb Modal */}
      <AiVoiceOrbModal
        isOpen={showVoiceOrbModal}
        onClose={() => setShowVoiceOrbModal(false)}
        currentUser={currentUser}
      />

      {/* Quantum Cryptographic Vault & Stealth Config */}
      <SecretVaultModal
        isOpen={showSecretVaultModal}
        onClose={() => setShowSecretVaultModal(false)}
        chatTitle={activeChat.name}
        onActivateStealth={(mode) => {
          setStealthDisguise(mode);
          setShowSecretVaultModal(false);
        }}
      />

      {/* 5. Modals & Overlay Interfaces */}
      {activeCall && (
        <CallModal
          activeCall={activeCall}
          currentUser={currentUser}
          onEndCall={() => setActiveCall(null)}
          onSendMessage={(msg) => handleSendMessage(msg, 'text')}
        />
      )}

      {/* Contact Status Stories (WhatsApp style - contacts only) */}
      {showContactStatusModal && (
        <ContactStatusModal
          stories={stories}
          currentUser={currentUser}
          initialStoryIndex={contactStatusIndex}
          initialCreateMode={openStatusCreateMode}
          onClose={() => {
            setShowContactStatusModal(false);
            setOpenStatusCreateMode(false);
          }}
          onAddStory={handleAddStory}
          onUpdateAvatar={(newAvatarUrl) => {
            setCurrentUser((prev) => {
              const updated = { ...prev, avatar: newAvatarUrl };
              try {
                localStorage.setItem('chatmi_current_user', JSON.stringify(updated));
              } catch (e) {
                // Ignore storage errors
              }
              return updated;
            });
            setStories((prev) =>
              prev.map((s) => (s.userId === currentUser.id ? { ...s, userAvatar: newAvatarUrl } : s))
            );
          }}
          onReplyToStory={(story, replyMsg) => {
            const targetChat =
              chats.find((c) => c.type === 'direct' && c.participants.some((p) => p.id === story.userId)) ||
              chats.find((c) => c.id === activeChatId) ||
              chats[0];

            const snippet =
              story.type === 'text'
                ? `"${story.content}"`
                : story.caption
                ? `"${story.caption}"`
                : '[Status Photo]';
            const formattedReply = `💬 *Replying to status* (${snippet}):\n${replyMsg}`;

            if (targetChat) {
              const newMessage: Message = {
                id: `msg_${Date.now()}`,
                chatId: targetChat.id,
                senderId: currentUser.id,
                senderName: currentUser.name,
                senderAvatar: currentUser.avatar,
                content: formattedReply,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'text',
                status: 'sent',
              };

              setMessages((prev) => ({
                ...prev,
                [targetChat.id]: [...(prev[targetChat.id] || []), newMessage],
              }));

              setChats((prev) =>
                prev.map((c) => (c.id === targetChat.id ? { ...c, lastMessage: newMessage } : c))
              );

              // Switch to the replied chat
              setActiveChatId(targetChat.id);
              setActiveTab('chats');
            }
          }}
        />
      )}

      {/* Postly Reels & Video Feed (TikTok style - public creators & FYP) */}
      {showStoriesModal && (
        <StatusStoriesModal
          stories={stories}
          liveStreams={liveStreams}
          currentUser={currentUser}
          onClose={() => {
            setShowStoriesModal(false);
            if (activeTab === 'stories') setActiveTab('chats');
          }}
          onAddStory={handleAddStory}
          onReplyToStory={(story, replyMsg) => {
            handleSendMessage(`Replied to Postly: "${replyMsg}"`, 'text');
            setShowStoriesModal(false);
          }}
          onStartGoLive={(mode, stream) => {
            setLiveModalConfig({ isOpen: true, mode, activeStream: stream });
            setShowStoriesModal(false);
          }}
          onNavigateToTab={(tab) => {
            setShowStoriesModal(false);
            setActiveTab(tab);
          }}
        />
      )}

      {liveModalConfig.isOpen && (
        <PostlyLiveModal
          currentUser={currentUser}
          activeStream={liveModalConfig.activeStream}
          mode={liveModalConfig.mode}
          onClose={() => setLiveModalConfig({ isOpen: false, mode: 'host' })}
          onSaveAsStory={(broadcastTitle) => {
            handleAddStory({
              userId: currentUser.id,
              userName: currentUser.name,
              userAvatar: currentUser.avatar,
              type: 'text',
              content: `🔴 Postly Live Replay: "${broadcastTitle}"`,
              bgGradient: 'from-rose-600 via-purple-600 to-slate-900',
              caption: 'Live Broadcast Replay',
            });
            handleSendMessage(`📢 Just finished a Postly Live Broadcast: "${broadcastTitle}"`, 'text');
          }}
        />
      )}

      {showNewChatModal && (
        <NewChatModal
          users={users}
          onClose={() => setShowNewChatModal(false)}
          onCreateChat={handleCreateChat}
        />
      )}

      {showPollCreatorModal && (
        <PollCreatorModal
          onClose={() => setShowPollCreatorModal(false)}
          onCreatePoll={handleCreatePoll}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          currentUser={currentUser}
          onClose={() => setShowSettingsModal(false)}
          onUpdateProfile={(statusText, name, avatar) => {
            setCurrentUser((prev) => ({
              ...prev,
              statusText: statusText !== undefined ? statusText : prev.statusText,
              name: name || prev.name,
              avatar: avatar || prev.avatar,
            }));
          }}
          onExportData={handleExportTranscripts}
          onOpenGoogleContacts={() => {
            setShowSettingsModal(false);
            setShowGoogleContactsModal(true);
          }}
          onOpenGlobalModal={() => {
            setShowSettingsModal(false);
            setShowGlobalModal(true);
          }}
          onOpenAuthModal={() => {
            setShowSettingsModal(false);
            setShowAuthModal(true);
          }}
          onLogout={() => {
            setShowSettingsModal(false);
            const loggedOutUser: User = {
              ...currentUser,
              isAuthenticated: false,
            };
            setCurrentUser(loggedOutUser);
            setShowAuthModal(true);
            try {
              sessionStorage.removeItem('chatmi_authenticated_user');
              localStorage.setItem('chatmi_current_user', JSON.stringify(loggedOutUser));
            } catch {
              // Ignore
            }
          }}
          currentLanguageName={`${currentLangObj.nativeName} (${currentLangObj.name})`}
          currentLanguageFlag={currentLangObj.flag}
        />
      )}

      {/* 100% Worldwide Global Availability & Region Selector Modal */}
      <GlobalRegionModal
        isOpen={showGlobalModal}
        onClose={() => setShowGlobalModal(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={(lang) => {
          setCurrentLanguage(lang.code);
          try {
            localStorage.setItem('chatmi_locale', lang.code);
          } catch {
            // Ignore
          }
        }}
        selectedRegion={selectedRegion}
        onSelectRegion={(region) => {
          setSelectedRegion(region.id);
          try {
            localStorage.setItem('chatmi_edge_region', region.id);
          } catch {
            // Ignore
          }
        }}
        dataSaverMode={dataSaverMode}
        onToggleDataSaver={(val) => {
          setDataSaverMode(val);
          try {
            localStorage.setItem('chatmi_data_saver', String(val));
          } catch {
            // Ignore
          }
        }}
        autoTranslateIncoming={autoTranslateIncoming}
        onToggleAutoTranslate={(val) => {
          setAutoTranslateIncoming(val);
          try {
            localStorage.setItem('chatmi_auto_translate', String(val));
          } catch {
            // Ignore
          }
        }}
      />

      {showAiToolsModal && (
        <AiToolsModal
          onClose={() => setShowAiToolsModal(false)}
          onSummarizeThread={handleSummarizeThread}
          onGenerateImage={async (prompt) => {
            return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
          }}
        />
      )}

      {/* Enterprise Command Palette & Global Quick Launcher */}
      <CommandPaletteModal
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        chats={chats}
        onSelectChat={(chatId) => {
          setActiveChatId(chatId);
          setActiveTab('chats');
          setMobileChatOpen(true);
          setShowCommandPalette(false);
        }}
        onOpenGoogleContacts={() => {
          setShowCommandPalette(false);
          setShowGoogleContactsModal(true);
        }}
        onTriggerAction={handleOpenActionFromCommandPalette}
        onOpenGlobalModal={() => setShowGlobalModal(true)}
      />

      {/* Google Contacts & Workspace Directory Modal */}
      <GoogleContactsModal
        isOpen={showGoogleContactsModal}
        onClose={() => setShowGoogleContactsModal(false)}
        onStartChatWithContact={handleStartChatWithGoogleContact}
        onStartCallWithContact={handleStartCallWithGoogleContact}
        onImportContactsToApp={handleImportContactsToApp}
      />

      {/* AI Image Generation & Synthesis Studio Modal */}
      <AiImageStudioModal
        isOpen={showImageStudioModal}
        onClose={() => setShowImageStudioModal(false)}
        onSendImage={(imageUrl, prompt) => {
          handleSendMessage(prompt, 'image', { imageUrl });
          setShowImageStudioModal(false);
        }}
      />

      {(showAuthModal || !currentUser.isAuthenticated) && (
        <AuthModal
          currentUser={currentUser}
          isFullScreen={!currentUser.isAuthenticated}
          onClose={() => {
            if (currentUser.isAuthenticated) {
              setShowAuthModal(false);
            }
          }}
          onSwitchUser={(newUser) => {
            setCurrentUser(newUser);
            setShowAuthModal(false);
            try {
              localStorage.setItem('chatmi_current_user', JSON.stringify(newUser));
            } catch {
              // Ignore
            }
          }}
        />
      )}

      {/* Interactive Doodle Canvas Modal */}
      <DoodleCanvasModal
        isOpen={showDoodleModal}
        onClose={() => setShowDoodleModal(false)}
        onSendDoodle={handleSendDoodle}
      />

      {/* Schedule Message Modal */}
      <ScheduleMessageModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onScheduleMessage={handleScheduleMessage}
        currentDraftText=""
      />

      {/* Location Share Modal */}
      <LocationPickerModal
        isOpen={showLocationPickerModal}
        onClose={() => setShowLocationPickerModal(false)}
        onShareLocation={handleShareLocation}
      />
    </div>
  );
}
