// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyA3hT-bgzLdtlYOy_3aXm7oOp2-tbl9Lss",
  authDomain: "sde-project-335019.firebaseapp.com",
  projectId: "sde-project-335019",
  storageBucket: "sde-project-335019.appspot.com",
  messagingSenderId: "111974029403",
  appId: "1:111974029403:web:f72b558c5f04804ae1477e"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();