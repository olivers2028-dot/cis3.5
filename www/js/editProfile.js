import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js';
import { updateDoc } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js';
import { db } from './firebaseConfig.js';

import {
  getAuth, sendPasswordResetEmail, onAuthStateChanged
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
let userId;
const storage = getStorage();

document.addEventListener('DOMContentLoaded', () => {


  onAuthStateChanged(auth, (user) => {
    if (user) {
      userId = user.uid;
      const userRef = doc(db, 'users', userId);
      const pathName = new URL(userRef.profileImageUrl).pathname;
      const imageURL = pathName.substring(pathName.lastIndexOf('/') + 1);
      const userStorageRef = ref(storage, `profile/${imageURL}`);

      getDoc(userRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            const nameElement = document.getElementById('username');
            const phoneElement = document.getElementById('phone');
            const profileImageElement = document.getElementById('profile-image');
            const email = document.getElementById('email');

            email.value = data.email;
            nameElement.value = data.username;
            phoneElement.value = data.phone;

            // Get the profile image URL from Firebase Storage
            getDownloadURL(userStorageRef)
              .then((url) => {
                console.log(url);
                profileImageElement.src = url;
              })
              .catch((error) => {
                profileImageElement.src = "images/user.png";
                // console.error('Error retrieving profile image URL:', error);
              });
          } else {
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
      document.getElementById('edit').addEventListener('click', function (event) {
        event.preventDefault();
        var email = document.getElementById('email').value;
        var phone = document.getElementById('phone').value;
        var username = document.getElementById('username').value;
        if ((email != null || phone != null) && username != null) {
          edit(username, email, phone);
        }
      });
    } else {
      window.location.href = 'login.html';
    }
  });
});


function edit(username, email, phone) {
  const imageInput = document.getElementById('input-image');
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

  if (!allowedTypes.includes(imageInput.files[0].type)) {
      alert('Please upload a PNG, JPG, or JPEG image.');
      return; // Stop the function if the file is not one of the allowed types
  }

  const user = auth.currentUser;
  const docRef = doc(db, 'users', userId);
  if (user) {
    updateDoc(docRef, {
      username: username,
      email: email,
      phone: phone,
    });
  }


  console.log(imageInput);
  if (imageInput.files.length > 0) {
    const imageFile = imageInput.files[0];
    const pathName = new URL(docRef.profileImageUrl).pathname;
    const imageURL = pathName.substring(pathName.lastIndexOf('/') + 1);
    const storageRef = ref(storage, `profile/${imageURL}`); // Firebase Storage reference
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        console.error('Error during upload:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          updateDoc(docRef, {
            profileImageUrl: downloadURL,
          });
        });
      },
    );
  }
}
