# Deployment Guide

This guide will help you deploy the application to Heroku using Docker.

## Prerequisites

- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Git

## Local Testing with Docker

Before deploying to Heroku, test your Docker setup locally:

```bash
# Build and start the containers
docker-compose up --build

# The application should be running at http://localhost:3000
```

## Deploying to Heroku with Docker

## Server-Side Deployment (API)

Since your website is already hosted on GitHub Pages at ckallum.com, you need to deploy just the server component to Heroku to handle API requests.

### 1. Login to Heroku

```bash
# Login to Heroku CLI
heroku login

# Login to Heroku Container Registry
heroku container:login
```

### 2. Create a Heroku App for Your API

```bash
# Create a new Heroku app with a name that indicates it's your API
heroku create ckallum-api

# Or use an existing app
heroku git:remote -a your-app-name
```

### Important: Update Client Configuration

Make sure the API_BASE_URL in your client code (`articles/dimanche/index.html`) points to your Heroku app's URL:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? '' // Empty for local development (same origin)
  : 'https://ckallum-api.herokuapp.com'; // Your Heroku app URL
```

### 3. Add MongoDB Add-on

```bash
# Add MongoDB to your Heroku app
heroku addons:create mongodb:sandbox
```

### 4. Configure Environment Variables

```bash
# Set environment variables in Heroku
heroku config:set JWT_SECRET=your_secret_jwt_key
heroku config:set DIMANCHE_PASSWORD=your_dimanche_password
heroku config:set NODE_ENV=production

# Set your MongoDB Atlas URI
heroku config:set MONGODB_URI=mongodb+srv://ckallum:iaJEXt5w6HrctUAj@cluster0.3vw3p.mongodb.net/ckallum-website?retryWrites=true&w=majority&appName=Cluster0

# IMPORTANT: Set CORS allowed origins to include your static site
heroku config:set CORS_ORIGINS=https://ckallum.com,http://localhost:3000
```

### 5. Deploy to Heroku

There are two ways to deploy:

#### Option 1: Using heroku.yml (recommended)

```bash
# Set the stack to container
heroku stack:set container

# Push to Heroku
git push heroku main
```

#### Option 2: Using Heroku Container Registry

```bash
# Build and push the Docker image
heroku container:push web

# Release the container
heroku container:release web
```

### 6. Open the Application

```bash
heroku open
```

## Troubleshooting

### Viewing Logs

```bash
heroku logs --tail
```

### Restarting the Application

```bash
heroku restart
```

### Checking Configuration

```bash
heroku config
```

## Additional Resources

- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Heroku Docker Deployment](https://devcenter.heroku.com/articles/container-registry-and-runtime)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Alternative to Heroku MongoDB add-on)

## Continuous Deployment

For continuous deployment, consider setting up a GitHub Actions workflow or using Heroku's GitHub integration.