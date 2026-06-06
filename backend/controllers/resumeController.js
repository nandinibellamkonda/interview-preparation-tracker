const Resume = require('../models/Resume');
const path = require('path');
const fs = require('fs');
const { normalizeArrayField } = require('../utils/validation');
const { extractResumeMetadata } = require('../utils/resumeParser');

const normalizeArrayFieldLocal = (value) => {
  if (Array.isArray(value)) return value.filter((item) => typeof item === 'string').map((item) => item.trim()).filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

const clearDefaultResume = async (userId) => {
  await Resume.updateMany({ userId, isDefault: true }, { $set: { isDefault: false } });
};

const listResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort('-lastUpdatedDate');
    return res.status(200).json(resumes);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch resumes: ' + error.message });
  }
};

const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    return res.status(200).json(resume);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch resume: ' + error.message });
  }
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const versionName = req.body.versionName?.trim() || req.file.originalname;
    const atsScore = req.body.atsScore !== undefined ? Number(req.body.atsScore) : 0;
    if (Number.isNaN(atsScore) || atsScore < 0) {
      return res.status(400).json({ error: 'ATS score must be a positive number.' });
    }

    const improvements = normalizeArrayField(req.body.improvements);
    const skills = normalizeArrayField(req.body.skills);
    const feedback = req.body.feedback?.trim() || '';
    const experience = req.body.experience?.trim() || '';
    const isDefault = req.body.isDefault === 'true' || req.body.isDefault === true;

    if (isDefault) await clearDefaultResume(req.user._id);

    const fileName = req.file.filename || path.basename(req.file.path);
    const resumeFileUrl = `/uploads/${fileName}`;

    const parsed = await extractResumeMetadata(req.file.path, req.file.mimetype);
    const parsedSkills = parsed.skills || [];
    const parsedProjects = parsed.projects || [];
    const parsedTechnologies = parsed.technologies || [];
    const parsedAchievements = parsed.achievements || [];

    const resume = await Resume.create({
      userId: req.user._id,
      versionName,
      fileName,
      resumeFileUrl,
      uploadDate: new Date(),
      lastUpdatedDate: new Date(),
      isDefault,
      atsScore,
      improvements,
      feedback,
      skills,
      experience,
      parsedSkills,
      parsedProjects,
      parsedTechnologies,
      parsedAchievements,
    });

    return res.status(201).json(resume);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to upload resume: ' + error.message });
  }
};

const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    const updates = {};
    if (req.body.versionName !== undefined) updates.versionName = req.body.versionName.trim() || resume.versionName;
    if (req.body.atsScore !== undefined) {
      const atsScore = Number(req.body.atsScore);
      if (Number.isNaN(atsScore) || atsScore < 0) {
        return res.status(400).json({ error: 'ATS score must be a positive number.' });
      }
      updates.atsScore = atsScore;
    }
    if (req.body.improvements !== undefined) updates.improvements = normalizeArrayField(req.body.improvements);
    if (req.body.skills !== undefined) updates.skills = normalizeArrayField(req.body.skills);
    if (req.body.feedback !== undefined) updates.feedback = req.body.feedback?.trim() || '';
    if (req.body.experience !== undefined) updates.experience = req.body.experience?.trim() || '';
    if (req.body.isDefault !== undefined) {
      updates.isDefault = req.body.isDefault === 'true' || req.body.isDefault === true;
      if (updates.isDefault) await clearDefaultResume(req.user._id);
    }
    updates.lastUpdatedDate = new Date();

    Object.assign(resume, updates);
    await resume.save();

    return res.status(200).json(resume);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update resume: ' + error.message });
  }
};

const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    const fullPath = path.join(__dirname, '..', 'uploads', resume.fileName);
    try { fs.unlinkSync(fullPath); } catch (e) { /* ignore missing file */ }

    await Resume.deleteOne({ _id: resume._id });
    return res.json({ message: 'Resume deleted' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete resume: ' + error.message });
  }
};

module.exports = { listResumes, getResumeById, uploadResume, updateResume, deleteResume };
