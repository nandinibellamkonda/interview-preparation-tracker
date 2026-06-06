import React from 'react';

const StudyChart = ({ data = [] }) => {
  // Simple sparkline-like bar chart
  const max = Math.max(1, ...data.map((d) => d.value || 0));
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-4">
      <h3 className="text-lg font-semibold text-white">Weekly Questions</h3>
      <div className="mt-3 flex items-end gap-2 h-32">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div style={{ height: `${(d.value / max) * 100}%` }} className="w-full bg-indigo-600 rounded-t-md"></div>
            <div className="text-xs text-slate-400 mt-2">{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyChart;
