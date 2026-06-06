import React from 'react';

const ReadinessRadar = ({ breakdown = {} }) => {
  const keys = ['dsa','java','sql','consistency','mock'];
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
      <h3 className="text-lg font-semibold text-white">Readiness Breakdown</h3>
      <div className="mt-4 grid gap-3">
        {keys.map((k) => (
          <div key={k} className="flex items-center justify-between text-sm text-slate-300">
            <span className="capitalize">{k}</span>
            <span>{breakdown[k] ?? 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadinessRadar;
