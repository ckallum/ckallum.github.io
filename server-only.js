/**
 * API-only server for Heroku deployment
 * This is a simplified version focused only on the API endpoints, not serving static files
 */
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Enhanced Comment Schema based on EA Forum approach
const commentSchema = new mongoose.Schema({
  // Basic fields
  username: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  votes: { type: Number, default: 0 },
  pageId: { type: String, required: true, index: true },
  
  // Parent-child relationship fields
  parentCommentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    default: null,
    index: true 
  },
  
  // If this is a reply to a reply, store the top-level parent comment ID
  // This helps with efficiently finding all comments in a thread
  topLevelCommentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    default: null,
    index: true 
  },
  
  // Counter fields for efficient querying
  descendentCount: { type: Number, default: 0 },
  directChildrenCount: { type: Number, default: 0 },
  
  // Timestamp of the last activity in this comment's thread
  // Helps with sorting by "active discussions"
  lastSubthreadActivity: { type: Date, default: Date.now }
});

// Create indexes for efficient retrieval
commentSchema.index({ pageId: 1, parentCommentId: 1 });
commentSchema.index({ pageId: 1, topLevelCommentId: 1 });
commentSchema.index({ pageId: 1, lastSubthreadActivity: -1 });

const protectedPageSchema = new mongoose.Schema({
  pageId: String,
  pageName: String,
  passwordHash: String,
  salt: String
});

// Create models
const Comment = mongoose.model('Comment', commentSchema);
const ProtectedPage = mongoose.model('ProtectedPage', protectedPageSchema);

// Initialize app
const app = express();
const server = http.createServer(app);

// Get CORS allowed origins from environment variable or use defaults
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',') 
  : ['https://ckallum.com', 'http://localhost:3000'];

console.log('CORS allowed origins:', allowedOrigins);

