const mongoose = require('mongoose');

// Cache the database connection to reuse across function invocations
let cachedConnection = null;

async function connectToDatabase() {
  // Return cached connection if it exists
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    console.log('Creating new MongoDB connection...');
    
    // Configure mongoose for serverless environment
    const connection = await mongoose.connect(MONGODB_URI, {
      // Optimize for serverless
      maxPoolSize: 1, // Limit pool size for serverless
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // Disable mongoose buffering
    });

    cachedConnection = connection;
    console.log('Connected to MongoDB successfully');
    
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  cachedConnection = null;
});

module.exports = { 
  connectToDatabase,
  mongoose
}; 