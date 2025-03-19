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

### 1. Login to Heroku

```bash
# Login to Heroku CLI
heroku login

# Login to Heroku Container Registry
heroku container:login
```

### 2. Create a Heroku App

```bash
# Create a new Heroku app
heroku create ckallum-website

# Or use an existing app
heroku git:remote -a your-app-name
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

# If you're using a custom MongoDB URI (not the Heroku add-on)
heroku config:set MONGODB_URI=your_mongodb_uri
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