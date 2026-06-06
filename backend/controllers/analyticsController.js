const Goal = require('../models/Goal');
const Topic = require('../models/Topic');
const Company = require('../models/Company');
const MockInterview = require('../models/MockInterview');

const SUBJECTS = ['DSA', 'OS', 'DBMS', 'CN', 'SQL'];

const getDateKey = (date) => date.toISOString().split('T')[0];

const buildRecentDateSeries = (length = 7) => {
  const today = new Date();
  return Array.from({ length }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (length - 1 - index));
    const key = getDateKey(date);
    return { label: key, value: 0, date: key };
  });
};

const getProblemsSolvedPerWeek = (goals, topics, mockInterviews) => {
  const last7 = buildRecentDateSeries(7);
  const counts = last7.reduce((acc, item) => {
    acc[item.date] = 0;
    return acc;
  }, {});

  const addIfRecent = (date, amount = 1) => {
    if (!date) return;
    const key = getDateKey(new Date(date));
    if (key in counts) counts[key] += amount;
  };

  goals.forEach((goal) => {
    if (goal.completedAt) addIfRecent(goal.completedAt, 1);
  });

  topics.forEach((topic) => {
    if (topic.lastUpdated) addIfRecent(topic.lastUpdated, 1);
  });

  mockInterviews.forEach((interview) => {
    const interviewDate = interview.date || interview.createdAt;
    const questionCount = Array.isArray(interview.questions) ? interview.questions.length : 0;
    addIfRecent(interviewDate, Math.max(questionCount, 1));
  });

  return last7.map((item) => ({ date: item.date, problemsSolved: counts[item.date] }));
};

const getTopicWiseProgress = (topics) => {
  return SUBJECTS.map((subject) => {
    const subjectTopics = topics.filter((topic) => topic.category === subject);
    const total = subjectTopics.length;
    const completed = subjectTopics.filter((topic) => topic.completed || topic.progressPercentage >= 100).length;
    const progress = total
      ? Math.round(subjectTopics.reduce((sum, topic) => sum + (topic.progressPercentage || 0), 0) / total)
      : 0;
    return {
      subject,
      total,
      completed,
      progress,
    };
  });
};

const getInterviewSuccessRate = (companies, mockInterviews) => {
  const companySuccessCount = companies.filter((company) => {
    const statuses = [company.oaStatus, company.technicalRound1Status, company.technicalRound2Status, company.hrRoundStatus];
    return company.hrRoundStatus === 'Cleared' && statuses.every((status) => status !== 'Rejected');
  }).length;

  const totalCompanies = companies.length;
  const companySuccessRate = totalCompanies ? Math.round((companySuccessCount / totalCompanies) * 100) : 0;

  const mockSuccessCount = mockInterviews.filter((interview) => interview.status === 'completed' && Number(interview.score) >= 60).length;
  const totalMockInterviews = mockInterviews.length;
  const mockInterviewSuccessRate = totalMockInterviews ? Math.round((mockSuccessCount / totalMockInterviews) * 100) : 0;

  const overallInterviewSuccessRate = totalCompanies || totalMockInterviews
    ? Math.round((companySuccessRate + mockInterviewSuccessRate) / (totalCompanies && totalMockInterviews ? 2 : 1))
    : 0;

  return {
    totalCompanies,
    companySuccessCount,
    companySuccessRate,
    totalMockInterviews,
    mockSuccessCount,
    mockInterviewSuccessRate,
    overallInterviewSuccessRate,
  };
};

