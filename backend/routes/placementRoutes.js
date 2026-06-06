const express = require('express');
const placementController = require('../controllers/placementController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Placement Readiness
router.get('/readiness', placementController.getReadiness);
router.get('/predict', placementController.predictPlacement);

module.exports = router;
