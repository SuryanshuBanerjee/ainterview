import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getPositions,
  getPosition,
  createPosition,
  updatePosition,
  deletePosition,
  searchJobsWithMatching
} from '../controllers/positionController.js';

const router = express.Router();

router.use(protect);

// Job search endpoint (must come before /:id route)
router.get('/search', searchJobsWithMatching);

router.route('/')
  .get(getPositions)
  .post(createPosition);

router.route('/:id')
  .get(getPosition)
  .put(updatePosition)
  .delete(deletePosition);

export default router;
