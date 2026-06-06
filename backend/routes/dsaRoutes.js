const express = require('express');
const dsaController = require('../controllers/dsaController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// DSA Questions
router.post('/', dsaController.createQuestion);
router.get('/', dsaController.getQuestions);
router.get('/analytics', dsaController.getAnalytics);
router.get('/:id', dsaController.getQuestionById);
router.put('/:id', dsaController.updateQuestion);
router.delete('/:id', dsaController.deleteQuestion);

module.exports = router;
