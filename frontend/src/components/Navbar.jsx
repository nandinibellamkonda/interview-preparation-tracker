import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext.jsx';
import { Search, Bell, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="w-full border-b border-slate-800 bg-[#07101A] p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:gap-6">
        <button onClick={() => navigate('/app')} className="text-slate-300 font-semibold">Dashboard</button>
        <div className="relative hidden sm:flex items-center">
          <Search className="absolute left-3 text-slate-400" />
          <input placeholder="Search trackers, topics, companies..." className="pl-10 pr-4 py-2 rounded-2xl bg-[#0B1622] border border-slate-800 text-sm text-slate-300 outline-none w-80" />
        </div>
      </div>

      <div className="flex items-center gap-3 justify-end">
        <button onClick={toggleTheme} className="rounded-2xl border border-slate-700 bg-[#0F172A] p-2 text-slate-300 hover:border-indigo-500">
          {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>
        <button className="p-2 rounded-lg border border-slate-700 bg-[#0F172A] hover:bg-slate-900">
          <Bell className="text-slate-300" />
        </button>
        <div className="text-sm text-slate-300 text-right">
          <div className="font-semibold">{user?.fullName?.split(' ')[0] || 'Candidate'}</div>
          <div className="text-xs text-slate-500">{user?.email}</div>
        </div>
        <button onClick={logout} className="ml-2 rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-indigo-500">Logout</button>
      </div>
    </header>
  );
};

export default Navbar;
