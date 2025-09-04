import React from 'react';
import DashboardPreview from './DashboardPreview';

const FeatureTag = ({ children }) => (
  <div className="tag">{children}</div>
);

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Dominate Your Next Interview with{' '}
              <span className="gradient-text">CodePrep AI</span>
            </h1>
            
            <div className="feature-tags">
              <FeatureTag>Interview Copilot</FeatureTag>
              <FeatureTag>Resume <span className="highlight">AI Enhancement</span></FeatureTag>
              <FeatureTag>Smart <span className="highlight">Code Reviews</span></FeatureTag>
            </div>

            <p className="hero-description">
              Master Your Next Role in 30 Days or Less with CodePrep AI—
              the comprehensive interview solution trusted by over <strong>250,000 developers</strong> worldwide.
            </p>

            <div className="feature-highlight">
              <p>From <strong>Advanced Coding Challenges</strong> and real-time AI feedback to 
              coding assessments in over <strong>40+ languages</strong>, we've engineered everything 
              you need to excel.</p>
            </div>

            <button className="cta-button">
              Install the CodePrep AI Extension
            </button>

            <p className="subtitle">Now offering AI interview prep in 40+ programming languages</p>
          </div>

          <div className="hero-visual">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;