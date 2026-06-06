import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { goalService } from '../services/api.js';
import { Plus, CheckCircle2, Trash2, Edit3 } from 'lucide-react';

const initialForm = {
  title: '',
  description: '',
  category: 'General',
  targetDate: new Date().toISOString().slice(0, 10),
  status: 'Not Started',
};

const categoryOptions = ['General', 'DSA', 'SQL', 'Java', 'Aptitude', 'Applications', 'Interviews', 'Resume'];
const statusOptions = ['Not Started', 'In Progress', 'Completed', 'Abandoned'];

const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadGoals = async () => {
    try {
      setLoading(true);
      const response = await goalService.getGoals(user?.token);
      setGoals(response || []);
    } catch (err) {
      setError(err.message || 'Unable to load goals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.targetDate) {
      setError('Title and target date are required.');
      setSuccess('');
      return;
    }

    const targetDate = new Date(form.targetDate);
    if (Number.isNaN(targetDate.getTime())) {
      setError('Please provide a valid due date.');
      setSuccess('');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        targetDate: form.targetDate,
        status: form.status,
      };

      if (editingId) {
        await goalService.updateGoal(user?.token, editingId, payload);
        setSuccess('Goal updated successfully.');
      } else {
        await goalService.createGoal(user?.token, payload);
        setSuccess('New goal added successfully.');
      }
      await loadGoals();
      setForm(initialForm);
      setEditingId(null);
    } catch (err) {
      setError(err.message || 'Unable to save goal.');
      setSuccess('');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (goal) => {
    setEditingId(goal._id);
    setForm({
      title: goal.title,
      description: goal.description || '',
      category: goal.category || 'General',
      targetDate: goal.targetDate?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      status: goal.status || 'Not Started',
    });
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this goal?')) return;
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      await goalService.deleteGoal(user?.token, id);
      setSuccess('Goal deleted successfully.');
      await loadGoals();
    } catch (err) {
      setError(err.message || 'Unable to delete goal.');
      setSuccess('');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleComplete = async (goal) => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const status = goal.status === 'Completed' ? 'In Progress' : 'Completed';
      await goalService.updateGoal(user?.token, goal._id, { status });
      setSuccess(status === 'Completed' ? 'Goal marked completed.' : 'Goal marked in progress.');
      await loadGoals();
    } catch (err) {
      setError(err.message || 'Unable to update goal status.');
      setSuccess('');
    } finally {
      setSaving(false);
    }
  };

  const completedGoals = goals.filter((goal) => goal.status === 'Completed').length;
  const pendingGoals = goals.filter((goal) => goal.status !== 'Completed').length;
  const completionRate = goals.length ? Math.round((completedGoals / goals.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Goals</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Daily preparation goals and progress.</h1>
          <p className="mt-2 text-slate-400 max-w-2xl">Set weekly targets, track completion, and keep focus on what matters most.</p>
        </div>
        <div className="rounded-3xl bg-[#0F172A] border border-slate-800 p-4 text-sm text-slate-300">
          <p className="font-semibold text-slate-100">Completed goals</p>
          <p className="mt-1 text-3xl text-white">{completedGoals}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Create / update a goal</h2>
              <p className="text-sm text-slate-500">Keep your study plan actionable with measurable tasks.</p>
            </div>
            <Plus className="h-5 w-5 text-slate-400" />
          </div>
          {error && <div className="mb-4 rounded-2xl bg-red-950/40 p-4 text-sm text-red-300">{error}</div>}
          {success && <div className="mb-4 rounded-2xl bg-emerald-950/40 p-4 text-sm text-emerald-300">{success}</div>}
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300">Goal title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                placeholder="Finish coding challenge set"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className="mt-2 w-full min-h-[140px] rounded-3xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                placeholder="Prepare for system design and practice data structure exercises."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-300">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Due date</label>
              <input
                type="date"
                value={form.targetDate}
                onChange={(e) => setForm((prev) => ({ ...prev, targetDate: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
              >
                <span>{editingId ? 'Update goal' : 'Save goal'}</span>
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
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Goal summary</h2>
              <p className="text-sm text-slate-500">Keep an eye on progress and priorities.</p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-3xl bg-[#121A2D] p-4 text-sm text-slate-300">
              <p className="font-medium text-slate-100">Total goals</p>
              <p className="mt-2 text-3xl font-semibold text-white">{goals.length}</p>
            </div>
            <div className="rounded-3xl bg-[#121A2D] p-4 text-sm text-slate-300">
              <p className="font-medium text-slate-100">Completed goals</p>
              <p className="mt-2 text-3xl font-semibold text-white">{completedGoals}</p>
            </div>
            <div className="rounded-3xl bg-[#121A2D] p-4 text-sm text-slate-300">
              <p className="font-medium text-slate-100">Pending goals</p>
              <p className="mt-2 text-3xl font-semibold text-white">{pendingGoals}</p>
            </div>
            <div className="rounded-3xl bg-[#121A2D] p-4 text-sm text-slate-300">
              <p className="font-medium text-slate-100">Completion rate</p>
              <p className="mt-2 text-3xl font-semibold text-white">{completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Your goals</h2>
            <p className="mt-2 text-slate-400">Track your study commitments and update status as you complete tasks.</p>
          </div>
          <div className="rounded-3xl bg-slate-900 px-4 py-3 text-sm text-slate-300">
            {user?.fullName}
          </div>
        </div>

        {loading ? (
          <div className="mt-6 rounded-3xl border border-slate-800 bg-[#121A2D] p-6 text-slate-400">Loading your goals...</div>
        ) : goals.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-slate-800 bg-[#121A2D] p-6 text-slate-400">No goals added yet. Create one to stay on track.</div>
        ) : (
          <div className="mt-6 grid gap-4">
            {goals.map((goal) => (
              <div key={goal._id} className="rounded-3xl border border-slate-800 bg-[#121A2D] p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{goal.status}</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{goal.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">Target by {new Date(goal.targetDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleComplete(goal)}
                      className="rounded-2xl border border-slate-700 bg-[#0F172A] px-4 py-2 text-sm text-slate-200 hover:border-indigo-500"
                    >
                      {goal.status === 'Completed' ? 'Undo complete' : 'Mark complete'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(goal)}
                      className="rounded-2xl border border-slate-700 bg-[#0F172A] px-4 py-2 text-sm text-slate-200 hover:border-indigo-500"
                    >
                      <Edit3 className="inline h-4 w-4" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(goal._id)}
                      className="rounded-2xl border border-red-700 bg-[#170B12] px-4 py-2 text-sm text-red-300 hover:border-red-500"
                    >
                      <Trash2 className="inline h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-slate-400">
                  <p>{goal.description || 'No description added.'}</p>
                  <p>Due {new Date(goal.targetDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
