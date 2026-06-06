const DSAQuestion = require('../models/DSAQuestion');
const RevisionSchedule = require('../models/RevisionSchedule');
const User = require('../models/User');

// Create DSA Question
exports.createQuestion = async (req, res) => {
  try {
    const {
      title,
      description,
      topic,
      difficulty,
      platform,
      platformLink,
      isSolved,
      dateSolved,
      timeTaken,
      notes,
      approach,
      timeComplexity,
      spaceComplexity,
      tags,
    } = req.body;

    const question = new DSAQuestion({
      userId: req.userId,
      title,
      description,
      topic,
      difficulty,
      platform,
      platformLink,
      isSolved,
      dateSolved,
      timeTaken,
      notes,
      approach,
      timeComplexity,
      spaceComplexity,
      tags,
    });

    if (isSolved) {
      // Update user stats
      await User.findByIdAndUpdate(req.userId, {
        $inc: { totalQuestionsSolved: 1 },
      });

      // Add XP based on difficulty
      const xpMap = { Easy: 5, Medium: 10, Hard: 20 };
      await User.findByIdAndUpdate(req.userId, {
        $inc: { totalXP: xpMap[difficulty] || 10 },
      });

      // Schedule next revision based on confidence
      const confidenceRating = 5; // default
      let revisionDays = 7;
      if (confidenceRating < 5) {
        revisionDays = 1;
      } else if (confidenceRating < 8) {
        revisionDays = 3;
      }

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + revisionDays);

      await RevisionSchedule.create({
        userId: req.userId,
        itemId: question._id,
        itemType: 'DSAQuestion',
        itemName: title,
        dueDate,
      });
    }

    await question.save();

    res.status(201).json({
      message: 'Question created successfully',
      question,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create question', error: error.message });
  }
};

// Get All Questions
exports.getQuestions = async (req, res) => {
  try {
    const { topic, difficulty, isSolved } = req.query;

    const filter = { userId: req.userId };
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;
    if (isSolved !== undefined) filter.isSolved = isSolved === 'true';

    const questions = await DSAQuestion.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      count: questions.length,
      questions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch questions', error: error.message });
  }
};

// Get Question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const question = await DSAQuestion.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ question });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch question', error: error.message });
  }
};

// Update Question
exports.updateQuestion = async (req, res) => {
  try {
    let question = await DSAQuestion.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const wasNotSolved = !question.isSolved;
    const isSolvedNow = req.body.isSolved;

    question = await DSAQuestion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // If question is marked as solved now
    if (wasNotSolved && isSolvedNow) {
      await User.findByIdAndUpdate(req.userId, {
        $inc: { totalQuestionsSolved: 1 },
      });

      const xpMap = { Easy: 5, Medium: 10, Hard: 20 };
      await User.findByIdAndUpdate(req.userId, {
        $inc: { totalXP: xpMap[question.difficulty] || 10 },
      });
    }

    res.status(200).json({
      message: 'Question updated successfully',
      question,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update question', error: error.message });
  }
};

// Delete Question
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await DSAQuestion.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (question.isSolved) {
      await User.findByIdAndUpdate(req.userId, {
        $inc: { totalQuestionsSolved: -1 },
      });
    }

    await DSAQuestion.findByIdAndDelete(req.params.id);
    await RevisionSchedule.deleteMany({ itemId: req.params.id });

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete question', error: error.message });
  }
};

// Get Analytics
exports.getAnalytics = async (req, res) => {
  try {
    const questions = await DSAQuestion.find({ userId: req.userId });

    // Topic-wise progress
    const topicStats = {};
    questions.forEach((q) => {
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { total: 0, solved: 0 };
      }
      topicStats[q.topic].total++;
      if (q.isSolved) topicStats[q.topic].solved++;
    });

    // Difficulty distribution
    const difficultyStats = {
      Easy: { total: 0, solved: 0 },
      Medium: { total: 0, solved: 0 },
      Hard: { total: 0, solved: 0 },
    };

    questions.forEach((q) => {
      difficultyStats[q.difficulty].total++;
      if (q.isSolved) difficultyStats[q.difficulty].solved++;
    });

    const solvedPercentage = (
      (questions.filter((q) => q.isSolved).length / questions.length) *
      100
    ).toFixed(2);

    res.status(200).json({
      topicStats,
      difficultyStats,
      solvedPercentage,
      totalQuestions: questions.length,
      solvedQuestions: questions.filter((q) => q.isSolved).length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};
