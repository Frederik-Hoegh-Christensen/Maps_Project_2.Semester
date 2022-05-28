import {
  query, where,
  collection, 
  getDocs, 
} from 'firebase/firestore';

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

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

function addMarker(map, carData){
  let marker = new google.maps.Marker({
      position: {lat: carData.coords.latitude, lng: carData.coords.longitude},
      map: map,
      title: carData.title,
  })
  marker.addListener("click", () => {
      document.getElementById('car-title').textContent = carData.title;
      document.getElementById('card-text-price').textContent = carData.price;
      progressBarPower(document.getElementById('power-progress-bar'), carData.power);
      document.getElementById("car-card").removeAttribute('hidden');
  })
  marker.setMap(map);
}

async function retrieveCars(db){
  let carDataArray = Array();
  
  let carsRef = collection(db, 'cars');
  let q = query(carsRef, where('isOcupied','==', false));
  let qSnapshot = await getDocs(q);
  qSnapshot.forEach(doc => {
      let carData = doc.data();
      carDataArray.push(carData);
  });
  return carDataArray;
}

export async function drawCars(mapCanvas, firestore, cloudStorage){
    let carsArray = await retrieveCars(firestore);

    for(let car of carsArray){
      addMarker(mapCanvas, car);
    }
}

function progressBarPower(progressBar, pow){
  let percentString = pow + '%';
  progressBar.style.width = percentString;
  progressBar.textContent = percentString;
  progressBar.setAttribute('aria-valuenow', pow);
}

function retrieveCarImages(cloud, carArray){
  let result = {};  
}