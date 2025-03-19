# Dimanche Server

This is the server component for the Dimanche page on ckallum.com. It provides:

1. Server-side password protection for the Dimanche page
2. Real-time chat functionality using Socket.io
3. Persistent message storage using MongoDB

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. Install the required dependencies:

```bash
npm install
```

2. Configure the MongoDB connection:

The server uses MongoDB to store chat messages and protected page information. 
You can use a local MongoDB installation or a cloud-based service like MongoDB Atlas.

Configure the MongoDB URI in the `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/ckallum-website
```

For MongoDB Atlas, use a connection string in this format:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ckallum-website
```

3. Start the server:

```bash
npm run server
```

For development with auto-restart:

```bash
npm run dev-server
```

## Password Protection

The server provides password protection for specific pages. The Dimanche page is protected with the password "liloneedscoffee".

When a user tries to access the page, they'll be prompted to enter the password. The password is verified server-side using the `/api/verify-password` endpoint.

## Chat Functionality

The chat feature allows users to communicate in real-time on the Dimanche page. Key features:

- Real-time updates using Socket.io
- Persistent messages stored in MongoDB
- User identification with session-based usernames
- Message history loaded when users join

## Deployment

For production deployment, consider the following:

1. Use a production-ready process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server/server.js
   ```

2. Set up a reverse proxy with Nginx or similar to serve both the static files and the server.

3. **Important:** Set up HTTPS to encrypt data in transit:
   - Obtain an SSL certificate (e.g., using Let's Encrypt)
   - Configure your Nginx or other web server to use HTTPS
   - Redirect all HTTP traffic to HTTPS

   Example Nginx configuration with HTTPS:
   ```nginx
   server {
       listen 80;
       server_name ckallum.com www.ckallum.com;
       return 301 https://$host$request_uri;
   }

   server {
       listen 443 ssl;
       server_name ckallum.com www.ckallum.com;

       ssl_certificate /path/to/fullchain.pem;
       ssl_certificate_key /path/to/privkey.pem;
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_prefer_server_ciphers on;
       ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;

       # Serve static files
       location / {
           root /path/to/ckallum;
           try_files $uri $uri/ =404;
       }

       # Proxy API requests to the Node.js server
       location /api/ {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # Proxy WebSocket connections for chat
       location /socket.io/ {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. Ensure MongoDB is properly secured in production:
   - Enable MongoDB authentication
   - Use TLS/SSL for MongoDB connections
   - Configure network security (firewall rules, VPC, etc.)

5. Set environment variables appropriately for production use:
   - Generate a new strong JWT_SECRET
   - Never hardcode sensitive information in your code

## Security Considerations

- The password verification happens server-side to prevent client-side inspection
- All user inputs are sanitized to prevent XSS attacks
- Passwords are stored as bcrypt hashes, not plaintext
- Consider adding rate limiting for production use