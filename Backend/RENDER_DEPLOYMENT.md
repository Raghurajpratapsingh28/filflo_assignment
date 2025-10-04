# Render Deployment Guide

This guide will help you deploy your inventory backend to Render.com.

## Prerequisites

1. A Render.com account (free tier available)
2. Your backend code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. A PostgreSQL database (Render provides this)

## Files Created for Deployment

The following files have been created to facilitate Render deployment:

- `render.yaml` - Render service configuration
- `env.production.example` - Production environment template
- Updated `package.json` with deployment scripts

## Step-by-Step Deployment Instructions

### 1. Prepare Your Repository

1. Push your backend code to a Git repository
2. Ensure all files are committed and pushed

### 2. Create a New Web Service on Render

1. Log in to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Choose your repository and branch

### 3. Configure the Web Service

#### Basic Settings:
- **Name**: `inventory-backend` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `master` (or your main branch)
- **Root Directory**: Leave empty (or specify `Backend` if your backend is in a subfolder)

#### Build & Deploy Settings:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 4. Set Environment Variables

In the Render dashboard, go to your service's "Environment" tab and add these variables:

#### Required Variables:
```
NODE_ENV=production
PORT=10000
JWT_SECRET=<generate a secure random string>
CORS_ORIGIN=https://your-frontend-domain.onrender.com
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

#### Database Variables (will be set automatically when you create the database):
```
DB_HOST=<will be set automatically>
DB_PORT=<will be set automatically>
DB_NAME=<will be set automatically>
DB_USER=<will be set automatically>
DB_PASSWORD=<will be set automatically>
```

### 5. Create a PostgreSQL Database

1. In Render dashboard, click "New +" → "PostgreSQL"
2. Configure the database:
   - **Name**: `inventory-db`
   - **Database**: `inventory_db`
   - **User**: `inventory_user`
   - **Plan**: Choose based on your needs (Starter is free)
3. Note the database credentials

### 6. Link Database to Web Service

1. Go to your web service settings
2. In the "Environment" tab, add these database variables:
   ```
   DB_HOST=<database host from Render>
   DB_PORT=<database port from Render>
   DB_NAME=<database name from Render>
   DB_USER=<database user from Render>
   DB_PASSWORD=<database password from Render>
   ```

### 7. Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Install dependencies
   - Build your TypeScript code
   - Run database migrations
   - Start your application

### 8. Verify Deployment

1. Check the deployment logs for any errors
2. Test your API endpoints using the provided URL
3. Verify database connection and table creation

## Using render.yaml (Alternative Method)

If you prefer to use the `render.yaml` file:

1. Ensure `render.yaml` is in your repository root
2. In Render dashboard, choose "Infrastructure as Code" when creating a new service
3. Render will automatically read the configuration from `render.yaml`

## Important Notes

### Security Considerations:
- Change the default JWT_SECRET to a secure random string
- Update CORS_ORIGIN to match your frontend domain
- Consider using Render's environment variable encryption for sensitive data

### Database Migrations:
- Migrations run automatically after build (`postbuild` script)
- If you need to run seeders, add them to the postbuild script

### File Uploads:
- Render's file system is ephemeral
- Consider using cloud storage (AWS S3, Cloudinary) for production file uploads
- The `uploads` directory will be reset on each deployment

### Logging:
- Logs are available in the Render dashboard
- Consider using external logging services for production monitoring

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version compatibility
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript compilation

2. **Database Connection Issues**:
   - Verify database credentials
   - Check if database is running
   - Ensure network connectivity

3. **Environment Variable Issues**:
   - Double-check variable names and values
   - Ensure all required variables are set
   - Check for typos in variable names

4. **CORS Issues**:
   - Update CORS_ORIGIN to match your frontend URL
   - Check if frontend is properly configured

### Getting Help:

- Check Render's documentation: https://render.com/docs
- Review deployment logs in the Render dashboard
- Test locally with production environment variables

## Post-Deployment

After successful deployment:

1. Update your frontend to use the new API URL
2. Test all API endpoints
3. Set up monitoring and alerts
4. Configure custom domain (if needed)
5. Set up automated backups for your database

## Scaling Considerations

- Render's free tier has limitations
- Consider upgrading plans for production workloads
- Monitor resource usage and performance
- Implement proper caching strategies
- Consider CDN for static assets

---

Your backend should now be successfully deployed on Render! 🚀
