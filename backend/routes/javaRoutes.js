const express = require('express');
const javaController = require('../controllers/javaController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Java Topics
router.post('/', javaController.createOrUpdateTopic);
router.get('/', javaController.getTopics);
router.get('/summary', javaController.getProgressSummary);
router.get('/:id', javaController.getTopicById);
router.put('/:id', javaController.updateTopic);
router.delete('/:id', javaController.deleteTopic);

module.exports = router;
