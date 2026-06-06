const Goal = require('../models/Goal');
const Topic = require('../models/Topic');
const Company = require('../models/Company');
const MockInterview = require('../models/MockInterview');
const Interview = require('../models/Interview');
const Resume = require('../models/Resume');

const formatMinutes = (minutes) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs > 0 ? `${hrs}h` : ''}${hrs > 0 && mins > 0 ? ' ' : ''}${mins > 0 ? `${mins}m` : '0m'}`;
};

const getSubjectCompletion = (topics) => {
  if (!topics.length) return 0;
  const completed = topics.reduce((sum, topic) => sum + (topic.progressPercentage || 0), 0);
  return Math.round(completed / topics.length);
};

const getGoalCompletion = (goals) => {
  if (!goals.length) return 0;
  const completedCount = goals.filter((goal) => goal.status === 'Completed').length;
  return Math.round((completedCount / goals.length) * 100);
};

const getMockInterviewAverage = (mockInterviews) => {
  const scores = mockInterviews
    .map((interview) => Number(interview.score) || 0)
    .filter((score) => score >= 0);
  if (!scores.length) return 0;
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
};

const getCompanyProgress = (companies) => {
  if (!companies.length) return 0;
  const companyScores = companies.map((company) => {
    const statuses = [company.oaStatus, company.technicalRound1Status, company.technicalRound2Status, company.hrRoundStatus];
    const clearedCount = statuses.filter((status) => status === 'Cleared').length;
    return Math.round((clearedCount / statuses.length) * 100);
  });
  return Math.round(companyScores.reduce((sum, value) => sum + value, 0) / companyScores.length);
};

const getReadinessLabel = (score) => {
  if (score >= 80) return 'Placement Ready';
  if (score >= 60) return 'Advanced';
  if (score >= 40) return 'Intermediate';
  return 'Beginner';
};

const getReadinessExplanation = ({ subjectCompletion, goalCompletion, mockAverage, companyProgress }) => {
  return `Your readiness score blends subject progress (${subjectCompletion}%), goal completion (${goalCompletion}%), mock interview performance (${mockAverage}%), and company pipeline progress (${companyProgress}%).`;
};

const computeReadinessScore = ({ subjectCompletion, goalCompletion, mockAverage, companyProgress }) => {
  const score = Math.round(
    subjectCompletion * 0.35 +
    goalCompletion * 0.2 +
    mockAverage * 0.25 +
    companyProgress * 0.2
  );
  return Math.min(100, Math.max(0, score));
};

const buildStudyPlan = (goals, topics, companies, interviews = []) => {
  const tasks = [];
  const now = new Date();

  const pendingGoals = goals.filter((goal) => !['Completed', 'Abandoned'].includes(goal.status));
  pendingGoals.forEach((goal) => {
    const dueDate = goal.targetDate ? new Date(goal.targetDate) : null;
    const daysUntilDue = dueDate ? Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24)) : 30;
    const priority = daysUntilDue <= 5 ? 'High' : daysUntilDue <= 14 ? 'Medium' : 'Low';
    tasks.push({
      title: `Complete goal: ${goal.title}`,
      description: dueDate
        ? `Due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'} — prioritize this milestone.`
        : 'Pending goal with no due date set.',
      estimatedTime: formatMinutes(priority === 'High' ? 90 : priority === 'Medium' ? 60 : 40),
      priority,
      dateKey: dueDate ? dueDate.getTime() : 0,
    });
  });

  const weakSubjects = topics.reduce((acc, topic) => {
    if (topic.progressPercentage < 75) {
      acc[topic.category] = acc[topic.category] || { total: 0, count: 0 };
      acc[topic.category].total += topic.progressPercentage || 0;
      acc[topic.category].count += 1;
    }
    return acc;
  }, {});

  Object.entries(weakSubjects).forEach(([subject, stats]) => {
    const average = Math.round(stats.total / stats.count);
    const priority = average < 50 ? 'High' : 'Medium';
    tasks.push({
      title: `Strengthen ${subject}`,
      description: `Focus on ${subject} topics with average completion of ${average}% to improve your readiness.`,
      estimatedTime: formatMinutes(priority === 'High' ? 75 : 50),
      priority,
      dateKey: 0,
    });
  });

  const upcomingCompanies = companies
    .filter((company) => company.applicationDate)
    .filter((company) => {
      const applicationDate = new Date(company.applicationDate);
      const daysAhead = Math.ceil((applicationDate - now) / (1000 * 60 * 60 * 24));
      return daysAhead >= 0 && daysAhead <= 30;
    });

  upcomingCompanies.forEach((company) => {
    const applicationDate = new Date(company.applicationDate);
    const daysAhead = Math.ceil((applicationDate - now) / (1000 * 60 * 60 * 24));
    const priority = daysAhead <= 7 ? 'High' : 'Medium';
    tasks.push({
      title: `Prepare for ${company.companyName} interview`,
      description: `Review your company process and interview notes for ${company.role}.`,
      estimatedTime: formatMinutes(priority === 'High' ? 80 : 50),
      priority,
      dateKey: applicationDate.getTime(),
    });
  });

  const upcomingInterviews = interviews
    .filter((interview) => interview.status === 'Scheduled')
    .filter((interview) => {
      const interviewDate = new Date(interview.interviewDate);
      const daysAhead = Math.ceil((interviewDate - now) / (1000 * 60 * 60 * 24));
      return daysAhead >= 0 && daysAhead <= 30;
    });

  upcomingInterviews.forEach((interview) => {
    const interviewDate = new Date(interview.interviewDate);
    const daysAhead = Math.ceil((interviewDate - now) / (1000 * 60 * 60 * 24));
    const priority = daysAhead <= 7 ? 'High' : 'Medium';
    tasks.push({
      title: `Prep for ${interview.company} interview`,
      description: `Practice your answers and review feedback for the scheduled ${interview.platform} interview.`,
      estimatedTime: formatMinutes(priority === 'High' ? 90 : 55),
      priority,
      dateKey: interviewDate.getTime(),
    });
  });

  const orderedTasks = tasks.sort((a, b) => {
    const priorityWeight = { High: 2, Medium: 1, Low: 0 };
    if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    return (a.dateKey || 0) - (b.dateKey || 0);
  });

  const totalMinutes = orderedTasks.reduce((sum, task) => sum + (parseInt(task.estimatedTime, 10) || 0), 0);
  const priorityLevel = orderedTasks.some((task) => task.priority === 'High')
    ? 'High'
    : orderedTasks.some((task) => task.priority === 'Medium')
    ? 'Medium'
    : 'Low';

  return {
    tasks: orderedTasks,
    estimatedStudyTime: formatMinutes(totalMinutes),
    priorityLevel,
  };
};

