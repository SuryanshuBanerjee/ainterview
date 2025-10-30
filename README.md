# CodePrep AI - Interview Preparation Platform

A comprehensive full-stack interview preparation platform with AI-powered mock interviews, coding challenges, resume builder, and job position tracking.

## Features

### 🤖 AI Mock Interviews
- Real-time AI-powered interview conversations using GPT-4
- Multiple interview types: Behavioral, Technical, System Design, Coding, Mixed
- Difficulty levels: Easy, Medium, Hard
- Comprehensive feedback with scores and recommendations
- Track interview history and progress

### 💻 Coding Challenges
- LeetCode-style coding problems
- Multiple programming languages support
- Real-time code submission and testing
- Difficulty filtering and search
- Track acceptance rates and submissions

### 📄 Resume Builder
- Create and manage multiple resumes
- AI-enhanced resume suggestions
- Professional templates
- Export and share capabilities

### 💼 Position Tracking
- Track job applications
- Manage interview stages
- Salary range tracking
- Application status management
- Company information storage

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Zustand** - State management
- **Axios** - API requests
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **OpenAI API** - AI interview generation
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
cd codeprep
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure Environment Variables**

Backend `.env` file is already created at `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codeprep
JWT_SECRET=codeprep_secret_jwt_key_2024_change_in_production
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

5. **Start MongoDB**

If using local MongoDB:
```bash
mongod
```

Or use MongoDB Atlas and update the `MONGODB_URI` in `.env`

6. **Start the Backend Server**
```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

7. **Start the Frontend Development Server**
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## Project Structure

```
codeprep/
├── backend/
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Auth & validation middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # OpenAI integration
│   ├── .env              # Environment variables
│   ├── server.js         # Express app setup
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Zustand state management
│   │   ├── utils/        # API client & utilities
│   │   ├── App.jsx       # Main app component
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── index.html            # Landing page (static)
├── styles.css            # Landing page styles
└── README_CODEPREP.md    # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Resumes
- `GET /api/resumes` - Get all resumes
- `GET /api/resumes/:id` - Get single resume
- `POST /api/resumes` - Create resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

### Positions
- `GET /api/positions` - Get all positions
- `GET /api/positions/:id` - Get single position
- `POST /api/positions` - Create position
- `PUT /api/positions/:id` - Update position
- `DELETE /api/positions/:id` - Delete position

### Interviews
- `GET /api/interviews` - Get all interviews
- `GET /api/interviews/:id` - Get single interview
- `POST /api/interviews` - Start new interview
- `POST /api/interviews/:id/message` - Send message
- `PUT /api/interviews/:id/complete` - Complete interview
- `DELETE /api/interviews/:id` - Delete interview

### Challenges
- `GET /api/challenges` - Get all challenges
- `GET /api/challenges/:slug` - Get single challenge
- `POST /api/challenges/:slug/submit` - Submit solution
- `GET /api/challenges/submissions/my` - Get user submissions

## Features in Detail

### AI Interview System
The AI interview system uses OpenAI's GPT-4 to conduct realistic mock interviews:
- Generates contextual questions based on interview type
- Provides real-time responses to candidate answers
- Analyzes interview performance
- Generates comprehensive feedback including:
  - Overall score (0-100)
  - Technical skills rating
  - Communication rating
  - Problem-solving rating
  - Strengths and improvements
  - Actionable recommendations

### Resume Builder
Create professional resumes with:
- Personal information management
- Work experience tracking
- Education history
- Skills categorization
- Projects showcase
- Certifications and awards
- AI enhancement suggestions

### Position Tracking
Manage your job search with:
- Company information storage
- Job description tracking
- Salary range tracking
- Application status updates
- Interview stage management
- Contact information
- Notes and deadlines

## Security Features
- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting on API endpoints
- Helmet.js security headers
- CORS configuration
- Input validation with express-validator

## Development

### Backend Development
```bash
cd backend
npm run dev  # Runs with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Runs Vite dev server with HMR
```

### Build for Production

Frontend:
```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `OPENAI_API_KEY` - Your OpenAI API key
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

## Contributing
This is a complete full-stack application ready for use and further development.

## License
MIT License

## Support
For issues and questions, please open an issue in the repository.

---

**Built with ❤️ using React, Express, MongoDB, and OpenAI**
