const mongoose = require('mongoose');

const dsaQuestionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a question title'],
      trim: true,
    },
    description: String,
    topic: {
      type: String,
      enum: [
        'Arrays',
        'Strings',
        'Linked Lists',
        'Stack',
        'Queue',
        'Trees',
        'Graphs',
        'Binary Search',
        'Heap',
        'Greedy',
        'Backtracking',
        'Dynamic Programming',
      ],
      required: [true, 'Please select a topic'],
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: [true, 'Please select difficulty'],
    },
    platform: {
      type: String,
      enum: ['LeetCode', 'HackerRank', 'CodeChef', 'GeeksforGeeks', 'Other'],
      default: 'LeetCode',
    },
    platformLink: String,
    isSolved: {
      type: Boolean,
      default: false,
    },
    dateSolved: Date,
    timeTaken: {
      type: Number, // in minutes
      default: 0,
    },
    notes: String,
    approach: String,
    timeComplexity: String,
    spaceComplexity: String,
    revisionScheduled: {
      type: Number,
      default: 0,
    },
    lastRevisionDate: Date,
    confidenceRating: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    tags: [String],
    codeSnippet: String,
  },
  { timestamps: true }
);

// Index for common queries
dsaQuestionSchema.index({ userId: 1, topic: 1 });
dsaQuestionSchema.index({ userId: 1, isSolved: 1 });
dsaQuestionSchema.index({ userId: 1, difficulty: 1 });

module.exports = mongoose.model('DSAQuestion', dsaQuestionSchema);
