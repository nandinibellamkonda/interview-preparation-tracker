import React from 'react';

const Roadmap = ({ plan = {} }) => {
  return (
    <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-6 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.85)]">
      <h2 className="text-lg font-semibold text-white">AI Study Roadmap</h2>
      <p className="text-sm text-slate-400 mt-2">Personalized plan generated from your targets and progress.</p>
      <div className="mt-4 space-y-3">
        {(plan.steps || ['Start DSA basics', 'Practice 5 problems/day', 'Revise weak topics']).map((s, i) => (
          <div key={i} className="rounded-2xl bg-slate-900/90 p-4 text-sm text-slate-300 flex items-center justify-between gap-4">
            <div className="min-w-0 text-sm leading-6">{s}</div>
            <div className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">Next</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;
