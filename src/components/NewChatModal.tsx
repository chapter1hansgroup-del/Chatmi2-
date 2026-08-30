import React, { useState } from 'react';
import { X, Users, Radio, MessageSquare, Plus, Check, Search, Sparkles } from 'lucide-react';
import { User } from '../types';

interface NewChatModalProps {
  users: User[];
  onClose: () => void;
  onCreateChat: (name: string, type: 'direct' | 'group' | 'channel', selectedUserIds: string[]) => void;
  onOpenGoogleContacts?: () => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  users,
  onClose,
  onCreateChat,
  onOpenGoogleContacts,
}) => {
  const [chatType, setChatType] = useState<'direct' | 'group' | 'channel'>('direct');
  const [groupName, setGroupName] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [filterQuery, setFilterQuery] = useState('');

  const toggleUserSelect = (id: string) => {
    if (chatType === 'direct') {
      setSelectedUserIds([id]);
    } else {
      setSelectedUserIds((prev) =>
        prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
      );
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatType !== 'direct' && !groupName.trim()) return;
    if (selectedUserIds.length === 0) return;

    let finalName = groupName;
    if (chatType === 'direct') {
      const selectedUser = users.find((u) => u.id === selectedUserIds[0]);
      finalName = selectedUser ? selectedUser.name : 'Direct Chat';
    }

    onCreateChat(finalName, chatType, selectedUserIds);
    onClose();
  };

  const filteredUsers = users
    .filter((u) => u.id !== 'user_me')
    .filter((u) =>
      u.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (u.phoneNumber && u.phoneNumber.includes(filterQuery)) ||
      (u.statusText && u.statusText.toLowerCase().includes(filterQuery.toLowerCase()))
    );

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-100">New Conversation</h3>
            <p className="text-xs text-slate-400">Select participants from directory or Google Contacts</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Google Contacts Fast Import Banner */}
        {onOpenGoogleContacts && (
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenGoogleContacts();
            }}
            className="w-full p-2.5 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 hover:bg-indigo-600/25 transition-all flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Import from Google Contacts
                </p>
                <p className="text-[10px] text-slate-400">Sync with your Google Workspace address book</p>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </button>
        )}

        {/* Type Selector Tabs */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setChatType('direct')}
            className={`p-2.5 rounded-2xl flex flex-col items-center gap-1 text-xs font-semibold border transition-all ${
              chatType === 'direct'
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                : 'bg-slate-800/60 border-slate-700 text-slate-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Direct Chat
          </button>

          <button
            onClick={() => setChatType('group')}
            className={`p-2.5 rounded-2xl flex flex-col items-center gap-1 text-xs font-semibold border transition-all ${
              chatType === 'group'
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                : 'bg-slate-800/60 border-slate-700 text-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            Team Group
          </button>

          <button
            onClick={() => setChatType('channel')}
            className={`p-2.5 rounded-2xl flex flex-col items-center gap-1 text-xs font-semibold border transition-all ${
              chatType === 'channel'
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                : 'bg-slate-800/60 border-slate-700 text-slate-300'
            }`}
          >
            <Radio className="w-4 h-4" />
            Channel
          </button>
        </div>

        {/* Group / Channel Name Input */}
        {chatType !== 'direct' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">
              {chatType === 'group' ? 'Team Name' : 'Channel Name'}
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder={chatType === 'group' ? 'e.g. 🚀 Mobile Engineering' : 'e.g. 📢 CEO Updates'}
              className="w-full bg-slate-950/80 text-slate-100 text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {/* Select Participants */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300">Select Contacts</label>
            <span className="text-[10px] text-slate-400">{filteredUsers.length} available</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search by name, phone or status..."
              className="w-full bg-slate-950 text-xs text-white pl-8 pr-2.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="max-h-44 overflow-y-auto flex flex-col gap-1.5 pr-1">
            {filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No matching contacts found.
              </div>
            ) : (
              filteredUsers.map((u) => {
                const isSelected = selectedUserIds.includes(u.id);
                return (
                  <div
                    key={u.id}
                    onClick={() => toggleUserSelect(u.id)}
                    className={`flex items-center justify-between p-2 rounded-2xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500/80 text-white'
                        : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-slate-100 truncate">{u.name}</span>
                        <span className="text-[10px] text-slate-400 truncate">{u.phoneNumber || u.statusText || u.username}</span>
                      </div>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Create Submit Button */}
        <button
          onClick={handleCreate}
          disabled={selectedUserIds.length === 0 || (chatType !== 'direct' && !groupName.trim())}
          className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25"
        >
          Start Conversation
        </button>
      </div>
    </div>
  );
};
