import { collection, query, where, getDocs, setDoc, doc, Timestamp } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
export async function fillHistoryDropdown(db, user){
    var dropdown = document.getElementById("historyDropdown");
    //const q = await query(collection(db, "bills"), where("owner", "==", user.providerData[0].uid));
    const q = query(collection(db, "bills"), where("owner", "==", "silas.r.arildsen@gmail.com"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        console.log(doc.data());
        var data = doc.data();
        var item = document.createElement("a");
        var date = data.date.toDate();
        var itemText = document.createTextNode(date.toString());
        item.appendChild(itemText);
        item.href = "index.html";
        dropdown.appendChild(item);
        var separator = document.createElement("div");
        separator.setAttribute("class", "dropdown-divider");
        dropdown.appendChild(separator);
    })
}

export function displayUserInfo(user){
    //var name = user.providerData[0].displayName;
    //var email = user.providerData[0].email;
    var name = "test";
    var email = "test@test.com";
    var nameNode = document.createTextNode(name);
    var emailNode = document.createTextNode(email);

    var nameP = document.createElement("p");
    nameP.appendChild(nameNode);
    var emailP = document.createElement("p");
    emailP.appendChild(emailNode);

    var nameDiv = document.getElementById("nameTextDiv");
    var emailDiv = document.getElementById("emailTextDiv");

    nameDiv.appendChild(nameP);
    emailDiv.appendChild(emailP);
}

export function changeUserInfo(user){
    /*if (user.providerData[0].providerId === "google.com") {
        location.reload();
        alert("Du henvises til Google for at ændre dine kontooplysninger.");
    }else{*/
        var changeDisplayNameInput = document.getElementById("displayName");
        var changeEmailInput = document.getElementById("email");
        var changePasswordInput = document.getElementById("password");
        var changePasswordRepeatInput = document.getElementById("repeatPassword");
        var confirmDisplayNameButton = document.getElementById("changeDisplayNameButton");
        var confirmEmailButton = document.getElementById("changeEmailButton");
        var confirmPasswordButton = document.getElementById("changePasswordButton");

        //changeDisplayNameInput.setAttribute("placeholder", user.providerData[0].displayName);
        //changeEmailInput.setAttribute("placeholder", user.providerData[0].email);
        
        confirmDisplayNameButton.addEventListener("click", e => {
            try {
                updateProfile(user, {
                    displayName: changeDisplayNameInput.value
                });
            } catch (error) {
                alert(error.message);
            }
        });

        confirmEmailButton.addEventListener("click", e => {
            try {
                updateProfile(user, {
                    email: changeEmailInput.value
                });
            } catch (error) {
                alert(error.message);
            }
        });

        confirmPasswordButton.addEventListener("click", e => {
              if(changePasswordInput.value == changePasswordRepeatInput.value && changePasswordInput.value.length > 7){
                try {
                    updateProfile(user, {
                        password: changePasswordInput.value
                    });
                } catch (error) {
                    alert(error.message);
                }
              }else{
                alert("Tjek at kodeord matcher og er længere end 7 karakterer");
              }
        });
    }
//}

export async function changePaymentMethod(db, user){
    var nameInput = document.getElementById("nameOnCard");
    var cardNumberInput = document.getElementById("cardNumber");
    var expDateMonthInput = document.getElementById("expDateMonth");
    var expDateYearInput = document.getElementById("expDateYear");
    var CVVInput = document.getElementById("CVV");
//insert in setDoc: user.providerData[0].uid
    var paymentMethodRef = collection(db, "paymentMethods");
    if(cardNumberInput.value.length === 16 && expDateMonthInput.value.length === 2 && expDateYearInput.value.length === 4 && CVVInput.value.length === 3){
        try {
            var expDate = new Date(expDateYearInput.value, expDateMonthInput.value, 1, 0, 0, 0);
            var expDateTimetamp = Timestamp.fromDate(expDate);
            await setDoc(doc(paymentMethodRef, "asdasdasd"), {
                name: nameInput.value,
                cardNumber: cardNumberInput.value,
                CVV: CVVInput.value,
                expDate: expDateTimetamp
            });

            alert("Ændringer blev gemt");
        } catch (error) {
            alert(error.message);
        }
    }else{
        alert("Tjek venligst at du har indtastet korrekte oplysninger");
    }
}