#!/bin/bash

# VibeCheckr Pulse Setup Script
# This script sets up the development environment for VibeCheckr Pulse

echo "🚀 Setting up VibeCheckr Pulse Development Environment"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB first."
    echo "   Visit: https://www.mongodb.com/try/download/community"
    echo "   Or use MongoDB Atlas: https://www.mongodb.com/atlas"
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp env.example .env
    echo "✅ Environment file created. Please update .env with your configuration."
else
    echo "✅ Environment file already exists"
fi

# Create upload directories
echo "📁 Creating upload directories..."
mkdir -p uploads/handbooks
mkdir -p uploads/slidedecks

# Set permissions
chmod 755 uploads/handbooks
chmod 755 uploads/slidedecks

echo "✅ Upload directories created"

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. Please start MongoDB:"
        echo "   sudo systemctl start mongod"
        echo "   or"
        echo "   brew services start mongodb-community"
    fi
else
    echo "⚠️  MongoDB not found. Please ensure MongoDB is installed and running."
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your configuration:"
echo "   - MONGODB_URI (if not using default)"
echo "   - OPENAI_API_KEY (required for AI features)"
echo "   - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (for calendar integration)"
echo "   - JWT_SECRET (generate a secure secret)"
echo ""
echo "2. Start the development servers:"
echo "   npm run dev"
echo ""
echo "3. Open your browser to:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo ""
echo "4. Create your first account and start building surveys!"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "Happy coding! 🚀"
