const express = require('express');
const achievementController = require('../controllers/achievementController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Achievements
router.get('/', achievementController.getAchievements);
router.post('/check', achievementController.checkAchievements);

module.exports = router;
