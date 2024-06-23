// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCE2lJCcymsby9chhD9tJ8RRwCrc0LeXe8',
  authDomain: 'uzdongju-news.firebaseapp.com',
  projectId: 'uzdongju-news',
  storageBucket: 'uzdongju-news.appspot.com',
  messagingSenderId: '878745049907',
  appId: '1:878745049907:web:02b2bc0c0da42f77323c46',
  measurementId: 'G-X43XG5K4MC',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth(app)

export { db, storage, auth }
