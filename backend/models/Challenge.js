import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: mongoose.Schema.Types.Mixed,
  expectedOutput: mongoose.Schema.Types.Mixed,
  isHidden: { type: Boolean, default: false }
});

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  category: {
    type: String,
    enum: ['arrays', 'strings', 'linked-lists', 'trees', 'graphs', 'dynamic-programming', 'sorting', 'searching', 'recursion', 'other'],
    required: true
  },
  tags: [String],
  constraints: [String],
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  testCases: [testCaseSchema],
  starterCode: {
    javascript: String,
    python: String,
    java: String,
    cpp: String,
    go: String
  },
  solution: {
    code: String,
    explanation: String,
    timeComplexity: String,
    spaceComplexity: String
  },
  hints: [String],
  similarProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  }],
  companies: [String],
  acceptanceRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  totalSubmissions: {
    type: Number,
    default: 0
  },
  totalAccepted: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['accepted', 'wrong-answer', 'runtime-error', 'time-limit-exceeded', 'compile-error'],
    required: true
  },
  testCasesPassed: Number,
  totalTestCases: Number,
  runtime: Number, // in milliseconds
  memory: Number, // in KB
  errorMessage: String, // Error details if submission failed
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

export const Challenge = mongoose.model('Challenge', challengeSchema);
export const Submission = mongoose.model('Submission', submissionSchema);
