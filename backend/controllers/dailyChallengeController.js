const DailyChallenge = require('../models/DailyChallenge');
const User = require('../models/User');

// Get Today's Challenge
exports.getTodayChallenge = async (req, res) => {
  try {
    const today = new Date().toDateString();
    
    let challenge = await DailyChallenge.findOne({
      userId: req.userId,
      date: {
        $gte: new Date(today),
        $lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (!challenge) {
      // Generate new challenge
      const difficulty = ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)];
      const tasks = [
        { taskType: 'DSAQuestions', count: 2, completed: false },
        { taskType: 'SQLProblem', count: 1, completed: false },
        { taskType: 'JavaTopic', count: 1, completed: false },
      ];

      challenge = new DailyChallenge({
        userId: req.userId,
        date: new Date(),
        tasks,
        totalXPReward: 50,
        difficulty,
      });

      await challenge.save();
    }

    res.status(200).json({
      challenge,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch daily challenge', error: error.message });
  }
};

// Complete Challenge Task
exports.completeTask = async (req, res) => {
  try {
    const { taskId } = req.body;
    const { challengeId } = req.params;

    const challenge = await DailyChallenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    if (challenge.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const task = challenge.tasks.find((t) => t.taskId === taskId);
    if (task) {
      task.completed = true;
      task.completedDate = new Date();
    }

    // Check if all tasks completed
    const allCompleted = challenge.tasks.every((t) => t.completed);
    if (allCompleted) {
      challenge.isCompleted = true;
      challenge.completedDate = new Date();

      // Award XP
      await User.findByIdAndUpdate(req.userId, {
        $inc: { totalXP: challenge.totalXPReward },
      });
    }

    await challenge.save();

    res.status(200).json({
      message: 'Task completed',
      challenge,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to complete task', error: error.message });
  }
};

// Complete Challenge
exports.completeChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge = await DailyChallenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    if (challenge.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    challenge.isCompleted = true;
    challenge.completedDate = new Date();

    // Award XP
    await User.findByIdAndUpdate(req.userId, {
      $inc: { totalXP: challenge.totalXPReward },
    });

    await challenge.save();

    res.status(200).json({
      message: 'Challenge completed successfully',
      challenge,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to complete challenge', error: error.message });
  }
};

// Get Challenge History
exports.getChallengeHistory = async (req, res) => {
  try {
    const { completed } = req.query;

    const filter = { userId: req.userId };
    if (completed !== undefined) filter.isCompleted = completed === 'true';

    const challenges = await DailyChallenge.find(filter).sort({ date: -1 }).limit(30);

    res.status(200).json({
      count: challenges.length,
      challenges,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch challenge history', error: error.message });
  }
};
