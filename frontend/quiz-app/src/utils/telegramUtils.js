// src/utils/telegramUtils.js
export const parseTelegramInitData = () => {
    try {
      // First try to use the unsafe data if available
      if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        return window.Telegram.WebApp.initDataUnsafe.user;
      }
  
      // If not, try to decode the initData string
      if (window.Telegram?.WebApp?.initData) {
        const decoded = atob(window.Telegram.WebApp.initData);
        const parsed = JSON.parse(decoded);
        return parsed?.user || null;
      }
  
      return null;
    } catch (error) {
      console.error('Error parsing Telegram initData:', error);
      return null;
    }
  };
  