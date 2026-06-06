const mongoose = require('mongoose');

const dailyChallengeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    tasks: [
      {
        taskId: String,
        taskType: {
          type: String,
          enum: ['DSAQuestions', 'SQLProblem', 'JavaTopic', 'AptitudeTest'],
        },
        count: {
          type: Number,
          default: 1,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        completedDate: Date,
      },
    ],
    totalXPReward: {
      type: Number,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedDate: Date,
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
  },
  { timestamps: true }
);

dailyChallengeSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('DailyChallenge', dailyChallengeSchema);
