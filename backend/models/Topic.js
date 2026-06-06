const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topicName: { type: String, required: true },
  category: {
    type: String,
    enum: ['DSA', 'OS', 'DBMS', 'CN', 'SQL'],
    required: true,
    default: 'DSA',
  },
  difficulty: { type: String, default: 'Medium' },
  totalTopics: { type: Number, default: 1, min: 1 },
  completedTopics: { type: Number, default: 0, min: 0 },
  completed: { type: Boolean, default: false },
  progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
  notes: { type: String, default: '' },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

// Update lastUpdated timestamp on save
TopicSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('Topic', TopicSchema);
