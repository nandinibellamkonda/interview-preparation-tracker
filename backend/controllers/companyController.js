const CompanyPrep = require('../models/CompanyPrep');
const User = require('../models/User');

// Create or Get Company Prep
exports.createOrGetCompanyPrep = async (req, res) => {
  try {
    const { company } = req.params;

    let prep = await CompanyPrep.findOne({
      userId: req.userId,
      company,
    });

    if (!prep) {
      // Initialize with default topics based on company
      const companyTopics = {
        Infosys: ['Core Java', 'SQL', 'DSA', 'Aptitude'],
        TCS: ['Core Java', 'SQL', 'DSA', 'HR', 'Aptitude'],
        Wipro: ['Core Java', 'SQL', 'DSA', 'Aptitude'],
        Cognizant: ['Core Java', 'SQL', 'DSA', 'HR'],
        Accenture: ['Core Java', 'DSA', 'SQL', 'Aptitude'],
        Deloitte: ['Core Java', 'SQL', 'DSA', 'HR', 'Aptitude'],
        Capgemini: ['Core Java', 'SQL', 'DSA', 'Aptitude'],
        Amazon: ['DSA', 'System Design', 'Behavioral'],
        Google: ['DSA', 'System Design', 'Behavioral', 'Google-specific'],
      };

      prep = new CompanyPrep({
        userId: req.userId,
        company,
        frequentlyAskedTopics: companyTopics[company] || [],
        completionChecklist: (companyTopics[company] || []).map((topic) => ({
          item: `Study ${topic}`,
          completed: false,
        })),
      });

      await prep.save();
    }

    res.status(200).json({
      prep,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch company prep', error: error.message });
  }
};

// Update Checklist Item
exports.updateChecklistItem = async (req, res) => {
  try {
    const { itemIndex, completed } = req.body;
    const { id } = req.params;

    const prep = await CompanyPrep.findById(id);

    if (!prep) {
      return res.status(404).json({ message: 'Company prep not found' });
    }

    if (prep.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (prep.completionChecklist[itemIndex]) {
      prep.completionChecklist[itemIndex].completed = completed;
      if (completed) {
        prep.completionChecklist[itemIndex].completedDate = new Date();
      }
    }

    // Update readiness percentage (handle empty checklist)
    const completedCount = prep.completionChecklist.filter((item) => item.completed).length;
    if (!prep.completionChecklist.length) {
      prep.readinessPercentage = 0;
    } else {
      prep.readinessPercentage = Math.round((completedCount / prep.completionChecklist.length) * 100);
    }

    await prep.save();

    res.status(200).json({
      message: 'Checklist updated',
      prep,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update checklist', error: error.message });
  }
};

// Get All Company Preps
exports.getAllCompanyPreps = async (req, res) => {
  try {
    const preps = await CompanyPrep.find({ userId: req.userId }).sort({ createdAt: -1 });

    res.status(200).json({
      count: preps.length,
      preps,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch company preps', error: error.message });
  }
};

// Delete Company Prep
exports.deleteCompanyPrep = async (req, res) => {
  try {
    const prep = await CompanyPrep.findById(req.params.id);

    if (!prep) {
      return res.status(404).json({ message: 'Company prep not found' });
    }

    if (prep.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await CompanyPrep.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Company prep deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete company prep', error: error.message });
  }
};
