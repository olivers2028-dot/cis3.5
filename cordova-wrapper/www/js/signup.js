import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js';
import { collection } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js';
import { db } from './firebaseConfig.js';

import {
  getAuth,
  createUserWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBk19z0f3n7ixniq-f7Bq1Zj4NYIXAZ7oI',
  authDomain: 'shareable-37f85.firebaseapp.com',
  projectId: 'shareable-37f85',
  storageBucket: 'shareable-37f85.appspot.com',
  messagingSenderId: '542630327474',
  appId: '1:542630327474:web:8258d25c6c24e0384185ab',
  measurementId: 'G-C3YDL8XPHE',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
function signUp(username, email, password) {
  // Create user with email and password using Firebase Authentication
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userId = user.uid;
      const userDoc = {
        username: username,
        userId: userId,
        email: email,
        password: password,
        phone: null,
      };
      // Save user information to Firestore
      console.log(userId);
      const usersCollectionRef = collection(db, 'users');
      const newUserRef = doc(usersCollectionRef, userId);

      setDoc(newUserRef, userDoc)
        .then(() => {
          console.log('User registered successfully');
          alert('User registered successfully, pleas login to continue!');
        })
        .catch((error) => {
          console.error('Error saving user information:', error);
          alert(
            "Unsuccessful, please ensure that the email hasn't been used for registration before and password is at least 6 chars long",
          );
        });
    })
    .catch((error) => {
      console.error('Error creating user:', error);
    });
}
document.addEventListener('DOMContentLoaded', () => {
  console.log('start');
  document.getElementById('signup').addEventListener('click', function (event) {
    event.preventDefault();
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var username = document.getElementById('username').value;
    console.log(email);
    if (email != null && password != null && username != null) {
      console.log(email);

      signUp(username, email, password);
    }
  });
});
