import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircle2, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { user, updateProfileFields, logout } = useAuth();
  const [profile, setProfile] = useState({
    fullName: '',
    college: '',
    branch: '',
    role: '',
    graduationYear: '',
  });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || '',
        college: user.college || '',
        branch: user.branch || '',
        role: user.role || '',
        graduationYear: user.graduationYear || '',
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await updateProfileFields(profile);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.message || 'Unable to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Profile</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Your placement profile</h1>
            <p className="mt-2 text-slate-400 max-w-2xl">Review your account details and update your academic information.</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="rounded-3xl bg-indigo-600/10 p-3 text-indigo-300">
                <UserCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Account details</h2>
                <p className="text-sm text-slate-500">Manage what is shown in your tracker.</p>
              </div>
            </div>
            {error && <div className="mb-4 rounded-2xl bg-red-950/40 p-4 text-sm text-red-300">{error}</div>}
            {message && <div className="mb-4 rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-300">{message}</div>}
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300">Full Name</label>
                <input
                  value={profile.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-300">College</label>
                  <input
                    value={profile.college}
                    onChange={(e) => handleChange('college', e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Branch</label>
                  <input
                    value={profile.branch}
                    onChange={(e) => handleChange('branch', e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-300">Target role</label>
                  <input
                    value={profile.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Graduation year</label>
                  <input
                    type="number"
                    value={profile.graduationYear}
                    onChange={(e) => handleChange('graduationYear', e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#101626] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" /> Save Changes
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-2xl bg-slate-900 p-3 text-slate-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Account progress</h2>
                <p className="text-sm text-slate-500">Current placement readiness and streak metrics.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl bg-[#121A2D] p-4 text-sm text-slate-300">
                <p className="font-medium text-slate-100">XP Points</p>
                <p className="mt-2 text-3xl font-semibold text-white">{user?.xp ?? 0}</p>
              </div>
              <div className="rounded-3xl bg-[#121A2D] p-4 text-sm text-slate-300">
                <p className="font-medium text-slate-100">Current Streak</p>
                <p className="mt-2 text-3xl font-semibold text-white">{user?.streak ?? 0} days</p>
              </div>
              <div className="rounded-3xl bg-[#121A2D] p-4 text-sm text-slate-300">
                <p className="font-medium text-slate-100">Readiness Score</p>
                <p className="mt-2 text-3xl font-semibold text-white">{user?.readinessScore ?? 0}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Profile;
