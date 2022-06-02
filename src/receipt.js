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




export async function getReceiptPrice(db, user) {
    let colRef = collection(db, 'bills');
    let q = query(colRef, where('owner', '==', user.email));
    let correct = await getDocs(q);
   let thisDoc = correct.docs[0];
    let billData = thisDoc.data();
    let priceRef = billData.date;
    timeBegun = billData.date.toDate();


   

    document.getElementById('totalPay').innerHTML=priceRef; 

    console.log(colRef+"colref");
    console.log(q+"q");
    console.log(correct+"correct");
    console.log(thisDoc+"doc");
    console.log(billData+"billdata");
    console.log(priceRef+"price");



   
    
}


export async function getTime(){

var currentDate=new Date(); 

var currentTime=currentDate.getTime(); 


return msToTime(currentTime-timeBegun); 

}

export async function getPrice(){


var pricePerSecond=price/60; 

console.log((getTime()/1000)+ "time");

console.log(pricePerSecond);

return (((getTime()/1000)*pricePerSecond).toFixed(2).toString);



}
   








