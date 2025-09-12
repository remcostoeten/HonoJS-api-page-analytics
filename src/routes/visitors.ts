import { Router } from 'express';
import { setupVisitorService } from '../services/visitor-service';
import { generateVisitorFingerprint, extractFingerprintFromRequest } from '../utils/visitor-fingerprint';
import { initializeDatabase } from '../db';
import type { CreateVisitorData, CreateBlogViewData } from '../types/visitor';

// Initialize database and visitor service
initializeDatabase();
const visitorService = setupVisitorService();

const router = Router();

// Track a visitor
router.post('/track-visitor', async (req, res) => {
  try {
    const fingerprintData = extractFingerprintFromRequest(req);
    const visitorId = generateVisitorFingerprint(fingerprintData);
    
    const visitorData: CreateVisitorData = {
      visitorId,
      userAgent: fingerprintData.userAgent,
      ipAddress: fingerprintData.ipAddress,
    };

    const visitor = await visitorService.trackVisitor(visitorData);
    
    res.json({
      success: true,
      visitorId,
      visitor,
    });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track visitor',
    });
  }
});

// Track a blog view
router.post('/track-blog-view', async (req, res) => {
  try {
    const { blogSlug, blogTitle } = req.body;
    
    if (!blogSlug || !blogTitle) {
      return res.status(400).json({
        success: false,
        error: 'blogSlug and blogTitle are required',
      });
    }

    const fingerprintData = extractFingerprintFromRequest(req);
    const visitorId = generateVisitorFingerprint(fingerprintData);
    
    const blogViewData: CreateBlogViewData = {
      visitorId,
      blogSlug,
      blogTitle,
    };

    // Track visitor first
    const visitorData: CreateVisitorData = {
      visitorId,
      userAgent: fingerprintData.userAgent,
      ipAddress: fingerprintData.ipAddress,
    };

    const visitor = await visitorService.trackVisitor(visitorData);
    const blogView = await visitorService.trackBlogView(blogViewData);
    
    res.json({
      success: true,
      visitorId,
      visitor,
      blogView,
    });
  } catch (error) {
    console.error('Error tracking blog view:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track blog view',
    });
  }
});

// Get visitor stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await visitorService.getVisitorStats();
    
    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Error getting visitor stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get visitor stats',
    });
  }
});

// Get blog view count
router.get('/blog/:slug/views', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const viewCount = await visitorService.getBlogViewCount(slug);
    
    res.json({
      success: true,
      blogSlug: slug,
      viewCount,
    });
  } catch (error) {
    console.error('Error getting blog view count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get blog view count',
    });
  }
});

// Get visitor by ID
router.get('/visitor/:visitorId', async (req, res) => {
  try {
    const { visitorId } = req.params;
    
    const visitor = await visitorService.getVisitor(visitorId);
    
    res.json({
      success: true,
      visitorId,
      visitor,
    });
  } catch (error) {
    console.error('Error getting visitor:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get visitor',
    });
  }
});

export { router as visitorRouter };
