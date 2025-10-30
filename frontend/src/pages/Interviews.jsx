import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Plus, MessageSquare, PlayCircle, CheckCircle } from 'lucide-react';

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'technical',
    difficulty: 'medium'
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      const { data } = await api.get('/interviews');
      setInterviews(data.interviews);
    } catch (error) {
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/interviews', formData);
      toast.success('Interview started!');
      navigate(`/interviews/${data.interview._id}`);
    } catch (error) {
      toast.error('Failed to start interview');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'var(--accent-green)';
      case 'in-progress':
        return 'var(--accent-cyan)';
      default:
        return 'var(--text-muted)';
    }
  };

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>AI Mock Interviews</h1>
              <p style={styles.subtitle}>Practice with AI-powered interviewers</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <Plus size={20} />
              Start Interview
            </button>
          </div>

          {loading ? (
            <div style={styles.loading}>
              <div className="spinner" />
            </div>
          ) : interviews.length === 0 ? (
            <div style={styles.empty}>
              <MessageSquare size={64} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h2>No interviews yet</h2>
              <p>Start your first AI mock interview</p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                <Plus size={20} />
                Start Interview
              </button>
            </div>
          ) : (
            <div style={styles.grid}>
              {interviews.map((interview) => (
                <Link
                  key={interview._id}
                  to={`/interviews/${interview._id}`}
                  style={styles.card}
                >
                  <div style={styles.cardHeader}>
                    <div style={{
                      ...styles.statusIcon,
                      background: getStatusColor(interview.status) + '20',
                      color: getStatusColor(interview.status)
                    }}>
                      {interview.status === 'completed' ? (
                        <CheckCircle size={24} />
                      ) : (
                        <PlayCircle size={24} />
                      )}
                    </div>
                    <div>
                      <h3 style={styles.cardTitle}>
                        {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)} Interview
                      </h3>
                      <p style={styles.cardMeta}>
                        {interview.difficulty} • {interview.status}
                      </p>
                    </div>
                  </div>

                  <div style={styles.cardBody}>
                    <div style={styles.stats}>
                      <div style={styles.stat}>
                        <span style={styles.statLabel}>Messages</span>
                        <span style={styles.statValue}>{interview.messages?.length || 0}</span>
                      </div>
                      <div style={styles.stat}>
                        <span style={styles.statLabel}>Duration</span>
                        <span style={styles.statValue}>{interview.duration || 0} min</span>
                      </div>
                      {interview.feedback?.overallScore && (
                        <div style={styles.stat}>
                          <span style={styles.statLabel}>Score</span>
                          <span style={{
                            ...styles.statValue,
                            color: 'var(--accent-green)'
                          }}>
                            {interview.feedback.overallScore}
                          </span>
                        </div>
                      )}
                    </div>

                    <p style={styles.date}>
                      Started {new Date(interview.startTime).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Start Interview Modal */}
          {showModal && (
            <div style={styles.modal}>
              <div style={styles.modalContent}>
                <h2 style={styles.modalTitle}>Start New Interview</h2>

                <form onSubmit={handleStart}>
                  <div className="form-group">
                    <label className="label">Interview Type</label>
                    <select
                      className="input"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="behavioral">Behavioral</option>
                      <option value="technical">Technical</option>
                      <option value="system-design">System Design</option>
                      <option value="coding">Coding</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="label">Difficulty</label>
                    <select
                      className="input"
                      value={formData.difficulty}
                      onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div style={styles.infoBox}>
                    <p>
                      <strong>Note:</strong> The AI interviewer will conduct a realistic interview
                      based on your selected type and difficulty. You can pause or end the interview
                      at any time.
                    </p>
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
                      Start Interview
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
    textDecoration: 'none',
    transition: 'all 0.3s ease'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '1rem'
  },
  statusIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.25rem'
  },
  cardMeta: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    textTransform: 'capitalize'
  },
  cardBody: {
    marginTop: '1rem'
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '1rem',
    padding: '1rem',
    background: 'var(--tertiary-dark)',
    borderRadius: '8px'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  statLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.25rem'
  },
  statValue: {
    fontSize: '1.25rem',
    fontWeight: 700
  },
  date: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem'
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
    maxWidth: '500px',
    width: '100%'
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1.5rem'
  },
  infoBox: {
    background: 'var(--tertiary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1.5rem',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem'
  },
  modalFooter: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end'
  }
};

export default Interviews;
