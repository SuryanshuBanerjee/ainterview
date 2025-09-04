import React from 'react';

const FeatureItem = ({ icon, title, description }) => (
  <div className="copilot-feature">
    <div className="feature-icon">{icon}</div>
    <div className="feature-content">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  </div>
);

const ChallengeCard = ({ title, description, difficulty, time, type }) => (
  <div className="challenge-card">
    <div className="challenge-header">
      <h4>{title}</h4>
      <span className={`difficulty ${difficulty.toLowerCase()}`}>{difficulty}</span>
    </div>
    <p className="challenge-description">{description}</p>
    <div className="challenge-actions">
      <button className="challenge-btn solve">💻 Solve</button>
      <button className="challenge-btn save">⭐ Save</button>
      <span className="challenge-time">{time}</span>
    </div>
    {type && <div className="challenge-type">{type}</div>}
  </div>
);

const InterviewCopilot = () => {
  const challenges = [
    {
      title: "Algorithm Challenge",
      description: "Implement a function to find the longest substring without repeating characters",
      difficulty: "Medium",
      time: "10:30 AM"
    },
    {
      title: "System Design",
      description: "Design a distributed cache system with time-based expiration",
      difficulty: "Hard",
      time: "11:45 AM",
      type: "System"
    },
    {
      title: "Debugging Exercise",
      description: "Fix the race condition in the provided concurrent code sample",
      difficulty: "Medium",
      time: "2:15 PM"
    }
  ];

  return (
    <section id="interview-copilot" className="copilot-section">
      <div className="container">
        <div className="copilot-content">
          <div className="copilot-left">
            <div className="copilot-window">
              <div className="window-header">
                <div className="window-controls">
                  <span className="control red"></span>
                  <span className="control yellow"></span>
                  <span className="control green"></span>
                </div>
                <div className="window-tabs">
                  <span className="tab">Coming Soon</span>
                  <span className="tab active">InterviewVoice</span>
                </div>
              </div>
              
              <div className="window-nav">
                <span className="nav-item active">Challenges</span>
                <span className="nav-item">Feedback</span>
                <span className="nav-item">Resources</span>
              </div>
              
              <div className="challenges-list">
                {challenges.map((challenge, index) => (
                  <ChallengeCard key={index} {...challenge} />
                ))}
              </div>
            </div>
          </div>
          
          <div className="copilot-right">
            <div className="section-badge copilot-badge">
              <span>NEXT-GEN TOOL</span>
            </div>
            
            <h2 className="section-title">
              Interview Copilot: <span className="gradient-text">Your AI-Powered Coding Interview Assistant</span>
            </h2>
            
            <p className="section-description">
              Master technical interviews with personalized preparation tailored for top tech companies.
            </p>
            
            <div className="features-list">
              <FeatureItem
                icon="⚡"
                title="AI-Powered Insights"
                description="Get personalized feedback on your code solutions and interview responses with advanced AI analysis."
              />
              <FeatureItem
                icon="💻"
                title="Real-World Challenges"
                description="Practice with a vast library of coding challenges sourced from actual interviews at leading tech companies."
              />
              <FeatureItem
                icon="📚"
                title="Comprehensive Resources"
                description="Access curated learning materials, system design templates, and behavioral interview guides."
              />
            </div>
            
            <div className="copilot-actions">
              <button className="primary-cta-btn">Get Started Free</button>
              <button className="secondary-cta-btn">Learn more →</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InterviewCopilot;