const getTopicProgress = (topics) => {
  const subjectData = topics.reduce((acc, topic) => {
    const subject = topic.category || 'DSA';
    acc[subject] = acc[subject] || { total: 0, count: 0 };
    acc[subject].total += topic.progressPercentage || 0;
    acc[subject].count += 1;
    return acc;
  }, {});

  return Object.entries(subjectData).map(([subject, stats]) => ({
    subject,
    progress: Math.round(stats.total / stats.count),
  })).sort((a, b) => a.subject.localeCompare(b.subject));
};

const getWeakTopics = (topics) => {
  const weakTopics = topics
    .filter((topic) => !topic.completed && (topic.progressPercentage || 0) < 80)
    .sort((a, b) => (a.progressPercentage || 0) - (b.progressPercentage || 0));

  const categorySummaries = {};
  topics.forEach((topic) => {
    const key = topic.category || 'General';
    if (!categorySummaries[key]) {
      categorySummaries[key] = { total: 0, count: 0 };
    }
    categorySummaries[key].total += topic.progressPercentage || 0;
    categorySummaries[key].count += 1;
  });

  const recommendedFocusAreas = [];
  Object.keys(categorySummaries).forEach((subject) => {
    const stats = categorySummaries[subject];
    const progress = Math.round(stats.total / stats.count);
    if (progress < 85) {
      recommendedFocusAreas.push({ subject, progress });
    }
  });

  recommendedFocusAreas.sort((a, b) => a.progress - b.progress);
  if (recommendedFocusAreas.length > 5) {
    recommendedFocusAreas.splice(5);
  }

  const recommendedFocusAreaLabels = recommendedFocusAreas.length > 0
    ? recommendedFocusAreas.map((item) => item.subject + ': ' + item.progress + '% progress')
    : ['No weak focus areas identified yet.'];

  const suggestedNextTopics = weakTopics.slice(0, 5).map((topic) => {
    return topic.topicName || (topic.category ? topic.category + ' topic' : 'General topic');
  });

  const weakTopicStrings = [];
  weakTopics.slice(0, 5).forEach((topic) => {
    weakTopicStrings.push(
      (topic.topicName || 'Topic') + ' (' + (topic.category || 'General') + ') - ' + (topic.progressPercentage || 0) + '%'
    );
  });

  return {
    weakTopics: weakTopicStrings,
    recommendedFocusAreas: recommendedFocusAreaLabels,
    suggestedNextTopics: suggestedNextTopics.length > 0 ? suggestedNextTopics : ['Continue building coverage across incomplete topics.'],
  };
};

