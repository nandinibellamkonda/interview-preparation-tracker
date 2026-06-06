import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { applicationService } from '../services/api.js';
import { Briefcase, Plus, Trash2, Edit3, CheckCircle2 } from 'lucide-react';

const initialForm = {
  companyName: '',
  role: '',
  package: '',
  applicationDate: new Date().toISOString().slice(0, 10),
  status: 'Applied',
};

const statusOptions = ['Applied', 'Interviewing', 'Offer', 'Rejected', 'Accepted'];

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationService.getApplications(user?.token);
      setApplications(response || []);
    } catch (err) {
      setError(err.message || 'Unable to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError('');
  };

  const handleSave = async () => {
    if (!form.companyName || !form.role || !form.applicationDate) {
      setError('Company, role, and date are required.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const payload = {
        ...form,
      };
      if (editingId) {
        await applicationService.updateApplication(user?.token, editingId, payload);
      } else {
        await applicationService.createApplication(user?.token, payload);
      }
      await loadApplications();
      resetForm();
    } catch (err) {
      setError(err.message || 'Unable to save application.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (application) => {
    setEditingId(application._id);
    setForm({
      companyName: application.companyName,
      role: application.role,
      package: application.package || '',
      applicationDate: application.applicationDate?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      status: application.status || 'Applied',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      setSaving(true);
      await applicationService.deleteApplication(user?.token, id);
      await loadApplications();
    } catch (err) {
      setError(err.message || 'Unable to delete application.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Applications Tracker</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Track company applications and interview status</h1>
          <p className="mt-2 text-slate-400 max-w-2xl">Log applications, review status updates, and keep your interview pipeline visible.</p>
        </div>
        <div className="rounded-3xl bg-[#0F172A] border border-slate-800 p-4 text-sm text-slate-300">
          <p className="font-semibold text-slate-100">Open Applications</p>
          <p className="mt-1 text-lg text-white">{applications.length}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Add / update application</h2>
              <p className="text-sm text-slate-500">Record every company and role in one place.</p>
            </div>
            <Plus className="h-5 w-5 text-slate-400" />
          </div>
          {error && <div className="mb-4 rounded-2xl bg-red-950/40 p-4 text-sm text-red-300">{error}</div>}
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300">Company name</label>
              <input
                value={form.companyName}
                onChange={(e) => setForm((prev) => ({ ...prev, companyName: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                placeholder="Company name"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-300">Role</label>
                <input
                  value={form.role}
                  onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Expected package</label>
                <input
                  value={form.package}
                  onChange={(e) => setForm((prev) => ({ ...prev, package: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  placeholder="10 LPA"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-300">Application date</label>
                <input
                  type="date"
                  value={form.applicationDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, applicationDate: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                />
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
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
              >
                <span>{editingId ? 'Update application' : 'Save application'}</span>
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
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Pipeline summary</h2>
              <p className="text-sm text-slate-500">Quick view of your current applied roles.</p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-3xl bg-[#121A2D] p-4 text-sm text-slate-300">
              <p className="font-medium text-slate-100">Total applications</p>
              <p className="mt-2 text-3xl font-semibold text-white">{applications.length}</p>
            </div>
            <div className="rounded-3xl bg-[#121A2D] p-4 text-sm text-slate-300">
              <p className="font-medium text-slate-100">Open interviews</p>
              <p className="mt-2 text-3xl font-semibold text-white">{applications.filter((item) => item.status === 'Interviewing').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
        <h2 className="text-xl font-semibold text-white">Application history</h2>
        <div className="mt-5 space-y-4">
          {loading ? (
            <p className="text-slate-500">Loading applications...</p>
          ) : applications.length === 0 ? (
            <p className="text-slate-500">No applications yet. Add your first one to track progress.</p>
          ) : (
            applications.map((application) => (
              <div key={application._id} className="rounded-3xl border border-slate-800 bg-[#121A2D] p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{application.companyName}</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{application.role}</h3>
                    <p className="mt-2 text-sm text-slate-400">Applied on {new Date(application.applicationDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">{application.status}</span>
                    <button
                      type="button"
                      onClick={() => handleEdit(application)}
                      className="rounded-2xl border border-slate-700 bg-[#0F172A] px-4 py-2 text-sm text-slate-200 hover:border-indigo-500"
                    >
                      <Edit3 className="inline h-4 w-4" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(application._id)}
                      className="rounded-2xl border border-red-700 bg-[#170B12] px-4 py-2 text-sm text-red-300 hover:border-red-500"
                    >
                      <Trash2 className="inline h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                  <span>Package: {application.package || 'Not set'}</span>
                  <span>Owner: {user?.fullName || 'You'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Applications;
