import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';



const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
admin.initializeApp();

document.getElementById('sendCode').addEventListener('click', async function() {
  try {
    // Generate a new code
    const code = Math.floor(100000 + Math.random() * 900000);

    // Call Firebase Function to send email
    const sendEmail = httpsCallable(functions, 'sendVerificationEmail');
    const result = await sendEmail({
      recipientEmail: 'christianlyuen@gmail.com' // Replace with actual user email
    });

    alert('Verification code sent to your email!');

    // Store the code temporarily for verification
    sessionStorage.setItem('verificationCode', code.toString());
    console.log("Test")

  } catch (error) {
    console.error('Error sending email:', error);
    alert('Failed to send verification code. Please try again.');
  }
});

// Verification code check when clicking "Begin Sharing!"
document.getElementById('login').addEventListener('click', function() {
  const enteredCode = document.getElementById('password').value;
  const storedCode = sessionStorage.getItem('verificationCode');

  if (enteredCode === storedCode) {
    alert('Verification successful!');
    // Proceed with login or whatever action comes next
  } else {
    alert('Invalid verification code. Please try again.');
  }
});
