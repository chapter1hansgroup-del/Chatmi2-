export type UserStatus = 'online' | 'offline' | 'away' | 'dnd';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: UserStatus;
  statusText?: string;
  lastSeen?: string;
  role?: 'admin' | 'member';
  isAi?: boolean;
  token?: string;
  isAuthenticated?: boolean;
  isVerified?: boolean;
  verificationType?: 'individual' | 'company';
  email?: string;
  phone?: string;
  phoneNumber?: string;
  countryCode?: string;
  passkeyId?: string;
}

export type MessageType =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'file'
  | 'poll'
  | 'location'
  | 'code'
  | 'sticker'
  | 'gif'
  | 'doodle'
  | 'game'
  | 'google_form';

export interface GameData {
  id: string;
  gameType: 'tictactoe' | 'trivia';
  board?: (string | null)[]; // 9 cells for tic-tac-toe ('X', 'O', null)
  currentTurn?: string; // userId
  winner?: string | 'draw' | null;
  playerX?: { id: string; name: string };
  playerO?: { id: string; name: string };
  question?: string;
  options?: string[];
  correctIndex?: number;
  selectedOption?: number;
  solvedBy?: string;
}

export interface ScheduledMessage {
  id: string;
  chatId: string;
  content: string;
  type: MessageType;
  scheduledFor: number; // timestamp in ms
  scheduledTime?: number;
  mediaUrl?: string;
  extraData?: Record<string, unknown>;
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // user IDs
}

export interface PollData {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  allowMultiple?: boolean;
}

export interface MessageReaction {
  emoji: string;
  users: string[]; // user IDs
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  type: MessageType;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  audioDuration?: number; // in seconds
  poll?: PollData;
  game?: GameData;
  googleForm?: {
    formId: string;
    title: string;
    description?: string;
    responderUri: string;
    editUri?: string;
    questionsCount?: number;
  };
  codeLanguage?: string;
  location?: { lat: number; lng: number; address: string; mapPreview?: string };
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
    type: MessageType;
  };
  reactions?: MessageReaction[];
  isStarred?: boolean;
  isEdited?: boolean;
  isAiGenerated?: boolean;
  isAuthenticated?: boolean;
  senderUsername?: string;
  translatedText?: string;
  translationLang?: string;
  transcription?: string;
  expiresAt?: number; // timestamp when self-destructs
  disappearingDuration?: number; // duration in seconds
}

export type ChatType = 'direct' | 'group' | 'channel';

export interface Chat {
  id: string;
  name: string;
  type: ChatType;
  avatar: string;
  description?: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned?: boolean;
  isArchived?: boolean;
  isE2EE?: boolean;
  disappearingTimer?: number; // 0 = off, else hours/days
  pinnedMessageId?: string;
  createdTime?: string;
  topic?: string;
}

export interface StatusStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  timestamp: string;
  type: 'text' | 'image';
  content: string; // text or image URL
  bgGradient?: string;
  caption?: string;
  viewers: string[];
  isSeen?: boolean;
}

export interface LiveStreamComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface LiveStream {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  category?: string;
  viewerCount: number;
  startedAt: string;
  isLive: boolean;
  coverImage?: string;
}

export interface PostlyComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userStatus?: UserStatus;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  emojiReactions?: { emoji: string; count: number; reactedByMe?: boolean }[];
}

export interface PostlyAnalytics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  completionRate: number; // e.g. 88%
  watchTimeSeconds: number;
  audienceReach: string; // e.g. "+42% from For You"
  progressStatus: 'Trending 🔥' | 'Growing 📈' | 'Viral 🚀' | 'Published 🟢';
}

export interface PostlyVideo {
  id: string;
  userId: string;
  userName: string;
  userUsername: string;
  userAvatar: string;
  userStatus: UserStatus;
  isFollowing?: boolean;
  videoUrl?: string;
  coverImage?: string;
  photos?: string[]; // Multi-photo carousel gallery for Postly posts
  bgGradient?: string;
  caption: string;
  hashtags?: string[];
  audioTrack?: string;
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  commentsCount: number;
  comments: PostlyComment[];
  shares: number;
  downloads?: number;
  views: number;
  supportReceived: number; // Gifts/Tips support amount
  postedAt: string;
  isVerified?: boolean;
  verificationType?: 'individual' | 'company';
  analytics?: PostlyAnalytics;
  isSponsored?: boolean;
  sponsorName?: string;
  sponsorTagline?: string;
  sponsorUrl?: string;
  sponsorCta?: string;
  sponsorCategory?: string;
  sponsorBadge?: 'Sponsored' | 'Promoted' | 'Featured Partner';
  adDisclosure?: string;
}

export interface PostlyVerificationApplication {
  id: string;
  applicantType: 'individual' | 'company';
  fullName: string;
  username: string;
  category: string;
  email: string;
  documentType: string;
  documentProof?: string;
  websiteUrl?: string;
  socialLinks?: string;
  reason: string;
  feeAmount: number; // $2 for individual, $5 for company
  paymentStatus: 'paid' | 'pending';
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  status: 'pending_review' | 'under_review' | 'approved' | 'rejected';
  termsAccepted: boolean;
  noRefundAccepted: boolean;
  reviewNotes?: string;
  reviewedAt?: string;
}

export interface ActiveCall {
  chatId: string;
  chatName: string;
  chatAvatar: string;
  type: 'audio' | 'video';
  status: 'ringing' | 'connected' | 'ended';
  startTime?: number;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
}

// Mind-Blowing Features
export type ScreenFxType = 'confetti' | 'rocket' | 'matrix' | 'fire' | 'hearts' | 'cash';

export interface WatchPartyVideo {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  thumbnail: string;
  duration: number; // in seconds
  creator: string;
}

export interface WatchPartySession {
  id: string;
  chatId: string;
  currentVideo: WatchPartyVideo;
  isPlaying: boolean;
  currentTime: number;
  hostName: string;
  activeViewersCount: number;
  floatingReactions: { id: string; emoji: string; x: number }[];
}

export interface MindMapNode {
  id: string;
  title: string;
  subtitle?: string;
  type: 'root' | 'topic' | 'decision' | 'action' | 'person' | 'insight';
  color?: string;
  children?: MindMapNode[];
  assignee?: string;
  status?: 'pending' | 'in_progress' | 'completed';
}

export interface MindMapData {
  chatTitle: string;
  generatedAt: string;
  root: MindMapNode;
  summary: string;
  actionItems: string[];
}

export interface SecretChatVault {
  isLocked: boolean;
  pin: string;
  stealthMode: boolean; // Panic mode disguises app as Code Editor or Calculator
  e2eeFingerprint: string;
  diffieHellmanSharedKey: string;
}
