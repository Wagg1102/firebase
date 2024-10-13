const { initializeApp } = require("firebase-admin/app");

const firebaseConfig = {
  apiKey: "AIzaSyDx2UvV43Q0WsCtttdvchlJjyjfv5TEsLw",
  authDomain: "week7-haowen.firebaseapp.com",
  projectId: "week7-haowen",
  storageBucket: "week7-haowen.appspot.com",
  messagingSenderId: "777109832773",
  appId: "1:777109832773:web:6c24190a05e7f693d1cf2c"
};

const app = initializeApp(firebaseConfig);

module.exports = {
  app
}

