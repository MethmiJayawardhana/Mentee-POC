const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Health check route
app.get('/health', (req, res) => {
  try {
    res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Root route
app.get('/', (req, res) => {
  try {
    res.json({ message: 'Welcome to Mentee POC API', version: '1.0.0' });
  } catch (error) {
    console.error('Root route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 Not Found handler
app.use((req, res) => {
  console.warn(`[404] Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({
    error: message,
    status: status,
    timestamp: new Date().toISOString(),
  });
});

// Start the server
const server = app.listen(port, () => {
  console.log(`✓ Server started successfully at http://localhost:${port}`);
  console.log(`✓ Health check available at http://localhost:${port}/health`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('[SERVER ERROR]', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please try a different port.`);
  }
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('[UNCAUGHT EXCEPTION]', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('[UNHANDLED REJECTION]', reason);
});

module.exports = app;
