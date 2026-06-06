import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../services/api.js';
import StudyChart from '../components/StudyChart.jsx';
import { ArrowRight, Bolt, FileText, Flag } from 'lucide-react';

const AiInsights = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInsights = async () => {
      if (!user?.token) return;
      setLoading(true);
      setError('');
      try {
        const data = await aiService.getInsights(user.token);
        setInsights(data);
      } catch (err) {
        setError(err.message || 'Unable to load AI insights.');
      } finally {
        setLoading(false);
      }
    };
    loadInsights();
  }, [user?.token]);

  const topicProgressData = useMemo(() => {
    return (insights?.topicProgress || []).map((item) => ({
      label: item.subject || 'Topic',
      value: item.progress ?? 0,
    }));
  }, [insights]);

  const taskList = insights?.studyPlan?.tasks || [];
  const topTasks = taskList.slice(0, 3);
  const weakTopicList = insights?.weakTopics?.weakTopics || [];
  const resumeQuestionCount = (insights?.resumeQuestions?.technicalQuestions?.length || 0)
    + (insights?.resumeQuestions?.projectQuestions?.length || 0)
    + (insights?.resumeQuestions?.hrQuestions?.length || 0);
  const hasReadiness = insights?.readinessScore != null;
  const hasResumeQuestions = resumeQuestionCount > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">AI Insights</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Your preparation assistant</h1>
            <p className="mt-2 text-slate-400 max-w-2xl">Actionable guidance based on goals, topics, mock interviews, company prep, and resume details.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-4 py-3 text-sm text-slate-300">
            <Bolt className="h-4 w-4 text-indigo-400" /> Real-time recommendations
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6 text-slate-400">Loading AI insights...</div>
      ) : error ? (
        <div className="rounded-3xl border border-red-800 bg-red-950/40 p-6 text-red-300">{error}</div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-800 bg-[#0B1324] p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Readiness score</p>
              <p className="mt-4 text-4xl font-semibold text-white">{hasReadiness ? insights.readinessScore : '--'}</p>
              <p className="mt-2 text-sm text-slate-400">{hasReadiness ? insights.readinessLabel : 'Awaiting more preparation data.'}</p>
              {!hasReadiness && (
                <p className="mt-4 text-sm text-slate-500">Add subjects, goals, mock interviews, and company progress to generate your readiness score.</p>
              )}
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#0B1324] p-6">
              <div className="flex items-center gap-3 text-slate-300">
                <Flag className="h-5 w-5 text-indigo-400" />
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Top action</p>
              </div>
              {topTasks.length ? (
                <div className="mt-4 space-y-3">
                  {topTasks.map((task, idx) => (
                    <div key={idx} className="rounded-2xl border border-slate-800 bg-[#111827] p-4">
                      <p className="font-semibold text-white">{task.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{task.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-slate-500">No top actions yet. Add goals or track topics to generate clearer priorities.</p>
              )}
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#0B1324] p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Weak topics</p>
              <p className="mt-4 text-4xl font-semibold text-white">{weakTopicList.length}</p>
              <p className="mt-2 text-sm text-slate-400">Actual progress gaps only.</p>
              {weakTopicList.length === 0 ? (
                <p className="mt-4 text-slate-500">No weak topic data available yet.</p>
              ) : (
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {weakTopicList.slice(0, 3).map((topic, idx) => (
                    <li key={idx} className="rounded-full bg-slate-900 px-3 py-1 inline-block">{topic}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#0B1324] p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Resume questions</p>
              <p className="mt-4 text-4xl font-semibold text-white">{resumeQuestionCount}</p>
              <p className="mt-2 text-sm text-slate-400">Personalized from resume content.</p>
              {!hasResumeQuestions && (
                <p className="mt-4 text-slate-500">Upload a resume to generate personalized interview questions.</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Daily study plan</h2>
                    <p className="mt-3 text-slate-400">Focus on the highest-impact items for today.</p>
                  </div>
                  <Link to="/app/study-planner" className="inline-flex items-center gap-2 rounded-full border border-indigo-500 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200 hover:bg-indigo-500/20">
                    View full plan <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {taskList.length === 0 ? (
                  <div className="mt-6 rounded-3xl border border-dashed border-slate-700 bg-[#0B1221] p-6 text-slate-400">
                    No study actions are available. Add goals, schedule interviews, or update weak subject progress to get a plan.
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {taskList.slice(0, 4).map((task, idx) => (
                      <div key={idx} className="rounded-3xl border border-slate-800 bg-[#121A2D] p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm text-slate-400">{task.priority} priority</p>
                            <p className="mt-2 text-lg font-semibold text-white">{task.title}</p>
                            <p className="mt-2 text-sm text-slate-400">{task.description}</p>
                          </div>
                          <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-indigo-200">{task.estimatedTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">What to improve next</h2>
                    <p className="mt-3 text-slate-400">Clear priorities that push your readiness forward.</p>
                  </div>
                  <Link to="/app/goals" className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-[#111827] px-4 py-2 text-sm text-slate-300 hover:border-indigo-500">
                    Update goals <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-[#111827] p-4">
                    <p className="text-sm text-slate-400">Goal completion</p>
                    <p className="mt-3 text-2xl font-semibold text-white">{insights?.goalCompletion ?? '--'}%</p>
                  </div>
                  <div className="rounded-3xl bg-[#111827] p-4">
                    <p className="text-sm text-slate-400">Mock interview average</p>
                    <p className="mt-3 text-2xl font-semibold text-white">{insights?.mockAverage ?? '--'}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
                <h2 className="text-xl font-semibold text-white">Weak topics</h2>
                {weakTopicList.length === 0 ? (
                  <div className="mt-4 rounded-3xl border border-dashed border-slate-700 bg-[#0B1221] p-6 text-slate-400">
                    No weak topics found yet. Add subject progress data to surface the right focus areas.
                  </div>
                ) : (
                  <ul className="mt-4 space-y-3 text-sm text-slate-300">
                    {weakTopicList.slice(0, 5).map((topic, idx) => (
                      <li key={idx} className="rounded-2xl border border-slate-800 bg-[#111827] p-4">{topic}</li>
                    ))}
                  </ul>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/app/subjects" className="inline-flex items-center gap-2 rounded-full border border-indigo-500 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200 hover:bg-indigo-500/20">
                    Track subjects <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/app/company" className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-[#111827] px-4 py-2 text-sm text-slate-300 hover:border-indigo-500">
                    Review companies <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Resume question preview</h2>
                    <p className="mt-3 text-slate-400">Interview questions generated from your resume content.</p>
                  </div>
                  <Link to="/app/resume" className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-[#111827] px-4 py-2 text-sm text-slate-300 hover:border-indigo-500">
                    Upload resume <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                {hasResumeQuestions ? (
                  <div className="mt-4 space-y-3 text-sm text-slate-300">
                    {insights.resumeQuestions.technicalQuestions?.slice(0, 2).map((question, idx) => (
                      <div key={`tech-${idx}`} className="rounded-2xl border border-slate-800 bg-[#111827] p-4">{question}</div>
                    ))}
                    {insights.resumeQuestions.projectQuestions?.slice(0, 1).map((question, idx) => (
                      <div key={`proj-${idx}`} className="rounded-2xl border border-slate-800 bg-[#111827] p-4">{question}</div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-3xl border border-dashed border-slate-700 bg-[#0B1221] p-6 text-slate-400">
                    Upload a resume to generate personalized interview questions.
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-indigo-400" />
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Insights summary</p>
                    <p className="mt-2 text-sm text-slate-300">Actionable guidance based on your current preparation data.</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3 text-sm text-slate-300">
                  <p>{insights?.readinessExplanation || 'Your insight summary will appear once you add study progress and interview data.'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Subject progress chart</h2>
                <p className="mt-2 text-slate-400">See where your preparation is strongest and where you need to refocus.</p>
              </div>
              <Link to="/app/subjects" className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-[#111827] px-4 py-2 text-sm text-slate-300 hover:border-indigo-500">
                Update subjects <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {(topicProgressData.length === 0) ? (
              <div className="mt-4 rounded-3xl border border-dashed border-slate-700 bg-[#0B1221] p-6 text-slate-400">Add subject progress entries to make this chart actionable.</div>
            ) : (
              <div className="mt-4">
                <StudyChart data={topicProgressData} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiInsights;
