import React from 'react';
import './LandingPage.css';

const LandingPage = ({ user, walletAddress, walletConnectionStatus, onStartQuiz }) => {
  const getUserDisplayName = () => {
    if (!user) return null;
    if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
    if (user.first_name) return user.first_name;
    if (user.username) return `@${user.username}`;
    if (user.id) return `User ${user.id}`;
    return null;
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
          <div className={`telegram-wallet-status-box ${walletAddress ? 'connected' : 'not-connected'}`}>
            {walletAddress ? (
              <>
                <span className="telegram-wallet-label">Wallet:</span>
                <span className="telegram-wallet-address">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
                <p className="telegram-wallet-status">Wallet is connected successfully.</p>
              </>
            ) : (
              <p className="telegram-wallet-status">Wallet address not found in Telegram account.</p>
            )}
          </div>
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