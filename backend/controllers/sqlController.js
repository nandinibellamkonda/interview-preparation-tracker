const SQLTopic = require('../models/SQLTopic');
const User = require('../models/User');

// Create or Update SQL Topic Progress
exports.createOrUpdateTopic = async (req, res) => {
  try {
    const { topicName, progressPercentage, confidenceRating, notes } = req.body;

    let topic = await SQLTopic.findOne({
      userId: req.userId,
      topicName,
    });

    if (topic) {
      topic = await SQLTopic.findByIdAndUpdate(
        topic._id,
        {
          progressPercentage,
          confidenceRating,
          notes,
          lastStudiedDate: new Date(),
        },
        { new: true }
      );
    } else {
      topic = new SQLTopic({
        userId: req.userId,
        topicName,
        progressPercentage,
        confidenceRating,
        notes,
        lastStudiedDate: new Date(),
      });
      await topic.save();
    }

    res.status(201).json({
      message: 'SQL Topic updated successfully',
      topic,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update topic', error: error.message });
  }
};

// Get All Topics
exports.getTopics = async (req, res) => {
  try {
    const topics = await SQLTopic.find({ userId: req.userId }).sort({ createdAt: -1 });

    res.status(200).json({
      count: topics.length,
      topics,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch topics', error: error.message });
  }
};

// Get Topic by ID
exports.getTopicById = async (req, res) => {
  try {
    const topic = await SQLTopic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (topic.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ topic });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch topic', error: error.message });
  }
};

// Update Topic
exports.updateTopic = async (req, res) => {
  try {
    let topic = await SQLTopic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (topic.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    topic = await SQLTopic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: 'Topic updated successfully',
      topic,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update topic', error: error.message });
  }
};

// Delete Topic
exports.deleteTopic = async (req, res) => {
  try {
    const topic = await SQLTopic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (topic.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await SQLTopic.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete topic', error: error.message });
  }
};

// Get Progress Summary
exports.getProgressSummary = async (req, res) => {
  try {
    const topics = await SQLTopic.find({ userId: req.userId });

    const summary = topics.map((t) => ({
      topicName: t.topicName,
      progressPercentage: t.progressPercentage,
      confidenceRating: t.confidenceRating,
      isCompleted: t.isCompleted,
    }));

    const averageProgress = (
      topics.reduce((sum, t) => sum + t.progressPercentage, 0) / topics.length
    ).toFixed(2);
    const averageConfidence = (
      topics.reduce((sum, t) => sum + t.confidenceRating, 0) / topics.length
    ).toFixed(2);

    res.status(200).json({
      summary,
      averageProgress,
      averageConfidence,
      totalTopics: topics.length,
      completedTopics: topics.filter((t) => t.isCompleted).length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch summary', error: error.message });
  }
};
