const mongoose = require('mongoose');

// Enhanced Comment Schema based on EA Forum approach
const commentSchema = new mongoose.Schema({
  // Basic fields
  username: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  editedAt: { type: Date, default: null }, // Tracks when comment was last edited
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

// Protected Page Schema
const protectedPageSchema = new mongoose.Schema({
  pageId: { type: String, required: true, unique: true },
  pageName: { type: String, required: true },
  passwordHash: { type: String, required: true },
  salt: { type: String, required: true }
});

// Legacy Message Schema for backward compatibility
const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  pageId: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now }
});

// Create models
const Comment = mongoose.model('Comment', commentSchema);
const ProtectedPage = mongoose.model('ProtectedPage', protectedPageSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = {
  Comment,
  ProtectedPage,
  Message
}; 