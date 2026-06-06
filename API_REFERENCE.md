# 📡 API Reference Guide

Complete documentation of all 100+ REST API endpoints for Interview Preparation Tracker.

## Base URL

**Development**: `http://localhost:5000/api`  
**Production**: `https://your-domain.com/api`

## Authentication

All endpoints (except auth) require JWT token in header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Getting a Token

```bash
# Register
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

# Returns: { token, user }

# Login
POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

# Returns: { token, user }
```

---

## 🔐 Authentication Endpoints

### Register
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

Response: 201 Created
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "level": 1,
    "totalXP": 0
  }
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": { ... }
}
```

### Get Profile
```
GET /auth/profile
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "level": 2,
    "totalXP": 500,
    "currentStreak": 5,
    "totalQuestionsSolved": 50
  }
}
```

### Update Profile
```
PUT /auth/profile
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "Jane Doe",
  "preferredTopics": ["Arrays", "Trees"]
}

Response: 200 OK
{
  "success": true,
  "user": { ... }
}
```

### Change Password
```
PUT /auth/change-password
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "currentPassword": "oldpass123",
  "newPassword": "newpass456"
}

Response: 200 OK
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 📊 DSA Tracker Endpoints

### Create Question
```
POST /dsa
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "title": "Two Sum",
  "description": "Find two numbers...",
  "topic": "Arrays",
  "difficulty": "Easy",
  "platform": "LeetCode",
  "link": "https://leetcode.com/problems/two-sum/"
}

Response: 201 Created
{
  "success": true,
  "question": { ... }
}
```

### Get Questions
```
GET /dsa?topic=Arrays&difficulty=Easy&solved=true
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "questions": [ ... ]
}
```

### Update Question
```
PUT /dsa/:id
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "isSolved": true,
  "confidenceRating": 8
}

Response: 200 OK
{
  "success": true,
  "question": { ... }
}
```

### Delete Question
```
DELETE /dsa/:id
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "message": "Question deleted"
}
```

### Get Analytics
```
GET /dsa/analytics
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "analytics": {
    "totalQuestions": 50,
    "solvedQuestions": 35,
    "successRate": 70,
    "byTopic": { "Arrays": 10, "Trees": 8 },
    "byDifficulty": { "Easy": 25, "Medium": 20, "Hard": 5 }
  }
}
```

---

## ☕ Java Tracker Endpoints

### Create/Update Topic
```
POST /java
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "topicName": "Collections",
  "progressPercentage": 60,
  "confidenceRating": 7,
  "resources": [
    {
      "title": "Collections Tutorial",
      "link": "https://...",
      "type": "video"
    }
  ]
}

Response: 201 Created
{
  "success": true,
  "topic": { ... }
}
```

### Get Topics
```
GET /java
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "topics": [ ... ]
}
```

### Get Progress Summary
```
GET /java/summary
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "summary": {
    "totalTopics": 15,
    "completedTopics": 8,
    "averageProgress": 65,
    "averageConfidence": 7.2
  }
}
```

### Update Topic
```
PUT /java/:id
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "progressPercentage": 80,
  "isCompleted": true
}

Response: 200 OK
{
  "success": true,
  "topic": { ... }
}
```

### Delete Topic
```
DELETE /java/:id
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "message": "Topic deleted"
}
```

---

## 🗄️ SQL Tracker Endpoints

Same pattern as Java Tracker with SQL-specific topics:
- `POST /sql` - Create/Update SQL topic
- `GET /sql` - Get all SQL topics
- `GET /sql/summary` - Get summary
- `PUT /sql/:id` - Update SQL topic
- `DELETE /sql/:id` - Delete SQL topic

---

## 🧮 Aptitude Tracker Endpoints

### Create Topic
```
POST /aptitude
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "category": "Quantitative",
  "topicName": "Percentages",
  "questionsAttempted": 20,
  "questionsCorrect": 16
}

Response: 201 Created
{
  "success": true,
  "topic": { ... }
}
```

### Get Topics by Category
```
GET /aptitude?category=Quantitative
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "topics": [ ... ]
}
```

