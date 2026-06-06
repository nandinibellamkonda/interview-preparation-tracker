import React, { useEffect, useState } from 'react';
import { flashcardService } from '../services/api.js';
import { RotateCcw, CheckCircle2, XCircle } from 'lucide-react';

const Flashcards = () => {
  const [cards, setCards] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFlashcards = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await flashcardService.getFlashcardsForReview();
      setCards(response.flashcards || []);
      setActiveCard(null);
      setIsFlipped(false);
    } catch (err) {
      setError(err.message || 'Unable to load flashcards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlashcards();
  }, []);

  const handleReview = async (isCorrect) => {
    if (!activeCard) return;
    setLoading(true);
    try {
      await flashcardService.updateFlashcardReview(undefined, activeCard._id, { isCorrect });
      await loadFlashcards();
    } catch (err) {
      setError(err.message || 'Unable to update card review.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Flashcards</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Flashcards Review</h1>
        <p className="mt-2 text-slate-400 max-w-2xl">Practice spaced-repetition cards and mark your confidence for review readiness.</p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6 text-slate-400">Loading flashcards...</div>
      ) : error ? (
        <div className="rounded-3xl border border-red-800 bg-red-950/40 p-6 text-red-300">{error}</div>
      ) : cards.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6 text-slate-300">
          No review flashcards are due right now. Add flashcards in the tracker or revisit topics later.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Review Queue</h2>
                <p className="text-sm text-slate-500">Select a card and flip to see the answer.</p>
              </div>
              <button type="button" onClick={loadFlashcards} className="rounded-2xl border border-slate-700 bg-[#101626] px-4 py-2 text-sm text-slate-300 hover:border-indigo-500">
                <RotateCcw className="inline h-4 w-4 mr-2" /> Refresh
              </button>
            </div>

            <div className="space-y-3">
              {cards.map((card) => (
                <button
                  key={card._id}
                  type="button"
                  onClick={() => { setActiveCard(card); setIsFlipped(false); }}
                  className={`w-full text-left rounded-3xl border px-4 py-4 transition ${activeCard?._id === card._id ? 'border-indigo-500 bg-slate-900 text-white' : 'border-slate-700 bg-[#121A2D] text-slate-300 hover:border-indigo-500'}`}>
                  <div className="font-semibold">{card.category || 'General'}</div>
                  <div className="text-sm text-slate-400 mt-1">{card.question}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
            <h2 className="text-xl font-semibold text-white">Card Detail</h2>
            {activeCard ? (
              <>
                <div className="mt-4 rounded-3xl bg-[#121A2D] p-6 min-h-[220px] text-slate-200">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Question</p>
                  <p className="mt-3 text-lg font-semibold text-white">{activeCard.question}</p>
                  {isFlipped && (
                    <div className="mt-6 rounded-3xl bg-[#0F172A] p-4 text-slate-300">
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Answer</p>
                      <p className="mt-3 text-base text-white">{activeCard.answer}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFlipped((prev) => !prev)}
                    className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500">
                    {isFlipped ? 'Hide Answer' : 'Flip Card'}
                  </button>
                  {isFlipped && (
                    <div className="grid gap-3">
                      <button
                        type="button"
                        onClick={() => handleReview(true)}
                        className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> Mark Correct
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReview(false)}
                        className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-500 flex items-center justify-center gap-2">
                        <XCircle className="h-4 w-4" /> Mark Incorrect
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="mt-4 text-slate-400">Select a flashcard to begin review.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
