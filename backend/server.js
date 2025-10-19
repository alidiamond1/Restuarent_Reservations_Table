const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection with caching for serverless
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    console.log('Using cached database connection');
    return cachedDb;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    cachedDb = conn;
    console.log('Connected to MongoDB Atlas');
    return conn;
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err);
    throw err;
  }
}

// Initialize DB connection
connectToDatabase().catch(console.error);

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  'https://restuarent-reservations-table.vercel.app/'
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1 && allowedOrigins.length > 0) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Restaurant Reservations API is running!',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'Restaurant Reservations API',
    version: '1.0.0',
    endpoints: [
      '/api/auth',
      '/api/reservations',
      '/api/tables',
      '/api/admin'
    ]
  });
});

// Routes - wrap in try-catch for better error handling
try {
  const authRoutes = require('./routes/auth');
  const reservationRoutes = require('./routes/reservations');
  const tableRoutes = require('./routes/tables');
  const adminRoutes = require('./routes/admin');

  app.use('/api/auth', authRoutes);
  app.use('/api/reservations', reservationRoutes);
  app.use('/api/tables', tableRoutes);
  app.use('/api/admin', adminRoutes);
} catch (error) {
  console.error('Error loading routes:', error);
}

// Error Handler (Make sure this is the last piece of middleware)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

// Start server only in development (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel serverless functions
module.exports = app;