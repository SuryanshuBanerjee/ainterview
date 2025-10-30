import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Shield, LogOut, User } from 'lucide-react';

function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <Link to={isAuthenticated ? '/dashboard' : '/'} style={styles.brand}>
          <Shield size={32} style={styles.logoIcon} />
          <span style={styles.logoText}>CodePrep AI</span>
        </Link>

        {isAuthenticated ? (
          <>
            <div style={styles.navLinks}>
              <Link to="/dashboard" style={styles.link}>Dashboard</Link>
              <Link to="/interviews" style={styles.link}>Interviews</Link>
              <Link to="/challenges" style={styles.link}>Challenges</Link>
              <Link to="/resumes" style={styles.link}>Resumes</Link>
              <Link to="/positions" style={styles.link}>Positions</Link>
            </div>

            <div style={styles.navActions}>
              <div style={styles.userInfo}>
                <User size={20} />
                <span>{user?.name}</span>
              </div>
              <button onClick={handleLogout} style={styles.btnSecondary}>
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </>
        ) : (
          <div style={styles.navActions}>
            <Link to="/login">
              <button style={styles.btnSecondary}>Sign In</button>
            </Link>
            <Link to="/register">
              <button className="btn-primary" style={styles.btnPrimary}>
                Get Started →
              </button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    width: '100%',
    background: 'rgba(10, 11, 14, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border-color)',
    zIndex: 1000
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none'
  },
  logoIcon: {
    color: 'var(--accent-purple)'
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 700,
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  navLinks: {
    display: 'flex',
    listStyle: 'none',
    gap: '2rem',
    alignItems: 'center'
  },
  link: {
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'color 0.3s ease'
  },
  navActions: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--text-secondary)',
    padding: '0.5rem 1rem',
    background: 'var(--secondary-dark)',
    borderRadius: '8px',
    border: '1px solid var(--border-color)'
  },
  btnSecondary: {
    background: 'transparent',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  btnPrimary: {
    background: 'var(--gradient-primary)',
    border: 'none',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: 'var(--shadow-primary)'
  }
};

export default Header;
