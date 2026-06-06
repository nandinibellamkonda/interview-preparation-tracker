import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { companyTrackerService } from '../services/api.js';
import { Search, Plus, Trash2, Edit3 } from 'lucide-react';

const statusOptions = ['All', 'Active', 'Rejected', 'Offer'];
const roundStatuses = ['Pending', 'Cleared', 'Rejected'];

const initialForm = {
  companyName: '',
  role: '',
  applicationDate: new Date().toISOString().slice(0, 10),
  notes: '',
};

const getOverallStatus = (company) => {
  if ([company.oaStatus, company.technicalRound1Status, company.technicalRound2Status, company.hrRoundStatus].includes('Rejected')) {
    return 'Rejected';
  }
  if (
    company.oaStatus === 'Cleared' &&
    company.technicalRound1Status === 'Cleared' &&
    company.technicalRound2Status === 'Cleared' &&
    company.hrRoundStatus === 'Cleared'
  ) {
    return 'Offer';
  }
  return 'Active';
};

const CompanyTracker = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await companyTrackerService.getCompanies();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Unable to load companies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    if (!form.companyName.trim() || !form.role.trim() || !form.applicationDate) {
      setError('Company name, role, and application date are required.');
      setSuccess('');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const payload = {
        companyName: form.companyName.trim(),
        role: form.role.trim(),
        applicationDate: form.applicationDate,
        notes: form.notes.trim(),
      };

      if (editingId) {
        await companyTrackerService.updateCompany(editingId, payload);
        setSuccess('Company updated successfully.');
      } else {
        await companyTrackerService.createCompany(payload);
        setSuccess('Company added successfully.');
      }

      await loadCompanies();
      setForm(initialForm);
      setEditingId(null);
    } catch (err) {
      setError(err.message || 'Unable to save company.');
      setSuccess('');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (company) => {
    setEditingId(company._id);
    setForm({
      companyName: company.companyName,
      role: company.role,
      applicationDate: company.applicationDate ? company.applicationDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
      notes: company.notes || '',
    });
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this company record?')) return;
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      await companyTrackerService.deleteCompany(id);
      setSuccess('Company removed successfully.');
      await loadCompanies();
    } catch (err) {
      setError(err.message || 'Unable to delete company.');
      setSuccess('');
    } finally {
      setSaving(false);
    }
  };

  const handleRoundStatusChange = async (companyId, round, status) => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      await companyTrackerService.updateRoundStatus(companyId, { round, status });
      setSuccess('Round status updated.');
      await loadCompanies();
    } catch (err) {
      setError(err.message || 'Unable to update round status.');
      setSuccess('');
    } finally {
      setSaving(false);
    }
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const searchMatch = [company.companyName, company.role].some((field) =>
        field?.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );
      const overallStatus = getOverallStatus(company);
      const statusMatch = statusFilter === 'All' || statusFilter === overallStatus;
      return searchMatch && statusMatch;
    });
  }, [companies, searchTerm, statusFilter]);

  const totalApplied = companies.length;
  const totalOffers = companies.filter((company) => getOverallStatus(company) === 'Offer').length;
  const totalRejected = companies.filter((company) => getOverallStatus(company) === 'Rejected').length;
  const activeProcesses = companies.filter((company) => getOverallStatus(company) === 'Active').length;
  const upcomingInterviews = companies.filter((company) => {
    const appDate = company.applicationDate ? new Date(company.applicationDate) : null;
    if (!appDate) return false;
    const today = new Date();
    const diffDays = Math.ceil((appDate - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30 && getOverallStatus(company) === 'Active';
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Company Tracker</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Manage applications and interview progress.</h1>
          <p className="mt-2 text-slate-400 max-w-2xl">Track your company applications, move rounds forward, and monitor outcomes from one dashboard.</p>
        </div>
        <div className="rounded-3xl bg-[#0F172A] border border-slate-800 p-4 text-sm text-slate-300">
          <p className="font-semibold text-slate-100">Applications tracked</p>
          <p className="mt-1 text-3xl text-white">{totalApplied}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Add or update company application</h2>
              <p className="text-sm text-slate-500">Record new applications and update existing roles or notes.</p>
            </div>
            <Plus className="h-5 w-5 text-slate-400" />
          </div>
          {error && <div className="mb-4 rounded-2xl bg-red-950/40 p-4 text-sm text-red-300">{error}</div>}
          {success && <div className="mb-4 rounded-2xl bg-emerald-950/40 p-4 text-sm text-emerald-300">{success}</div>}
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300">Company name</label>
              <input
                value={form.companyName}
                onChange={(e) => setForm((prev) => ({ ...prev, companyName: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                placeholder="Amazon"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Role</label>
              <input
                value={form.role}
                onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                placeholder="Software Engineer"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-300">Applied on</label>
                <input
                  type="date"
                  value={form.applicationDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, applicationDate: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                className="mt-2 w-full min-h-[140px] rounded-3xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                placeholder="Interview format, contacts, or follow-up reminders."
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
              >
                <span>{editingId ? 'Update company' : 'Add company'}</span>
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
              <h2 className="text-xl font-semibold text-white">Search and filter</h2>
              <p className="text-sm text-slate-500">Find applications by name or review process status.</p>
            </div>
          </div>
          <div className="grid gap-4">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              placeholder="Search by company or role..."
            />
            <div>
              <label className="text-sm font-medium text-slate-300">Status filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Applied</p>
          <p className="mt-4 text-3xl font-semibold text-white">{totalApplied}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Active processes</p>
          <p className="mt-4 text-3xl font-semibold text-white">{activeProcesses}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Rejections</p>
          <p className="mt-4 text-3xl font-semibold text-white">{totalRejected}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Offers</p>
          <p className="mt-4 text-3xl font-semibold text-white">{totalOffers}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Applications</h2>
            <p className="mt-2 text-slate-400">Review company details, rounds, and next steps.</p>
          </div>
          <div className="rounded-3xl bg-slate-900 px-4 py-3 text-sm text-slate-300">Upcoming within 30 days: {upcomingInterviews}</div>
        </div>

        {loading ? (
          <div className="mt-6 rounded-3xl border border-slate-800 bg-[#121A2D] p-6 text-slate-400">Loading companies...</div>
        ) : filteredCompanies.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-slate-800 bg-[#121A2D] p-6 text-slate-400">No companies match the current search or filter.</div>
        ) : (
          <div className="mt-6 grid gap-4">
            {filteredCompanies.map((company) => (
              <div key={company._id} className="rounded-3xl border border-slate-800 bg-[#121A2D] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{getOverallStatus(company)}</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{company.companyName}</h3>
                    <p className="mt-2 text-sm text-slate-400">{company.role}</p>
                    <p className="mt-1 text-sm text-slate-500">Applied on {new Date(company.applicationDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(company)}
                      className="rounded-2xl border border-slate-700 bg-[#0F172A] px-4 py-2 text-sm text-slate-200 hover:border-indigo-500"
                    >
                      <Edit3 className="inline h-4 w-4" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(company._id)}
                      className="rounded-2xl border border-red-700 bg-[#170B12] px-4 py-2 text-sm text-red-300 hover:border-red-500"
                    >
                      <Trash2 className="inline h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-3xl bg-[#0F172A] p-4 text-sm text-slate-300">
                    <p className="font-semibold text-slate-100">Application notes</p>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{company.notes || 'No notes added yet.'}</p>
                  </div>
                  <div className="rounded-3xl bg-[#0F172A] p-4 text-sm text-slate-300">
                    <p className="font-semibold text-slate-100">Preparation checklist</p>
                    <div className="mt-3 space-y-3">
                      {['Arrays', 'Graphs', 'OS revision', 'SQL practice'].map((task) => (
                        <div key={task} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-[#101626] px-4 py-3">
                          <span className="h-3 w-3 rounded-full bg-slate-600 ring-1 ring-slate-500" />
                          <span className="text-sm text-slate-300">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-5 rounded-3xl bg-[#0F172A] p-4 text-sm text-slate-300">
                  <p className="font-semibold text-slate-100">Round statuses</p>
                  <div className="mt-3 grid gap-3">
                    {['oaStatus', 'technicalRound1Status', 'technicalRound2Status', 'hrRoundStatus'].map((roundKey) => (
                      <div key={roundKey} className="grid gap-2">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs uppercase tracking-[0.28em] text-slate-400">{roundKey.replace(/([A-Z])/g, ' $1').replace('Status', '')}</span>
                          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300">{company[roundKey]}</span>
                        </div>
                        <select
                          value={company[roundKey]}
                          onChange={(e) => handleRoundStatusChange(company._id, roundKey, e.target.value)}
                          className="w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                        >
                          {roundStatuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyTracker;
