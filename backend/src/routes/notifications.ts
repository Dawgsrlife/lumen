import express from 'express';
import { authenticateToken, hackathonAuth } from '../middleware/auth.js';
import Notification from '../models/Notification.js';

const HACKATHON_MODE = process.env.HACKATHON_MODE === 'true' || !process.env.MONGODB_URI;

const router = express.Router();

// Get all notifications for a user
router.get('/', HACKATHON_MODE ? hackathonAuth : authenticateToken, async (req, res) => {
  try {
    const clerkId = req.user?.clerkId;
    if (!clerkId) {
      return res.status(401).json({ 
        error: 'User not authenticated',
        code: 'AUTH_REQUIRED',
        details: {}
      });
    }

    const notifications = await Notification.find({ clerkId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: { notifications }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ 
      error: 'Failed to fetch notifications',
      code: 'INTERNAL_ERROR',
      details: {}
    });
  }
});

// Create a new notification
router.post('/', HACKATHON_MODE ? hackathonAuth : authenticateToken, async (req, res) => {
  try {
    const clerkId = req.user?.clerkId;
    if (!clerkId) {
      return res.status(401).json({ 
        error: 'User not authenticated',
        code: 'AUTH_REQUIRED',
        details: {}
      });
    }

    const { type, title, message, actionUrl } = req.body;

    if (!type || !title || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        code: 'VALIDATION_ERROR',
        details: { required: ['type', 'title', 'message'] }
      });
    }

    const notification = new Notification({
      userId: clerkId, // Keep for backward compatibility
      clerkId,
      type,
      title,
      message,
      actionUrl
    });

    await notification.save();

    res.status(201).json({
      success: true,
      data: { notification }
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ 
      error: 'Failed to create notification',
      code: 'INTERNAL_ERROR',
      details: {}
    });
  }
});

// Mark notification as read
router.patch('/:id/read', HACKATHON_MODE ? hackathonAuth : authenticateToken, async (req, res) => {
  try {
    const clerkId = req.user?.clerkId;
    const notificationId = req.params.id;

    if (!clerkId) {
      return res.status(401).json({ 
        error: 'User not authenticated',
        code: 'AUTH_REQUIRED',
        details: {}
      });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, clerkId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ 
        error: 'Notification not found',
        code: 'NOT_FOUND',
        details: {}
      });
    }

    res.json({
      success: true,
      data: { notification }
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ 
      error: 'Failed to mark notification as read',
      code: 'INTERNAL_ERROR',
      details: {}
    });
  }
});

// Delete a notification
router.delete('/:id', HACKATHON_MODE ? hackathonAuth : authenticateToken, async (req, res) => {
  try {
    const clerkId = req.user?.clerkId;
    const notificationId = req.params.id;

    if (!clerkId) {
      return res.status(401).json({ 
        error: 'User not authenticated',
        code: 'AUTH_REQUIRED',
        details: {}
      });
    }

    const notification = await Notification.findOneAndDelete({ _id: notificationId, clerkId });

    if (!notification) {
      return res.status(404).json({ 
        error: 'Notification not found',
        code: 'NOT_FOUND',
        details: {}
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ 
      error: 'Failed to delete notification',
      code: 'INTERNAL_ERROR',
      details: {}
    });
  }
});

// Mark all notifications as read
router.patch('/mark-all-read', HACKATHON_MODE ? hackathonAuth : authenticateToken, async (req, res) => {
  try {
    const clerkId = req.user?.clerkId;

    if (!clerkId) {
      return res.status(401).json({ 
        error: 'User not authenticated',
        code: 'AUTH_REQUIRED',
        details: {}
      });
    }

    await Notification.updateMany(
      { clerkId, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ 
      error: 'Failed to mark notifications as read',
      code: 'INTERNAL_ERROR',
      details: {}
    });
  }
});

export default router; 