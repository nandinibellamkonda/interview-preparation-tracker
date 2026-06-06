import React from 'react';
import RevisionList from '../components/RevisionList.jsx';

const Revision = () => {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Revision Center</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Revision Center</h1>
        <p className="mt-2 text-slate-400 max-w-2xl">Keep track of topics and questions scheduled for review.</p>
      </div>
      <RevisionList />
    </div>
  );
};

export default Revision;
