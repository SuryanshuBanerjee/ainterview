import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Play, CheckCircle, XCircle } from 'lucide-react';

function ChallengeDetail() {
  const { slug } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadChallenge();
  }, [slug]);

  useEffect(() => {
    if (challenge && challenge.starterCode) {
      setCode(challenge.starterCode[language] || '');
    }
  }, [challenge, language]);

  const loadChallenge = async () => {
    try {
      const { data } = await api.get(`/challenges/${slug}`);
      setChallenge(data.challenge);
      setSubmissions(data.submissions);
      if (data.challenge.starterCode?.javascript) {
        setCode(data.challenge.starterCode.javascript);
      }
    } catch (error) {
      toast.error('Failed to load challenge');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post(`/challenges/${slug}/submit`, {
        code,
        language
      });

      setResult(data.submission);

      if (data.submission.status === 'accepted') {
        toast.success('All test cases passed!');
      } else {
        toast.error(data.errorMessage || 'Some test cases failed');
      }

      loadChallenge(); // Reload to get updated submissions
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit solution');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div style={styles.loading}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.layout}>
            {/* Problem Description */}
            <div style={styles.problemPanel}>
              <h1 style={styles.title}>{challenge.title}</h1>

              <div style={styles.meta}>
                <span style={{
                  ...styles.difficultyBadge,
                  background: challenge.difficulty === 'easy'
                    ? 'rgba(0, 255, 136, 0.2)'
                    : challenge.difficulty === 'medium'
                    ? 'rgba(0, 217, 255, 0.2)'
                    : 'rgba(255, 102, 136, 0.2)',
                  color: challenge.difficulty === 'easy'
                    ? 'var(--accent-green)'
                    : challenge.difficulty === 'medium'
                    ? 'var(--accent-cyan)'
                    : '#ff6688'
                }}>
                  {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                </span>
                <span style={styles.category}>{challenge.category}</span>
              </div>

              <div style={styles.description}>
                <p>{challenge.description}</p>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Examples</h3>
                {challenge.examples.map((example, i) => (
                  <div key={i} style={styles.example}>
                    <p><strong>Input:</strong> {example.input}</p>
                    <p><strong>Output:</strong> {example.output}</p>
                    {example.explanation && (
                      <p><strong>Explanation:</strong> {example.explanation}</p>
                    )}
                  </div>
                ))}
              </div>

              {challenge.constraints && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Constraints</h3>
                  <ul style={styles.list}>
                    {challenge.constraints.map((constraint, i) => (
                      <li key={i}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Previous Submissions */}
              {submissions.length > 0 && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Your Submissions</h3>
                  <div style={styles.submissions}>
                    {submissions.slice(0, 5).map((sub) => (
                      <div key={sub._id} style={styles.submission}>
                        <div style={styles.submissionStatus}>
                          {sub.status === 'accepted' ? (
                            <CheckCircle size={18} style={{ color: 'var(--accent-green)' }} />
                          ) : (
                            <XCircle size={18} style={{ color: '#ff3366' }} />
                          )}
                          <span>{sub.status}</span>
                        </div>
                        <span style={styles.submissionMeta}>
                          {sub.language} • {new Date(sub.submittedAt).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Code Editor */}
            <div style={styles.editorPanel}>
              <div style={styles.editorHeader}>
                <select
                  className="input"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="go">Go</option>
                </select>

                <button
                  className="btn btn-success"
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{ marginLeft: 'auto' }}
                >
                  {submitting ? (
                    <div className="spinner" />
                  ) : (
                    <>
                      <Play size={18} />
                      Submit
                    </>
                  )}
                </button>
              </div>

              <textarea
                style={styles.codeEditor}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your solution here..."
                spellCheck={false}
              />

              {/* Result Panel */}
              {result && (
                <div style={{
                  ...styles.resultPanel,
                  background: result.status === 'accepted'
                    ? 'rgba(0, 255, 136, 0.1)'
                    : 'rgba(255, 51, 102, 0.1)',
                  borderColor: result.status === 'accepted'
                    ? 'rgba(0, 255, 136, 0.3)'
                    : 'rgba(255, 51, 102, 0.3)'
                }}>
                  <div style={styles.resultHeader}>
                    {result.status === 'accepted' ? (
                      <CheckCircle size={24} style={{ color: 'var(--accent-green)' }} />
                    ) : (
                      <XCircle size={24} style={{ color: '#ff3366' }} />
                    )}
                    <h3>
                      {result.status === 'accepted' ? 'Accepted!' : 'Failed'}
                    </h3>
                  </div>

                  {result.errorMessage && (
                    <div style={styles.errorMessage}>
                      {result.errorMessage}
                    </div>
                  )}

                  <div style={styles.resultStats}>
                    <div style={styles.resultStat}>
                      <span style={styles.resultLabel}>Test Cases</span>
                      <span style={styles.resultValue}>
                        {result.testCasesPassed}/{result.totalTestCases}
                      </span>
                    </div>
                    <div style={styles.resultStat}>
                      <span style={styles.resultLabel}>Runtime</span>
                      <span style={styles.resultValue}>{result.runtime}ms</span>
                    </div>
                    <div style={styles.resultStat}>
                      <span style={styles.resultLabel}>Memory</span>
                      <span style={styles.resultValue}>{result.memory}KB</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
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
    maxWidth: '1600px',
    margin: '0 auto'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 80px)'
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem'
  },
  problemPanel: {
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '2rem',
    height: 'calc(100vh - 140px)',
    overflowY: 'auto'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '1rem'
  },
  meta: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem'
  },
  difficultyBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: 600
  },
  category: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    background: 'var(--tertiary-dark)',
    color: 'var(--accent-purple)',
    textTransform: 'capitalize'
  },
  description: {
    marginBottom: '2rem',
    lineHeight: 1.7,
    color: 'var(--text-secondary)'
  },
  section: {
    marginBottom: '2rem'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '1rem'
  },
  example: {
    background: 'var(--tertiary-dark)',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontFamily: 'monospace'
  },
  list: {
    paddingLeft: '1.5rem',
    color: 'var(--text-secondary)',
    lineHeight: 2
  },
  submissions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  submission: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    background: 'var(--tertiary-dark)',
    borderRadius: '8px'
  },
  submissionStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 600,
    textTransform: 'capitalize'
  },
  submissionMeta: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)'
  },
  editorPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  editorHeader: {
    display: 'flex',
    gap: '1rem',
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1rem'
  },
  codeEditor: {
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.5rem',
    color: 'var(--text-primary)',
    fontFamily: 'monospace',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    resize: 'none',
    height: 'calc(100vh - 380px)',
    outline: 'none'
  },
  resultPanel: {
    padding: '1.5rem',
    border: '1px solid',
    borderRadius: '12px'
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem'
  },
  errorMessage: {
    padding: '1rem',
    background: 'rgba(255, 51, 102, 0.1)',
    border: '1px solid rgba(255, 51, 102, 0.3)',
    borderRadius: '8px',
    color: '#ff6688',
    marginBottom: '1rem',
    fontFamily: 'monospace',
    fontSize: '0.9rem'
  },
  resultStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem'
  },
  resultStat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  resultLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)'
  },
  resultValue: {
    fontSize: '1.25rem',
    fontWeight: 700
  }
};

export default ChallengeDetail;
