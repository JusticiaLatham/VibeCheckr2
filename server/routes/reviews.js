const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const ReviewTemplate = require('../models/ReviewTemplate');
const ReviewCycle = require('../models/ReviewCycle');
const User = require('../models/User');

// Development routes - no auth required
router.get('/dev', async (req, res) => {
  try {
    // Mock data for development
    const mockReviews = [
      {
        _id: 'review-1',
        reviewId: 'review-1',
        reviewer: {
          _id: 'user-1',
          name: 'Sarah Johnson',
          email: 'sarah@vibecheckr.com',
          avatar: null
        },
        reviewee: {
          _id: 'user-2',
          name: 'Alex Chen',
          email: 'alex@vibecheckr.com',
          avatar: null
        },
        template: {
          _id: 'template-1',
          name: 'Weekly Peer Review',
          type: 'peer_review',
          estimatedTime: 5,
          gamification: {
            pointsPerQuestion: 10,
            bonusPoints: 50
          }
        },
        reviewCycle: {
          _id: 'cycle-1',
          name: 'Q4 2024 Weekly Reviews',
          status: 'active'
        },
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        assignedAt: new Date(),
        pointsEarned: 0,
        badgesEarned: [],
        company: 'company-1'
      },
      {
        _id: 'review-2',
        reviewId: 'review-2',
        reviewer: {
          _id: 'user-1',
          name: 'Sarah Johnson',
          email: 'sarah@vibecheckr.com',
          avatar: null
        },
        reviewee: {
          _id: 'user-3',
          name: 'Maria Rodriguez',
          email: 'maria@vibecheckr.com',
          avatar: null
        },
        template: {
          _id: 'template-1',
          name: 'Weekly Peer Review',
          type: 'peer_review',
          estimatedTime: 5,
          gamification: {
            pointsPerQuestion: 10,
            bonusPoints: 50
          }
        },
        reviewCycle: {
          _id: 'cycle-1',
          name: 'Q4 2024 Weekly Reviews',
          status: 'active'
        },
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        assignedAt: new Date(),
        pointsEarned: 0,
        badgesEarned: [],
        company: 'company-1'
      },
      {
        _id: 'review-3',
        reviewId: 'review-3',
        reviewer: {
          _id: 'user-1',
          name: 'Sarah Johnson',
          email: 'sarah@vibecheckr.com',
          avatar: null
        },
        reviewee: {
          _id: 'user-2',
          name: 'Alex Chen',
          email: 'alex@vibecheckr.com',
          avatar: null
        },
        template: {
          _id: 'template-1',
          name: 'Weekly Peer Review',
          type: 'peer_review',
          estimatedTime: 5,
          gamification: {
            pointsPerQuestion: 10,
            bonusPoints: 50
          }
        },
        reviewCycle: {
          _id: 'cycle-1',
          name: 'Q4 2024 Weekly Reviews',
          status: 'active'
        },
        status: 'completed',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        assignedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        overallRating: 4.5,
        pointsEarned: 100,
        badgesEarned: ['Quick Reviewer', 'Thoughtful Feedback'],
        completionTime: 4,
        company: 'company-1'
      }
    ];

    res.json({
      success: true,
      reviews: mockReviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

// Development route for cycles
router.get('/dev/cycles', async (req, res) => {
  try {
    const mockCycles = [
      {
        _id: 'cycle-1',
        name: 'Q4 2024 Weekly Reviews',
        description: 'Weekly peer reviews for Q4 2024',
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-12-31'),
        dueDate: new Date('2024-12-31'),
        frequency: 'weekly',
        status: 'active',
        progress: {
          totalReviews: 3,
          completedReviews: 1,
          overdueReviews: 0,
          completionRate: 33
        },
        company: 'company-1'
      }
    ];
    
    res.json({
      success: true,
      cycles: mockCycles
    });
  } catch (error) {
    console.error('Error fetching cycles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cycles',
      error: error.message
    });
  }
});

// Development route for analytics
router.get('/dev/analytics/overview', async (req, res) => {
  try {
    const mockAnalytics = {
      totalReviews: 3,
      completedReviews: 1,
      pendingReviews: 2,
      overdueReviews: 0,
      completionRate: 33,
      averageRating: 4.5,
      categoryStats: [
        { _id: 'collaboration', avgRating: 4.5, count: 1 },
        { _id: 'communication', avgRating: 4.0, count: 1 },
        { _id: 'execution', avgRating: 5.0, count: 1 },
        { _id: 'ownership', avgRating: 4.0, count: 1 }
      ]
    };
    
    res.json({
      success: true,
      analytics: mockAnalytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
});

// Get all reviews for a user (as reviewer or reviewee)
router.get('/', auth, async (req, res) => {
  try {
    const { status, type, cycle } = req.query;
    
    // Mock data for development
    const mockReviews = [
      {
        _id: 'review-1',
        reviewId: 'review-1',
        reviewer: {
          _id: 'user-1',
          name: 'Sarah Johnson',
          email: 'sarah@vibecheckr.com',
          avatar: null
        },
        reviewee: {
          _id: 'user-2',
          name: 'Alex Chen',
          email: 'alex@vibecheckr.com',
          avatar: null
        },
        template: {
          _id: 'template-1',
          name: 'Weekly Peer Review',
          type: 'peer_review',
          estimatedTime: 5
        },
        reviewCycle: {
          _id: 'cycle-1',
          name: 'Q4 2024 Weekly Reviews',
          status: 'active'
        },
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        assignedAt: new Date(),
        pointsEarned: 0,
        badgesEarned: [],
        company: 'company-1'
      },
      {
        _id: 'review-2',
        reviewId: 'review-2',
        reviewer: {
          _id: 'user-1',
          name: 'Sarah Johnson',
          email: 'sarah@vibecheckr.com',
          avatar: null
        },
        reviewee: {
          _id: 'user-3',
          name: 'Maria Rodriguez',
          email: 'maria@vibecheckr.com',
          avatar: null
        },
        template: {
          _id: 'template-1',
          name: 'Weekly Peer Review',
          type: 'peer_review',
          estimatedTime: 5
        },
        reviewCycle: {
          _id: 'cycle-1',
          name: 'Q4 2024 Weekly Reviews',
          status: 'active'
        },
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        assignedAt: new Date(),
        pointsEarned: 0,
        badgesEarned: [],
        company: 'company-1'
      },
      {
        _id: 'review-3',
        reviewId: 'review-3',
        reviewer: {
          _id: 'user-1',
          name: 'Sarah Johnson',
          email: 'sarah@vibecheckr.com',
          avatar: null
        },
        reviewee: {
          _id: 'user-2',
          name: 'Alex Chen',
          email: 'alex@vibecheckr.com',
          avatar: null
        },
        template: {
          _id: 'template-1',
          name: 'Weekly Peer Review',
          type: 'peer_review',
          estimatedTime: 5
        },
        reviewCycle: {
          _id: 'cycle-1',
          name: 'Q4 2024 Weekly Reviews',
          status: 'active'
        },
        status: 'completed',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        assignedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        overallRating: 4.5,
        pointsEarned: 100,
        badgesEarned: ['Quick Reviewer', 'Thoughtful Feedback'],
        completionTime: 4,
        company: 'company-1'
      }
    ];

    // Filter by status
    let filteredReviews = mockReviews;
    if (status) {
      const statusArray = status.split(',');
      filteredReviews = mockReviews.filter(review => statusArray.includes(review.status));
    }

    res.json({
      success: true,
      reviews: filteredReviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

// Get a specific review
router.get('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      company: req.user.company
    })
      .populate('reviewer', 'name email avatar')
      .populate('reviewee', 'name email avatar')
      .populate('template', 'name type questions')
      .populate('reviewCycle', 'name status');
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    res.json({
      success: true,
      review
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review',
      error: error.message
    });
  }
});

// Start a review
router.post('/:id/start', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      reviewer: req.user.id,
      company: req.user.company
    });
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    if (review.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Review has already been started or completed'
      });
    }
    
    review.status = 'in_progress';
    review.startedAt = new Date();
    await review.save();
    
    res.json({
      success: true,
      review
    });
  } catch (error) {
    console.error('Error starting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start review',
      error: error.message
    });
  }
});

// Submit review response
router.post('/:id/responses', auth, async (req, res) => {
  try {
    const { questionId, response } = req.body;
    
    const review = await Review.findOne({
      _id: req.params.id,
      reviewer: req.user.id,
      company: req.user.company
    });
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    if (review.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Review has already been completed'
      });
    }
    
    // Update or add response
    const existingResponseIndex = review.responses.findIndex(r => r.questionId === questionId);
    
    if (existingResponseIndex >= 0) {
      review.responses[existingResponseIndex] = {
        ...review.responses[existingResponseIndex],
        ...response
      };
    } else {
      review.responses.push({
        questionId,
        ...response
      });
    }
    
    await review.save();
    
    res.json({
      success: true,
      review
    });
  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit response',
      error: error.message
    });
  }
});

