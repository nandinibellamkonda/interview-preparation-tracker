const Flashcard = require('../models/Flashcard');
const FlashcardDeck = require('../models/FlashcardDeck');

// Create Flashcard Deck
exports.createDeck = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    const deck = new FlashcardDeck({
      userId: req.userId,
      name,
      description,
      category,
    });

    await deck.save();

    res.status(201).json({
      message: 'Deck created successfully',
      deck,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create deck', error: error.message });
  }
};

// Create Flashcard
exports.createFlashcard = async (req, res) => {
  try {
    const { question, answer, category, difficulty, deckId } = req.body;

    const flashcard = new Flashcard({
      userId: req.userId,
      question,
      answer,
      category,
      difficulty,
      deckId,
      nextReviewDate: new Date(),
    });

    await flashcard.save();

    // Update deck card count
    await FlashcardDeck.findByIdAndUpdate(deckId, {
      $inc: { cardCount: 1 },
    });

    res.status(201).json({
      message: 'Flashcard created successfully',
      flashcard,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create flashcard', error: error.message });
  }
};

// Get All Decks
exports.getDecks = async (req, res) => {
  try {
    const decks = await FlashcardDeck.find({ userId: req.userId }).sort({ createdAt: -1 });

    res.status(200).json({
      count: decks.length,
      decks,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch decks', error: error.message });
  }
};

// Get Flashcards by Deck
exports.getFlashcardsByDeck = async (req, res) => {
  try {
    const { deckId } = req.params;

    const flashcards = await Flashcard.find({
      userId: req.userId,
      deckId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: flashcards.length,
      flashcards,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch flashcards', error: error.message });
  }
};

// Get Flashcards for Review
exports.getFlashcardsForReview = async (req, res) => {
  try {
    const flashcards = await Flashcard.find({
      userId: req.userId,
      nextReviewDate: { $lte: new Date() },
    }).sort({ nextReviewDate: 1 });

    res.status(200).json({
      count: flashcards.length,
      flashcards,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch review flashcards', error: error.message });
  }
};

// Update Flashcard Review
exports.updateFlashcardReview = async (req, res) => {
  try {
    const { isCorrect } = req.body;
    const flashcard = await Flashcard.findById(req.params.id);

    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    if (flashcard.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // SM-2 Algorithm for spaced repetition
    flashcard.reviewCount++;
    if (isCorrect) {
      flashcard.correctAttempts++;
      flashcard.easeFactor = Math.max(1.3, flashcard.easeFactor + 0.1 - (5 - 5) * (0.08 - (5 - 5) * 0.02));
    } else {
      flashcard.easeFactor = Math.max(1.3, flashcard.easeFactor - 0.2);
      flashcard.interval = 1;
    }

    if (flashcard.reviewCount === 1) {
      flashcard.interval = 1;
    } else if (flashcard.reviewCount === 2) {
      flashcard.interval = 3;
    } else {
      flashcard.interval = Math.round(flashcard.interval * flashcard.easeFactor);
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + flashcard.interval);
    flashcard.nextReviewDate = nextReview;
    flashcard.lastReviewedDate = new Date();

    await flashcard.save();

    res.status(200).json({
      message: 'Flashcard review updated',
      flashcard,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update review', error: error.message });
  }
};

// Delete Flashcard
exports.deleteFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id);

    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    if (flashcard.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Flashcard.findByIdAndDelete(req.params.id);

    // Update deck card count
    if (flashcard.deckId) {
      await FlashcardDeck.findByIdAndUpdate(flashcard.deckId, {
        $inc: { cardCount: -1 },
      });
    }

    res.status(200).json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete flashcard', error: error.message });
  }
};
