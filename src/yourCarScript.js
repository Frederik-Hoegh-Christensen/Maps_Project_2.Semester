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

export async function setReceiptDetails(db, user){
    let docRef = collection(db, 'bills');
    
    
    const temp = query(collection(db, 'bills'), where("owner", "==", user.email), where("isActive", "==", true));
    let correct = await getDocs(temp);
    let thisDoc = correct[0];
    let theData = thisDoc.data();

    //document.querySelector("#colorField") = theData.color
    document.querySelector("#modelField").innerHTML = theData.model;
    //document.querySelector("#pricePerKmField") = 
    //document.querySelector("#tripBeginField") = "#"
    //document.querySelector("#totalPriceField") = "#"
    
}

/*document.addEventListener('DOMContentLoaded', (event) => {
    var cancelButton = document.getElementById('cancelTrip');
    cancelButton.addEventListener('click', showModal);
})*/
function showModal (){
    let myModal = new bootstrap.Modal(document.getElementById('endTrip'), {});
    myModal.show();
}
function getCarInfo() {

    const myUser = db.collection('cars').doc('78X77OdO8Nq3TnqLXOWx');
    myUser.onSnapshot(doc => {
        const price = parseDouble(doc.price())
        .then(result => {
            let myModal = new bootstrap.Modal(document.getElementById('endTrip'), {});
            document.getElementById("toPay").innerHTML = "Du er igang med at afslutte din køretur.%0D%0ADu har kørt i " + time + " min, til en pris på " + price + " pr min";
            myModal.show();
        })  
    })
}