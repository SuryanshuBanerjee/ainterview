import React from 'react';

const LogoIcon = () => (
  <svg className="logo-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
  </svg>
);

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-brand">
          <LogoIcon />
          <span className="logo-text">CodePrep AI</span>
        </div>
        <ul className="nav-links">
          <li><a href="#resume-builder">Resume Builder</a></li>
          <li><a href="#interview-copilot">Interview Copilot</a></li>
          <li><a href="#coding-pilot">Coding Pilot</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li className="dropdown">
            <a href="#resources">Resources ▾</a>
          </li>
        </ul>
        <div className="nav-actions">
          <button className="btn-secondary">Sign In</button>
          <button className="btn-primary">Get Started →</button>
        </div>
      </nav>
    </header>
  );
};

export default Header;