const express = require('express');
const { listTopics, createTopic, updateTopic, deleteTopic } = require('../controllers/topicController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);
router.get('/', listTopics);
router.post('/', createTopic);
router.put('/:id', updateTopic);
router.delete('/:id', deleteTopic);
module.exports = router;
