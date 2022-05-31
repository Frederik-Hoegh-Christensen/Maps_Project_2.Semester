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
import { setReceiptDetails } from './yourCarScript';

const app = initializeApp(getFirebaseConfig());

const auth = getAuth(app);

const googleAuthProvider = new GoogleAuthProvider();

const db = getFirestore(app);
const cloudStorage = getStorage(app);





// Call this when user goes to account page
if (window.location.href.includes("account.html")) {
  fillHistoryDropdown(db, auth.currentUser);
  displayUserInfo(auth.currentUser);
}

onAuthStateChanged(auth, user => {
  if (user != null) {
    console.log(user.email);
    signOutButton();
    accountPage(db, auth.currentUser);
  } else {
    console.log("no user");
    signInButton();
  }
});

function accountPage(db, user) {
  if (window.location.href.includes("account.html")) {
    fillHistoryDropdown(db, user);
    displayUserInfo(user);
    var changeUserInfoButton = document.getElementById("changeUserInfoButton");
    changeUserInfoButton.addEventListener("click", e => {
      changeUserInfo(user);
    });

    var confirmChangePaymentMethodButton = document.getElementById("confirmChangePaymentMethodButton");
    confirmChangePaymentMethodButton.addEventListener("click", e => {
      changePaymentMethod(db, auth.currentUser);
    });
  }
}

function signInButton() {
  document.getElementById('header-btn-sign-out').hidden = true;
  let signInButton = document.getElementById('header-btn-sign-in');
  signInButton.addEventListener("click", e => {
    logInEmail(auth);
    logInGoogle(auth, googleAuthProvider);
    initSignUp();
  });
  if (signInButton.hidden) signInButton.hidden = false;
}

function signOutButton() {
  document.getElementById('header-btn-sign-in').hidden = true;
  if (window.location.href.includes("signUp.html")) {
    window.addEventListener("load", e => {
      signUpEmail(auth);
    });
  }
}

function signOutButton() {
  document.getElementById('header-btn-sign-in').hidden = true;
  let sb = document.getElementById('header-btn-sign-out');
  sb.addEventListener("click", e => { signOut(auth) });
  if (sb.hidden) sb.hidden = false;
}


async function initMap() {
  let mapCanvas = initializeMap();
  drawCars(mapCanvas, app);
  addUserPositionPin(mapCanvas, cloudStorage)
}
window.initMap = initMap;

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