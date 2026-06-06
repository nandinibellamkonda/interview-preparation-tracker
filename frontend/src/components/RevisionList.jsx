import React, { useEffect, useState } from 'react';
import { revisionService } from '../services/api.js';

const RevisionList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await revisionService.getDueRevisions();
        setItems(Array.isArray(resp) ? resp : resp?.revisions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="rounded-[32px] border border-slate-800 bg-slate-950/90 p-6 shadow-glow">
      <h3 className="text-xl font-semibold text-white">Due revisions</h3>
      <p className="mt-2 text-sm text-slate-400">Review items that need your attention next.</p>
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-center text-slate-500">Loading revisions...</div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/80 p-6 text-center text-slate-500">No revisions due</div>
        ) : (
          items.map((r) => (
            <div key={r._id || `${r.itemName}-${r.dueDate}`} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{r.itemType || 'Revision'}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{r.itemName || r.title || 'Revision task'}</p>
                </div>
                <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm text-indigo-300">Due {r.dueDate ? new Date(r.dueDate).toLocaleDateString() : 'TBD'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RevisionList;
