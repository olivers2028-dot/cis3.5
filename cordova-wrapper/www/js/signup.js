import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js';
import { doc, setDoc, collection, getFirestore } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBk19z0f3n7ixniq-f7Bq1Zj4NYIXAZ7oI',
  authDomain: 'shareable-37f85.firebaseapp.com',
  projectId: 'shareable-37f85',
  storageBucket: 'shareable-37f85.appspot.com',
  messagingSenderId: '542630327474',
  appId: '1:542630327474:web:8258d25c6c24e0384185ab',
  measurementId: 'G-C3YDL8XPHE',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Get current month (0-11)
const currentMonth = new Date().getMonth();

// Helper functions
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
      console.error('Invalid email format:', e);
      throw new Error('Invalid email format');
    }
  } else {
    console.log('Invalid email - missing @');
    return null;
  }

  return currentMonth >= 7
    ? 14 - (gradYear - getCurrentYear())
    : 13 - (gradYear - getCurrentYear());
}

// Main signup function with email verification
async function signUp(username, email, password) {
  try {
    // 1. Send verification email via Python API
    const verificationResponse = await fetch('http://localhost:5000/send_verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });

    const verificationData = await verificationResponse.json();

    if (!verificationData.success) {
      throw new Error('Failed to send verification email');
    }

    // 2. Prompt user for verification code
    const userCode = prompt(`Verification code sent to ${email}. Enter the code:`);

    if (userCode !== verificationData.code) {
      throw new Error('Invalid verification code');
    }

    // 3. Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 4. Calculate year level
    const yearLevel = calcYearLevWithGradYear(email);
    if (yearLevel === null) {
      throw new Error('Invalid CIS email format');
    }

    // 5. Save user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email,
      userId: user.uid,
      phone: null,
      yearLevel,
      createdAt: new Date().toISOString()
    });

    // 6. Success
    alert('Registration successful! Redirecting to login...');
    window.location.href = 'code.html';

  } catch (error) {
    console.error('Signup error:', error);
    alert(`Registration failed: ${error.message}`);
  }
}

// DOM event listener
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('signup').addEventListener('click', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    // Basic validation
    if (!email.includes('@student.cis.edu.hk') && !email.includes('@cis.edu.hk')) {
      alert("Please use a valid CIS email address");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (username.length < 3) {
      alert("Username must be at least 3 characters");
      return;
    }

    await signUp(username, email, password);
  });
});
