import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Key,
  Fingerprint,
  EyeOff,
  Eye,
  RefreshCw,
  Copy,
  Check,
  ShieldAlert,
  Code,
  Calculator,
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface SecretVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivateStealthMode: (mode: 'code' | 'calculator') => void;
}

export const SecretVaultModal: React.FC<SecretVaultModalProps> = ({
  isOpen,
  onClose,
  onActivateStealthMode,
}) => {
  const [activeTab, setActiveTab] = useState<'e2ee' | 'stealth' | 'pin'>('e2ee');
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [pinCode, setPinCode] = useState('4829');
  const [isPinLocked, setIsPinLocked] = useState(false);

  const [keys, setKeys] = useState({
    primeModulus: '0xFFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD1',
    publicKeyA: '0x8F3C9142AEB974100D58C110',
    publicKeyB: '0x4E7B1299C0D31885FA221804',
    sharedSecret: 'AES-256-GCM::SHA256::e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    fingerprint: '9482-1058-2940-1948-5829-4820',
  });

  const handleRegenerateKeys = () => {
    setIsGeneratingKeys(true);
    soundEffects.playLaserSound();

    setTimeout(() => {
      const randomHex = () =>
        Array(8)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16).toUpperCase())
          .join('');

      setKeys({
        primeModulus: `0xFFFFFF${randomHex()}${randomHex()}`,
        publicKeyA: `0x${randomHex()}${randomHex()}`,
        publicKeyB: `0x${randomHex()}${randomHex()}`,
        sharedSecret: `AES-256-GCM::SHA256::${randomHex()}${randomHex()}${randomHex()}`,
        fingerprint: `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      });
      setIsGeneratingKeys(false);
    }, 600);
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(keys.sharedSecret);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-100 flex items-center gap-2">
                Quantum E2EE & Stealth Vault
              </h3>
              <p className="text-xs text-slate-400">Zero-Knowledge Key Protocol & Anti-Snoop Disguise</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-5 pt-2 gap-4">
          <button
            onClick={() => setActiveTab('e2ee')}
            className={`pb-2.5 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'e2ee'
                ? 'text-emerald-400 border-emerald-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Diffie-Hellman Keys</span>
          </button>

          <button
            onClick={() => setActiveTab('stealth')}
            className={`pb-2.5 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'stealth'
                ? 'text-indigo-400 border-indigo-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Stealth Panic Disguise</span>
          </button>

          <button
            onClick={() => setActiveTab('pin')}
            className={`pb-2.5 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'pin'
                ? 'text-purple-400 border-purple-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Vault PIN Protection</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto max-h-[70vh]">
          {activeTab === 'e2ee' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Cryptographic Handshake Verification</h4>
                  <p className="text-[11px] text-slate-400">
                    Elliptic curve Curve25519 with AES-256-GCM symmetric session keys.
                  </p>
                </div>
                <button
                  onClick={handleRegenerateKeys}
                  disabled={isGeneratingKeys}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingKeys ? 'animate-spin' : ''}`} />
                  <span>Re-negotiate</span>
                </button>
              </div>

              {/* Visual Mathematical Matrix */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span>PUBLIC KEY A (Device):</span>
                  <span className="text-emerald-400 truncate max-w-[240px]">{keys.publicKeyA}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>PUBLIC KEY B (Server Peer):</span>
                  <span className="text-cyan-400 truncate max-w-[240px]">{keys.publicKeyB}</span>
                </div>
                <div className="h-px bg-slate-800 my-1" />
                <div className="flex items-center justify-between text-slate-400">
                  <span>SHARED SECRET HASH:</span>
                  <button
                    onClick={handleCopySecret}
                    className="flex items-center gap-1 text-purple-300 hover:text-white"
                  >
                    <span className="truncate max-w-[200px]">{keys.sharedSecret}</span>
                    {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Safety Fingerprint */}
              <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Fingerprint className="w-6 h-6 text-emerald-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-200">Safety Number Fingerprint</p>
                    <p className="font-mono text-xs text-emerald-300">{keys.fingerprint}</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                  Verified
                </span>
              </div>
            </div>
          )}

          {activeTab === 'stealth' && (
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-200">Instant Panic Disguise</h4>
                <p className="text-[11px] text-slate-400">
                  In case someone walks behind your desk, trigger Stealth Mode to instantaneously replace this chat with a realistic work disguise.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Code IDE Disguise */}
                <div
                  onClick={() => {
                    onActivateStealthMode('code');
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500 cursor-pointer transition-all flex flex-col gap-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                      <Code className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Activate →
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-slate-200">VS Code Developer IDE</h5>
                  <p className="text-xs text-slate-400">
                    Disguises chat as a live TypeScript syntax code editor with terminal.
                  </p>
                </div>

                {/* Calculator Disguise */}
                <div
                  onClick={() => {
                    onActivateStealthMode('calculator');
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500 cursor-pointer transition-all flex flex-col gap-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Activate →
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-slate-200">Financial Calculator</h5>
                  <p className="text-xs text-slate-400">
                    Disguises chat as a fully functioning arithmetic and percentage calculator.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <span className="font-bold text-slate-200">Quick Tip:</span> Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[10px] text-white">Esc</kbd> anytime during disguise to exit back to chat.
              </div>
            </div>
          )}

          {activeTab === 'pin' && (
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-200">Biometric & 4-Digit Passcode</h4>
                <p className="text-[11px] text-slate-400">
                  Require authentication before opening confidential chat channels.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-200">Chat Vault Lock Status</p>
                    <p className="text-[11px] text-slate-400">Current PIN: ••••</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPinLocked(!isPinLocked)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isPinLocked
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {isPinLocked ? 'Vault Armed 🔒' : 'Disarmed'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
