# Interview Preparation Tracker - Production-Ready MERN Application

A comprehensive full-stack application for students preparing for placements and software engineering interviews. Built with modern tech stack and production-ready features.

##✨ Features

### 1. **Authentication Module**
- User Registration & Login
- JWT Authentication
- Protected Routes
- Profile Management
- Change Password

### 2. **DSA Tracker**
- Add/Edit/Delete Questions
- Track by Topic, Difficulty, Platform
- Mark Solved Questions
- Topic-wise Analytics
- Difficulty Distribution Charts

### 3. **Core Java Tracker**
- Track 15+ Java Topics (OOP, Collections, Multithreading, etc.)
- Progress Percentage
- Confidence Ratings
- Resource Management

### 4. **SQL Tracker**
- Track 10 SQL Topics
- Progress Tracking
- Practice Query Counter
- Success Rate Monitoring

### 5. **Aptitude Tracker**
- Quantitative Aptitude
- Logical Reasoning
- Verbal Ability
- Accuracy Tracking

### 6. **Revision Scheduler**
- Adaptive Revision Schedule
- Spaced Repetition (SM-2 Algorithm)
- Confidence-based Scheduling
- Upcoming & Due Revisions

### 7. **Mock Interviews**
- Category-based Interviews (DSA, Java, SQL, HR)
- Question-by-question Interaction
- Timer Tracking
- Scoring System (Technical, Communication, Confidence)
- Interview History

### 8. **Gamification System**
- XP Points System
- Level Progression (1-5 Levels)
- Achievements
- Leaderboard
- Daily Challenges

### 9. **Analytics & Dashboard**
- Weekly/Monthly Progress Charts
- Topic Distribution
- Placement Readiness Radar Chart
- Performance Metrics

### 10. **Study Planning**
- AI-generated Study Plans
- Weekly/Monthly Roadmaps
- Emergency Mode Planning
- Progress Tracking

### 11. **Company Preparation Hub**
- 9 Major Companies (Infosys, TCS, Wipro, etc.)
- Topic-specific Checklists
- Readiness Percentage
- Resource Links

### 12. **Interview Experiences**
- Community Sharing
- Filter by Company & Difficulty
- Helpful Upvotes
- Search Functionality

### 13. **Placement Predictor**
- Service Company Readiness
- Product Company Readiness
- Smart Recommendations
- Readiness Score

## 🏗️ Project Structure

```
├── backend/
│   ├── models/                 # MongoDB Schemas
│   │   ├── User.js
│   │   ├── DSAQuestion.js
│   │   ├── JavaTopic.js
│   │   ├── SQLTopic.js
│   │   ├── AptitudeTopic.js
│   │   ├── MockInterview.js
│   │   ├── RevisionSchedule.js
│   │   ├── Achievement.js
│   │   ├── InterviewExperience.js
│   │   ├── CompanyPrep.js
│   │   ├── StudyPlan.js
│   │   ├── Note.js
│   │   ├── Flashcard.js
│   │   └── DailyChallenge.js
│   ├── controllers/            # Business Logic
│   │   ├── authController.js
│   │   ├── dsaController.js
│   │   ├── javaController.js
│   │   ├── sqlController.js
│   │   ├── aptitudeController.js
│   │   ├── interviewController.js
│   │   ├── dashboardController.js
│   │   ├── achievementController.js
│   │   ├── experienceController.js
│   │   ├── companyController.js
│   │   ├── studyPlanController.js
│   │   ├── dailyChallengeController.js
│   │   ├── leaderboardController.js
│   │   └── placementController.js
│   ├── routes/                 # API Endpoints
│   ├── middleware/             # Auth & Error Handling
│   ├── utils/                  # Helper Functions
│   ├── config/                 # Database Config
│   └── server.js               # Entry Point
│
├── frontend/
│   ├── src/
│   │   ├── pages/              # React Pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DSATracker.jsx
│   │   │   ├── JavaTracker.jsx
│   │   │   ├── SQLTracker.jsx
│   │   │   ├── AptitudeTracker.jsx
│   │   │   ├── MockInterviews.jsx
│   │   │   ├── RevisionScheduler.jsx
│   │   │   ├── StudyPlan.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   ├── PlacementReadiness.jsx
│   │   │   └── Profile.jsx
│   │   ├── components/         # Reusable Components
│   │   ├── context/            # React Context (Auth)
│   │   ├── layouts/            # Layout Components
│   │   ├── services/           # API Services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas Account
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with:
# MONGODB_URI=your_mongodb_atlas_connection_string
# JWT_SECRET=your_secure_secret_key
# PORT=5000
# CORS_ORIGIN=http://localhost:5173

# Start server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (if needed)
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`
The backend will be available at `http://localhost:5000`

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-prep
JWT_SECRET=your_very_secure_jwt_secret_key_12345
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
API_VERSION=v1
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### DSA Tracker
- `POST /api/dsa` - Create question
- `GET /api/dsa` - Get all questions
- `GET /api/dsa/analytics` - Get analytics
- `PUT /api/dsa/:id` - Update question
- `DELETE /api/dsa/:id` - Delete question

### Java Tracker
- `POST /api/java` - Create/Update topic
- `GET /api/java` - Get all topics
- `GET /api/java/summary` - Get summary
- `PUT /api/java/:id` - Update topic
- `DELETE /api/java/:id` - Delete topic

