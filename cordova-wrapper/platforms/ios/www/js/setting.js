import { db } from './firebaseConfig.js';
import { getStorage, ref as storageRef, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js';
import {
  getAuth, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js';

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
document.addEventListener('DOMContentLoaded', () => {
  const storage = getStorage(); // Initialize Firebase Storage instance
  onAuthStateChanged(auth, (user) => {
    console.log(user);
    // if (user) {
    const userId = user.uid;
    getDocs(collection(db, 'users'))
      .then((querySnapshot) => {
        const itemList = document.getElementById('username'); // Get the container element
        const email = document.getElementById('email');
        const image = document.getElementById('image');
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.userId === userId) {
            console.log(data.email);
            const pathName = new URL(data.profileImageUrl).pathname;
            const imageURL = pathName.substring(pathName.lastIndexOf('/') + 1);
            const imageRef = storageRef(
              storage,
              `profile/${imageURL}`,
            ); // Construct the reference to the image file
            getDownloadURL(imageRef) // Fetch the URL for the image
              .then((url) => {
                image.src = url;
              })
              .catch((error) => {
              });
            const div = document.createElement('div');
            div.innerHTML = `<div>${data.username}</div>`;
            itemList.appendChild(div);
            const mail = document.createElement('div');
            mail.textContent = data.email;
            email.appendChild(mail);
          }
        });
      })
      .catch((error) => {
        console.error('Error getting documents: ', error);
      });
  });
});
