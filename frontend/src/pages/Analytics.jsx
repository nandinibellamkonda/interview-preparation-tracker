import React, { useEffect, useMemo, useState } from 'react';
import { analyticsService } from '../services/api.js';
import StudyChart from '../components/StudyChart.jsx';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await analyticsService.getOverview();
        setAnalyticsData(response);
      } catch (err) {
        setError(err.message || 'Unable to load analytics.');
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  const problemsChartData = useMemo(() => {
    return (analyticsData?.problemsPerWeek || []).map((item) => ({
      label: item.date.slice(5),
      value: item.problemsSolved || 0,
    }));
  }, [analyticsData]);

  const topicProgress = analyticsData?.topicProgress || [];
  const interviewSuccess = analyticsData?.interviewSuccess || {};
  const consistency = analyticsData?.consistency || {};
  const summary = analyticsData?.summary || {};

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Analytics Dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Study Analytics</h1>
        <p className="mt-2 text-slate-400 max-w-2xl">Track problems solved, subject progress, interview success, and your consistency streak.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Solved this week</p>
          <p className="mt-4 text-3xl font-semibold text-white">{summary.problemsSolvedThisWeek ?? '-'}</p>
          <p className="mt-2 text-sm text-slate-400">Problems and progress events across goals, topics, and mock interviews.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Topic progress</p>
          <p className="mt-4 text-3xl font-semibold text-white">{summary.averageTopicProgress ?? '-' }%</p>
          <p className="mt-2 text-sm text-slate-400">Average completion across your tracked subjects.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Interview success</p>
          <p className="mt-4 text-3xl font-semibold text-white">{summary.interviewSuccessRate ?? '-'}%</p>
          <p className="mt-2 text-sm text-slate-400">Company processes and mock interview success rate.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Current streak</p>
          <p className="mt-4 text-3xl font-semibold text-white">{summary.currentStreak ?? '-'} days</p>
          <p className="mt-2 text-sm text-slate-400">Consecutive days with tracked progress.</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6 text-slate-400">Loading analytics...</div>
      ) : error ? (
        <div className="rounded-3xl border border-red-800 bg-red-950/40 p-6 text-red-300">{error}</div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {problemsChartData.length > 0 ? (
                <StudyChart data={problemsChartData} />
              ) : (
                <div className="rounded-3xl border border-slate-800 bg-[#121A2D] p-8 text-slate-300">
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Weekly progress</p>
                  <p className="mt-3 text-xl font-semibold text-white">No activity yet</p>
                  <p className="mt-2 text-sm text-slate-400">Complete goals and topics to populate this chart.</p>
                </div>
              )}
            </div>
            <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
              <h2 className="text-lg font-semibold text-white">Interview success</h2>
              <div className="mt-5 space-y-4 text-sm text-slate-300">
                <div className="flex justify-between gap-4">
                  <span>Company success</span>
                  <span className="font-semibold text-white">{interviewSuccess.companySuccessRate ?? 0}%</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Mock interview success</span>
                  <span className="font-semibold text-white">{interviewSuccess.mockInterviewSuccessRate ?? 0}%</span>
                </div>
                <div className="flex justify-between gap-4 border-t border-slate-800 pt-4 text-slate-400">
                  <span>Total companies</span>
                  <span>{interviewSuccess.totalCompanies ?? 0}</span>
                </div>
                <div className="flex justify-between gap-4 text-slate-400">
                  <span>Total mock interviews</span>
                  <span>{interviewSuccess.totalMockInterviews ?? 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold text-white">Topic wise progress</h2>
              {topicProgress.length === 0 ? (
                <p className="mt-4 text-slate-400">No topic progress available. Add subjects or update topic progress to populate this view.</p>
              ) : (
                <div className="mt-5 space-y-4">
                  {topicProgress.map((topic) => (
                    <div key={topic.subject} className="rounded-2xl border border-slate-800 bg-[#121A2D] p-4">
                      <div className="flex items-center justify-between text-sm text-slate-300">
                        <span>{topic.subject}</span>
                        <span className="font-semibold text-white">{topic.progress}%</span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-slate-800">
                        <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${topic.progress}%` }} />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-500">
                        <span>{topic.completed} completed</span>
                        <span>{topic.total} tracked</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
              <h2 className="text-lg font-semibold text-white">Consistency streak</h2>
              <p className="mt-4 text-slate-400">Tracked progress days over the past two weeks.</p>
              <div className="mt-4 grid grid-cols-7 gap-2">
                {(consistency.recentActivity || []).map((day) => (
                  <div key={day.date} className={`h-10 rounded-2xl border ${day.active ? 'border-emerald-500 bg-emerald-600/20' : 'border-slate-700 bg-slate-950'}`}>
                    <span className="block h-full w-full text-center text-[10px] leading-3 text-slate-300">{day.date.slice(5)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Current streak</span>
                  <span className="font-semibold text-white">{consistency.currentStreak ?? 0} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Best streak</span>
                  <span className="font-semibold text-white">{consistency.bestStreak ?? 0} days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
