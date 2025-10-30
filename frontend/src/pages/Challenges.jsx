import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Code, Search, Filter } from 'lucide-react';

function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    loadChallenges();
  }, [difficulty, category]);

  const loadChallenges = async () => {
    try {
      const params = new URLSearchParams();
      if (difficulty) params.append('difficulty', difficulty);
      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const { data } = await api.get(`/challenges?${params}`);
      setChallenges(data.challenges);
    } catch (error) {
      toast.error('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadChallenges();
  };

  const difficultyColors = {
    easy: 'var(--accent-green)',
    medium: 'var(--accent-cyan)',
    hard: '#ff6688'
  };

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>Coding Challenges</h1>
              <p style={styles.subtitle}>Practice with real interview problems</p>
            </div>
          </div>

          {/* Filters */}
          <div style={styles.filters}>
            <form onSubmit={handleSearch} style={styles.searchForm}>
              <div style={styles.searchBox}>
                <Search size={20} style={{ color: 'var(--text-muted)' }} />
                <input
                  className="input"
                  placeholder="Search challenges..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ border: 'none', background: 'transparent' }}
                />
              </div>
            </form>

            <select
              className="input"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="">All Categories</option>
              <option value="arrays">Arrays</option>
              <option value="strings">Strings</option>
              <option value="linked-lists">Linked Lists</option>
              <option value="trees">Trees</option>
              <option value="graphs">Graphs</option>
              <option value="dynamic-programming">Dynamic Programming</option>
              <option value="sorting">Sorting</option>
              <option value="searching">Searching</option>
              <option value="recursion">Recursion</option>
            </select>
          </div>

          {/* Challenges List */}
          {loading ? (
            <div style={styles.loading}>
              <div className="spinner" />
            </div>
          ) : challenges.length === 0 ? (
            <div style={styles.empty}>
              <Code size={64} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h2>No challenges found</h2>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            <div style={styles.list}>
              {challenges.map((challenge) => (
                <Link
                  key={challenge._id}
                  to={`/challenges/${challenge.slug}`}
                  style={styles.challengeCard}
                >
                  <div style={styles.challengeHeader}>
                    <div>
                      <h3 style={styles.challengeTitle}>{challenge.title}</h3>
                      <p style={styles.challengeDesc}>
                        {challenge.description.slice(0, 120)}...
                      </p>
                    </div>
                    <span
                      style={{
                        ...styles.difficultyBadge,
                        background: difficultyColors[challenge.difficulty] + '20',
                        color: difficultyColors[challenge.difficulty]
                      }}
                    >
                      {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                    </span>
                  </div>

                  <div style={styles.challengeFooter}>
                    <div style={styles.tags}>
                      <span style={styles.tag}>{challenge.category}</span>
                      {challenge.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} style={styles.tag}>{tag}</span>
                      ))}
                    </div>
                    <div style={styles.stats}>
                      <span style={styles.stat}>
                        {challenge.acceptanceRate.toFixed(0)}% acceptance
                      </span>
                      <span style={styles.stat}>
                        {challenge.totalSubmissions} submissions
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
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
    maxWidth: '1400px',
    margin: '0 auto'
  },
  header: {
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
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  searchForm: {
    flex: 1,
    minWidth: '300px'
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0 1rem',
    background: 'var(--tertiary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: '4rem'
  },
  empty: {
    textAlign: 'center',
    padding: '4rem',
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  challengeCard: {
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.5rem',
    textDecoration: 'none',
    transition: 'all 0.3s ease'
  },
  challengeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    gap: '1rem'
  },
  challengeTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.5rem'
  },
  challengeDesc: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    lineHeight: 1.5
  },
  difficultyBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: 600,
    whiteSpace: 'nowrap'
  },
  challengeFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  tags: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  tag: {
    background: 'var(--tertiary-dark)',
    padding: '0.25rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    color: 'var(--accent-purple)',
    textTransform: 'capitalize'
  },
  stats: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.85rem',
    color: 'var(--text-muted)'
  },
  stat: {
    display: 'inline-block'
  }
};

export default Challenges;
