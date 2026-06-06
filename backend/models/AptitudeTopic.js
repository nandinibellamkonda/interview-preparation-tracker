const mongoose = require('mongoose');

const aptitudeTopicSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability'],
      required: [true, 'Please select a category'],
    },
    topicName: String,
    completionPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    questionsAttempted: {
      type: Number,
      default: 0,
    },
    questionsCorrect: {
      type: Number,
      default: 0,
    },
    accuracyPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    confidenceRating: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    notes: String,
    lastAttemptDate: Date,
    nextRevisionDate: Date,
  },
  { timestamps: true }
);

aptitudeTopicSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('AptitudeTopic', aptitudeTopicSchema);
