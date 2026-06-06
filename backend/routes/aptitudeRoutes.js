const express = require('express');
const aptitudeController = require('../controllers/aptitudeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Aptitude Topics
router.post('/', aptitudeController.createOrUpdateTopic);
router.get('/', aptitudeController.getAllTopics);
router.get('/category/:category', aptitudeController.getTopicsByCategory);
router.get('/summary', aptitudeController.getProgressSummary);
router.delete('/:id', aptitudeController.deleteTopic);

module.exports = router;
