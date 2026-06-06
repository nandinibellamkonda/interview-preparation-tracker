import React, { useEffect, useState } from 'react';
import { leaderboardService } from '../services/api.js';

const LeaderboardTable = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const resp = await leaderboardService.getLeaderboard(50);
        setList(Array.isArray(resp) ? resp : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-4">
      <h3 className="text-lg font-semibold text-white">Leaderboard</h3>
      {loading ? (
        <div className="text-slate-400 mt-4">Loading...</div>
      ) : (
        <table className="w-full mt-4 text-sm text-slate-300">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="pb-2">Rank</th>
              <th className="pb-2">Name</th>
              <th className="pb-2">XP</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(list)
              ? list.map((u, idx) => (
                  <tr key={u._id || idx} className="border-t border-slate-800">
                    <td className="py-3">#{idx + 1}</td>
                    <td className="py-3">{u.name}</td>
                    <td className="py-3">{u.totalXP ?? 0}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaderboardTable;
