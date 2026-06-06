const mongoose = require('mongoose');

const sqlTopicSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topicName: {
      type: String,
      enum: [
        'Constraints',
        'Keys',
        'Joins',
        'Subqueries',
        'Normalization',
        'Views',
        'Indexes',
        'Stored Procedures',
        'Triggers',
        'Transactions',
      ],
      required: [true, 'Please select a SQL topic'],
    },
    progressPercentage: {
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
    resources: [
      {
        title: String,
        link: String,
        type: {
          type: String,
          enum: ['Video', 'Article', 'Practice Query', 'Tutorial'],
        },
      },
    ],
    practiceQueries: {
      type: Number,
      default: 0,
    },
    successRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    lastStudiedDate: Date,
    nextRevisionDate: Date,
    isCompleted: {
      type: Boolean,
      default: false,
    },
    revisionCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

sqlTopicSchema.index({ userId: 1, topicName: 1 });

module.exports = mongoose.model('SQLTopic', sqlTopicSchema);
