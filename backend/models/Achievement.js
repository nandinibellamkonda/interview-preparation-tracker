const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    achievementType: {
      type: String,
      enum: [
        'FirstQuestionSolved',
        'HundredQuestionsSolved',
        'ThirtyDayStreak',
        'SQLMaster',
        'JavaExpert',
        'PlacementWarrior',
        'LeetCodeHero',
        'HardQuestionsCleared',
        'MockInterviewGraduation',
      ],
      required: true,
    },
    title: String,
    description: String,
    icon: String,
    xpReward: Number,
    unlockedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

achievementSchema.index({ userId: 1 });

module.exports = mongoose.model('Achievement', achievementSchema);
