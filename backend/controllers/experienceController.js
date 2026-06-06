const InterviewExperience = require('../models/InterviewExperience');

// Create Interview Experience
exports.createExperience = async (req, res) => {
  try {
    const {
      company,
      role,
      rounds,
      interviewDate,
      questionAsked,
      result,
      difficulty,
      experience,
      tips,
      interviewerAttitude,
      overallExperience,
    } = req.body;

    const interviewExp = new InterviewExperience({
      userId: req.userId,
      company,
      role,
      rounds,
      interviewDate,
      questionAsked,
      result,
      difficulty,
      experience,
      tips,
      interviewerAttitude,
      overallExperience,
    });

    await interviewExp.save();

    res.status(201).json({
      message: 'Interview experience shared successfully',
      experience: interviewExp,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create experience', error: error.message });
  }
};

// Get All Experiences
exports.getExperiences = async (req, res) => {
  try {
    const { company, difficulty, sortBy } = req.query;

    const filter = {};
    if (company) filter.company = company;
    if (difficulty) filter.difficulty = difficulty;

    let sortOption = { createdAt: -1 };
    if (sortBy === 'helpful') sortOption = { helpfulness: -1 };

    const experiences = await InterviewExperience.find(filter)
      .populate('userId', 'name')
      .sort(sortOption)
      .limit(50);

    res.status(200).json({
      count: experiences.length,
      experiences,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch experiences', error: error.message });
  }
};

// Get User's Experiences
exports.getUserExperiences = async (req, res) => {
  try {
    const experiences = await InterviewExperience.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: experiences.length,
      experiences,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user experiences', error: error.message });
  }
};

// Upvote Experience
exports.upvoteExperience = async (req, res) => {
  try {
    const experience = await InterviewExperience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    if (!experience.upvotedBy.includes(req.userId)) {
      experience.upvotedBy.push(req.userId);
      experience.helpfulness++;
    } else {
      experience.upvotedBy = experience.upvotedBy.filter(
        (id) => id.toString() !== req.userId.toString()
      );
      experience.helpfulness--;
    }

    await experience.save();

    res.status(200).json({
      message: 'Experience upvoted',
      experience,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upvote', error: error.message });
  }
};

// Delete Experience
exports.deleteExperience = async (req, res) => {
  try {
    const experience = await InterviewExperience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    if (experience.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await InterviewExperience.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete experience', error: error.message });
  }
};

// Get Companies List
exports.getCompanies = async (req, res) => {
  try {
    const companies = await InterviewExperience.distinct('company');

    res.status(200).json({
      companies: companies.sort(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch companies', error: error.message });
  }
};
