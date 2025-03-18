import { db } from './firebaseConfig.js';
import { getStorage, ref as storageRef, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';

function getQueryParams() {
  var queryParams = {};
  location.search
    .substring(1)
    .split('&')
    .forEach(function (paramPair) {
      const pair = paramPair.split('=');
      queryParams[pair[0]] = decodeURIComponent(pair[1]);
    });
  return queryParams;
}

document.addEventListener('DOMContentLoaded', () => {
  // Your code here
  var params = getQueryParams();
  var searchValue = params.search;
  var filterValue = params.category;
  // const auth = getAuth();
  const storage = getStorage(); // Initialize Firebase Storage instance
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     console.log('User is logged in:', user);
  //     console.log('User is logged in:', user.uid);
  //   } else {
  //     window.location.href = 'login.html';
  //   }
  // });
  if (typeof filterValue !== 'undefined' && filterValue == 'Users') {
    getDocs(collection(db, 'users'))
      .then((querySnapshot) => {
        const itemList = document.getElementById('result'); // Get the container element
        let i = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (!data.closed || !data.reserved) {
            const pathName = new URL(data.itemImageUrl).pathname;
            const imageURL = pathName.substring(pathName.lastIndexOf('/') + 1);
            const imageRef = storageRef(storage, `profile/${imageURL}`); // Construct the reference to the image file
            console.log(data.category);
            getDownloadURL(imageRef) // Fetch the URL for the image
              .then((url) => {
                const div = document.createElement('div'); // Create a new div element
                div.innerHTML = `
            <div style="width: 110px; height: 177px; padding-bottom: 25px; left: ${Math.floor(i % 3) * 126}px; top: ${Math.floor(i / 3) * 170 + 45}px; position: absolute;">
              <div style="width: 110px; height: 110px; background-image: url('${url}'); background-size: cover; background-position: center center; border-radius: 8px;"></div>
                <div style="top: 120px;position: absolute; width: 110px; color: black; font-size: 14px; font-family: Inter; font-weight: 600; word-wrap: break-word">${data.username}</div>
                <div style="position:relative; top:32px;width: 110px; color: black; font-size: 12px; font-family: Inter; font-weight: 400; word-wrap: break-word">${data.email}</div>
             </div>
          `;
                itemList.appendChild(div); // Append the div to the container element
                i++;
                itemList.style.minHeight = `${(i / 3) * 170 + 200}px`;

              })
              .catch(() => {
                const url = 'images/user.png';
                const div = document.createElement('div'); // Create a new div element
                div.innerHTML = `
           <a href="another_profile.html?userId=${data.userId}">
            <div style="width: 110px; height: 177px; padding-bottom: 25px; left: ${Math.floor(i % 3) * 126}px; top: ${Math.floor(i / 3) * 170 + 45}px; position: absolute;">
              <div style="width: 110px; height: 110px; background-image: url('${url}'); background-size: cover; background-position: center center; border-radius: 8px;"></div>
                <div style="top: 120px;position: absolute; width: 110px; color: black; font-size: 14px; font-family: Inter; font-weight: 600; word-wrap: break-word">${data.username}</div>
                <div style="position:relative; top:32px;width: 110px; color: black; font-size: 12px; font-family: Inter; font-weight: 400; word-wrap: break-word">${data.email}</div>
             </div>
             </a>
          `;
                itemList.appendChild(div); // Append the div to the container element
                i++;
                itemList.style.minHeight = `${(i / 3) * 170 + 200}px`;

              });
          }
        });
      })
      .catch((error) => {
        console.error('Error getting documents: ', error);
      });
  } else {
    getDocs(collection(db, 'items'))
      .then((querySnapshot) => {
        const itemList = document.getElementById('result'); // Get the container element
        let i = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (!data.closed) {
            const pathName = new URL(data.itemImageUrl).pathname;
            const imageURL = pathName.substring(pathName.lastIndexOf('/') + 1);
            const imageRef = storageRef(storage, `${imageURL}`); // Construct the reference to the image file

            console.log(data.category);
            if (
              (typeof searchValue !== 'undefined' && String(data.name).toLowerCase().includes(searchValue.toLowerCase())) ||
              (typeof searchValue !== 'undefined' && String(data.category).toLowerCase().includes(searchValue.toLowerCase())) ||
              (typeof filterValue !== 'undefined' && String(data.category).toLowerCase().includes(filterValue.toLowerCase()))
            ) {
              getDownloadURL(imageRef) // Fetch the URL for the image
                .then((url) => {
                  const div = document.createElement('div'); // Create a new div element
                  div.innerHTML = `
  <div style="width: 100px; height: 177px; padding-bottom: 25px; left: ${Math.floor(i % 3) * 116}px; top: ${Math.floor(i / 3) * 170 + 45}px; position: absolute;">
    <a href="product_info.html?itemId=${data.id}">
      <div style="width: 100px; height: 110px; background-image: url('${url}'); background-size: contain; background-repeat: no-repeat; background-position: center center; border-radius: 8px;"></div>
      <div style="top: 120px; position: absolute; width: 100px; color: black; font-size: 14px; font-family: Inter; font-weight: 600; word-wrap: break-word;">${data.name}</div>
      <div style="position: relative; top: 32px; width: 100px; color: black; font-size: 14px; font-family: Inter; font-weight: 400; word-wrap: break-word;">${data.quantity}</div>
    </a>
  </div>`;
                  itemList.appendChild(div); // Append the div to the container element
                  i++;
                  itemList.style.minHeight = `${(i / 3) * 170 + 200}px`;

                });
            }
          }
        });
      })
      .catch((error) => {
        console.error('Error getting documents: ', error);
      });
  }
});
