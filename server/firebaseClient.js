const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
require('dotenv').config();


const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,           // ✅ Required
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,   // ✅ Required
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

module.exports = auth;
