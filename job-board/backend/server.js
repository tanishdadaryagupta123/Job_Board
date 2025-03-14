const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require('node-cron');
const jobRoutes = require('./src/routes/jobs');
const jobCrawler = require('./src/services/jobCrawler');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = ['http://localhost:3000', 'https://job-board-iv9x.onrender.com', 'https://job-board-gold-iota.vercel.app'];
    if(!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      const corsError = new Error("Not allowed by CORS policy");
      corsError.name = "CORSError";
      callback(corsError);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/job-board';

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  maxPoolSize: 50,
  retryWrites: true,
  w: 'majority'
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Routes
app.use('/api/jobs', jobRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Job Board API is running' });
});

// Schedule job refresh every 24 hours
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily job refresh...');
  try {
    const keywords = ['software engineer', 'product manager', 'data scientist'];
    for (const keyword of keywords) {
      await jobCrawler.crawlAndSave(keyword);
    }
    console.log('Daily job refresh completed');
  } catch (error) {
    console.error('Error in daily job refresh:', error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Handle CORS errors
  if (err.name === 'CORSError') {
    return res.status(403).json({
      status: 'error',
      type: 'CORS_ERROR',
      message: 'Cross-Origin Request Blocked: The request was blocked by CORS policy',
      origin: req.headers.origin
    });
  }

  // Handle MongoDB connection errors
  if (err.name === 'MongooseServerSelectionError' || err.name === 'MongoTimeoutError') {
    return res.status(503).json({
      status: 'error',
      type: 'DB_CONNECTION_ERROR',
      message: 'Database connection error. Please try again later.'
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      type: 'VALIDATION_ERROR',
      message: err.message,
      errors: err.errors
    });
  }

  // Handle other types of errors
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    type: err.name || 'SERVER_ERROR',
    message: err.message || 'Something went wrong on the server!',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 