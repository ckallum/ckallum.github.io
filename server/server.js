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

// API route to verify password
app.post('/api/verify-password', async (req, res) => {
  try {
    const { pageId, password } = req.body;
    
    if (!pageId || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    // Find the protected page
    const protectedPage = await ProtectedPage.findOne({ pageId });
    
    if (!protectedPage) {
      return res.status(404).json({ success: false, message: 'Protected page not found' });
    }
    
    // Compare password
    const passwordMatch = await bcrypt.compare(password, protectedPage.passwordHash);
    
    if (passwordMatch) {
      // Generate a simple access token (you might want to use JWT in production)
      const accessToken = require('crypto').randomBytes(32).toString('hex');
      
      // In a production app, you'd store this token with an expiration time
      // For simplicity, we'll just return it
      return res.json({ 
        success: true, 
        message: 'Password correct',
        accessToken 
      });
    } else {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Password verification error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

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