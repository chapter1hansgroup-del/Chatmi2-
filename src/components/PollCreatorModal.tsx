import React, { useState } from 'react';
import { X, Plus, Trash2, BarChart2 } from 'lucide-react';

interface PollCreatorModalProps {
  onClose: () => void;
  onCreatePoll: (question: string, options: string[]) => void;
}

export const PollCreatorModal: React.FC<PollCreatorModalProps> = ({ onClose, onCreatePoll }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['Option 1', 'Option 2']);

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, `Option ${options.length + 1}`]);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    const validOptions = options.filter((o) => o.trim() !== '');
    if (validOptions.length < 2) return;

    onCreatePoll(question, validOptions);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-purple-400" /> Create Interactive Poll
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300">Poll Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Which feature should we prioritize next sprint?"
            className="w-full bg-slate-800 text-slate-100 text-sm p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Options List */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-300">Options</label>
          {options.map((option, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                placeholder={`Option ${idx + 1}`}
                className="flex-1 bg-slate-800 text-slate-100 text-xs p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500"
              />
              {options.length > 2 && (
                <button
                  onClick={() => handleRemoveOption(idx)}
                  className="p-2 text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {options.length < 6 && (
            <button
              onClick={handleAddOption}
              className="mt-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-400 text-xs font-bold flex items-center justify-center gap-1 border border-slate-700"
            >
              <Plus className="w-4 h-4" /> Add Option
            </button>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!question.trim() || options.filter((o) => o.trim()).length < 2}
          className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold transition-transform active:scale-95 shadow-lg shadow-purple-600/30"
        >
          Publish Poll
        </button>
      </div>
    </div>
  );
};
