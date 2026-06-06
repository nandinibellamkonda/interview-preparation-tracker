const mongoose = require('mongoose');

const revisionScheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    itemType: {
      type: String,
      enum: ['DSAQuestion', 'JavaTopic', 'SQLTopic', 'AptitudeTopic', 'Flashcard'],
      required: true,
    },
    itemName: String,
    dueDate: {
      type: Date,
      required: true,
    },
    confidenceRating: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'skipped'],
      default: 'pending',
    },
    completedDate: Date,
    notes: String,
    revisionNumber: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

revisionScheduleSchema.index({ userId: 1, dueDate: 1 });
revisionScheduleSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('RevisionSchedule', revisionScheduleSchema);