const generateResumeQuestions = (resumes) => {
  if (!Array.isArray(resumes) || resumes.length === 0) {
    return {
      technicalQuestions: [],
      projectQuestions: [],
      hrQuestions: [],
    };
  }

  const skills = new Set();
  const improvements = new Set();
  const feedbacks = new Set();
  const experiences = new Set();

  resumes.forEach((resume) => {
    (resume.skills || []).forEach((skill) => {
      if (skill) skills.add(skill);
    });
    (resume.parsedSkills || []).forEach((skill) => {
      if (skill) skills.add(skill);
    });
    (resume.parsedTechnologies || []).forEach((tech) => {
      if (tech) skills.add(tech);
    });
    (resume.improvements || []).forEach((item) => {
      if (item) improvements.add(item);
    });
    (resume.parsedProjects || []).forEach((project) => {
      if (project) improvements.add(project);
    });
    (resume.parsedAchievements || []).forEach((achievement) => {
      if (achievement) feedbacks.add(achievement);
    });
    if (resume.feedback) feedbacks.add(resume.feedback);
    if (resume.experience) experiences.add(resume.experience);
  });

  const skillList = Array.from(skills).slice(0, 6);
  const improvementList = Array.from(improvements).slice(0, 4);
  const feedbackList = Array.from(feedbacks).slice(0, 3);
  const experienceList = Array.from(experiences).slice(0, 3);

  const technicalQuestions = skillList.length
    ? skillList.map((skill) => `Describe your most significant experience using ${skill} and how you applied it in a project.`)
    : ['Describe your technical strengths and how you use them in practice.'];

  const projectQuestions = improvementList.length
    ? improvementList.map((item) => `Tell me about a project where you achieved ${item} and the steps you took.`)
    : experienceList.length
    ? experienceList.map((item) => `Tell me about your experience with ${item} and the outcome.`)
    : ['Walk me through a recent project you completed and the value it delivered.'];

  const hrQuestions = feedbackList.length
    ? feedbackList.map((item) => `How do you incorporate feedback such as “${item}” into your work style?`)
    : ['What motivates you when you are preparing for interviews?'];

  return {
    technicalQuestions: technicalQuestions.slice(0, 4),
    projectQuestions: projectQuestions.slice(0, 4),
    hrQuestions: hrQuestions.slice(0, 4),
  };
};

