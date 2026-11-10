import React, { useState } from 'react';
import {
  MessageSquare,
  Phone,
  Send,
  Heart,
  Check,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export const FeedbackFooter: React.FC = () => {
  const [feedbackText, setFeedbackText] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [showQuickForm, setShowQuickForm] = useState(false);

  const developerName = 'Lukhman';
  const developerPhone = '+91-7019192462';
  const cleanPhone = '917019192462';

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    const message = encodeURIComponent(
      `Hello Lukhman, I am using the Alternate Wire Gauge Calculator for Ralfin Electricals.\n\nFeedback / Feature Suggestion:\n${feedbackText}`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setFeedbackText('');
      setShowQuickForm(false);
    }, 2000);
  };

  return (
    <footer className="mt-8 bg-slate-900 border-t border-slate-800 text-white">
      {/* Top Banner: Developer Feedback Callout */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-orange-700 py-3.5 px-3 sm:px-6 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-900/40 rounded-xl border border-amber-300/40 shrink-0">
              <MessageSquare className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-extrabold text-white">
                Have suggestions or need additional motor winding features?
              </p>
              <p className="text-xs sm:text-sm text-amber-50 font-medium leading-relaxed mt-1">
                Please send your feedback regarding improvements and additional features you need, to developer{' '}
                <strong className="text-white underline font-bold">{developerName}</strong> at{' '}
                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    'Hello Lukhman, I have a suggestion/feedback for the Alternate Wire Gauge Calculator for Ralfin Electricals:'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-extrabold text-white hover:text-amber-200 transition underline underline-offset-2"
                >
                  {developerPhone}
                </a>{' '}
                <span className="inline-block px-2.5 py-1 ml-1 text-xs font-bold bg-slate-950/90 text-amber-300 border border-amber-300/50 rounded-lg shadow-xs">
                  (Kindly do not call, please send a message instead)
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                'Hello Lukhman, I have a suggestion/feedback for the Alternate Wire Gauge Calculator for Ralfin Electricals:'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition shadow-xs"
              title="WhatsApp Developer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => setShowQuickForm(!showQuickForm)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-800/80 hover:bg-amber-900 text-amber-100 border border-amber-400/40 transition"
            >
              {showQuickForm ? 'Close' : 'Quick Feedback'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick feedback expansion drawer */}
      {showQuickForm && (
        <div className="bg-slate-800/90 border-b border-slate-700 py-4 px-3 sm:px-6">
          <form
            onSubmit={handleSendFeedback}
            className="max-w-xl mx-auto space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Send Suggestion or Feature Request to Lukhman</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Direct to +91-7019192462
              </span>
            </div>

            <textarea
              rows={3}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Type your feedback, bug report, or feature request here (e.g., dual-frequency charts, slot fullness calculator, aluminum-to-copper conversion)..."
              className="w-full p-2.5 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              required
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowQuickForm(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition shadow-xs"
              >
                {isSent ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Sent!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send via WhatsApp</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Footer Details */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <p className="font-semibold text-slate-200">
              Ralfin Electricals — Motor Winding Division
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Specialists in industrial AC/DC motor rewinding, coil design, and magnetic wire engineering.
            </p>
          </div>

          <div className="text-center sm:text-right text-[11px]">
            <p>
              Alternate Wire Gauge Calculator • Developed by{' '}
              <strong className="text-slate-300">Lukhman</strong>
            </p>
            <p className="text-slate-500 mt-0.5">
              Feedback & Suggestions (WhatsApp / Message only): <strong className="text-amber-400">+91-7019192462</strong>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
