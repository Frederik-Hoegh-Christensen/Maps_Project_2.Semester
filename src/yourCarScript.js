import {
    getFirestore,
    query, where,
    collection,
    getDocs, getDoc,
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

var thisDoc;
var car;
var timeBegun;
var endTime;
var price;



document.addEventListener('DOMContentLoaded', (event) => {
    var cancelButton = document.getElementById('cancelTrip');
    var totalPriceField = document.getElementById('totalPriceField')
    if (totalPriceField) {
        setInterval(updateTotalPriceField, 1000);
    }
    if(cancelButton){
        cancelButton.addEventListener('click', showModal);
        
    }
})



export async function setReceiptDetails(db, user) {
    let colRef = collection(db, 'bills');
    let q = query(colRef, where('owner', '==', user.email), where('isActive', '==', true));
    let correct = await getDocs(q);
    thisDoc = correct.docs[0];
    let billData = thisDoc.data();
    let carRef = billData.car;
    timeBegun = billData.date.toDate();

    document.querySelector("#modelField").innerHTML = billData.model;
    document.querySelector("#tripBeginField").innerHTML = timeBegun;

    let docRef = doc(db, 'cars', carRef);
    car = await getDoc(docRef);
    let carData = car.data();
    price = carData.price;

    document.querySelector("#colorField").innerHTML = carData.color;
    document.querySelector("#pricePerKmField").innerHTML = price + " kr";
    //document.querySelector("#totalPriceField").innerHTML = 

    return thisDoc;
}

function showModal() {
    let myModal = new bootstrap.Modal(document.getElementById('endTrip'), {});

    document.getElementById('runtime').innerHTML = "Du har kørt i " + timeBegun + " min, til en pris på " + price + " kr pr min.";
    document.getElementById('toPay').innerHTML = "Total pris: " + price;
    myModal.show();
}

export async function endTrip(db, billDoc) {
    await updateDoc(doc(db, 'bills', billDoc.id), {
        isActive: false
    });
    await updateDoc(doc(db,'cars',billDoc.data().car), {
        isOcupied: false
    });
    window.location.replace('index.html')
}

export async function updateTotalPriceField(){
    const currentDate = new Date();
    const currentTime = currentDate.getTime();
    var totalPriceField = document.getElementById('totalPriceField');
    var totalPriceField2 = document.getElementById('toPay');
    
    var pricePerSecond = price/60;
    totalPriceField.innerHTML = (((currentTime - timeBegun)/1000)*pricePerSecond).toFixed(2) + " kr.";
    console.log(totalPriceField2);
    totalPriceField2.innerHTML ="Total pris: " + (((currentTime - timeBegun)/1000)*pricePerSecond).toFixed(2) + " kr.";
    var runtimeField = document.getElementById("runtime");
    runtimeField.innerHTML ="Du har kørt i: " +  msToTime((currentDate.getTime() - timeBegun));
    var priceField = document.getElementById("pricePerMinute");
    priceField.innerHTML = "Til en pris på " + price + " pr. minut.";
    
}


function msToTime(duration) {
    var milliseconds = parseInt((duration%1000)/100)
    , seconds = parseInt((duration/1000)%60)
    , minutes = parseInt((duration/(1000*60))%60)
    , hours = parseInt((duration/(1000*60*60))%24);

   //hours = (hours < 10) ? "0" + hours : hours;
   minutes = (minutes < 10) ? "0" + minutes : minutes;
   seconds = (seconds < 10) ? "0" + seconds : seconds;
   var timeString = (hours == 1) ? " time " : " timer ";

   return hours + timeString + minutes + " minutter og " + seconds + " sekunder.";
}