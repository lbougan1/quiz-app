// frontend/src/components/LandingPage.js
import React, { useState } from 'react';
import { connectTonWallet } from './services/tonService';
import './LandingPage.css';

const LandingPage = ({ user, onStartQuiz }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');

  const getUserDisplayName = () => {
    if (!user) return null;
    if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
    if (user.first_name) return user.first_name;
    if (user.username) return `@${user.username}`;
    if (user.id) return `User ${user.id}`;
    return null;
  };

  const handleConnectWallet = async () => {
    try {
      if (window.Telegram?.WebApp?.openTelegramWallet) {
        const wallet = await window.Telegram.WebApp.openTelegramWallet();
        if (wallet) {
          const result = await connectTonWallet(wallet.address);
          if (result.success) {
            setWalletConnected(true);
            setWalletAddress(wallet.address);
            setWalletBalance(result.balance);
          }
        }
      } else {
        alert('Telegram wallet is not available in this environment');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      alert('Failed to connect wallet');
    }
  };

  const userDisplayName = getUserDisplayName();

  return (
    <div className="landing-container">
      <div className="telegram-header">
        <div className="telegram-emoji">👋</div>
        <h1 className="telegram-title">Welcome to Quiz App!</h1>
      </div>

      <div className="telegram-card">
        {userDisplayName ? (
          <p className="telegram-greeting">
            Hello, <span className="telegram-username">{userDisplayName}</span>!
          </p>
        ) : (
          <p className="telegram-greeting">Hello, Quizzer!</p>
        )}

        <div className="telegram-instructions">
          <p>📝 Test your knowledge with our fun quiz!</p>
          <p>🏆 Earn rewards for correct answers</p>
          <p>💰 Connect your TON wallet to receive rewards</p>
        </div>

        <div className="telegram-wallet-section">
          {!walletConnected ? (
            <button
              className="telegram-button telegram-wallet-button"
              onClick={handleConnectWallet}
            >
              <span className="telegram-button-text">Connect TON Wallet</span>
              <span className="telegram-button-icon">🔗</span>
            </button>
          ) : (
            <div className="telegram-wallet-connected">
              <div className="telegram-wallet-info">
                <span className="telegram-wallet-label">Wallet:</span>
                <span className="telegram-wallet-address">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
              <div className="telegram-wallet-info">
                <span className="telegram-wallet-label">Balance:</span>
                <span className="telegram-wallet-balance">{walletBalance}</span>
              </div>
            </div>
          )}
        </div>

        <button
          className="telegram-button telegram-start-button"
          onClick={onStartQuiz}
        >
          <span className="telegram-button-text">Start Quiz</span>
          <span className="telegram-button-icon">➡️</span>
        </button>
      </div>
    </div>
  );
};

export default LandingPage;