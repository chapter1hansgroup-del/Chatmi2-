// src/components/GoogleFormsModal.tsx
import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  Send,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  Layers,
  Trash2,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import {
  GoogleForm,
  GoogleFormQuestion,
  GoogleFormResponse,
  signInWithGoogleForForms,
  listGoogleForms,
  getGoogleForm,
  getGoogleFormResponses,
  createGoogleFormWithQuestions,
  getGoogleFormsAccessToken,
} from '../lib/googleForms';
import { soundEffects } from '../utils/audio';

interface GoogleFormsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShareFormToChat?: (form: GoogleForm) => void;
}

const TEMPLATES = [
  {
    id: 'team_poll',
    name: '📊 Team Quick Poll',
    description: 'Rapid decisions and consensus gathering for team channels',
    title: 'Team Decision & Quick Poll',
    formDesc: 'Please take a minute to cast your vote on the current topic.',
    questions: [
      {
        title: 'Which direction do you prefer for the upcoming milestone?',
        type: 'CHOICE' as const,
        required: true,
        options: ['Option A (Faster Launch)', 'Option B (Deeper Customization)', 'Option C (Further Research)'],
      },
      {
        title: 'Any additional notes or blockers?',
        type: 'TEXT' as const,
        required: false,
      },
    ],
  },
  {
    id: 'event_rsvp',
    name: '📅 Event RSVP & Attendance',
    description: 'Collect headcount, dietary requirements, and availability',
    title: 'Team Event RSVP',
    formDesc: 'Let us know if you can join our upcoming team event!',
    questions: [
      {
        title: 'Will you be attending?',
        type: 'CHOICE' as const,
        required: true,
        options: ['Yes, absolutely!', 'No, regretfully cannot attend', 'Maybe / Tentative'],
      },
      {
        title: 'Any dietary restrictions or preferences?',
        type: 'CHECKBOX' as const,
        required: false,
        options: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'None'],
      },
      {
        title: 'Preferred arrival time?',
        type: 'CHOICE' as const,
        required: false,
        options: ['5:30 PM', '6:00 PM', '6:30 PM onwards'],
      },
    ],
  },
  {
    id: 'csat_survey',
    name: '⭐ Customer Satisfaction (CSAT)',
    description: 'Score satisfaction scale and qualitative comments',
    title: 'Customer Satisfaction Survey',
    formDesc: 'Help us improve by rating your experience with our product and service.',
    questions: [
      {
        title: 'How satisfied are you overall with the service provided?',
        type: 'SCALE' as const,
        required: true,
        low: 1,
        high: 5,
        lowLabel: 'Very Dissatisfied',
        highLabel: 'Very Satisfied',
      },
      {
        title: 'What was the highlight of your experience?',
        type: 'TEXT' as const,
        required: false,
      },
      {
        title: 'How likely are you to recommend us to a colleague or friend?',
        type: 'SCALE' as const,
        required: true,
        low: 1,
        high: 10,
        lowLabel: 'Not likely',
        highLabel: 'Extremely likely',
      },
    ],
  },
  {
    id: 'feature_request',
    name: '💡 Feature Request & Priority',
    description: 'Collect new feature ideas, problem statements, and impact',
    title: 'Product Feature Request',
    formDesc: 'Share ideas for improvements or new capabilities you would like to see.',
    questions: [
      {
        title: 'Feature Name / Summary',
        type: 'TEXT' as const,
        required: true,
      },
      {
        title: 'What problem does this feature solve for you?',
        type: 'PARAGRAPH' as const,
        required: true,
      },
      {
        title: 'Urgency / Impact Level',
        type: 'CHOICE' as const,
        required: true,
        options: ['Critical blocker', 'High value nice-to-have', 'Future exploration'],
      },
    ],
  },
];

