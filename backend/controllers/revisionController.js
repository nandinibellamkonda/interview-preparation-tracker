const RevisionSchedule = require('../models/RevisionSchedule');
const DSAQuestion = require('../models/DSAQuestion');
const JavaTopic = require('../models/JavaTopic');
const SQLTopic = require('../models/SQLTopic');
const Flashcard = require('../models/Flashcard');

// Get Due Revisions
exports.getDueRevisions = async (req, res) => {
  try {
    const revisions = await RevisionSchedule.find({
      userId: req.userId,
      status: 'pending',
      dueDate: { $lte: new Date() },
    }).sort({ dueDate: 1 });

    res.status(200).json({
      count: revisions.length,
      revisions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch due revisions', error: error.message });
  }
};

// Get Upcoming Revisions
exports.getUpcomingRevisions = async (req, res) => {
  try {
    const revisions = await RevisionSchedule.find({
      userId: req.userId,
      status: 'pending',
      dueDate: { $gt: new Date() },
    })
      .sort({ dueDate: 1 })
      .limit(10);

    res.status(200).json({
      count: revisions.length,
      revisions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch upcoming revisions', error: error.message });
  }
};

// Get All Revisions
exports.getAllRevisions = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = { userId: req.userId };
    if (status) filter.status = status;

    const revisions = await RevisionSchedule.find(filter).sort({ dueDate: 1 });

    res.status(200).json({
      count: revisions.length,
      revisions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch revisions', error: error.message });
  }
};

// Complete Revision
exports.completeRevision = async (req, res) => {
  try {
    const { confidenceRating } = req.body;

    const revision = await RevisionSchedule.findById(req.params.id);

    if (!revision) {
      return res.status(404).json({ message: 'Revision not found' });
    }

    if (revision.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    revision.status = 'completed';
    revision.completedDate = new Date();
    revision.confidenceRating = confidenceRating;

    // Schedule next revision based on confidence
    let nextRevisionDays = 7;
    if (confidenceRating < 5) {
      nextRevisionDays = 1;
    } else if (confidenceRating < 8) {
      nextRevisionDays = 3;
    }

    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + nextRevisionDays);

    // Create next revision
    await RevisionSchedule.create({
      userId: req.userId,
      itemId: revision.itemId,
      itemType: revision.itemType,
      itemName: revision.itemName,
      dueDate: nextDueDate,
      revisionNumber: revision.revisionNumber + 1,
    });

    await revision.save();

    res.status(200).json({
      message: 'Revision completed and next revision scheduled',
      revision,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to complete revision', error: error.message });
  }
};

// Skip Revision
exports.skipRevision = async (req, res) => {
  try {
    const revision = await RevisionSchedule.findById(req.params.id);

    if (!revision) {
      return res.status(404).json({ message: 'Revision not found' });
    }

    if (revision.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    revision.status = 'skipped';
    await revision.save();

    res.status(200).json({
      message: 'Revision skipped',
      revision,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to skip revision', error: error.message });
  }
};

// Get Revision Statistics
exports.getRevisionStats = async (req, res) => {
  try {
    const allRevisions = await RevisionSchedule.find({ userId: req.userId });

    const stats = {
      totalRevisions: allRevisions.length,
      completed: allRevisions.filter((r) => r.status === 'completed').length,
      pending: allRevisions.filter((r) => r.status === 'pending').length,
      skipped: allRevisions.filter((r) => r.status === 'skipped').length,
      dueToday: allRevisions.filter(
        (r) => r.status === 'pending' && new Date(r.dueDate).toDateString() === new Date().toDateString()
      ).length,
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch revision stats', error: error.message });
  }
};