// Complete a review
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const { overallRating, strengths, areasForImprovement, goals, valuesAlignment } = req.body;
    
    const review = await Review.findOne({
      _id: req.params.id,
      reviewer: req.user.id,
      company: req.user.company
    });
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    if (review.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Review has already been completed'
      });
    }
    
    // Update review with completion data
    review.overallRating = overallRating;
    review.strengths = strengths || [];
    review.areasForImprovement = areasForImprovement || [];
    review.goals = goals || [];
    review.valuesAlignment = valuesAlignment || [];
    review.status = 'completed';
    review.completedAt = new Date();
    
    // Calculate completion time
    if (review.startedAt) {
      review.completionTime = Math.round((review.completedAt - review.startedAt) / (1000 * 60)); // minutes
    }
    
    // Calculate points earned (basic gamification)
    const template = await ReviewTemplate.findById(review.template);
    if (template && template.gamification) {
      const basePoints = review.responses.length * (template.gamification.pointsPerQuestion || 10);
      const bonusPoints = template.gamification.bonusPoints || 50;
      review.pointsEarned = basePoints + bonusPoints;
    }
    
    await review.save();
    
    // Update review cycle progress
    await ReviewCycle.findByIdAndUpdate(review.reviewCycle, {
      $inc: { 'progress.completedReviews': 1 }
    });
    
    res.json({
      success: true,
      review,
      pointsEarned: review.pointsEarned
    });
  } catch (error) {
    console.error('Error completing review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete review',
      error: error.message
    });
  }
});

