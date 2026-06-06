const parser = require("@babel/parser");
const code = `const topicList = (() => {
  if (loading) {
    return <p className="text-slate-500">Loading core Java topics...</p>;
  }

  if (topics.length === 0) {
    return <p className="text-slate-500">No Java topics saved yet. Add your first topic above.</p>;
  }

  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <div key={topic._id} className="rounded-3xl border border-slate-800 bg-[#121A2D] p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{topic.topicName}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">Progress: {topic.progressPercentage}%</h3>
              <p className="mt-2 text-sm text-slate-400">Confidence: {topic.confidenceRating}/10</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleEdit(topic)}
                className="rounded-2xl border border-slate-700 bg-[#0F172A] px-4 py-2 text-sm text-slate-200 hover:border-indigo-500"
              >
                <Pencil className="inline h-4 w-4" /> Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(topic._id)}
                className="rounded-2xl border border-red-700 bg-[#170B12] px-4 py-2 text-sm text-red-300 hover:border-red-500"
              >
                <Trash2 className="inline h-4 w-4" /> Delete
              </button>
            </div>
          </div>
          <div className="mt-4 rounded-3xl bg-[#0F172A] p-4 text-sm text-slate-300">
            <p>{topic.notes || 'No notes added for this topic yet.'}</p>
          </div>
        </div>
      ))}
    </div>
  );
})();`;
console.log(parser.parse(code,{sourceType:'module',plugins:['jsx']}));
