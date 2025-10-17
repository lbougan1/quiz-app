// src/Quiz.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import './Quiz.css';

const Quiz = ({ user }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [transition, setTransition] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [key, setKey] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const currentQuestion = useMemo(() => {
    return questions[currentQuestionIndex] || null;
  }, [questions, currentQuestionIndex]);

  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/questions');
      setQuestions(response.data);
      setTotalQuestions(response.data.length);
      setCurrentQuestionIndex(0);
      setScore(0);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setIsLoading(false);
    }
  }, []);


  const handleSubmit = useCallback(async () => {
    if (!selectedOption || !currentQuestion) return;

    try {
      setTransition(true);
      setIsTimerRunning(false);

      const submitAnswer = async () => {
        try {
          const response = await axios.post('http://localhost:5000/api/submit', {
            answer: selectedOption,
            currentQuestionId: currentQuestion._id
          });

          setAnswerStatus(response.data.correct ? 'correct' : 'wrong');

          if (response.data.correct) {
            setScore(prev => prev + 1);
          }

          setTimeout(() => setAnswerStatus(null), 500);
        } catch (error) {
          console.error('Error submitting the answer:', error);
          setAnswerStatus('wrong');
          setTimeout(() => setAnswerStatus(null), 500);
        }
      };

      submitAnswer();

      setTimeout(() => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
          setCurrentQuestionIndex(nextIndex);
          setSelectedOption(null);
          setTransition(false);
          setIsTimerRunning(true);
          setKey(prev => prev + 1);
        } else {
          setQuestions([]);
        }
      }, 150);
    } catch (error) {
      console.error('Error:', error);
      setTransition(false);
      setIsTimerRunning(true);
    }
  }, [selectedOption, currentQuestion, currentQuestionIndex, questions.length]);

  const handleOptionSelect = (option, index) => {
    setSelectedOption(option);
    const button = document.querySelector(`.option-button:nth-child(${index + 1})`);
    if (button) {
      button.classList.add('pressed');
      setTimeout(() => button.classList.remove('pressed'), 100);
    }
  };

  const handleTimerComplete = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setTransition(true);
      setIsTimerRunning(false);

      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setTransition(false);
        setIsTimerRunning(true);
        setKey(prev => prev + 1);
      }, 150);
    } else {
      setQuestions([]);
    }
  }, [currentQuestionIndex, questions.length]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (questions.length === 0) {
    const scorePercentage = Math.round((score / totalQuestions) * 100);
    let emoji = '😊';
    let message = 'Good job!';

    if (scorePercentage >= 80) {
      emoji = '🎉';
      message = 'Amazing!';
    } else if (scorePercentage >= 60) {
      emoji = '👍';
      message = 'Well done!';
    } else if (scorePercentage >= 40) {
      emoji = '🤔';
      message = 'Not bad!';
    } else {
      emoji = '😕';
      message = 'Keep trying!';
    }

    return (
      <div className="quiz-complete">
        <div className="quiz-complete-emoji">{emoji}</div>
        <h2 className="quiz-complete-title">Quiz Completed!</h2>
        <div className="telegram-message-box">
          <div className="telegram-message-content">
            <p className="telegram-message-text">{message}</p>
            <div className="telegram-message-score">
              <span className="telegram-score-value">{score}</span>
              <span className="telegram-score-divider">/</span>
              <span className="telegram-score-max">{totalQuestions}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h1 className="app-title">Quiz App</h1>
      {user && <p className="welcome-text">Welcome, {user.first_name || 'Quizzer'}!</p>}

      <div className="question-container">
        <div className={`question-slide ${transition ? 'slide-out' : ''}`}>
          <p className="question-text">{currentQuestion.question}</p>
          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option, index)}
                className={`option-button ${selectedOption === option ? 'selected' : ''}`}
                disabled={transition}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="timer-container">
        <CountdownCircleTimer
          key={key}
          isPlaying={isTimerRunning}
          duration={10}
          colors={['#0088cc', '#F7B801', '#A30000', '#A30000']}
          colorsTime={[7, 5, 2, 0]}
          onComplete={handleTimerComplete}
          size={60}
          strokeWidth={6}
        >
          {({ remainingTime }) => remainingTime}
        </CountdownCircleTimer>
      </div>

      <button
        className={`submit-button ${answerStatus}`}
        onClick={handleSubmit}
        disabled={!selectedOption || transition}
      >
        Submit
      </button>

      <p className="score-text">
        Score: {score}
      </p>
    </div>
  );
};

export default Quiz;