// Get review templates
router.get('/templates', auth, async (req, res) => {
  try {
    const templates = await ReviewTemplate.find({
      company: req.user.company,
      isActive: true
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      templates
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates',
      error: error.message
    });
  }
});

// Get review cycles
router.get('/cycles', auth, async (req, res) => {
  try {
    // Mock data for development
    const mockCycles = [
      {
        _id: 'cycle-1',
        name: 'Q4 2024 Weekly Reviews',
        description: 'Weekly peer reviews for Q4 2024',
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-12-31'),
        dueDate: new Date('2024-12-31'),
        frequency: 'weekly',
        status: 'active',
        progress: {
          totalReviews: 3,
          completedReviews: 1,
          overdueReviews: 0,
          completionRate: 33
        },
        company: 'company-1'
      }
    ];
    
    res.json({
      success: true,
      cycles: mockCycles
    });
  } catch (error) {
    console.error('Error fetching cycles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cycles',
      error: error.message
    });
  }
});

// Create a new review cycle
router.post('/cycles', auth, async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      dueDate,
      frequency,
      assignmentSettings,
      templates,
      notifications
    } = req.body;
    
    const cycle = new ReviewCycle({
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      dueDate: new Date(dueDate),
      frequency,
      assignmentSettings: assignmentSettings || {
        reviewsPerManager: 2,
        assignmentMethod: 'rotation',
        includeSelfReview: false,
        includePeerReview: false
      },
      templates: templates || [],
      notifications: notifications || {
        enabled: true,
        reminderDays: [3, 1],
        emailReminders: true
      },
      company: req.user.company
    });
    
    await cycle.save();
    
    res.json({
      success: true,
      cycle
    });
  } catch (error) {
    console.error('Error creating cycle:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create cycle',
      error: error.message
    });
  }
});

// Get review analytics
router.get('/analytics/overview', auth, async (req, res) => {
  try {
    // Mock analytics data for development
    const mockAnalytics = {
      totalReviews: 3,
      completedReviews: 1,
      pendingReviews: 2,
      overdueReviews: 0,
      completionRate: 33,
      averageRating: 4.5,
      categoryStats: [
        { _id: 'collaboration', avgRating: 4.5, count: 1 },
        { _id: 'communication', avgRating: 4.0, count: 1 },
        { _id: 'execution', avgRating: 5.0, count: 1 },
        { _id: 'ownership', avgRating: 4.0, count: 1 }
      ]
    };
    
    res.json({
      success: true,
      analytics: mockAnalytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
});

module.exports = router;
