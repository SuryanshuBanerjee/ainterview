import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Header from '../components/Header';

function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleCTA = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div>
      <Header />

      <main>
        <section style={styles.hero}>
          <div className="container">
            <div style={styles.heroContent}>
              <div style={styles.heroText}>
                <h1 style={styles.heroTitle}>
                  Dominate Your Next Interview with{' '}
                  <span className="gradient-text">CodePrep AI</span>
                </h1>

                <div style={styles.featureTags}>
                  <div style={styles.tag}>Interview Copilot</div>
                  <div style={styles.tag}>Resume <span style={styles.highlight}>AI Enhancement</span></div>
                  <div style={styles.tag}>Smart <span style={styles.highlight}>Code Reviews</span></div>
                </div>

                <p style={styles.heroDescription}>
                  Master Your Next Role in 30 Days or Less with CodePrep AI—
                  the comprehensive interview solution trusted by over <strong>250,000 developers</strong> worldwide.
                </p>

                <div style={styles.featureHighlight}>
                  <p>From <strong>Advanced Coding Challenges</strong> and real-time AI feedback to
                  coding assessments in over <strong>40+ languages</strong>, we've engineered everything
                  you need to excel.</p>
                </div>

                <button onClick={handleCTA} style={styles.ctaButton}>
                  {isAuthenticated ? 'Go to Dashboard' : 'Log In'}
                </button>

                <p style={styles.subtitle}>Now offering AI interview prep in 40+ programming languages</p>
              </div>

              <div style={styles.heroVisual}>
                <div style={styles.dashboardPreview}>
                  <div style={styles.dashboardHeader}>
                    <div style={styles.dashboardStats}>
                      <span style={styles.statNumber}>5</span>
                      <span style={styles.statLabel}>Total interviews</span>
                    </div>
                  </div>

                  <div style={styles.progressSteps}>
                    {[
                      { icon: '📄', title: 'Add your resume', desc: 'Create a professional resume easily', completed: true },
                      { icon: '💼', title: 'Add your position', desc: 'Plan your career path and target your dream AI position', completed: true },
                      { icon: '🚀', title: 'Launch an interview', desc: 'Assisting and supporting in meetings and collaborations', completed: false },
                      { icon: '📊', title: 'Review', desc: 'Review your interview notes and post interviews', completed: false }
                    ].map((step, i) => (
                      <div key={i} style={{...styles.step, ...(step.completed && styles.stepCompleted)}}>
                        <div style={{...styles.stepIcon, ...(step.completed && styles.stepIconCompleted)}}>
                          {step.icon}
                        </div>
                        <div>
                          <h3 style={styles.stepTitle}>{step.title}</h3>
                          <p style={styles.stepDesc}>{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  hero: {
    marginTop: '100px',
    padding: '4rem 0',
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center'
  },
  heroContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center'
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: '2rem'
  },
  featureTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '2rem'
  },
  tag: {
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    padding: '0.5rem 1rem',
    borderRadius: '25px',
    fontSize: '0.9rem',
    fontWeight: 500
  },
  highlight: {
    color: 'var(--accent-cyan)',
    fontWeight: 600
  },
  heroDescription: {
    fontSize: '1.25rem',
    color: 'var(--text-secondary)',
    marginBottom: '1.5rem'
  },
  featureHighlight: {
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem',
    color: 'var(--text-secondary)'
  },
  ctaButton: {
    background: 'var(--gradient-secondary)',
    border: 'none',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: 'var(--shadow-primary)',
    marginBottom: '1rem'
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem'
  },
  dashboardPreview: {
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: 'var(--shadow-secondary)'
  },
  dashboardHeader: {
    marginBottom: '2rem',
    textAlign: 'center'
  },
  statNumber: {
    display: 'block',
    fontSize: '2.5rem',
    fontWeight: 800,
    color: 'var(--accent-cyan)',
    marginBottom: '0.5rem'
  },
  statLabel: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem'
  },
  progressSteps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  step: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem',
    borderRadius: '12px',
    background: 'var(--tertiary-dark)',
    border: '1px solid var(--border-color)'
  },
  stepCompleted: {
    background: 'rgba(0, 255, 136, 0.05)',
    border: '1px solid rgba(0, 255, 136, 0.2)'
  },
  stepIcon: {
    fontSize: '1.5rem',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: 'var(--tertiary-dark)',
    flexShrink: 0
  },
  stepIconCompleted: {
    background: 'var(--accent-green)'
  },
  stepTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '0.5rem'
  },
  stepDesc: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem'
  }
};

export default LandingPage;
