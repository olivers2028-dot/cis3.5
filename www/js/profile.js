import { db } from './firebaseConfig.js';
import { getStorage, ref as storageRef, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js';
import { collection, getDocs, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js';
import {
  getAuth, signOut, onAuthStateChanged
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
let userId;

document.addEventListener('DOMContentLoaded', () => {

  // Add event listener to the logout link
  const logoutLink = document.getElementById('logoutLink');
  logoutLink.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior

    // Sign out the user
    auth.signOut()
      .then(() => {
        // Sign-out successful
        console.log('User logged out successfully.');
        window.location.href = 'login.html';
      })
      .catch((error) => {
        // An error occurred during sign-out
        console.error('Error signing out:', error);
      });
  });
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User is logged in:', user);
      console.log('User is logged in:', user.uid);
      userId = user.uid;
      const storage = getStorage();

      //set donations listing
      getDocs(collection(db, 'items'))
        .then((querySnapshot) => {
          const itemList = document.getElementById('listing-content'); // Get the container element
          let i = 0;
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if(data.userId == userId){
              const pathName = new URL(data.itemImageUrl).pathname;
              const imageURL = pathName.substring(pathName.lastIndexOf('/') + 1);
              const imageRef = storageRef(storage, `${imageURL}`); // Construct the reference to the image file

              getDownloadURL(imageRef) // Fetch the URL for the image
                .then((url) => {
                  const div = document.createElement('div'); // Create a new div element
                  div.innerHTML = `

<div style="display: flex; justify-content: center; align-items: center; height: 10vh;">
  <div style="width: 80%;">
    <div style="height: 77px; position: relative;">
      <div style="width: 80%; height: 50px; padding-bottom: 10px; position: absolute; left: 15%; transform: translateX(-35%);">
        <div style="width: 343px; height: 77px; left: 0; top: 20px; position: relative">
                <a href="product_info.html?itemId=${data.id}" style="width: 400px; height: 50px; padding-bottom: 25px; left: 0px; top: ${Math.floor(i)}px; position: absolute;">
                  <div style="width: 50px; height: 50px; background-image: url('${url}'); background-size: cover; background-position: center center; border-radius: 8px;"></div>
                  <div style="left: 66px; top: 0px; position: absolute; color: black; font-size: 16px; font-family: Inter; font-weight: 700; word-wrap: break-word">${data.name}</div>
                  <div style="right: 13%; top: 2px; position: absolute; text-align: right; color: #BDBDBD; font-size: 14px; font-family: Inter; font-weight: 400; word-wrap: break-word">${data.time}</div>
                  <div style="width: 269px; left: 66px; top: 27px; position: absolute; color: black; font-size: 14px; font-family: Inter; font-weight: 400; word-wrap: break-word">${data.quantity}</div>
                  <div style="width: 277px; height: 0px; left: 66px; top: 65px; position: absolute; border: 1px #E8E8E8 solid"></div>
                </a>
              </div>
      </div>
    </div>
  </div>
</div>
            `;
                  itemList.appendChild(div); // Append the div to the container element
                  i++;
                  itemList.style.minHeight = `${i * 50 + 400}px`;
                })
                .catch((error) => {
                  console.error('Error getting download URL: ', error);
                });
            }
          });
        })
        .catch((error) => {
          console.error('Error getting documents: ', error);
        });

      //set reservations listing
      getDocs(collection(db, 'items'))
        .then((querySnapshot) => {
          const itemList = document.getElementById('reservations-content'); // Get the container element
          let i = 0;
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if(data.reserved == userId && data.closed == true){
              const imageRef = storageRef(storage, `${data.id}.png`); // Construct the reference to the image file
              getDownloadURL(imageRef) // Fetch the URL for the image
                .then((url) => {
                  const div = document.createElement('div'); // Create a new div element
                  div.innerHTML = `

<div style="display: flex; justify-content: center; align-items: center; height: 10vh;">
  <div style="width: 80%;">
    <div style="height: 77px; position: relative;">
      <div style="width: 80%; height: 50px; padding-bottom: 10px; position: absolute; left: 15%; transform: translateX(-35%);">
        <div style="width: 343px; height: 77px; left: 0; top: 20px; position: relative">
                <a href="product_info.html?itemId=${data.id}" style="width: 400px; height: 50px; padding-bottom: 25px; left: 0px; top: ${Math.floor(i)}px; position: absolute;">
                  <div style="width: 50px; height: 50px; background-image: url('${url}'); background-size: cover; background-position: center center; border-radius: 8px;"></div>
                  <div style="left: 66px; top: 0px; position: absolute; color: black; font-size: 16px; font-family: Inter; font-weight: 700; word-wrap: break-word">${data.name}</div>
                  <div style="right: 13%; top: 2px; position: absolute; text-align: right; color: #BDBDBD; font-size: 14px; font-family: Inter; font-weight: 400; word-wrap: break-word">${data.time}</div>
                  <div style="width: 269px; left: 66px; top: 27px; position: absolute; color: black; font-size: 14px; font-family: Inter; font-weight: 400; word-wrap: break-word">${data.quantity}</div>
                  <div style="width: 269px; right: -95px; top: 27px; position: absolute; color: red; font-size: 14px; font-family: Inter; font-weight: 500; word-wrap: break-word">This item is closed</div>
                  <div style="width: 277px; height: 0px; left: 66px; top: 65px; position: absolute; border: 1px #E8E8E8 solid"></div>
                </a>
              </div>
      </div>
    </div>
  </div>
</div>


            `;
                  itemList.appendChild(div); // Append the div to the container element
                  i++;
                  console.log(i);
                  itemList.style.minHeight = `${i * 50 + 400}px`;
                })
                .catch((error) => {
                  console.error('Error getting download URL: ', error);
                });
            } else if (data.reserved == userId) {
              const imageRef = storageRef(storage, `${data.id}.png`); // Construct the reference to the image file
              getDownloadURL(imageRef) // Fetch the URL for the image
                .then((url) => {
                  const div = document.createElement('div'); // Create a new div element
                  div.innerHTML = `

<div style="display: flex; justify-content: center; align-items: center; height: 10vh;">
  <div style="width: 80%;">
    <div style="height: 77px; position: relative;">
      <div style="width: 80%; height: 50px; padding-bottom: 10px; position: absolute; left: 15%; transform: translateX(-35%);">
        <div style="width: 343px; height: 77px; left: 0; top: 20px; position: relative">
                <a href="product_info.html?itemId=${data.id}" style="width: 400px; height: 50px; padding-bottom: 25px; left: 0px; top: ${Math.floor(i)}px; position: absolute;">
                  <div style="width: 50px; height: 50px; background-image: url('${url}'); background-size: cover; background-position: center center; border-radius: 8px;"></div>
                  <div style="left: 66px; top: 0px; position: absolute; color: black; font-size: 16px; font-family: Inter; font-weight: 700; word-wrap: break-word">${data.name}</div>
                  <div style="right: 13%; top: 2px; position: absolute; text-align: right; color: #BDBDBD; font-size: 14px; font-family: Inter; font-weight: 400; word-wrap: break-word">${data.time}</div>
                  <div style="width: 269px; left: 66px; top: 27px; position: absolute; color: black; font-size: 14px; font-family: Inter; font-weight: 400; word-wrap: break-word">${data.quantity}</div>
                  <div style="width: 277px; height: 0px; left: 66px; top: 65px; position: absolute; border: 1px #E8E8E8 solid"></div>
                </a>
              </div>
      </div>
    </div>
  </div>
</div>


            `;
                  itemList.appendChild(div); // Append the div to the container element
                  i++;
                  itemList.style.minHeight = `${i * 50 + 400}px`;
                })
                .catch((error) => {
                  console.error('Error getting download URL: ', error);
                });
            }
          });
        })
        .catch((error) => {
          console.error('Error getting documents: ', error);
        });

      // set user information
      const userRef = doc(db, 'users', userId);
      const userStorageRef = storageRef(storage, `profile/${userId}.png`);
      getDoc(userRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            const nameElement = document.getElementById('name');
            const profileImageElement = document.getElementById('profile-image');
            const email = document.getElementById('email');
            const rating = document.getElementById('rating');
            const ratingCount = document.getElementById('rating-count');

            email.textContent = data.email;
            nameElement.textContent = data.username;
            if(rating){
              rating.textContent = "Overall rating: "+ data.rating;
            }
            if (ratingCount){
              ratingCount.textContent = "Rated " + data.ratingCount +" times";
            }
            getDownloadURL(userStorageRef)
              .then((url) => {
                profileImageElement.src = url;
              })
              .catch((error) => {
                console.error('Error retrieving profile image URL:', error);
              });
          } else {
          }
        })
        .catch((error) => {
          // Handle any errors that occurred during the fetch
          console.error('Error fetching user data:', error);
        });


      // Add event listener for logout
      const logoutButton = document.getElementById('logoutButton');
      if (logoutButton) {
        logoutButton.addEventListener('click', () => {
          signOut(auth)
            .then(() => {
              console.log('User logged out successfully');
              window.location.href = 'login.html';
            })
            .catch((error) => {
              console.error('Failed to log out:', error);
            });
        });
      }
    } else {
      window.location.href = 'login.html';
    }
  });
});
