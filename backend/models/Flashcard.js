const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: String,
      required: [true, 'Please provide a question'],
    },
    answer: {
      type: String,
      required: [true, 'Please provide an answer'],
    },
    category: {
      type: String,
      enum: ['DSA', 'Java', 'SQL', 'Aptitude'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    deckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FlashcardDeck',
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    correctAttempts: {
      type: Number,
      default: 0,
    },
    lastReviewedDate: Date,
    nextReviewDate: Date,
    easeFactor: {
      type: Number,
      default: 2.5,
    },
    interval: {
      type: Number,
      default: 1, // in days
    },
  },
  { timestamps: true }
);

flashcardSchema.index({ userId: 1, category: 1 });
flashcardSchema.index({ userId: 1, deckId: 1 });

module.exports = mongoose.model('Flashcard', flashcardSchema);
