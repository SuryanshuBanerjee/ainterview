import Resume from '../models/Resume.js';
import User from '../models/User.js';
import { analyzeResume, generateATSSuggestions } from '../services/atsAnalyzer.js';

// @desc    Get all resumes for user
// @route   GET /api/resumes
// @access  Private
export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ resumes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resumes', error: error.message });
  }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({ resume });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resume', error: error.message });
  }
};

// @desc    Create new resume
// @route   POST /api/resumes
// @access  Private
export const createResume = async (req, res) => {
  try {
    const resume = await Resume.create({
      ...req.body,
      user: req.user._id
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { resumesCreated: 1 }
    });

    res.status(201).json({ resume });
  } catch (error) {
    res.status(500).json({ message: 'Error creating resume', error: error.message });
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private
export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    Object.assign(resume, req.body);
    await resume.save();

    res.json({ resume });
  } catch (error) {
    res.status(500).json({ message: 'Error updating resume', error: error.message });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    await resume.deleteOne();

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resume', error: error.message });
  }
};

// @desc    Analyze resume with ATS
// @route   POST /api/resumes/:id/analyze
// @access  Private
export const analyzeResumeATS = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const analysis = analyzeResume(resume.toObject());
    const atsSuggestions = generateATSSuggestions(resume.toObject(), req.body.targetRole);

    res.json({
      analysis,
      atsSuggestions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error analyzing resume', error: error.message });
  }
};
