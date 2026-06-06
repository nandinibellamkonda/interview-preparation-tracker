import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { resumeService } from '../services/api.js';

const sortOptions = [
  { value: 'latest', label: 'Latest updated' },
  { value: 'highestAts', label: 'Highest ATS score' },
  { value: 'nameAsc', label: 'Version A → Z' },
];

const Resume = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [versionName, setVersionName] = useState('');
  const [atsScore, setAtsScore] = useState('');
  const [improvements, setImprovements] = useState('');
  const [feedback, setFeedback] = useState('');
  const [skills, setSkills] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [sortOption, setSortOption] = useState('latest');
  const [compareSelection, setCompareSelection] = useState([]);
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await resumeService.getResumes(user?.token);
      setResumes(data || []);
    } catch (err) {
      console.error(err);
      setMessage('Unable to load resumes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) load();
  }, [user?.token]);

  const resetForm = () => {
    setFile(null);
    setVersionName('');
    setAtsScore('');
    setImprovements('');
    setFeedback('');
    setSkills('');
    setEditingId(null);
  };

  const handleEdit = (resume) => {
    setEditingId(resume._id);
    setVersionName(resume.versionName || '');
    setAtsScore(resume.atsScore?.toString() || '');
    setImprovements((resume.improvements || []).join(', '));
    setFeedback(resume.feedback || '');
    setSkills((resume.skills || []).join(', '));
    setMessage('Editing resume version details. Leave file blank to keep current upload.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
    if (editingId) {
      try {
        await resumeService.updateResume(user?.token, editingId, {
          versionName,
          atsScore: atsScore ? Number(atsScore) : 0,
          improvements,
          feedback,
          skills,
        });
        setMessage('Resume version updated successfully.');
        resetForm();
        await load();
      } catch (err) {
        console.error(err);
        setMessage('Unable to save resume metadata.');
      }
      return;
    }

    if (!file) {
      setMessage('Please select a file before uploading.');
      return;
    }

    try {
      await resumeService.uploadResume(user?.token, file, {
        versionName,
        atsScore: atsScore ? Number(atsScore) : 0,
        improvements,
        feedback,
        skills,
      });
      setMessage('Resume uploaded successfully.');
      resetForm();
      await load();
    } catch (err) {
      console.error(err);
      setMessage('Unable to upload resume.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume version?')) return;
    try {
      await resumeService.deleteResume(user?.token, id);
      setMessage('Resume deleted.');
      await load();
      setCompareSelection((current) => current.filter((item) => item !== id));
    } catch (err) {
      console.error(err);
      setMessage('Unable to delete resume.');
    }
  };

  const handleToggleCompare = (id) => {
    setCompareSelection((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 2) return current;
      return [...current, id];
    });
  };

  const comparison = useMemo(() => {
    return compareSelection
      .map((id) => resumes.find((resume) => resume._id === id))
      .filter(Boolean);
  }, [compareSelection, resumes]);

  const sortedResumes = useMemo(() => {
    return [...resumes].sort((a, b) => {
      if (sortOption === 'highestAts') {
        return (b.atsScore || 0) - (a.atsScore || 0);
      }
      if (sortOption === 'nameAsc') {
        return (a.versionName || '').localeCompare(b.versionName || '');
      }
      return new Date(b.lastUpdatedDate || b.uploadDate) - new Date(a.lastUpdatedDate || a.uploadDate);
    });
  }, [resumes, sortOption]);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Resume Tracker</h2>
            <p className="text-sm text-slate-400">Upload versions, add ATS score, and compare your latest resume improvements.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button onClick={resetForm} className="rounded-md border border-slate-700 px-4 py-2 text-slate-200 hover:border-slate-500">
              Clear form
            </button>
            <button onClick={handleSave} className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">
              {editingId ? 'Save changes' : 'Upload version'}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Version Name</label>
              <input
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                placeholder="e.g. Resume v1.2"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">ATS Score</label>
              <input
                type="number"
                min="0"
                max="100"
                value={atsScore}
                onChange={(e) => setAtsScore(e.target.value)}
                placeholder="Enter ATS score"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Skills</label>
              <input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Comma separated skills"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Improvements</label>
              <input
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                placeholder="Comma separated improvement items"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Feedback / Notes</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows="3"
                placeholder="Anything to remember about this version"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Resume file</label>
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-slate-200" />
              <p className="mt-2 text-sm text-slate-500">Upload a file only for new versions. Leave blank when editing metadata.</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/30 p-4">
              <p className="text-sm text-slate-500">Current action</p>
              <p className="mt-2 text-white">{editingId ? 'Edit existing version' : 'Create a new resume version'}</p>
              {message ? <p className="mt-3 text-sm text-amber-300">{message}</p> : null}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Resume history</h3>
          <p className="text-sm text-slate-400">Sort, compare, edit, and delete your resume versions.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-800 p-6 text-slate-400">Loading resumes...</div>
      ) : resumes.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 p-6 text-slate-400">No resume versions uploaded yet.</div>
      ) : (
        <div className="space-y-4">
          {sortedResumes.map((resume) => (
            <div key={resume._id} className="rounded-3xl border border-slate-800 p-5 bg-[#0B1220]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-white text-lg font-semibold">{resume.versionName}</h4>
                    {resume.isDefault ? <span className="rounded-full bg-slate-700 px-2 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">Default</span> : null}
                  </div>
                  <div className="mt-2 text-slate-400 text-sm">
                    ATS score: <strong className="text-slate-100">{resume.atsScore ?? 0}</strong> · Updated: <strong>{new Date(resume.lastUpdatedDate || resume.uploadDate).toLocaleDateString()}</strong>
                  </div>
                  <div className="mt-2 text-slate-300 text-sm">Skills: {(resume.skills || []).join(', ') || 'Not specified'}</div>
                  {resume.feedback ? <div className="mt-2 text-slate-400 text-sm">Notes: {resume.feedback}</div> : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href={resume.resumeFileUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-slate-200 hover:border-indigo-500">
                    View
                  </a>
                  <button onClick={() => handleEdit(resume)} className="rounded-2xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(resume._id)} className="rounded-2xl bg-rose-600 px-4 py-2 text-white hover:bg-rose-500">
                    Delete
                  </button>
                  <button
                    onClick={() => handleToggleCompare(resume._id)}
                    className={`rounded-2xl px-4 py-2 ${compareSelection.includes(resume._id) ? 'bg-emerald-600 text-white' : 'border border-slate-700 text-slate-200 hover:border-indigo-500'}`}
                  >
                    {compareSelection.includes(resume._id) ? 'Remove compare' : 'Compare'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-3xl border border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-white">Compare resume versions</h3>
        <p className="text-sm text-slate-400">Select up to two versions to compare side by side.</p>
        {comparison.length < 2 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-700 p-6 text-slate-400">
            {comparison.length === 0 ? 'Select two resume versions to compare.' : 'Select one more resume version to show a comparison.'}
          </div>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {comparison.map((resume) => (
              <div key={resume._id} className="rounded-3xl border border-slate-800 bg-[#0B1220] p-5">
                <h4 className="text-white text-lg font-semibold">{resume.versionName}</h4>
                <div className="mt-3 text-slate-400 text-sm">
                  <p>ATS score: <strong className="text-slate-100">{resume.atsScore ?? 0}</strong></p>
                  <p>Updated: <strong>{new Date(resume.lastUpdatedDate || resume.uploadDate).toLocaleDateString()}</strong></p>
                  <p>Skills: <strong>{(resume.skills || []).join(', ') || 'None'}</strong></p>
                  <p>Improvements: <strong>{(resume.improvements || []).join(', ') || 'None'}</strong></p>
                  <p className="mt-3 text-slate-300">{resume.feedback || 'No notes added.'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume;
