#!/bin/bash

# EC2 Deployment Script for Inventory Backend
echo "🚀 Starting EC2 deployment for Inventory Backend..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js (if not already installed)
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 globally (if not already installed)
if ! command -v pm2 &> /dev/null; then
    echo "📥 Installing PM2..."
    sudo npm install -g pm2
fi

# Install PostgreSQL (if not already installed)
if ! command -v psql &> /dev/null; then
    echo "📥 Installing PostgreSQL..."
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
fi

# Create application directory
APP_DIR="/home/ubuntu/inventory-backend"
echo "📁 Creating application directory: $APP_DIR"
sudo mkdir -p $APP_DIR
sudo chown ubuntu:ubuntu $APP_DIR

# Copy application files (assuming you're running this from the backend directory)
echo "📋 Copying application files..."
cp -r . $APP_DIR/
cd $APP_DIR

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs uploads

# Set up environment file
echo "⚙️ Setting up environment configuration..."
if [ ! -f .env ]; then
    cp .env.production .env
    echo "⚠️  Please update .env file with your database credentials and other settings"
fi

# Set up PostgreSQL database
echo "🗄️ Setting up database..."
sudo -u postgres createdb inventory_db 2>/dev/null || echo "Database might already exist"
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'your_secure_password';" 2>/dev/null || echo "User might already exist"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE inventory_db TO postgres;" 2>/dev/null || echo "Privileges might already be set"

# Run database migrations
echo "🔄 Running database migrations..."
npm run migrate

# Start application with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
echo "⚠️  Run the command shown above to enable PM2 startup on boot"

# Show application status
echo "✅ Deployment complete! Application status:"
pm2 status

echo "🌐 Your backend should be running on port 3001"
echo "📊 Use 'pm2 logs' to view logs"
echo "🔄 Use 'pm2 restart inventory-backend' to restart"
echo "⏹️  Use 'pm2 stop inventory-backend' to stop"
