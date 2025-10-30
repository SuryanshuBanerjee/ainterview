import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: Date,
  current: { type: Boolean, default: false },
  description: String,
  achievements: [String]
});

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: Date,
  gpa: String
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  technologies: [String],
  link: String,
  github: String
});

const resumeSchema = new mongoose.Schema({
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
  personalInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    location: String,
    linkedin: String,
    github: String,
    portfolio: String
  },
  summary: {
    type: String,
    maxlength: 500
  },
  experience: [experienceSchema],
  education: [educationSchema],
  skills: {
    technical: [String],
    languages: [String],
    frameworks: [String],
    tools: [String],
    soft: [String]
  },
  projects: [projectSchema],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    credentialId: String
  }],
  awards: [{
    name: String,
    issuer: String,
    date: Date,
    description: String
  }],
  isDefault: {
    type: Boolean,
    default: false
  },
  aiEnhanced: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure only one default resume per user
resumeSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

export default mongoose.model('Resume', resumeSchema);
