const express = require('express');
const cors = require('cors');
const app = express();

// Enhanced CORS configuration for mapped URLs
const getAllowedOrigins = () => {
  const webHost = process.env.WEB_HOST;
  const frontendPort = process.env.FRONTEND_PORT || '3000';
  
  const origins = [
    'http://localhost:3000',
    'http://localhost:9002',
  ];
  
  if (webHost) {
    // Add mapped URL origins
    origins.push(`https://${frontendPort}-${webHost}`);
    origins.push(`https://9002-${webHost}`);
    origins.push(`https://${webHost}`);
  }
  
  // Add production URL from environment
  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
  }
  
  return origins;
};

app.use(cors({
  origin: getAllowedOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Backend server is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API connection successful',
    backend: 'Node.js Express',
    frontend_integration: 'Ready'
  });
});

// Mock Flask backend endpoints for testing
app.get('/api/user/profile', (req, res) => {
  res.json({
    success: true,
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@justice-bot.com',
      plan: 'Premium'
    }
  });
});

app.post('/api/documents/upload', (req, res) => {
  res.json({
    success: true,
    message: 'Document upload simulation',
    document_id: 'doc_123',
    status: 'uploaded'
  });
});

app.get('/api/cases', (req, res) => {
  res.json({
    success: true,
    cases: [
      {
        id: 1,
        title: 'Sample Legal Case',
        status: 'active',
        created_at: '2025-01-29'
      }
    ]
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'JusticeBot.AI Backend (Node.js)',
    status: 'running',
    endpoints: [
      '/health',
      '/api/test',
      '/api/user/profile',
      '/api/documents/upload',
      '/api/cases'
    ]
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Backend server started successfully!');
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 API test: http://localhost:${PORT}/api/test`);
  console.log('✅ Ready for frontend integration testing!');
});