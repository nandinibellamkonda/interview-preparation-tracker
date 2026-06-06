const User = require('../models/User');
const Application = require('../models/Application');
const Topic = require('../models/Topic');
const Goal = require('../models/Goal');
const Interview = require('../models/Interview');
const Company = require('../models/Company');
const MockInterview = require('../models/MockInterview');
const Resume = require('../models/Resume');

const SUBJECTS = ['DSA', 'OS', 'DBMS', 'CN', 'SQL'];
const APPLICATION_STATUSES = ['Applied', 'OA', 'Interview Scheduled', 'Rejected', 'Selected'];

const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const applications = await Application.find({ userId: req.userId });
    const topics = await Topic.find({ userId: req.userId });
    const goals = await Goal.find({ userId: req.userId });
    const interviews = await Interview.find({ userId: req.userId }).sort('interviewDate');
    const companies = await Company.find({ userId: req.userId });

    const upcomingInterviews = interviews.filter((item) => item.interviewDate && new Date(item.interviewDate) >= new Date());

    const completedGoals = goals.filter((goal) => goal.status === 'Completed').length;
    const totalGoals = goals.length;
    const pendingGoals = goals.filter((goal) => goal.status !== 'Completed').length;
    const totalTopics = topics.length;
    const completedTopics = topics.filter((topic) => topic.completed || topic.progressPercentage >= 100).length;

    const totalCompaniesApplied = companies.length;
    const totalRejectedCompanies = companies.filter((company) =>
      [company.oaStatus, company.technicalRound1Status, company.technicalRound2Status, company.hrRoundStatus].includes('Rejected')
    ).length;
    const totalOfferCompanies = companies.filter(
      (company) =>
        company.oaStatus === 'Cleared' &&
        company.technicalRound1Status === 'Cleared' &&
        company.technicalRound2Status === 'Cleared' &&
        company.hrRoundStatus === 'Cleared'
    ).length;
    const activeCompanyProcesses = companies.filter((company) => {
      const overall = [company.oaStatus, company.technicalRound1Status, company.technicalRound2Status, company.hrRoundStatus];
      return !overall.includes('Rejected') && !(company.hrRoundStatus === 'Cleared' && overall.every((status) => status === 'Cleared'));
    }).length;
    const upcomingCompanyInterviews = companies.filter((company) => {
      if (!company.applicationDate) return false;
      const appDate = new Date(company.applicationDate);
      const diffDays = Math.ceil((appDate - new Date()) / (1000 * 60 * 60 * 24));
      const overall = [company.oaStatus, company.technicalRound1Status, company.technicalRound2Status, company.hrRoundStatus];
      return diffDays >= 0 && diffDays <= 30 && overall.includes('Pending');
    }).length;

    const subjectSummary = SUBJECTS.map((subject) => {
      const subjectTopics = topics.filter((topic) => topic.category === subject);
      const averageProgress = subjectTopics.length
        ? Math.round(subjectTopics.reduce((sum, topic) => sum + (topic.progressPercentage || 0), 0) / subjectTopics.length)
        : 0;
      return {
        subject,
        total: subjectTopics.length,
        completed: subjectTopics.filter((topic) => topic.completed || topic.progressPercentage >= 100).length,
        progress: averageProgress,
      };
    });

    const coreSubjects = ['OS', 'DBMS', 'CN', 'SQL'];
    const coreProgressValues = subjectSummary.filter((item) => coreSubjects.includes(item.subject)).map((item) => item.progress);
    const coreSubjectsProgress = coreProgressValues.length
      ? Math.round(coreProgressValues.reduce((sum, value) => sum + value, 0) / coreProgressValues.length)
      : 0;

    const applicationStats = APPLICATION_STATUSES.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});
    applications.forEach((app) => {
      const status = APPLICATION_STATUSES.includes(app.status) ? app.status : 'Applied';
      applicationStats[status] += 1;
    });

    const mockInterviews = await MockInterview.find({ userId: req.userId }).sort('-date');
    const mockInterviewScores = mockInterviews
      .filter((item) => typeof item.score === 'number')
      .map((item) => ({ date: item.date ? item.date.toISOString().split('T')[0] : item.createdAt.toISOString().split('T')[0], score: item.score }))
      .slice(-10);

    const resumes = await Resume.find({ userId: req.userId }).sort('-lastUpdatedDate');
    const totalResumes = resumes.length;
    const highestAtsScore = totalResumes ? Math.max(...resumes.map((item) => Number(item.atsScore) || 0)) : 0;
    const latestResume = resumes[0] || null;
    const latestResumeName = latestResume ? latestResume.versionName : 'No resumes yet';
    const latestResumeScore = latestResume ? Number(latestResume.atsScore) || 0 : 0;
    const latestResumeDate = latestResume ? latestResume.lastUpdatedDate?.toISOString().split('T')[0] : null;

    const totalMockInterviews = mockInterviews.length;
    const averageMockScore = totalMockInterviews
      ? Math.round(mockInterviews.reduce((sum, item) => sum + (Number(item.score) || 0), 0) / totalMockInterviews)
      : 0;
    const highestMockScore = totalMockInterviews
      ? Math.max(...mockInterviews.map((item) => Number(item.score) || 0))
      : 0;
    const latestMockFeedback = mockInterviews.find((item) => item.feedback && item.feedback.trim())?.feedback || 'No recent feedback available.';

    return res.status(200).json({
      stats: {
        totalCompaniesApplied,
        activeCompanyProcesses,
        rejectedCompanies: totalRejectedCompanies,
        offerCompanies: totalOfferCompanies,
        upcomingCompanyInterviews,
        totalStudyGoals: totalTopics,
        totalGoals,
        completedGoals,
        pendingGoals,
        completedTopics,
        dsaProgress: subjectSummary.find((item) => item.subject === 'DSA')?.progress || 0,
        coreSubjectsProgress,
        goalCompletionRate: totalGoals ? Math.round((completedGoals / totalGoals) * 100) : 0,
      },
      subjectProgress: subjectSummary,
      applicationStats,
      mockInterviewScores,
      mockInterviewStats: {
        totalMockInterviews,
        averageMockScore,
        highestMockScore,
        latestMockFeedback,
      },
      resumeStats: {
        totalResumes,
        highestAtsScore,
        latestResumeName,
        latestResumeScore,
        latestResumeDate,
      },
      upcomingInterviews: upcomingInterviews.slice(0, 5),
      recentGoals: goals.slice(-5),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch dashboard', error: error.message });
  }
};

