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
}

function showModal() {
    let myModal = new bootstrap.Modal(document.getElementById('endTrip'), {});
    document.getElementById('runtime').innerHTML = "Du har kørt i " + timeBegun + " min, til en pris på " + price + " kr pr min.";
    document.getElementById('toPay').innerHTML = "Total pris: " + price;
    myModal.show();
}

export async function endTrip(db, user) {
    let colRef = collection(db, 'bills');
    let q = query(colRef, where('owner', '==', user.email), where('isActive', '==', true));
    let correct = await getDocs(q);
    let thisDoc = correct.docs[0];

    await updateDoc(doc(db, 'bills', thisDoc.id), {
        isActive: false
    }).then(confir => {console.log(confir)});
    await updateDoc(doc(db,'cars',thisDoc.data().car), {
        isOcupied: false
    });
    console.log("Ended trip", thisDoc.id)
    window.location.replace('index.html')
}