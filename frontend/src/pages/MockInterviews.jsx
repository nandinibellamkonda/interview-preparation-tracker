import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockInterviewService } from '../services/api.js';
import { CalendarDays, Edit3, Loader2, Plus, RefreshCcw, Star, Trash2 } from 'lucide-react';

const sortOptions = [
  { value: 'dateDesc', label: 'Newest first' },
  { value: 'dateAsc', label: 'Oldest first' },
  { value: 'scoreDesc', label: 'Score: high to low' },
  { value: 'scoreAsc', label: 'Score: low to high' },
];

const initialForm = {
  date: '',
  platform: '',
  score: '',
  feedback: '',
};

const MockInterviews = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [platformFilter, setPlatformFilter] = useState('All');
  const [sortOption, setSortOption] = useState('dateDesc');

  const loadInterviews = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await mockInterviewService.getMockInterviews();
      setInterviews(data || []);
    } catch (err) {
      setError(err.message || 'Unable to load mock interviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const platformOptions = useMemo(() => {
    const platforms = interviews.map((item) => item.platform).filter(Boolean);
    return ['All', ...Array.from(new Set(platforms))];
  }, [interviews]);

  const summary = useMemo(() => {
    if (!interviews.length) {
      return {
        total: 0,
        averageScore: 0,
        highestScore: 0,
        latestFeedback: 'No mock interviews yet.',
      };
    }

    const total = interviews.length;
    const scores = interviews.map((item) => Number(item.score) || 0);
    const averageScore = Math.round(scores.reduce((sum, value) => sum + value, 0) / total);
    const highestScore = Math.max(...scores);
    const latestInterview = [...interviews].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))[0];
    const latestFeedback = latestInterview?.feedback?.trim() ? latestInterview.feedback : 'No feedback recorded yet.';

    return { total, averageScore, highestScore, latestFeedback };
  }, [interviews]);

  const filteredInterviews = useMemo(() => {
    const filtered = interviews.filter((item) => {
      const matchesPlatform = platformFilter === 'All' || item.platform === platformFilter;
      return matchesPlatform;
    });

    return filtered.sort((a, b) => {
      if (sortOption === 'dateAsc' || sortOption === 'dateDesc') {
        const aDate = new Date(a.date || a.createdAt).getTime();
        const bDate = new Date(b.date || b.createdAt).getTime();
        return sortOption === 'dateAsc' ? aDate - bDate : bDate - aDate;
      }
      const aScore = Number(a.score) || 0;
      const bScore = Number(b.score) || 0;
      return sortOption === 'scoreAsc' ? aScore - bScore : bScore - aScore;
    });
  }, [interviews, platformFilter, sortOption]);

  const validateForm = () => {
    if (!form.date || !form.platform) {
      setError('Date and platform are required.');
      return false;
    }
    const value = Number(form.score);
    if (Number.isNaN(value) || value < 0 || value > 100) {
      setError('Score must be a number between 0 and 100.');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError('');
    setMessage('');
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      setSaving(true);
      setError('');
      setMessage('');
      const payload = {
        date: form.date,
        platform: form.platform,
        score: Number(form.score),
        feedback: form.feedback,
      };

      if (editingId) {
        await mockInterviewService.updateMockInterview(editingId, payload);
        setMessage('Interview record updated successfully.');
      } else {
        await mockInterviewService.createMockInterview(payload);
        setMessage('Interview record added successfully.');
      }

      await loadInterviews();
      resetForm();
    } catch (err) {
      setError(err.message || 'Unable to save interview record.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      date: item.date ? item.date.split('T')[0] : '',
      platform: item.platform || '',
      score: item.score?.toString() || '',
      feedback: item.feedback || '',
    });
    setError('');
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this mock interview record?')) return;
    try {
      setSaving(true);
      setError('');
      await mockInterviewService.deleteMockInterview(id);
      setMessage('Interview record deleted successfully.');
      await loadInterviews();
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err.message || 'Unable to delete record.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return 'N/A';
    try {
      return new Date(value).toLocaleDateString();
    } catch {
      return value;
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Mock interview history</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Manage your mock interview performance</h1>
            <p className="mt-2 text-slate-400 max-w-2xl">Capture sessions, compare scores, and keep qualitative feedback for continuous improvement.</p>
          </div>
          <button
            type="button"
            onClick={loadInterviews}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm font-semibold text-slate-200 hover:border-indigo-500"
          >
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Total records</p>
          <p className="mt-4 text-4xl font-semibold text-white">{summary.total}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Average score</p>
          <p className="mt-4 text-4xl font-semibold text-white">{summary.averageScore}%</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Highest score</p>
          <p className="mt-4 text-4xl font-semibold text-white">{summary.highestScore}%</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Latest feedback</p>
          <p className="mt-4 text-base text-slate-300">{summary.latestFeedback}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Add mock interview</h2>
              <p className="mt-2 text-sm text-slate-400">Log a new session or update an existing record.</p>
            </div>
            <div className="rounded-2xl bg-slate-900 px-4 py-3 text-sm text-slate-300 inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" /> {user?.fullName?.split(' ')[0] || 'You'}
            </div>
          </div>

          {error && <div className="mt-6 rounded-2xl bg-red-950/40 p-4 text-sm text-red-300">{error}</div>}
          {message && <div className="mt-6 rounded-2xl bg-emerald-950/40 p-4 text-sm text-emerald-300">{message}</div>}

          <div className="mt-6 grid gap-4">
            <label className="block text-sm font-medium text-slate-300">
              Date
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Platform
              <input
                value={form.platform}
                onChange={(e) => setForm((prev) => ({ ...prev, platform: e.target.value }))}
                placeholder="Zoom, Phone screen, LeetCode mock"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Score
              <input
                type="number"
                min="0"
                max="100"
                value={form.score}
                onChange={(e) => setForm((prev) => ({ ...prev, score: e.target.value }))}
                placeholder="0 - 100"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Feedback
              <textarea
                value={form.feedback}
                onChange={(e) => setForm((prev) => ({ ...prev, feedback: e.target.value }))}
                rows={5}
                placeholder="Summarize what went well and what to improve."
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" /> {editingId ? 'Update record' : 'Add record'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-[#101626] px-5 py-3 text-sm font-semibold text-slate-200 hover:border-indigo-500"
              >
                Reset form
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Filters & sorting</h2>
              <p className="mt-2 text-sm text-slate-400">Refine the interview history view for quick review.</p>
            </div>
            <div className="rounded-2xl bg-slate-900 px-4 py-3 text-sm text-slate-300 inline-flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-300" /> {filteredInterviews.length} records
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-300">
              Platform
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              >
                {platformOptions.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Sort by
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Interview history</h2>
            <p className="mt-2 text-sm text-slate-400">Browse your mock interview records in a responsive table or mobile cards.</p>
          </div>
          {loading && (
            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm text-slate-300">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading records
            </div>
          )}
        </div>

        {error && <div className="mt-6 rounded-2xl bg-red-950/40 p-4 text-sm text-red-300">{error}</div>}
        {!loading && filteredInterviews.length === 0 && (
          <div className="mt-6 rounded-3xl border border-slate-800 bg-[#121A2D] p-6 text-slate-400">No mock interview records match the current filters.</div>
        )}

        {!loading && filteredInterviews.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="hidden md:block">
              <table className="w-full border-collapse text-left text-sm text-slate-300">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400">
                    <th className="py-4 pl-4 pr-6 font-medium">Date</th>
                    <th className="py-4 px-6 font-medium">Platform</th>
                    <th className="py-4 px-6 font-medium">Score</th>
                    <th className="py-4 px-6 font-medium">Feedback</th>
                    <th className="py-4 pr-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInterviews.map((item) => (
                    <tr key={item._id} className="border-b border-slate-800 hover:bg-slate-950/20">
                      <td className="py-4 pl-4 pr-6 text-white">{formatDate(item.date)}</td>
                      <td className="py-4 px-6">{item.platform}</td>
                      <td className="py-4 px-6">{item.score}%</td>
                      <td className="py-4 px-6 text-slate-400">{item.feedback || 'No feedback'}</td>
                      <td className="py-4 pr-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="mr-2 inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-[#101626] px-3 py-2 text-xs font-semibold text-slate-200 hover:border-indigo-500"
                        >
                          <Edit3 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id)}
                          disabled={saving}
                          className="inline-flex items-center gap-2 rounded-2xl border border-red-700 bg-[#170B12] px-3 py-2 text-xs font-semibold text-red-300 hover:border-red-500 disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 md:hidden">
              {filteredInterviews.map((item) => (
                <div key={item._id} className="rounded-3xl border border-slate-800 bg-[#121A2D] p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{formatDate(item.date)}</p>
                      <h3 className="mt-2 text-lg font-semibold text-white">{item.platform}</h3>
                    </div>
                    <div className="rounded-2xl bg-slate-900 px-3 py-1 text-sm uppercase tracking-[0.3em] text-slate-300">{item.score}%</div>
                  </div>

                  <p className="mt-4 text-sm text-slate-400">{item.feedback || 'No feedback recorded.'}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-[#101626] px-4 py-2 text-sm font-semibold text-slate-200 hover:border-indigo-500"
                    >
                      <Edit3 className="h-4 w-4" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-2xl border border-red-700 bg-[#170B12] px-4 py-2 text-sm font-semibold text-red-300 hover:border-red-500 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterviews;
