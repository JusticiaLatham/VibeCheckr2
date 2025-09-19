const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const calendarService = require('../services/calendarService');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/slidedecks/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.pptx', '.ppt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and PowerPoint files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Get Google Calendar authorization URL
router.get('/auth-url', auth, (req, res) => {
  try {
    const authUrl = calendarService.getAuthUrl();
    res.json({
      success: true,
      authUrl: authUrl
    });
  } catch (error) {
    console.error('Error getting auth URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get authorization URL',
      error: error.message
    });
  }
});

// Handle OAuth callback and sync calendar
router.post('/sync', auth, async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required'
      });
    }

    // Get tokens
    const tokens = await calendarService.getTokens(code);
    
    // Update company with calendar integration
    const Company = require('../models/Company');
    await Company.findByIdAndUpdate(req.user.company, {
      'calendarIntegration.provider': 'google',
      'calendarIntegration.accessToken': tokens.access_token,
      'calendarIntegration.refreshToken': tokens.refresh_token,
      'calendarIntegration.enabled': true,
      'calendarIntegration.lastSync': new Date()
    });

    // Sync calendar events
    const events = await calendarService.syncCalendarEvents(req.user.company, tokens);
    
    res.json({
      success: true,
      message: 'Calendar synced successfully',
      eventsCount: events.length,
      events: events.slice(0, 10) // Return first 10 events
    });
  } catch (error) {
    console.error('Error syncing calendar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync calendar',
      error: error.message
    });
  }
});

// Get high-interest events
router.get('/high-interest-events', auth, async (req, res) => {
  try {
    const events = await calendarService.getHighInterestEvents(req.user.company);
    
    res.json({
      success: true,
      events: events
    });
  } catch (error) {
    console.error('Error getting high-interest events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get high-interest events',
      error: error.message
    });
  }
});

// Get upcoming all-hands meetings
router.get('/all-hands', auth, async (req, res) => {
  try {
    const events = await calendarService.getUpcomingAllHands(req.user.company);
    
    res.json({
      success: true,
      events: events
    });
  } catch (error) {
    console.error('Error getting all-hands meetings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get all-hands meetings',
      error: error.message
    });
  }
});

// Upload slide deck for all-hands meeting
router.post('/upload-slidedeck', auth, upload.single('slideDeck'), async (req, res) => {
  try {
    const { eventId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Slide deck file is required'
      });
    }

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required'
      });
    }

    // For now, we'll simulate slide content extraction
    // In production, you'd use a service like Google Drive API or extract text from PDF/PPT
    const slideContent = `All-hands meeting slide deck content extracted from ${req.file.originalname}`;
    
    // Get company context
    const Company = require('../models/Company');
    const company = await Company.findById(req.user.company);
    
    const companyContext = {
      industry: company.industry,
      size: company.size,
      coreValues: company.coreValues
    };

    // Process slide deck and generate questions
    const aiQuestions = await calendarService.processSlideDeck(
      eventId, 
      slideContent, 
      companyContext
    );

    res.json({
      success: true,
      message: 'Slide deck processed successfully',
      questions: aiQuestions.questions,
      keyThemes: aiQuestions.keyThemes,
      executiveInsights: aiQuestions.executiveInsights
    });
  } catch (error) {
    console.error('Error uploading slide deck:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process slide deck',
      error: error.message
    });
  }
});

// Get calendar integration status
router.get('/status', auth, async (req, res) => {
  try {
    const Company = require('../models/Company');
    const company = await Company.findById(req.user.company);
    
    res.json({
      success: true,
      integration: {
        enabled: company.calendarIntegration?.enabled || false,
        provider: company.calendarIntegration?.provider || null,
        lastSync: company.calendarIntegration?.lastSync || null
      }
    });
  } catch (error) {
    console.error('Error getting calendar status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get calendar status',
      error: error.message
    });
  }
});

// Disconnect calendar integration
router.delete('/disconnect', auth, async (req, res) => {
  try {
    const Company = require('../models/Company');
    await Company.findByIdAndUpdate(req.user.company, {
      'calendarIntegration.enabled': false,
      'calendarIntegration.accessToken': null,
      'calendarIntegration.refreshToken': null
    });

    res.json({
      success: true,
      message: 'Calendar integration disconnected'
    });
  } catch (error) {
    console.error('Error disconnecting calendar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect calendar',
      error: error.message
    });
  }
});

module.exports = router;
