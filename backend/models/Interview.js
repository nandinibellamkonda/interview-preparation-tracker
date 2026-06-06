const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  platform: { type: String, default: 'Virtual' },
  score: { type: Number, min: 0, max: 100, default: 0 },
  feedback: { type: String, default: '' },
  areasToImprove: { type: [String], default: [] },
  interviewDate: { type: Date, required: true },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Skipped'], default: 'Scheduled' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interview', InterviewSchema);
