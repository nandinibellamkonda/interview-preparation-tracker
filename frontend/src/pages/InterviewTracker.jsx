import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { interviewService } from '../services/api.js';
import { Activity, CheckCircle2, LineChart, Loader2, RefreshCcw, Trash2 } from 'lucide-react';

const InterviewTracker = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadInterviews = async () => {
    try {
      setLoading(true);
      const data = await interviewService.getInterviews();
      setInterviews(data || []);
    } catch (err) {
      setError(err.message || 'Unable to load interview tracker.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this interview entry?')) return;
    try {
      setSaving(true);
      await interviewService.deleteInterview(id);
      await loadInterviews();
    } catch (err) {
      setError(err.message || 'Unable to delete entry.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (value) => {
    try {
      return new Date(value).toLocaleDateString();
    } catch {
      return value;
    }
  };

  const completedCount = interviews.filter((item) => item.status?.toLowerCase() === 'completed').length;
  const pendingCount = interviews.length - completedCount;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Interview preparation</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Track practice sessions and interview debriefs</h1>
            <p className="mt-2 text-slate-400 max-w-2xl">Monitor your interview readiness and keep your next steps clearly visible.</p>
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

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <p className="text-sm text-slate-400">Total interviews logged</p>
          <p className="mt-4 text-4xl font-semibold text-white">{interviews.length}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <p className="text-sm text-slate-400">Completed interviews</p>
          <p className="mt-4 text-4xl font-semibold text-white">{completedCount}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <p className="text-sm text-slate-400">Pending follow-ups</p>
          <p className="mt-4 text-4xl font-semibold text-white">{pendingCount}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Interview details</h2>
            <p className="mt-2 text-slate-400">Review logged interviews, teams, and next actions.</p>
          </div>
          <div className="rounded-2xl bg-slate-900 px-4 py-3 text-sm text-slate-300">
            <Activity className="inline h-4 w-4" /> {user?.fullName}
          </div>
        </div>

        {error && <div className="mt-6 rounded-2xl bg-red-950/40 p-4 text-sm text-red-300">{error}</div>}

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="rounded-3xl border border-slate-800 bg-[#121A2D] p-6 text-slate-400">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading interviews...
              </div>
            </div>
          ) : interviews.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-[#121A2D] p-6 text-slate-400">
              No interview activity has been logged yet.
            </div>
          ) : (
            interviews.map((item) => (
              <div key={item._id} className="rounded-3xl border border-slate-800 bg-[#121A2D] p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{item.companyName || item.role || 'Interview'}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{item.role || 'Interview session'}</h3>
                    <p className="mt-2 text-sm text-slate-400">{formatDate(item.date || item.createdAt)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">{item.status || 'Pending'}</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-2xl border border-red-700 bg-[#170B12] px-4 py-2 text-sm text-red-300 hover:border-red-500 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-[#0B121F] p-4">
                    <p className="text-sm text-slate-400">Company</p>
                    <p className="mt-2 text-base font-semibold text-white">{item.companyName || 'N/A'}</p>
                  </div>
                  <div className="rounded-3xl bg-[#0B121F] p-4">
                    <p className="text-sm text-slate-400">Notes</p>
                    <p className="mt-2 text-base text-slate-300">{item.notes || 'No notes yet.'}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewTracker;
