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
//import{retrieveCarImages} from './mapCanvas';


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


  //objs.sort( compare );




export async function getReceiptPrice(db, user) {
    let colRef = collection(db, 'bills');
    let q = query(colRef, where('owner', '==', user.email));
    let correct = await getDocs(q);
    var max = correct.docs[0].data().date.seconds; 
    var counter=0; 
    var index=0; 

     correct.forEach(element => {
        var temp = element.data().date.seconds; 
       if(temp  > max){
        max=temp; 
        index=counter; 
       }
       counter++;
       


    });
    //let carTitle=carDataObject.carData.title;
    let thisDoc = correct.docs[index];
    let billData = thisDoc.data();
    let priceRef = billData.tripPrice;
    let endTime = billData.endTime;
    let timeBegun = billData.date;
    //let CarPic=billData.retrieveCarImages();
    let durationRef = (endTime*1000)-(timeBegun*1000); 
    var finaltime= msToTime(durationRef); 
    let modelRef = billData.model;
    
//if(modelRef=carTitle) {
//var carPic =carTitle.retrieveCarImages(cloud,carArray)


//}


   
    document.getElementById('duration').innerHTML= finaltime;
    document.getElementById('totalPay').innerHTML= priceRef;
    document.getElementById('begintime').innerHTML= timeBegun.toDate();
    document.getElementById('User_receipt').innerHTML= user.email;
    document.getElementById('bilModel').innerHTML =  modelRef;
    //document.getElementById('carPic').innerHTML="bil" + carPic;

    console.log(durationRef);

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
   








