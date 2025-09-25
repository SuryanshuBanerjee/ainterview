import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { currentUser, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    skills: [],
    experience: '',
    education: '',
    newSkill: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        skills: currentUser.skills || [],
        experience: currentUser.experience || '',
        education: currentUser.education || '',
        newSkill: ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddSkill = () => {
    if (formData.newSkill.trim() && !formData.skills.includes(formData.newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, formData.newSkill.trim()],
        newSkill: ''
      });
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { newSkill, ...profileData } = formData;
      await updateProfile(profileData);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
      console.error('Error updating profile:', error);
    }

    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <p>Manage your personal information and skills</p>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h2>Personal Information</h2>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience">Experience</label>
            <input
              type="text"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g., 3 years, Fresher, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="education">Education</label>
            <input
              type="text"
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="Your highest qualification"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Skills</h2>

          <div className="skills-input">
            <div className="skill-add-section">
              <input
                type="text"
                name="newSkill"
                value={formData.newSkill}
                onChange={handleChange}
                placeholder="Add a new skill"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="btn-secondary add-skill-btn"
              >
                Add Skill
              </button>
            </div>

            <div className="skills-list">
              {formData.skills.map((skill, index) => (
                <div key={index} className="skill-tag">
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="remove-skill"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {formData.skills.length === 0 && (
              <p className="no-skills">No skills added yet. Add some skills to showcase your expertise!</p>
            )}
          </div>
        </div>

        <div className="profile-stats">
          <h2>Profile Stats</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{currentUser?.resume_score || 0}</span>
              <span className="stat-label">Resume Score</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{formData.skills.length}</span>
              <span className="stat-label">Skills Listed</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {formData.name && formData.experience && formData.education ? '100' :
                 (formData.name ? 33 : 0) + (formData.experience ? 33 : 0) + (formData.education ? 34 : 0)}%
              </span>
              <span className="stat-label">Profile Complete</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary save-profile-btn"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}