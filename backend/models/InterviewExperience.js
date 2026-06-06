const mongoose = require('mongoose');

const interviewExperienceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      index: true,
    },
    role: {
      type: String,
      required: [true, 'Please provide job role'],
    },
    rounds: {
      type: Number,
      required: true,
    },
    interviewDate: Date,
    questionAsked: [String],
    result: {
      type: String,
      enum: ['Selected', 'Rejected', 'In Progress', 'Under Review'],
      default: 'Under Review',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    experience: {
      type: String,
      required: true,
    },
    tips: [String],
    interviewerAttitude: {
      type: String,
      enum: ['Very Friendly', 'Friendly', 'Neutral', 'Strict'],
    },
    overallExperience: {
      type: Number,
      min: 1,
      max: 5,
    },
    helpfulness: {
      type: Number,
      default: 0,
    }, // upvotes
    upvotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

interviewExperienceSchema.index({ company: 1 });
interviewExperienceSchema.index({ userId: 1 });
interviewExperienceSchema.index({ createdAt: -1 });

module.exports = mongoose.model('InterviewExperience', interviewExperienceSchema);
