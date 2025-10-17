// backend/tonRoutes.js
const express = require('express');
const router = express.Router();
const tonWalletService = require('./tonWalletService');
const { handleQuizCompletion } = require('./quizController');

router.post('/quiz/completion', handleQuizCompletion);


router.post('/connect', async (req, res) => {
    try {
      const { walletAddress } = req.body;
      if (!walletAddress) {
        return res.status(400).json({ error: 'Wallet address required' });
      }
  
      const result = await tonWalletService.getWalletInfo(walletAddress);
      res.json(result);
    } catch (error) {
      console.error('Connection error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
router.get('/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const balance = await tonWalletService.getWalletBalance(address);
    res.json({ balance });
  } catch (error) {
    console.error('Balance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
  
  module.exports = router;
