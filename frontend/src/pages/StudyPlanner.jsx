import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studyPlanService } from '../services/api.js';
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, ClipboardList, Rocket, ShieldCheck, Sparkles, Target } from 'lucide-react';

const StudyPlanner = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [todayTasks, setTodayTasks] = useState([]);
  const [planType, setPlanType] = useState('Weekly');
  const [placementDate, setPlacementDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().slice(0, 10);
  });
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [targetPackage, setTargetPackage] = useState('6');

  const loadPlan = async () => {
    if (!user?.token) {
      return;
    }

    try {
      setLoading(true);
      const response = await studyPlanService.getStudyPlan(user?.token);
      const activePlan = response?.plan ?? response ?? null;
      setPlan(activePlan);
    } catch (err) {
      setError(err.message || 'Unable to load your study plan.');
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async () => {
    if (!user?.token) {
      setError('Please login to generate a study plan.');
      return;
    }

    setError('');
    try {
      setLoading(true);
      const response = await studyPlanService.generatePlan(user.token, {
        planType,
        placementDate,
        skillLevel,
        targetPackage: Number(targetPackage),
      });
      const activePlan = response?.plan ?? response ?? null;
      if (!activePlan) {
        throw new Error('Unable to create a study plan.');
      }
      setPlan(activePlan);
    } catch (err) {
      setError(err.message || 'Failed to generate study plan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlan();
  }, [user?.token]);

  useEffect(() => {
    if (!plan) {
      setTodayTasks([]);
      return;
    }

    const baseTasks = plan.dailyTasks || [];
    if (baseTasks.length) {
      setTodayTasks(baseTasks.map((task, index) => ({
        ...task,
        id: task.id || `${task.label}-${index}`,
        completed: !!task.completed,
      })));
      return;
    }

    const topics = plan.weeks?.[0]?.topics || [];
    const generated = topics.slice(0, 4).map((topic, index) => ({
      id: `task-${index}`,
      label: topic,
      priority: index < 2 ? 'High' : 'Medium',
      completed: false,
    }));
    setTodayTasks(generated.length ? generated : [
      { id: 'task-1', label: 'Review your first week plan', priority: 'High', completed: false },
      { id: 'task-2', label: 'Refresh weak concepts', priority: 'Medium', completed: false },
    ]);
  }, [plan]);

  const taskCompletion = useMemo(() => {
    if (!todayTasks.length) return 0;
    const completed = todayTasks.filter((task) => task.completed).length;
    return Math.round((completed / todayTasks.length) * 100);
  }, [todayTasks]);

  const completedWeeks = plan?.weeks?.filter((week) => week.completed).length || 0;
  const weeklyCompletion = plan?.totalWeeks ? Math.round((completedWeeks / plan.totalWeeks) * 100) : plan?.progress || 0;

  const hoursToday = plan?.recommendedHours || 3;
  const subjectHours = [
    { label: 'DSA', time: '1.5h' },
    { label: 'SQL', time: '45m' },
    { label: 'OS', time: '45m' },
  ];

  const upcomingInterview = useMemo(() => {
    if (!plan) return null;
    return {
      title: plan.planType ? `${plan.planType} plan due` : 'Upcoming interview',
      countdown: plan.daysRemaining != null ? `${plan.daysRemaining} days` : 'Soon',
      recommendations: plan.weeks?.[0]?.topics?.slice(0, 4) || ['Arrays', 'Strings', 'OS Revision', 'SQL Practice'],
    };
  }, [plan]);

  const weeklySchedule = useMemo(() => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const topics = plan?.weeks?.[0]?.topics || [];
    if (!topics.length) return [];

    const chunkSize = Math.max(1, Math.ceil(topics.length / days.length));
    return days.map((day, index) => ({
      day,
      tasks: topics.slice(index * chunkSize, index * chunkSize + chunkSize),
    })).filter((item) => item.tasks.length);
  }, [plan]);

  const handleToggleTask = (id) => {
    setTodayTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const planActive = !loading && !!plan;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Study planner</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Know what to do today and why it matters.</h1>
            <p className="mt-2 text-slate-400 max-w-2xl">Your plan should help you focus, finish what matters, and keep interview readiness moving forward.</p>
          </div>
          <div className="rounded-3xl bg-[#111827] px-5 py-4 text-sm text-slate-300">
            <Sparkles className="inline h-5 w-5 text-indigo-400" /> {user?.fullName}
          </div>
        </div>
      </div>

      {!planActive ? (
        <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8 text-center">
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Ready to build momentum</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Generate your first study plan.</h2>
          <p className="mt-4 text-slate-400">Add goals, subjects, and target companies to create a meaningful roadmap for interview prep.</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="space-y-4 rounded-3xl border border-slate-800 bg-[#0B1221] p-6 text-left">
              <div>
                <label className="block text-sm font-medium text-slate-300">Plan type</label>
                <select value={planType} onChange={(e) => setPlanType(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500">
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Placement date</label>
                <input type="date" value={placementDate} onChange={(e) => setPlacementDate(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Skill level</label>
                <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Target package (LPA)</label>
                <input type="number" min="1" value={targetPackage} onChange={(e) => setTargetPackage(e.target.value)} placeholder="6" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500" />
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-800 bg-[#0B1221] p-6 text-left">
              <div className="text-left">
                <p className="text-sm uppercase tracking-[0.32em] text-slate-500">What this does</p>
                <p className="mt-3 text-slate-400">The study plan generator creates a personalized plan based on your target date, experience level, and placement goals.</p>
              </div>
              <button onClick={generatePlan} type="button" className="w-full rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-indigo-500">
                Generate plan now
              </button>
              <button type="button" onClick={loadPlan} className="w-full rounded-2xl border border-slate-700 bg-[#101826] px-6 py-4 text-sm font-semibold text-slate-300 hover:border-indigo-500">
                Refresh plan
              </button>
              {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Today's plan</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Finish the most important work first</h2>
                </div>
                <div className="rounded-3xl bg-slate-900 px-4 py-3 text-sm text-slate-300">
                  Today's completion: <strong className="text-white">{taskCompletion}%</strong>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {todayTasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => handleToggleTask(task.id)}
                    className={`flex w-full items-center justify-between gap-4 rounded-3xl border border-slate-800 p-4 text-left transition ${task.completed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-[#111827] hover:border-indigo-500'}`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{task.label}</p>
                      <p className="mt-1 text-xs text-slate-400">Priority {task.priority}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.completed ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <div className="h-5 w-5 rounded-full border border-slate-600" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Weekly plan</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Visualize your week</h2>
                </div>
                <Clock3 className="h-5 w-5 text-slate-400" />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {weeklySchedule.map((item) => (
                  <div key={item.day} className="rounded-3xl border border-slate-800 bg-[#111827] p-4">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{item.day}</p>
                    <div className="mt-4 space-y-2">
                      {item.tasks.map((task) => (
                        <p key={task} className="rounded-2xl bg-slate-900 px-3 py-2 text-sm text-slate-300">• {task}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Upcoming prep</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Interview ready in</h2>
                </div>
                <Target className="h-6 w-6 text-cyan-400" />
              </div>
              <p className="mt-6 text-3xl font-semibold text-white">{upcomingInterview.countdown}</p>
              <p className="mt-2 text-slate-400">{upcomingInterview.title}</p>
              <div className="mt-6 space-y-3">
                {upcomingInterview.recommendations.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-[#111827] px-4 py-3 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Recommended today</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Study hours</h2>
                </div>
                <Clock3 className="h-6 w-6 text-slate-400" />
              </div>
              <p className="mt-6 text-4xl font-semibold text-white">{hoursToday} Hours</p>
              <div className="mt-6 space-y-3">
                {subjectHours.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#111827] px-4 py-3 text-sm text-slate-300">
                    <span>{item.label}</span>
                    <span className="font-semibold text-white">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Progress tracking</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Keep momentum visible</h2>
                </div>
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Today's completion</span>
                    <span>{taskCompletion}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${taskCompletion}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Weekly completion</span>
                    <span>{weeklyCompletion}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-sky-500" style={{ width: `${weeklyCompletion}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;
