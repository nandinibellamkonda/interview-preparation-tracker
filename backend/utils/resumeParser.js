const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const TECHNOLOGY_KEYWORDS = [
  'JavaScript', 'TypeScript', 'Node.js', 'Node', 'React', 'React Native', 'Angular', 'Vue',
  'Python', 'Java', 'C++', 'C#', 'SQL', 'PostgreSQL', 'MongoDB', 'MySQL', 'NoSQL', 'AWS', 'Azure',
  'Docker', 'Kubernetes', 'Git', 'HTML', 'CSS', 'Sass', 'Tailwind', 'Express', 'Spring',
  'TensorFlow', 'PyTorch', 'Linux', 'REST', 'GraphQL', 'Firebase', 'Jenkins', 'GitHub', 'CI/CD',
  'Redis', 'Kafka', 'RabbitMQ', 'Swift', 'Objective-C', 'Flutter', 'Dart', 'Go', 'Scala', 'Rust',
];

const normalizeText = (text) => text.replace(/\r/g, '\n').replace(/[\u00A0\u202F]/g, ' ').trim();

const splitLines = (text) => normalizeText(text)
  .split(/\n+/)
  .map((line) => line.trim())
  .filter(Boolean);

const getSectionLines = (lines, sectionHeaders) => {
  const lowerHeaders = sectionHeaders.map((h) => h.toLowerCase());
  let startIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const normalized = lines[i].toLowerCase();
    if (lowerHeaders.some((header) => normalized.includes(header))) {
      startIndex = i + 1;
      break;
    }
  }

  if (startIndex < 0) return [];

  const sectionLines = [];
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    const isNextHeader = ['skills', 'technical skills', 'experience', 'work experience', 'projects', 'achievements', 'education', 'certifications', 'summary', 'profile']
      .some((header) => line.toLowerCase().startsWith(header));
    if (isNextHeader) break;
    sectionLines.push(line);
  }

  return sectionLines;
};

const parseListValues = (lines) => {
  return lines
    .flatMap((line) => line.split(/[,;•\-\u2022]/))
    .map((item) => item.trim())
    .filter((item) => item);
};

const extractTechnologyKeywords = (text) => {
  const found = new Set();
  const lowerText = text.toLowerCase();
  TECHNOLOGY_KEYWORDS.forEach((keyword) => {
    if (lowerText.includes(keyword.toLowerCase())) found.add(keyword);
  });
  return Array.from(found).slice(0, 10);
};

const extractResumeText = async (filePath, mimeType) => {
  const ext = path.extname(filePath).toLowerCase();
  const buffer = fs.readFileSync(filePath);

  if (mimeType === 'application/pdf' || ext === '.pdf') {
    const data = await pdfParse(buffer);
    return data.text || '';
  }

  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || ext === '.docx') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  }

  return '';
};

const extractResumeMetadata = async (filePath, mimeType) => {
  const text = await extractResumeText(filePath, mimeType);
  if (!text) return {
    skills: [],
    projects: [],
    technologies: [],
    achievements: [],
  };

  const lines = splitLines(text);

  const skillLines = getSectionLines(lines, ['skills', 'technical skills', 'technical expertise']);
  const projectLines = getSectionLines(lines, ['projects', 'academic projects', 'project experience', 'project details']);
  const achievementLines = getSectionLines(lines, ['achievements', 'awards', 'certifications', 'honors']);
  const experienceLines = getSectionLines(lines, ['experience', 'work experience', 'professional experience']);

  const skills = parseListValues(skillLines).slice(0, 12);
  const projects = parseListValues(projectLines).slice(0, 8);
  const achievements = parseListValues(achievementLines).slice(0, 8);
  const technologies = extractTechnologyKeywords(text).slice(0, 10);

  return {
    skills,
    projects,
    technologies,
    achievements,
  };
};

module.exports = { extractResumeMetadata };
