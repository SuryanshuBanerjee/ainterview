import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Save, Sparkles, TrendingUp, AlertCircle, CheckCircle, X } from 'lucide-react';

function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [atsScore, setAtsScore] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: {
      technical: [],
      languages: [],
      frameworks: [],
      tools: []
    },
    projects: [],
    certifications: []
  });

  const [newSkill, setNewSkill] = useState('');
  const [skillCategory, setSkillCategory] = useState('technical');

  useEffect(() => {
    if (id) {
      loadResume();
    }
  }, [id]);

  useEffect(() => {
    // Auto-analyze as user types
    const timer = setTimeout(() => {
      if (formData.personalInfo.fullName || formData.summary) {
        analyzeATS();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData]);

  const loadResume = async () => {
    try {
      const { data } = await api.get(`/resumes/${id}`);
      setFormData(data.resume);
    } catch (error) {
      toast.error('Failed to load resume');
    }
  };

  const analyzeATS = async () => {
    setAnalyzing(true);
    try {
      const { data } = await api.post(`/resumes/${id || 'temp'}/analyze`, {
        ...formData,
        targetRole: 'Software Engineer'
      });
      setAtsScore(data.analysis);
    } catch (error) {
      // Silently fail for temp analysis
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await api.put(`/resumes/${id}`, formData);
        toast.success('Resume updated!');
      } else {
        const { data } = await api.post('/resumes', formData);
        toast.success('Resume created!');
        navigate(`/resumes/builder/${data.resume._id}`);
      }
    } catch (error) {
      toast.error('Failed to save resume');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;

    setFormData({
      ...formData,
      skills: {
        ...formData.skills,
        [skillCategory]: [...(formData.skills[skillCategory] || []), newSkill.trim()]
      }
    });
    setNewSkill('');
  };

  const removeSkill = (category, index) => {
    setFormData({
      ...formData,
      skills: {
        ...formData.skills,
        [category]: formData.skills[category].filter((_, i) => i !== index)
      }
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#00ff88';
    if (score >= 60) return '#00d9ff';
    if (score >= 40) return '#ffaa00';
    return '#ff3366';
  };

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <div style={styles.content}>
          {/* Header */}
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>
                <Sparkles size={32} style={{ color: 'var(--accent-purple)' }} />
                ATS-Optimized Resume Builder
              </h1>
              <p style={styles.subtitle}>
                Build a resume that gets past Applicant Tracking Systems
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <div className="spinner" /> : <><Save size={20} /> Save Resume</>}
            </button>
          </div>

          <div style={styles.layout}>
            {/* Main Form */}
            <div style={styles.formPanel}>
              <form onSubmit={handleSave}>
                {/* Resume Title */}
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Resume Title</h2>
                  <input
                    className="input"
                    placeholder="e.g., Senior Software Engineer Resume"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                {/* Personal Info */}
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Contact Information</h2>
                  <div style={styles.grid}>
                    <input
                      className="input"
                      placeholder="Full Name*"
                      value={formData.personalInfo.fullName}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, fullName: e.target.value }
                      })}
                      required
                    />
                    <input
                      className="input"
                      type="email"
                      placeholder="Email*"
                      value={formData.personalInfo.email}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, email: e.target.value }
                      })}
                      required
                    />
                    <input
                      className="input"
                      placeholder="Phone"
                      value={formData.personalInfo.phone}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, phone: e.target.value }
                      })}
                    />
                    <input
                      className="input"
                      placeholder="Location"
                      value={formData.personalInfo.location}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, location: e.target.value }
                      })}
                    />
                    <input
                      className="input"
                      placeholder="LinkedIn URL"
                      value={formData.personalInfo.linkedin}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, linkedin: e.target.value }
                      })}
                    />
                    <input
                      className="input"
                      placeholder="GitHub URL"
                      value={formData.personalInfo.github}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, github: e.target.value }
                      })}
                    />
                  </div>
                </div>

                {/* Professional Summary */}
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>
                    Professional Summary
                    <span style={styles.charCount}>
                      {formData.summary.length}/150 characters
                    </span>
                  </h2>
                  <textarea
                    className="input"
                    placeholder="Write a compelling summary highlighting your key achievements, skills, and career goals. Use action verbs and quantifiable results."
                    value={formData.summary}
                    onChange={(e) => setFormData({...formData, summary: e.target.value})}
                    rows={4}
                    style={{ resize: 'vertical' }}
                  />
                  <div style={styles.tip}>
                    💡 Tip: Start with your years of experience, highlight 2-3 key achievements with numbers, and mention your expertise areas
                  </div>
                </div>

                {/* Skills */}
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Skills</h2>
                  <div style={styles.skillInput}>
                    <select
                      className="input"
                      value={skillCategory}
                      onChange={(e) => setSkillCategory(e.target.value)}
                      style={{ width: 'auto', minWidth: '150px' }}
                    >
                      <option value="technical">Technical</option>
                      <option value="languages">Languages</option>
                      <option value="frameworks">Frameworks</option>
                      <option value="tools">Tools</option>
                    </select>
                    <input
                      className="input"
                      placeholder="Add a skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={addSkill}
                    >
                      Add
                    </button>
                  </div>

                  {/* Skills Display */}
                  {['technical', 'languages', 'frameworks', 'tools'].map(category => (
                    formData.skills[category]?.length > 0 && (
                      <div key={category} style={styles.skillCategory}>
                        <h3 style={styles.skillCategoryTitle}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </h3>
                        <div style={styles.skillTags}>
                          {formData.skills[category].map((skill, index) => (
                            <div key={index} style={styles.skillTag}>
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(category, index)}
                                style={styles.removeSkill}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </form>
            </div>

            {/* ATS Score Panel */}
            <div style={styles.scorePanel}>
              <div style={styles.scorePanelSticky}>
                <h2 style={styles.scorePanelTitle}>
                  <TrendingUp size={24} />
                  ATS Score
                </h2>

                {analyzing && (
                  <div style={styles.analyzing}>
                    <div className="spinner" />
                    <span>Analyzing...</span>
                  </div>
                )}

                {atsScore && (
                  <>
                    <div style={styles.scoreCircle}>
                      <svg width="160" height="160">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke="var(--tertiary-dark)"
                          strokeWidth="12"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke={getScoreColor(atsScore.score)}
                          strokeWidth="12"
                          strokeDasharray={`${(atsScore.score / 100) * 440} 440`}
                          strokeLinecap="round"
                          transform="rotate(-90 80 80)"
                          style={{ transition: 'stroke-dasharray 0.5s ease' }}
                        />
                      </svg>
                      <div style={styles.scoreNumber}>
                        {atsScore.score}
                      </div>
                      <div style={styles.scoreRating} style={{ color: atsScore.ratingColor }}>
                        {atsScore.rating}
                      </div>
                    </div>

                    {/* Feedback */}
                    <div style={styles.feedback}>
                      <h3 style={styles.feedbackTitle}>Feedback</h3>
                      {atsScore.feedback.map((item, index) => (
                        <div key={index} style={{
                          ...styles.feedbackItem,
                          borderLeft: `3px solid ${
                            item.type === 'success' ? '#00ff88' :
                            item.type === 'warning' ? '#ffaa00' :
                            item.type === 'error' ? '#ff3366' : '#00d9ff'
                          }`
                        }}>
                          {item.type === 'success' && <CheckCircle size={16} style={{ color: '#00ff88' }} />}
                          {item.type === 'error' && <AlertCircle size={16} style={{ color: '#ff3366' }} />}
                          {item.type === 'warning' && <AlertCircle size={16} style={{ color: '#ffaa00' }} />}
                          <div>
                            <div style={styles.feedbackCategory}>{item.category}</div>
                            <div style={styles.feedbackMessage}>{item.message}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Suggestions */}
                    {atsScore.suggestions.length > 0 && (
                      <div style={styles.suggestions}>
                        <h3 style={styles.feedbackTitle}>Suggestions</h3>
                        {atsScore.suggestions.map((suggestion, index) => (
                          <div key={index} style={styles.suggestionItem}>
                            <Sparkles size={14} style={{ color: 'var(--accent-purple)' }} />
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {!atsScore && !analyzing && (
                  <div style={styles.placeholder}>
                    <TrendingUp size={48} style={{ color: 'var(--text-muted)' }} />
                    <p>Start filling out your resume to see your ATS score</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: '80px',
    padding: '2rem',
    minHeight: 'calc(100vh - 80px)'
  },
  content: {
    maxWidth: '1600px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  subtitle: {
    color: 'var(--text-secondary)',
    marginTop: '0.5rem'
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '2rem'
  },
  formPanel: {
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '2rem'
  },
  section: {
    marginBottom: '2.5rem'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  charCount: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: 400
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem'
  },
  tip: {
    marginTop: '0.75rem',
    padding: '0.75rem',
    background: 'var(--tertiary-dark)',
    borderRadius: '8px',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)'
  },
  skillInput: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  skillCategory: {
    marginBottom: '1.5rem'
  },
  skillCategoryTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    color: 'var(--accent-cyan)'
  },
  skillTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  skillTag: {
    background: 'var(--tertiary-dark)',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    border: '1px solid var(--border-color)'
  },
  removeSkill: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.2s'
  },
  scorePanel: {
    position: 'relative'
  },
  scorePanelSticky: {
    position: 'sticky',
    top: '100px',
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '2rem',
    maxHeight: 'calc(100vh - 140px)',
    overflowY: 'auto'
  },
  scorePanelTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  analyzing: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '2rem',
    color: 'var(--text-secondary)'
  },
  scoreCircle: {
    position: 'relative',
    width: '160px',
    height: '160px',
    margin: '0 auto 2rem'
  },
  scoreNumber: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '3rem',
    fontWeight: 700
  },
  scoreRating: {
    position: 'absolute',
    top: '65%',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '0.9rem',
    fontWeight: 600
  },
  feedback: {
    marginBottom: '1.5rem'
  },
  feedbackTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '1rem'
  },
  feedbackItem: {
    display: 'flex',
    gap: '0.75rem',
    padding: '0.75rem',
    marginBottom: '0.75rem',
    background: 'var(--tertiary-dark)',
    borderRadius: '8px'
  },
  feedbackCategory: {
    fontSize: '0.85rem',
    fontWeight: 600,
    marginBottom: '0.25rem'
  },
  feedbackMessage: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)'
  },
  suggestions: {},
  suggestionItem: {
    display: 'flex',
    gap: '0.5rem',
    padding: '0.75rem',
    marginBottom: '0.5rem',
    background: 'var(--tertiary-dark)',
    borderRadius: '8px',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)'
  },
  placeholder: {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: 'var(--text-muted)'
  }
};

export default ResumeBuilder;
