import firebase from 'firebase';
import 'firebase/firebase-storage';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyD_aJIYkQEWhmozj4Ped2MqBnyatQwnyTM",
    authDomain: "solemate-5534d.firebaseapp.com",
    projectId: "solemate-5534d",
    storageBucket: "solemate-5534d.appspot.com",
    messagingSenderId: "485606607237",
    appId: "1:485606607237:web:5ca027868194c04df25cec",
    measurementId: "G-L9ELZW6EGM"
});

const db = firebaseApp.firestore();

const storage = firebaseApp.storage();

export {db, storage};