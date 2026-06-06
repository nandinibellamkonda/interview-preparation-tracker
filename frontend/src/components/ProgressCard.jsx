import React from 'react';

const ProgressCard = ({ label, value, sub }) => {
  return (
    <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-6 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.85)]">
      <p className="text-xs uppercase tracking-[0.32em] text-slate-500">{label}</p>
      <p className="mt-5 text-3xl font-semibold text-white">{value}</p>
      {sub && <p className="mt-3 text-sm text-slate-400">{sub}</p>}
    </div>
  );
};

export default ProgressCard;
