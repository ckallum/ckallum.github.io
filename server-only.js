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

// Create simplified model schemas
const messageSchema = new mongoose.Schema({
  username: String,
  content: String,
  pageId: String,
  timestamp: { type: Date, default: Date.now }
});

const protectedPageSchema = new mongoose.Schema({
  pageId: String,
  pageName: String,
  passwordHash: String,
  salt: String
});

// Create models
const Message = mongoose.model('Message', messageSchema);
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
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Setup Socket.io for chat with proper CORS settings
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Send existing messages to newly connected client
  Message.find({ pageId: 'dimanche' })
    .sort({ timestamp: 1 })
    .then(messages => {
      socket.emit('init-messages', messages);
    })
    .catch(err => console.error('Error fetching messages:', err));
  
  // Handle new messages
  socket.on('send-message', async (messageData) => {
    try {
      const { username, content, pageId } = messageData;
      
      // Validate message data
      const validUsername = username && username.trim() ? username.trim() : 'Anonymous';
      const validContent = content && content.trim() ? content.trim() : '';
      
      if (!validContent) {
        console.log('Ignoring empty message');
        return;
      }
      
      // Create and save new message
      const newMessage = new Message({
        username: validUsername,
        content: validContent,
        pageId,
        timestamp: new Date()
      });
      
      await newMessage.save();
      
      // Broadcast the message to all connected clients
      io.emit('new-message', newMessage);
    } catch (error) {
      console.error('Error handling message:', error);
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