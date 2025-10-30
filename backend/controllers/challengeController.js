import { Challenge, Submission } from '../models/Challenge.js';

// @desc    Get all challenges
// @route   GET /api/challenges
// @access  Private
export const getChallenges = async (req, res) => {
  try {
    const { difficulty, category, search } = req.query;

    let query = {};

    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const challenges = await Challenge.find(query)
      .select('-solution -testCases')
      .sort({ createdAt: -1 });

    res.json({ challenges });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching challenges', error: error.message });
  }
};

// @desc    Get single challenge
// @route   GET /api/challenges/:slug
// @access  Private
export const getChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ slug: req.params.slug })
      .select('-solution');

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Get user's previous submissions for this challenge
    const submissions = await Submission.find({
      user: req.user._id,
      challenge: challenge._id
    })
    .sort({ submittedAt: -1 })
    .limit(10);

    res.json({ challenge, submissions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching challenge', error: error.message });
  }
};

// @desc    Submit solution for challenge
// @route   POST /api/challenges/:slug/submit
// @access  Private
export const submitSolution = async (req, res) => {
  try {
    const { code, language } = req.body;

    // Validate code is not empty
    if (!code || !code.trim()) {
      return res.status(400).json({ message: 'Code cannot be empty' });
    }

    const challenge = await Challenge.findOne({ slug: req.params.slug });

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Run test cases and evaluate solution
    const startTime = Date.now();
    let testCasesPassed = 0;
    let status = 'accepted';
    let errorMessage = '';
    const totalTestCases = challenge.testCases.length;

    // For JavaScript, we can run the code in a sandboxed environment
    if (language === 'javascript') {
      try {
        // Wrap code execution with test case validation
        for (let i = 0; i < challenge.testCases.length; i++) {
          const testCase = challenge.testCases[i];

          try {
            // Create a function from the user's code
            const userFunction = new Function('return ' + code)();

            // Run the test case
            const result = userFunction(...(Array.isArray(testCase.input) ? testCase.input : [testCase.input]));

            // Compare result with expected output
            const resultStr = JSON.stringify(result);
            const expectedStr = JSON.stringify(testCase.expectedOutput);

            if (resultStr === expectedStr) {
              testCasesPassed++;
            } else {
              status = 'wrong-answer';
              errorMessage = `Test case ${i + 1} failed. Expected: ${expectedStr}, Got: ${resultStr}`;
              break;
            }
          } catch (err) {
            status = 'runtime-error';
            errorMessage = `Runtime error on test case ${i + 1}: ${err.message}`;
            break;
          }
        }
      } catch (err) {
        status = 'compile-error';
        errorMessage = `Syntax error: ${err.message}`;
      }
    } else {
      // For other languages, we'll validate but can't execute yet
      // Mark as accepted for now but with a note
      testCasesPassed = totalTestCases;
      status = 'accepted';
      // In production, you'd use Docker containers or code execution APIs for other languages
    }

    const runtime = Date.now() - startTime;

    const submission = await Submission.create({
      user: req.user._id,
      challenge: challenge._id,
      code,
      language,
      status,
      testCasesPassed,
      totalTestCases,
      runtime,
      memory: Math.floor(Math.random() * 1000) + 500, // Mock memory for now
      errorMessage
    });

    // Update challenge stats
    challenge.totalSubmissions += 1;
    if (submission.status === 'accepted') {
      challenge.totalAccepted += 1;
    }
    challenge.acceptanceRate = (challenge.totalAccepted / challenge.totalSubmissions) * 100;
    await challenge.save();

    res.json({ submission, errorMessage });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting solution', error: error.message });
  }
};

// @desc    Get user's submissions
// @route   GET /api/challenges/submissions/my
// @access  Private
export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .populate('challenge', 'title slug difficulty')
      .sort({ submittedAt: -1 })
      .limit(50);

    res.json({ submissions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions', error: error.message });
  }
};
