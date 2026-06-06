const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const mockInterviewController = require('../controllers/mockInterviewController');

router.use(authMiddleware);

router.get('/', mockInterviewController.listMockInterviews);
router.post('/', mockInterviewController.createMockInterview);
router.get('/:id', mockInterviewController.getMockInterview);
router.put('/:id', mockInterviewController.updateMockInterview);
router.delete('/:id', mockInterviewController.deleteMockInterview);

module.exports = router;
