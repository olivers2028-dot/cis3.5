import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js';
import { collection } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
import { getFirestore} from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js';

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
const db = getFirestore(app);

const currentMonth = new Date().getMonth(); // Get the current month (0-11)

function getCurrentYear() {
  return new Date().getFullYear();
}

function calcYearLevWithGradYear(email) {
  const index = email.indexOf("@");
  let gradYear;
  if (index !== -1) {
    try {
      gradYear = parseInt(email.substring(index - 4, index));
    } catch (e) {
      console.error('Invalid parameter passed:', e);
      throw new Error('InvalidParameterException');
    }
  } else {
    console.log('The "@" character is not found.');
    return null; // Return null if email is invalid
  }

  if (currentMonth >= 7) { // if just back from summer break
    return 14 - (gradYear - getCurrentYear());
  } else {
    return 13 - (gradYear - getCurrentYear());
  }
}


function signUp(username, email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userId = user.uid;
      const yearLevel = calcYearLevWithGradYear(email);

      if (yearLevel === null) {
        alert("Invalid email format. Please use a valid CIS email.");
        return;
      }

      const userDoc = {
        username: username,
        userId: userId,
        email: email,
        password: password,
        phone: null,
        yearLevel: yearLevel
      };

      const usersCollectionRef = collection(db, 'users');
      const newUserRef = doc(usersCollectionRef, userId);

      setDoc(newUserRef, userDoc)
        .then(() => {
          console.log('User registered successfully');
          alert('User registered successfully, please login to continue!');
        })
        .catch((error) => {
          console.error('Error saving user information:', error);
          alert("Unsuccessful, please ensure that the email hasn't been used for registration before and password is at least 6 chars long");
        });
    })
    .catch((error) => {
      console.error('Error creating user:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('signup').addEventListener('click', function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    if (!email.includes('@student.cis.edu.hk') && !email.includes('@cis.edu.hk')) {
      alert("Please use a CIS affiliated email to register an account.");
      return;
    }

    if (email && password && username) {
      signUp(username, email, password);
    }
  });
});
