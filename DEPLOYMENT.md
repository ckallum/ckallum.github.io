# Deployment Guide

This guide will help you deploy the application to Vercel using serverless functions.

## Prerequisites

- [Vercel CLI](https://vercel.com/cli) (optional but recommended)
- [Node.js](https://nodejs.org/) (v18 or higher)
- Git
- A Vercel account

## Local Testing

Before deploying to Vercel, test your setup locally:

```bash
# Install dependencies
npm install

# Test the server locally
npm run dev-server

# The application should be running at http://localhost:3000
```

## Deploying to Vercel with Serverless Functions

## Server-Side Deployment (API)

Since your website is already hosted on GitHub Pages at ckallum.com, you need to deploy just the server component to Vercel to handle API requests using serverless functions.

### 1. Project Structure for Vercel

First, restructure your project to work with Vercel's serverless functions:

```bash
# Create the api directory for Vercel serverless functions
mkdir -p api

# Move your server logic to a serverless function format
# We'll create this in the next step
```

### 2. Create Vercel Configuration

Create a `vercel.json` file in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/socket.io/(.*)",
      "dest": "/api/socket"
    }
  ],
  "functions": {
    "api/**/*.js": {
      "maxDuration": 10
    }
  }
}
```

### 3. Convert Express Server to Serverless Functions

Create serverless function files in the `api/` directory:

**api/index.js** (Main API entry point):
```javascript
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import your models and handlers
const { handleAuthChallenge, handleVerifyPassword } = require('./auth');
const { connectToDatabase } = require('./db');

const app = express();

// Get CORS allowed origins from environment variable or use defaults
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',') 
  : ['https://ckallum.com', 'http://localhost:3000'];

// Configure middleware
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Connect to database
connectToDatabase();

// API routes
app.get('/api/auth-challenge/:pageId', handleAuthChallenge);
app.post('/api/verify-password', handleVerifyPassword);

// Health check
app.get('/api', (req, res) => {
  res.json({ status: 'API Server Running on Vercel' });
});

// Export the Express app
module.exports = app;
```

**api/auth.js** (Authentication handlers):
```javascript
// Extract authentication logic from server.js
// This will contain handleAuthChallenge and handleVerifyPassword functions
```

**api/socket.js** (Socket.io handler):
```javascript
// Socket.io serverless implementation
// Note: Real-time features are limited in serverless
// Consider using Vercel's Edge Runtime or external service
```

### 4. Environment Variables Configuration

Set up your environment variables in Vercel:

```bash
# Using Vercel CLI
vercel env add JWT_SECRET
vercel env add DIMANCHE_PASSWORD  
vercel env add NODE_ENV
vercel env add MONGODB_URI
vercel env add CORS_ORIGINS

# Or set them in the Vercel dashboard
```

Set these values:
- `JWT_SECRET`: Your secret JWT key
- `DIMANCHE_PASSWORD`: Your dimanche password
- `NODE_ENV`: `production`
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `CORS_ORIGINS`: `https://ckallum.com,https://your-vercel-app.vercel.app`

### 5. Deploy to Vercel

#### Option 1: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (first time)
vercel

# For subsequent deployments
vercel --prod
```

#### Option 2: GitHub Integration

1. Connect your GitHub repository to Vercel
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure build settings:
   - Framework Preset: Other
   - Build Command: `npm run build` (if you have TypeScript)
   - Output Directory: Leave empty
6. Add environment variables in the dashboard
7. Deploy

### 6. Update Client Configuration

Update the API_BASE_URL in your client code (`articles/dimanche/index.html`) to point to your Vercel deployment:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' // Local development
  : 'https://your-project-name.vercel.app'; // Your Vercel app URL
```

### 7. Database Setup

Use MongoDB Atlas (recommended for serverless):

```bash
# Your connection string should look like:
mongodb+srv://username:password@cluster.mongodb.net/ckallum-website?retryWrites=true&w=majority
```

## Important Considerations for Serverless

### Socket.io Limitations

**⚠️ Important:** Socket.io doesn't work well with Vercel's serverless functions due to their stateless nature. Consider these alternatives:

1. **Server-Sent Events (SSE):** For real-time updates without bidirectional communication
2. **Polling:** Simple but less efficient
3. **External Services:** Use services like Pusher, Ably, or Socket.io hosted elsewhere
4. **Vercel Edge Runtime:** For some real-time capabilities

### Alternative Real-time Solution

For the chat functionality, consider using **Pusher** or **Ably**:

```javascript
// Example with Pusher
const pusher = new Pusher('your-app-key', {
  cluster: 'your-cluster'
});

const channel = pusher.subscribe('chat');
channel.bind('new-message', function(data) {
  // Handle new message
});
```

## Troubleshooting

### Viewing Logs

```bash
# Using Vercel CLI
vercel logs

# Or check the dashboard at vercel.com
```

### Function Timeout Issues

If your functions timeout, increase the maxDuration in `vercel.json`:

```json
{
  "functions": {
    "api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

### Cold Start Issues

Serverless functions have cold starts. To minimize:

1. Keep functions lightweight
2. Use connection pooling for databases
3. Consider upgrading to Pro plan for better performance

### Database Connection Pooling

```javascript
// api/db.js
const mongoose = require('mongoose');

let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  const connection = await mongoose.connect(process.env.MONGODB_URI, {
    bufferCommands: false,
    maxPoolSize: 1, // Limit pool size for serverless
  });

  cachedConnection = connection;
  return connection;
}

module.exports = { connectToDatabase };
```

## Testing the Deployment

1. Visit your Vercel app URL
2. Test the API endpoints: `https://your-app.vercel.app/api`
3. Test authentication flow
4. Check logs for any errors

## Alternative: Hybrid Approach

If you need full Socket.io functionality, consider:

1. **Deploy static site to Vercel** (or keep on GitHub Pages)
2. **Deploy Socket.io server to Railway, Render, or DigitalOcean** for real-time features
3. **Use Vercel for other API endpoints**

## Additional Resources

- [Vercel Node.js Functions](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)