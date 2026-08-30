import React, { useState } from 'react';
import {
  X,
  BadgeCheck,
  ShieldCheck,
  Building2,
  UserCheck,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  CreditCard,
  ExternalLink,
  Sparkles,
  ChevronRight,
  HelpCircle,
  Lock,
  ArrowRight,
  RefreshCw,
  Info,
  Check,
  Zap,
} from 'lucide-react';
import { User, PostlyVerificationApplication } from '../types';
import { soundEffects } from '../utils/audio';

interface PostlyVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onVerificationApproved: (tier: 'individual' | 'company') => void;
}

export const PostlyVerificationModal: React.FC<PostlyVerificationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onVerificationApproved,
}) => {
  // Navigation step: 'select_tier' | 'form' | 'payment' | 'status'
  const [step, setStep] = useState<'select_tier' | 'form' | 'payment' | 'status'>('select_tier');

  // Selected Plan: Individual ($2) or Company ($5)
  const [selectedTier, setSelectedTier] = useState<'individual' | 'company'>('individual');

  // Form Fields
  const [fullName, setFullName] = useState(currentUser.name || '');
  const [username, setUsername] = useState(currentUser.username || '');
  const [email, setEmail] = useState('alex.morgan@postly.app');
  const [category, setCategory] = useState('Content Creator & Tech');
  const [documentType, setDocumentType] = useState('Government Photo ID');
  const [documentUrl, setDocumentUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('https://postly.app/@alex_morgan');
  const [socialLinks, setSocialLinks] = useState('tiktok.com/@alex_morgan, instagram.com/alex_morgan');
  const [reason, setReason] = useState(
    'I regularly create tech tutorials, UI design walkthroughs, and live streams on Postly and wish to verify my authentic creator identity.'
  );

  // Mandatory Terms & Conditions Checkboxes
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [noRefundAccepted, setNoRefundAccepted] = useState(false);
  const [authenticityAccepted, setAuthenticityAccepted] = useState(false);

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay' | 'wallet'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Active Application State (Saved to Local State)
  const [application, setApplication] = useState<PostlyVerificationApplication | null>(null);
  const [simulatedTeamStatus, setSimulatedTeamStatus] = useState<
    'pending_review' | 'under_review' | 'approved' | 'rejected'
  >('pending_review');
  const [teamReviewNotes, setTeamReviewNotes] = useState<string>('');

  if (!isOpen) return null;

  const currentFee = selectedTier === 'individual' ? 2 : 5;

  const handleStartApplication = (tier: 'individual' | 'company') => {
    setSelectedTier(tier);
    if (tier === 'company') {
      setFullName(currentUser.name ? `${currentUser.name} Technologies Inc.` : 'Postly Global Corp');
      setCategory('Technology & Software Company');
      setDocumentType('Business Registration Certificate / Tax ID');
    } else {
      setFullName(currentUser.name || 'Alex Morgan');
      setCategory('Content Creator & Tech');
      setDocumentType('Government Photo ID');
    }
    setStep('form');
    soundEffects.playTapSound();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted || !noRefundAccepted || !authenticityAccepted) {
      soundEffects.playErrorSound();
      return;
    }
    setStep('payment');
    soundEffects.playClickSound();
  };

  const handleProcessPayment = () => {
    setIsProcessingPayment(true);
    soundEffects.playSendSound();

    setTimeout(() => {
      setIsProcessingPayment(false);
      const newApp: PostlyVerificationApplication = {
        id: `VER-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        applicantType: selectedTier,
        fullName: fullName.trim(),
        username: username.trim(),
        category,
        email: email.trim(),
        documentType,
        documentProof: documentUrl || 'Uploaded (Encrypted ID-Vault #7829)',
        websiteUrl,
        socialLinks,
        reason,
        feeAmount: currentFee,
        paymentStatus: 'paid',
        paymentDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        paymentMethod:
          paymentMethod === 'card'
            ? 'Credit Card (••4242)'
            : paymentMethod === 'apple_pay'
            ? 'Apple Pay'
            : paymentMethod === 'google_pay'
            ? 'Google Pay'
            : 'Postly Creator Wallet',
        transactionId: `TXN_PL_${Date.now().toString(36).toUpperCase()}`,
        status: 'pending_review',
        termsAccepted: true,
        noRefundAccepted: true,
      };

      setApplication(newApp);
      setSimulatedTeamStatus('pending_review');
      setStep('status');
      soundEffects.playCelebrationChime();
    }, 1200);
  };

  // Team Audit Simulation Controls
  const handleSimulateTeamReview = (action: 'under_review' | 'approve' | 'reject') => {
    if (action === 'under_review') {
      setSimulatedTeamStatus('under_review');
      setTeamReviewNotes('Assigned to Postly Trust & Safety Specialist: Reviewing social history and identity legitimacy.');
      soundEffects.playTapSound();
    } else if (action === 'approve') {
      setSimulatedTeamStatus('approved');
      setTeamReviewNotes(
        `✅ Approved by Postly Trust & Safety Team! Identity and public notability requirements met. Verified ${
          selectedTier === 'individual' ? 'Creator' : 'Company'
        } badge granted.`
      );
      soundEffects.playLevelUp();
      onVerificationApproved(selectedTier);
    } else if (action === 'reject') {
      setSimulatedTeamStatus('rejected');
      setTeamReviewNotes(
        '❌ Verification Request Declined: Supporting links did not satisfy public notability criteria or government document clarity. As acknowledged in the terms, the review fee is non-refundable.'
      );
      soundEffects.playErrorSound();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-200">
      {/* Modal Card Frame */}
      <div className="w-full max-w-2xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative text-slate-100">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
              <BadgeCheck className="w-6 h-6 fill-cyan-400 text-slate-950" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">Postly Official Verification</h3>
                <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-cyan-500/30">
                  TikTok & Creator Standard
                </span>
              </div>
              <p className="text-xs text-slate-400">Authentic badge verification & manual team review process</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container with Scroll */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* STEP 1: SELECT TIER & TERMS OVERVIEW */}
          {step === 'select_tier' && (
            <div className="space-y-6">
              {/* Introduction Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Verified Identity on Postly</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Postly verification provides users and audiences with confirmed authenticity. Every application goes
                  through a strict identity review by our Trust & Safety team to protect the community from impersonation
                  and fraud.
                </p>
              </div>

              {/* Pricing & Tier Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Individual / Creator Tier ($2) */}
                <div
                  onClick={() => setSelectedTier('individual')}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                    selectedTier === 'individual'
                      ? 'bg-slate-800/90 border-cyan-400 shadow-xl shadow-cyan-500/10 ring-2 ring-cyan-500/30'
                      : 'bg-slate-900/80 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Individual</span>
                      </div>
                      <span className="text-[10px] font-black bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">
                        Creator Plan
                      </span>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white">$2</span>
                        <span className="text-xs text-slate-400 font-semibold">one-time fee</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">For influencers, artists, developers & public creators</p>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-700/60">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Official Blue Verification Checkmark</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Search priority & For You algorithm boost</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Anti-impersonation protection</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Creator Coin monetization eligibility</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartApplication('individual');
                    }}
                    className="w-full mt-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-transform active:scale-95"
                  >
                    <span>Apply as Individual ($2)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 2. Company / Business Tier ($5) */}
                <div
                  onClick={() => setSelectedTier('company')}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                    selectedTier === 'company'
                      ? 'bg-slate-800/90 border-amber-400 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/30'
                      : 'bg-slate-900/80 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Company</span>
                      </div>
                      <span className="text-[10px] font-black bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                        Business Plan
                      </span>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white">$5</span>
                        <span className="text-xs text-slate-400 font-semibold">one-time fee</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">For brands, registered companies, studios & organizations</p>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-700/60">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Golden Official Company Verified Badge</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Corporate brand & domain authentication</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Link-in-bio & partner showcase privileges</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Priority manual review queue</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartApplication('company');
                    }}
                    className="w-full mt-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
                  >
                    <span>Apply as Company ($5)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* CRITICAL TERMS & CONDITIONS / STRICT NO-REFUNDS DISCLOSURE */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Important Terms & Strict No-Refund Policy</span>
                </div>

                <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <p>
                    <strong className="text-white">1. One-Time Review Fee:</strong> The application fee (
                    <span className="text-cyan-300 font-bold">$2 for Individual</span> or{' '}
                    <span className="text-amber-300 font-bold">$5 for Company</span>) is an administrative processing fee
                    to cover manual identity screening, background checks, and evaluation by the Postly Trust & Safety
                    team.
                  </p>
                  <p>
                    <strong className="text-white">2. STRICT NO-REFUND POLICY:</strong> Under all circumstances, this fee is{' '}
                    <span className="text-rose-400 font-bold underline">100% NON-REFUNDABLE</span>. Once the payment is
                    processed and the manual audit begins, fees cannot be reversed or refunded regardless of whether your
                    account is approved, rejected, or withdrawn.
                  </p>
                  <p>
                    <strong className="text-white">3. Manual Team Review:</strong> Payment of the review fee does{' '}
                    <em>not</em> guarantee automatic approval. Our team evaluates profile activity, authenticity, and
                    adherence to Postly community rules.
                  </p>
                  <p>
                    <strong className="text-white">4. Review Timeline:</strong> Submissions are typically audited within{' '}
                    <strong className="text-white">24 to 72 business hours</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: VERIFICATION APPLICATION FORM */}
          {step === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    1
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    {selectedTier === 'individual' ? 'Individual Creator Details' : 'Company / Business Entity Details'}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('select_tier')}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Change Tier ({selectedTier === 'individual' ? '$2' : '$5'})
                </button>
              </div>

              {/* Form Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {selectedTier === 'individual' ? 'Full Legal Name *' : 'Registered Entity / Company Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={selectedTier === 'individual' ? 'e.g. Alex Morgan' : 'e.g. Acme Media Corp'}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Postly Username *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-500 text-xs">@</span>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.replace(/^@/, ''))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Official Contact Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Content Creator & Tech">Content Creator & Tech</option>
                    <option value="Digital Media & Entertainment">Digital Media & Entertainment</option>
                    <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                    <option value="Musician / Singer / Producer">Musician / Singer / Producer</option>
                    <option value="Gaming & Esports">Gaming & Esports</option>
                    <option value="Technology & Software Company">Technology & Software Company</option>
                    <option value="Brand / E-Commerce Retail">Brand / E-Commerce Retail</option>
                    <option value="News, Journalism & Media">News, Journalism & Media</option>
                    <option value="Public Figure / Executive">Public Figure / Executive</option>
                  </select>
                </div>
              </div>

              {/* Identity Proof & Supporting Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Verification Document Type *</label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {selectedTier === 'individual' ? (
                      <>
                        <option value="Government Photo ID">Government Photo ID (Passport / Driver's License)</option>
                        <option value="National ID Card">National ID Card</option>
                        <option value="Press / Media Credential">Press / Media Credential</option>
                      </>
                    ) : (
                      <>
                        <option value="Business Registration Certificate">Business Registration Certificate</option>
                        <option value="Articles of Incorporation">Articles of Incorporation</option>
                        <option value="Official Tax / VAT Registration">Official Tax / VAT Registration</option>
                        <option value="Trademark / Brand Certificate">Trademark / Brand Certificate</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Official Website / Portfolio</label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  External Social Verification Links (TikTok, Instagram, YouTube, X)
                </label>
                <input
                  type="text"
                  value={socialLinks}
                  onChange={(e) => setSocialLinks(e.target.value)}
                  placeholder="e.g. tiktok.com/@yourname, instagram.com/yourname"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Reason / Statement for Verification *</label>
                <textarea
                  required
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Briefly explain your public presence or business operations..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* MANDATORY TERMS & CONDITIONS CHECKBOXES */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Mandatory Policy Agreement & Non-Refundable Disclosure</span>
                </div>

                <div className="space-y-2.5">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-200">
                    <input
                      type="checkbox"
                      required
                      checked={noRefundAccepted}
                      onChange={(e) => setNoRefundAccepted(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-rose-500 focus:ring-rose-500"
                    />
                    <span>
                      <strong className="text-rose-400">NO REFUNDS POLICY:</strong> I understand that the{' '}
                      <strong>${currentFee}.00</strong> review fee is <strong>100% NON-REFUNDABLE</strong> under any
                      circumstances once paid, as it covers human labor and administrative identity screening costs.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-200">
                    <input
                      type="checkbox"
                      required
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span>
                      I acknowledge that payment submits my profile for <strong>Manual Team Audit</strong> by the Postly
                      Trust & Safety Team and does <em>not</em> guarantee badge approval.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-200">
                    <input
                      type="checkbox"
                      required
                      checked={authenticityAccepted}
                      onChange={(e) => setAuthenticityAccepted(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span>
                      I confirm that all submitted identification details and links are authentic and represent my genuine
                      identity or registered organization.
                    </span>
                  </label>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('select_tier')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={!termsAccepted || !noRefundAccepted || !authenticityAccepted}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <span>Continue to Payment (${currentFee}.00)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: PAYMENT GATEWAY */}
          {step === 'payment' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <h4 className="text-sm font-bold text-white">Review Fee Checkout & Authorization</h4>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">256-Bit SSL Encrypted</span>
              </div>

              {/* Order Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Application Item:</span>
                  <span className="font-bold text-white">
                    Postly {selectedTier === 'individual' ? 'Creator ($2)' : 'Company ($5)'} Verification Review
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Applicant Handle:</span>
                  <span className="font-mono text-cyan-300 font-bold">@{username}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Administrative Manual Audit Fee:</span>
                  <span className="font-bold text-white">${currentFee}.00 USD</span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Total Due Today (One-Time):</span>
                    <p className="text-[10px] text-rose-400 font-bold">Strictly Non-Refundable Fee</p>
                  </div>
                  <span className="text-2xl font-black text-cyan-400">${currentFee}.00</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Choose Payment Method</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                    { id: 'apple_pay', label: 'Apple Pay', icon: Zap },
                    { id: 'google_pay', label: 'Google Pay', icon: Sparkles },
                    { id: 'wallet', label: 'Postly Wallet', icon: DollarSign },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                        paymentMethod === m.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md'
                          : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <m.icon className="w-4 h-4" />
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">Expires</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">CVC / CVV</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Clear Security & Non-Refund Disclaimer Banner */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  Payments are encrypted. By clicking Pay, you authorize a one-time non-refundable charge of ${currentFee}
                  .00 USD for manual verification evaluation.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Back to Details
                </button>

                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleProcessPayment}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs flex items-center gap-2 shadow-xl shadow-cyan-500/25 transition-transform active:scale-95"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authorizing & Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Pay ${currentFee}.00 & Submit to Review Team</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: TEAM REVIEW STATUS TRACKER & AUDIT SIMULATOR */}
          {step === 'status' && application && (
            <div className="space-y-6 animate-in fade-in">
              {/* Top Status Header */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Ref: {application.id}</span>
                    <span className="text-xs text-slate-600">•</span>
                    <span className="text-xs text-slate-400">{application.paymentDate}</span>
                  </div>

                  {/* Status Badge */}
                  {simulatedTeamStatus === 'pending_review' && (
                    <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/40 animate-pulse">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pending Team Review</span>
                    </div>
                  )}

                  {simulatedTeamStatus === 'under_review' && (
                    <div className="flex items-center gap-1.5 bg-cyan-500/20 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full border border-cyan-500/40 animate-pulse">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Under Active Safety Audit</span>
                    </div>
                  )}

                  {simulatedTeamStatus === 'approved' && (
                    <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-black px-3 py-1 rounded-full border border-emerald-500/40">
                      <BadgeCheck className="w-4 h-4 fill-cyan-400 text-slate-950" />
                      <span>Approved & Verified! 🎉</span>
                    </div>
                  )}

                  {simulatedTeamStatus === 'rejected' && (
                    <div className="flex items-center gap-1.5 bg-rose-500/20 text-rose-300 text-xs font-bold px-3 py-1 rounded-full border border-rose-500/40">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Verification Declined</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-lg text-white shadow-lg">
                    {application.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-black text-white">{application.fullName}</h4>
                      {simulatedTeamStatus === 'approved' && (
                        <BadgeCheck className="w-4 h-4 fill-cyan-400 text-slate-950" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      @{application.username} • {application.category}
                    </p>
                  </div>
                </div>

                {/* Audit Stage Progress Tracker Bar */}
                <div className="pt-3 space-y-2">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-cyan-400">1. Payment Processed ($ {application.feeAmount}.00)</span>
                    <span
                      className={
                        simulatedTeamStatus !== 'pending_review' ? 'text-cyan-400' : 'text-slate-500'
                      }
                    >
                      2. Fraud & Legitimacy Check
                    </span>
                    <span
                      className={
                        simulatedTeamStatus === 'approved'
                          ? 'text-emerald-400 font-black'
                          : simulatedTeamStatus === 'rejected'
                          ? 'text-rose-400'
                          : 'text-slate-500'
                      }
                    >
                      3. Team Decision
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden flex">
                    <div className="w-1/3 bg-cyan-500 h-full" />
                    <div
                      className={`h-full transition-all duration-500 ${
                        simulatedTeamStatus === 'pending_review'
                          ? 'w-0'
                          : 'w-1/3 bg-cyan-400'
                      }`}
                    />
                    <div
                      className={`h-full transition-all duration-500 ${
                        simulatedTeamStatus === 'approved'
                          ? 'w-1/3 bg-emerald-400'
                          : simulatedTeamStatus === 'rejected'
                          ? 'w-1/3 bg-rose-500'
                          : 'w-0'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Team Audit Notes Display */}
              {teamReviewNotes && (
                <div
                  className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                    simulatedTeamStatus === 'approved'
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : simulatedTeamStatus === 'rejected'
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                      : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Info className="w-4 h-4" />
                    <span>Postly Trust & Safety Specialist Note:</span>
                  </div>
                  <p>{teamReviewNotes}</p>
                </div>
              )}

              {/* INTERACTIVE POSTLY TEAM AUDIT SIMULATOR (Test Review & Decision Live) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white">Postly Review Team Simulation Console</span>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                    Internal Tool
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Simulate the Postly Trust & Safety specialist reviewing the submission in real-time to test the
                  approval flow and verified badge:
                </p>

                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <button
                    type="button"
                    onClick={() => handleSimulateTeamReview('under_review')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold flex items-center gap-1 border border-cyan-500/30"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Mark Under Review</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulateTeamReview('approve')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1 shadow-md"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Grant Badge</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulateTeamReview('reject')}
                    className="px-3 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 text-xs font-bold flex items-center gap-1 border border-rose-500/30"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Decline Application</span>
                  </button>
                </div>
              </div>

              {/* Receipt & Non-Refund Terms Confirmation */}
              <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-[11px] text-slate-400 space-y-1.5">
                <div className="flex justify-between">
                  <span>Payment Reference:</span>
                  <span className="font-mono text-slate-300">{application.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="text-slate-300">{application.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span className="font-bold text-white">${application.feeAmount}.00 USD (Non-Refundable)</span>
                </div>
                <div className="flex justify-between">
                  <span>Audit Service Status:</span>
                  <span className="text-cyan-300 font-bold">Team Review Scheduled</span>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20"
              >
                Done & Return to Postly
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
