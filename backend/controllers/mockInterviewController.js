const MockInterview = require('../models/MockInterview');
const { validateMockInterviewPayload } = require('../utils/validation');

const listMockInterviews = async (req, res) => {
  try {
    const interviews = await MockInterview.find({ userId: req.user._id }).sort('-createdAt');
    return res.status(200).json(interviews);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch mock interviews: ' + error.message });
  }
};

const createMockInterview = async (req, res) => {
  try {
    const errors = validateMockInterviewPayload(req.body);
    if (errors.length) return res.status(400).json({ error: errors.join(' ') });

    const payload = { ...req.body, userId: req.user._id };
    const interview = await MockInterview.create(payload);
    return res.status(201).json(interview);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create mock interview: ' + error.message });
  }
};

const getMockInterview = async (req, res) => {
  try {
    const interview = await MockInterview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) return res.status(404).json({ error: 'Mock interview not found.' });
    return res.json(interview);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch mock interview: ' + error.message });
  }
};

const updateMockInterview = async (req, res) => {
  try {
    const errors = validateMockInterviewPayload(req.body);
    if (errors.length) return res.status(400).json({ error: errors.join(' ') });

    const interview = await MockInterview.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!interview) return res.status(404).json({ error: 'Mock interview not found.' });
    return res.json(interview);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update mock interview: ' + error.message });
  }
};

const deleteMockInterview = async (req, res) => {
  try {
    const result = await MockInterview.deleteOne({ _id: req.params.id, userId: req.user._id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Mock interview not found.' });
    return res.json({ message: 'Mock interview deleted.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete mock interview: ' + error.message });
  }
};

module.exports = {
  listMockInterviews,
  createMockInterview,
  getMockInterview,
  updateMockInterview,
  deleteMockInterview,
};
