const mongoose = require('mongoose');

const reviewTemplateSchema = new mongoose.Schema({
  // Template metadata
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Template type
  type: {
    type: String,
    enum: ['peer_review', 'manager_review', 'self_review', '360_review'],
    required: true
  },
  
  // Questions structure
  questions: [{
    questionId: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['collaboration', 'communication', 'execution', 'ownership', 'leadership', 'innovation', 'culture'],
      required: true
    },
    responseType: {
      type: String,
      enum: ['rating', 'text', 'voice', 'multiple_choice'],
      required: true
    },
    required: {
      type: Boolean,
      default: true
    },
    options: [String], // for multiple choice
    scale: {
      min: {
        type: Number,
        default: 1
      },
      max: {
        type: Number,
        default: 5
      },
      labels: {
        min: String,
        max: String
      }
    },
    placeholder: String,
    helpText: String
  }],
  
  // Company values integration
  valuesIntegration: [{
    value: String,
    questions: [String] // questionIds that relate to this value
  }],
  
  // Gamification settings
  gamification: {
    pointsPerQuestion: {
      type: Number,
      default: 10
    },
    bonusPoints: {
      type: Number,
      default: 50
    },
    timeLimit: Number, // in minutes
    badges: [{
      name: String,
      description: String,
      criteria: String
    }]
  },
  
  // Template settings
  estimatedTime: {
    type: Number,
    required: true // in minutes
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Company association
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  // Usage tracking
  usageCount: {
    type: Number,
    default: 0
  },
  averageCompletionTime: Number,
  averageRating: Number
}, {
  timestamps: true
});

// Indexes
reviewTemplateSchema.index({ company: 1, isActive: 1 });
reviewTemplateSchema.index({ type: 1 });

module.exports = mongoose.model('ReviewTemplate', reviewTemplateSchema);
