import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Header from '../components/Header';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FileText, Briefcase, MessageSquare, Code, TrendingUp } from 'lucide-react';

function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState(null);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, interviewsRes] = await Promise.all([
        api.get('/users/stats'),
        api.get('/interviews')
      ]);

      setStats(statsRes.data);
      setRecentInterviews(interviewsRes.data.interviews.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.welcomeSection}>
            <h1 style={styles.welcomeTitle}>Welcome back, {user?.name}! 👋</h1>
            <p style={styles.welcomeSubtitle}>Ready to ace your next interview?</p>
          </div>

          {/* Stats Grid */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <MessageSquare size={24} style={{ color: 'var(--accent-purple)' }} />
              </div>
              <div>
                <div style={styles.statNumber}>{stats?.totalInterviews || 0}</div>
                <div style={styles.statLabel}>Total Interviews</div>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <FileText size={24} style={{ color: 'var(--accent-cyan)' }} />
              </div>
              <div>
                <div style={styles.statNumber}>{stats?.resumesCreated || 0}</div>
                <div style={styles.statLabel}>Resumes Created</div>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <Briefcase size={24} style={{ color: 'var(--accent-green)' }} />
              </div>
              <div>
                <div style={styles.statNumber}>{stats?.positionsAdded || 0}</div>
                <div style={styles.statLabel}>Positions Tracked</div>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <TrendingUp size={24} style={{ color: '#ff6688' }} />
              </div>
              <div>
                <div style={styles.statNumber}>{stats?.subscription || 'Free'}</div>
                <div style={styles.statLabel}>Subscription</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Quick Actions</h2>
            <div style={styles.actionsGrid}>
              <Link to="/interviews" style={styles.actionCard}>
                <MessageSquare size={32} style={{ color: 'var(--accent-purple)' }} />
                <h3>Start Interview</h3>
                <p>Practice with AI interviewer</p>
              </Link>

              <Link to="/challenges" style={styles.actionCard}>
                <Code size={32} style={{ color: 'var(--accent-cyan)' }} />
                <h3>Solve Challenge</h3>
                <p>Practice coding problems</p>
              </Link>

              <Link to="/resumes" style={styles.actionCard}>
                <FileText size={32} style={{ color: 'var(--accent-green)' }} />
                <h3>Build Resume</h3>
                <p>Create or update resume</p>
              </Link>

              <Link to="/positions" style={styles.actionCard}>
                <Briefcase size={32} style={{ color: '#ff6688' }} />
                <h3>Track Position</h3>
                <p>Add job application</p>
              </Link>
            </div>
          </div>

          {/* Recent Interviews */}
          {recentInterviews.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Recent Interviews</h2>
              <div style={styles.interviewsList}>
                {recentInterviews.map((interview) => (
                  <Link
                    key={interview._id}
                    to={`/interviews/${interview._id}`}
                    style={styles.interviewCard}
                  >
                    <div>
                      <h3 style={styles.interviewTitle}>{interview.type} Interview</h3>
                      <p style={styles.interviewMeta}>
                        {interview.difficulty} • {interview.status}
                      </p>
                    </div>
                    <div style={styles.interviewScore}>
                      {interview.feedback?.overallScore || 'N/A'}
                    </div>
                  </Link>
                ))}
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
  welcomeSection: {
    marginBottom: '3rem'
  },
  welcomeTitle: {
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '0.5rem'
  },
  welcomeSubtitle: {
    fontSize: '1.25rem',
    color: 'var(--text-secondary)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem'
  },
  statCard: {
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  statIcon: {
    width: '48px',
    height: '48px',
    background: 'var(--tertiary-dark)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '0.25rem'
  },
  statLabel: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem'
  },
  section: {
    marginBottom: '3rem'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '1.5rem'
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem'
  },
  actionCard: {
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '2rem',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  interviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  interviewCard: {
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textDecoration: 'none',
    transition: 'all 0.3s ease'
  },
  interviewTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '0.25rem'
  },
  interviewMeta: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem'
  },
  interviewScore: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--accent-green)'
  }
};

export default Dashboard;
