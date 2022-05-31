//Write bad-ass code here

import { getFirebaseConfig } from './firebase-config.js';
import { initializeMap, drawCars, addUserPositionPin, getUserLocation } from './mapCanvas';
import { fillHistoryDropdown, displayUserInfo, changeUserInfo, changePaymentMethod } from './account';
import { initSignUp, logInEmail, logInGoogle, signUpEmail } from './sign-in-sign-up.js';

import { initializeApp } from 'firebase/app';

import {
  getAuth, onAuthStateChanged, GoogleAuthProvider,
  signInWithPopup, signInWithRedirect, signOut, signInWithEmailAndPassword,
}
  from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import {setReceiptDetails, endTrip} from './yourCarScript';

const app = initializeApp(getFirebaseConfig());

const auth = getAuth(app);

const googleAuthProvider = new GoogleAuthProvider();

const db = getFirestore(app);
const cloudStorage = getStorage(app);

onAuthStateChanged(auth, user => {
  if (user != null) {
    console.log(user.toJSON());
    if(!window.location.href.includes("signUp.html"))signOutButton();
    if(window.location.href.includes("account.html"))accountPage(db, auth.currentUser);
  } else {
    console.log("no user");
    if(!window.location.href.includes("signUp.html"))signInButton();
  }
});

function accountPage(db, user) {
  fillHistoryDropdown(db, user);
  displayUserInfo(user);
  var changeUserInfoButton = document.getElementById("changeUserInfoButton");
  changeUserInfoButton.addEventListener("click", e => {
    e.preventDefault();
    changeUserInfo(user);
  });

  var confirmChangePaymentMethodButton = document.getElementById("confirmChangePaymentMethodButton");
  confirmChangePaymentMethodButton.addEventListener("click", e => {
    e.preventDefault();
    changePaymentMethod(db, user);
  });
}

function signInButton() {
  document.getElementById('header-btn-sign-out').hidden = true;
  let signInButtons = document.getElementsByClassName('btn-sign-in-modal-toggle');
  if(signInButtons){
    for (let i = 0; i < signInButtons.length; i++) {
      signInButtons[i].addEventListener("click", e => {
        e.preventDefault();
        logInEmail(auth);
        logInGoogle(auth, googleAuthProvider);
        initSignUp();
      });
      if (signInButtons[i].hidden) signInButtons[i].hidden = false;
    };
  }
}

if (window.location.href.includes("signUp.html")) {
  window.addEventListener("load", e => {
    e.preventDefault();
    signUpEmail(auth);
  });
}

function signOutButton() {
  document.getElementById('header-btn-sign-in').hidden = true;
  let sb = document.getElementById("header-btn-sign-out");
  if(sb){
    sb.addEventListener("click", e => {
      signOut(auth);
    });
    if(sb.hidden) sb.hidden = false;
  }
}


async function initMap() {
  let mapCanvas = initializeMap();
  drawCars(mapCanvas, app);
  addUserPositionPin(mapCanvas, cloudStorage)
}
window.initMap = initMap;

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
export function createHTMLElm(tag, attributes) {
  let result = document.createElement(tag);
  if (attributes == null) return result;
  Object.entries(attributes).forEach(attr => {
    result.setAttribute(attr[0], attr[1])
  });
  return result;
}