#!/bin/bash

echo "🚀 Starting Shopify Analytics Backend Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the backend directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if database is configured
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  Warning: DATABASE_URL environment variable not set."
    echo "   Please set it in your Render environment variables."
fi

# Initialize database (if DATABASE_URL is set)
if [ ! -z "$DATABASE_URL" ]; then
    echo "🗄️  Initializing database..."
    npm run init-db
    
    echo "🌱 Seeding database with sample data..."
    npm run seed-data
else
    echo "⏭️  Skipping database initialization (DATABASE_URL not set)"
fi

echo "✅ Deployment preparation complete!"
echo "📋 Next steps:"
echo "   1. Push your code to Git"
echo "   2. Deploy to Render using the dashboard or render.yaml"
echo "   3. Set environment variables in Render"
echo "   4. Initialize database after deployment"
