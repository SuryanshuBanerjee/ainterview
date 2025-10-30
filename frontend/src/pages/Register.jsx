import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import { User, Mail, Lock } from 'lucide-react';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <div style={styles.formCard}>
          <h1 style={styles.title}>Get Started</h1>
          <p style={styles.subtitle}>Create your account and start prepping for interviews</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div className="form-group">
              <label className="label">
                <User size={16} style={{ marginRight: '0.5rem' }} />
                Name
              </label>
              <input
                type="text"
                className="input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="label">
                <Mail size={16} style={{ marginRight: '0.5rem' }} />
                Email
              </label>
              <input
                type="email"
                className="input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="label">
                <Lock size={16} style={{ marginRight: '0.5rem' }} />
                Password
              </label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? <div className="spinner" /> : 'Create Account'}
            </button>
          </form>

          <p style={styles.footer}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  },
  formCard: {
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '3rem',
    maxWidth: '450px',
    width: '100%',
    boxShadow: 'var(--shadow-secondary)'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    textAlign: 'center'
  },
  subtitle: {
    color: 'var(--text-secondary)',
    textAlign: 'center',
    marginBottom: '2rem'
  },
  form: {
    marginBottom: '1.5rem'
  },
  footer: {
    textAlign: 'center',
    color: 'var(--text-secondary)'
  },
  link: {
    color: 'var(--accent-purple)',
    textDecoration: 'none',
    fontWeight: 600
  }
};

export default Register;
