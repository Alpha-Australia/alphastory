#!/bin/bash

echo "🚀 Setting up FaithTech Hackathon Environment"
echo "=============================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file and add your OpenAI API key:"
    echo "   OPENAI_API_KEY=sk-your-actual-api-key-here"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file and add your OpenAI API key"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "Available commands:"
echo "  npm run dev     - Start the server with .env support"
echo "  npm run python-server - Start Python server (old method)"
