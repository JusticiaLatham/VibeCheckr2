const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Survey = require('../models/Survey');
const Response = require('../models/Response');
const aiService = require('../services/aiService');

// Get survey analytics
router.get('/survey/:id', auth, async (req, res) => {
  try {
    const survey = await Survey.findOne({
      _id: req.params.id,
      company: req.user.company
    });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    const responses = await Response.find({ survey: survey._id });
    
    if (responses.length === 0) {
      return res.json({
        success: true,
        analytics: {
          totalResponses: 0,
          completionRate: 0,
          averageCompletionTime: 0,
          questionAnalytics: [],
          sentimentAnalysis: null,
          recommendations: []
        }
      });
    }

    // Calculate basic analytics
    const totalResponses = responses.length;
    const averageCompletionTime = responses.reduce((sum, r) => sum + r.completionTime, 0) / totalResponses;
    
    // Analyze each question
    const questionAnalytics = survey.questions.map(question => {
      const questionResponses = responses.map(r => 
        r.answers.find(a => a.questionId.toString() === question._id.toString())
      ).filter(a => a);

      const analytics = {
        questionId: question._id,
        questionText: question.text,
        questionType: question.type,
        responseCount: questionResponses.length,
        analytics: {}
      };

      if (question.type === 'rating' || question.type === 'scale') {
        const ratings = questionResponses.map(r => parseInt(r.answer)).filter(r => !isNaN(r));
        if (ratings.length > 0) {
          analytics.analytics = {
            average: ratings.reduce((sum, r) => sum + r, 0) / ratings.length,
            min: Math.min(...ratings),
            max: Math.max(...ratings),
            distribution: ratings.reduce((acc, r) => {
              acc[r] = (acc[r] || 0) + 1;
              return acc;
            }, {})
          };
        }
      } else if (question.type === 'multiple_choice') {
        const choices = questionResponses.map(r => r.answer);
        const choiceCounts = choices.reduce((acc, choice) => {
          acc[choice] = (acc[choice] || 0) + 1;
          return acc;
        }, {});
        
        analytics.analytics = {
          choices: choiceCounts,
          totalResponses: choices.length
        };
      } else if (question.type === 'yes_no') {
        const yesCount = questionResponses.filter(r => r.answer === 'yes' || r.answer === true).length;
        const noCount = questionResponses.filter(r => r.answer === 'no' || r.answer === false).length;
        
        analytics.analytics = {
          yes: yesCount,
          no: noCount,
          yesPercentage: totalResponses > 0 ? (yesCount / totalResponses * 100).toFixed(1) : 0
        };
      }

      return analytics;
    });

    // AI-powered sentiment analysis
    let sentimentAnalysis = null;
    try {
      const textResponses = responses.map(r => 
        r.answers.filter(a => {
          const question = survey.questions.find(q => q._id.toString() === a.questionId.toString());
          return question && question.type === 'text';
        }).map(a => a.answer)
      ).flat();

      if (textResponses.length > 0) {
        sentimentAnalysis = await aiService.analyzeSurveyResponses(survey._id, responses);
      }
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    }

    res.json({
      success: true,
      analytics: {
        totalResponses,
        completionRate: survey.completionRate,
        averageCompletionTime: Math.round(averageCompletionTime),
        questionAnalytics,
        sentimentAnalysis,
        recommendations: sentimentAnalysis?.executiveRecommendations || []
      }
    });
  } catch (error) {
    console.error('Error getting survey analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get survey analytics',
      error: error.message
    });
  }
});

