# 🚀 Deployment Guide - Interview Preparation Tracker

Complete step-by-step guide to deploy the production-ready MERN application to cloud platforms.

## 📋 Deployment Checklist

- [ ] Build frontend
- [ ] Configure environment variables
- [ ] Setup MongoDB Atlas
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Setup CI/CD
- [ ] Configure domain
- [ ] Enable HTTPS
- [ ] Setup monitoring

## 🗄️ MongoDB Atlas Setup

### 1. Create MongoDB Atlas Cluster

```bash
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account (or login)
3. Create a new project "Interview-Tracker"
4. Build a new cluster (M0 free tier recommended)
5. Wait for cluster to initialize (5-10 minutes)
```

### 2. Create Database User

```bash
1. Go to Database Access
2. Click "Add New Database User"
3. Username: interview_user
4. Auto-generate password (or set custom)
5. Built-in Role: "Atlas admin"
6. Save password securely
```

### 3. Configure Network Access

```bash
1. Go to Network Access
2. Click "Add IP Address"
3. Select "Allow access from anywhere" (for development)
4. For production: Add specific IP addresses
5. Confirm
```

### 4. Get Connection String

```bash
1. Click "Connect"
2. Select "Connect your application"
3. Driver: Node.js, Version: 4.0 or later
4. Copy the connection string:
   mongodb+srv://interview_user:PASSWORD@cluster0.xxxxx.mongodb.net/interview-prep?retryWrites=true&w=majority

5. Replace PASSWORD with your actual password
6. Save as MONGODB_URI in .env
```

## 🚢 Backend Deployment (Railway)

### 1. Prepare Backend

```bash
cd backend

# Ensure package.json has start script
# Should have: "start": "node server.js"

# Create .env file with production values
cp .env.example .env

# Update .env:
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://interview_user:PASSWORD@cluster0.xxxxx.mongodb.net/interview-prep
JWT_SECRET=your_very_secure_jwt_secret_key_generate_random_string
CORS_ORIGIN=https://your-domain.com
FRONTEND_URL=https://your-domain.com
```

### 2. Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Interview Preparation Tracker"

# Add GitHub remote
git remote add origin https://github.com/yourusername/interview-tracker.git

# Push
git branch -M main
git push -u origin main
```

### 3. Deploy on Railway

```bash
# Method 1: Using Railway UI
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Select your repository
6. Select "backend" directory (or don't if it's at root)
7. Add environment variables
8. Deploy

# Method 2: Using Railway CLI
npm install -g @railway/cli
railway login
railway init
railway up
```

### 4. Configure Environment Variables on Railway

In Railway Dashboard:
1. Go to your project
2. Click "Variables"
3. Add each variable:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://interview_user:PASSWORD@cluster0.xxxxx.mongodb.net/interview-prep
JWT_SECRET=generate_random_secure_string
CORS_ORIGIN=https://interview-tracker.netlify.app
FRONTEND_URL=https://interview-tracker.netlify.app
```

### 5. Get Backend URL

Once deployed:
1. Railway generates a URL like: `https://interview-tracker-production-xxxx.railway.app`
2. Save this URL for frontend configuration
3. Update CORS_ORIGIN in backend if needed

## 🎨 Frontend Deployment (Vercel)

### 1. Prepare Frontend

```bash
cd frontend

# Create .env.production
echo "VITE_API_URL=https://your-railway-backend-url" > .env.production

# Or use .env.local for development
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
```

### 2. Update Vite Config

Frontend should handle both development and production correctly.

### 3. Push to GitHub

```bash
# Ensure frontend changes are committed
git add frontend/
git commit -m "Frontend: Add deployment configuration"
git push
```

### 4. Deploy on Vercel

```bash
# Method 1: Using Vercel UI (Recommended)
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Import Project"
4. Select your GitHub repository
5. Framework Preset: React
6. Root Directory: ./frontend
7. Build Command: npm run build
8. Output Directory: dist
9. Add environment variable:
   VITE_API_URL = https://your-railway-backend-url
10. Click "Deploy"

# Method 2: Using Vercel CLI
npm i -g vercel
vercel login
vercel --prod
```

### 5. Connect Custom Domain (Optional)

```bash
# In Vercel Dashboard:
1. Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update CORS_ORIGIN in backend if using custom domain
```

## 🌐 Alternative Deployment Options

### Backend Alternatives

#### Render.com
```bash
1. Go to https://render.com
2. Create account
3. New → Web Service
4. Connect GitHub repo
5. Name: interview-tracker-api
6. Environment: Node
7. Build: npm install
8. Start: npm start
9. Add environment variables
10. Deploy
```

