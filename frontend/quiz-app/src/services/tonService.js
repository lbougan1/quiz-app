// frontend/src/services/tonService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/ton';

export const connectTonWallet = async (walletAddress) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/connect`, { walletAddress });
      return response.data;
    } catch (error) {
      console.error('Connection error:', error);
      return { success: false, error: error.message };
    }
  };
  
  export const getWalletBalance = async (address) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/balance/${address}`);
      return response.data;
    } catch (error) {
      console.error('Balance error:', error);
      return { success: false, error: error.message };
    }
  };
