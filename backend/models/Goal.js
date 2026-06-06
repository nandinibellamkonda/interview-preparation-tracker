const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, enum: ['DSA', 'SQL', 'Java', 'Aptitude', 'Applications', 'Interviews', 'Resume', 'General'], required: true },
  targetDate: { type: Date, required: true },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed', 'Abandoned'], default: 'Not Started' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Goal', GoalSchema);
