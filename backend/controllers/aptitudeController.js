const AptitudeTopic = require('../models/AptitudeTopic');
const User = require('../models/User');

// Create or Update Aptitude Topic
exports.createOrUpdateTopic = async (req, res) => {
  try {
    const { category, topicName, completionPercentage, questionsAttempted, questionsCorrect, confidenceRating, notes } = req.body;

    let topic = await AptitudeTopic.findOne({
      userId: req.userId,
      category,
      topicName,
    });

    const accuracyPercentage = questionsAttempted > 0 
      ? ((questionsCorrect / questionsAttempted) * 100).toFixed(2)
      : 0;

    if (topic) {
      topic = await AptitudeTopic.findByIdAndUpdate(
        topic._id,
        {
          completionPercentage,
          questionsAttempted,
          questionsCorrect,
          accuracyPercentage,
          confidenceRating,
          notes,
          lastAttemptDate: new Date(),
        },
        { new: true }
      );
    } else {
      topic = new AptitudeTopic({
        userId: req.userId,
        category,
        topicName,
        completionPercentage,
        questionsAttempted,
        questionsCorrect,
        accuracyPercentage,
        confidenceRating,
        notes,
        lastAttemptDate: new Date(),
      });
      await topic.save();
    }

    res.status(201).json({
      message: 'Aptitude topic updated successfully',
      topic,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update topic', error: error.message });
  }
};

// Get All Topics by Category
exports.getTopicsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const topics = await AptitudeTopic.find({
      userId: req.userId,
      category,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      category,
      count: topics.length,
      topics,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch topics', error: error.message });
  }
};

// Get All Aptitude Topics
exports.getAllTopics = async (req, res) => {
  try {
    const topics = await AptitudeTopic.find({ userId: req.userId }).sort({ category: 1, createdAt: -1 });

    const categorized = {
      'Quantitative Aptitude': topics.filter((t) => t.category === 'Quantitative Aptitude'),
      'Logical Reasoning': topics.filter((t) => t.category === 'Logical Reasoning'),
      'Verbal Ability': topics.filter((t) => t.category === 'Verbal Ability'),
    };

    res.status(200).json({
      topics,
      categorized,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch topics', error: error.message });
  }
};

// Delete Topic
exports.deleteTopic = async (req, res) => {
  try {
    const topic = await AptitudeTopic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (topic.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await AptitudeTopic.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete topic', error: error.message });
  }
};

// Get Progress Summary
exports.getProgressSummary = async (req, res) => {
  try {
    const topics = await AptitudeTopic.find({ userId: req.userId });

    const categorySummary = {
      'Quantitative Aptitude': {
        completionPercentage: 0,
        accuracy: 0,
        confidence: 0,
      },
      'Logical Reasoning': {
        completionPercentage: 0,
        accuracy: 0,
        confidence: 0,
      },
      'Verbal Ability': {
        completionPercentage: 0,
        accuracy: 0,
        confidence: 0,
      },
    };

    topics.forEach((t) => {
      if (!categorySummary[t.category]) return;
      categorySummary[t.category].completionPercentage = t.completionPercentage;
      categorySummary[t.category].accuracy = t.accuracyPercentage;
      categorySummary[t.category].confidence = t.confidenceRating;
    });

    res.status(200).json({
      categorySummary,
      totalTopics: topics.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch summary', error: error.message });
  }
};
