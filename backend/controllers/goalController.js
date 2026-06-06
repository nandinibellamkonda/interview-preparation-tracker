const Goal = require('../models/Goal');

const VALID_CATEGORIES = ['DSA', 'SQL', 'Java', 'Aptitude', 'Applications', 'Interviews', 'Resume', 'General'];
const VALID_STATUSES = ['Not Started', 'In Progress', 'Completed', 'Abandoned'];
const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

const parseDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const validateGoalPayload = ({ title, category, targetDate, status, priority }) => {
  if (!title || typeof title !== 'string' || !title.trim()) {
    return 'Goal title is required.';
  }
  if (!category || !VALID_CATEGORIES.includes(category)) {
    return 'Goal category is invalid.';
  }
  if (!targetDate || !parseDate(targetDate)) {
    return 'Target date is required and must be a valid date.';
  }
  if (!status || !VALID_STATUSES.includes(status)) {
    return 'Goal status is invalid.';
  }
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return 'Goal priority is invalid.';
  }
  return null;
};

const listGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ targetDate: 1, createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch goals: ' + error.message });
  }
};

const createGoal = async (req, res) => {
  try {
    const { title, description, category, targetDate, status, priority } = req.body;
    const validationError = validateGoalPayload({ title, category, targetDate, status, priority });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const payload = {
      userId: req.user._id,
      title: title.trim(),
      description: description?.trim() || '',
      category,
      targetDate: parseDate(targetDate),
      status,
      priority: priority || 'Medium',
      completedAt: status === 'Completed' ? new Date() : null,
    };

    const goal = await Goal.create(payload);
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create goal: ' + error.message });
  }
};

const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const existingGoal = await Goal.findOne({ _id: id, userId: req.user._id });
    if (!existingGoal) {
      return res.status(404).json({ error: 'Goal not found.' });
    }

    const payload = { ...req.body };
    if (payload.title !== undefined && typeof payload.title === 'string') {
      payload.title = payload.title.trim();
    }
    if (payload.description !== undefined && typeof payload.description === 'string') {
      payload.description = payload.description.trim();
    }

    if (payload.targetDate !== undefined) {
      const parsedDate = parseDate(payload.targetDate);
      if (!parsedDate) {
        return res.status(400).json({ error: 'Target date must be a valid date.' });
      }
      payload.targetDate = parsedDate;
    }

    if (payload.category !== undefined && !VALID_CATEGORIES.includes(payload.category)) {
      return res.status(400).json({ error: 'Goal category is invalid.' });
    }

    if (payload.status !== undefined && !VALID_STATUSES.includes(payload.status)) {
      return res.status(400).json({ error: 'Goal status is invalid.' });
    }

    if (payload.priority !== undefined && !VALID_PRIORITIES.includes(payload.priority)) {
      return res.status(400).json({ error: 'Goal priority is invalid.' });
    }

    if (payload.status === 'Completed') {
      payload.completedAt = new Date();
    } else if (payload.status !== undefined) {
      payload.completedAt = null;
    }

    const goal = await Goal.findOneAndUpdate({ _id: id, userId: req.user._id }, payload, {
      new: true,
      runValidators: true,
    });

    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update goal: ' + error.message });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Goal.deleteOne({ _id: id, userId: req.user._id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Goal not found.' });
    res.json({ message: 'Goal deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete goal: ' + error.message });
  }
};

module.exports = {
  listGoals,
  createGoal,
  updateGoal,
  deleteGoal,
};
