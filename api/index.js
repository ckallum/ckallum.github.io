const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import database connection
const { connectToDatabase } = require('./db');

// Import models (we'll need to recreate these in a shared file)
const { Comment, ProtectedPage } = require('./models');

const app = express();

// Get CORS allowed origins from environment variable or use defaults
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',') 
  : ['https://ckallum.com', 'http://localhost:3000'];

console.log('CORS allowed origins:', allowedOrigins);

// Configure middleware
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Global challenges storage (in production, use Redis or similar)
global.challenges = global.challenges || new Map();

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({ 
    status: 'API Server Running on Vercel',
    timestamp: new Date().toISOString()
  });
});

// Get challenge for password verification 
app.get('/api/auth-challenge/:pageId', async (req, res) => {
  try {
    await connectToDatabase();
    
    const { pageId } = req.params;
    
    if (!pageId) {
      return res.status(400).json({ success: false, message: 'Missing pageId' });
    }
    
    // Find the protected page
    const protectedPage = await ProtectedPage.findOne({ pageId });
    
    if (!protectedPage) {
      return res.status(404).json({ success: false, message: 'Protected page not found' });
    }
    
    // Generate a challenge (random string that will be used just for this session)
    const challenge = crypto.randomBytes(32).toString('hex');
    
    // Set expiration for 5 minutes
    const expiration = Date.now() + (5 * 60 * 1000);
    
    // Store the page's salt with the challenge to use during verification
    global.challenges.set(pageId + '-' + challenge, { 
      expiration,
      salt: protectedPage.salt
    });
    
    // Return the challenge and salt to the client
    return res.json({
      success: true,
      challenge,
      salt: protectedPage.salt
    });
  } catch (error) {
    console.error('Challenge generation error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API route to verify password
app.post('/api/verify-password', async (req, res) => {
  try {
    await connectToDatabase();
    
    const { pageId, hash, challenge } = req.body;
    
    if (!pageId || !hash || !challenge) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    // Check if challenge exists and hasn't expired
    if (!global.challenges || !global.challenges.has(pageId + '-' + challenge)) {
      return res.status(401).json({ success: false, message: 'Invalid or expired challenge' });
    }
    
    const challengeData = global.challenges.get(pageId + '-' + challenge);
    
    // Check if challenge has expired
    if (challengeData.expiration < Date.now()) {
      global.challenges.delete(pageId + '-' + challenge);
      return res.status(401).json({ success: false, message: 'Challenge expired' });
    }
    
    // Find the protected page
    const protectedPage = await ProtectedPage.findOne({ pageId });
    
    if (!protectedPage) {
      return res.status(404).json({ success: false, message: 'Protected page not found' });
    }
    
    // Get the stored hash from the database
    const storedPasswordHash = protectedPage.passwordHash;
    
    // Calculate what we expect the client's hash to be
    const expectedHash = crypto
      .createHash('sha256')
      .update(challenge + storedPasswordHash)
      .digest('hex');
    
    // Use timing-safe comparison to prevent timing attacks
    const clientHash = Buffer.from(hash, 'hex');
    const serverHash = Buffer.from(expectedHash, 'hex');
    
    // Verify using constant-time comparison
    let hashesMatch = false;
    try {
      hashesMatch = crypto.timingSafeEqual(clientHash, serverHash);
    } catch (e) {
      console.error('Hash comparison error:', e);
    }
    
    if (hashesMatch) {
      // Password is correct - remove the used challenge
      global.challenges.delete(pageId + '-' + challenge);
      
      // Generate a JWT token with a short expiration time
      const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
      
      const accessToken = jwt.sign(
        { pageId, authorized: true }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );
      
      return res.json({ 
        success: true, 
        message: 'Authentication successful',
        accessToken 
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid authentication' });
    }
  } catch (error) {
    console.error('Password verification error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get messages for a page (since Socket.io won't work in serverless)
app.get('/api/messages/:pageId', async (req, res) => {
  try {
    await connectToDatabase();
    
    const { pageId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const messages = await Comment.find({ pageId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    
    res.json({ 
      success: true, 
      messages: messages.reverse() // Return in chronological order
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Post a new message (replaces Socket.io functionality)
app.post('/api/messages', async (req, res) => {
  try {
    await connectToDatabase();
    
    const { username, content, pageId, parentCommentId } = req.body;
    
    // Validate message data
    const validUsername = username && username.trim() ? username.trim() : 'Anonymous';
    const validContent = content && content.trim() ? content.trim() : '';
    
    if (!validContent) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }
    
    if (!pageId) {
      return res.status(400).json({ success: false, message: 'PageId is required' });
    }
    
    // Create new message
    const newComment = new Comment({
      username: validUsername,
      content: validContent,
      pageId,
      parentCommentId: parentCommentId || null,
      timestamp: new Date(),
      votes: 0
    });
    
    await newComment.save();
    
    res.json({ 
      success: true, 
      message: newComment 
    });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Export the Express app for Vercel
module.exports = app; 