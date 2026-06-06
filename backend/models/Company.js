const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    applicationDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    oaStatus: {
      type: String,
      enum: ['Pending', 'Cleared', 'Rejected'],
      default: 'Pending',
    },
    technicalRound1Status: {
      type: String,
      enum: ['Pending', 'Cleared', 'Rejected'],
      default: 'Pending',
    },
    technicalRound2Status: {
      type: String,
      enum: ['Pending', 'Cleared', 'Rejected'],
      default: 'Pending',
    },
    hrRoundStatus: {
      type: String,
      enum: ['Pending', 'Cleared', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

companySchema.index({ userId: 1, companyName: 1, role: 1 });

module.exports = mongoose.model('Company', companySchema);
