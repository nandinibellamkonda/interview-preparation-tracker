const express = require('express');
const sqlController = require('../controllers/sqlController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// SQL Topics
router.post('/', sqlController.createOrUpdateTopic);
router.get('/', sqlController.getTopics);
router.get('/summary', sqlController.getProgressSummary);
router.get('/:id', sqlController.getTopicById);
router.put('/:id', sqlController.updateTopic);
router.delete('/:id', sqlController.deleteTopic);

module.exports = router;
