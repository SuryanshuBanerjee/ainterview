import Interview from '../models/Interview.js';
import User from '../models/User.js';
import { generateAIResponse, generateInterviewFeedback } from '../services/openai.js';

// @desc    Get all interviews for user
// @route   GET /api/interviews
// @access  Private
export const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user._id })
      .populate('position', 'title company')
      .populate('resume', 'title')
      .sort({ createdAt: -1 });

    res.json({ interviews });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interviews', error: error.message });
  }
};

// @desc    Get single interview
// @route   GET /api/interviews/:id
// @access  Private
export const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id })
      .populate('position')
      .populate('resume');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json({ interview });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interview', error: error.message });
  }
};

// @desc    Start new interview
// @route   POST /api/interviews
// @access  Private
export const startInterview = async (req, res) => {
  try {
    const { position, resume, type, difficulty } = req.body;

    const interview = await Interview.create({
      user: req.user._id,
      position,
      resume,
      type,
      difficulty,
      status: 'in-progress',
      startTime: new Date(),
      messages: [{
        role: 'system',
        content: `Starting ${type} interview at ${difficulty} difficulty level.`
      }]
    });

    // Generate initial AI greeting
    const greetingResponse = await generateAIResponse([], type, difficulty);

    interview.messages.push({
      role: 'assistant',
      content: typeof greetingResponse === 'string' ? greetingResponse : greetingResponse.content
    });

    await interview.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalInterviews: 1 }
    });

    res.status(201).json({ interview });
  } catch (error) {
    res.status(500).json({ message: 'Error starting interview', error: error.message });
  }
};

// @desc    Send message in interview
// @route   POST /api/interviews/:id/message
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.status !== 'in-progress') {
      return res.status(400).json({ message: 'Interview is not in progress' });
    }

    // Add user message
    interview.messages.push({
      role: 'user',
      content: message
    });

    // Generate AI response
    const aiResponse = await generateAIResponse(
      interview.messages,
      interview.type,
      interview.difficulty
    );

    const responseContent = typeof aiResponse === 'string' ? aiResponse : aiResponse.content;
    const shouldAutoEnd = aiResponse.shouldAutoEnd || false;

    interview.messages.push({
      role: 'assistant',
      content: responseContent
    });

    // Auto-end interview if needed
    if (shouldAutoEnd) {
      interview.status = 'completed';
      interview.endTime = new Date();

      // Generate AI feedback
      const feedback = await generateInterviewFeedback(interview.messages, interview.type);
      interview.feedback = feedback;
    }

    await interview.save();

    res.json({
      interview,
      autoEnded: shouldAutoEnd
    });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// @desc    Complete interview
// @route   PUT /api/interviews/:id/complete
// @access  Private
export const completeInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    interview.status = 'completed';
    interview.endTime = new Date();

    // Generate AI feedback
    const feedback = await generateInterviewFeedback(interview.messages, interview.type);

    interview.feedback = feedback;
    await interview.save();

    res.json({ interview });
  } catch (error) {
    res.status(500).json({ message: 'Error completing interview', error: error.message });
  }
};

// @desc    Delete interview
// @route   DELETE /api/interviews/:id
// @access  Private
export const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    await interview.deleteOne();

    res.json({ message: 'Interview deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting interview', error: error.message });
  }
};
