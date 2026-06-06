const Application = require('../models/Application');

const listApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id }).sort('-applicationDate');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications: ' + error.message });
  }
};

const createApplication = async (req, res) => {
  try {
    const payload = { ...req.body, userId: req.user._id };
    const application = await Application.create(payload);
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create application: ' + error.message });
  }
};

const updateApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!application) return res.status(404).json({ error: 'Application not found.' });
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application: ' + error.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const result = await Application.deleteOne({ _id: req.params.id, userId: req.user._id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Application not found.' });
    res.json({ message: 'Application deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete application: ' + error.message });
  }
};

module.exports = { listApplications, createApplication, updateApplication, deleteApplication };
