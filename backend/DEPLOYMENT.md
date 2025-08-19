# Deployment Guide for Render

## Prerequisites

1. **PostgreSQL Database**: Set up a PostgreSQL database on Render or use an external service like Neon
2. **Git Repository**: Ensure your code is in a Git repository

## Step 1: Set up PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "PostgreSQL"
3. Choose a name for your database
4. Select a plan (Free tier is available)
5. Choose a region close to your users
6. Click "Create Database"
7. Note down the connection details

## Step 2: Deploy the Backend

### Option A: Using Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your Git repository
4. Configure the service:
   - **Name**: `shopify-analytics-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Option B: Using render.yaml (Recommended)

1. Update the `render.yaml` file with your specific values
2. Push your code to Git
3. Render will automatically detect and deploy using the configuration

## Step 3: Environment Variables

Set these environment variables in your Render service:

### Required Variables:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render's default)

### Optional Variables:
- `CORS_ORIGIN`: Your frontend domain (e.g., `https://your-app.vercel.app`)

## Step 4: Database Setup

After deployment, you need to initialize your database:

1. Go to your deployed service on Render
2. Open the shell/terminal
3. Run the database initialization:
   ```bash
   npm run init-db
   npm run seed-data
   ```

## Step 5: Update Frontend Configuration

Update your frontend API configuration to point to your deployed backend:

```javascript
// In src/services/api.js
const API_BASE_URL = 'https://your-backend-service.onrender.com/api';
```

## Step 6: Test Your Deployment

1. Visit your backend URL: `https://your-service.onrender.com/health`
2. You should see a health check response
3. Test the analytics endpoint: `https://your-service.onrender.com/api/analytics/dashboard`

## Troubleshooting

### Common Issues:

1. **Database Connection Failed**:
   - Check your `DATABASE_URL` environment variable
   - Ensure your database is accessible from Render

2. **CORS Errors**:
   - Update `CORS_ORIGIN` to match your frontend domain
   - For development, you can set it to `*` (not recommended for production)

3. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Ensure `server.js` is the main entry point

### Logs and Debugging:

- View logs in the Render dashboard
- Use the shell feature to run commands directly
- Check the health endpoint for service status

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **CORS**: Restrict CORS origins to your actual frontend domains
3. **Database**: Use SSL connections and strong passwords
4. **HTTPS**: Render provides HTTPS by default

## Performance Optimization

1. **Database Connection Pooling**: Already configured in the code
2. **Caching**: Consider adding Redis for caching
3. **Compression**: Express compression middleware is recommended
4. **Rate Limiting**: Consider adding rate limiting for production

## Monitoring

- Use Render's built-in monitoring
- Set up health checks
- Monitor database performance
- Set up alerts for downtime
