import React, { useState } from 'react';
import Roadmap from '../components/Roadmap.jsx';

const Roadmaps = () => {
  const [completedSteps, setCompletedSteps] = useState([]);
  const plan = {
    steps: [
      'Build a strong foundation',
      'Practice 5 questions daily',
      'Review weak topics',
      'Simulate interviews',
    ],
  };

  const toggleStep = (index) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((step) => step !== index) : [...prev, index]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Roadmaps</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Study Roadmaps</h1>
        <p className="mt-2 text-slate-400 max-w-2xl">Explore step-by-step learning plans for DSA, Java, SQL, and interview readiness.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
        <Roadmap plan={plan} />
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <h2 className="text-xl font-semibold text-white">Roadmap Progress</h2>
          <p className="text-sm text-slate-400 mt-2">Track completed steps and mark progress for the next study cycle.</p>
          <div className="mt-5 space-y-3">
            {plan.steps.map((step, index) => (
              <button
                key={step}
                type="button"
                onClick={() => toggleStep(index)}
                className={`w-full rounded-3xl border px-4 py-4 text-left transition ${completedSteps.includes(index) ? 'border-emerald-500 bg-emerald-600/10 text-white' : 'border-slate-700 bg-[#121A2D] text-slate-300 hover:border-indigo-500'}`}>
                <div className="flex items-center justify-between gap-3">
                  <span>{step}</span>
                  <span className="text-xs uppercase tracking-[0.24em] text-slate-400">{completedSteps.includes(index) ? 'Completed' : 'Pending'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmaps;
