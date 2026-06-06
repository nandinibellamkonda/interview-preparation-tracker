const mongoose = require('mongoose');

const javaTopicSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topicName: {
      type: String,
      enum: [
        'OOP',
        'Inheritance',
        'Polymorphism',
        'Abstraction',
        'Encapsulation',
        'Collections Framework',
        'Exception Handling',
        'Multithreading',
        'JVM',
        'JDK vs JRE',
        'Garbage Collection',
        'Streams API',
        'Generics',
        'File Handling',
        'Serialization',
      ],
      required: [true, 'Please select a Java topic'],
    },
    progressPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    confidenceRating: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    notes: String,
    resources: [
      {
        title: String,
        link: String,
        type: {
          type: String,
          enum: ['Video', 'Article', 'Documentation', 'Practice'],
        },
      },
    ],
    practiceQuestions: {
      type: Number,
      default: 0,
    },
    questionsAnswered: {
      type: Number,
      default: 0,
    },
    lastStudiedDate: Date,
    nextRevisionDate: Date,
    isCompleted: {
      type: Boolean,
      default: false,
    },
    revisionCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

javaTopicSchema.index({ userId: 1, topicName: 1 });

module.exports = mongoose.model('JavaTopic', javaTopicSchema);