const getConsistencyStreak = (goals, topics, companies, mockInterviews) => {
  const activeDates = new Set();
  const addDate = (date) => {
    if (!date) return;
    activeDates.add(getDateKey(new Date(date)));
  };

  goals.forEach((goal) => addDate(goal.completedAt));
  topics.forEach((topic) => addDate(topic.lastUpdated));
  companies.forEach((company) => addDate(company.updatedAt || company.createdAt));
  mockInterviews.forEach((interview) => addDate(interview.date || interview.createdAt));

  const recentDays = buildRecentDateSeries(14);
  const recentActivity = recentDays.map((item) => ({ date: item.date, active: activeDates.has(item.date) }));

  let currentStreak = 0;
  for (let i = recentActivity.length - 1; i >= 0; i -= 1) {
    if (recentActivity[i].active) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  let bestStreak = 0;
  let streak = 0;
  recentActivity.forEach((item) => {
    if (item.active) {
      streak += 1;
      bestStreak = Math.max(bestStreak, streak);
    } else {
      streak = 0;
    }
  });

  return {
    currentStreak,
    bestStreak,
    recentActivity,
  };
};

const getAnalyticsOverview = async (req, res) => {
  try {
    const [goals, topics, companies, mockInterviews] = await Promise.all([
      Goal.find({ userId: req.userId }).lean(),
      Topic.find({ userId: req.userId }).lean(),
      Company.find({ userId: req.userId }).lean(),
      MockInterview.find({ userId: req.userId }).lean(),
    ]);

    const problemsPerWeek = getProblemsSolvedPerWeek(goals, topics, mockInterviews);
    const topicProgress = getTopicWiseProgress(topics);
    const interviewSuccess = getInterviewSuccessRate(companies, mockInterviews);
    const consistency = getConsistencyStreak(goals, topics, companies, mockInterviews);

    const summary = {
      problemsSolvedThisWeek: problemsPerWeek.reduce((sum, item) => sum + item.problemsSolved, 0),
      averageTopicProgress: topicProgress.length
        ? Math.round(topicProgress.reduce((sum, item) => sum + item.progress, 0) / topicProgress.length)
        : 0,
      interviewSuccessRate: interviewSuccess.overallInterviewSuccessRate,
      currentStreak: consistency.currentStreak,
    };

    return res.status(200).json({
      summary,
      problemsPerWeek,
      topicProgress,
      interviewSuccess,
      consistency,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load analytics', error: error.message });
  }
};

module.exports = {
  getAnalyticsOverview,
  getProblemsSolvedPerWeek: async (req, res) => {
    try {
      const [goals, topics, mockInterviews] = await Promise.all([
        Goal.find({ userId: req.userId }).lean(),
        Topic.find({ userId: req.userId }).lean(),
        MockInterview.find({ userId: req.userId }).lean(),
      ]);
      return res.status(200).json(getProblemsSolvedPerWeek(goals, topics, mockInterviews));
    } catch (error) {
      return res.status(500).json({ message: 'Unable to load problems solved data', error: error.message });
    }
  },
  getTopicWiseProgress: async (req, res) => {
    try {
      const topics = await Topic.find({ userId: req.userId }).lean();
      return res.status(200).json(getTopicWiseProgress(topics));
    } catch (error) {
      return res.status(500).json({ message: 'Unable to load topic progress', error: error.message });
    }
  },
  getInterviewSuccessRate: async (req, res) => {
    try {
      const [companies, mockInterviews] = await Promise.all([
        Company.find({ userId: req.userId }).lean(),
        MockInterview.find({ userId: req.userId }).lean(),
      ]);
      return res.status(200).json(getInterviewSuccessRate(companies, mockInterviews));
    } catch (error) {
      return res.status(500).json({ message: 'Unable to load interview success rate', error: error.message });
    }
  },
  getConsistencyStreak: async (req, res) => {
    try {
      const [goals, topics, companies, mockInterviews] = await Promise.all([
        Goal.find({ userId: req.userId }).lean(),
        Topic.find({ userId: req.userId }).lean(),
        Company.find({ userId: req.userId }).lean(),
        MockInterview.find({ userId: req.userId }).lean(),
      ]);
      return res.status(200).json(getConsistencyStreak(goals, topics, companies, mockInterviews));
    } catch (error) {
      return res.status(500).json({ message: 'Unable to load consistency streak', error: error.message });
    }
  },
};
