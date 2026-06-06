import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Zap, Plus, CheckCircle2, BarChart3, Trophy, Calendar, Flame, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/api.js';
import StudyChart from '../components/StudyChart.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [weeklyAnalytics, setWeeklyAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [dashboardResponse, analyticsResponse] = await Promise.all([
          dashboardService.getDashboard(user?.token),
          dashboardService.getWeeklyAnalytics(user?.token),
        ]);

        setDashboardData(dashboardResponse);
        setWeeklyAnalytics(analyticsResponse || []);
      } catch (err) {
        setError(err.message || 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) {
      loadDashboard();
    }
  }, [user?.token]);

  if (loading) {
    return <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-8 text-center text-slate-400">Loading your dashboard...</div>;
  }

  if (error) {
    return <div className="rounded-3xl border border-red-800 bg-red-950/40 p-6 text-red-300">{error}</div>;
  }

  const readinessScore = Math.max(0, Math.min(100, dashboardData?.stats?.readinessScore ?? 0));
  const currentStreak = dashboardData?.stats?.currentStreak ?? 0;
  const nextInterview = (dashboardData?.upcomingInterviews?.[0] && {
    company: dashboardData.upcomingInterviews[0].companyName || dashboardData.upcomingInterviews[0].company || 'Upcoming interview',
    date: dashboardData.upcomingInterviews[0].interviewDate
      ? new Date(dashboardData.upcomingInterviews[0].interviewDate).toLocaleDateString()
      : dashboardData.upcomingInterviews[0].applicationDate
      ? new Date(dashboardData.upcomingInterviews[0].applicationDate).toLocaleDateString()
      : 'Upcoming',
  }) || null;
  const atsScore = dashboardData?.resumeStats?.highestAtsScore ?? null;
  const hasUserData = Boolean(
    dashboardData?.stats?.totalStudyGoals ||
    dashboardData?.stats?.totalGoals ||
    dashboardData?.stats?.completedGoals ||
    dashboardData?.stats?.completedTopics ||
    dashboardData?.stats?.activeCompanyProcesses ||
    dashboardData?.mockInterviewStats?.totalMockInterviews ||
    dashboardData?.resumeStats?.totalResumes
  );

  const chartData = (weeklyAnalytics || []).map((item) => ({
    label: item.date || item.week || 'Day',
    value: item.questions ?? item.solved ?? 0,
  }));

  const setupSteps = [
    { completed: !!user?.resumes?.length, label: 'Upload Resume', href: '/app/resume', icon: BookOpen },
    { completed: !!dashboardData?.stats?.upcomingCompanyInterviews, label: 'Add Target Company', href: '/app/company', icon: Trophy },
    { completed: !!dashboardData?.stats?.completedGoals, label: 'Create First Goal', href: '/app/goals', icon: CheckCircle2 },
    { completed: !!dashboardData?.stats?.totalQuestionsSolved, label: 'Add Subject Topics', href: '/app/subjects', icon: BarChart3 },
    { completed: !!dashboardData?.studyPlan, label: 'Generate Study Plan', href: '/app/study-planner', icon: Calendar },
  ];

  const completedSetupCount = setupSteps.filter(s => s.completed).length;
  const setupProgress = (completedSetupCount / setupSteps.length) * 100;

  return (
    <div className="space-y-6">
      {/* HERO SECTION */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-[#0F172A] via-[#121B35] to-[#0F172A] p-8 md:p-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-indigo-400">Welcome back</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-white">
              Good Afternoon,<br /> {user?.fullName?.split(' ')[0] || 'Learner'} 👋
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl">Stay focused on your interview prep. Track progress, manage goals, and ace your placements.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#111827]/80 border border-slate-700/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Placement Readiness</p>
                  <p className="mt-3 text-3xl font-bold text-white">{readinessScore}%</p>
                </div>
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-indigo-500/10 border border-indigo-500/30">
                  <span className="text-lg font-semibold text-indigo-300">{readinessScore}%</span>
                </div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-slate-700/40 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-700"
                  style={{ width: `${readinessScore}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl bg-[#111827]/80 border border-slate-700/50 p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Current Streak</p>
              <div className="mt-3 flex items-center gap-3">
                <Flame className="h-6 w-6 text-orange-400" />
                <span className="text-3xl font-bold text-white">{currentStreak}</span>
                <span className="text-sm text-slate-400">days</span>
              </div>
              <p className="mt-4 text-sm text-slate-400">Keep your momentum going!</p>
            </div>

            {nextInterview && (
              <div className="rounded-2xl bg-[#111827]/80 border border-slate-700/50 p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Next Interview</p>
                <p className="mt-3 text-xl font-bold text-white">{nextInterview.company}</p>
                <p className="mt-2 text-sm text-slate-400">{nextInterview.date}</p>
              </div>
            )}

            {atsScore && (
              <div className="rounded-2xl bg-[#111827]/80 border border-slate-700/50 p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">ATS Resume Score</p>
                <p className="mt-3 text-3xl font-bold text-white">{atsScore}%</p>
                <p className="mt-2 text-sm text-slate-400">Latest version</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          to="/app/company"
          className="rounded-2xl border border-slate-800 bg-[#0F172A] hover:bg-slate-900/60 hover:border-indigo-500/50 p-5 transition-all group"
        >
          <Plus className="h-5 w-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
          <p className="mt-3 font-semibold text-white">Add Company</p>
          <p className="mt-1 text-sm text-slate-400">Track your applications</p>
        </Link>

        <Link
          to="/app/goals"
          className="rounded-2xl border border-slate-800 bg-[#0F172A] hover:bg-slate-900/60 hover:border-indigo-500/50 p-5 transition-all group"
        >
          <CheckCircle2 className="h-5 w-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
          <p className="mt-3 font-semibold text-white">Create Goal</p>
          <p className="mt-1 text-sm text-slate-400">Define your daily targets</p>
        </Link>

        <Link
          to="/app/resume"
          className="rounded-2xl border border-slate-800 bg-[#0F172A] hover:bg-slate-900/60 hover:border-indigo-500/50 p-5 transition-all group"
        >
          <BookOpen className="h-5 w-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
          <p className="mt-3 font-semibold text-white">Upload Resume</p>
          <p className="mt-1 text-sm text-slate-400">Improve your ATS score</p>
        </Link>

        <Link
          to="/app/mock-interviews"
          className="rounded-2xl border border-slate-800 bg-[#0F172A] hover:bg-slate-900/60 hover:border-indigo-500/50 p-5 transition-all group"
        >
          <Zap className="h-5 w-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
          <p className="mt-3 font-semibold text-white">Start Mock Interview</p>
          <p className="mt-1 text-sm text-slate-400">Practice your skills</p>
        </Link>
      </div>

      {/* FIRST-TIME USER EXPERIENCE */}
      {!hasUserData && (
        <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 p-8 md:p-10">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-indigo-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white">Let's Get Started</h2>
              <p className="mt-2 text-slate-400">Complete these 5 steps to unlock your personalized study plan and placement readiness insights.</p>

              <div className="mt-6 space-y-3">
                {setupSteps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <Link
                      key={idx}
                      to={step.href}
                      className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-[#0F172A] hover:bg-slate-900/60 p-4 transition-colors group"
                    >
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          step.completed
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-800 text-slate-400 group-hover:text-indigo-400'
                        }`}
                      >
                        {step.completed ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <span className="font-medium text-white flex-1">{step.label}</span>
                      <span className={`text-xs uppercase tracking-[0.2em] ${step.completed ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {step.completed ? '✓ Done' : 'Pending'}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-400">Setup Progress</span>
                  <span className="text-sm font-semibold text-indigo-400">{completedSetupCount} of 5 Complete</span>
                </div>
                <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${setupProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TODAY'S FOCUS & KEY METRICS */}
      {hasUserData && (
        <>
          <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-8">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Today's Focus</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">What to prioritize today</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-[#121A2D] p-4">
                <BookOpen className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-white">Solve 5 Array Problems</p>
                  <p className="text-sm text-slate-400">Build your foundation</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-xs font-semibold text-indigo-300">High Priority</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-[#121A2D] p-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-white">Revise SQL Joins</p>
                  <p className="text-sm text-slate-400">Review weak concepts</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-xs font-semibold text-emerald-300">Medium Priority</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-[#121A2D] p-4">
                <Trophy className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-white">Complete Mock Interview</p>
                  <p className="text-sm text-slate-400">Practice under timed conditions</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-xs font-semibold text-amber-300">Scheduled</span>
              </div>
            </div>
          </div>

          {/* KEY METRICS */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Problems Solved</p>
              <p className="mt-4 text-3xl font-bold text-white">{dashboardData?.stats?.totalQuestionsSolved ?? 0}</p>
              <p className="mt-3 text-sm text-slate-400">Keep practicing daily</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Goals Completed</p>
              <p className="mt-4 text-3xl font-bold text-white">{dashboardData?.stats?.completedGoals ?? 0}</p>
              <p className="mt-3 text-sm text-slate-400">{dashboardData?.stats?.goalCompletionRate ?? 0}% completion rate</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Mock Average Score</p>
              <p className="mt-4 text-3xl font-bold text-white">{dashboardData?.mockInterviewStats?.averageMockScore ?? 0}%</p>
              <p className="mt-3 text-sm text-slate-400">Trending upward</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Applications In Progress</p>
              <p className="mt-4 text-3xl font-bold text-white">{dashboardData?.stats?.upcomingCompanyInterviews ?? 0}</p>
              <p className="mt-3 text-sm text-slate-400">Opportunities this month</p>
            </div>
          </div>

          {/* WEEKLY ANALYTICS CHART */}
          {chartData.length > 0 && (
            <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-8">
              <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Weekly Progress</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Problems solved per week</h2>
              </div>
              <StudyChart data={chartData} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
