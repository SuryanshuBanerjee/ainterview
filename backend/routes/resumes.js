import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  analyzeResumeATS
} from '../controllers/resumeController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getResumes)
  .post(createResume);

router.route('/:id')
  .get(getResume)
  .put(updateResume)
  .delete(deleteResume);

router.post('/:id/analyze', analyzeResumeATS);

export default router;
