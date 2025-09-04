import React from 'react';

const ProgressStep = ({ icon, title, description, action, completed = false }) => (
  <div className={`step ${completed ? 'completed' : ''}`}>
    <div className="step-icon">{icon}</div>
    <div className="step-content">
      <h3>{title}</h3>
      <p>{description}</p>
      {action && <span className="step-action">{action}</span>}
    </div>
  </div>
);

const StatBadge = ({ number, label, className }) => (
  <div className={className}>
    <span className={className.includes('achievement') ? 'achievement-number' : 'position-number'}>
      {number}
    </span>
    <span className={className.includes('achievement') ? 'achievement-text' : 'position-text'}>
      {label}
    </span>
  </div>
);

const DashboardPreview = () => {
  const steps = [
    {
      icon: '📄',
      title: 'Add your resume',
      description: 'Create a professional resume easily',
      action: 'Create resume',
      completed: true
    },
    {
      icon: '💼',
      title: 'Add your position',
      description: 'Plan your career path and target your dream AI position to help AI plan your interview',
      completed: true
    },
    {
      icon: '🚀',
      title: 'Launch an interview',
      description: 'Assisting and supporting in meetings and collaborations',
      completed: false
    },
    {
      icon: '📊',
      title: 'Review',
      description: 'Review your interview notes and post interviews',
      completed: false
    }
  ];

  return (
    <div className="dashboard-preview">
      <div className="dashboard-header">
        <div className="dashboard-stats">
          <span className="stat-number">5</span>
          <span className="stat-label">Total interviews</span>
        </div>
      </div>
      
      <div className="progress-steps">
        {steps.map((step, index) => (
          <ProgressStep key={index} {...step} />
        ))}
      </div>

      <StatBadge 
        number="1" 
        label="Resume created" 
        className="achievement-badge" 
      />

      <StatBadge 
        number="2" 
        label="Positions added" 
        className="position-badge" 
      />
    </div>
  );
};

export default DashboardPreview;