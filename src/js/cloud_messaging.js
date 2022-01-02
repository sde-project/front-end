import { sendFcmToken } from "../modules/cloud_messaging.js";


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

messaging.getToken({ vapidKey: 'BAw9DHrxvtsG52abLLvozOCuDBqeFxmyGFYDLwkeN7f_bRbgNcFFkTtyfMQx05tOWcesfzaRLqhLLL-krxaBcRg' }).then((currentToken) => {
  if (currentToken) {
    console.log("New token found! ", currentToken);

    const oldToken = window.localStorage.getItem('fcmToken');
    if (oldToken != currentToken) {
      window.localStorage.setItem('fcmToken', currentToken);
      window.localStorage.setItem('fcmTokenSent', 'false');
    }

    if (window.localStorage.getItem('loggedIn') == 'true') {
      sendFcmToken(currentToken).catch(err => console.log(err));
    }

  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});