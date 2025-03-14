const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const jobCrawler = require('../services/jobCrawler');
const axios = require('axios');
const {
  companies,
  locations,
  experienceLevels,
  getRandomItem,
  generateJobTitle,
  generateSalaryRange
} = require('../utils/dummyData');

// Function to fetch dummy jobs
async function getDummyJobs() {
  try {
    // Generate 100 dummy jobs instead of API call since Postman API is not accessible
    return Array.from({ length: 100 }, (_, index) => ({
      _id: (index + 1).toString(),
      title: generateJobTitle(),
      company: getRandomItem(companies),
      location: getRandomItem(locations),
      experience: getRandomItem(experienceLevels),
      description: `We are looking for a talented professional to join our team.\n\nSalary Range: ${generateSalaryRange()}\n\nRequirements:\n- Bachelor's degree in relevant field\n- Strong technical skills\n- Excellent communication abilities\n- Problem-solving mindset`,
      applicationLink: `https://careers.example.com/jobs/${index + 1}`,
      source: 'Local Dummy Data',
      postedDate: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  } catch (error) {
    console.error('Error generating dummy jobs:', error);
    return [];
  }
}

// Get all jobs with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20; // Fixed limit of 20 jobs per page
    const skip = (page - 1) * limit;

    let jobs = await Job.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    let total = await Job.countDocuments();

    // If no jobs in database, fetch dummy data
    if (total === 0) {
      const allDummyJobs = await getDummyJobs();
      total = allDummyJobs.length;
      // Apply pagination to dummy jobs
      const startIndex = skip;
      const endIndex = startIndex + limit;
      jobs = allDummyJobs.slice(startIndex, endIndex);
    }

    res.json({
      jobs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalJobs: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search jobs
router.get('/search', async (req, res) => {
  try {
    const { q: query, location, experience } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build search query with filters
    const searchQuery = {
      $and: [
        {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { company: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    };

    // Add filters if provided
    if (location) {
      searchQuery.$and.push({ location });
    }
    if (experience) {
      searchQuery.$and.push({ experience });
    }

    // Get total count for pagination
    const totalJobs = await Job.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalJobs / limit);

    // Get searched jobs
    const jobs = await Job.find(searchQuery)
      .sort({ postedDate: -1 })
      .skip(skip)
      .limit(limit);

    if (jobs.length === 0 && totalJobs === 0) {
      // If no jobs found, get dummy jobs and apply search + filters
      const dummyJobs = await getDummyJobs();
      const filteredDummyJobs = dummyJobs.filter(job => {
        const searchMatch = 
          job.title.toLowerCase().includes(query.toLowerCase()) ||
          job.company.toLowerCase().includes(query.toLowerCase()) ||
          job.description.toLowerCase().includes(query.toLowerCase());
        const locationMatch = !location || job.location === location;
        const experienceMatch = !experience || job.experience === experience;
        return searchMatch && locationMatch && experienceMatch;
      });

      return res.json({
        jobs: filteredDummyJobs.slice(skip, skip + limit),
        currentPage: page,
        totalPages: Math.ceil(filteredDummyJobs.length / limit),
        totalJobs: filteredDummyJobs.length
      });
    }

    res.json({
      jobs,
      currentPage: page,
      totalPages,
      totalJobs
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error searching jobs' });
  }
});

// Filter jobs
router.get('/filter', async (req, res) => {
  try {
    const { location, experience } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter query
    const filterQuery = {};
    if (location) filterQuery.location = location;
    if (experience) filterQuery.experience = experience;

    // Get total count for pagination
    const totalJobs = await Job.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalJobs / limit);

    // Get filtered jobs
    const jobs = await Job.find(filterQuery)
      .sort({ postedDate: -1 })
      .skip(skip)
      .limit(limit);

    if (jobs.length === 0 && totalJobs === 0) {
      // If no jobs found with filters, get dummy jobs
      const dummyJobs = await getDummyJobs();
      // Apply filters to dummy jobs
      const filteredDummyJobs = dummyJobs.filter(job => {
        const locationMatch = !location || job.location === location;
        const experienceMatch = !experience || job.experience === experience;
        return locationMatch && experienceMatch;
      });

      return res.json({
        jobs: filteredDummyJobs.slice(skip, skip + limit),
        currentPage: page,
        totalPages: Math.ceil(filteredDummyJobs.length / limit),
        totalJobs: filteredDummyJobs.length
      });
    }

    res.json({
      jobs,
      currentPage: page,
      totalPages,
      totalJobs
    });
  } catch (error) {
    console.error('Filter error:', error);
    res.status(500).json({ message: 'Error filtering jobs' });
  }
});

// Refresh job listings
router.post('/refresh', async (req, res) => {
  try {
    const { keyword } = req.body;
    if (!keyword) {
      return res.status(400).json({ message: 'Keyword is required' });
    }

    const jobsCount = await jobCrawler.crawlAndSave(keyword);
    res.json({ message: `Successfully crawled and saved ${jobsCount} jobs` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 