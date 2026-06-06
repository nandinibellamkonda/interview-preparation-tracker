import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { companyService } from '../services/api.js';

const CompanyPrep = () => {
  const { user } = useAuth();
  const [preps, setPreps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await companyService.getAllPreps(user?.token);
      setPreps(data.preps || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!companyName) return;
    try {
      await companyService.getOrCreatePrep(user?.token, companyName);
      setCompanyName('');
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleItem = async (prepId, index, completed) => {
    try {
      await companyService.updateChecklistItem(user?.token, prepId, { itemIndex: index, completed });
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 p-6">
        <h2 className="text-lg font-semibold text-white">Company Prep</h2>
        <p className="text-sm text-slate-400">Create and track company-specific study checklists.</p>
        <div className="mt-4 flex gap-2">
          <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company name" className="px-3 py-2 bg-[#0B1220] rounded-md border border-slate-700 text-white" />
          <button onClick={handleCreate} className="px-4 py-2 bg-indigo-600 rounded-md text-white">Create / Open</button>
        </div>
      </div>

      {loading ? <div>Loading...</div> : preps.length === 0 ? <div>No company preps yet.</div> : (
        preps.map((p) => (
          <div key={p._id} className="rounded-2xl border border-slate-800 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white font-semibold">{p.company}</h3>
                <p className="text-sm text-slate-400">Readiness: {p.readinessPercentage || 0}%</p>
              </div>
            </div>
            <div className="mt-3 grid gap-2">
              {p.completionChecklist?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={item.completed} onChange={(e) => toggleItem(p._id, idx, e.target.checked)} />
                    <div className="text-sm text-slate-300">{item.item}</div>
                  </div>
                  <div className="text-xs text-slate-500">{item.completedDate ? new Date(item.completedDate).toLocaleDateString() : ''}</div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CompanyPrep;
