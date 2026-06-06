import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dsaService } from '../services/api.js';
import { CheckCircle2, Trash2, Plus, Pencil, MessageSquare, Layers } from 'lucide-react';

const topicOptions = [
  'Arrays', 'Strings', 'Linked Lists', 'Stack', 'Queue', 'Trees', 'Graphs', 'Binary Search', 'Heap', 'Greedy', 'Backtracking', 'Dynamic Programming'
];
const difficultyOptions = ['Easy', 'Medium', 'Hard'];
const platformOptions = ['LeetCode', 'HackerRank', 'CodeChef', 'GeeksforGeeks', 'Other'];

const initialForm = {
  title: '',
  description: '',
  topic: 'Arrays',
  difficulty: 'Easy',
  platform: 'LeetCode',
  platformLink: '',
  notes: '',
  confidenceRating: 5,
  isSolved: false,
};

const DSATracker = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await dsaService.getQuestions();
      setQuestions(response.questions || []);
    } catch (err) {
      setError(err.message || 'Unable to load DSA questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError('');
  };

  const handleInput = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveQuestion = async () => {
    if (!form.title.trim()) {
      setError('Question title is required.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        confidenceRating: Number(form.confidenceRating),
        dateSolved: form.isSolved ? new Date() : undefined,
      };

      if (editingId) {
        await dsaService.updateQuestion(undefined, editingId, payload);
      } else {
        await dsaService.createQuestion(undefined, payload);
      }

      await loadQuestions();
      resetForm();
    } catch (err) {
      setError(err.message || 'Unable to save question');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (question) => {
    setEditingId(question._id);
    setForm({
      title: question.title,
      description: question.description || '',
      topic: question.topic || 'Arrays',
      difficulty: question.difficulty || 'Easy',
      platform: question.platform || 'LeetCode',
      platformLink: question.platformLink || '',
      notes: question.notes || '',
      confidenceRating: question.confidenceRating || 5,
      isSolved: question.isSolved || false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question permanently?')) return;
    try {
      setSaving(true);
      await dsaService.deleteQuestion(undefined, id);
      await loadQuestions();
    } catch (err) {
      setError(err.message || 'Unable to delete question');
    } finally {
      setSaving(false);
    }
  };

  const toggleSolved = async (question) => {
    try {
      setSaving(true);
      await dsaService.updateQuestion(token, question._id, {
        isSolved: !question.isSolved,
        dateSolved: !question.isSolved ? new Date() : question.dateSolved,
      });
      await loadQuestions();
    } catch (err) {
      setError(err.message || 'Unable to toggle solved state');
    } finally {
      setSaving(false);
    }
  };

  const renderQuestionList = () => {
    if (loading) {
      return <p className="text-slate-500">Loading questions...</p>;
    }

    if (questions.length === 0) {
      return <p className="text-slate-500">No questions yet. Use the form to add your first entry.</p>;
    }

    return (
      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question._id} className="rounded-3xl border border-slate-800 bg-[#121A2D] p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-slate-400">
                  <span>{question.topic}</span>
                  <span>-</span>
                  <span>{question.difficulty}</span>
                  <span>-</span>
                  <span>{question.platform}</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-white">{question.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{question.description || 'No problem description provided.'}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(question)}
                  className="rounded-2xl border border-slate-700 bg-[#0F172A] px-4 py-2 text-sm text-slate-200 hover:border-indigo-500"
                >
                  <Pencil className="inline h-4 w-4" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => toggleSolved(question)}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold ${question.isSolved ? 'bg-emerald-600 text-white' : 'border border-slate-700 bg-[#0F172A] text-slate-200 hover:border-indigo-500'}`}
                >
                  <CheckCircle2 className="inline h-4 w-4" /> {question.isSolved ? 'Solved' : 'Mark solved'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(question._id)}
                  className="rounded-2xl border border-red-700 bg-[#170B12] px-4 py-2 text-sm text-red-300 hover:border-red-500"
                >
                  <Trash2 className="inline h-4 w-4" /> Delete
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span>Confidence: {question.confidenceRating}/10</span>
              <span>Notes: {question.notes ? question.notes.slice(0, 80) : 'No notes'}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">DSA Tracker</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Question tracker and practice log</h1>
            <p className="mt-2 text-slate-400 max-w-2xl">Add new DSA tasks, update progress, and mark problems solved as you move through topics.</p>
          </div>
          <div className="rounded-3xl bg-[#0F172A] border border-slate-800 p-4 text-sm text-slate-300">
            <p className="font-semibold text-slate-100">Current XP</p>
            <p className="mt-1 text-lg text-white">{user?.xp ?? 0} XP</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Add / edit DSA question</h2>
                <p className="text-sm text-slate-500">Capture topic, platform, difficulty and notes.</p>
              </div>
              <Plus className="h-5 w-5 text-slate-400" />
            </div>

            {error && <div className="mb-4 rounded-2xl bg-red-950/40 p-4 text-sm text-red-300">{error}</div>}

            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => handleInput('title', e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  placeholder="Example: Two-sum with optimized search"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleInput('description', e.target.value)}
                  className="mt-2 h-28 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  placeholder="Add notes or problem statement details"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-300">Topic</label>
                  <select
                    value={form.topic}
                    onChange={(e) => handleInput('topic', e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  >
                    {topicOptions.map((topic) => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => handleInput('difficulty', e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  >
                    {difficultyOptions.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-300">Platform</label>
                  <select
                    value={form.platform}
                    onChange={(e) => handleInput('platform', e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  >
                    {platformOptions.map((platform) => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Confidence rating</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={form.confidenceRating}
                    onChange={(e) => handleInput('confidenceRating', Number(e.target.value))}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Platform link</label>
                <input
                  value={form.platformLink}
                  onChange={(e) => handleInput('platformLink', e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  placeholder="https://leetcode.com/problems/two-sum"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => handleInput('notes', e.target.value)}
                  className="mt-2 h-24 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  placeholder="Write quick reminder notes for later review"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.isSolved}
                    onChange={(e) => handleInput('isSolved', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500"
                  />
                  Mark solved
                </label>
                <button
                  type="button"
                  onClick={saveQuestion}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                >
                  <span>{editingId ? 'Update question' : 'Add question'}</span>
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-2xl border border-slate-700 bg-[#101626] px-5 py-3 text-sm font-semibold text-slate-300 hover:border-indigo-500"
                  >
                    Cancel edit
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="rounded-2xl bg-slate-900 p-3 text-slate-300">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Focus summary</h2>
                <p className="text-sm text-slate-500">Track solved questions and active refresh items.</p>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-3xl bg-[#121A2D] p-4 text-sm text-slate-300">
                <p className="font-medium text-slate-100">Total Questions</p>
                <p className="mt-3 text-3xl font-semibold text-white">{questions.length}</p>
              </div>
              <div className="rounded-3xl bg-[#121A2D] p-4 text-sm text-slate-300">
                <p className="font-medium text-slate-100">Solved</p>
                <p className="mt-3 text-3xl font-semibold text-white">{questions.filter((question) => question.isSolved).length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-semibold text-white">DSA Questions</h2>
              <p className="text-sm text-slate-500">Edit, delete, or mark solved directly from your question list.</p>
            </div>
            <MessageSquare className="h-5 w-5 text-slate-400" />
          </div>

          {renderQuestionList()}
        </div>
      </div>
  );
};

export default DSATracker;
