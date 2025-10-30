import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getInterviews,
  getInterview,
  startInterview,
  sendMessage,
  completeInterview,
  deleteInterview
} from '../controllers/interviewController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getInterviews)
  .post(startInterview);

router.route('/:id')
  .get(getInterview)
  .delete(deleteInterview);

router.post('/:id/message', sendMessage);
router.put('/:id/complete', completeInterview);

export default router;
