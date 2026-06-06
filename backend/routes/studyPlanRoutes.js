const express = require('express');
const studyPlanController = require('../controllers/studyPlanController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Study Plans
router.post('/', studyPlanController.generateStudyPlan);
router.get('/', studyPlanController.getAllPlans);
router.get('/active', studyPlanController.getActivePlan);
router.put('/:planId/complete-week', studyPlanController.completeWeek);

module.exports = router;
