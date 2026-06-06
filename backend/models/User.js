const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  college: { type: String },
  branch: { type: String },
  role: { type: String },
  graduationYear: { type: Number },
  joinedAt: { type: Date, default: Date.now },
  lastActiveDate: { type: Date, default: Date.now },
  streak: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  achievements: { type: [String], default: [] },
  readinessScore: { type: Number, default: 0 },
  resumeUploaded: { type: Boolean, default: false },
  linkedinUpdated: { type: Boolean, default: false },
  githubUpdated: { type: Boolean, default: false },
  portfolioCreated: { type: Boolean, default: false },
  mockInterviewScore: { type: Number, default: 0 },
  weaknessAreas: { type: [String], default: [] }
});

module.exports = mongoose.model('User', UserSchema);