### SQL Tracker
- `POST /api/sql` - Create/Update topic
- `GET /api/sql` - Get all topics
- `PUT /api/sql/:id` - Update topic
- `DELETE /api/sql/:id` - Delete topic

### Aptitude Tracker
- `POST /api/aptitude` - Create/Update topic
- `GET /api/aptitude` - Get all topics
- `DELETE /api/aptitude/:id` - Delete topic

### Mock Interviews
- `POST /api/interviews` - Start interview
- `GET /api/interviews/history` - Get history
- `GET /api/interviews/stats` - Get statistics
- `PUT /api/interviews/:id/complete` - Complete interview

### Dashboard
- `GET /api/dashboard` - Get dashboard data
- `GET /api/dashboard/analytics/weekly` - Weekly analytics
- `GET /api/dashboard/analytics/monthly` - Monthly analytics
- `GET /api/dashboard/analytics/topics` - Topic distribution
- `GET /api/dashboard/analytics/readiness-radar` - Readiness radar

### Revisions
- `GET /api/revisions/due` - Get due revisions
- `GET /api/revisions/upcoming` - Get upcoming revisions
- `PUT /api/revisions/:id/complete` - Complete revision

### Achievements
- `GET /api/achievements` - Get achievements
- `POST /api/achievements/check` - Check for new achievements

### Leaderboard
- `GET /api/leaderboard` - Get public leaderboard
- `GET /api/leaderboard/my-rank` - Get user rank
- `GET /api/leaderboard/level-info` - Get level information

### Placement
- `GET /api/placement/readiness` - Get readiness score
- `GET /api/placement/predict` - Predict placement

### Company Prep
- `POST /api/company` - Create company prep
- `GET /api/company` - Get all company preps
- `PUT /api/company/:id/checklist` - Update checklist

### Interview Experiences
- `POST /api/experiences` - Share experience
- `GET /api/experiences` - Get experiences
- `PUT /api/experiences/:id/upvote` - Upvote experience

### Study Plans
- `POST /api/study-plans` - Generate study plan
- `GET /api/study-plans` - Get all plans
- `GET /api/study-plans/active` - Get active plan

### Daily Challenges
- `GET /api/daily-challenges/today` - Get today's challenge
- `POST /api/daily-challenges/:id/complete` - Complete challenge

## 🎨 UI Features

- **Dark Mode** - Modern dark theme with glassmorphism
- **Responsive Design** - Mobile, tablet, desktop
- **Real-time Updates** - Live progress tracking
- **Interactive Charts** - Recharts for analytics
- **Smooth Animations** - Tailwind CSS animations
- **Professional UI** - Inspired by GitHub, LeetCode, Notion

## 📊 Key Metrics Tracked

- Total Questions Solved
- Current & Longest Streak
- Study Hours
- XP Points & Level
- Mock Interviews Completed
- Placement Readiness Score
- Topic-wise Progress
- Difficulty Distribution
- Accuracy Percentage
- Revision Schedule

## 🏆 Gamification System

### XP Rewards
- Easy DSA Question: 5 XP
- Medium DSA Question: 10 XP
- Hard DSA Question: 20 XP
- Daily Challenge: 50 XP
- Mock Interview: 100 XP

### Levels
1. **Beginner** (0-500 XP)
2. **Learner** (500-1500 XP)
3. **Coder** (1500-3000 XP)
4. **Problem Solver** (3000-5000 XP)
5. **Placement Ready** (5000+ XP)

### Achievements
- First Question Solved
- 100 Questions Solved
- 30 Day Streak
- SQL Master
- Java Expert
- Placement Warrior

## 📱 Placement Readiness Calculation

```
Readiness Score = (DSA Progress × 40%) + (Java Progress × 20%) + 
                  (SQL Progress × 15%) + (Mock Interviews × 15%) + 
                  (Consistency/Streak × 10%)
```

## 🔐 Security Features

- JWT Token-based Authentication
- Password Hashing with bcryptjs
- Protected API Routes
- CORS Configuration
- Input Validation
- Error Handling Middleware

## 📦 Dependencies

### Backend
- express.js
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv

### Frontend
- react
- react-router-dom
- tailwind-css
- recharts
- axios (for API calls)

## 🚢 Deployment

### Backend (Railway/Render)

```bash
# Push to Git
git add .
git commit -m "Deploy application"
git push

# On Railway/Render:
# 1. Connect GitHub repo
# 2. Set Environment Variables
# 3. Deploy (automatic on push)
```

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect GitHub repo to Vercel for auto-deployment
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Create pull requests
- Improve documentation

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Contact the development team

## 🎯 Future Enhancements

- [ ] AI-powered Interview Questions
- [ ] Resume Upload & ATS Analysis
- [ ] Video Mock Interviews
- [ ] Peer-to-peer Mentoring
- [ ] Company-specific Practice Tests
- [ ] Mobile App (React Native)
- [ ] Real-time Notifications
- [ ] Integration with LeetCode/HackerRank

## 👥 Team

Built with ❤️ by the Interview Preparation Tracker Team

---

**Last Updated:** June 2026
**Version:** 1.0.0
