const mongoose = require('mongoose');

const companyPrepSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    frequentlyAskedTopics: [String],
    completionChecklist: [
      {
        item: String,
        completed: {
          type: Boolean,
          default: false,
        },
        completedDate: Date,
      },
    ],
    readinessPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    resources: [
      {
        title: String,
        link: String,
        type: String,
      },
    ],
    notes: String,
    startDate: Date,
    targetCompletionDate: Date,
  },
  { timestamps: true }
);

companyPrepSchema.index({ userId: 1, company: 1 });

module.exports = mongoose.model('CompanyPrep', companyPrepSchema);
