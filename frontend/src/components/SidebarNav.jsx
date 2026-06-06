import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, CheckCircle2, ClipboardList, Briefcase, Star, Layers, BarChart2, UserCircle2 } from 'lucide-react';

const navigationGroups = [
  {
    label: 'DASHBOARD',
    items: [
      { to: '/app', label: 'Dashboard', icon: Home },
    ],
  },
  {
    label: 'PREPARATION',
    items: [
      { to: '/app/subjects', label: 'Subject Progress', icon: Map },
      { to: '/app/goals', label: 'Daily Goals', icon: CheckCircle2 },
      { to: '/app/study-planner', label: 'Study Planner', icon: ClipboardList },
    ],
  },
  {
    label: 'PLACEMENT',
    items: [
      { to: '/app/company', label: 'Company Tracker', icon: Briefcase },
      { to: '/app/mock-interviews', label: 'Mock Interviews', icon: Star },
      { to: '/app/resume', label: 'Resumes', icon: ClipboardList },
    ],
  },
  {
    label: 'PRODUCTIVITY',
    items: [
      { to: '/app/notes', label: 'Notes', icon: Layers },
    ],
  },
  {
    label: 'INSIGHTS',
    items: [
      { to: '/app/analytics', label: 'Study Analytics', icon: BarChart2 },
    ],
  },
  {
    label: 'ACCOUNT',
    items: [
      { to: '/app/profile', label: 'Profile', icon: UserCircle2 },
    ],
  },
];

const SidebarNav = () => {
  return (
    <nav className="flex-1 flex flex-col gap-8">
      {navigationGroups.map((group) => (
        <div key={group.label}>
          <p className="px-4 text-xs uppercase tracking-[0.28em] text-slate-500 font-semibold mb-3">{group.label}</p>
          <div className="flex flex-col gap-1">
            {group.items.map((it) => {
              const Icon = it.icon;
              return (
                <NavLink
                  key={it.to}
                  to={it.to}
                  className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive ? 'bg-indigo-500/15 text-indigo-200 border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {it.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
};

export default SidebarNav;
