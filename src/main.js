//Write bad-ass code here

import { getFirebaseConfig } from './firebase-config.js';
import { removeDefaultMapPins, initMap } from './mapCanvas';

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, GoogleAuthProvider,
         signInWithPopup, signInWithRedirect, signOut, } 
from 'firebase/auth';

const app = initializeApp(getFirebaseConfig());

console.log(app != null ? "Firebase is active":"no Firebase");

const auth = getAuth(app);
console.log(auth != null ? "Authentication active!":"no Authentication");
const googleAuthProvider = new GoogleAuthProvider();


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

window.initMap = initMap;

