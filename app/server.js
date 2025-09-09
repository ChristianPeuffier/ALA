const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for JSON parsing
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API endpoint that uses secrets (demonstrating proper usage)
app.get('/api/status', (req, res) => {
    // Example of accessing secrets securely
    const dbStatus = checkDatabaseConnection();
    const apiStatus = checkExternalApiConnection();
    
    res.json({
        database: dbStatus,
        external_api: apiStatus,
        secrets_loaded: {
            db_password: !!process.env.DB_PASSWORD,
            api_key: !!process.env.API_KEY,
            jwt_secret: !!process.env.JWT_SECRET
        }
    });
});

// Example endpoint showing WRONG way to handle secrets (for educational purposes)
app.get('/api/insecure-example', (req, res) => {
    // ⚠️ NEVER DO THIS - This is an example of what NOT to do
    res.json({
        warning: "This endpoint demonstrates INSECURE practices - DO NOT USE IN PRODUCTION",
        exposed_secrets: {
            // These would expose secrets in logs, responses, etc.
            // db_password: process.env.DB_PASSWORD, // NEVER expose secrets like this
            // api_key: process.env.API_KEY // NEVER expose secrets like this
        },
        message: "Secrets should never be exposed in API responses or logs"
    });
});

// Secure configuration endpoint
app.get('/api/config', (req, res) => {
    res.json({
        app_name: 'ALA Secrets Demo',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        features: {
            database_enabled: !!process.env.DB_PASSWORD,
            external_api_enabled: !!process.env.API_KEY,
            auth_enabled: !!process.env.JWT_SECRET
        }
    });
});

// Simulate database connection check
function checkDatabaseConnection() {
    const dbPassword = process.env.DB_PASSWORD;
    if (!dbPassword) {
        return { status: 'disconnected', reason: 'No database password configured' };
    }
    
    // Simulate connection check (in real app, this would connect to actual DB)
    return { 
        status: 'connected',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'ala_demo'
    };
}

// Simulate external API connection check
function checkExternalApiConnection() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        return { status: 'disabled', reason: 'No API key configured' };
    }
    
    // Simulate API check
    return { 
        status: 'enabled',
        endpoint: process.env.API_ENDPOINT || 'https://api.example.com'
    };
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    // Never expose internal errors that might contain sensitive information
    res.status(500).json({ 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 ALA Secrets Demo running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔐 Secrets status:`);
    console.log(`   - DB Password: ${process.env.DB_PASSWORD ? '✅ Loaded' : '❌ Missing'}`);
    console.log(`   - API Key: ${process.env.API_KEY ? '✅ Loaded' : '❌ Missing'}`);
    console.log(`   - JWT Secret: ${process.env.JWT_SECRET ? '✅ Loaded' : '❌ Missing'}`);
});

module.exports = app;