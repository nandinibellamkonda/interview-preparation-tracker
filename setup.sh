#!/bin/bash

# Interview Preparation Tracker - Quick Setup Script
# This script automates the setup process

echo "🚀 Interview Preparation Tracker - Automated Setup"
echo "=================================================="

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16+"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "  Installing dependencies..."
    npm install
else
    echo "  Dependencies already installed"
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "  Creating .env file..."
    cp .env.example .env
    echo "  ⚠️  Please update backend/.env with your MongoDB URI and JWT_SECRET"
else
    echo "  .env already exists"
fi

cd ..
echo "✅ Backend setup complete"
echo ""

# Setup Frontend
echo "🎨 Setting up Frontend..."
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "  Installing dependencies..."
    npm install
else
    echo "  Dependencies already installed"
fi

cd ..
echo "✅ Frontend setup complete"
echo ""

# Display next steps
echo "=================================================="
echo "✨ Setup Complete! Next Steps:"
echo "=================================================="
echo ""
echo "1️⃣  Update backend/.env with your MongoDB connection string:"
echo "   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-prep"
echo "   JWT_SECRET=your_secure_secret_key"
echo ""
echo "2️⃣  Start the backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "3️⃣  In another terminal, start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "4️⃣  Open your browser and go to:"
echo "   http://localhost:5173"
echo ""
echo "5️⃣  Register and login to get started!"
echo ""
echo "📚 Documentation:"
echo "   - README_COMPLETE.md - Full documentation"
echo "   - DEPLOYMENT_GUIDE.md - Deployment instructions"
echo "   - PROJECT_SUMMARY.md - Project overview"
echo ""
echo "🚀 Good to go!"
