import {
  getFirestore,
  query, where,
  collection, 
  getDocs, 
  Timestamp,
  addDoc,
  updateDoc,
  getDoc,
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
    fullscreenControl: false,
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

  // set the distance text
  calculateUserDistanceToCarAndShow(carData.coords)

  //When user is not logged on, we want to display something different.
  if(!auth.currentUser){
    document.getElementById('card-button-grp-loggged-on').hidden = true;
    document.getElementById('card-button-grp-no-login').removeAttribute('hidden');
    return;
  }

  //Setup "book now" / "open now" button
  setupOpenNowButton(db, carFirestoreId, auth,carData);
  //TODO: setup "reserve" button
  setupReserveButton(db, carFirestoreId, auth, carData);
}

function progressBarPower(progressBar, pow){
  let percentString = pow + '%';
  progressBar.style.width = percentString;
  progressBar.textContent = percentString;
  progressBar.setAttribute('aria-valuenow', pow);
}

async function calculateUserDistanceToCarAndShow(carCoords){
  if(!navigator.geolocation){
    document.getElementById('card-distance-text')
    .textContent = "Bruger Lokation Blokeret"
  }
  let position;
  let locationPromise = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(pos => {
      position = pos.coords;
      resolve({position})
    });
  })

  locationPromise.then(userCoords =>{
    //Shoutout to stackoverflow - Haversine below
    //https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
    let p = userCoords.position;

    let dLat = toRad(carCoords.latitude -  p.latitude);
    let dLon = toRad(carCoords.longitude - p.longitude)
    
    let R = 6371

    let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(toRad(carCoords.latitude)) * Math.cos(toRad(p.latitude))
                * Math.sin(dLon/2) * Math.sin(dLon/2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    let dist = R * c;

    let distValField = document.getElementById('card-distance-val');
    distValField.textContent = dist > 1 ?  dist.toFixed(1): (dist*1000).toFixed(1);
    
    let distUnitField = document.getElementById('card-distance-unit');
    distUnitField.textContent = dist > 1 ? " KM":" M";
  })
}

function toRad(num){
  return num * Math.PI / 180;
}

function setupOpenNowButton(db, carFirestoreId,auth, carData){
  let openNowBtnContainer = document.getElementById('btn-open-now-container');
  let openNowBtn = createHTMLElm("button", {
    type: "button",
    class: "btn btn-primary",
    id: "btn-open-now",
  })
  openNowBtn.textContent = "Lås op";
  openNowBtn.addEventListener("click", e =>{
    replaceButtonsWithSpinner();

    let paymentRef = doc(db, 'paymentMethods', auth.currentUser.email);
    getDoc(paymentRef)
    .then(paymentCard => {
      if(paymentCard.exists()){
        let carRef = doc(db, 'cars', carFirestoreId);

        updateDoc(carRef, {
          isOcupied: true,
        })
        .then(fulfillment => {
          createBill(db, auth.currentUser.email, carFirestoreId, carData)
          window.location.replace('yourCar.html')
        })
        .catch(err =>{console.log(err)})
      }
      else{
        let spanFC = document.getElementById('firebase-confirmation-field');
        spanFC.textContent = "Du skal have en betalingsmetode. Gå til konto";
        spanFC.setAttribute("class", "failure")
        document.getElementById('card-button-grp-loggged-on').hidden = true;
      }
    })
  })
  if(openNowBtnContainer){
    openNowBtnContainer.innerHTML = "";
    openNowBtnContainer.appendChild(openNowBtn);
  }
}

function setupReserveButton(db, carFirestoreId, auth, carData){
  let container = document.getElementById('card-button-grp-reservation-btn-container');
  
  let reserveBtn = createHTMLElm("button", {
    type: "button",
    class:"btn btn-secondary",
    id:"btn-reserve",
  })
  reserveBtn.textContent = "Reserver";
  reserveBtn.addEventListener("click", e => {
    let reservationTime = document.getElementById('input-reserve-time').value;
    if(!reservationTime){
      let spanFC = document.getElementById('firebase-confirmation-field');
      spanFC.textContent = "Venligst vælg en tid";
      spanFC.setAttribute("class", "failure");
      return;
    }
    replaceButtonsWithSpinner();

    let paymentRef = doc(db, 'paymentMethods', auth.currentUser.email);
    getDoc(paymentRef)
    .then(paymentCard => {
      if(!paymentCard.exists()){
        let spanFC = document.getElementById('firebase-confirmation-field');
        spanFC.textContent = "Du skal have en betalingsmetode. Gå til konto";
        spanFC.setAttribute("class", "failure")
        document.getElementById('card-button-grp-loggged-on').hidden = true;
        return;
      }
      let carRef = doc(db, 'cars', carFirestoreId);

      updateDoc(carRef, {
        isOcupied: true,
        reservationTime: reservationTime,
      })
      .then(fulfillment => {
        createBill(db, auth.currentUser.email, carFirestoreId, carData)
        window.location.replace('yourCar.html')
      })
      .catch(err => {
        console.log(err)
      })
    })
  })
  if(container){
    container.innerHTML = "";
    container.appendChild(reserveBtn); 
  }
}

function createBill(db, userEmail, carFirestoreId, carData){
  let billsRef = collection(db, 'bills');
  addDoc(billsRef, {
    date: Timestamp.fromDate(new Date()),
    model: carData.title,
    owner: userEmail,
    car: carFirestoreId,
    isActive: true,
  })
  .then(succes => {
    //We can potentially do something here
    
  })
  .catch(err => console.log(err))
}

function replaceButtonsWithSpinner(){  
  let containerToPlaceSpinner = document.getElementById('card-button-grp-loggged-on');

  let outerSpinnerDiv = createHTMLElm("div", {
    class: "d-flex justify-content-center"
  })

  let spinnerBorder = createHTMLElm("div",{
    class: "spinner-border",
    role: "status"
  })

  let spinnerScreenReader = createHTMLElm("span",{
    class: "sr-only",
  })
  spinnerBorder.appendChild(spinnerScreenReader);
  outerSpinnerDiv.appendChild(spinnerBorder);
  
  containerToPlaceSpinner.innerHTML ="";
  containerToPlaceSpinner.appendChild(outerSpinnerDiv);
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
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position => {
      geoLocationSuccessful(map, cloudStorage, position.coords);
    });
  } else{
    console.log("Geolocation is blocked")
  }
}

async function geoLocationSuccessful(map, cloudStorage, coords){
  let userPositionIcon;
  await getDownloadURL(ref(cloudStorage, 'userLocation.png'))
  .then(imgURL => {userPositionIcon = imgURL});

  let userPositionMarker = new google.maps.Marker({
    position: {lat: coords.latitude, lng: coords.longitude},
    //position: {lat:55.670348659964155, lng: 12.592793398842328},
    map: map,
    icon: userPositionIcon,
    title: "Her står du"
})
}

export async function drawUserCar(map, db, carReference, cloudStorage){
  let carData =  (await getDoc(doc(db, 'cars', carReference))).data();
  let marker = new google.maps.Marker({
      position: {lat: carData.coords.latitude, lng: carData.coords.longitude},
      map: map,
      title: "Your car: " + carData.title,
  })
  let title = carData.title;
  let imgRef = '/carPictures/'+ title +'.png';
    getDownloadURL(ref(cloudStorage, imgRef))
    .then(imgURL =>{
      document.getElementById('car-card-img').src = (title, imgURL);
    })
    .catch(err => {
      console.log(err);
    })
  marker.setMap(map);
}