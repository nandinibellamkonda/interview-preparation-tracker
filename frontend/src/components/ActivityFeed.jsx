import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/api.js';

const ActivityFeed = ({ items: initialItems = [] }) => {
  const { user } = useAuth();
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    const load = async () => {
      if (initialItems.length > 0) {
        setItems(initialItems);
        return;
      }

      try {
        const resp = await dashboardService.getDashboard(user?.token);
        setItems(resp?.recentActivity || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [initialItems]);

  return (
    <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-6 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.85)]">
      <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
      <div className="mt-4 space-y-3 text-sm text-slate-300">
        {items.length === 0 ? (
          <div className="text-slate-500">No recent activity</div>
        ) : (
          items.map((a, i) => (
            <div key={i} className="rounded-2xl bg-slate-900/90 p-4">
              <div className="text-sm leading-6 text-slate-300">{typeof a === 'string' ? a : a.description || a.action || JSON.stringify(a)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
