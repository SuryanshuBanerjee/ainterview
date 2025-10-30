import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Plus, FileText, Edit, Trash2, Star } from 'lucide-react';

function Resumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: ''
    },
    summary: '',
    skills: {
      technical: [],
      languages: []
    }
  });

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const { data } = await api.get('/resumes');
      setResumes(data.resumes);
    } catch (error) {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/resumes', formData);
      toast.success('Resume created successfully!');
      setShowModal(false);
      loadResumes();
      // Reset form
      setFormData({
        title: '',
        personalInfo: { fullName: '', email: '', phone: '', location: '' },
        summary: '',
        skills: { technical: [], languages: [] }
      });
    } catch (error) {
      toast.error('Failed to create resume');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    try {
      await api.delete(`/resumes/${id}`);
      toast.success('Resume deleted');
      loadResumes();
    } catch (error) {
      toast.error('Failed to delete resume');
    }
  };

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>My Resumes</h1>
              <p style={styles.subtitle}>Create and manage your professional resumes</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(true)}
              >
                <Plus size={20} />
                Quick Create
              </button>
              <Link to="/resumes/builder">
                <button className="btn btn-primary">
                  <Plus size={20} />
                  ATS Resume Builder
                </button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div style={styles.loading}>
              <div className="spinner" />
            </div>
          ) : resumes.length === 0 ? (
            <div style={styles.empty}>
              <FileText size={64} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h2>No resumes yet</h2>
              <p>Create your first ATS-optimized resume</p>
              <Link to="/resumes/builder">
                <button className="btn btn-primary">
                  <Plus size={20} />
                  Build ATS Resume
                </button>
              </Link>
            </div>
          ) : (
            <div style={styles.grid}>
              {resumes.map((resume) => (
                <div key={resume._id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div>
                      <h3 style={styles.cardTitle}>{resume.title}</h3>
                      <p style={styles.cardMeta}>
                        {resume.personalInfo.fullName} • {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {resume.isDefault && (
                      <Star size={20} style={{ color: 'var(--accent-green)', fill: 'var(--accent-green)' }} />
                    )}
                  </div>

                  <div style={styles.cardBody}>
                    <p style={styles.summary}>{resume.summary || 'No summary'}</p>
                    <div style={styles.skills}>
                      {resume.skills.technical.slice(0, 3).map((skill, i) => (
                        <span key={i} style={styles.skill}>{skill}</span>
                      ))}
                      {resume.skills.technical.length > 3 && (
                        <span style={styles.skill}>+{resume.skills.technical.length - 3}</span>
                      )}
                    </div>
                  </div>

                  <div style={styles.cardFooter}>
                    <Link to={`/resumes/builder/${resume._id}`} style={{ flex: 1 }}>
                      <button className="btn btn-secondary" style={{ width: '100%' }}>
                        <Edit size={18} />
                        Edit
                      </button>
                    </Link>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleDelete(resume._id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create Resume Modal */}
          {showModal && (
            <div style={styles.modal}>
              <div style={styles.modalContent}>
                <h2 style={styles.modalTitle}>Create New Resume</h2>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="label">Resume Title</label>
                    <input
                      className="input"
                      placeholder="e.g., Senior Developer Resume"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Full Name</label>
                    <input
                      className="input"
                      placeholder="John Doe"
                      value={formData.personalInfo.fullName}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, fullName: e.target.value }
                      })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Email</label>
                    <input
                      type="email"
                      className="input"
                      placeholder="john@example.com"
                      value={formData.personalInfo.email}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, email: e.target.value }
                      })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Summary</label>
                    <textarea
                      className="input"
                      placeholder="Brief professional summary..."
                      value={formData.summary}
                      onChange={(e) => setFormData({...formData, summary: e.target.value})}
                      rows={4}
                    />
                  </div>

                  <div style={styles.modalFooter}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Create Resume
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
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
    maxWidth: '1400px',
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
    fontWeight: 700
  },
  subtitle: {
    color: 'var(--text-secondary)',
    marginTop: '0.5rem'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: '4rem'
  },
  empty: {
    textAlign: 'center',
    padding: '4rem',
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem'
  },
  card: {
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.5rem',
    transition: 'all 0.3s ease'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.25rem'
  },
  cardMeta: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem'
  },
  cardBody: {
    marginBottom: '1rem'
  },
  summary: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    marginBottom: '1rem',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  skills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  skill: {
    background: 'var(--tertiary-dark)',
    padding: '0.25rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    color: 'var(--accent-cyan)'
  },
  cardFooter: {
    display: 'flex',
    gap: '0.75rem'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '2rem'
  },
  modalContent: {
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '2rem',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1.5rem'
  },
  modalFooter: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '1.5rem'
  }
};

export default Resumes;
