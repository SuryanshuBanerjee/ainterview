import { useEffect, useState } from 'react';
import Header from '../components/Header';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Search, Briefcase, Building, MapPin, DollarSign, TrendingUp, ExternalLink, Star, Bookmark, BookmarkCheck } from 'lucide-react';

function Positions() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [savedPositions, setSavedPositions] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    loadSavedPositions();
  }, []);

  const loadSavedPositions = async () => {
    try {
      const { data } = await api.get('/positions');
      setSavedPositions(data.positions);
    } catch (error) {
      toast.error('Failed to load saved positions');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      toast.error('Please enter a job title or keyword');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        query: searchQuery,
        ...(searchLocation && { location: searchLocation })
      });

      const { data } = await api.get(`/positions/search?${params}`);
      setJobs(data.jobs);

      if (data.jobs.length === 0) {
        toast('No jobs found. Try different keywords.', { icon: '🔍' });
      } else {
        toast.success(`Found ${data.jobs.length} jobs!`);
      }
    } catch (error) {
      toast.error('Failed to search jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (job) => {
    try {
      await api.post('/positions', {
        title: job.job_title,
        company: {
          name: job.employer_name,
          location: `${job.job_city || ''}${job.job_state ? ', ' + job.job_state : ''}`.trim() || 'Remote'
        },
        jobDescription: job.job_description,
        salary: {
          min: job.job_min_salary,
          max: job.job_max_salary
        },
        applicationStatus: 'interested',
        jobUrl: job.job_apply_link,
        source: 'Job Search'
      });

      toast.success('Job saved successfully!');
      loadSavedPositions();
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  const isJobSaved = (jobId) => {
    return savedPositions.some(pos =>
      pos.title === jobs.find(j => j.job_id === jobId)?.job_title
    );
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'var(--accent-green)';
    if (score >= 60) return 'var(--accent-cyan)';
    if (score >= 40) return 'var(--accent-purple)';
    return '#ff6688';
  };

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <div style={styles.content}>
          {/* Header */}
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>Job Search</h1>
              <p style={styles.subtitle}>
                Find jobs that match your profile and get AI-powered recommendations
              </p>
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => setShowSaved(!showSaved)}
            >
              {showSaved ? <Search size={20} /> : <Bookmark size={20} />}
              {showSaved ? 'Search Jobs' : `Saved (${savedPositions.length})`}
            </button>
          </div>

          {!showSaved ? (
            <>
              {/* Search Form */}
              <form onSubmit={handleSearch} style={styles.searchForm}>
                <div style={styles.searchInputs}>
                  <div style={{ flex: 2 }}>
                    <input
                      className="input"
                      placeholder="Job title, keywords, or company..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      className="input"
                      placeholder="Location (optional)"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {loading ? (
                      <div className="spinner" />
                    ) : (
                      <>
                        <Search size={20} />
                        Search
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Results */}
              {loading ? (
                <div style={styles.loading}>
                  <div className="spinner" style={{ width: '50px', height: '50px' }} />
                  <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                    Searching jobs and analyzing matches...
                  </p>
                </div>
              ) : jobs.length === 0 ? (
                <div style={styles.empty}>
                  <Briefcase size={64} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                  <h2>Start Your Job Search</h2>
                  <p>Enter a job title or keywords to find positions that match your profile</p>
                  <div style={styles.exampleSearches}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Try searching:</p>
                    <div style={styles.exampleTags}>
                      {['Software Engineer', 'Frontend Developer', 'Full Stack', 'DevOps'].map(term => (
                        <button
                          key={term}
                          className="btn btn-secondary"
                          onClick={() => {
                            setSearchQuery(term);
                            setTimeout(() => handleSearch({ preventDefault: () => {} }), 100);
                          }}
                          style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div style={styles.resultsHeader}>
                    <h3 style={{ fontSize: '1.1rem' }}>
                      {jobs.length} job{jobs.length !== 1 ? 's' : ''} found • Sorted by match score
                    </h3>
                  </div>

                  <div style={styles.jobsList}>
                    {jobs.map((job) => (
                      <div key={job.job_id} style={styles.jobCard}>
                        {/* Match Score Badge */}
                        <div
                          style={{
                            ...styles.matchBadge,
                            background: getMatchScoreColor(job.matchScore) + '20',
                            borderColor: getMatchScoreColor(job.matchScore)
                          }}
                        >
                          <Star size={16} style={{ fill: getMatchScoreColor(job.matchScore), color: getMatchScoreColor(job.matchScore) }} />
                          <span style={{ color: getMatchScoreColor(job.matchScore), fontWeight: 700 }}>
                            {job.matchScore}% Match
                          </span>
                        </div>

                        <div style={styles.jobHeader}>
                          <div>
                            <h3 style={styles.jobTitle}>{job.job_title}</h3>
                            <div style={styles.jobMeta}>
                              <div style={styles.metaItem}>
                                <Building size={16} />
                                <span>{job.employer_name}</span>
                              </div>
                              {(job.job_city || job.job_state) && (
                                <div style={styles.metaItem}>
                                  <MapPin size={16} />
                                  <span>
                                    {job.job_city}{job.job_state ? `, ${job.job_state}` : ''}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Recommendation */}
                        <div
                          style={{
                            ...styles.recommendation,
                            background: job.recommendation.color + '15',
                            borderColor: job.recommendation.color + '50'
                          }}
                        >
                          <TrendingUp size={18} style={{ color: job.recommendation.color }} />
                          <span style={{ color: job.recommendation.color, fontWeight: 600 }}>
                            {job.recommendation.message}
                          </span>
                        </div>

                        {/* Job Description */}
                        <p style={styles.jobDescription}>
                          {job.job_description.slice(0, 250)}
                          {job.job_description.length > 250 ? '...' : ''}
                        </p>

                        {/* Skills */}
                        {job.job_required_skills && job.job_required_skills.length > 0 && (
                          <div style={styles.skills}>
                            {job.job_required_skills.slice(0, 6).map((skill, idx) => (
                              <span key={idx} style={styles.skill}>
                                {skill}
                              </span>
                            ))}
                            {job.job_required_skills.length > 6 && (
                              <span style={styles.skill}>+{job.job_required_skills.length - 6}</span>
                            )}
                          </div>
                        )}

                        {/* Salary */}
                        {job.job_min_salary && job.job_max_salary && (
                          <div style={styles.salary}>
                            <DollarSign size={18} />
                            <span>
                              ${(job.job_min_salary / 1000).toFixed(0)}k - ${(job.job_max_salary / 1000).toFixed(0)}k {job.job_salary_currency || 'USD'}
                            </span>
                          </div>
                        )}

                        {/* Actions */}
                        <div style={styles.jobActions}>
                          <a
                            href={job.job_apply_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                          >
                            <ExternalLink size={18} />
                            Apply Now
                          </a>
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleSaveJob(job)}
                            disabled={isJobSaved(job.job_id)}
                            style={{ padding: '0 1.25rem' }}
                          >
                            {isJobSaved(job.job_id) ? (
                              <BookmarkCheck size={20} />
                            ) : (
                              <Bookmark size={20} />
                            )}
                          </button>
                        </div>

                        {/* Posted Date */}
                        <div style={styles.postedDate}>
                          Posted {new Date(job.job_posted_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            /* Saved Positions View */
            <div style={styles.savedView}>
              {savedPositions.length === 0 ? (
                <div style={styles.empty}>
                  <Bookmark size={64} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                  <h2>No Saved Jobs</h2>
                  <p>Save jobs from search results to track your applications</p>
                </div>
              ) : (
                <div style={styles.grid}>
                  {savedPositions.map((position) => (
                    <div key={position._id} style={styles.card}>
                      <div style={styles.cardHeader}>
                        <div>
                          <h3 style={styles.cardTitle}>{position.title}</h3>
                          <div style={styles.companyInfo}>
                            <Building size={16} />
                            <span>{position.company.name}</span>
                          </div>
                          {position.company.location && (
                            <div style={styles.companyInfo}>
                              <MapPin size={16} />
                              <span>{position.company.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={styles.cardBody}>
                        <p style={styles.description}>
                          {position.jobDescription.slice(0, 150)}...
                        </p>

                        {position.salary.min && position.salary.max && (
                          <div style={styles.salary}>
                            <DollarSign size={16} />
                            <span>
                              ${position.salary.min.toLocaleString()} - ${position.salary.max.toLocaleString()}
                            </span>
                          </div>
                        )}

                        <div style={styles.status}>
                          <span
                            style={{
                              ...styles.statusBadge,
                              background: 'var(--accent-cyan)20',
                              color: 'var(--accent-cyan)'
                            }}
                          >
                            {position.applicationStatus.charAt(0).toUpperCase() + position.applicationStatus.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: '80px',
    padding: '2rem',
    minHeight: 'calc(100vh - 80px)'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700
  },
  subtitle: {
    color: 'var(--text-secondary)',
    marginTop: '0.5rem'
  },
  searchForm: {
    marginBottom: '2rem'
  },
  searchInputs: {
    display: 'flex',
    gap: '1rem',
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1rem'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    textAlign: 'center'
  },
  empty: {
    textAlign: 'center',
    padding: '4rem',
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px'
  },
  exampleSearches: {
    marginTop: '2rem'
  },
  exampleTags: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  resultsHeader: {
    marginBottom: '1.5rem',
    color: 'var(--text-secondary)'
  },
  jobsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  jobCard: {
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.5rem',
    position: 'relative',
    transition: 'all 0.3s ease'
  },
  matchBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '0.9rem',
    fontWeight: 600
  },
  jobHeader: {
    marginBottom: '1rem',
    paddingRight: '140px'
  },
  jobTitle: {
    fontSize: '1.4rem',
    fontWeight: 700,
    marginBottom: '0.5rem'
  },
  jobMeta: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--text-secondary)',
    fontSize: '0.95rem'
  },
  recommendation: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid',
    marginBottom: '1rem',
    fontSize: '0.95rem'
  },
  jobDescription: {
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    marginBottom: '1rem'
  },
  skills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  skill: {
    background: 'var(--tertiary-dark)',
    padding: '0.35rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    color: 'var(--accent-cyan)'
  },
  salary: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--accent-green)',
    fontWeight: 600,
    marginBottom: '1rem',
    fontSize: '1.05rem'
  },
  jobActions: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '0.75rem'
  },
  postedDate: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    textAlign: 'right'
  },
  savedView: {
    marginTop: '1rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem'
  },
  card: {
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.5rem',
    transition: 'all 0.3s ease'
  },
  cardHeader: {
    marginBottom: '1rem'
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.75rem'
  },
  companyInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    marginBottom: '0.25rem'
  },
  cardBody: {
    marginTop: '1rem'
  },
  description: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    marginBottom: '1rem',
    lineHeight: 1.5
  },
  status: {
    display: 'flex',
    gap: '0.5rem'
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: 600
  }
};

export default Positions;
