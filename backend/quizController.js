const { mintNft } = require('./tonNFTService');

const handleQuizCompletion = async (req, res) => {
  try {
    const { userId, score } = req.body;

    // Fetch user data (mocked for now)
    const user = {
      id: userId,
      walletAddress: req.body.walletAddress, // Wallet address passed from the frontend
      telegramChatId: req.body.telegramChatId, // Telegram chat ID
    };

    if (score >= 80) {
      // Mint NFT for the user
      const nftResult = await mintNft(user.walletAddress);

      // Respond with success and NFT details
      return res.json({
        success: true,
        message: 'Congratulations! You earned an NFT for scoring above 80%.',
        nft: nftResult,
      });
    }

    // Respond with no reward
    return res.json({
      success: true,
      message: 'Good job! Keep trying to earn an NFT.',
    });
  } catch (error) {
    console.error('Error handling quiz completion:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

module.exports = { handleQuizCompletion };