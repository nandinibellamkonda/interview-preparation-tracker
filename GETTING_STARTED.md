# 🚀 Getting Started - Interview Preparation Tracker

**Start your placement preparation journey in 5 minutes!**

## ⚡ Quick Start (Windows)

### Step 1: Automatic Setup (Recommended)
Double-click `setup.bat` to automatically install everything:
```
setup.bat
```

### Step 2: Configure Backend
Edit `backend/.env` with your MongoDB connection:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/interview-prep
JWT_SECRET=generate_a_random_string_here
```

### Step 3: Start Services
Open **two terminals** (Command Prompt or PowerShell):

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
You'll see: `Server listening in production mode on port 5000`

**Terminal 2 - Frontend Server:**
```bash
cd frontend
npm run dev
```
You'll see: `VITE v... ready in ... ms`

### Step 4: Access Application
Open your browser: **http://localhost:5173**

---

## ⚡ Quick Start (macOS/Linux)

### Step 1: Automatic Setup
```bash
bash setup.sh
```

### Step 2: Configure Backend
```bash
nano backend/.env
# Or use your preferred editor
```

Update:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/interview-prep
JWT_SECRET=generate_a_random_string_here
```

### Step 3: Start Services
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend (open new terminal)
cd frontend && npm run dev
```

### Step 4: Access Application
Open: **http://localhost:5173**

---

## 📋 Manual Setup Steps

If automatic setup doesn't work, follow these steps:

### 1. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB connection string
# Then start server
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🗄️ MongoDB Atlas Setup (Free)

### 1. Create Account
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Sign up with email
- Verify email

### 2. Create Cluster
- Click "Build a Database"
- Select **Free Tier (M0)** - completely free
- Choose your region
- Wait for cluster to initialize (5-10 minutes)

### 3. Create Database User
- Go to "Database Access"
- Click "Add New Database User"
- Set username: `interview_user`
- Set password (save it!)
- Click "Add User"

### 4. Allow Network Access
- Go to "Network Access"
- Click "Add IP Address"
- Select "Allow Access from Anywhere" (for development)
- Click "Confirm"

### 5. Get Connection String
- Click "Connect"
- Choose "Connect your application"
- Copy the connection string
- Replace `PASSWORD` with your actual password
- Replace `interview-prep` with database name
- Paste into `backend/.env` as `MONGODB_URI`

**Connection String Format:**
```
mongodb+srv://interview_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/interview-prep?retryWrites=true&w=majority
```

---

## 🧪 Testing Your Setup

### Test Backend API
```bash
# In your terminal, test the API
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# You should get a response with token and user data
```

### Test Frontend
1. Go to http://localhost:5173
2. Click "Create Account"
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm: password123
4. Click "Create Account"
5. You should be logged in and see the dashboard

### Check Logs
- **Backend**: Check terminal for `Connected to MongoDB Atlas`
- **Frontend**: Check browser console (F12) for API calls

---

## 📁 Project Structure Quick Reference

```
interview-prep-tracker/
├── backend/              ← Node.js server
│   ├── models/          ← Database schemas
│   ├── controllers/     ← Business logic
│   ├── routes/          ← API endpoints
│   ├── server.js        ← Start here
│   └── .env             ← Your configuration
│
├── frontend/            ← React app
│   ├── src/
│   │   ├── pages/       ← Page components
│   │   ├── components/  ← UI components
│   │   └── services/    ← API calls
│   └── vite.config.js   ← Vite config
│
├── README_COMPLETE.md   ← Full documentation
├── DEPLOYMENT_GUIDE.md  ← How to deploy
└── PROJECT_SUMMARY.md   ← Project overview
```

---

## 🔧 Troubleshooting

### Issue: "MongoDB Connection Failed"
**Solution:**
1. Check MongoDB URI in `.env`
2. Verify username and password are correct
3. Check IP is whitelisted on MongoDB Atlas
4. Wait a few minutes for changes to take effect

### Issue: "Port 5000 Already in Use"
**Solution:**
```bash
# Find and kill process using port 5000
lsof -i :5000        # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Then kill it or use different port in .env
```

### Issue: "Cannot find module"
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Frontend shows 404 or cannot connect to backend"
**Solution:**
1. Check backend is running (port 5000)
2. Check frontend .env has correct API URL
3. Check CORS is not blocking requests
4. Open browser console (F12) to see actual error

### Issue: "CORS Error"
**Solution:**
1. Ensure backend CORS_ORIGIN is set correctly
2. For development: Set to `http://localhost:5173`
3. Restart backend after changing

---

## 📚 Using the Application

### 1. Register
- Sign up with email and password
- Confirm registration
- You're logged in!

### 2. Dashboard
- View your statistics
- See recent activity
- Check readiness score

### 3. DSA Tracker
- Add coding problems you solved
- Track by topic and difficulty
- See your progress

### 4. Java/SQL/Aptitude
- Track learning progress
- Mark topics as completed
- See analytics

### 5. Mock Interviews
- Practice interviews
- Get scored
- Review feedback

### 6. Study Plan
- Generate AI study plan
- Follow weekly schedule
- Track progress

### 7. More Features
- Daily challenges
- Leaderboard
- Achievements
- Company prep guides

---

## 🔐 Security Notes

### Development
- JWT Secret in `.env` is just for development
- MongoDB connection is local/testing
- No sensitive data in code

### Before Deployment
- Generate strong JWT secret:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- Use environment variables for all secrets
- Never commit `.env` file
- Enable HTTPS on production

---

## 📱 Browser Compatibility

✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+  

---

## 🆘 Getting Help

### Check Documentation
1. `README_COMPLETE.md` - Full feature list
2. `DEPLOYMENT_GUIDE.md` - Deployment steps
3. `PROJECT_SUMMARY.md` - Project details

### API Errors
- Check browser console (F12)
- Check terminal logs for backend errors
- Look at network tab in DevTools

### Common Errors
- **401 Unauthorized**: Login again, token expired
- **404 Not Found**: API endpoint doesn't exist
- **500 Server Error**: Backend issue, check logs
- **Cannot connect**: Backend not running

---

## ✨ Next Steps

### After Setup Works
1. Register an account
2. Add DSA questions
3. Track Java topics
4. Try mock interview
5. Check leaderboard

### Learning Path
1. Explore all features
2. Read source code
3. Modify and extend
4. Deploy to cloud
5. Share with friends

### Deployment
- Follow `DEPLOYMENT_GUIDE.md` for cloud deployment
- Free tier options: Railway, Render, Vercel, Netlify

---

## 🎯 Quick Command Reference

```bash
# Backend
cd backend
npm install      # Install dependencies
npm run dev      # Start development server
npm start        # Start production server

# Frontend
cd frontend
npm install      # Install dependencies
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build

# Useful Commands
node -v          # Check Node version
npm -v           # Check npm version
git status       # Check git status
git log          # View commit history
```

---

## 🚀 Ready?

You're all set! Start the servers and begin your placement preparation journey.

**Frontend**: http://localhost:5173  
**Backend**: http://localhost:5000  
**API Docs**: Built into code

---

**Happy coding! 🎉**

**Version**: 1.0.0  
**Last Updated**: June 2026
