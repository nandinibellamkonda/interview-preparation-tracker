const StudyPlan = require('../models/StudyPlan');

// Generate Study Plan
exports.generateStudyPlan = async (req, res) => {
  try {
    const { planType, placementDate, skillLevel, targetPackage } = req.body;

    // Deactivate existing active plans
    await StudyPlan.updateMany(
      { userId: req.userId, isActive: true },
      { isActive: false }
    );

    const daysRemaining = Math.ceil((new Date(placementDate) - new Date()) / (1000 * 60 * 60 * 24));

    let weeks = [];
    let totalWeeks = 0;

    if (planType === 'Weekly') {
      totalWeeks = Math.ceil(daysRemaining / 7);
    } else if (planType === 'Monthly') {
      totalWeeks = Math.ceil(daysRemaining / 7);
    } else if (planType === 'Emergency') {
      totalWeeks = Math.ceil(daysRemaining / 7);
    }

    // Generate weeks with topics
    const allTopics = [
      'Arrays',
      'Strings',
      'Linked Lists',
      'Stack',
      'Queue',
      'Trees',
      'Graphs',
      'Binary Search',
      'Dynamic Programming',
      'Core Java',
      'SQL',
      'Aptitude',
    ];

    for (let i = 0; i < totalWeeks; i++) {
      const weekStart = new Date(placementDate);
      weekStart.setDate(weekStart.getDate() - (totalWeeks - i) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const topicsThisWeek = allTopics.slice(
        (i % Math.ceil(allTopics.length / totalWeeks)) * Math.ceil(allTopics.length / totalWeeks),
        ((i + 1) % Math.ceil(allTopics.length / totalWeeks)) * Math.ceil(allTopics.length / totalWeeks)
      );

      weeks.push({
        weekNumber: i + 1,
        startDate: weekStart,
        endDate: weekEnd,
        topics: topicsThisWeek,
        targets: [
          `Study ${topicsThisWeek[0] || 'DSA'}`,
          'Solve practice problems',
          'Revise concepts',
        ],
        completed: false,
      });
    }

    const plan = new StudyPlan({
      userId: req.userId,
      planType,
      placementDate,
      skillLevel,
      targetPackage,
      daysRemaining,
      weeks,
      totalWeeks,
      isActive: true,
    });

    await plan.save();

    res.status(201).json({
      message: 'Study plan generated successfully',
      plan,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate study plan', error: error.message });
  }
};

// Get Active Study Plan
exports.getActivePlan = async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({
      userId: req.userId,
      isActive: true,
    });

    if (!plan) {
      return res.status(404).json({ message: 'No active study plan' });
    }

    res.status(200).json({ plan });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch study plan', error: error.message });
  }
};

// Get All Study Plans
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await StudyPlan.find({ userId: req.userId }).sort({ createdAt: -1 });

    res.status(200).json({
      count: plans.length,
      plans,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch study plans', error: error.message });
  }
};

// Complete Week
exports.completeWeek = async (req, res) => {
  try {
    const { weekNumber } = req.body;
    const { planId } = req.params;

    const plan = await StudyPlan.findById(planId);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    if (plan.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const week = plan.weeks.find((w) => w.weekNumber === weekNumber);
    if (week) {
      week.completed = true;

      // Update progress
      const completedWeeks = plan.weeks.filter((w) => w.completed).length;
      plan.progress = Math.round((completedWeeks / plan.totalWeeks) * 100);
    }

    await plan.save();

    res.status(200).json({
      message: 'Week marked as completed',
      plan,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to complete week', error: error.message });
  }
};
