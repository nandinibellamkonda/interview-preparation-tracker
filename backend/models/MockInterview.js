const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    platform: {
      type: String,
      required: true,
      trim: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    feedback: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Core Java', 'SQL', 'DSA', 'HR'],
      default: 'DSA',
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: Date,
    duration: Number,
    questions: [
      {
        questionId: String,
        question: String,
        userAnswer: String,
        correctAnswer: String,
        followUpQuestions: [String],
        userFollowUpAnswers: [String],
        isCorrect: Boolean,
        timeTaken: Number,
      },
    ],
    scores: {
      technicalScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      communicationScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      confidenceScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      overallScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
    },
    strengths: [String],
    areasForImprovement: [String],
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'abandoned'],
      default: 'in-progress',
    },
  },
  { timestamps: true }
);

mockInterviewSchema.index({ userId: 1, platform: 1 });
mockInterviewSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('MockInterview', mockInterviewSchema);
