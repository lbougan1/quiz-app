// src/Quiz.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import './Quiz.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);
  const [transition, setTransition] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [key, setKey] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [emoji, setEmoji] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0); // Added state for total questions

  const currentQuestion = useMemo(() => {
    return questions[currentQuestionIndex] || null;
  }, [questions, currentQuestionIndex]);

  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/questions');
      setQuestions(response.data);
      setTotalQuestions(response.data.length); // Set total questions count
      setCurrentQuestionIndex(0);
      setScore(0);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no`);
      }

      const initData = tg.initData;
      if (initData) {
        setUser({
          id: initData.user?.id,
          first_name: initData.user?.first_name,
          last_name: initData.user?.last_name,
          username: initData.user?.username,
          photo_url: initData.user?.photo_url,
          language_code: initData.user?.language_code,
        });
      }
    }

    // Load emoji assets
    import('./emojiAssets.js').then(module => {
      setEmoji(module.default);
    });

    fetchQuestions();
  }, [fetchQuestions]);

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

  const handleTimerComplete = () => {
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
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (questions.length === 0) {
    const scorePercentage = Math.round((score / totalQuestions) * 100); // Use totalQuestions instead of questions.length
    let emojiToShow = null;
    let message = 'Good job!';

    if (scorePercentage >= 80) {
      emojiToShow = emoji?.excellent || '🎉';
      message = 'Excellent!';
    } else if (scorePercentage >= 60) {
      emojiToShow = emoji?.great || '👍';
      message = 'Great job!';
    } else if (scorePercentage >= 40) {
      emojiToShow = emoji?.good || '🤔';
      message = 'Good effort!';
    } else {
      emojiToShow = emoji?.keepTrying || '😕';
      message = 'Keep trying!';
    }

    return (
      <div className="quiz-complete">
        <div className="emoji-container">
          {emojiToShow && typeof emojiToShow === 'string'
            ? <span>{emojiToShow}</span>
            : emojiToShow}
        </div>
        <h1 className="final-title">Quiz Completed!</h1>
        <p className="final-message">{message}</p>
        <div className="score-container">
          <span className="score-value">{score}</span>
          <span className="score-divider">/</span>
          <span className="score-max">{totalQuestions}</span> {/* Use totalQuestions here */}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h1 className="app-title">Quiz App</h1>
      {user && <p className="welcome-text">Welcome, {user.first_name}!</p>}

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
        onClick={() => {
          handleSubmit();
          const button = document.querySelector('.submit-button');
          if (button) {
            button.classList.add('pressed');
            setTimeout(() => button.classList.remove('pressed'), 100);
          }
        }}
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
