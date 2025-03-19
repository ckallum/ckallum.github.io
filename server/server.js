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
    const challenge = require('crypto').randomBytes(32).toString('hex');
    
    // Store challenge in session (in a production app, you'd use Redis or similar)
    // For simplicity, we'll use a Map to store challenges
    if (!global.challenges) {
      global.challenges = new Map();
    }
    
    // Set expiration for 5 minutes
    const expiration = Date.now() + (5 * 60 * 1000);
    global.challenges.set(pageId + '-' + challenge, { expiration });
    
    // Return the challenge to the client
    return res.json({
      success: true,
      challenge
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
    
    // Verify the password using a secure comparison method
    // First compute a SHA-256 hash of the password to compare with our stored hash
    const crypto = require('crypto');
    
    // We'll retrieve the plaintext password temporarily using our password hash verification
    let passwordCorrect = false;
    
    // Get all possible passwords from database that match this page
    // This allows multiple valid passwords to exist for the same page
    const passwords = await getAllValidPasswords(pageId);
    
    // Check if any of the passwords match the provided hash
    for (const password of passwords) {
      const expectedHash = crypto
        .createHash('sha256')
        .update(challenge + password)
        .digest('hex');
      
      if (crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash))) {
        passwordCorrect = true;
        break;
      }
    }
    
    if (passwordCorrect) {
      // Password is correct - remove the used challenge
      global.challenges.delete(pageId + '-' + challenge);
      
      // Generate a JWT token with a short expiration time
      const jwt = require('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || require('crypto').randomBytes(32).toString('hex');
      
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

// Helper function to securely get valid plaintext passwords
// This is a temporary solution for demo purposes - in a real production app,
// you would use a different challenge-response mechanism that doesn't require
// retrieving plaintext passwords
async function getAllValidPasswords(pageId) {
  try {
    // For the dimanche page, we know the password
    // This is hardcoded just for demo - in a real app you'd use a
    // different auth mechanism that doesn't need to retrieve passwords
    if (pageId === 'dimanche') {
      return ['liloneedscoffee'];
    }
    
    // For other pages, no valid passwords
    return [];
  } catch (error) {
    console.error('Error retrieving valid passwords:', error);
    return [];
  }
}

// Initialize protected pages if they don't exist
async function initializeProtectedPages() {
  try {
    // Check if Dimanche page protection exists
    const dimanchePage = await ProtectedPage.findOne({ pageId: 'dimanche' });
    
    if (!dimanchePage) {
      // Hash the password "liloneedscoffee"
      const passwordHash = await bcrypt.hash('liloneedscoffee', 10);
      
      // Create the protected page entry
      const newProtectedPage = new ProtectedPage({
        pageId: 'dimanche',
        pageName: 'Dimanche Coffee',
        passwordHash
      });
      
      await newProtectedPage.save();
      console.log('Initialized protected page: Dimanche');
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