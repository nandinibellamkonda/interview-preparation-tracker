const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a note title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide note content'],
    },
    category: {
      type: String,
      enum: ['DSA', 'SQL', 'OS', 'Interview Experiences', 'Revision Notes', 'Aptitude', 'General'],
      default: 'General',
    },
    relatedTopic: String,
    tags: [String],
    isPinned: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      enum: ['yellow', 'blue', 'green', 'purple', 'red', 'gray'],
      default: 'yellow',
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

noteSchema.index({ userId: 1, category: 1 });
noteSchema.index({ userId: 1, isArchived: 1 });

module.exports = mongoose.model('Note', noteSchema);