### Get Summary
```
GET /aptitude/summary
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "summary": { ... }
}
```

### Update Topic
```
PUT /aptitude/:id
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "topic": { ... }
}
```

### Delete Topic
```
DELETE /aptitude/:id
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "message": "Topic deleted"
}
```

---

## 🎤 Mock Interview Endpoints

### Start Interview
```
POST /interviews/start
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "category": "Core Java",
  "difficulty": "Medium"
}

Response: 201 Created
{
  "success": true,
  "interview": {
    "_id": "...",
    "category": "Core Java",
    "startTime": "2026-06-15T10:00:00Z",
    "questions": [ ... ]
  }
}
```

### Add Question Response
```
POST /interviews/:id/response
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "questionIndex": 0,
  "userAnswer": "Your answer here"
}

Response: 200 OK
{
  "success": true,
  "message": "Response recorded"
}
```

### Complete Interview
```
POST /interviews/:id/complete
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "feedback": "Good effort"
}

Response: 200 OK
{
  "success": true,
  "interview": {
    "_id": "...",
    "status": "completed",
    "scores": {
      "technicalScore": 75,
      "communicationScore": 80,
      "confidenceScore": 70,
      "overallScore": 75
    }
  }
}
```

### Get Interview History
```
GET /interviews
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "interviews": [ ... ]
}
```

### Get Stats
```
GET /interviews/stats
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "stats": {
    "totalInterviews": 10,
    "averageScore": 75,
    "bestScore": 90,
    "byCategory": { "Java": 5, "DSA": 3, "SQL": 2 }
  }
}
```

---

## 📅 Revision Scheduler Endpoints

### Get Due Revisions
```
GET /revisions/due
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "revisions": [ ... ]
}
```

### Get Upcoming Revisions
```
GET /revisions/upcoming
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "revisions": [ ... ]
}
```

### Complete Revision
```
POST /revisions/:id/complete
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "confidenceRating": 8
}

Response: 200 OK
{
  "success": true,
  "revision": { ... }
}
```

### Skip Revision
```
POST /revisions/:id/skip
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "message": "Revision skipped"
}
```

### Get Stats
```
GET /revisions/stats
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "stats": {
    "totalDue": 5,
    "totalUpcoming": 10,
    "completionRate": 80
  }
}
```

---

## 💾 Flashcard Endpoints

### Create Deck
```
POST /flashcards/decks
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "Java Collections",
  "description": "Learn Java Collections",
  "category": "Java"
}

Response: 201 Created
{
  "success": true,
  "deck": { ... }
}
```

### Get Decks
```
GET /flashcards/decks
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "decks": [ ... ]
}
```

### Create Flashcard
```
POST /flashcards
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "deckId": "...",
  "question": "What is HashMap?",
  "answer": "HashMap is a hash table based implementation..."
}

Response: 201 Created
{
  "success": true,
  "flashcard": { ... }
}
```

### Get Flashcards for Review
```
GET /flashcards/review
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "flashcards": [ ... ]
}
```

### Update Flashcard Review
```
PUT /flashcards/:id/review
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "quality": 4
}

Response: 200 OK
{
  "success": true,
  "flashcard": { ... }
}
```

---

## 📝 Notes Endpoints

### Create Note
```
POST /notes
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "title": "Important Concepts",
  "content": "...",
  "category": "Java",
  "tags": ["oop", "inheritance"],
  "color": "blue"
}

Response: 201 Created
{
  "success": true,
  "note": { ... }
}
```

### Get Notes
```
GET /notes?category=Java&isPinned=true
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "notes": [ ... ]
}
```

### Update Note
```
PUT /notes/:id
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "title": "Updated Title"
}

Response: 200 OK
{
  "success": true,
  "note": { ... }
}
```

### Delete Note
```
DELETE /notes/:id
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "message": "Note deleted"
}
```

### Pin Note
```
POST /notes/:id/pin
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "note": { ... }
}
```

---

## 🏆 Achievement Endpoints

### Get Achievements
```
GET /achievements
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "achievements": [ ... ]
}
```

### Check Achievements
```
POST /achievements/check
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "newAchievements": [ ... ]
}
```

