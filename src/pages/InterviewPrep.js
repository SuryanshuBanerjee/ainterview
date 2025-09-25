import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function InterviewPrep() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all'
  });
  const [loading, setLoading] = useState(true);

  const fetchQuestions = useCallback(async () => {
    try {
      const response = await axios.get('/api/interviews/questions', {
        params: filters
      });
      setQuestions(response.data);
      if (response.data.length > 0) {
        setCurrentQuestion(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Fallback questions
      const fallbackQuestions = [
        {
          id: 1,
          category: 'Technical',
          question: 'Explain the concept of closures in JavaScript',
          difficulty: 'Medium',
          answer: 'A closure is a feature where an inner function has access to the outer function\'s variables.'
        },
        {
          id: 2,
          category: 'Behavioral',
          question: 'Tell me about a time you solved a difficult problem',
          difficulty: 'Easy',
          answer: 'Use the STAR method to structure your response.'
        }
      ];
      setQuestions(fallbackQuestions);
      setCurrentQuestion(fallbackQuestions[0]);
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleNextQuestion = () => {
    const currentIndex = questions.findIndex(q => q.id === currentQuestion?.id);
    const nextIndex = (currentIndex + 1) % questions.length;
    setCurrentQuestion(questions[nextIndex]);
    setUserAnswer('');
    setShowAnswer(false);
  };

  const handlePreviousQuestion = () => {
    const currentIndex = questions.findIndex(q => q.id === currentQuestion?.id);
    const prevIndex = currentIndex === 0 ? questions.length - 1 : currentIndex - 1;
    setCurrentQuestion(questions[prevIndex]);
    setUserAnswer('');
    setShowAnswer(false);
  };

  if (loading) {
    return (
      <div className="interview-container">
        <div className="loading">Loading interview questions...</div>
      </div>
    );
  }

  return (
    <div className="interview-container">
      <div className="interview-header">
        <h1>Interview Preparation</h1>
        <p>Practice common interview questions and improve your responses</p>
      </div>

      <div className="interview-filters">
        <div className="filter-group">
          <label>Category:</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="all">All Categories</option>
            <option value="technical">Technical</option>
            <option value="behavioral">Behavioral</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Difficulty:</label>
          <select
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          >
            <option value="all">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {currentQuestion && (
        <div className="question-section">
          <div className="question-header">
            <span className={`category-tag ${currentQuestion.category.toLowerCase()}`}>
              {currentQuestion.category}
            </span>
            <span className={`difficulty-tag ${currentQuestion.difficulty.toLowerCase()}`}>
              {currentQuestion.difficulty}
            </span>
          </div>

          <div className="question-content">
            <h2>{currentQuestion.question}</h2>
          </div>

          <div className="answer-section">
            <h3>Your Answer:</h3>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
              className="answer-textarea"
            />

            <div className="answer-actions">
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="btn-secondary"
              >
                {showAnswer ? 'Hide' : 'Show'} Sample Answer
              </button>
            </div>

            {showAnswer && (
              <div className="sample-answer">
                <h4>Sample Answer:</h4>
                <p>{currentQuestion.answer}</p>
              </div>
            )}
          </div>

          <div className="question-navigation">
            <button onClick={handlePreviousQuestion} className="btn-secondary">
              ← Previous
            </button>
            <span className="question-counter">
              {questions.findIndex(q => q.id === currentQuestion.id) + 1} of {questions.length}
            </span>
            <button onClick={handleNextQuestion} className="btn-primary">
              Next →
            </button>
          </div>
        </div>
      )}

      {questions.length === 0 && (
        <div className="no-questions">
          <p>No questions found for the selected filters.</p>
        </div>
      )}
    </div>
  );
}