const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Dashboard
router.get('/', dashboardController.getDashboard);
router.get('/analytics/weekly', dashboardController.getWeeklyAnalytics);
router.get('/analytics/monthly', dashboardController.getMonthlyAnalytics);
router.get('/analytics/topics', dashboardController.getTopicDistribution);
router.get('/analytics/readiness-radar', dashboardController.getReadinessRadar);

module.exports = router;
