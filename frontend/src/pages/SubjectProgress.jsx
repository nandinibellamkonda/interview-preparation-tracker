import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { topicService } from '../services/api.js';
import { ArrowRight, Flag, Layers, Sparkles } from 'lucide-react';

const categories = ['All', 'DSA', 'Java', 'SQL', 'OS', 'DBMS', 'CN'];

const initialForm = {
  topicName: '',
  category: 'DSA',
  totalTopics: 10,
  completedTopics: 0,
  notes: '',
};

const computeProgress = (topic) => {
  const total = Number(topic.totalTopics || 0);
  const completed = Number(topic.completedTopics || 0);
  if (total > 0) {
    return Math.min(100, Math.round((completed / total) * 100));
  }
  return topic.completed ? 100 : 0;
};

const SubjectProgress = () => {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('DSA');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const formRef = useRef(null);
  const weakRef = useRef(null);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const data = await topicService.getTopics(user?.token);
      setTopics(Array.isArray(data) ? data : []);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Unable to load subject progress.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, [user?.token]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    if (!form.topicName.trim()) {
      setMessage({ type: 'error', text: 'Topic name is required.' });
      return;
    }

    const totalTopics = Number(form.totalTopics);
    const completedTopics = Number(form.completedTopics);

    if (!Number.isInteger(totalTopics) || totalTopics <= 0) {
      setMessage({ type: 'error', text: 'Total topics must be a positive number.' });
      return;
    }

    if (!Number.isInteger(completedTopics) || completedTopics < 0 || completedTopics > totalTopics) {
      setMessage({ type: 'error', text: 'Completed topics must be between 0 and total topics.' });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      const payload = {
        topicName: form.topicName.trim(),
        category: form.category,
        totalTopics,
        completedTopics,
        notes: form.notes.trim(),
      };

      if (editingId) {
        await topicService.updateTopic(user?.token, editingId, payload);
        setMessage({ type: 'success', text: 'Subject progress updated.' });
      } else {
        await topicService.createTopic(user?.token, payload);
        setMessage({ type: 'success', text: 'New subject progress saved.' });
      }

      await loadTopics();
      resetForm();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Unable to save subject progress.' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (topic) => {
    setEditingId(topic._id);
    setForm({
      topicName: topic.topicName || '',
      category: topic.category || 'DSA',
      totalTopics: topic.totalTopics || 10,
      completedTopics: topic.completedTopics || 0,
      notes: topic.notes || '',
    });
    setMessage({ type: '', text: '' });
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject tracker entry?')) return;
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      await topicService.deleteTopic(user?.token, id);
      setMessage({ type: 'success', text: 'Subject progress entry removed.' });
      await loadTopics();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Unable to delete subject progress entry.' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleCompletion = async (topic) => {
    const progress = computeProgress(topic);
    if (progress === 100) {
      setMessage({ type: 'success', text: 'This topic is already complete.' });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      await topicService.updateTopic(user?.token, topic._id, {
        completedTopics: topic.totalTopics || 0,
      });
      setMessage({ type: 'success', text: `Marked “${topic.topicName}” complete.` });
      await loadTopics();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Unable to update completion status.' });
    } finally {
      setSaving(false);
    }
  };

  const handleMarkNextComplete = async () => {
    const nextTopic = topics.find((topic) => computeProgress(topic) < 100);
    if (!nextTopic) {
      setMessage({ type: 'success', text: 'All tracked topics are already complete.' });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      await topicService.updateTopic(user?.token, nextTopic._id, {
        completedTopics: nextTopic.totalTopics || 0,
      });
      setMessage({ type: 'success', text: `Marked “${nextTopic.topicName}” complete.` });
      await loadTopics();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Unable to update completion.' });
    } finally {
      setSaving(false);
    }
  };

  const filteredTopics = useMemo(() => {
    if (selectedCategory === 'All') return topics;
    return topics.filter((topic) => topic.category === selectedCategory);
  }, [topics, selectedCategory]);

  const displayTopics = filteredTopics.slice(0, 5);
  const hiddenTopicCount = Math.max(0, filteredTopics.length - 5);

  const totalSubjects = topics.length;
  const completedSubjects = topics.filter((topic) => computeProgress(topic) === 100).length;
  const averageProgress = totalSubjects
    ? Math.round(topics.reduce((sum, topic) => sum + computeProgress(topic), 0) / totalSubjects)
    : 0;

  const weakAreas = useMemo(() => {
    return topics
      .map((topic) => ({
        label: topic.topicName || topic.category,
        progress: computeProgress(topic),
      }))
      .filter((entry) => entry.progress < 60)
      .sort((a, b) => a.progress - b.progress)
      .slice(0, 4);
  }, [topics]);

  const hasTopics = topics.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Subject progress</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Turn study tracking into momentum.</h1>
          <p className="mt-2 text-slate-400 max-w-2xl">See progress across every core subject, focus on weak areas, and move through your learning journey step by step.</p>
        </div>
        <div className="rounded-3xl bg-[#0F172A] border border-slate-800 p-4 text-sm text-slate-300">
          <p className="font-semibold text-slate-100">Tracked topics</p>
          <p className="mt-1 text-3xl text-white">{topics.length}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <main className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {categories.filter((category) => category !== 'All').map((category) => {
              const group = topics.filter((topic) => topic.category === category);
              const totalTopics = group.reduce((sum, topic) => sum + Number(topic.totalTopics || 0), 0);
              const completedTopics = group.reduce((sum, topic) => sum + Number(topic.completedTopics || 0), 0);
              const progress = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0;
              const completedEntries = group.filter((topic) => computeProgress(topic) === 100).length;
              const remainingEntries = Math.max(0, group.length - completedEntries);

              return (
                <div key={category} className="rounded-3xl border border-slate-800 bg-[#0F172A] p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{category === 'OS' ? 'Operating Systems' : category === 'CN' ? 'Computer Networks' : category}</p>
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-3xl font-semibold text-white">{progress}%</p>
                      <p className="mt-1 text-sm text-slate-400">Progress</p>
                    </div>
                    <div className="text-right text-sm text-slate-400">
                      <p>{completedEntries} done</p>
                      <p>{remainingEntries} left</p>
                    </div>
                  </div>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {!hasTopics ? (
            <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8 text-center">
              <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Start your roadmap</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Build your placement preparation plan.</h2>
              <p className="mt-4 text-slate-400">Add your first topic to unlock progress tracking, weak area recommendations, and daily focus.</p>
              <button
                type="button"
                onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Add first topic
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <section className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Learning journey</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">What to study next</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['DSA', 'Java', 'SQL', 'OS', 'DBMS', 'CN'].map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-full px-4 py-2 text-sm ${selectedCategory === category ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {['Completed', 'In progress', 'Remaining'].map((state) => {
                  const items = filteredTopics
                    .filter((topic) => {
                      const progress = computeProgress(topic);
                      if (state === 'Completed') return progress === 100;
                      if (state === 'In progress') return progress > 0 && progress < 100;
                      return progress === 0;
                    })
                    .slice(0, 4);
                  return (
                    <div key={state} className="rounded-3xl bg-[#0B1221] p-4">
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{state}</p>
                      <div className="mt-4 space-y-2">
                        {items.length > 0 ? (
                          items.map((topic) => (
                            <p key={topic._id} className="text-sm text-slate-200">{state === 'Completed' ? '✓' : state === 'In progress' ? '•' : '○'} {topic.topicName}</p>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500">No {state.toLowerCase()} topics.</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Topic tracker</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Your current topics</h2>
                </div>
                <span className="text-sm text-slate-400">Showing {displayTopics.length} of {filteredTopics.length}</span>
              </div>

              <div className="mt-6 space-y-4">
                {displayTopics.length > 0 ? (
                  displayTopics.map((topic) => {
                    const progress = computeProgress(topic);
                    return (
                      <div key={topic._id} className="rounded-3xl border border-slate-800 bg-[#111827] p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{topic.category}</p>
                            <h3 className="mt-2 text-lg font-semibold text-white">{topic.topicName}</h3>
                            <p className="mt-2 text-sm text-slate-400">{topic.notes || 'No notes added yet.'}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(topic)}
                              className="rounded-2xl border border-slate-700 bg-[#101626] px-4 py-2 text-sm font-semibold text-slate-200 hover:border-indigo-500"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(topic._id)}
                              className="rounded-2xl border border-slate-700 bg-[#101626] px-4 py-2 text-sm font-semibold text-slate-200 hover:border-red-500"
                            >
                              Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleCompletion(topic)}
                              className="rounded-2xl border border-slate-700 bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                            >
                              {progress === 100 ? 'Completed' : 'Mark complete'}
                            </button>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm text-slate-400">
                            <span>{progress}% complete</span>
                            <span>{topic.completedTopics}/{topic.totalTopics} done</span>
                          </div>
                          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-3xl border border-slate-800 bg-[#111827] p-5 text-slate-400">No topics found for this category. Add a topic to begin tracking your progress.</div>
                )}

                {hiddenTopicCount > 0 && (
                  <p className="text-sm text-slate-400">Showing the top 5 items. {hiddenTopicCount} more topics are available in this category.</p>
                )}
              </div>
            </section>
          </>)
          }

          <section id="weak-areas" ref={weakRef} className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Weak area highlights</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Focus needed</h2>
              </div>
              <Flag className="h-6 w-6 text-amber-400" />
            </div>

            <div className="mt-6 space-y-3">
              {weakAreas.length > 0 ? (
                weakAreas.map((entry) => (
                  <div key={entry.label} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#111827] p-4">
                    <div>
                      <p className="text-sm font-medium text-white">{entry.label}</p>
                      <p className="mt-1 text-xs text-slate-400">Needs more practice</p>
                    </div>
                    <span className="rounded-full bg-red-500/10 px-3 py-1 text-sm font-semibold text-red-300">{entry.progress}%</span>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5 text-slate-400">No weak areas detected yet. Keep moving through the plan.</div>
              )}
            </div>
          </section>
        </main>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-3xl bg-indigo-500/10 p-3 text-indigo-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Quick actions</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Move faster today</h2>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full rounded-2xl border border-slate-700 bg-[#111827] px-4 py-3 text-left text-sm font-semibold text-white hover:border-indigo-500"
              >
                Add topic
                <p className="mt-1 text-xs text-slate-400">Capture the next concept in your roadmap.</p>
              </button>
              <button
                type="button"
                onClick={handleMarkNextComplete}
                disabled={!topics.some((topic) => computeProgress(topic) < 100)}
                className="w-full rounded-2xl border border-slate-700 bg-[#111827] px-4 py-3 text-left text-sm font-semibold text-white hover:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Mark complete
                <p className="mt-1 text-xs text-slate-400">Finish the next pending topic automatically.</p>
              </button>
              <button
                type="button"
                onClick={() => weakRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full rounded-2xl border border-slate-700 bg-[#111827] px-4 py-3 text-left text-sm font-semibold text-white hover:border-indigo-500"
              >
                View weak areas
                <p className="mt-1 text-xs text-slate-400">See what is blocking your readiness score.</p>
              </button>
            </div>
          </div>

          <div ref={formRef} className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Add new topic</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Keep the plan fresh</h2>
              </div>
              <Layers className="h-5 w-5 text-slate-400" />
            </div>

            {message.text ? (
              <div className={`mt-6 rounded-2xl p-4 text-sm ${message.type === 'error' ? 'bg-red-950/40 text-red-300' : 'bg-emerald-950/40 text-emerald-300'}`}>
                {message.text}
              </div>
            ) : null}

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300">Subject</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                >
                  {categories.filter((category) => category !== 'All').map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Topic name</label>
                <input
                  type="text"
                  value={form.topicName}
                  onChange={(e) => setForm((prev) => ({ ...prev, topicName: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  placeholder="Operating system scheduling algorithms"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-300">Total topics</label>
                  <input
                    type="number"
                    min="1"
                    value={form.totalTopics}
                    onChange={(e) => setForm((prev) => ({ ...prev, totalTopics: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Completed topics</label>
                  <input
                    type="number"
                    min="0"
                    value={form.completedTopics}
                    onChange={(e) => setForm((prev) => ({ ...prev, completedTopics: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                  className="mt-2 w-full min-h-[120px] rounded-3xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  placeholder="Add key concepts, references, or resources."
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                >
                  <span>{editingId ? 'Update topic' : 'Add topic'}</span>
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
        </aside>
      </div>
    </div>
  );
};

export default SubjectProgress;
