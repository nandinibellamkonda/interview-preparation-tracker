import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ShieldCheck, Layers, Rocket, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Questions Solved', value: '1.2K+' },
  { label: 'Mock interviews', value: '850+' },
  { label: 'Placement-ready', value: '92%' },
];

const features = [
  {
    title: 'Track progress in one dashboard',
    description: 'DSA, Java, SQL, interview readiness, and applications all in one view.',
    icon: ShieldCheck,
  },
  {
    title: 'Smart readiness scoring',
    description: 'AI-inspired score blends streaks, mock interviews, revisions and topic mastery.',
    icon: TrendingUp,
  },
  {
    title: 'Plan your roadmap',
    description: 'Daily, weekly and monthly study plans designed to keep you consistent.',
    icon: Layers,
  },
];

const testimonials = [
  {
    quote: 'PrepPilot helped me stay on track with interview prep and achieve my dream offer.',
    name: 'Aisha R.',
    role: 'Software Intern',
  },
  {
    quote: 'The readiness score and streak dashboard made each day feel purposeful.',
    name: 'Rohit K.',
    role: 'Campus Recruit',
  },
];

const faqs = [
  {
    question: 'Can I track both DSA and core Java preparation?',
    answer: 'Yes. PrepPilot supports dedicated trackers and progress summaries for DSA, Java, SQL, aptitude and more.',
  },
  {
    question: 'Do I need MongoDB Atlas for this app?',
    answer: 'Yes. All user data and progress is stored securely in MongoDB Atlas via JWT-authenticated backend APIs.',
  },
  {
    question: 'Will my schedule update automatically?',
    answer: 'The app generates revision recommendations and roadmap steps based on your progress and streaks.',
  },
];

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),transparent_30%),#06101F] text-slate-100 overflow-hidden">
      <div className="relative isolate px-6 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-white/5 px-4 py-2 text-sm text-slate-300 shadow-lg shadow-slate-900/20">
                <Sparkles className="h-4 w-4 text-sky-300" />
                Launch your placement journey with premium tracker tools.
              </div>
              <div className="max-w-2xl space-y-6">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Track Every Step. Crack Every Interview.</h1>
                <p className="text-lg leading-8 text-slate-400">PrepPilot AI gives students a product-grade interview preparation OS with progress tracking, mock interview analytics, revision plans, and placement momentum.</p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/register" className="rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400">Start Free Trial</Link>
                  <Link to="/login" className="rounded-2xl border border-slate-700 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-indigo-500">Sign In</Link>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-800 bg-white/5 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.25)] backdrop-blur-xl">
                    <p className="text-3xl font-semibold text-white">{item.value}</p>
                    <p className="mt-2 text-sm text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-900/30 backdrop-blur-xl">
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-800 bg-[#07101A] p-6">
                  <div className="flex items-center gap-3 text-slate-100">
                    <Rocket className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Launchpad</p>
                      <p className="mt-2 text-xl font-semibold">Your personalized interview cockpit</p>
                    </div>
                  </div>
                  <p className="mt-4 text-slate-400 text-sm leading-6">Organize topics, applications, mock interviews and revisions with a clean, startup-grade workspace.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div key={feature.title} className="rounded-3xl border border-slate-800 bg-[#0B1723] p-5">
                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sky-300">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="mt-4 text-base font-semibold text-white">{feature.title}</h3>
                        <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="mt-24 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="rounded-[2rem] border border-slate-800 bg-white/5 p-10 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
              <h2 className="text-2xl font-semibold text-white">Why students choose PrepPilot AI</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-[#0B1723] p-5">
                  <h3 className="font-semibold text-white">AI-inspired readiness score</h3>
                  <p className="mt-3 text-sm text-slate-400">See whether you are Beginner, Intermediate, Advanced or Placement Ready based on real progress metrics.</p>
                </div>
                <div className="rounded-3xl bg-[#0B1723] p-5">
                  <h3 className="font-semibold text-white">Clear placement pipeline</h3>
                  <p className="mt-3 text-sm text-slate-400">Track applications, interview stages, offers and rejections with a polished process view.</p>
                </div>
                <div className="rounded-3xl bg-[#0B1723] p-5">
                  <h3 className="font-semibold text-white">Study streak motivation</h3>
                  <p className="mt-3 text-sm text-slate-400">Daily reminders and milestone progress keep your momentum alive.</p>
                </div>
                <div className="rounded-3xl bg-[#0B1723] p-5">
                  <h3 className="font-semibold text-white">Mock interview insights</h3>
                  <p className="mt-3 text-sm text-slate-400">Store scores, feedback and improvement history for every practice interview.</p>
                </div>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="rounded-[2rem] border border-slate-800 bg-[#07101A]/90 p-10 shadow-2xl shadow-slate-900/20 backdrop-blur-xl">
              <h2 className="text-2xl font-semibold text-white">Student Success Stories</h2>
              <div className="mt-8 space-y-4">
                {testimonials.map((item) => (
                  <div key={item.name} className="rounded-3xl bg-[#0B1723] p-6">
                    <p className="text-slate-300">“{item.quote}”</p>
                    <div className="mt-4 text-sm text-slate-500">{item.name}, {item.role}</div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="rounded-[2rem] border border-slate-800 bg-white/5 p-10 shadow-2xl shadow-slate-900/15 backdrop-blur-xl">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_0.7fr]">
              <div>
                <h2 className="text-2xl font-semibold text-white">Placement roadmap</h2>
                <p className="mt-4 text-slate-400">From application tracking to interview prep and offer management, PrepPilot AI surfaces the next priority.</p>
                <ul className="mt-6 space-y-4 text-slate-300">
                  <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />Set your target companies and track every stage.</li>
                  <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-400" />Visualize readiness score, streaks, and mock interview history.</li>
                  <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-400" />Stay on top of revision, topics, and learning goals.</li>
                </ul>
              </div>
              <div className="rounded-3xl bg-[#0B1723] p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Interview Readiness</p>
                <p className="mt-3 text-3xl font-semibold text-white">Placement Ready</p>
                <p className="mt-3 text-slate-400">Your preparation score updates as you complete topics, mock interviews, applications and revision cycles.</p>
              </div>
            </div>
          </motion.div>

          <footer className="mt-24 border-t border-slate-800 pt-10 text-slate-500">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-slate-400">PrepPilot AI © 2026 — Build better placement habits.</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <a href="#" className="text-slate-400 hover:text-white">Terms</a>
                <a href="#" className="text-slate-400 hover:text-white">Privacy</a>
                <a href="#" className="text-slate-400 hover:text-white">Support</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Landing;
