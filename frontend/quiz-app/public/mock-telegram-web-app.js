// public/mock-telegram-web-app.js
window.Telegram = window.Telegram || {};
window.Telegram.WebApp = {
  ready: () => {
    console.log('Telegram WebApp ready');
  },
  expand: () => {
    console.log('Telegram WebApp expanded');
  },
  initData: 'eyJ1c2VyIjp7ImlkIjoiMTIzNDU2Nzg5MCIsImZpcnN0X25hbWUiOiJKb2huIiwibGFzdF9uYW1lIjoiRG9lIiwidXNlcm5hbWUiOiJkb2VAZXhhbXBsZS5jb20iLCJwaG90b191cmwiOiJodHRwczovL2RvZS5leGFtcGxlLmNvbS9waG90by9pbWFnZS5qcGciLCJsYW5ndWFnZV9jb2RlIjoiaXMifX0=', // Base64 encoded JSON string
  initDataUnsafe: {
    user: {
      id: 1234567890,
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe',
      photo_url: 'https://example.com/photo/image.jpg',
      language_code: 'en',
    },
  },
  MainButton: {
    text: 'Submit',
    setText: (text) => {
      console.log('MainButton text set to:', text);
    },
    show: () => {
      console.log('MainButton shown');
    },
    hide: () => {
      console.log('MainButton hidden');
    },
    enable: () => {
      console.log('MainButton enabled');
    },
    disable: () => {
      console.log('MainButton disabled');
    },
    isVisible: () => true,
    isActive: () => true,
  },
};
