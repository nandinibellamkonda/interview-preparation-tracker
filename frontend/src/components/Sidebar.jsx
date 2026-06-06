import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SidebarNav from './SidebarNav.jsx';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="w-full max-w-xs border-r border-slate-800 bg-[#09101D] p-5 hidden md:flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-3xl bg-gradient-to-br from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <span className="font-bold">IP</span>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500 tracking-[0.24em]">Interview Prep</p>
            <h1 className="text-lg font-semibold text-white">Tracker Hub</h1>
          </div>
        </div>
        <p className="text-sm text-slate-400">Hello, {user?.fullName || 'Candidate'}.</p>
      </div>

      <SidebarNav />

      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="rounded-3xl bg-[#0F172A] p-4 text-sm text-slate-300">
          <p className="font-semibold text-slate-100">Quick stats</p>
          <p className="mt-2 text-[13px] text-slate-400">XP: {user?.xp || 0} • Streak: {user?.streak || 0}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
