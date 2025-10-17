import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onStartQuiz }) => {
  return (
    <div className="landing-container">
      <div className="header">
        <h1>Welcome to Quiz App!</h1>
        <p>📝 Test your knowledge with our fun and engaging quiz!</p>
      </div>
      <div className="content">
        <p>Challenge yourself and see how much you know. Click below to get started!</p>
      </div>
      <button className="start-button" onClick={onStartQuiz}>
        Start Quiz
      </button>
    </div>
  );
};

export default LandingPage;