#### Heroku (if still available)
```bash
heroku login
heroku create interview-tracker-api
git push heroku main
heroku config:set MONGODB_URI="..."
```

### Frontend Alternatives

#### Netlify
```bash
npm run build
# Drag & drop dist folder to netlify.com
# Or connect GitHub for auto-deployment
```

## 🔒 Security Configuration

### 1. Environment Variables

Never commit `.env` files. Use only in:
- Production platforms' secret management
- Local development in `.env.local` (added to .gitignore)

### 2. CORS Configuration

Update backend for production domain:

```javascript
cors: {
  origin: process.env.CORS_ORIGIN,
  credentials: true
}
```

### 3. JWT Secret

Generate strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. MongoDB Security

- Use strong passwords
- Enable IP whitelist
- Use connection string encryption
- Enable database backups

## 📊 Monitoring & Logging

### Railway Monitoring
- Dashboard → Deployments → Logs
- View real-time application logs
- Monitor resource usage

### Vercel Analytics
- Analytics tab shows deployment metrics
- Function invocations
- Error tracking

### MongoDB Monitoring
- Atlas → Monitoring
- Database metrics
- Performance analysis

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 16
      
      - name: Build Backend
        run: |
          cd backend
          npm install
          npm run build
      
      - name: Deploy Backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: railway up
      
      - name: Build Frontend
        run: |
          cd frontend
          npm install
          npm run build
      
      - name: Deploy Frontend
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: vercel --prod
```

## 🧪 Testing Deployment

### 1. Test Backend API

```bash
# Test login endpoint
curl -X POST https://your-backend-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Should return token and user data
```

### 2. Test Frontend

```bash
# Visit frontend URL
# 1. Try login/register
# 2. Navigate to dashboard
# 3. Check console for API calls
# 4. Verify data loads correctly
```

### 3. Test Database Connection

```bash
# From backend logs, look for:
# "Connected to MongoDB Atlas"
# "Server listening on port 5000"
```

## 📱 Performance Optimization

### Frontend
```bash
# Analyze bundle size
npm run build -- --report

# Optimize images
# Use lazy loading for components
# Code splitting enabled by default in Vite
```

### Backend
```bash
# Enable compression
# Implement rate limiting
# Add caching headers
# Use connection pooling
```

## 🚨 Troubleshooting

### Common Issues

#### 1. CORS Error
```
Solution:
- Check CORS_ORIGIN in backend .env
- Ensure frontend URL matches
- Restart backend after changing CORS
```

#### 2. MongoDB Connection Error
```
Solution:
- Verify connection string
- Check IP whitelist on MongoDB Atlas
- Ensure database user exists
- Check password special characters
```

#### 3. Build Failures
```
Solution:
- Check Node version (use v16+)
- Clear node_modules and reinstall
- Check for TypeScript errors
- Review build logs
```

#### 4. 404 on Frontend Routes
```
Solution:
- Ensure Vercel redirect to index.html
- Add vercel.json:
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 📈 Scaling Considerations

### As User Base Grows

1. **Database**
   - MongoDB Atlas: Upgrade cluster tier
   - Add indexes for frequent queries
   - Enable sharding if needed

2. **Backend**
   - Load balancing
   - Horizontal scaling
   - Cache layer (Redis)
   - API rate limiting

3. **Frontend**
   - CDN optimization
   - Edge caching
   - Lazy loading
   - Code splitting

## 🔄 Update & Rollback

### Deploy New Version

```bash
# Make changes
git add .
git commit -m "feature: Add new feature"
git push origin main

# Automatic deployment on Railway and Vercel
# Monitor logs for errors
```

### Rollback

```bash
# On Railway/Render/Heroku
# Use previous deployment/commit

# Revert last commit
git revert HEAD
git push
```

## ✅ Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Login/Register works
- [ ] Dashboard displays user data
- [ ] API calls complete successfully
- [ ] Database saves data
- [ ] All features functional
- [ ] No console errors
- [ ] Mobile responsive
- [ ] HTTPS working
- [ ] Email setup (if enabled)
- [ ] Analytics configured
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Performance acceptable

## 📞 Support & Help

### Deployment Resources
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- GitHub Actions: https://docs.github.com/en/actions

### Getting Help
1. Check platform-specific documentation
2. Review deployment logs
3. Check GitHub issues
4. Contact support teams

---

**Deployment Guide Version: 1.0**
**Last Updated: June 2026**
