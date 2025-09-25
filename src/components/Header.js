import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LogoIcon = () => (
  <svg className="logo-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
  </svg>
);

const Header = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isLandingPage = location.pathname === '/';

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-brand">
          <Link to="/">
            <LogoIcon />
            <span className="logo-text">AI Interview</span>
          </Link>
        </div>
        {token ? (
          <ul className="nav-links">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/resume-analyzer">Resume Analyzer</Link></li>
            <li><Link to="/interview-prep">Interview Prep</Link></li>
            <li><Link to="/dsa-quiz">DSA Quiz</Link></li>
            <li><Link to="/placements">Placements</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        ) : isLandingPage ? (
          <ul className="nav-links">
            <li><a href="#resume-builder">Resume Builder</a></li>
            <li><a href="#interview-copilot">Interview Copilot</a></li>
            <li><a href="#coding-pilot">Coding Pilot</a></li>
            <li><a href="#placements">Placements</a></li>
          </ul>
        ) : null}
        <div className="nav-actions">
          {token ? (
            <button className="btn-secondary" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">Sign In</Link>
              <Link to="/register" className="btn-primary">Get Started →</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;