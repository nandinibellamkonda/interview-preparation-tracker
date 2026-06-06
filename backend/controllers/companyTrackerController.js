const Company = require('../models/Company');

const VALID_STATUSES = ['Pending', 'Cleared', 'Rejected'];
const VALID_ROUNDS = ['oaStatus', 'technicalRound1Status', 'technicalRound2Status', 'hrRoundStatus'];

const parseDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const validateCompanyPayload = ({ companyName, role, applicationDate }) => {
  if (!companyName || typeof companyName !== 'string' || !companyName.trim()) {
    return 'Company name is required.';
  }
  if (!role || typeof role !== 'string' || !role.trim()) {
    return 'Role is required.';
  }
  if (!applicationDate || !parseDate(applicationDate)) {
    return 'Application date is required and must be valid.';
  }
  return null;
};

const listCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.user._id }).sort({ applicationDate: -1, createdAt: -1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies: ' + error.message });
  }
};

const getCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ _id: req.params.id, userId: req.user._id });
    if (!company) return res.status(404).json({ error: 'Company not found.' });
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch company: ' + error.message });
  }
};

const createCompany = async (req, res) => {
  try {
    const { companyName, role, applicationDate, notes, oaStatus, technicalRound1Status, technicalRound2Status, hrRoundStatus } = req.body;
    const validationError = validateCompanyPayload({ companyName, role, applicationDate });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const payload = {
      userId: req.user._id,
      companyName: companyName.trim(),
      role: role.trim(),
      applicationDate: parseDate(applicationDate),
      notes: (notes || '').trim(),
      oaStatus: VALID_STATUSES.includes(oaStatus) ? oaStatus : 'Pending',
      technicalRound1Status: VALID_STATUSES.includes(technicalRound1Status) ? technicalRound1Status : 'Pending',
      technicalRound2Status: VALID_STATUSES.includes(technicalRound2Status) ? technicalRound2Status : 'Pending',
      hrRoundStatus: VALID_STATUSES.includes(hrRoundStatus) ? hrRoundStatus : 'Pending',
    };

    const company = await Company.create(payload);
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create company: ' + error.message });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const existingCompany = await Company.findOne({ _id: id, userId: req.user._id });
    if (!existingCompany) {
      return res.status(404).json({ error: 'Company not found.' });
    }

    const payload = { ...req.body };
    if (payload.companyName !== undefined) {
      if (!payload.companyName || typeof payload.companyName !== 'string' || !payload.companyName.trim()) {
        return res.status(400).json({ error: 'Company name is required.' });
      }
      payload.companyName = payload.companyName.trim();
    }

    if (payload.role !== undefined) {
      if (!payload.role || typeof payload.role !== 'string' || !payload.role.trim()) {
        return res.status(400).json({ error: 'Role is required.' });
      }
      payload.role = payload.role.trim();
    }

    if (payload.applicationDate !== undefined) {
      const parsedDate = parseDate(payload.applicationDate);
      if (!parsedDate) {
        return res.status(400).json({ error: 'Application date must be valid.' });
      }
      payload.applicationDate = parsedDate;
    }

    if (payload.notes !== undefined) {
      payload.notes = (payload.notes || '').trim();
    }

    const company = await Company.findOneAndUpdate({ _id: id, userId: req.user._id }, payload, {
      new: true,
      runValidators: true,
    });

    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update company: ' + error.message });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Company.deleteOne({ _id: id, userId: req.user._id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Company not found.' });
    res.json({ message: 'Company deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete company: ' + error.message });
  }
};

const updateRoundStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { round, status } = req.body;

    if (!VALID_ROUNDS.includes(round)) {
      return res.status(400).json({ error: 'Invalid round specified.' });
    }
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status specified.' });
    }

    const company = await Company.findOne({ _id: id, userId: req.user._id });
    if (!company) return res.status(404).json({ error: 'Company not found.' });

    company[round] = status;
    await company.save();

    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update round status: ' + error.message });
  }
};

module.exports = {
  listCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  updateRoundStatus,
};
