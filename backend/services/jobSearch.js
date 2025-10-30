import axios from 'axios';

// For this implementation, we'll use JSearch API from RapidAPI (free tier)
// Alternative: Adzuna API, Reed API, or any other job board API
// Users can get a free API key from: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch

const RAPID_API_KEY = process.env.RAPID_API_KEY || 'demo-key';
const RAPID_API_HOST = 'jsearch.p.rapidapi.com';

/**
 * Search for jobs using external job board APIs
 */
export const searchJobs = async (query, location = '', page = 1) => {
  try {
    // If no API key is configured, return mock data for development
    if (RAPID_API_KEY === 'demo-key') {
      return getMockJobs(query, location);
    }

    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/search',
      params: {
        query: `${query} ${location}`.trim(),
        page: page.toString(),
        num_pages: '1'
      },
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': RAPID_API_HOST
      }
    };

    const response = await axios.request(options);
    return response.data.data || [];
  } catch (error) {
    console.error('Job search API error:', error);
    // Fall back to mock data if API fails
    return getMockJobs(query, location);
  }
};

/**
 * Mock job data for development/demo purposes
 */
const getMockJobs = (query, location) => {
  const mockJobs = [
    {
      job_id: 'mock-1',
      employer_name: 'Tech Innovations Inc',
      employer_logo: null,
      job_title: 'Senior Software Engineer',
      job_description: 'We are seeking a Senior Software Engineer to join our dynamic team. You will be responsible for designing and developing scalable web applications using React, Node.js, and AWS. The ideal candidate has 5+ years of experience in full-stack development and strong problem-solving skills.',
      job_apply_link: 'https://example.com/jobs/1',
      job_city: 'San Francisco',
      job_state: 'CA',
      job_country: 'US',
      job_employment_type: 'FULLTIME',
      job_min_salary: 120000,
      job_max_salary: 180000,
      job_salary_currency: 'USD',
      job_required_skills: ['React', 'Node.js', 'JavaScript', 'AWS', 'MongoDB'],
      job_required_experience: {
        required_experience_in_months: 60
      },
      job_posted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      job_id: 'mock-2',
      employer_name: 'Digital Solutions Corp',
      employer_logo: null,
      job_title: 'Full Stack Developer',
      job_description: 'Join our team as a Full Stack Developer! We need someone proficient in modern JavaScript frameworks (React/Vue), Python/Node.js backend, and database design. You\'ll work on exciting projects for Fortune 500 clients. 3+ years of experience required.',
      job_apply_link: 'https://example.com/jobs/2',
      job_city: 'New York',
      job_state: 'NY',
      job_country: 'US',
      job_employment_type: 'FULLTIME',
      job_min_salary: 100000,
      job_max_salary: 150000,
      job_salary_currency: 'USD',
      job_required_skills: ['React', 'Vue.js', 'Python', 'Node.js', 'SQL', 'Git'],
      job_required_experience: {
        required_experience_in_months: 36
      },
      job_posted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      job_id: 'mock-3',
      employer_name: 'StartupHub Technologies',
      employer_logo: null,
      job_title: 'Frontend Engineer',
      job_description: 'We\'re looking for a talented Frontend Engineer to craft beautiful, responsive user interfaces. You should have strong React skills, understanding of modern CSS, and experience with state management. Work with cutting-edge technologies in a fast-paced startup environment.',
      job_apply_link: 'https://example.com/jobs/3',
      job_city: 'Austin',
      job_state: 'TX',
      job_country: 'US',
      job_employment_type: 'FULLTIME',
      job_min_salary: 90000,
      job_max_salary: 130000,
      job_salary_currency: 'USD',
      job_required_skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Redux', 'TypeScript'],
      job_required_experience: {
        required_experience_in_months: 24
      },
      job_posted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      job_id: 'mock-4',
      employer_name: 'Enterprise Software Solutions',
      employer_logo: null,
      job_title: 'Backend Developer',
      job_description: 'Enterprise Software Solutions is hiring a Backend Developer to build robust, scalable APIs and microservices. Strong experience with Node.js, Express, databases (SQL/NoSQL), and cloud platforms required. You\'ll work on mission-critical systems serving millions of users.',
      job_apply_link: 'https://example.com/jobs/4',
      job_city: 'Seattle',
      job_state: 'WA',
      job_country: 'US',
      job_employment_type: 'FULLTIME',
      job_min_salary: 110000,
      job_max_salary: 160000,
      job_salary_currency: 'USD',
      job_required_skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes'],
      job_required_experience: {
        required_experience_in_months: 48
      },
      job_posted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      job_id: 'mock-5',
      employer_name: 'CloudTech Innovations',
      employer_logo: null,
      job_title: 'DevOps Engineer',
      job_description: 'Seeking a DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines. Experience with AWS/Azure, Docker, Kubernetes, and infrastructure-as-code (Terraform) is essential. Help us build reliable, automated deployment systems.',
      job_apply_link: 'https://example.com/jobs/5',
      job_city: 'Remote',
      job_state: '',
      job_country: 'US',
      job_employment_type: 'FULLTIME',
      job_min_salary: 105000,
      job_max_salary: 155000,
      job_salary_currency: 'USD',
      job_required_skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Python'],
      job_required_experience: {
        required_experience_in_months: 36
      },
      job_posted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Filter by query
  const lowerQuery = query.toLowerCase();
  const filtered = mockJobs.filter(job =>
    job.job_title.toLowerCase().includes(lowerQuery) ||
    job.job_description.toLowerCase().includes(lowerQuery) ||
    job.job_required_skills.some(skill => skill.toLowerCase().includes(lowerQuery))
  );

  return filtered.length > 0 ? filtered : mockJobs;
};

/**
 * Calculate match score between user profile and job requirements
 */
export const calculateJobMatchScore = (userProfile, jobData) => {
  let totalScore = 0;
  let maxScore = 100;

  // 1. Skills Match (40 points)
  const userSkills = (userProfile.skills || []).map(s => s.toLowerCase());
  const jobSkills = (jobData.job_required_skills || []).map(s => s.toLowerCase());

  if (jobSkills.length > 0) {
    const matchingSkills = jobSkills.filter(skill =>
      userSkills.some(userSkill => userSkill.includes(skill) || skill.includes(userSkill))
    );
    const skillScore = (matchingSkills.length / jobSkills.length) * 40;
    totalScore += skillScore;
  }

  // 2. Challenge Performance (20 points)
  const avgChallengeScore = userProfile.challengeAcceptanceRate || 0;
  totalScore += (avgChallengeScore / 100) * 20;

  // 3. Interview Performance (20 points)
  const avgInterviewScore = userProfile.avgInterviewScore || 70;
  totalScore += (avgInterviewScore / 100) * 20;

  // 4. ATS Score (20 points)
  const atsScore = userProfile.atsScore || 70;
  totalScore += (atsScore / 100) * 20;

  return Math.min(Math.round(totalScore), 100);
};

/**
 * Get recommendation based on match score
 */
export const getRecommendation = (matchScore) => {
  if (matchScore >= 80) {
    return {
      shouldApply: true,
      confidence: 'high',
      message: 'Excellent match! You should definitely apply.',
      color: 'var(--accent-green)'
    };
  } else if (matchScore >= 60) {
    return {
      shouldApply: true,
      confidence: 'medium',
      message: 'Good match. Consider applying.',
      color: 'var(--accent-cyan)'
    };
  } else if (matchScore >= 40) {
    return {
      shouldApply: false,
      confidence: 'low',
      message: 'Moderate match. Apply if interested but improve skills first.',
      color: 'var(--accent-purple)'
    };
  } else {
    return {
      shouldApply: false,
      confidence: 'very-low',
      message: 'Not a strong match. Focus on skill development.',
      color: '#ff6688'
    };
  }
};
