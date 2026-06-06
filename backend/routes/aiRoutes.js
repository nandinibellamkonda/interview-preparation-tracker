const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const aiController = require('../controllers/aiController');

const router = express.Router();
router.use(authMiddleware);

router.get('/', aiController.getInsights);
router.get('/readiness', aiController.getReadinessScore);
router.get('/study-plan', aiController.getDailyStudyPlan);
router.get('/weak-topics', aiController.getWeakTopicRecommendations);
router.get('/resume-questions', aiController.getResumeQuestions);

module.exports = router;
