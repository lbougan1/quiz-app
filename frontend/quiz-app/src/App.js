import React, { useState } from 'react';
import Quiz from './Quiz';
import LandingPage from './LandingPage';
import './App.css';

function App() {
  const [quizStarted, setQuizStarted] = useState(false);

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  return (
    <div className="App">
      {!quizStarted ? (
        <LandingPage onStartQuiz={handleStartQuiz} />
      ) : (
        <Quiz />
      )}
    </div>
  );
}

export default App;