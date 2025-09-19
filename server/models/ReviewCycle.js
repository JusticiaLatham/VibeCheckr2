const mongoose = require('mongoose');

const reviewCycleSchema = new mongoose.Schema({
  // Cycle metadata
  name: {
    type: String,
    required: true
  },
  description: String,
  
  // Cycle timing
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  
  // Cycle settings
  frequency: {
    type: String,
    enum: ['weekly', 'bi-weekly', 'monthly', 'quarterly'],
    required: true
  },
  
  // Assignment settings
  assignmentSettings: {
    reviewsPerManager: {
      type: Number,
      default: 2
    },
    assignmentMethod: {
      type: String,
      enum: ['random', 'rotation', 'manual', 'ai_optimized'],
      default: 'rotation'
    },
    includeSelfReview: {
      type: Boolean,
      default: false
    },
    includePeerReview: {
      type: Boolean,
      default: false
    }
  },
  
  // Templates to use
  templates: [{
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReviewTemplate',
      required: true
    },
    reviewerType: {
      type: String,
      enum: ['manager', 'peer', 'self'],
      required: true
    },
    weight: {
      type: Number,
      default: 1
    }
  }],
  
  // Cycle status
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  
  // Progress tracking
  progress: {
    totalReviews: {
      type: Number,
      default: 0
    },
    completedReviews: {
      type: Number,
      default: 0
    },
    overdueReviews: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    }
  },
  
  // Notifications
  notifications: {
    enabled: {
      type: Boolean,
      default: true
    },
    reminderDays: [Number], // days before due date to send reminders
    slackChannel: String,
    emailReminders: {
      type: Boolean,
      default: true
    }
  },
  
  // Company association
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  // AI insights
  aiInsights: {
    averageRating: Number,
    topStrengths: [String],
    commonImprovementAreas: [String],
    valuesAlignmentScore: Number,
    engagementScore: Number
  },
  
  // Cycle results
  results: {
    totalPointsAwarded: {
      type: Number,
      default: 0
    },
    badgesAwarded: [String],
    averageCompletionTime: Number,
    feedbackQuality: Number
  }
}, {
  timestamps: true
});

// Indexes
reviewCycleSchema.index({ company: 1, status: 1 });
reviewCycleSchema.index({ startDate: 1, endDate: 1 });
reviewCycleSchema.index({ dueDate: 1 });

// Virtual for completion percentage
reviewCycleSchema.virtual('completionPercentage').get(function() {
  if (this.progress.totalReviews === 0) return 0;
  return Math.round((this.progress.completedReviews / this.progress.totalReviews) * 100);
});

module.exports = mongoose.model('ReviewCycle', reviewCycleSchema);