const getInsights = async (req, res) => {
  try {
    const [goals, topics, companies, mockInterviews, interviews, resumes] = await Promise.all([
      Goal.find({ userId: req.userId }).lean(),
      Topic.find({ userId: req.userId }).lean(),
      Company.find({ userId: req.userId }).lean(),
      MockInterview.find({ userId: req.userId }).lean(),
      Interview.find({ userId: req.userId }).lean(),
      Resume.find({ userId: req.userId }).lean(),
    ]);

    const subjectCompletion = getSubjectCompletion(topics);
    const goalCompletion = getGoalCompletion(goals);
    const mockAverage = getMockInterviewAverage(mockInterviews);
    const companyProgress = getCompanyProgress(companies);
    const hasInsightData = topics.length || goals.length || mockInterviews.length || companies.length || interviews.length || resumes.length;
    const readinessScore = hasInsightData ? computeReadinessScore({ subjectCompletion, goalCompletion, mockAverage, companyProgress }) : null;
    const readinessLabel = readinessScore !== null ? getReadinessLabel(readinessScore) : 'Awaiting more data';
    const readinessExplanation = readinessScore !== null
      ? getReadinessExplanation({ subjectCompletion, goalCompletion, mockAverage, companyProgress })
      : 'Add subjects, goals, mock interviews, and company progress to generate your readiness score.';
    const studyPlan = buildStudyPlan(goals, topics, companies, interviews);
    const weakTopics = getWeakTopics(topics);
    const resumeQuestions = generateResumeQuestions(resumes);
    const topicProgress = getTopicProgress(topics);

    return res.status(200).json({
      readinessScore,
      readinessLabel,
      readinessExplanation,
      subjectCompletion,
      goalCompletion,
      mockAverage,
      companyProgress,
      topicProgress,
      studyPlan,
      weakTopics,
      resumeQuestions,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to compute AI insights', error: error.message });
  }
};

const getReadinessScore = async (req, res) => {
  try {
    const [goals, topics, companies, mockInterviews] = await Promise.all([
      Goal.find({ userId: req.userId }).lean(),
      Topic.find({ userId: req.userId }).lean(),
      Company.find({ userId: req.userId }).lean(),
      MockInterview.find({ userId: req.userId }).lean(),
    ]);
    const subjectCompletion = getSubjectCompletion(topics);
    const goalCompletion = getGoalCompletion(goals);
    const mockAverage = getMockInterviewAverage(mockInterviews);
    const companyProgress = getCompanyProgress(companies);
    const readinessScore = computeReadinessScore({ subjectCompletion, goalCompletion, mockAverage, companyProgress });
    const readinessLabel = getReadinessLabel(readinessScore);
    const readinessExplanation = getReadinessExplanation({ subjectCompletion, goalCompletion, mockAverage, companyProgress, score: readinessScore });
    return res.status(200).json({ readinessScore, readinessLabel, readinessExplanation, subjectCompletion, goalCompletion, mockAverage, companyProgress });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load readiness score', error: error.message });
  }
};

const getDailyStudyPlan = async (req, res) => {
  try {
    const [goals, topics, companies, interviews] = await Promise.all([
      Goal.find({ userId: req.userId }).lean(),
      Topic.find({ userId: req.userId }).lean(),
      Company.find({ userId: req.userId }).lean(),
      Interview.find({ userId: req.userId }).lean(),
    ]);
    return res.status(200).json(buildStudyPlan(goals, topics, companies, interviews));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load study plan', error: error.message });
  }
};

const getWeakTopicRecommendations = async (req, res) => {
  try {
    const topics = await Topic.find({ userId: req.userId }).lean();
    return res.status(200).json(getWeakTopics(topics));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load weak topic recommendations', error: error.message });
  }
};

const getResumeQuestions = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).lean();
    return res.status(200).json(generateResumeQuestions(resumes));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load resume questions', error: error.message });
  }
};

module.exports = {
  getInsights,
  getReadinessScore,
  getDailyStudyPlan,
  getWeakTopicRecommendations,
  getResumeQuestions,
};
