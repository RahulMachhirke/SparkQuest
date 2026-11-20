/**
 * Firebase Real-Time Firestore Configuration
 * 
 * INSTRUCTIONS FOR DEPLOYMENT:
 * 1. Go to https://console.firebase.google.com and create a free project.
 * 2. Click Web (</>) to create a web app and copy your firebaseConfig below.
 * 3. Under 'Firestore Database', click 'Create database' in test mode.
 * 
 * SMART FALLBACK:
 * If firebaseConfig is empty or offline, the app automatically falls back
 * to local storage mode so you can test seamlessly right now!
 */

const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

let db = null;
let isFirebaseReady = false;

function initFirebase() {
  if (typeof firebase !== 'undefined' && FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId) {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      db = firebase.firestore();
      isFirebaseReady = true;
      console.log("⚡ Firebase Firestore Real-Time Sync: ACTIVE");
    } catch (err) {
      console.warn("Firebase init error, using local fallback:", err);
      isFirebaseReady = false;
    }
  } else {
    console.log("⚡ Firebase keys not set: Running in High-Speed Local & Offline Mode");
    isFirebaseReady = false;
  }
}
