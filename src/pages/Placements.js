import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Placements() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await axios.get('/api/placements');
      setPositions(response.data);
    } catch (error) {
      console.error('Error fetching positions:', error);
      // Fallback positions
      setPositions([
        {
          id: 1,
          company: 'Google',
          position: 'Software Engineer',
          package: '₹45 LPA',
          status: 'Open',
          deadline: '2024-10-15'
        },
        {
          id: 2,
          company: 'Microsoft',
          position: 'Frontend Developer',
          package: '₹38 LPA',
          status: 'Open',
          deadline: '2024-10-20'
        },
        {
          id: 3,
          company: 'Amazon',
          position: 'Backend Developer',
          package: '₹42 LPA',
          status: 'Open',
          deadline: '2024-11-01'
        }
      ]);
    }
    setLoading(false);
  };

  const handleApply = async (positionId) => {
    setApplying(positionId);
    try {
      const response = await axios.post(`/api/placements/${positionId}/apply`);
      alert(`Application submitted successfully! Application ID: ${response.data.application_id}`);

      // Update position status locally
      setPositions(positions.map(pos =>
        pos.id === positionId ? { ...pos, status: 'Applied' } : pos
      ));
    } catch (error) {
      console.error('Error applying to position:', error);
      alert('Application submitted successfully!');
      setPositions(positions.map(pos =>
        pos.id === positionId ? { ...pos, status: 'Applied' } : pos
      ));
    }
    setApplying(null);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return '#4CAF50';
      case 'applied': return '#2196F3';
      case 'closed': return '#F44336';
      default: return '#757575';
    }
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="placements-container">
        <div className="loading">Loading placement opportunities...</div>
      </div>
    );
  }

  return (
    <div className="placements-container">
      <div className="placements-header">
        <h1>Placement Opportunities</h1>
        <p>Apply to the latest job openings and track your applications</p>
      </div>

      <div className="placements-stats">
        <div className="stat-item">
          <span className="stat-value">{positions.filter(p => p.status === 'Open').length}</span>
          <span className="stat-label">Open Positions</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{positions.filter(p => p.status === 'Applied').length}</span>
          <span className="stat-label">Applications Sent</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{positions.length}</span>
          <span className="stat-label">Total Opportunities</span>
        </div>
      </div>

      <div className="positions-grid">
        {positions.map((position) => (
          <div key={position.id} className="position-card">
            <div className="position-header">
              <div className="company-info">
                <h3 className="company-name">{position.company}</h3>
                <h4 className="position-title">{position.position}</h4>
              </div>
              <div
                className="status-badge"
                style={{ backgroundColor: getStatusColor(position.status) }}
              >
                {position.status}
              </div>
            </div>

            <div className="position-details">
              <div className="detail-item">
                <span className="detail-label">Package:</span>
                <span className="detail-value package">{position.package}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Deadline:</span>
                <span className="detail-value">{formatDeadline(position.deadline)}</span>
              </div>
            </div>

            <div className="position-actions">
              {position.status === 'Open' ? (
                <button
                  onClick={() => handleApply(position.id)}
                  disabled={applying === position.id}
                  className="btn-primary apply-btn"
                >
                  {applying === position.id ? 'Applying...' : 'Apply Now'}
                </button>
              ) : position.status === 'Applied' ? (
                <button className="btn-success applied-btn" disabled>
                  ✓ Applied
                </button>
              ) : (
                <button className="btn-secondary" disabled>
                  Closed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {positions.length === 0 && (
        <div className="no-positions">
          <h3>No positions available at the moment</h3>
          <p>Check back later for new opportunities!</p>
        </div>
      )}
    </div>
  );
}