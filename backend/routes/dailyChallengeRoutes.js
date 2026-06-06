const express = require('express');
const dailyChallengeController = require('../controllers/dailyChallengeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Daily Challenges
router.get('/today', dailyChallengeController.getTodayChallenge);
router.get('/history', dailyChallengeController.getChallengeHistory);
router.post('/:challengeId/complete', dailyChallengeController.completeChallenge);
router.put('/:challengeId/task', dailyChallengeController.completeTask);

module.exports = router;
