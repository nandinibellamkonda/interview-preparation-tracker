const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  package: { type: String, default: '' },
  applicationDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Applied', 'OA', 'Interview Scheduled', 'Rejected', 'Selected'],
    default: 'Applied',
  },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);
