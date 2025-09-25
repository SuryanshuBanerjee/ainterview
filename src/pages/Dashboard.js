import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Use fallback data
      setStats({
        resume_score: 78,
        interviews_completed: 12,
        quiz_scores: { average: 82, best: 95 },
        applications_sent: 8,
        recent_activity: [
          { action: 'Completed DSA Quiz', score: '85%', date: '2024-01-15' },
          { action: 'Updated Resume', score: 'ATS Score: 78', date: '2024-01-14' },
          { action: 'Practice Interview', score: 'Technical Round', date: '2024-01-13' }
        ]
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {currentUser?.name || 'User'}!</h1>
        <p>Here's your career preparation progress</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon resume-icon">📄</div>
          <div className="stat-info">
            <h3>Resume Score</h3>
            <p className="stat-value">{stats?.resume_score || 0}/100</p>
            <Link to="/resume-analyzer" className="stat-link">Improve Score →</Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon interview-icon">🎤</div>
          <div className="stat-info">
            <h3>Interviews Completed</h3>
            <p className="stat-value">{stats?.interviews_completed || 0}</p>
            <Link to="/interview-prep" className="stat-link">Practice More →</Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon quiz-icon">🧠</div>
          <div className="stat-info">
            <h3>Quiz Average</h3>
            <p className="stat-value">{stats?.quiz_scores?.average || 0}%</p>
            <Link to="/dsa-quiz" className="stat-link">Take Quiz →</Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon application-icon">📊</div>
          <div className="stat-info">
            <h3>Applications Sent</h3>
            <p className="stat-value">{stats?.applications_sent || 0}</p>
            <Link to="/placements" className="stat-link">View Positions →</Link>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-grid">
            <Link to="/resume-analyzer" className="action-card">
              <div className="action-icon">📋</div>
              <h3>Analyze Resume</h3>
              <p>Get ATS score and feedback</p>
            </Link>
            <Link to="/interview-prep" className="action-card">
              <div className="action-icon">💬</div>
              <h3>Practice Interview</h3>
              <p>Prepare for common questions</p>
            </Link>
            <Link to="/dsa-quiz" className="action-card">
              <div className="action-icon">🔢</div>
              <h3>DSA Quiz</h3>
              <p>Test your coding knowledge</p>
            </Link>
            <Link to="/placements" className="action-card">
              <div className="action-icon">🏢</div>
              <h3>Job Positions</h3>
              <p>Apply to available roles</p>
            </Link>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {stats?.recent_activity?.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-info">
                  <h4>{activity.action}</h4>
                  <p>{activity.score}</p>
                </div>
                <div className="activity-date">{activity.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}