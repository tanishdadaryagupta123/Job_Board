const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  company: {
    type: String,
    required: true,
    index: true
  },
  location: {
    type: String,
    required: true,
    index: true
  },
  experience: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  applicationLink: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  postedDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for better search performance
jobSchema.index({ title: 'text', company: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema); 