---

## 📊 Dashboard Endpoints

### Get Dashboard
```
GET /dashboard
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "dashboard": {
    "userStats": { ... },
    "recentActivity": [ ... ],
    "readinessScore": 75,
    "streakInfo": { ... }
  }
}
```

### Get Weekly Analytics
```
GET /dashboard/analytics/weekly
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "analytics": { ... }
}
```

### Get Monthly Analytics
```
GET /dashboard/analytics/monthly
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "analytics": { ... }
}
```

### Get Topic Distribution
```
GET /dashboard/analytics/topics
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "topics": { ... }
}
```

---

## 🎯 Leaderboard Endpoints

### Get Leaderboard
```
GET /leaderboard?limit=10&page=1
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "leaderboard": [ ... ],
  "total": 100
}
```

### Get User Rank
```
GET /leaderboard/rank
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "rank": 15,
  "totalUsers": 100
}
```

### Get Level Info
```
GET /leaderboard/levels
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "levels": [ ... ]
}
```

---

## 🎯 Daily Challenge Endpoints

### Get Today Challenge
```
GET /daily-challenges/today
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "challenge": { ... }
}
```

### Complete Task
```
POST /daily-challenges/tasks/:taskIndex/complete
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "xpEarned": 50
}
```

### Complete Challenge
```
POST /daily-challenges/complete
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "totalXP": 200
}
```

---

## 🏢 Company Preparation Endpoints

### Get/Create Prep
```
GET /company/:companyId/prep
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "prep": { ... }
}
```

### Update Checklist Item
```
PUT /company/:companyId/prep/:itemId
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "completed": true
}

Response: 200 OK
{
  "success": true,
  "prep": { ... }
}
```

---

## 🎓 Study Plan Endpoints

### Generate Plan
```
POST /study-plans/generate
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "planType": "Weekly",
  "placementDate": "2026-12-31",
  "skillLevel": "Intermediate"
}

Response: 201 Created
{
  "success": true,
  "plan": { ... }
}
```

### Get Active Plan
```
GET /study-plans/active
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "plan": { ... }
}
```

### Complete Week
```
POST /study-plans/:id/weeks/:weekNumber/complete
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "plan": { ... }
}
```

---

## 🤝 Interview Experience Endpoints

### Create Experience
```
POST /experiences
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "company": "Amazon",
  "role": "SDE 1",
  "difficulty": "Hard",
  "experience": "Great interview experience",
  "interviewerAttitude": "Very Friendly",
  "overallExperience": 4,
  "result": "Selected"
}

Response: 201 Created
{
  "success": true,
  "experience": { ... }
}
```

### Get Experiences
```
GET /experiences?company=Amazon&page=1
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "experiences": [ ... ]
}
```

### Upvote Experience
```
POST /experiences/:id/upvote
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "upvotes": 42
}
```

---

## 🔮 Placement Prediction Endpoints

### Get Readiness
```
GET /placement/readiness
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "readiness": {
    "dsaReadiness": 75,
    "javaReadiness": 80,
    "sqlReadiness": 70,
    "overallReadiness": 75
  }
}
```

### Predict Placement
```
GET /placement/predict
Authorization: Bearer TOKEN

Response: 200 OK
{
  "success": true,
  "prediction": {
    "serviceCompanyReadiness": 80,
    "productCompanyReadiness": 70,
    "recommendation": "Ready for service companies"
  }
}
```

---

## ❌ Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "status": 400
}
```

### Common Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (no access)
- **404**: Not Found
- **500**: Server Error

---

## 📚 Example: Complete Flow

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Get token from response

# 2. Add DSA Question
curl -X POST http://localhost:5000/api/dsa \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Two Sum",
    "topic": "Arrays",
    "difficulty": "Easy",
    "platform": "LeetCode"
  }'

# 3. Get Dashboard
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer TOKEN"

# 4. Start Mock Interview
curl -X POST http://localhost:5000/api/interviews/start \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Core Java",
    "difficulty": "Medium"
  }'
```

---

**API Reference Version**: 1.0.0  
**Last Updated**: June 2026
