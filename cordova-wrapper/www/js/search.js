import { getStorage, ref as storageRef, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';

document.getElementById('search').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    // Checks for the "Enter" key
    var searchValue = this.value;
    console.log(searchValue);
    window.location.href = 'result.html?search=' + searchValue;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const categories = document.querySelectorAll('.category');
  // const auth = getAuth();
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     console.log('User is logged in:', user);
  //     console.log('User is logged in:', user.uid);
  //   } else {
  //     window.location.href = 'login.html';
  //   }
  // });
  categories.forEach((category) => {
    category.addEventListener('click', function () {
      const categoryName = this.getAttribute('data-category');
      window.location.href = `result.html?category=${encodeURIComponent(categoryName)}`;
    });
  });
});
