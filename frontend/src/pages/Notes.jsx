import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { noteService } from '../services/api.js';
import { Plus, Trash2, Edit3, Search } from 'lucide-react';

const initialForm = {
  title: '',
  content: '',
  category: 'DSA',
};

const noteCategories = ['All', 'DSA', 'SQL', 'OS', 'Interview Experiences', 'Revision Notes', 'Aptitude', 'General'];

const Notes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadNotes = async () => {
    try {
      setLoading(true);
      const response = await noteService.getNotes(user?.token);
      setNotes(response || []);
    } catch (err) {
      setError(err.message || 'Unable to load notes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return notes
      .filter((note) => {
        const matchesSearch = query
          ? [note.title, note.content].some((field) => field?.toLowerCase().includes(query))
          : true;
        const matchesCategory = selectedCategory === 'All' ? true : note.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();
        return sortOrder === 'latest' ? bDate - aDate : aDate - bDate;
      });
  }, [notes, searchTerm, selectedCategory, sortOrder]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError('');
    setMessage('');
  };

  const handleSave = async () => {
    if (!form.title || !form.content) {
      setError('Title and content are required.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setMessage('');
      if (editingId) {
        await noteService.updateNote(user?.token, editingId, form);
        setMessage('Note updated successfully.');
      } else {
        await noteService.createNote(user?.token, form);
        setMessage('Note created successfully.');
      }
      await loadNotes();
      resetForm();
    } catch (err) {
      setError(err.message || 'Unable to save note.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (note) => {
    setEditingId(note._id);
    setForm({ title: note.title, content: note.content, category: note.category || 'General' });
    setError('');
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      setSaving(true);
      await noteService.deleteNote(user?.token, id);
      await loadNotes();
    } catch (err) {
      setError(err.message || 'Unable to delete note.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Notes</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Capture interview prep notes and review anytime.</h1>
          <p className="mt-2 text-slate-400 max-w-2xl">Store study reminders, feedback, and key takeaways for every session.</p>
        </div>
        <div className="rounded-3xl bg-[#0F172A] border border-slate-800 p-4 text-sm text-slate-300">
          <p className="font-semibold text-slate-100">Saved notes</p>
          <p className="mt-1 text-3xl text-white">{notes.length}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Create a note</h2>
              <p className="text-sm text-slate-500">Capture important prep details and save them for later review.</p>
            </div>
            <Plus className="h-5 w-5 text-slate-400" />
          </div>
          {error && <div className="mb-4 rounded-2xl bg-red-950/40 p-4 text-sm text-red-300">{error}</div>}
          {message && <div className="mb-4 rounded-2xl bg-emerald-950/40 p-4 text-sm text-emerald-300">{message}</div>}
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                placeholder="Mock interview feedback"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              >
                {noteCategories.filter((category) => category !== 'All').map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Content</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                className="mt-2 w-full min-h-[160px] rounded-3xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                placeholder="Note your strengths, questions to revisit, and company-specific preparation items."
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
              >
                <span>{editingId ? 'Update note' : 'Save note'}</span>
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
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Search notes</h2>
              <p className="text-sm text-slate-500">Quickly find anything you saved.</p>
            </div>
          </div>
          <div className="grid gap-4">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-3xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              placeholder="Search by title or content..."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-300">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                >
                  {noteCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Sort by</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                >
                  <option value="latest">Latest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Your notes</h2>
            <p className="mt-2 text-slate-400">Review your saved prep insights and feedback.</p>
          </div>
          <div className="rounded-3xl bg-slate-900 px-4 py-3 text-sm text-slate-300">
            {user?.fullName}
          </div>
        </div>

        {loading ? (
          <div className="mt-6 rounded-3xl border border-slate-800 bg-[#121A2D] p-6 text-slate-400">Loading your notes...</div>
        ) : filteredNotes.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-slate-800 bg-[#121A2D] p-6 text-slate-400">No notes found. Add one to keep your prep organized.</div>
        ) : (
          <div className="mt-6 grid gap-4">
            {filteredNotes.map((note) => (
              <div key={note._id} className="rounded-3xl border border-slate-800 bg-[#121A2D] p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Saved note'}</p>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-400">
                        {note.category || 'General'}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-white">{note.title}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(note)}
                      className="rounded-2xl border border-slate-700 bg-[#0F172A] px-4 py-2 text-sm text-slate-200 hover:border-indigo-500"
                    >
                      <Edit3 className="inline h-4 w-4" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(note._id)}
                      className="rounded-2xl border border-red-700 bg-[#170B12] px-4 py-2 text-sm text-red-300 hover:border-red-500"
                    >
                      <Trash2 className="inline h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-3">
                  <p className="text-sm leading-6 text-slate-400">{note.content}</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Last updated: {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
