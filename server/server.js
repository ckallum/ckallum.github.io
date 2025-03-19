const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config();

// Import models
const Message = require('./models/message');
const ProtectedPage = require('./models/protectedPage');

// Initialize app
const app = express();
const server = http.createServer(app);

// Configure middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ckallum-website';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Setup Socket.io for chat
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
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
      
      // Create and save new message
      const newMessage = new Message({
        username,
        content,
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
    const crypto = require('crypto');
    const challenge = crypto.randomBytes(32).toString('hex');
    
    // Store challenge in session (in a production app, you'd use Redis or similar)
    if (!global.challenges) {
      global.challenges = new Map();
    }
    
    // Set expiration for 5 minutes
    const expiration = Date.now() + (5 * 60 * 1000);
    
    // Store the page's salt with the challenge to use during verification
    // This is the key security improvement - we never need the plaintext password
    // We only need the salt from the database
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
    
    // The server needs to verify that:
    // SHA256(challenge + storedPasswordHash) === clientHash
    
    const crypto = require('crypto');
    
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
    const hashesMatch = crypto.timingSafeEqual(clientHash, serverHash);
    
    if (hashesMatch) {
      // Password is correct - remove the used challenge
      global.challenges.delete(pageId + '-' + challenge);
      
      // Generate a JWT token with a short expiration time
      const jwt = require('jsonwebtoken');
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
    const crypto = require('crypto');
    
    // Get password from environment variables
    const password = process.env.DIMANCHE_PASSWORD;
    
    if (!password) {
      throw new Error('DIMANCHE_PASSWORD environment variable is required for initialization');
    }
    
    // Check if Dimanche page protection exists
    const dimanchePage = await ProtectedPage.findOne({ pageId: 'dimanche' });
    
    if (!dimanchePage) {
      // Create new protected page entry
      
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