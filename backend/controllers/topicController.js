const Topic = require('../models/Topic');
const { validateTopicPayload } = require('../utils/validation');

const listTopics = async (req, res) => {
  try {
    const topics = await Topic.find({ userId: req.user._id }).sort({ category: 1, topicName: 1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch topics: ' + error.message });
  }
};

const createTopic = async (req, res) => {
  try {
    const payload = { ...req.body, userId: req.user._id };
    const validationError = validateTopicPayload(payload);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    payload.completed = payload.completedTopics >= payload.totalTopics;
    payload.progressPercentage = payload.totalTopics
      ? Math.round((payload.completedTopics / payload.totalTopics) * 100)
      : 0;
    const topic = await Topic.create(payload);
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create topic: ' + error.message });
  }
};

const updateTopic = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (payload.topicName !== undefined) {
      if (!payload.topicName || typeof payload.topicName !== 'string' || !payload.topicName.trim()) {
        return res.status(400).json({ error: 'Topic name is required.' });
      }
      payload.topicName = payload.topicName.trim();
    }

    if (payload.category !== undefined) {
      const validationError = validateTopicPayload({
        topicName: payload.topicName || '',
        category: payload.category,
        totalTopics: payload.totalTopics !== undefined ? payload.totalTopics : 1,
        completedTopics: payload.completedTopics !== undefined ? payload.completedTopics : 0,
      });
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }
    }

    if (payload.totalTopics !== undefined || payload.completedTopics !== undefined) {
      const current = await Topic.findOne({ _id: req.params.id, userId: req.user._id });
      if (!current) return res.status(404).json({ error: 'Topic not found.' });
      payload.totalTopics = payload.totalTopics !== undefined ? Number(payload.totalTopics) : current.totalTopics;
      payload.completedTopics = payload.completedTopics !== undefined ? Number(payload.completedTopics) : current.completedTopics;
      if (payload.completedTopics < 0 || payload.completedTopics > payload.totalTopics) {
        return res.status(400).json({ error: 'Completed topics must be between 0 and total topics.' });
      }
      payload.completed = payload.completedTopics >= payload.totalTopics;
      payload.progressPercentage = payload.totalTopics
        ? Math.round((payload.completedTopics / payload.totalTopics) * 100)
        : current.progressPercentage;
    }

    const topic = await Topic.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      payload,
      { new: true }
    );
    if (!topic) return res.status(404).json({ error: 'Topic not found.' });
    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update topic: ' + error.message });
  }
};

const deleteTopic = async (req, res) => {
  try {
    const result = await Topic.deleteOne({ _id: req.params.id, userId: req.user._id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Topic not found.' });
    res.json({ message: 'Topic deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete topic: ' + error.message });
  }
};

module.exports = { listTopics, createTopic, updateTopic, deleteTopic };
