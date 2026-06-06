const User = require('../models/User');

// Get Leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const requestedLimit = parseInt(limit, 10);
    const safeLimit = Number.isNaN(requestedLimit) || requestedLimit <= 0 ? 50 : requestedLimit;

    const leaderboard = await User.find()
      .select('name totalXP level avatar profileVisibility')
      .where('profileVisibility')
      .equals('public')
      .sort({ totalXP: -1 })
      .limit(safeLimit);

    // Add rank
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      totalXP: user.totalXP,
      level: user.level,
      avatar: user.avatar,
    }));

    res.status(200).json(rankedLeaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leaderboard', error: error.message });
  }
};

// Get User Rank
exports.getUserRank = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    // Count users with more XP
    const rank = await User.countDocuments({
      totalXP: { $gt: user.totalXP },
      profileVisibility: 'public',
    });

    res.status(200).json({
      rank: rank + 1,
      totalXP: user.totalXP,
      level: user.level,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user rank', error: error.message });
  }
};

// Get Level Info
exports.getLevelInfo = async (req, res) => {
  try {
    const levels = [
      { level: 1, name: 'Beginner', minXP: 0, maxXP: 500 },
      { level: 2, name: 'Learner', minXP: 500, maxXP: 1500 },
      { level: 3, name: 'Coder', minXP: 1500, maxXP: 3000 },
      { level: 4, name: 'Problem Solver', minXP: 3000, maxXP: 5000 },
      { level: 5, name: 'Placement Ready', minXP: 5000, maxXP: Infinity },
    ];

    const user = await User.findById(req.userId);

    const currentLevelInfo = levels.find(
      (l) => user.totalXP >= l.minXP && user.totalXP < l.maxXP
    );

    const nextLevelInfo = levels.find((l) => l.level === currentLevelInfo.level + 1);

    const progressToNextLevel = nextLevelInfo
      ? ((user.totalXP - currentLevelInfo.minXP) /
          (nextLevelInfo.minXP - currentLevelInfo.minXP)) *
        100
      : 100;

    res.status(200).json({
      currentLevel: currentLevelInfo,
      nextLevel: nextLevelInfo,
      currentXP: user.totalXP,
      progressToNextLevel: Math.round(progressToNextLevel),
      allLevels: levels,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch level info', error: error.message });
  }
};
