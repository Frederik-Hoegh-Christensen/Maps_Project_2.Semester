//Write bad-ass code here

import { getFirebaseConfig } from './firebase-config.js';

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

function initMap(){
   // The center on init
  const copenhagen = { lat: 55.676098, lng: 12.568337 };

  //map init options
  const options = {
    zoom: 11,
    center: copenhagen,
    streetViewControl: false,
    mapTypeControl: false,
  }
   // The map, centered at Copenhagen
  const mapCanvas = new google.maps.Map(document.getElementById("map"), options);

  removeDefaultMapPins(mapCanvas);
}
window.initMap = initMap;

function removeDefaultMapPins(map){
  let removePOI = [
    {
      "featureType": "poi",
      "elementType": "labels",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "poi.business",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    }
  ]
  map.setOptions({styles: removePOI})
}