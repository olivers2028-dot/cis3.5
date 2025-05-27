import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js';
import { updateDoc } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js';
import { db } from './firebaseConfig.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js';

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
let itemImageFilename;
let itemImageInput;
let itemImageURL;
var userId;
var username;
const storage = getStorage();

document.addEventListener('DOMContentLoaded', () => {
  console.log('loaded');
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userId = user.uid;
      const userRef = doc(db, 'users', userId);

      getDoc(userRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            username = data.username;
            console.log('Owner of item: ', userId);
          } else {
            // Handle the case when the user document does not exist
          }
        })
        .catch((error) => {
          // Handle any errors that occurred during the fetch
          console.error('Error fetching user data: ', error);
        });
    } else {
      window.location.href = 'login.html';
    }
  });

  document.getElementById('submit_button')
    .addEventListener('click', function() {
      event.preventDefault();
      var item_name = document.getElementById('item_name').value;
      var quantity = document.getElementById('quantity').value;
      var category = document.getElementById('dropdown_button').textContent;
      var description = document.getElementById('item_description').value;
      //get the current date as of pressing the submit button
      const currentDate = new Date();
      // convert to YYYY-MM-DD format
      let formattedDate = currentDate.toISOString().split('T')[0];

      const fileInput = document.getElementById('fileInp');
      if(fileInput.files.length == 0 ){
        alert('No images uploaded');
      }



      // just some debugging, check the Console in Inspect
      console.log(formattedDate);
      console.log(item_name);
      console.log(quantity);
      console.log(category);
      console.log(fileInput);

      if (item_name == '') {
        alert('Please give your item a name');
      }
      else if (quantity == '' || quantity < 1) {
        alert('Please input a valid quantity');
      }
      else if (category == 'Item Category') {
        alert('Please select a category for your item');
      }
      else if (description == null) {
        alert('Please give a description')
      }
      else {
        submitItem(item_name, quantity, category, description, formattedDate, userId, username);
        console.log('submitted');
        alert('testing')
        openPopup();
      }
    });
});

async function submitItem(item_name, item_quantity, item_category, description, time_uploaded, userID, username) {
  // Get selected year levels
  const recommendedFor = Array.from(document.querySelectorAll('#yearDropdown input:checked'))
    .map(checkbox => checkbox.value);

  // Add to Firestore document
  const docRef = await addDoc(collection(db, 'items'), {
    category: item_category,
    name: item_name,
    quantity: item_quantity,
    description: description,
    time: time_uploaded,
    userId: userID,
    username: username,
    recommendedFor: recommendedFor // Add this array field
  });
  // Get the new document Id
  const documentId = docRef.id;
  await updateDoc(docRef, { id: documentId });
  console.log('Document written with ID: ', documentId);

  if (itemImageInput.files.length > 0) {
    const imageFile = itemImageInput.files[0];
    const fileExtension = imageFile.type.split('/').pop();
    const storageRef = ref(storage, `${documentId}.${fileExtension}`); // Firebase Storage reference
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
          // add itemImageUrl property to the item document stored in Firestore
          updateDoc(docRef, { itemImageUrl: downloadURL });
        });
      },
    );
  }
}
// Function to open the popup
 function openPopup() {
   const popup = document.getElementById('popup');
   popup.classList.add('open-popup');
 }

 // Function to close the popup
 function closePopup() {
   const popup = document.getElementById('popup');
   popup.classList.remove('open-popup');
 }


// Class for a listed item object
class Item {
  constructor(
    category,
    id,
    imageFileName,
    imageURL,
    name,
    quantity,
    description,
    time,
    userId,
    username,
  ) {
    this.category = category;
    this.id = id;
    this.imageFileName = imageFileName;
    this.imageURL = imageURL;
    this.name = name;
    this.quantity = quantity;
    this.description = description;
    this.time = time;
    this.userId = userId;
    this.username = username;
  }
  toString() {
    return (
      this.category +
      ', ' +
      this.id +
      ', ' +
      this.imageFileName +
      ', ' +
      this.imageURL +
      ', ' +
      this.name +
      ',' +
      this.quantity +
      ',' +
      this.description +
      ',' +
      this.time +
      ',' +
      this.userId +
      ',' +
      this.username
    );
  }
}

// Firestore data converter
const itemConverter = {
  toFirestore: (item) => {
    return {
      category: item.category,
      id: item.id,
      imageFileName: item.imageFileName,
      imageURL: item.imageURL,
      name: item.name,
      quantity: item.quantity,
      description: item.quantity,
      time: item.time,
      userId: item.userId,
      username: item.username,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Item(
      data.category,
      data.id,
      data.imageFileName,
      data.imageURL,
      data.name,
      data.quantity,
      data.description,
      data.time,
      data.userId,
      data.username,
    );
  },
};
