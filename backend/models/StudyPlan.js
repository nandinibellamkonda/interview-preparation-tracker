const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    planType: {
      type: String,
      enum: ['Weekly', 'Monthly', 'Emergency'],
      required: true,
    },
    placementDate: Date,
    skillLevel: String,
    targetPackage: Number,
    daysRemaining: Number,
    weeks: [
      {
        weekNumber: Number,
        startDate: Date,
        endDate: Date,
        topics: [String],
        targets: [String],
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    totalWeeks: Number,
    isActive: {
      type: Boolean,
      default: true,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  { timestamps: true }
);

studyPlanSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
