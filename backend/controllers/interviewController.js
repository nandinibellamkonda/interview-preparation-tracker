const Interview = require('../models/Interview');

const listInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id }).sort('interviewDate');
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch interviews: ' + error.message });
  }
};

const createInterview = async (req, res) => {
  try {
    const payload = { ...req.body, userId: req.user._id };
    const interview = await Interview.create(payload);
    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create interview: ' + error.message });
  }
};

const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!interview) return res.status(404).json({ error: 'Interview not found.' });
    res.json(interview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update interview: ' + error.message });
  }
};

const deleteInterview = async (req, res) => {
  try {
    const result = await Interview.deleteOne({ _id: req.params.id, userId: req.user._id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Interview not found.' });
    res.json({ message: 'Interview deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete interview: ' + error.message });
  }
};

module.exports = { listInterviews, createInterview, updateInterview, deleteInterview };
