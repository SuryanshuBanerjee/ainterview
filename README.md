# AI Interview Platform

A comprehensive full-stack web application for interview preparation and career development.

## Features

- **User Authentication**: Secure login/register system with JWT tokens
- **Resume ATS Analyzer**: Advanced resume scoring against ATS systems
- **Interview Practice**: Practice with common technical and behavioral questions
- **DSA Quiz**: Test your Data Structures and Algorithms knowledge
- **Placement Opportunities**: Browse and apply to job positions
- **Profile Management**: Manage your skills, experience, and education

## Tech Stack

### Frontend
- React 18 with React Router for navigation
- Modern dark theme design with consistent color scheme
- Responsive layout for all screen sizes
- Axios for API communication

### Backend
- Flask REST API with CORS support
- JWT-based authentication
- Mock data with realistic samples
- Comprehensive API endpoints

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Python 3.7+

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the Flask server:
   ```bash
   python app.py
   ```

   Backend will run on http://localhost:5000

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the React development server:
   ```bash
   npm start
   ```

   Frontend will run on http://localhost:3000

## Demo Credentials

For testing the application, use these credentials:

**Username**: `testuser`
**Password**: `password123`

**Admin Access**:
**Username**: `admin`
**Password**: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Profile Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Resume Analysis
- `POST /api/resume/analyze` - Analyze resume text and get ATS score

### Interview Preparation
- `GET /api/interviews/questions` - Get interview questions (filterable)

### DSA Quiz
- `GET /api/quiz/dsa` - Get DSA quiz questions
- `POST /api/quiz/submit` - Submit quiz answers and get results

### Placements
- `GET /api/placements` - Get available job positions
- `POST /api/placements/{id}/apply` - Apply to a position

### Dashboard
- `GET /api/dashboard/stats` - Get user dashboard statistics

## Features Overview

### 🎯 Resume ATS Analyzer
- Upload resume text and get instant ATS compatibility score
- Keyword analysis and suggestions
- Professional feedback for improvement

### 💬 Interview Practice
- Technical and behavioral question categories
- Sample answers and explanations
- Difficulty-based filtering

### 🧠 DSA Quiz System
- Multiple choice questions on Data Structures and Algorithms
- Real-time progress tracking
- Detailed results with explanations

### 🏢 Placement Portal
- Browse available job positions
- One-click application system
- Track application status

### 📊 Dashboard
- Comprehensive overview of user progress
- Recent activity tracking
- Quick access to all features

## Design Features

- **Dark Theme**: Professional dark color scheme with purple and cyan accents
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Subtle hover effects and transitions
- **Consistent UI**: Unified design language across all components
- **Modern Typography**: Clean, readable fonts with proper hierarchy

## Project Structure

```
ainterview/
├── src/
│   ├── components/     # Reusable React components
│   ├── context/        # React context for state management
│   ├── pages/          # Main page components
│   └── styles/         # CSS styling
├── backend/
│   ├── app.py          # Flask application
│   └── requirements.txt # Python dependencies
└── public/             # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.