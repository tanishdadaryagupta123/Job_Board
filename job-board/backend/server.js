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
  origin: ['http://localhost:3000', 'https://job-board-iv9x.onrender.com', 'https://job-board-gold-iota.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/job-board';

mongoose.connect(MONGODB_URI)
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
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 