export const GoogleFormsModal: React.FC<GoogleFormsModalProps> = ({
  isOpen,
  onClose,
  onShareFormToChat,
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'responses'>('browse');
  const [forms, setForms] = useState<GoogleForm[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForm, setSelectedForm] = useState<GoogleForm | null>(null);
  const [isAuthenticatedWithGoogle, setIsAuthenticatedWithGoogle] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Form Creation State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [questions, setQuestions] = useState<GoogleFormQuestion[]>([
    {
      title: 'What is your primary feedback?',
      type: 'CHOICE',
      required: true,
      options: ['Option 1', 'Option 2', 'Option 3'],
    },
  ]);
  const [isCreating, setIsCreating] = useState(false);

  // Responses State
  const [responsesData, setResponsesData] = useState<GoogleFormResponse[]>([]);
  const [loadingResponses, setLoadingResponses] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const token = getGoogleFormsAccessToken();
      if (token) {
        setIsAuthenticatedWithGoogle(true);
        loadForms(token);
      } else {
        setIsAuthenticatedWithGoogle(false);
      }
    }
  }, [isOpen]);

  const loadForms = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await listGoogleForms(token);
      setForms(result);
      if (result.length > 0 && !selectedForm) {
        setSelectedForm(result[0]);
      }
    } catch (err: any) {
      console.error('Failed to load Google Forms:', err);
      setError(err.message || 'Failed to fetch forms from Google Drive.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      const res = await signInWithGoogleForForms();
      if (res?.accessToken) {
        setIsAuthenticatedWithGoogle(true);
        soundEffects.playClickSound();
        await loadForms(res.accessToken);
      }
    } catch (err: any) {
      console.error('Google Sign In for Forms failed:', err);
      setError(err.message || 'Google authentication was cancelled or failed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSelectTemplate = (template: typeof TEMPLATES[0]) => {
    setFormTitle(template.title);
    setFormDescription(template.formDesc);
    setQuestions(JSON.parse(JSON.stringify(template.questions)));
    soundEffects.playTapSound();
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        title: `Question ${prev.length + 1}`,
        type: 'CHOICE',
        required: true,
        options: ['Option 1', 'Option 2'],
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: keyof GoogleFormQuestion, value: any) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddOption = (qIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const opts = updated[qIndex].options || [];
      updated[qIndex] = {
        ...updated[qIndex],
        options: [...opts, `Option ${opts.length + 1}`],
      };
      return updated;
    });
  };

  const handleRemoveOption = (qIndex: number, optIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const opts = updated[qIndex].options || [];
      updated[qIndex] = {
        ...updated[qIndex],
        options: opts.filter((_, i) => i !== optIndex),
      };
      return updated;
    });
  };

  const handleOptionValueChange = (qIndex: number, optIndex: number, val: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const opts = [...(updated[qIndex].options || [])];
      opts[optIndex] = val;
      updated[qIndex] = { ...updated[qIndex], options: opts };
      return updated;
    });
  };

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Please enter a Form title');
      return;
    }

    const token = getGoogleFormsAccessToken();
    if (!token) {
      setError('Please connect with Google first');
      return;
    }

    setIsCreating(true);
    try {
      const newForm = await createGoogleFormWithQuestions(token, {
        title: formTitle.trim(),
        description: formDescription.trim(),
        questions,
      });

      setForms((prev) => [newForm, ...prev]);
      setSelectedForm(newForm);
      setActiveTab('browse');
      setSuccessMessage(`Created Google Form "${newForm.info.title}" successfully!`);
      soundEffects.playSendSound();
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Failed to create form:', err);
      alert(`Error creating form: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleViewResponses = async (form: GoogleForm) => {
    setSelectedForm(form);
    setActiveTab('responses');
    const token = getGoogleFormsAccessToken();
    if (!token) return;

    setLoadingResponses(true);
    try {
      const data = await getGoogleFormResponses(token, form.formId);
      setResponsesData(data.responses);
    } catch (err: any) {
      console.error('Failed to fetch responses:', err);
      setResponsesData([]);
    } finally {
      setLoadingResponses(false);
    }
  };

  const filteredForms = forms.filter((f) =>
    f.info.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.info.description && f.info.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="w-full max-w-5xl h-[90vh] max-h-[820px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">Google Forms & Surveys</h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] font-bold text-purple-300">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Create, share, and inspect Google Forms, polls, and surveys inside ChatMi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Notifications */}
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

        {/* Navigation Tabs */}
        {isAuthenticatedWithGoogle && (
          <div className="px-5 pt-3 border-b border-slate-800 bg-slate-950/40 flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setActiveTab('browse');
                soundEffects.playTapSound();
              }}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'browse'
                  ? 'text-purple-400 border-purple-500 bg-slate-900/90'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>My Forms ({forms.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('create');
                soundEffects.playTapSound();
              }}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'create'
                  ? 'text-purple-400 border-purple-500 bg-slate-900/90'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create New Form</span>
            </button>

            {selectedForm && (
              <button
                onClick={() => {
                  setActiveTab('responses');
                  if (selectedForm) handleViewResponses(selectedForm);
                  soundEffects.playTapSound();
                }}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 'responses'
                    ? 'text-purple-400 border-purple-500 bg-slate-900/90'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>Responses ({responsesData.length})</span>
              </button>
            )}
          </div>
        )}

        {/* Tab Contents */}
        {!isAuthenticatedWithGoogle ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900/50">
            <div className="w-16 h-16 rounded-3xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Connect Google Forms</h4>
            <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
              Connect your Google Workspace Account to manage forms, build live interactive polls, collect responses, and share surveys in chat channels.
            </p>

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
              <span>{isSigningIn ? 'Connecting to Google...' : 'Sign in with Google Forms'}</span>
            </button>
            <div className="flex items-center gap-1.5 mt-4 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>OAuth 2.0 authorized with Google Forms & Google Drive scopes</span>
            </div>
          </div>
        ) : activeTab === 'browse' ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Column: Forms List */}
            <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col shrink-0 bg-slate-950/40">
              {/* Search Bar */}
              <div className="p-3 border-b border-slate-800 flex flex-col gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Google Forms..."
                    className="w-full bg-slate-900 text-xs text-white pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500 font-medium"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-bold text-slate-400">{filteredForms.length} Forms</span>
                  <button
                    onClick={() => {
                      const token = getGoogleFormsAccessToken();
                      if (token) loadForms(token);
                    }}
                    disabled={loading}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {loading ? (
                  <div className="p-8 text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-slate-400 font-medium">Fetching Forms from Google Drive...</p>
                  </div>
                ) : filteredForms.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">No Google Forms found.</p>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="text-xs font-bold text-purple-400 hover:underline"
                    >
                      + Create your first form now
                    </button>
                  </div>
                ) : (
                  filteredForms.map((f) => {
                    const isSelected = selectedForm?.formId === f.formId;
                    return (
                      <div
                        key={f.formId}
                        onClick={async () => {
                          setSelectedForm(f);
                          soundEffects.playTapSound();
                          // Fetch full questions
                          const token = getGoogleFormsAccessToken();
                          if (token) {
                            try {
                              const detailed = await getGoogleForm(token, f.formId);
                              setSelectedForm(detailed);
                            } catch (e) {
                              console.warn('Could not load detailed form structure:', e);
                            }
                          }
                        }}
                        className={`p-3 rounded-2xl cursor-pointer border transition-all ${
                          isSelected
                            ? 'bg-purple-600/20 border-purple-500/70 text-white'
                            : 'bg-slate-900/50 border-slate-800/60 hover:bg-slate-850 text-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-bold text-white truncate">{f.info.title}</h5>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                              {f.info.description || 'No description'}
                            </p>
                            {f.modifiedTime && (
                              <p className="text-[10px] text-slate-500 mt-1">
                                Modified {new Date(f.modifiedTime).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Form Overview & Actions */}
            <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto bg-slate-900">
              {selectedForm ? (
                <div className="space-y-6 max-w-2xl mx-auto w-full">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold uppercase border border-purple-500/30">
                        Google Form Details
                      </span>
                      <a
                        href={selectedForm.webViewLink || `https://docs.google.com/forms/d/${selectedForm.formId}/edit`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-bold"
                      >
                        <span>Open in Google Forms</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{selectedForm.info.title}</h3>
                    {selectedForm.info.description && (
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                        {selectedForm.info.description}
                      </p>
                    )}
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    {onShareFormToChat && (
                      <button
                        onClick={() => {
                          onShareFormToChat(selectedForm);
                          onClose();
                          soundEffects.playSendSound();
                        }}
                        className="py-3 px-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white flex flex-col items-center gap-1 text-xs font-bold transition-all shadow-lg shadow-purple-600/25"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share in Active Chat</span>
                      </button>
                    )}

                    <a
                      href={selectedForm.responderUri || `https://docs.google.com/forms/d/e/${selectedForm.formId}/viewform`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 flex flex-col items-center gap-1 text-xs font-bold transition-all text-center"
                    >
                      <Send className="w-4 h-4 text-emerald-400" />
                      <span>Fill Out Form</span>
                    </a>

                    <button
                      onClick={() => handleViewResponses(selectedForm)}
                      className="py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 flex flex-col items-center gap-1 text-xs font-bold transition-all"
                    >
                      <BarChart2 className="w-4 h-4 text-indigo-400" />
                      <span>View Live Responses</span>
                    </button>
                  </div>

                  {/* Form Questions Preview */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Questions Included {selectedForm.items ? `(${selectedForm.items.length})` : ''}
                    </h4>

                    {selectedForm.items && selectedForm.items.length > 0 ? (
                      <div className="space-y-2">
                        {selectedForm.items.map((item, idx) => (
                          <div key={item.itemId || idx} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white">
                                {idx + 1}. {item.title || 'Untitled question'}
                              </span>
                              {item.questionItem?.question.required && (
                                <span className="text-[10px] text-rose-400 font-bold">*Required</span>
                              )}
                            </div>
                            {item.questionItem?.question.choiceQuestion?.options && (
                              <div className="mt-2 space-y-1 pl-2">
                                {item.questionItem.question.choiceQuestion.options.map((opt, oIdx) => (
                                  <div key={oIdx} className="flex items-center gap-2 text-slate-400 text-[11px]">
                                    <div className="w-2 h-2 rounded-full bg-purple-500/50" />
                                    <span>{opt.value}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">
                        Questions structure can be viewed directly in Google Forms.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400">
                  <FileText className="w-12 h-12 text-slate-600 mb-3" />
                  <p className="text-sm font-semibold">Select a Form to inspect details or share to chat</p>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'create' ? (
          /* Tab 2: Create Form & Quick Templates */
          <div className="flex-1 p-6 overflow-y-auto bg-slate-900 space-y-6">
            {/* Quick Templates Row */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                1-Click Templates
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl)}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/60 hover:bg-slate-850 cursor-pointer transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                        {tmpl.name}
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {tmpl.description}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-purple-400 mt-3 block">
                      Use Template →
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Builder Fields */}
            <form onSubmit={handleCreateForm} className="space-y-5 max-w-3xl">
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Form Title *</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                    placeholder="e.g. Q3 Sprint Retrospective Survey"
                    className="w-full p-2.5 bg-slate-900 text-xs text-white rounded-xl border border-slate-800 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Description / Instructions</label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={2}
                    placeholder="Provide brief context for respondents..."
                    className="w-full p-2.5 bg-slate-900 text-xs text-white rounded-xl border border-slate-800 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Questions ({questions.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>

                {questions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-3 transition-all"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={q.title}
                          onChange={(e) => handleQuestionChange(qIdx, 'title', e.target.value)}
                          placeholder={`Question ${qIdx + 1}`}
                          className="w-full bg-transparent text-xs font-bold text-white border-b border-slate-800 focus:border-purple-500 focus:outline-none pb-1"
                        />
                      </div>

                      {/* Question Type Selector */}
                      <select
                        value={q.type}
                        onChange={(e) => handleQuestionChange(qIdx, 'type', e.target.value as any)}
                        className="bg-slate-900 text-slate-200 text-xs px-2.5 py-1.5 rounded-xl border border-slate-700"
                      >
                        <option value="CHOICE">Multiple Choice (Radio)</option>
                        <option value="CHECKBOX">Checkboxes (Multiple Select)</option>
                        <option value="TEXT">Short Text Answer</option>
                        <option value="PARAGRAPH">Paragraph Text</option>
                        <option value="SCALE">Linear Scale (1-5)</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        disabled={questions.length === 1}
                        className="p-1 text-slate-500 hover:text-rose-400 disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Option Choices editor */}
                    {(q.type === 'CHOICE' || q.type === 'CHECKBOX') && (
                      <div className="space-y-2 pl-2">
                        {(q.options || []).map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full border border-purple-500/50" />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleOptionValueChange(qIdx, oIdx, e.target.value)}
                              className="flex-1 bg-slate-900 text-xs text-white px-2.5 py-1 rounded-lg border border-slate-800"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(qIdx, oIdx)}
                              disabled={(q.options || []).length <= 1}
                              className="text-slate-500 hover:text-rose-400 text-xs px-1"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleAddOption(qIdx)}
                          className="text-[11px] font-bold text-purple-400 hover:underline pl-5"
                        >
                          + Add option
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('browse')}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !formTitle.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-xs font-bold text-white shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isCreating ? 'Publishing to Google Forms...' : 'Publish Google Form'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Tab 3: Responses Viewer */
          <div className="flex-1 p-6 overflow-y-auto bg-slate-900 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h4 className="text-lg font-bold text-white">{selectedForm?.info.title}</h4>
                <p className="text-xs text-slate-400">
                  {responsesData.length} submissions received
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => selectedForm && handleViewResponses(selectedForm)}
                  disabled={loadingResponses}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingResponses ? 'animate-spin' : ''}`} />
                  <span>Refresh Responses</span>
                </button>
                <a
                  href={`https://docs.google.com/forms/d/${selectedForm?.formId}/edit#responses`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 flex items-center gap-1.5"
                >
                  <span>Open Sheet / Analytics</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {loadingResponses ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Loading form responses...</p>
              </div>
            ) : responsesData.length === 0 ? (
              <div className="p-12 text-center bg-slate-950/50 rounded-2xl border border-slate-800 space-y-2">
                <BarChart2 className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-white">No Responses Yet</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Share this form link to active chat channels or email to collect submissions from your team.
                </p>
                {selectedForm && onShareFormToChat && (
                  <button
                    onClick={() => {
                      onShareFormToChat(selectedForm);
                      onClose();
                    }}
                    className="mt-3 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500"
                  >
                    Share Form to Active Chat
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {responsesData.map((resp, rIdx) => (
                  <div
                    key={resp.responseId || rIdx}
                    className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                      <span>Response #{rIdx + 1}</span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(resp.lastSubmittedTime || resp.createTime).toLocaleString()}
                      </span>
                    </div>

                    {resp.answers && (
                      <div className="space-y-2 pt-2 border-t border-slate-800/80">
                        {Object.entries(resp.answers).map(([qId, ans]) => (
                          <div key={qId} className="text-xs">
                            <span className="text-slate-400 font-medium">Answer: </span>
                            <span className="text-slate-100 font-semibold">
                              {ans.textAnswers?.answers?.map((a) => a.value).join(', ') || '—'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
