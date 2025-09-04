import React from 'react';

const FeatureCard = ({ title, description }) => (
  <div className="feature-card">
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const ResumeBuilder = () => {
  return (
    <section id="resume-builder" className="resume-builder-section">
      <div className="container">
        <div className="section-badge">
          <span className="badge-icon">📄</span>
          <span>AI Resume Builder</span>
        </div>
        
        <div className="section-content">
          <h2 className="section-title">
            Generate a hireable resume 
            <span className="gradient-text">with ease in one click.</span>
          </h2>
          
          <div className="features-grid">
            <FeatureCard
              title="ATS Optimized"
              description="Designed to ensure ATS optimization so your credentials stand out to top employers and pass the machine screening process."
            />
            <FeatureCard
              title="Personalization with AI"
              description="Customize your document with intelligent suggestions tailored to your career goals. Stand out with a resume that's uniquely yours, yet professionally appealing."
            />
          </div>
          
          <div className="cta-section">
            <button className="primary-cta-btn">
              Resume Builder
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeBuilder;