// backend/tonWalletService.js
const { TonClient } = require("@ton/ton");

class TonWalletService {
  constructor() {
    this.client = new TonClient({
      endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    });
  }

  async getWalletInfo(walletAddress) {
    try {
      const balance = await this.getWalletBalance(walletAddress);
      return {
        success: true,
        address: walletAddress,
        balance
      };
    } catch (error) {
      console.error('Error getting wallet info:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getWalletBalance(address) {
    try {
      const balance = await this.client.getBalance(address);
      return balance;
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }
}

module.exports = new TonWalletService();
