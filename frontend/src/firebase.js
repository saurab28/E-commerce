// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// 🔑 Your Firebase Config
const firebaseConfig = {
  apiKey: 'AIzaSyAV72Bl273NXJqz4AHnIbj2h2jq0QPYhh4',
  authDomain: 'fir-s1-ae1ad.firebaseapp.com',
  projectId: 'fir-s1-ae1ad',
  storageBucket: 'fir-s1-ae1ad.firebasestorage.app',
  messagingSenderId: '927890682894',
  appId: '1:927890682894:web:711e1bcc412c962a2df85f',
  measurementId: 'G-0BL1JF93PB',
}

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig)

// 🔑 Auth + Google Provider
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
