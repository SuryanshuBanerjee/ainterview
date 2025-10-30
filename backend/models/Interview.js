import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  position: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position'
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  },
  type: {
    type: String,
    enum: ['behavioral', 'technical', 'system-design', 'coding', 'mixed'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'abandoned'],
    default: 'scheduled'
  },
  messages: [messageSchema],
  duration: {
    type: Number, // in minutes
    default: 0
  },
  startTime: Date,
  endTime: Date,
  feedback: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100
    },
    strengths: [String],
    improvements: [String],
    technicalSkills: {
      type: Number,
      min: 0,
      max: 10
    },
    communication: {
      type: Number,
      min: 0,
      max: 10
    },
    problemSolving: {
      type: Number,
      min: 0,
      max: 10
    },
    detailedFeedback: String,
    recommendations: [String]
  },
  topics: [String],
  questionsAsked: [{
    question: String,
    answer: String,
    rating: Number
  }],
  notes: String
}, {
  timestamps: true
});

// Calculate duration when interview is completed
interviewSchema.pre('save', function(next) {
  if (this.status === 'completed' && this.startTime && this.endTime) {
    this.duration = Math.round((this.endTime - this.startTime) / 1000 / 60);
  }
  next();
});

export default mongoose.model('Interview', interviewSchema);
