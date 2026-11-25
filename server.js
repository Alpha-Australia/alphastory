const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve assets folder publicly
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Proxy endpoint for OpenAI API calls
app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt, model = 'dall-e-3', n = 1, size = '1024x1024', quality = 'standard', style = 'vivid' } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'OpenAI API key not configured' });
        }

        console.log('Generating image with prompt:', prompt.substring(0, 100) + '...');

        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model,
                prompt,
                n,
                size,
                quality,
                style
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to generate image');
        }

        res.json(data);
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        hasApiKey: !!process.env.OPENAI_API_KEY,
        timestamp: new Date().toISOString()
    });
});

// Serve the built frontend (output of `vite build`)
const distDir = path.join(__dirname, 'dist');
app.use(express.static(distDir));

// Fall back to the app for any non-API route
app.get(/^(?!\/api(\/|$)).*/, (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FaithTech server running on http://localhost:${PORT}`);
    console.log(`📝 API key configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