// Get company-wide analytics
router.get('/company', auth, async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    
    let startDate;
    switch (timeframe) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get surveys and responses in timeframe
    const surveys = await Survey.find({
      company: req.user.company,
      createdAt: { $gte: startDate }
    });

    const surveyIds = surveys.map(s => s._id);
    const responses = await Response.find({
      survey: { $in: surveyIds }
    });

    // Calculate engagement metrics
    const totalSurveys = surveys.length;
    const totalResponses = responses.length;
    const averageResponseRate = totalSurveys > 0 ? (totalResponses / totalSurveys) : 0;

    // Response trends over time
    const responseTrends = responses.reduce((acc, response) => {
      const date = response.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Survey type distribution
    const surveyTypeDistribution = surveys.reduce((acc, survey) => {
      acc[survey.type] = (acc[survey.type] || 0) + 1;
      return acc;
    }, {});

    // Department-wise analytics (if available)
    const User = require('../models/User');
    const users = await User.find({ 
      company: req.user.company, 
      isActive: true 
    }).select('department');

    const departmentStats = users.reduce((acc, user) => {
      const dept = user.department || 'Unknown';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    // AI insights for the period
    let aiInsights = null;
    try {
      if (responses.length > 0) {
        aiInsights = await aiService.analyzeSurveyResponses('company-wide', responses);
      }
    } catch (error) {
      console.error('Error getting AI insights:', error);
    }

    res.json({
      success: true,
      analytics: {
        timeframe,
        engagement: {
          totalSurveys,
          totalResponses,
          averageResponseRate: Math.round(averageResponseRate * 100) / 100,
          responseTrends
        },
        distribution: {
          surveyTypes: surveyTypeDistribution,
          departments: departmentStats
        },
        aiInsights: aiInsights ? {
          overallSentiment: aiInsights.overallSentiment,
          keyThemes: aiInsights.keyThemes,
          riskAreas: aiInsights.riskAreas,
          recommendations: aiInsights.executiveRecommendations
        } : null
      }
    });
  } catch (error) {
    console.error('Error getting company analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get company analytics',
      error: error.message
    });
  }
});

// Get executive dashboard data
router.get('/executive', auth, async (req, res) => {
  try {
    // Only allow admin and hr_manager roles
    if (!['admin', 'hr_manager'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Executive dashboard requires admin or HR manager role.'
      });
    }

    // Get comprehensive company data
    const Company = require('../models/Company');
    const company = await Company.findById(req.user.company);
    
    // Get all surveys and responses
    const surveys = await Survey.find({ company: req.user.company });
    const responses = await Response.find({ company: req.user.company });
    
    // Get user statistics
    const User = require('../models/User');
    const users = await User.find({ company: req.user.company, isActive: true });
    
    // Calculate key metrics
    const totalEmployees = users.length;
    const totalSurveys = surveys.length;
    const totalResponses = responses.length;
    const responseRate = totalEmployees > 0 ? (totalResponses / totalEmployees) : 0;

    // Get recent high-priority insights
    const recentSurveys = surveys
      .filter(s => s.status === 'closed')
      .sort((a, b) => new Date(b.endDate || b.createdAt) - new Date(a.endDate || a.createdAt))
      .slice(0, 5);

    // AI-powered executive insights
    let executiveInsights = null;
    try {
      if (responses.length > 0) {
        const recentResponses = responses.filter(r => 
          recentSurveys.some(s => s._id.toString() === r.survey.toString())
        );
        
        if (recentResponses.length > 0) {
          executiveInsights = await aiService.analyzeSurveyResponses('executive', recentResponses);
        }
      }
    } catch (error) {
      console.error('Error getting executive insights:', error);
    }

    // Risk indicators
    const riskIndicators = [];
    if (responseRate < 0.3) {
      riskIndicators.push({
        type: 'low_engagement',
        severity: 'high',
        message: 'Low survey response rate indicates potential engagement issues',
        recommendation: 'Consider improving survey communication and incentives'
      });
    }

    if (surveys.filter(s => s.status === 'active').length === 0) {
      riskIndicators.push({
        type: 'no_active_surveys',
        severity: 'medium',
        message: 'No active surveys currently running',
        recommendation: 'Launch new surveys to maintain pulse on team sentiment'
      });
    }

    res.json({
      success: true,
      executiveDashboard: {
        overview: {
          totalEmployees,
          totalSurveys,
          totalResponses,
          responseRate: Math.round(responseRate * 100) / 100,
          activeSurveys: surveys.filter(s => s.status === 'active').length
        },
        recentActivity: recentSurveys.map(survey => ({
          id: survey._id,
          title: survey.title,
          type: survey.type,
          responseCount: survey.responseCount,
          completionRate: survey.completionRate,
          endDate: survey.endDate || survey.createdAt
        })),
        aiInsights: executiveInsights,
        riskIndicators,
        companyInsights: company.aiInsights
      }
    });
  } catch (error) {
    console.error('Error getting executive dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get executive dashboard',
      error: error.message
    });
  }
});

module.exports = router;
