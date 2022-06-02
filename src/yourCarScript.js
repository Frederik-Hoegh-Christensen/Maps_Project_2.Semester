import {
    getFirestore,
    query, where,
    collection,
    getDocs, getDoc,
    Timestamp,
    addDoc,
    updateDoc,
    doc,
    deleteField,
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
var price;
var isReserved;
var reservationDateTime;
var database;

export async function setReceiptDetails(db, user) {
    database = db
    let colRef = collection(db, 'bills');
    let q = query(colRef, where('owner', '==', user.email), where('isActive', '==', true));
    let correct = await getDocs(q);
    thisDoc = correct.docs[0];
    let billData = thisDoc.data();
    let carRef = billData.car;
    let docRef = doc(db, 'cars', carRef);
    car = await getDoc(docRef);
    let carData = car.data();
    let reservationTime = carData.reservationTime
    document.querySelector("#modelField").innerHTML = billData.model;

    if (reservationTime) {
        isReserved = true;
        document.querySelector("#tripBeginField").innerHTML = "Du har reserveret bilen til kl " + reservationTime;
        document.getElementById("cancelReservation").hidden = false;
        let today = new Date();
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        reservationDateTime = date + " " + reservationTime;
    } else {
        timeBegun = billData.date.toDate();
        document.querySelector("#tripBeginField").innerHTML = "Køretur påbegyndt: " + timeBegun;
        document.getElementById("cancelTrip").hidden = false;
    }
    price = carData.price;

    document.querySelector("#colorField").innerHTML = carData.color;
    document.querySelector("#pricePerKmField").innerHTML = price + " kr";

    return thisDoc;
}

var cancelButton = document.getElementById('cancelTrip');
var totalPriceField = document.getElementById('totalPriceField')
var cancelReservationButton = document.getElementById('cancelReservation');
if (cancelReservationButton) {
    setInterval(reservationIsUp, 1000);
    cancelReservationButton.addEventListener('click', showReservationModal);
}
if (totalPriceField) {
    setInterval(updateTotalPriceField, 1000);
}
if (cancelButton) {
    cancelButton.addEventListener('click', showModal);
}

function showModal() {
    let myModal = new bootstrap.Modal(document.getElementById('endTrip'), {});
    document.getElementById('runtime').innerHTML = "Du har kørt i " + timeBegun + " min, til en pris på " + price + " kr pr min.";
    document.getElementById('toPay').innerHTML = "Total pris: " + price;
    myModal.show();
}

function showReservationModal() {
    let myModal = new bootstrap.Modal(document.getElementById('endReservation'), {});
    myModal.show();
}

async function reservationIsUp() {
    const currentDate = new Date();
    const currentTime = currentDate.getTime();
    if (currentTime > Date.parse(reservationDateTime)) {
        await updateDoc(doc(database, 'cars', thisDoc.data().car), {
            reservationTime: deleteField()
        });
        await updateDoc(doc(database, 'bills', thisDoc.id), {
            date: Timestamp.fromDate(new Date())
        })
        window.location.reload();
    }
}

export async function endTrip(db, billDoc) {
    var pricePerSecond = price/60;
    var endTime = new Date();
    var tripPrice = (((endTime.getTime() - timeBegun)/1000)*pricePerSecond).toFixed(2);

    await updateDoc(doc(db, 'bills', billDoc.id), {
        isActive: false
    });
    await updateDoc(doc(db, 'cars', billDoc.data().car), {
        isOcupied: false
    });
    await updateDoc(doc(db, 'bills', billDoc.id),{
        tripPrice: tripPrice,
        endTime: endTime
    })
    window.location.replace('receipt.html')
}

export async function endReservation(db, billDoc) {
    await updateDoc(doc(db, 'bills', billDoc.id), {
        isActive: false
    });
    await updateDoc(doc(db, 'cars', billDoc.data().car), {
        isOcupied: false
    });
    window.location.replace('findCar.html')
}

export async function updateTotalPriceField() {
    const currentDate = new Date();
    const currentTime = currentDate.getTime();
    var totalPriceField = document.getElementById('totalPriceField');
    var totalPriceField2 = document.getElementById('toPay');

    var pricePerSecond = price / 60;
    if (isReserved) {
        totalPriceField.innerHTML = "Tur ikke påbegyndt.";
    } else {
        totalPriceField.innerHTML = (((currentTime - timeBegun) / 1000) * pricePerSecond).toFixed(2) + " kr.";
    }
    totalPriceField2.innerHTML = "Total pris: " + (((currentTime - timeBegun) / 1000) * pricePerSecond).toFixed(2) + " kr.";
    var runtimeField = document.getElementById("runtime");
    runtimeField.innerHTML = "Du har kørt i: " + msToTime((currentDate.getTime() - timeBegun));
    var priceField = document.getElementById("pricePerMinute");
    priceField.innerHTML = "Til en pris på " + price + " pr. minut.";

}


function msToTime(duration) {
    var seconds = parseInt((duration / 1000) % 60)
        , minutes = parseInt((duration / (1000 * 60)) % 60)
        , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    var hourString = (hours == 1) ? " time, " : " timer, ";
    var minuteString = (minutes == 1) ? " minut og " : " minutter og ";
    var secondString = (seconds == 1) ? " sekund." : " sekunder."; 
    return hours + hourString + minutes + minuteString + seconds + secondString;
}