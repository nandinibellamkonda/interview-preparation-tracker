const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

router.get('/', analyticsController.getAnalyticsOverview);
router.get('/problems-per-week', analyticsController.getProblemsSolvedPerWeek);
router.get('/topics', analyticsController.getTopicWiseProgress);
router.get('/interview-success', analyticsController.getInterviewSuccessRate);
router.get('/consistency-streak', analyticsController.getConsistencyStreak);

module.exports = router;
