const Activity = require('../models/Activity');

const listActivity = async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user._id }).sort('-date');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity: ' + error.message });
  }
};

module.exports = { listActivity };
