import React from 'react';

const TopicCard = ({ topic = {}, onEdit, onDelete }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400 uppercase tracking-[0.2em]">{topic.topicName}</p>
          <h3 className="text-lg font-semibold text-white">{topic.topicName}</h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">{topic.progressPercentage}%</p>
          <p className="text-xs text-slate-500">Confidence {topic.confidenceRating}/10</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-300">{topic.notes || 'No notes yet.'}</p>
      <div className="mt-4 flex gap-2">
        <button onClick={() => onEdit && onEdit(topic)} className="rounded-2xl border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-indigo-500">Edit</button>
        <button onClick={() => onDelete && onDelete(topic._id)} className="rounded-2xl border border-red-700 px-3 py-2 text-sm text-red-300 hover:border-red-500">Delete</button>
      </div>
    </div>
  );
};

export default TopicCard;
