//Write bad-ass code here

import { getFirebaseConfig } from './firebase-config.js';
import { initializeMap, drawCars, addUserPositionPin, getUserLocation } from './mapCanvas';
import { fillHistoryDropdown, displayUserInfo } from './account';

import { initializeApp } from 'firebase/app';

import { getAuth, onAuthStateChanged, GoogleAuthProvider,
         signInWithPopup, signInWithRedirect, signOut, } 
from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import {setReceiptDetails, endTrip} from './yourCarScript';

const app = initializeApp(getFirebaseConfig());

const auth = getAuth(app);

const googleAuthProvider = new GoogleAuthProvider();

const db = getFirestore(app);
const cloudStorage = getStorage(app);





// Call this when user goes to account page
if(window.location.href.includes("account.html")){
  fillHistoryDropdown(db, auth.currentUser);
  displayUserInfo(auth.currentUser);
  
}




onAuthStateChanged(auth, user =>{
  if(user != null){
      console.log(user.email);
      signOutButton();
      if(window.location.href.includes("yourCar.html")){
        setReceiptDetails(db, auth.currentUser);
      }
  } else {
      console.log("no user");
      signInButton();
  }
})

function signInButton(){
  let signOutButton = document.getElementById('header-btn-sign-out');
  if(signOutButton) {
    signOutButton.hidden = true
  }

  let signInButton = document.getElementById('header-btn-sign-in');
  if(signInButton) {
    signInButton.addEventListener("click", e =>{
      signInWithRedirect(auth, googleAuthProvider)
      .catch((error) => {
        if (error.code == "auth/web-storage-unsupported") {
          alert("Please enable cookies to use this feature.");
        }else{
          alert(error.message);
        }});
    })
    if(signInButton.hidden) signInButton.hidden = false;
  }
}

 function signOutButton(){
  let signInButton = document.getElementById('header-btn-sign-in');
  if(signInButton) {
    signInButton.hidden = true;
  }

  let sb = document.getElementById('header-btn-sign-out');
  if(sb){
    sb.addEventListener("click", e => {signOut(auth)});
    if(sb.hidden) sb.hidden = false;
  }
} 


async function initMap(){
  let mapCanvas = initializeMap();
  drawCars(mapCanvas, app);
  addUserPositionPin(mapCanvas, cloudStorage)
}
window.initMap = initMap;

function setYourCarPage(db, user){
  if(window.location.href.includes("yourCar.html")){
    console.log(user);
    console.log(db);
    setReceiptDetails(db, user);
  }
}

  let endTripButton = document.getElementById('endTrip');
  if(endTripButton) {
    endTripButton.addEventListener("click", e =>{
      endTrip(db, auth.currentUser);
    })
  }



/*
    A helper method for creating HTML elements in one line
    @tag        :  should be a string
    @attributes :  should be declared like an object
    Example
    createHTMLElm("div", {class:"centeredDiv", id:"myContentDiv"})
    Chaining together with ,
*/
export function createHTMLElm(tag, attributes){
  let result = document.createElement(tag);
  if(attributes == null) return result;
  Object.entries(attributes).forEach(attr =>{
      result.setAttribute(attr[0], attr[1])
  })
    return result;
}