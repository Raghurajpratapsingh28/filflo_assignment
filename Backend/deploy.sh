#!/bin/bash

# Render Deployment Helper Script
# This script helps prepare your backend for Render deployment

echo "🚀 Preparing backend for Render deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the Backend directory."
    exit 1
fi

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
    echo "❌ Error: render.yaml not found. Please ensure the deployment files are created."
    exit 1
fi

echo "✅ Found package.json and render.yaml"

# Check Node.js version
NODE_VERSION=$(node --version)
echo "📦 Node.js version: $NODE_VERSION"

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building TypeScript project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check your TypeScript code."
    exit 1
fi

# Check if dist directory exists
if [ -d "dist" ]; then
    echo "✅ Build output directory created"
else
    echo "❌ Build output directory not found"
    exit 1
fi

echo ""
echo "🎉 Your backend is ready for Render deployment!"
echo ""
echo "Next steps:"
echo "1. Push your code to a Git repository"
echo "2. Follow the instructions in RENDER_DEPLOYMENT.md"
echo "3. Create a new Web Service on Render.com"
echo "4. Configure environment variables"
echo "5. Create a PostgreSQL database"
echo "6. Deploy!"
echo ""
echo "📖 For detailed instructions, see: RENDER_DEPLOYMENT.md"
