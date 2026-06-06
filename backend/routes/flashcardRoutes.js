const express = require('express');
const flashcardController = require('../controllers/flashcardController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Flashcard Decks
router.post('/decks', flashcardController.createDeck);
router.get('/decks', flashcardController.getDecks);
router.get('/deck/:deckId', flashcardController.getFlashcardsByDeck);

// Flashcards
router.post('/', flashcardController.createFlashcard);
router.get('/review', flashcardController.getFlashcardsForReview);
router.put('/:id/review', flashcardController.updateFlashcardReview);
router.delete('/:id', flashcardController.deleteFlashcard);

module.exports = router;
