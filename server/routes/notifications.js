const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const cron = require('node-cron');

// Mock notification service - in production, you'd integrate with services like:
// - Firebase Cloud Messaging (FCM) for push notifications
// - SendGrid/Mailgun for email notifications
// - Twilio for SMS notifications

class NotificationService {
  constructor() {
    this.notifications = new Map();
  }

  // Send push notification
  async sendPushNotification(userId, title, body, data = {}) {
    // In production, integrate with FCM
    console.log(`Push notification to ${userId}: ${title} - ${body}`);
    
    // Store notification for retrieval
    const notification = {
      id: Date.now().toString(),
      userId,
      title,
      body,
      data,
      timestamp: new Date(),
      read: false
    };
    
    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }
    this.notifications.get(userId).push(notification);
    
    return notification;
  }

  // Send email notification
  async sendEmailNotification(userId, subject, html, text) {
    // In production, integrate with email service
    console.log(`Email notification to ${userId}: ${subject}`);
    return { success: true };
  }

  // Get user notifications
  getUserNotifications(userId) {
    return this.notifications.get(userId) || [];
  }

  // Mark notification as read
  markAsRead(userId, notificationId) {
    const userNotifications = this.notifications.get(userId);
    if (userNotifications) {
      const notification = userNotifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    }
  }
}

const notificationService = new NotificationService();

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = notificationService.getUserNotifications(req.user.id);
    
    res.json({
      success: true,
      notifications: notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notifications',
      error: error.message
    });
  }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    notificationService.markAsRead(req.user.id, req.params.id);
    
    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
});

// Send test notification
router.post('/test', auth, async (req, res) => {
  try {
    const { type, title, body } = req.body;
    
    if (type === 'push') {
      await notificationService.sendPushNotification(
        req.user.id,
        title || 'Test Push Notification',
        body || 'This is a test push notification from VibeCheckr',
        { test: true }
      );
    } else if (type === 'email') {
      await notificationService.sendEmailNotification(
        req.user.id,
        title || 'Test Email Notification',
        `<h1>${body || 'This is a test email notification from VibeCheckr'}</h1>`,
        body || 'This is a test email notification from VibeCheckr'
      );
    }
    
    res.json({
      success: true,
      message: 'Test notification sent successfully'
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test notification',
      error: error.message
    });
  }
});

// Schedule survey reminder notifications
router.post('/schedule-reminder', auth, async (req, res) => {
  try {
    const { surveyId, reminderTime, message } = req.body;
    
    // In production, you'd use a proper job queue like Bull or Agenda
    // For now, we'll just log the reminder
    console.log(`Scheduled reminder for survey ${surveyId} at ${reminderTime}: ${message}`);
    
    res.json({
      success: true,
      message: 'Reminder scheduled successfully'
    });
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule reminder',
      error: error.message
    });
  }
});

// Get notification preferences
router.get('/preferences', auth, async (req, res) => {
  try {
    const preferences = req.user.preferences?.notifications || {
      email: true,
      push: true,
      surveyReminders: true
    };
    
    res.json({
      success: true,
      preferences: preferences
    });
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notification preferences',
      error: error.message
    });
  }
});

// Update notification preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { email, push, surveyReminders } = req.body;
    
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    user.preferences = {
      ...user.preferences,
      notifications: {
        email: email !== undefined ? email : user.preferences?.notifications?.email || true,
        push: push !== undefined ? push : user.preferences?.notifications?.push || true,
        surveyReminders: surveyReminders !== undefined ? surveyReminders : user.preferences?.notifications?.surveyReminders || true
      }
    };
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Notification preferences updated successfully',
      preferences: user.preferences.notifications
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification preferences',
      error: error.message
    });
  }
});

// Background job to send survey reminders
cron.schedule('0 9 * * *', async () => {
  try {
    console.log('Running daily survey reminder job...');
    
    const Survey = require('../models/Survey');
    const User = require('../models/User');
    const Response = require('../models/Response');
    
    // Find active surveys that need reminders
    const activeSurveys = await Survey.find({
      status: 'active',
      'settings.reminderFrequency': { $in: ['daily', 'weekly'] }
    });
    
    for (const survey of activeSurveys) {
      // Get users who haven't responded
      const responses = await Response.find({ survey: survey._id });
      const respondedUserIds = responses.map(r => r.respondent.toString());
      
      const users = await User.find({
        company: survey.company,
        isActive: true,
        _id: { $nin: respondedUserIds },
        'preferences.notifications.surveyReminders': true
      });
      
      // Send reminders
      for (const user of users) {
        await notificationService.sendPushNotification(
          user._id,
          'Survey Reminder',
          `Don't forget to complete the "${survey.title}" survey`,
          { surveyId: survey._id, type: 'survey_reminder' }
        );
      }
    }
    
    console.log('Survey reminder job completed');
  } catch (error) {
    console.error('Error in survey reminder job:', error);
  }
});

module.exports = router;
