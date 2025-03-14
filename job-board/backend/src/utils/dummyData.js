const jobTitles = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Product Manager',
  'Data Scientist',
  'UI/UX Designer',
  'Project Manager',
  'QA Engineer'
];

const companies = [
  'Google',
  'Microsoft',
  'Amazon',
  'Apple',
  'Meta',
  'Netflix',
  'Twitter',
  'LinkedIn',
  'Uber',
  'Airbnb'
];

const locations = ['Remote', 'Hybrid', 'On-site'];
const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level'];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateJobTitle() {
  const title = getRandomItem(jobTitles);
  const level = Math.random() > 0.5 ? getRandomItem(['Senior', 'Lead', 'Principal']) : '';
  return level ? `${level} ${title}` : title;
}

function generateSalaryRange() {
  const base = Math.floor(Math.random() * 100000) + 50000;
  const max = base + Math.floor(Math.random() * 50000);
  return `$${base.toLocaleString()} - $${max.toLocaleString()}`;
}

module.exports = {
  jobTitles,
  companies,
  locations,
  experienceLevels,
  getRandomItem,
  generateJobTitle,
  generateSalaryRange
}; 