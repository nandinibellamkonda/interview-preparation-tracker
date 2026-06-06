const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  versionName: { type: String, required: true },
  fileName: { type: String, required: true },
  resumeFileUrl: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  lastUpdatedDate: { type: Date, default: Date.now },
  isDefault: { type: Boolean, default: false },
  atsScore: { type: Number, default: 0 },
  improvements: { type: [String], default: [] },
  feedback: { type: String, default: '' },
  skills: { type: [String], default: [] },
  experience: { type: String, default: '' },
  parsedSkills: { type: [String], default: [] },
  parsedProjects: { type: [String], default: [] },
  parsedTechnologies: { type: [String], default: [] },
  parsedAchievements: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Resume', ResumeSchema);