// Configure middleware with specific CORS settings
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Add simple status endpoint
app.get('/', (req, res) => {
  res.json({ status: 'API Server Running' });
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ckallum-website';
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Attempt to migrate existing data if needed
    migrateExistingComments();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Helper function to migrate existing messages to the new Comment model
async function migrateExistingComments() {
  try {
    // Check if we have the legacy Message model
    if (mongoose.modelNames().includes('Message')) {
      const Message = mongoose.model('Message');
      const existingMessages = await Message.find({});
      
      if (existingMessages.length > 0) {
        console.log(`Found ${existingMessages.length} legacy messages to migrate`);
        
        // Convert old messages to new comments
        for (const message of existingMessages) {
          // Check if this message has already been migrated
          const existingComment = await Comment.findOne({
            username: message.username,
            content: message.content,
            timestamp: message.timestamp
          });
          
          if (!existingComment) {
            // Create a new comment from the message
            await Comment.create({
              username: message.username || 'Anonymous',
              content: message.content,
              pageId: message.pageId,
              timestamp: message.timestamp,
              votes: 0,
              parentCommentId: null,
              topLevelCommentId: null,
              descendentCount: 0,
              directChildrenCount: 0,
              lastSubthreadActivity: message.timestamp
            });
          }
        }
        
        console.log('Migration of legacy messages complete');
      }
    }
  } catch (error) {
    console.error('Error migrating existing messages:', error);
  }
}

// Setup Socket.io for chat with proper CORS settings
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Create a comment with proper parent-child relationships
async function createComment(commentData) {
  try {
    // For a top-level comment, just save it
    if (!commentData.parentCommentId) {
      return await Comment.create(commentData);
    }
    
    // For a reply, we need to:
    // 1. Find the parent comment
    const parentComment = await Comment.findById(commentData.parentCommentId);
    if (!parentComment) {
      throw new Error("Parent comment not found");
    }
    
    // 2. Set the topLevelCommentId
    // If replying to a top-level comment, use its ID
    // If replying to a reply, use the same topLevelCommentId as the parent
    commentData.topLevelCommentId = parentComment.topLevelCommentId || parentComment._id;
    
    // 3. Create the comment
    const newComment = await Comment.create(commentData);
    
    // 4. Update parent comment's directChildrenCount
    await Comment.findByIdAndUpdate(
      commentData.parentCommentId,
      { $inc: { directChildrenCount: 1 } }
    );
    
    // 5. Update the descendentCount and lastSubthreadActivity for all ancestor comments
    let currentParentId = commentData.parentCommentId;
    const now = new Date();
    
    while (currentParentId) {
      await Comment.findByIdAndUpdate(
        currentParentId,
        { 
          $inc: { descendentCount: 1 },
          $set: { lastSubthreadActivity: now }
        }
      );
      
      // Get the next parent up in the chain
      const currentParent = await Comment.findById(currentParentId);
      currentParentId = currentParent?.parentCommentId || null;
    }
    
    return newComment;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

// Helper function to send existing comments
async function sendExistingComments(socket, pageId) {
  try {
    // Get all comments for the page
    const comments = await Comment.find({ pageId }).sort({ timestamp: 1 });
    
    // Send them to the client
    socket.emit('init-messages', comments);
  } catch (error) {
    socket.emit('comment-error', { 
      message: 'Failed to load comments',
      error: error.message 
    });
  }
}

// Handle socket connections
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Join a room for specific pages when the client connects
  socket.on('join-page', (pageId) => {
    console.log(`Client joined page room: ${pageId}`);
    socket.join(`page-${pageId}`);
    
    // Send existing comments to the client who joined
    sendExistingComments(socket, pageId);
  });
  
  // Fall back to sending dimanche comments if no join-page event is received
  // (for backward compatibility)
  setTimeout(() => {
    // Check if the client has joined a specific page room
    const rooms = Array.from(socket.rooms);
    if (rooms.length === 1) { // Only the default room
      sendExistingComments(socket, 'dimanche');
    }
  }, 1000);
  
  // Handle new messages with enhanced parent-child support
  socket.on('send-message', async (messageData) => {
    try {
      const { username, content, pageId, parentCommentId } = messageData;
      
      // Validate message data
      const validUsername = username && username.trim() ? username.trim() : 'Anonymous';
      const validContent = content && content.trim() ? content.trim() : '';
      
      if (!validContent) {
        console.log('Ignoring empty message');
        return;
      }
      
      // Prepare comment data for creation
      const commentData = {
        username: validUsername,
        content: validContent,
        pageId,
        votes: 0,
        parentCommentId: parentCommentId || null,
        timestamp: new Date()
      };
      
      // Create the comment with proper relationship handling
      const newComment = await createComment(commentData);
      
      // Broadcast the new comment to everyone on this page
      io.to(`page-${pageId}`).emit('new-message', newComment);
    } catch (error) {
      console.error('Error handling message:', error);
      socket.emit('comment-error', { 
        message: 'Failed to save comment',
        error: error.message 
      });
    }
  });
  
  // Handle voting on comments
  socket.on('vote', async ({ commentId, voteType }) => {
    try {
      const increment = voteType === 'upvote' ? 1 : -1;
      
      // Update the vote count in the database
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $inc: { votes: increment } },
        { new: true }
      );
      
      if (!updatedComment) {
        throw new Error("Comment not found");
      }
      
      // Broadcast the updated vote count
      io.to(`page-${updatedComment.pageId}`).emit('vote-updated', {
        commentId: updatedComment._id,
        votes: updatedComment.votes
      });
    } catch (error) {
      console.error('Error updating vote:', error);
      socket.emit('vote-error', { error: error.message });
    }
  });
  
  // Handle comment deletion
  socket.on('delete-comment', async ({ commentId }) => {
    try {
      // Find the comment to be deleted
      const comment = await Comment.findById(commentId);
      
      if (!comment) {
        throw new Error("Comment not found");
      }
      
      const pageId = comment.pageId;
      const parentCommentId = comment.parentCommentId;
      const topLevelCommentId = comment.topLevelCommentId;
      
      // Check if this is a comment with replies
      const hasReplies = comment.directChildrenCount > 0;
      
      if (hasReplies) {
        // For comments with replies, don't actually delete, just mark as deleted
        await Comment.findByIdAndUpdate(commentId, {
          content: "[Comment deleted]",
          username: "Deleted"
        });
        
        // Notify clients about the content update
        io.to(`page-${pageId}`).emit('comment-updated', {
          commentId,
          content: "[Comment deleted]",
          username: "Deleted"
        });
      } else {
        // For comments without replies, actually delete them
        await Comment.findByIdAndDelete(commentId);
        
        // If this was a reply, update the parent's direct children count
        if (parentCommentId) {
          await Comment.findByIdAndUpdate(
            parentCommentId,
            { $inc: { directChildrenCount: -1, descendentCount: -1 } }
          );
          
          // For all ancestors up the chain, update descendentCount
          if (topLevelCommentId && topLevelCommentId !== parentCommentId) {
            await Comment.findByIdAndUpdate(
              topLevelCommentId,
              { $inc: { descendentCount: -1 } }
            );
          }
        }
        
        // Notify clients about the deletion
        io.to(`page-${pageId}`).emit('comment-deleted', { commentId });
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      socket.emit('delete-error', { 
        message: 'Failed to delete comment',
        error: error.message 
      });
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Get challenge for password verification 
app.get('/api/auth-challenge/:pageId', async (req, res) => {
  try {
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
    
    // Store challenge in session (in a production app, you'd use Redis or similar)
    if (!global.challenges) {
      global.challenges = new Map();
    }
    
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
    
    // The client sends a hash of: SHA256(challenge + SHA256(salt + password))
    // We have stored: SHA256(salt + password) as passwordHash in the database
    
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

// Initialize protected pages if they don't exist or need updating
async function initializeProtectedPages() {
  try {
    // Get password from environment variables
    const password = process.env.DIMANCHE_PASSWORD;
    
    if (!password) {
      throw new Error('DIMANCHE_PASSWORD environment variable is required for initialization');
    }
    
    // Check if Dimanche page protection exists
    const dimanchePage = await ProtectedPage.findOne({ pageId: 'dimanche' });
    
    if (!dimanchePage) {
      // Create new protected page entry
      console.log('Creating Dimanche protected page...');
      
      // Generate a random salt
      const salt = crypto.randomBytes(16).toString('hex');
      
      // Hash: SHA256(salt + password)
      const passwordHash = crypto
        .createHash('sha256')
        .update(salt + password)
        .digest('hex');
      
      // Create the protected page entry
      const newProtectedPage = new ProtectedPage({
        pageId: 'dimanche',
        pageName: 'Dimanche Coffee',
        passwordHash,
        salt
      });
      
      await newProtectedPage.save();
      console.log('Initialized protected page: Dimanche');
    } 
    // Check if the page exists but needs to be updated with new salt field
    else if (!dimanchePage.salt) {
      console.log('Updating Dimanche page with new salted hash mechanism');
      
      // Generate a new salt
      const salt = crypto.randomBytes(16).toString('hex');
      
      // Create new password hash with the salt
      const passwordHash = crypto
        .createHash('sha256')
        .update(salt + password)
        .digest('hex');
      
      // Update the record with the new hash and salt
      dimanchePage.passwordHash = passwordHash;
      dimanchePage.salt = salt;
      
      await dimanchePage.save();
      console.log('Updated Dimanche page with new auth mechanism');
    } else {
      console.log('Dimanche protected page already exists');
    }
  } catch (error) {
    console.error('Error initializing protected pages:', error);
  }
}

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeProtectedPages();
});