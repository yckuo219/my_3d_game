// config.js

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "https://chattest-ae184-default-rtdb.firebaseio.com",
  projectId: "chattest-ae184",
  storageBucket: "chattest-ae184.appspot.com",
  messagingSenderId: "768325792551",
  appId: "1:768325792551:web:90917c54fafcd937be2f02",
  measurementId: "G-9RST1S7RPP"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
const auth = firebase.auth();
