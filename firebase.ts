// Import the functions you need from the SDKs you need

import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyAemLu-TgEnSesOpCmCGT_-lBgDLkOBP0U",

  authDomain: "netflix-nextjs-d2619.firebaseapp.com",

  projectId: "netflix-nextjs-d2619",

  storageBucket: "netflix-nextjs-d2619.appspot.com",

  messagingSenderId: "882021930257",

  appId: "1:882021930257:web:aa55a4d1a10a82a6cb28b0"

};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()

// Initialize Firebase

export default app
export { auth, db }