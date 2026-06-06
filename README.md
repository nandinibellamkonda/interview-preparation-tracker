# 📚 Interview Preparation Tracker

**A comprehensive MERN application for placement interview preparation, mock interviews, and tracking progress.**

> ⚡ **Quick Start**: Double-click `setup.bat` (Windows) or run `bash setup.sh` (macOS/Linux) to get started in 5 minutes!

## 📖 Documentation Guide

**Choose where to start:**

| Document | Purpose | Best For |
|----------|---------|----------|
| [GETTING_STARTED.md](GETTING_STARTED.md) | 5-minute local setup guide | **First-time users** |
| [README_COMPLETE.md](README_COMPLETE.md) | Complete feature documentation | Learning about all features |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Deploy to production | Going live |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Project overview & stats | Understanding the project |
| This file | Quick reference | Navigation |

## ✨ Key Features

### 🎯 Comprehensive Tracking
- **DSA Questions**: Track LeetCode/HackerRank problems
- **Core Java**: 15+ topics with progress tracking
- **SQL**: Database concepts and practice
- **Aptitude**: Quantitative, Logical, Verbal reasoning

### 🎮 Gamification
- **XP System**: Earn points for progress
- **5 Levels**: From Level 1 to Level 5
- **Achievements**: Unlock 9+ badges
- **Daily Challenges**: Get XP rewards
- **Leaderboard**: Compete with peers

### 📊 Analytics & Planning
- **Dashboard**: Real-time metrics
- **Study Plans**: AI-generated roadmaps
- **Weekly Analytics**: Track progress
- **Placement Readiness**: Predict success rate

### 🎤 Mock Interviews
- **Category-Based**: Java, SQL, DSA, HR
- **Multi-Scoring**: Technical, Communication, Confidence
- **Feedback**: Personalized suggestions
- **History**: Review past interviews

### 💡 Smart Learning
- **Spaced Repetition**: SM-2 Algorithm
- **Revision Scheduler**: Auto-scheduled reviews
- **Flashcards**: Create custom decks
- **Notes**: Organize study material

### 🏢 Company Preparation
- **9 Major Companies**: Infosys, TCS, Wipro, Amazon, Google, etc.
- **Topic Checklists**: Know what to focus on
- **Experience Sharing**: Learn from others
- **Readiness Score**: Know when you're ready

## 🏗️ Tech Stack

- **Backend**: Express.js, Node.js, Mongoose, MongoDB Atlas, JWT, bcrypt
- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Database**: MongoDB Atlas (cloud)
- **Auth**: JWT tokens with bcrypt password hashing
- **Deployment**: Railway/Render (Backend), Vercel/Netlify (Frontend)

## 🚀 Quick Start

### Windows
```bash
setup.bat
```

### macOS/Linux
```bash
bash setup.sh
```

Then edit `backend/.env` with your MongoDB connection and run:
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Open: **http://localhost:5173**

## 📁 Project Structure

```
interview-prep-tracker/
├── backend/              (Node.js + Express API)
│   ├── models/          (14 MongoDB schemas)
│   ├── controllers/     (14 feature controllers)
│   ├── routes/          (17 API route files)
│   ├── server.js
│   └── .env
│
├── frontend/            (React + Vite)
│   ├── src/pages/       (Feature pages)
│   ├── src/components/  (UI components)
│   ├── src/services/    (API client)
│   └── vite.config.js
│
├── GETTING_STARTED.md   (5-min setup)
├── README_COMPLETE.md   (Full features)
├── DEPLOYMENT_GUIDE.md  (Deploy to cloud)
└── PROJECT_SUMMARY.md   (Project details)
```

### 3. Install & Run

```bash
npm install
npm start
```

Server runs on `http://localhost:5000`

## API Routes (All Require JWT)

### Auth
- `POST /api/auth/register` � Create account
- `POST /api/auth/login` � Login (returns JWT)
- `GET /api/auth/profile` � Get dashboard data
- `PATCH /api/auth/profile` � Update profile

### Topics
- `GET /api/topics` � List DSA topics
- `POST /api/topics` � Create topic
- `PUT /api/topics/:id` � Update
- `DELETE /api/topics/:id` � Delete

### Applications
- `GET /api/applications` � List applications
- `POST /api/applications` � Create
- `PUT /api/applications/:id` � Update
- `DELETE /api/applications/:id` � Delete

### Interviews
- `GET /api/interviews` � List interviews
- `POST /api/interviews` � Create
- `PUT /api/interviews/:id` � Update
- `DELETE /api/interviews/:id` � Delete

### Activity
- `GET /api/activity` � Activity feed

## Project Structure

```
preppilot-ai/
+-- backend/
�   +-- config/db.js
�   +-- controllers/
�   +-- models/
�   +-- middleware/
�   +-- routes/
�   +-- utils/
�   +-- server.js
�   +-- .env
+-- frontend/
�   +-- pages/ (login, register, dashboard, tracker, applications, interviews, profile)
�   +-- css/ (auth, dashboard styles)
�   +-- js/ (api, auth, dashboard, tracker, applications, interviews, profile)
�   +-- assets/
+-- package.json
```

## Authentication Flow

1. **Registration**: Account created, password bcrypt hashed, JWT issued
2. **Login**: Credentials validated, JWT token returned
3. **Protected Routes**: Bearer token required in Authorization header
4. **Session**: Persisted in localStorage, valid for 7 days
5. **Logout**: Clear token, redirect to login

## Quality Assurance

? Zero demo mode � all data from MongoDB
? Real authentication � bcrypt + JWT
? All routes functional and tested
? Error handling with proper HTTP status codes
? Responsive design (mobile/tablet/desktop)
? Session persistence across refresh
? No console errors
? No undefined variables or broken imports
? Browser password manager compatible
? Production-ready code

## Deployment

### Heroku / Railway / Render

Set environment variables:
```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_production_secret
NODE_ENV=production
```

Deploy via platform CLI or git push.

## Troubleshooting

**MongoDB Connection Error**
- Verify MONGO_URI format
- Check IP whitelist in Atlas
- Test credentials

**JWT Error**
- Ensure JWT_SECRET is set
- Check token expiration (7 days)
- Verify header format: `Bearer <token>`

**Port in Use**
- Change PORT in .env
- Or kill process: `kill -9 $(lsof -t -i :5000)`

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## Future Enhancements

- Drag-and-drop Kanban board
- Mock interview video recording
- AI-powered recommendations
- Email notifications
- Resume parsing
- Leaderboard system

---

**Version**: 1.0.0  
**Status**: Production Ready ?  
**Last Updated**: June 2026
