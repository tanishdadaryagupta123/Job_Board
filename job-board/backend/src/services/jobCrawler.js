const axios = require('axios');
const cheerio = require('cheerio');
const Job = require('../models/Job');

class JobCrawler {
  async crawlNaukri(keyword) {
    try {
      const url = `https://www.naukri.com/${keyword}-jobs`;
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const jobs = [];

      $('.jobTuple').each((i, element) => {
        const title = $(element).find('.title').text().trim();
        const company = $(element).find('.companyInfo').text().trim();
        const location = $(element).find('.location').text().trim();
        const experience = $(element).find('.experience').text().trim();
        const description = $(element).find('.job-description').text().trim();
        const applicationLink = $(element).find('a.title').attr('href');

        if (title && company) {
          jobs.push({
            title,
            company,
            location,
            experience,
            description,
            applicationLink,
            source: 'Naukri',
            postedDate: new Date()
          });
        }
      });

      return jobs;
    } catch (error) {
      console.error('Error crawling Naukri:', error);
      return [];
    }
  }

  async crawlLinkedIn(keyword) {
    try {
      const url = `https://www.linkedin.com/jobs/search?keywords=${keyword}`;
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const jobs = [];

      $('.job-search-card').each((i, element) => {
        const title = $(element).find('.job-search-card__title').text().trim();
        const company = $(element).find('.job-search-card__company-name').text().trim();
        const location = $(element).find('.job-search-card__location').text().trim();
        const description = $(element).find('.job-search-card__snippet').text().trim();
        const applicationLink = $(element).find('a.job-search-card__link').attr('href');

        if (title && company) {
          jobs.push({
            title,
            company,
            location,
            experience: 'Not specified',
            description,
            applicationLink,
            source: 'LinkedIn',
            postedDate: new Date()
          });
        }
      });

      return jobs;
    } catch (error) {
      console.error('Error crawling LinkedIn:', error);
      return [];
    }
  }

  async saveJobs(jobs) {
    try {
      await Job.insertMany(jobs, { ordered: false });
      console.log(`Successfully saved ${jobs.length} jobs`);
    } catch (error) {
      console.error('Error saving jobs:', error);
    }
  }

  async crawlAndSave(keyword) {
    const naukriJobs = await this.crawlNaukri(keyword);
    const linkedInJobs = await this.crawlLinkedIn(keyword);
    const allJobs = [...naukriJobs, ...linkedInJobs];
    
    if (allJobs.length > 0) {
      await this.saveJobs(allJobs);
    }
    
    return allJobs.length;
  }
}

module.exports = new JobCrawler(); 