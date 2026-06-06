const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const VALID_NOTE_CATEGORIES = ['DSA', 'SQL', 'OS', 'Interview Experiences', 'Revision Notes', 'Aptitude', 'General'];
const VALID_NOTE_COLORS = ['yellow', 'blue', 'green', 'purple', 'red', 'gray'];
const VALID_TOPIC_CATEGORIES = ['DSA', 'OS', 'DBMS', 'CN', 'SQL'];
const VALID_TOPIC_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const VALID_MOCK_CATEGORIES = ['Core Java', 'SQL', 'DSA', 'HR'];
const VALID_MOCK_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const VALID_MOCK_STATUSES = ['in-progress', 'completed', 'abandoned'];

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const isValidEmail = (value) => isNonEmptyString(value) && EMAIL_REGEX.test(value.trim().toLowerCase());
const isValidPassword = (value) => typeof value === 'string' && value.length >= PASSWORD_MIN_LENGTH;
const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const normalizeArrayField = (value) => {
  if (Array.isArray(value)) return value.filter((item) => typeof item === 'string').map((item) => item.trim()).filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

const validateRegisterPayload = ({ fullName, email, password, college, branch, role, graduationYear }) => {
  if (!isNonEmptyString(fullName)) return 'Full name is required.';
  if (!isValidEmail(email)) return 'Valid email is required.';
  if (!isValidPassword(password)) return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  if (!isNonEmptyString(college)) return 'College is required.';
  if (!isNonEmptyString(branch)) return 'Branch is required.';
  if (!isNonEmptyString(role)) return 'Role is required.';
  const year = Number(graduationYear);
  if (!Number.isInteger(year) || year < 1900 || year > 2100) return 'Graduation year is required and must be valid.';
  return null;
};

const validateLoginPayload = ({ email, password }) => {
  if (!isValidEmail(email)) return 'Valid email is required.';
  if (!isNonEmptyString(password)) return 'Password is required.';
  return null;
};

const validateTopicPayload = ({ topicName, category, totalTopics, completedTopics }) => {
  if (!isNonEmptyString(topicName)) return 'Topic name is required.';
  if (!VALID_TOPIC_CATEGORIES.includes(category)) return 'Topic category is invalid.';
  if (totalTopics === undefined || totalTopics === null || !Number.isInteger(Number(totalTopics)) || Number(totalTopics) < 1) {
    return 'Total topics must be a positive integer.';
  }
  const completed = Number(completedTopics ?? 0);
  if (!Number.isInteger(completed) || completed < 0) return 'Completed topics must be zero or a positive integer.';
  if (completed > Number(totalTopics)) return 'Completed topics cannot exceed total topics.';
  return null;
};

const validateNotePayload = ({ title, content, category, color }) => {
  if (!isNonEmptyString(title)) return 'Note title is required.';
  if (!isNonEmptyString(content)) return 'Note content is required.';
  if (category !== undefined && category !== null && !VALID_NOTE_CATEGORIES.includes(category)) return 'Note category is invalid.';
  if (color !== undefined && color !== null && !VALID_NOTE_COLORS.includes(color)) return 'Note color is invalid.';
  return null;
};

const validateMockInterviewPayload = ({ date, platform, score, category, difficulty, status }) => {
  const errors = [];
  if (!parseDate(date)) errors.push('Mock interview date is required and must be valid.');
  if (!isNonEmptyString(platform)) errors.push('Mock interview platform is required.');
  const scoreValue = Number(score);
  if (Number.isNaN(scoreValue) || scoreValue < 0 || scoreValue > 100) errors.push('Score must be a number between 0 and 100.');
  if (category !== undefined && category !== null && !VALID_MOCK_CATEGORIES.includes(category)) errors.push('Mock interview category is invalid.');
  if (difficulty !== undefined && difficulty !== null && !VALID_MOCK_DIFFICULTIES.includes(difficulty)) errors.push('Mock interview difficulty is invalid.');
  if (status !== undefined && status !== null && !VALID_MOCK_STATUSES.includes(status)) errors.push('Mock interview status is invalid.');
  return errors;
};

module.exports = {
  isNonEmptyString,
  isValidEmail,
  isValidPassword,
  parseDate,
  normalizeArrayField,
  validateRegisterPayload,
  validateLoginPayload,
  validateTopicPayload,
  validateNotePayload,
  validateMockInterviewPayload,
};
