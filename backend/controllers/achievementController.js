const Achievement = require('../models/Achievement');
const User = require('../models/User');
const DSAQuestion = require('../models/DSAQuestion');
const MockInterview = require('../models/MockInterview');

// Get User Achievements
exports.getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ userId: req.userId }).sort({ unlockedDate: -1 });

    res.status(200).json({
      count: achievements.length,
      achievements,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch achievements', error: error.message });
  }
};

// Check and Unlock Achievements
exports.checkAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const questions = await DSAQuestion.find({ userId: req.userId });
    const interviews = await MockInterview.find({ userId: req.userId, status: 'completed' });

    const solvedCount = questions.filter((q) => q.isSolved).length;
    const existingAchievements = await Achievement.find({ userId: req.userId });
    const existingTypes = existingAchievements.map((a) => a.achievementType);

    const achievementsToUnlock = [];

    // First Question Solved
    if (solvedCount === 1 && !existingTypes.includes('FirstQuestionSolved')) {
      achievementsToUnlock.push({
        userId: req.userId,
        achievementType: 'FirstQuestionSolved',
        title: 'First Step',
        description: 'Solved your first DSA question',
        icon: '🎉',
        xpReward: 50,
      });
    }

    // Hundred Questions Solved
    if (solvedCount >= 100 && !existingTypes.includes('HundredQuestionsSolved')) {
      achievementsToUnlock.push({
        userId: req.userId,
        achievementType: 'HundredQuestionsSolved',
        title: 'Century',
        description: 'Solved 100 DSA questions',
        icon: '💯',
        xpReward: 500,
      });
    }

    // 30 Day Streak
    if (user.currentStreak >= 30 && !existingTypes.includes('ThirtyDayStreak')) {
      achievementsToUnlock.push({
        userId: req.userId,
        achievementType: 'ThirtyDayStreak',
        title: 'Marathon Runner',
        description: 'Maintained 30 day streak',
        icon: '🔥',
        xpReward: 300,
      });
    }

    // Mock Interview Graduation
    if (interviews.length >= 5 && !existingTypes.includes('MockInterviewGraduation')) {
      achievementsToUnlock.push({
        userId: req.userId,
        achievementType: 'MockInterviewGraduation',
        title: 'Interview Master',
        description: 'Completed 5 mock interviews',
        icon: '🎓',
        xpReward: 200,
      });
    }

    // Unlock achievements
    for (const achievement of achievementsToUnlock) {
      await Achievement.create(achievement);
      await User.findByIdAndUpdate(req.userId, {
        $inc: { totalXP: achievement.xpReward },
      });
    }

    res.status(200).json({
      message: `${achievementsToUnlock.length} new achievements unlocked`,
      newAchievements: achievementsToUnlock,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to check achievements', error: error.message });
  }
};
