const Note = require('../models/Note');
const { validateNotePayload } = require('../utils/validation');

// Create Note
exports.createNote = async (req, res) => {
  try {
    const { title, content, category, relatedTopic, tags, color } = req.body;
    const validationError = validateNotePayload({ title, content, category, color });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const note = new Note({
      userId: req.userId,
      title: title.trim(),
      content: content.trim(),
      category,
      relatedTopic: relatedTopic?.trim() || '',
      tags: Array.isArray(tags) ? tags.filter((tag) => typeof tag === 'string').map((tag) => tag.trim()).filter(Boolean) : [],
      color,
    });

    await note.save();

    res.status(201).json({
      message: 'Note created successfully',
      note,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create note', error: error.message });
  }
};

// Get All Notes
exports.getNotes = async (req, res) => {
  try {
    const { category, isArchived } = req.query;

    const filter = { userId: req.userId };
    if (category) filter.category = category;
    if (isArchived !== undefined) filter.isArchived = isArchived === 'true';

    const notes = await Note.find(filter).sort({ isPinned: -1, createdAt: -1 });

    res.status(200).json({
      count: notes.length,
      notes,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notes', error: error.message });
  }
};

// Get Note by ID
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ note });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch note', error: error.message });
  }
};

// Update Note
exports.updateNote = async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, content, category, color } = req.body;
    const validationError = validateNotePayload({
      title: title !== undefined ? title : note.title,
      content: content !== undefined ? content : note.content,
      category: category !== undefined ? category : note.category,
      color: color !== undefined ? color : note.color,
    });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const updatePayload = { ...req.body };
    if (updatePayload.title !== undefined) updatePayload.title = updatePayload.title.trim();
    if (updatePayload.content !== undefined) updatePayload.content = updatePayload.content.trim();
    if (updatePayload.relatedTopic !== undefined) updatePayload.relatedTopic = updatePayload.relatedTopic?.trim() || '';
    if (updatePayload.tags !== undefined) {
      updatePayload.tags = Array.isArray(updatePayload.tags)
        ? updatePayload.tags.filter((tag) => typeof tag === 'string').map((tag) => tag.trim()).filter(Boolean)
        : note.tags;
    }

    note = await Note.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: 'Note updated successfully',
      note,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update note', error: error.message });
  }
};

// Delete Note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete note', error: error.message });
  }
};

// Pin Note
exports.pinNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.status(200).json({
      message: 'Note pinned status updated',
      note,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to pin note', error: error.message });
  }
};
