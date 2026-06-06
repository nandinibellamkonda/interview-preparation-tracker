const express = require('express');
const leaderboardController = require('../controllers/leaderboardController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Leaderboard (public)
router.get("/", leaderboardController.getLeaderboard);

// Protected routes
router.use(authMiddleware);
router.get('/my-rank', leaderboardController.getUserRank);
router.get('/level-info', leaderboardController.getLevelInfo);

module.exports = router;
