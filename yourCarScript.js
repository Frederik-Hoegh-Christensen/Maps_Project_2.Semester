document.addEventListener('DOMContentLoaded', (event) => {
    var cancelButton = document.getElementById('cancelTrip');
    cancelButton.addEventListener('click', showModal);
})
function showModal (){
    let myModal = new bootstrap.Modal(document.getElementById('endTrip'), {});
    myModal.show();
}
function getCarInfo() {

    const myUser = db.collection('cars').doc('78X77OdO8Nq3TnqLXOWx');
    myUser.onSnapshot(doc => {
        const price = parseInt(doc.price())
        .then(result => {
            let myModal = new bootstrap.Modal(document.getElementById('endTrip'), {});
            document.getElementById("toPay").innerHTML = "Du er igang med at afslutte din køretur.%0D%0ADu har kørt i " + time + " min, til en pris på " + price + " pr min";
            myModal.show();
        })  
    })
}