import {
  getFirestore,
  query, where,
  collection, 
  getDocs, 
  Timestamp,
  addDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  getDownloadURL
} from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { createHTMLElm } from './main';

export function initializeMap(){
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
  return mapCanvas;
 }


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

function addMarker(map, carDataObject, imgMap, auth, db){
  let carData = carDataObject.carData;
  let marker = new google.maps.Marker({
      position: {lat: carData.coords.latitude, lng: carData.coords.longitude},
      map: map,
      title: carData.title,
  })
  marker.addListener("click", () => {
      setupCarPreviewingCard(carDataObject, imgMap, auth, db);
  })
  marker.setMap(map);
}

function setupCarPreviewingCard(carDataObject, imgMap, auth, db){
  let carData = carDataObject.carData;
  let carFirestoreId = carDataObject.id;

  //We could have possibly used a HTML template :/
  document.getElementById("car-card").removeAttribute('hidden');
  document.getElementById('car-title').textContent = carData.title;
  document.getElementById('card-text-price').textContent = carData.price;
  progressBarPower(document.getElementById('power-progress-bar'), carData.power);
  document.getElementById('car-card-img').src = imgMap.get(carData.title);

  //When user is not logged on, we want to display something different.
  if(!auth.currentUser){
    document.getElementById('card-button-grp-loggged-on').hidden = true;
    document.getElementById('card-button-grp-no-login').removeAttribute('hidden');
    return;
  }

  //Setup "book now" / "open now" button
  let openNowBtnContainer = document.getElementById('btn-open-now-container');
  let openNowBtn = createHTMLElm("button", {
    type: "button",
    class: "btn btn-primary",
    id: "btn-open-now",
  })
  openNowBtn.textContent = "Lås op";
  openNowBtn.addEventListener("click", e =>{
    let carRef = doc(db, 'cars', carFirestoreId);
    
    updateDoc(carRef, {
      isOcupied: true,
    })
    .then(fulfillment => {
      let billsRef = collection(db, 'bills');
      addDoc(billsRef, {
        date: Timestamp.fromDate(new Date()),
        model: carData.title,
        owner: auth.currentUser.uid,
        car: carFirestoreId,
      })
      .then(succes => {console.log(succes)})
      .catch(err => console.log(err))
    })
    .catch(err =>{console.log(err)})
    
  })
  openNowBtnContainer.innerHTML = "";
  openNowBtnContainer.appendChild(openNowBtn);

  //TODO: setup "reserve" button
}

async function retrieveCars(db){
  let carDataArray = Array();
  
  let carsRef = collection(db, 'cars');
  let q = query(carsRef, where('isOcupied','==', false));
  let qSnapshot = await getDocs(q);
  qSnapshot.forEach(doc => {
      let carData = doc.data();
      carDataArray.push({
        carData: carData,
        id: doc.id,
      });
  });
  return carDataArray;
}

export async function drawCars(mapCanvas, firebaseApp){
  let firestore = getFirestore(firebaseApp);
  let cloudStorage = getStorage(firebaseApp);
  let auth = getAuth(firebaseApp)

  let carsArray = await retrieveCars(firestore);
  let carToImgMap = retrieveCarImages(cloudStorage, carsArray)

  for(let car of carsArray){
    addMarker(mapCanvas, car, carToImgMap, auth , firestore);
  }
}

function progressBarPower(progressBar, pow){
  let percentString = pow + '%';
  progressBar.style.width = percentString;
  progressBar.textContent = percentString;
  progressBar.setAttribute('aria-valuenow', pow);
}

function retrieveCarImages(cloud, carArray){
  let result = new Map();
  carArray.forEach(carDataObject =>{
    let title = carDataObject.carData.title;
    let imgRef = '/carPictures/'+title+'.png';
    getDownloadURL(ref(cloud, imgRef))
    .then(imgURL =>{
        result.set(title, imgURL);
    })
    .catch(err => {
      console.log(err);
    })
  })
  return result;
}

export async function addUserPositionPin(map, cloudStorage){
  /*  NO GEOLOCATION UNTILL HTTPS
  let position = getUserLocation();
  if(!position) return;
  */

  let userPositionIcon;
  await getDownloadURL(ref(cloudStorage, 'userLocation.png'))
  .then(imgURL => {userPositionIcon = imgURL});

  let userPositionMarker = new google.maps.Marker({
    //position: {lat: position.coords.latitude, lng: position.coords.longitude},
    position: {lat:55.670348659964155, lng: 12.592793398842328},
    map: map,
    icon: userPositionIcon,
    title: "You are here"
})
}

export function getUserLocation(){
  if(navigator.getLocation){
    let position = navigator.geolocation.getCurrentPosition;
    return position;
  } else{
    console.log("Geolocation is blocked")
    return null;
  }
}