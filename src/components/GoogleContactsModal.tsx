// src/components/GoogleContactsModal.tsx
import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Users,
  UserPlus,
  RefreshCw,
  Phone,
  Video,
  MessageSquare,
  Mail,
  Building,
  MapPin,
  Trash2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import {
  GoogleContact,
  signInWithGoogleForContacts,
  fetchGoogleContacts,
  searchGoogleContacts,
  createGoogleContact,
  deleteGoogleContact,
  getGoogleAccessToken,
  signOutGoogleContacts,
} from '../lib/googleContacts';
import { User, Chat } from '../types';
import { soundEffects } from '../utils/audio';

interface GoogleContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChatWithContact: (contact: GoogleContact) => void;
  onStartCallWithContact: (contact: GoogleContact, type: 'audio' | 'video') => void;
  onImportContactsToApp: (contacts: GoogleContact[]) => void;
}

export const GoogleContactsModal: React.FC<GoogleContactsModalProps> = ({
  isOpen,
  onClose,
  onStartChatWithContact,
  onStartCallWithContact,
  onImportContactsToApp,
}) => {
  const [contacts, setContacts] = useState<GoogleContact[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<GoogleContact | null>(null);
  const [isAuthenticatedWithGoogle, setIsAuthenticatedWithGoogle] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // New Contact Form Modal State
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newGivenName, setNewGivenName] = useState('');
  const [newFamilyName, setNewFamilyName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newJobTitle, setNewJobTitle] = useState('');
  const [isCreatingContact, setIsCreatingContact] = useState(false);

  // Confirmation Modal State for Destructive Action
  const [contactToDelete, setContactToDelete] = useState<GoogleContact | null>(null);
  const [isDeletingContact, setIsDeletingContact] = useState(false);

  // Check current token on mount
  useEffect(() => {
    if (isOpen) {
      const token = getGoogleAccessToken();
      if (token) {
        setIsAuthenticatedWithGoogle(true);
        loadContacts(token);
      } else {
        setIsAuthenticatedWithGoogle(false);
      }
    }
  }, [isOpen]);

  const loadContacts = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await fetchGoogleContacts(token);
      setContacts(results);
      if (results.length > 0 && !selectedContact) {
        setSelectedContact(results[0]);
      }
    } catch (err: any) {
      console.error('Failed to load Google contacts:', err);
      setError(err.message || 'Failed to fetch Google Contacts. Please check permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      const res = await signInWithGoogleForContacts();
      if (res?.accessToken) {
        setIsAuthenticatedWithGoogle(true);
        soundEffects.playClickSound();
        await loadContacts(res.accessToken);
      }
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      setError(err.message || 'Google authentication was cancelled or failed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getGoogleAccessToken();
    if (!token) return;

    setLoading(true);
    try {
      const results = await searchGoogleContacts(token, searchQuery);
      setContacts(results);
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGivenName.trim()) {
      alert('Please enter a first name');
      return;
    }

    const token = getGoogleAccessToken();
    if (!token) {
      setError('Please sign in with Google first');
      return;
    }

    setIsCreatingContact(true);
    try {
      const created = await createGoogleContact(token, {
        givenName: newGivenName.trim(),
        familyName: newFamilyName.trim(),
        email: newEmail.trim(),
        phoneNumber: newPhone.trim(),
        organization: newOrg.trim(),
        jobTitle: newJobTitle.trim(),
      });

      setContacts((prev) => [created, ...prev]);
      setSelectedContact(created);
      setShowAddContactModal(false);
      setNewGivenName('');
      setNewFamilyName('');
      setNewEmail('');
      setNewPhone('');
      setNewOrg('');
      setNewJobTitle('');
      setSuccessMessage(`Added "${created.name}" to your Google Contacts!`);
      soundEffects.playReceiveSound();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Failed to create contact:', err);
      alert(`Error creating contact: ${err.message}`);
    } finally {
      setIsCreatingContact(false);
    }
  };

  const handleDeleteContactConfirm = async () => {
    if (!contactToDelete) return;
    const token = getGoogleAccessToken();
    if (!token) return;

    setIsDeletingContact(true);
    try {
      await deleteGoogleContact(token, contactToDelete.resourceName);
      setContacts((prev) => prev.filter((c) => c.resourceName !== contactToDelete.resourceName));
      if (selectedContact?.resourceName === contactToDelete.resourceName) {
        setSelectedContact(null);
      }
      setContactToDelete(null);
      setSuccessMessage(`Contact deleted from Google Contacts`);
      soundEffects.playTapSound();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Failed to delete contact:', err);
      alert(`Error deleting contact: ${err.message}`);
    } finally {
      setIsDeletingContact(false);
    }
  };

  const handleSyncAll = () => {
    if (contacts.length === 0) return;
    onImportContactsToApp(contacts);
    setSuccessMessage(`Imported ${contacts.length} Google contacts into ChatMi!`);
    soundEffects.playSendSound();
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="w-full max-w-4xl h-[85vh] max-h-[750px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">Google Contacts</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sync and message your Google Workspace & personal address book
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticatedWithGoogle && (
              <button
                onClick={() => setShowAddContactModal(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/20"
              >
                <UserPlus className="w-4 h-4" />
                <span>New Contact</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {successMessage && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => handleGoogleSignIn()}
              className="px-2.5 py-1 bg-rose-600 text-white rounded-lg hover:bg-rose-500 text-[11px]"
            >
              Reconnect
            </button>
          </div>
        )}

        {/* Main Content Area */}
        {!isAuthenticatedWithGoogle ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900/50">
            <div className="w-16 h-16 rounded-3xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-indigo-400" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Connect Google Contacts</h4>
            <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
              Connect your Google Account to access contacts, phone numbers, and emails to initiate instant chats and calls directly inside ChatMi.
            </p>

            {/* Official Google Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
              <span>{isSigningIn ? 'Connecting to Google...' : 'Sign in with Google'}</span>
            </button>
            <div className="flex items-center gap-1.5 mt-4 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>OAuth 2.0 secure authorization with People API permissions</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Sidebar: Contact Search & List */}
            <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col shrink-0 bg-slate-950/40">
              {/* Search & Actions Bar */}
              <div className="p-3 border-b border-slate-800 flex flex-col gap-2">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Google Contacts..."
                    className="w-full bg-slate-900 text-xs text-white pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </form>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-400">
                    {contacts.length} Contacts Found
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        const token = getGoogleAccessToken();
                        if (token) loadContacts(token);
                      }}
                      disabled={loading}
                      title="Reload contacts"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
                    </button>
                    <button
                      onClick={handleSyncAll}
                      disabled={contacts.length === 0}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 text-[10px] font-bold transition-all flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Sync to App</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Contacts List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {loading ? (
                  <div className="p-8 text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-slate-400 font-medium">Syncing Google Contacts...</p>
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <Users className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">No contacts found in your Google Account.</p>
                    <button
                      onClick={() => setShowAddContactModal(true)}
                      className="text-xs font-bold text-indigo-400 hover:underline"
                    >
                      + Add your first contact
                    </button>
                  </div>
                ) : (
                  contacts.map((c) => {
                    const isSelected = selectedContact?.resourceName === c.resourceName;
                    return (
                      <div
                        key={c.resourceName || c.email || c.name}
                        onClick={() => {
                          setSelectedContact(c);
                          soundEffects.playTapSound();
                        }}
                        className={`p-2.5 rounded-2xl flex items-center justify-between cursor-pointer border transition-all ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500/60 text-white'
                            : 'bg-slate-900/50 border-slate-800/60 hover:bg-slate-850 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={c.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(c.name)}`}
                            alt={c.name}
                            className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-700/50"
                          />
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-slate-100 truncate">{c.name}</h5>
                            <p className="text-[11px] text-slate-400 truncate">
                              {c.phoneNumber || c.email || c.organization || 'No info'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {c.phoneNumber && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onStartCallWithContact(c, 'audio');
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                              title="Voice Call"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onStartChatWithContact(c);
                              onClose();
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                            title="Chat"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Pane: Selected Contact Detail Card */}
            <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto bg-slate-900">
              {selectedContact ? (
                <div className="space-y-6 max-w-lg mx-auto w-full">
                  {/* Avatar & Hero */}
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={selectedContact.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(selectedContact.name)}`}
                      alt={selectedContact.name}
                      className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500/50 shadow-xl mb-3"
                    />
                    <h4 className="text-xl font-bold text-white">{selectedContact.name}</h4>
                    {selectedContact.jobTitle || selectedContact.organization ? (
                      <p className="text-xs text-indigo-400 font-medium mt-0.5">
                        {selectedContact.jobTitle}
                        {selectedContact.jobTitle && selectedContact.organization && ' • '}
                        {selectedContact.organization}
                      </p>
                    ) : null}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        onStartChatWithContact(selectedContact);
                        onClose();
                      }}
                      className="py-3 px-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white flex flex-col items-center gap-1 text-xs font-bold transition-all shadow-lg shadow-indigo-600/25"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Start Chat</span>
                    </button>

                    <button
                      onClick={() => onStartCallWithContact(selectedContact, 'audio')}
                      className="py-3 px-2 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex flex-col items-center gap-1 text-xs font-bold transition-all"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Audio Call</span>
                    </button>

                    <button
                      onClick={() => onStartCallWithContact(selectedContact, 'video')}
                      className="py-3 px-2 rounded-2xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 flex flex-col items-center gap-1 text-xs font-bold transition-all"
                    >
                      <Video className="w-4 h-4" />
                      <span>Video Call</span>
                    </button>
                  </div>

                  {/* Information Details List */}
                  <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs">
                    {selectedContact.phoneNumber && (
                      <div className="flex items-center gap-3 py-1">
                        <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Phone Number</p>
                          <p className="text-sm font-mono font-bold text-slate-200">{selectedContact.phoneNumber}</p>
                        </div>
                      </div>
                    )}

                    {selectedContact.email && (
                      <div className="flex items-center gap-3 py-1 border-t border-slate-800/80 pt-2">
                        <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Email Address</p>
                          <p className="text-xs text-slate-200 font-medium">{selectedContact.email}</p>
                        </div>
                      </div>
                    )}

                    {selectedContact.organization && (
                      <div className="flex items-center gap-3 py-1 border-t border-slate-800/80 pt-2">
                        <Building className="w-4 h-4 text-purple-400 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Company / Department</p>
                          <p className="text-xs text-slate-200 font-medium">{selectedContact.organization}</p>
                        </div>
                      </div>
                    )}

                    {selectedContact.addresses && selectedContact.addresses.length > 0 && (
                      <div className="flex items-center gap-3 py-1 border-t border-slate-800/80 pt-2">
                        <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Address</p>
                          <p className="text-xs text-slate-200 font-medium">{selectedContact.addresses[0]}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Danger Zone: Delete Contact with Confirmation */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setContactToDelete(selectedContact)}
                      className="text-xs text-rose-400/80 hover:text-rose-400 flex items-center gap-1 font-medium transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove from Google Contacts</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400">
                  <Users className="w-12 h-12 text-slate-600 mb-3" />
                  <p className="text-sm font-semibold">Select a contact to view details or start a chat</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 1. Modal: Add New Google Contact */}
      {showAddContactModal && (
        <div className="fixed inset-0 bg-slate-950/85 z-60 flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                <h4 className="text-base font-bold text-white">Add Contact to Google</h4>
              </div>
              <button
                onClick={() => setShowAddContactModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContactSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">First Name *</label>
                  <input
                    type="text"
                    value={newGivenName}
                    onChange={(e) => setNewGivenName(e.target.value)}
                    required
                    placeholder="e.g. Sarah"
                    className="w-full p-2.5 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newFamilyName}
                    onChange={(e) => setNewFamilyName(e.target.value)}
                    placeholder="e.g. Connor"
                    className="w-full p-2.5 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. +1 555 123 4567"
                  className="w-full p-2.5 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. sarah@cyberdyne.org"
                  className="w-full p-2.5 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Organization</label>
                  <input
                    type="text"
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value)}
                    placeholder="e.g. TechCorp"
                    className="w-full p-2.5 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Job Title</label>
                  <input
                    type="text"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    placeholder="e.g. Architect"
                    className="w-full p-2.5 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingContact || !newGivenName.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
                >
                  {isCreatingContact ? 'Saving to Google...' : 'Confirm & Save Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Explicit Destructive Confirmation Dialog */}
      {contactToDelete && (
        <div className="fixed inset-0 bg-slate-950/85 z-60 flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Delete Contact from Google?</h4>
            <p className="text-xs text-slate-400">
              Are you sure you want to permanently delete <strong className="text-white">{contactToDelete.name}</strong> from your Google Contacts address book? This action cannot be undone.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setContactToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteContactConfirm}
                disabled={isDeletingContact}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-600/30"
              >
                {isDeletingContact ? 'Deleting...' : 'Yes, Delete Contact'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
