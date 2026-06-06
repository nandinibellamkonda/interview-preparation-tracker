const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('MONGO_URI:', process.env.MONGO_URI ? 'FOUND' : 'MISSING');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'FOUND' : 'MISSING');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'FOUND' : 'MISSING');

const connectDatabase = require('./config/db');
const errorMiddleware = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');

const app = express();

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL].filter(Boolean)
  : [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS policy does not allow access from origin ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());

// Serving uploaded resume files publicly
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Static frontend build assets
const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendPath));

const startServer = async () => {
  try {
    // strict database check: must connect or shut down
    await connectDatabase();
    logger.info('Connected to MongoDB successfully.');
  } catch (error) {
    logger.error('CRITICAL: Server startup aborted due to MongoDB connection failure:', error.message);
    process.exit(1);
  }

  // Import routes
  const authRoutes = require('./routes/authRoutes');
  const topicRoutes = require('./routes/topicRoutes');
  const applicationRoutes = require('./routes/applicationRoutes');
  const interviewRoutes = require('./routes/interviewRoutes');
  const activityRoutes = require('./routes/activityRoutes');
  const dashboardRoutes = require('./routes/dashboardRoutes');
  const analyticsRoutes = require('./routes/analyticsRoutes');
  const aiRoutes = require('./routes/aiRoutes');
  const dsaRoutes = require('./routes/dsaRoutes');
  const javaRoutes = require('./routes/javaRoutes');
  const sqlRoutes = require('./routes/sqlRoutes');
  const questionRoutes = require('./routes/questionRoutes');
  const studyRoutes = require('./routes/studyRoutes');
  const studyPlanRoutes = require('./routes/studyPlanRoutes');
  const mockInterviewRoutes = require('./routes/mockInterviewRoutes');
  const revisionRoutes = require('./routes/revisionRoutes');
  // roadmapRoutes removed (outside scope)
  const predictorRoutes = require('./routes/predictorRoutes');
  const resumeRoutes = require('./routes/resumeRoutes');
  const experienceRoutes = require('./routes/experienceRoutes');
  // achievementRoutes, aptitudeRoutes removed (outside scope)
  const companyRoutes = require('./routes/companyRoutes');
  const companyTrackerRoutes = require('./routes/companyTrackerRoutes');
  const noteRoutes = require('./routes/noteRoutes');
  const placementRoutes = require('./routes/placementRoutes');
  const goalRoutes = require('./routes/goalRoutes');

  // Register routes
  app.use('/api/auth', authRoutes);
  app.use('/api/topics', topicRoutes);
  app.use('/api/applications', applicationRoutes);
  app.use('/api/interviews', interviewRoutes);
  app.use('/api/goals', goalRoutes);
  app.use('/api/activity', activityRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/dsa', dsaRoutes);
  app.use('/api/java', javaRoutes);
  app.use('/api/sql', sqlRoutes);
  app.use('/api/questions', questionRoutes);
  app.use('/api/study', studyRoutes);
  app.use('/api/mock-interviews', mockInterviewRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/predictor', predictorRoutes);
  app.use('/api/resumes', resumeRoutes);
  app.use('/api/experiences', experienceRoutes);
  app.use('/api/company', companyRoutes);
  app.use('/api/companies', companyTrackerRoutes);
  app.use('/api/notes', noteRoutes);
  app.use('/api/placement', placementRoutes);
  app.use('/api/study-plans', studyPlanRoutes);

   // Global Error Handler Middleware
  app.use(errorMiddleware);

  // Handle unknown API routes
  app.use((req, res) => {
    res.status(404).json({ message: "API route not found" });
  });

  // React SPA fallback (IMPORTANT FOR REAL APP)
  app.use((req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });

    const port = process.env.PORT || 5000;

  app.listen(port, () => {
    logger.info(`Server running on port ${port} (Production Mode)`);
  });
};

startServer();