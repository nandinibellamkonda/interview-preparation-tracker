const mongoose = require('mongoose');

const flashcardDeckSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a deck name'],
      trim: true,
    },
    description: String,
    category: {
      type: String,
      enum: ['DSA', 'Java', 'SQL', 'Aptitude'],
      required: true,
    },
    cardCount: {
      type: Number,
      default: 0,
    },
    createdBy: String,
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

flashcardDeckSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('FlashcardDeck', flashcardDeckSchema);
