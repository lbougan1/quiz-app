import React, { useState, useEffect } from 'react';
import Quiz from './Quiz';
import LandingPage from './LandingPage';
import { parseTelegramInitData } from './utils/telegramUtils';
import { connectTonWallet } from './services/tonService'; // Import wallet connection service
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [walletAddress, setWalletAddress] = useState(''); // Define walletAddress state
  const [walletConnectionStatus, setWalletConnectionStatus] = useState(''); // Define walletConnectionStatus state

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

        // Automatically set wallet address from Telegram context (if available)
        if (userData.walletAddress) {
          setWalletAddress(userData.walletAddress);
        }
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

  const handleWalletConnect = async () => {
    if (!walletAddress) {
      setWalletConnectionStatus('Wallet address not found in Telegram context.');
      return;
    }

    const result = await connectTonWallet(walletAddress);
    if (result.success) {
      setWalletConnectionStatus(`Connected to wallet: ${result.address}`);
    } else {
      setWalletConnectionStatus(`Error: ${result.error}`);
    }
  };

  return (
    <div className="App">
      {!quizStarted ? (
        <LandingPage
          user={user}
          walletAddress={walletAddress}
          walletConnectionStatus={walletConnectionStatus}
          onWalletConnect={handleWalletConnect}
          onStartQuiz={handleStartQuiz}
        />
      ) : (
        <Quiz user={user} />
      )}
    </div>
  );
}

export default App;