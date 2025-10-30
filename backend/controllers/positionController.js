import Position from '../models/Position.js';
import User from '../models/User.js';
import { Submission } from '../models/Challenge.js';
import Interview from '../models/Interview.js';
import { searchJobs, calculateJobMatchScore, getRecommendation } from '../services/jobSearch.js';

// @desc    Get all positions for user
// @route   GET /api/positions
// @access  Private
export const getPositions = async (req, res) => {
  try {
    const positions = await Position.find({ user: req.user._id })
      .populate('resumeUsed', 'title')
      .sort({ createdAt: -1 });

    res.json({ positions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching positions', error: error.message });
  }
};

// @desc    Get single position
// @route   GET /api/positions/:id
// @access  Private
export const getPosition = async (req, res) => {
  try {
    const position = await Position.findOne({ _id: req.params.id, user: req.user._id })
      .populate('resumeUsed');

    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }

    res.json({ position });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching position', error: error.message });
  }
};

// @desc    Create new position
// @route   POST /api/positions
// @access  Private
export const createPosition = async (req, res) => {
  try {
    const position = await Position.create({
      ...req.body,
      user: req.user._id
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { positionsAdded: 1 }
    });

    res.status(201).json({ position });
  } catch (error) {
    res.status(500).json({ message: 'Error creating position', error: error.message });
  }
};

// @desc    Update position
// @route   PUT /api/positions/:id
// @access  Private
export const updatePosition = async (req, res) => {
  try {
    const position = await Position.findOne({ _id: req.params.id, user: req.user._id });

    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }

    Object.assign(position, req.body);
    await position.save();

    res.json({ position });
  } catch (error) {
    res.status(500).json({ message: 'Error updating position', error: error.message });
  }
};

// @desc    Delete position
// @route   DELETE /api/positions/:id
// @access  Private
export const deletePosition = async (req, res) => {
  try {
    const position = await Position.findOne({ _id: req.params.id, user: req.user._id });

    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }

    await position.deleteOne();

    res.json({ message: 'Position deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting position', error: error.message });
  }
};

// @desc    Search for jobs with AI matching
// @route   GET /api/positions/search
// @access  Private
export const searchJobsWithMatching = async (req, res) => {
  try {
    const { query, location, page = 1 } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Get user's profile data for matching
    const user = await User.findById(req.user._id);

    // Get user's challenge statistics
    const submissions = await Submission.find({ user: req.user._id });
    const acceptedSubmissions = submissions.filter(s => s.status === 'accepted');
    const challengeAcceptanceRate = submissions.length > 0
      ? (acceptedSubmissions.length / submissions.length) * 100
      : 0;

    // Get user's interview statistics
    const interviews = await Interview.find({ user: req.user._id, status: 'completed' });
    const avgInterviewScore = interviews.length > 0
      ? interviews.reduce((sum, int) => sum + (int.feedback?.overallScore || 70), 0) / interviews.length
      : 70;

    // Build user profile for matching
    const userProfile = {
      skills: user.skills || [],
      challengeAcceptanceRate,
      avgInterviewScore,
      atsScore: 75, // Default ATS score - would calculate from resume in production
      totalInterviews: user.totalInterviews || 0
    };

    // Search for jobs
    const jobs = await searchJobs(query, location || '', page);

    // Calculate match scores and recommendations for each job
    const jobsWithMatching = jobs.map(job => {
      const matchScore = calculateJobMatchScore(userProfile, job);
      const recommendation = getRecommendation(matchScore);

      return {
        ...job,
        matchScore,
        recommendation,
        userProfile: {
          challengeAcceptanceRate: Math.round(challengeAcceptanceRate),
          avgInterviewScore: Math.round(avgInterviewScore),
          totalInterviews: userProfile.totalInterviews
        }
      };
    });

    // Sort by match score (highest first)
    jobsWithMatching.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      jobs: jobsWithMatching,
      total: jobsWithMatching.length,
      page: parseInt(page),
      userProfile
    });
  } catch (error) {
    console.error('Job search error:', error);
    res.status(500).json({ message: 'Error searching jobs', error: error.message });
  }
};
