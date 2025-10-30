import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getChallenges,
  getChallenge,
  submitSolution,
  getMySubmissions
} from '../controllers/challengeController.js';

const router = express.Router();

router.use(protect);

router.get('/', getChallenges);
router.get('/submissions/my', getMySubmissions);
router.get('/:slug', getChallenge);
router.post('/:slug/submit', submitSolution);

export default router;
