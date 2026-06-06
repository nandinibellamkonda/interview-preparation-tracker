const express = require('express');
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Notes
router.post('/', noteController.createNote);
router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNoteById);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);
router.put('/:id/pin', noteController.pinNote);

module.exports = router;
