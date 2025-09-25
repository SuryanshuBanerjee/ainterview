import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DSAQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/quiz/dsa');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      // Fallback questions
      setQuestions([
        {
          id: 1,
          question: 'What is the time complexity of binary search?',
          options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'],
          correct_answer: 1,
          explanation: 'Binary search eliminates half the search space in each iteration.'
        },
        {
          id: 2,
          question: 'Which data structure uses LIFO principle?',
          options: ['Queue', 'Stack', 'Array', 'Linked List'],
          correct_answer: 1,
          explanation: 'Stack follows Last In First Out principle.'
        }
      ]);
    }
    setLoading(false);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const answers = questions.map(q => selectedAnswers[q.id] || -1);

    try {
      const response = await axios.post('/api/quiz/submit', { answers });
      setResults(response.data);
      setQuizCompleted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      // Fallback results calculation
      let score = 0;
      const results = questions.map((q, index) => {
        const userAnswer = selectedAnswers[q.id] || -1;
        const correct = q.correct_answer === userAnswer;
        if (correct) score++;
        return {
          question_id: q.id,
          correct,
          user_answer: userAnswer,
          correct_answer: q.correct_answer,
          explanation: q.explanation
        };
      });

      setResults({
        score,
        total: questions.length,
        percentage: (score / questions.length) * 100,
        results
      });
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setResults(null);
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading">Loading quiz questions...</div>
      </div>
    );
  }

  if (quizCompleted && results) {
    return (
      <div className="quiz-container">
        <div className="quiz-results">
          <h1>Quiz Results</h1>

          <div className="score-summary">
            <div className="score-circle">
              <div className="score-percentage">{Math.round(results.percentage)}%</div>
              <div className="score-fraction">{results.score}/{results.total}</div>
            </div>
            <div className="score-description">
              <h2>
                {results.percentage >= 80 ? 'Excellent!' :
                 results.percentage >= 60 ? 'Good Job!' :
                 'Keep Practicing!'}
              </h2>
              <p>You got {results.score} out of {results.total} questions correct.</p>
            </div>
          </div>

          <div className="detailed-results">
            {questions.map((question, index) => {
              const result = results.results.find(r => r.question_id === question.id);
              return (
                <div key={question.id} className={`result-item ${result?.correct ? 'correct' : 'incorrect'}`}>
                  <div className="result-header">
                    <h3>Question {index + 1}</h3>
                    <span className={`result-status ${result?.correct ? 'correct' : 'incorrect'}`}>
                      {result?.correct ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  <p className="result-question">{question.question}</p>
                  <div className="result-answers">
                    <p><strong>Your answer:</strong> {question.options[result?.user_answer] || 'Not answered'}</p>
                    <p><strong>Correct answer:</strong> {question.options[result?.correct_answer]}</p>
                  </div>
                  <p className="result-explanation"><strong>Explanation:</strong> {result?.explanation}</p>
                </div>
              );
            })}
          </div>

          <button onClick={resetQuiz} className="btn-primary">
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const allQuestionsAnswered = questions.every(q => selectedAnswers[q.id] !== undefined);

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>DSA Quiz</h1>
        <p>Test your Data Structures and Algorithms knowledge</p>
        <div className="quiz-progress">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      {currentQuestion && (
        <div className="question-container">
          <h2 className="question-text">{currentQuestion.question}</h2>

          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`option ${selectedAnswers[currentQuestion.id] === index ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(currentQuestion.id, index)}
              >
                <div className="option-letter">{String.fromCharCode(65 + index)}</div>
                <div className="option-text">{option}</div>
              </div>
            ))}
          </div>

          <div className="quiz-navigation">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="btn-secondary"
            >
              Previous
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered}
                className="btn-primary submit-btn"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="btn-primary"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}

      <div className="quiz-status">
        <div className="answered-questions">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className={`question-dot ${selectedAnswers[q.id] !== undefined ? 'answered' : ''}
                         ${index === currentQuestionIndex ? 'current' : ''}`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <p className="answered-count">
          {Object.keys(selectedAnswers).length} of {questions.length} questions answered
        </p>
      </div>
    </div>
  );
}