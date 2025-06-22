// src/App.js
import React, { useState, useEffect } from 'react';
import Quiz from './Quiz';
import LandingPage from './LandingPage';
import { parseTelegramInitData } from './utils/telegramUtils';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    // Initialize Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      // Parse user data
      const userData = parseTelegramInitData();
      if (userData) {
        console.log('User data:', userData); // Debug log
        setUser(userData);
      } else {
        console.log('No user data found'); // Debug log
      }

      // Set viewport for mobile
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    } else {
      console.log('Telegram WebApp not available'); // Debug log
    }
  }, []);

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  return (
    <div className="App">
      {!quizStarted ? (
        <LandingPage user={user} onStartQuiz={handleStartQuiz} />
      ) : (
        <Quiz user={user} />
      )}
    </div>
  );
}

export default App;
