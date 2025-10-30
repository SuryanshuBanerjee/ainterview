import mongoose from 'mongoose';

const positionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    name: { type: String, required: true },
    website: String,
    location: String,
    size: String,
    industry: String,
    description: String
  },
  jobDescription: {
    type: String,
    required: true
  },
  requirements: {
    required: [String],
    preferred: [String],
    skills: [String],
    experience: String,
    education: String
  },
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' }
  },
  applicationStatus: {
    type: String,
    enum: ['interested', 'applied', 'interviewing', 'offer', 'rejected', 'accepted', 'withdrawn'],
    default: 'interested'
  },
  applicationDate: Date,
  deadlineDate: Date,
  notes: String,
  contacts: [{
    name: String,
    role: String,
    email: String,
    phone: String,
    linkedin: String
  }],
  interviewStages: [{
    stage: String,
    date: Date,
    completed: { type: Boolean, default: false },
    notes: String
  }],
  resumeUsed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  source: String,
  jobUrl: String
}, {
  timestamps: true
});

export default mongoose.model('Position', positionSchema);
