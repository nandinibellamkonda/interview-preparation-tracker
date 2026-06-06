import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { javaService } from '../services/api.js';
import { BookOpen, Plus, Pencil, Trash2, BarChart3 } from 'lucide-react';

const topicOptions = [
  'OOP', 'Inheritance', 'Polymorphism', 'Abstraction', 'Encapsulation',
  'Collections Framework', 'Exception Handling', 'Multithreading',
  'JVM', 'JDK vs JRE', 'Garbage Collection', 'Streams API',
  'Generics', 'File Handling', 'Serialization',
];

const initialForm = {
  topicName: 'OOP',
  progressPercentage: 0,
  confidenceRating: 5,
  notes: '',
};

const JavaTracker = () => {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadTopics = async () => {
    try {
      setLoading(true);
      const response = await javaService.getTopics(user?.token);
      setTopics(response.topics || []);
    } catch (err) {
      setError(err.message || 'Unable to load Java tracker');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError('');
  };

  const handleInput = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveTopic = async () => {
    if (!form.topicName) {
      setError('Topic name is required.');
      return;
    }
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...form,
        progressPercentage: Number(form.progressPercentage),
        confidenceRating: Number(form.confidenceRating),
      };

      await javaService.createOrUpdateTopic(user?.token, payload);
      await loadTopics();
      resetForm();
    } catch (err) {
      setError(err.message || 'Unable to save Java topic');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (topic) => {
    setEditingId(topic._id);
    setForm({
      topicName: topic.topicName,
      progressPercentage: topic.progressPercentage || 0,
      confidenceRating: topic.confidenceRating || 5,
      notes: topic.notes || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this Java topic?')) return;
    try {
      setSaving(true);
      await javaService.deleteTopic(undefined, id);
      await loadTopics();
    } catch (err) {
      setError(err.message || 'Unable to delete topic');
    } finally {
      setSaving(false);
    }
  };

  const renderTopicList = () => {
    if (loading) {
      return <p className="text-slate-500">Loading core Java topics...</p>;
    }

    if (topics.length === 0) {
      return <p className="text-slate-500">No Java topics saved yet. Add your first topic above.</p>;
    }

    return (
      <div className="space-y-4">
        {topics.map((topic) => (
          <div key={topic._id} className="rounded-3xl border border-slate-800 bg-[#121A2D] p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{topic.topicName}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">Progress: {topic.progressPercentage}%</h3>
                <p className="mt-2 text-sm text-slate-400">Confidence: {topic.confidenceRating}/10</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(topic)}
                  className="rounded-2xl border border-slate-700 bg-[#0F172A] px-4 py-2 text-sm text-slate-200 hover:border-indigo-500"
                >
                  <Pencil className="inline h-4 w-4" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(topic._id)}
                  className="rounded-2xl border border-red-700 bg-[#170B12] px-4 py-2 text-sm text-red-300 hover:border-red-500"
                >
                  <Trash2 className="inline h-4 w-4" /> Delete
                </button>
              </div>
            </div>
            <div className="mt-4 rounded-3xl bg-[#0F172A] p-4 text-sm text-slate-300">
              <p>{topic.notes || 'No notes added for this topic yet.'}</p>
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
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Java Tracker</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Core Java topics, progress and confidence</h1>
          <p className="mt-2 text-slate-400 max-w-2xl">Keep your Java study plan updated with progress scores, confidence ratings, and notes.</p>
        </div>
        <div className="rounded-3xl bg-[#0F172A] border border-slate-800 p-4 text-sm text-slate-300">
          <p className="font-semibold text-slate-100">Saved Topics</p>
          <p className="mt-1 text-lg text-white">{topics.length}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Update Java progress</h2>
              <p className="text-sm text-slate-500">Choose a topic and capture your current readiness level.</p>
            </div>
            <Plus className="h-5 w-5 text-slate-400" />
          </div>

          {error && (
            <div className="mb-4 rounded-2xl bg-red-950/40 p-4 text-sm text-red-300">{error}</div>
          )}

          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300">Topic</label>
              <select
                value={form.topicName}
                onChange={(e) => handleInput('topicName', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              >
                {topicOptions.map((topic) => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-300">Progress %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.progressPercentage}
                  onChange={(e) => handleInput('progressPercentage', e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Confidence</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={form.confidenceRating}
                  onChange={(e) => handleInput('confidenceRating', e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => handleInput('notes', e.target.value)}
                className="mt-2 h-28 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                placeholder="Write quick notes for this Java topic"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={saveTopic}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
              >
                <span>{editingId ? 'Update topic' : 'Save topic'}</span>
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl border border-slate-700 bg-[#101626] px-5 py-3 text-sm font-semibold text-slate-300 hover:border-indigo-500"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="rounded-2xl bg-slate-900 p-3 text-slate-300">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Java Progress</h2>
              <p className="text-sm text-slate-500">Topic-level readiness metrics.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl bg-[#121A2D] p-4 text-sm text-slate-300">
              <p className="font-medium text-slate-100">Average Progress</p>
              <p className="mt-3 text-3xl font-semibold text-white">{topics.length ? `${(topics.reduce((sum, topic) => sum + topic.progressPercentage, 0) / topics.length).toFixed(0)}%` : '0%'}</p>
            </div>
            <div className="rounded-3xl bg-[#121A2D] p-4 text-sm text-slate-300">
              <p className="font-medium text-slate-100">Average Confidence</p>
              <p className="mt-3 text-3xl font-semibold text-white">{topics.length ? `${(topics.reduce((sum, topic) => sum + topic.confidenceRating, 0) / topics.length).toFixed(1)} / 10` : '0 / 10'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-semibold text-white">Core Java Topics</h2>
            <p className="text-sm text-slate-500">Track progress, confidence, and notes for each topic.</p>
          </div>
          <BookOpen className="h-5 w-5 text-slate-400" />
        </div>

        {renderTopicList()}
      </div>
    </div>
  );
};

export default JavaTracker;
