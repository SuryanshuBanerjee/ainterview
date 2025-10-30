import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      totalInterviews: user.totalInterviews,
      resumesCreated: user.resumesCreated,
      positionsAdded: user.positionsAdded,
      subscription: user.subscription
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

export default router;
