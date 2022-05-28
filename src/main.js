//Write bad-ass code here

import { getFirebaseConfig } from './firebase-config.js';
import { initializeMap, drawCars } from './mapCanvas';
import { initMap } from './mapCanvas';
import { fillHistoryDropdown, displayUserInfo } from './account';

import { initializeApp } from 'firebase/app';

import { getAuth, onAuthStateChanged, GoogleAuthProvider,
         signInWithPopup, signInWithRedirect, signOut, } 
from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(getFirebaseConfig());

const auth = getAuth(app);

const googleAuthProvider = new GoogleAuthProvider();

const db = getFirestore(app);
const cloudStorage = getStorage(app);

// Call this when user goes to account page
fillHistoryDropdown(db, auth.currentUser);
displayUserInfo(auth.currentUser);

onAuthStateChanged(auth, user =>{
  if(user != null){
      console.log(user.email);
      signOutButton();
  } else {
      console.log("no user");
  }
})

//This is not the way. Just want to see if it works.
var googleButton = document.getElementById("googleButton");
if(googleButton){
  googleButton.addEventListener("click",e => {
    signInWithRedirect(auth, googleAuthProvider)
      .catch((error) => {
        if (error.code == "auth/web-storage-unsupported") {
          alert("Please enable cookies to use this feature.");
        }else{
          alert(error.message);
        }
      }
    );
  });
}

function signOutButton(){
  let sb = document.getElementById('signOutButton');
  sb.addEventListener("click", e => {signOut(auth)});
  sb.removeAttribute('hidden');
}


async function initMap(){
  let mapCanvas = initializeMap();
  drawCars(mapCanvas, db, cloudStorage);
  
}
window.initMap = initMap;