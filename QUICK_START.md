# Quick Start Guide - CodePrep AI

## 🚀 Get Started in 3 Steps

### Step 1: Choose Your Database

You have two options:

#### Option A: MongoDB Atlas (Recommended - Easier)
1. Double-click `SETUP_MONGODB_ATLAS.bat`
2. Follow the prompts to create a free account
3. Paste your connection string when asked

**OR**

#### Option B: Local MongoDB
1. Double-click `INSTALL_MONGODB.bat`
2. Choose local installation
3. Download and install MongoDB Community Server
4. Install it as a Windows service

---

### Step 2: Start the Application

Double-click `START_CODEPREP.bat`

This will:
- Start MongoDB (if local) or connect to Atlas
- Start the backend server on port 5000
- Start the frontend server on port 5173
- Open the application in your browser

---

### Step 3: Use the Application

1. **Register** a new account
2. **Create resumes** for your job applications
3. **Track positions** you're applying to
4. **Practice interviews** with AI
5. **Solve coding challenges**

---

## 🎯 What's Running?

When you start the app, you'll see 3 command windows:

1. **Backend Server** - API running on http://localhost:5000
2. **Frontend Server** - React app on http://localhost:5173
3. **MongoDB** - Database (only if using local MongoDB)

---

## 💡 MongoDB Atlas Setup (Detailed)

If you chose MongoDB Atlas, here's the detailed setup:

### 1. Create Account
- Go to https://www.mongodb.com/cloud/atlas/register
- Sign up for free
- Verify your email

### 2. Create a Cluster
- Click "Build a Database"
- Choose "FREE" tier (M0 Sandbox)
- Select a cloud provider and region (closest to you)
- Click "Create Cluster"
- Wait 3-5 minutes for cluster creation

### 3. Create Database User
- Click "Database Access" in left sidebar
- Click "Add New Database User"
- Choose "Password" authentication
- Set username and password (SAVE THESE!)
- Set privileges to "Read and write to any database"
- Click "Add User"

### 4. Configure Network Access
- Click "Network Access" in left sidebar
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (or add your IP)
- Click "Confirm"

### 5. Get Connection String
- Click "Database" in left sidebar
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string
- It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`

### 6. Configure CodePrep
- Run `SETUP_MONGODB_ATLAS.bat`
- Paste your connection string when prompted
- Replace `<username>` and `<password>` with your credentials

---

## 🔧 Troubleshooting

### "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/ (LTS version recommended)

### "MongoDB connection failed"
**Solutions:**
1. Check if MongoDB is running (for local installation)
2. Verify your connection string (for Atlas)
3. Check your network connection
4. Verify IP is whitelisted in Atlas Network Access

### "Port 5000 is already in use"
**Solution:**
1. Close any application using port 5000
2. Or change the PORT in `backend/.env` to another port like 5001

### "Port 5173 is already in use"
**Solution:**
1. Close any application using port 5173
2. Or the frontend will automatically use the next available port

### Backend server won't start
**Solution:**
1. Make sure you ran `npm install` in backend folder
2. Check if `.env` file exists in backend folder
3. Verify OpenAI API key is set in `.env`

### Frontend shows blank page
**Solutions:**
1. Check browser console for errors (F12)
2. Make sure backend is running
3. Clear browser cache and reload

---

## 📝 Files Overview

- `START_CODEPREP.bat` - Main startup script
- `INSTALL_MONGODB.bat` - MongoDB installation helper
- `SETUP_MONGODB_ATLAS.bat` - MongoDB Atlas configuration
- `backend/` - Express.js API server
- `frontend/` - React application
- `README_CODEPREP.md` - Complete documentation

---

## 🎓 First Time Using?

1. Start with creating a resume
2. Add a few job positions you're interested in
3. Try a "Behavioral" interview on "Easy" difficulty
4. Check out the coding challenges

---

## 🆘 Need Help?

- Check `README_CODEPREP.md` for detailed documentation
- All API endpoints are documented
- Frontend components are well-organized in `frontend/src/pages/`

---

**Enjoy using CodePrep AI! 🚀**
