const User = require('../models/User');
const DSAQuestion = require('../models/DSAQuestion');
const MockInterview = require('../models/MockInterview');

// Get Placement Readiness
exports.getReadiness = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const dsaQuestions = await DSAQuestion.find({ userId: req.userId });
    const interviews = await MockInterview.find({
      userId: req.userId,
      status: 'completed',
    });

    const solvedCount = dsaQuestions.filter((q) => q.isSolved).length;

    // Calculate scores (each component is out of 100)
    const dsaScore = Math.min((solvedCount / 100) * 100, 100); // Max 100 questions
    const readinessScore = Math.min((user.totalXP / 5000) * 100, 100);
    const interviewScore = Math.min((interviews.length / 10) * 100, 100);
    const streakScore = Math.min((user.currentStreak / 30) * 100, 100);

    // Weighted average
    const overallScore = Math.round(
      dsaScore * 0.4 +
        readinessScore * 0.2 +
        interviewScore * 0.2 +
        streakScore * 0.2
    );

    // Identify weak areas
    const weakAreas = [];
    if (dsaScore < 50) weakAreas.push({ area: 'DSA', score: dsaScore });
    if (readinessScore < 50) weakAreas.push({ area: 'Overall Progress', score: readinessScore });
    if (interviewScore < 50) weakAreas.push({ area: 'Mock Interviews', score: interviewScore });
    if (streakScore < 50) weakAreas.push({ area: 'Consistency', score: streakScore });

    res.status(200).json({
      overallScore,
      components: {
        dsaScore: Math.round(dsaScore),
        readinessScore: Math.round(readinessScore),
        interviewScore: Math.round(interviewScore),
        streakScore: Math.round(streakScore),
      },
      weakAreas,
      recommendations: [
        overallScore < 50 ? 'Increase practice frequency' : '',
        dsaScore < 50 ? 'Focus on solving more DSA problems' : '',
        interviewScore < 50 ? 'Take more mock interviews' : '',
        streakScore < 50 ? 'Maintain daily consistency' : '',
      ].filter((r) => r),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch readiness', error: error.message });
  }
};

// Predict Placement
exports.predictPlacement = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const dsaQuestions = await DSAQuestion.find({ userId: req.userId });
    const interviews = await MockInterview.find({
      userId: req.userId,
      status: 'completed',
    });

    const solvedCount = dsaQuestions.filter((q) => q.isSolved).length;
    const avgInterviewScore =
      interviews.length > 0
        ? interviews.reduce((sum, i) => sum + i.scores.overallScore, 0) / interviews.length
        : 0;

    // Calculate readiness percentages
    const dsaReadiness = Math.min((solvedCount / 150) * 100, 100);
    const generalReadiness = Math.min((user.totalXP / 5000) * 100, 100);
    const interviewReadiness = avgInterviewScore;
    const consistencyReadiness = Math.min((user.currentStreak / 30) * 100, 100);

    // Predict service company readiness (generally easier)
    const serviceReadiness = Math.round(
      dsaReadiness * 0.3 +
        generalReadiness * 0.2 +
        interviewReadiness * 0.2 +
        consistencyReadiness * 0.3
    );

    // Predict product company readiness (generally harder)
    const productReadiness = Math.round(
      dsaReadiness * 0.4 +
        generalReadiness * 0.2 +
        interviewReadiness * 0.25 +
        consistencyReadiness * 0.15
    );

    // Determine if ready
    const isServiceReady = serviceReadiness >= 60;
    const isProductReady = productReadiness >= 70;

    res.status(200).json({
      serviceCompanyReadiness: {
        score: serviceReadiness,
        isReady: isServiceReady,
        message: isServiceReady ? 'You are ready for service companies!' : 'Keep preparing for service companies',
      },
      productCompanyReadiness: {
        score: productReadiness,
        isReady: isProductReady,
        message: isProductReady ? 'You are ready for product companies!' : 'Focus on harder problems for product companies',
      },
      recommendations: [
        !isServiceReady && 'Solve atleast 100+ DSA problems',
        !isProductReady && 'Focus on hard-level problems and system design',
        consistencyReadiness < 50 && 'Maintain a 30-day streak',
        interviewReadiness < 60 && 'Practice more mock interviews',
      ].filter((r) => r),
      daysUntilPlacement: user.placementDate
        ? Math.ceil((new Date(user.placementDate) - new Date()) / (1000 * 60 * 60 * 24))
        : null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to predict placement', error: error.message });
  }
};