const getWeeklyAnalytics = async (req, res) => {
  try {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      return { date: date.toISOString().split('T')[0], value: 0 };
    });

    const topics = await Topic.find({ userId: req.userId });
    topics.forEach((topic) => {
      if (!topic.lastUpdated) return;
      const updatedDate = topic.lastUpdated.toISOString().split('T')[0];
      const index = last7Days.findIndex((item) => item.date === updatedDate);
      if (index !== -1) last7Days[index].value += 1;
    });

    return res.status(200).json(last7Days);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load weekly analytics', error: error.message });
  }
};

const getMonthlyAnalytics = async (req, res) => {
  try {
    const today = new Date();
    const weeks = Array.from({ length: 4 }).map((_, weekIndex) => {
      const start = new Date(today);
      start.setDate(today.getDate() - (today.getDay() + weekIndex * 7));
      return { week: `Week ${4 - weekIndex}`, value: 0, start };
    });

    const interviews = await Interview.find({ userId: req.userId });
    interviews.forEach((interview) => {
      if (!interview.interviewDate) return;
      const interviewDate = new Date(interview.interviewDate);
      weeks.forEach((week) => {
        if (interviewDate >= week.start && interviewDate < new Date(week.start.getTime() + 7 * 24 * 60 * 60 * 1000)) week.value += 1;
      });
    });

    return res.status(200).json(weeks.map((week) => ({ week: week.week, value: week.value })));
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load monthly analytics', error: error.message });
  }
};

const getTopicDistribution = async (req, res) => {
  try {
    const topics = await Topic.find({ userId: req.userId });
    const distribution = SUBJECTS.map((subject) => ({ subject, count: topics.filter((topic) => topic.category === subject).length }));
    return res.status(200).json(distribution);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load topic distribution', error: error.message });
  }
};

const getReadinessRadar = async (req, res) => {
  try {
    const topics = await Topic.find({ userId: req.userId });
    const goals = await Goal.find({ userId: req.userId });
    const interviews = await Interview.find({ userId: req.userId });

    const dsa = Math.round((topics.filter((topic) => topic.category === 'DSA').reduce((sum, topic) => sum + (topic.progressPercentage || 0), 0)) / Math.max(1, topics.filter((topic) => topic.category === 'DSA').length));
    const core = Math.round(['OS', 'DBMS', 'CN', 'SQL'].map((subject) => {
      const list = topics.filter((topic) => topic.category === subject);
      return list.length ? list.reduce((sum, topic) => sum + (topic.progressPercentage || 0), 0) / list.length : 0;
    }).reduce((sum, value) => sum + value, 0) / 4);
    const goalsProgress = goals.length ? Math.round((goals.filter((goal) => goal.status === 'Completed').length / goals.length) * 100) : 0;
    const interviewPreparation = interviews.length ? Math.min(interviews.filter((item) => item.status === 'Completed').length * 20, 100) : 0;

    return res.status(200).json([
      { category: 'DSA', value: dsa },
      { category: 'Core', value: core },
      { category: 'Goals', value: goalsProgress },
      { category: 'Interviews', value: interviewPreparation },
    ]);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load readiness radar', error: error.message });
  }
};

module.exports = {
  getDashboard,
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getTopicDistribution,
  getReadinessRadar,
};
