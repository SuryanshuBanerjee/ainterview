import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Send, Loader, StopCircle, TrendingUp } from 'lucide-react';

function InterviewChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadInterview();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [interview?.messages]);

  const loadInterview = async () => {
    try {
      const { data } = await api.get(`/interviews/${id}`);
      setInterview(data.interview);
      if (data.interview.status === 'completed') {
        setShowFeedback(true);
      }
    } catch (error) {
      toast.error('Failed to load interview');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      const { data } = await api.post(`/interviews/${id}/message`, { message });
      setInterview(data.interview);
      setMessage('');

      // Check if interview was auto-ended
      if (data.autoEnded) {
        setShowFeedback(true);
        toast.success('Interview completed! View your feedback below.');
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleComplete = async () => {
    if (!window.confirm('Are you sure you want to end this interview?')) return;

    try {
      const { data } = await api.put(`/interviews/${id}/complete`);
      setInterview(data.interview);
      setShowFeedback(true);
      toast.success('Interview completed!');
    } catch (error) {
      toast.error('Failed to complete interview');
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
          {/* Header */}
          <div style={styles.interviewHeader}>
            <div>
              <h1 style={styles.title}>
                {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)} Interview
              </h1>
              <p style={styles.subtitle}>
                Difficulty: {interview.difficulty} • Status: {interview.status}
              </p>
            </div>
            {interview.status === 'in-progress' && (
              <button
                className="btn btn-secondary"
                onClick={handleComplete}
                style={{ background: '#ff3366', borderColor: '#ff3366' }}
              >
                <StopCircle size={18} />
                End Interview
              </button>
            )}
          </div>

          <div style={styles.layout}>
            {/* Chat Area */}
            <div style={styles.chatArea}>
              <div style={styles.chatWindow}>
                <div style={styles.messages}>
                  {interview.messages
                    .filter((msg) => msg.role !== 'system')
                    .map((msg, index) => (
                      <div
                        key={index}
                        style={{
                          ...styles.message,
                          ...(msg.role === 'user' ? styles.messageUser : styles.messageAssistant)
                        }}
                      >
                        <div style={styles.messageRole}>
                          {msg.role === 'user' ? 'You' : 'AI Interviewer'}
                        </div>
                        <div style={styles.messageContent}>{msg.content}</div>
                        <div style={styles.messageTime}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  <div ref={messagesEndRef} />
                </div>

                {interview.status === 'in-progress' && (
                  <form onSubmit={handleSend} style={styles.inputArea}>
                    <input
                      className="input"
                      placeholder="Type your response..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={sending}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={sending || !message.trim()}
                    >
                      {sending ? <Loader className="spinner" size={18} /> : <Send size={18} />}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Feedback Panel */}
            {showFeedback && interview.feedback && (
              <div style={styles.feedbackPanel}>
                <h2 style={styles.feedbackTitle}>
                  <TrendingUp size={24} />
                  Interview Feedback
                </h2>

                <div style={styles.scoreCard}>
                  <div style={styles.overallScore}>
                    <span style={styles.scoreNumber}>{interview.feedback.overallScore}</span>
                    <span style={styles.scoreLabel}>Overall Score</span>
                  </div>
                </div>

                <div style={styles.skillScores}>
                  <div style={styles.skillScore}>
                    <span style={styles.skillLabel}>Technical Skills</span>
                    <div style={styles.scoreBar}>
                      <div
                        style={{
                          ...styles.scoreBarFill,
                          width: `${(interview.feedback.technicalSkills / 10) * 100}%`
                        }}
                      />
                    </div>
                    <span style={styles.skillValue}>{interview.feedback.technicalSkills}/10</span>
                  </div>

                  <div style={styles.skillScore}>
                    <span style={styles.skillLabel}>Communication</span>
                    <div style={styles.scoreBar}>
                      <div
                        style={{
                          ...styles.scoreBarFill,
                          width: `${(interview.feedback.communication / 10) * 100}%`
                        }}
                      />
                    </div>
                    <span style={styles.skillValue}>{interview.feedback.communication}/10</span>
                  </div>

                  <div style={styles.skillScore}>
                    <span style={styles.skillLabel}>Problem Solving</span>
                    <div style={styles.scoreBar}>
                      <div
                        style={{
                          ...styles.scoreBarFill,
                          width: `${(interview.feedback.problemSolving / 10) * 100}%`
                        }}
                      />
                    </div>
                    <span style={styles.skillValue}>{interview.feedback.problemSolving}/10</span>
                  </div>
                </div>

                <div style={styles.feedbackSection}>
                  <h3 style={styles.sectionTitle}>Strengths</h3>
                  <ul style={styles.list}>
                    {interview.feedback.strengths.map((strength, i) => (
                      <li key={i} style={styles.listItem}>{strength}</li>
                    ))}
                  </ul>
                </div>

                <div style={styles.feedbackSection}>
                  <h3 style={styles.sectionTitle}>Areas for Improvement</h3>
                  <ul style={styles.list}>
                    {interview.feedback.improvements.map((improvement, i) => (
                      <li key={i} style={styles.listItem}>{improvement}</li>
                    ))}
                  </ul>
                </div>

                <div style={styles.feedbackSection}>
                  <h3 style={styles.sectionTitle}>Recommendations</h3>
                  <ul style={styles.list}>
                    {interview.feedback.recommendations.map((rec, i) => (
                      <li key={i} style={styles.listItem}>{rec}</li>
                    ))}
                  </ul>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/interviews')}
                  style={{ width: '100%' }}
                >
                  Back to Interviews
                </button>
              </div>
            )}
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
    maxWidth: '1400px',
    margin: '0 auto'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 80px)'
  },
  interviewHeader: {
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
    marginTop: '0.5rem',
    textTransform: 'capitalize'
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem'
  },
  chatArea: {
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 240px)'
  },
  chatWindow: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  message: {
    padding: '1rem',
    borderRadius: '12px',
    maxWidth: '80%'
  },
  messageUser: {
    background: 'var(--tertiary-dark)',
    border: '1px solid var(--border-color)',
    alignSelf: 'flex-end'
  },
  messageAssistant: {
    background: 'rgba(108, 92, 231, 0.1)',
    border: '1px solid rgba(108, 92, 231, 0.3)',
    alignSelf: 'flex-start'
  },
  messageRole: {
    fontSize: '0.85rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: 'var(--accent-purple)'
  },
  messageContent: {
    lineHeight: 1.6,
    marginBottom: '0.5rem'
  },
  messageTime: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  inputArea: {
    padding: '1rem',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    gap: '1rem'
  },
  feedbackPanel: {
    background: 'var(--secondary-dark)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.5rem',
    height: 'fit-content',
    maxHeight: 'calc(100vh - 240px)',
    overflowY: 'auto'
  },
  feedbackTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  scoreCard: {
    background: 'var(--tertiary-dark)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  overallScore: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  scoreNumber: {
    fontSize: '3rem',
    fontWeight: 700,
    color: 'var(--accent-green)'
  },
  scoreLabel: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem'
  },
  skillScores: {
    marginBottom: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  skillScore: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  skillLabel: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)'
  },
  scoreBar: {
    height: '8px',
    background: 'var(--tertiary-dark)',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  scoreBarFill: {
    height: '100%',
    background: 'var(--gradient-primary)',
    transition: 'width 0.3s ease'
  },
  skillValue: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--accent-cyan)'
  },
  feedbackSection: {
    marginBottom: '1.5rem'
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '0.75rem'
  },
  list: {
    paddingLeft: '1.5rem',
    color: 'var(--text-secondary)'
  },
  listItem: {
    marginBottom: '0.5rem',
    lineHeight: 1.5
  }
};

export default InterviewChat;
