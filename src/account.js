import { collection, query, where, getDocs, setDoc, doc, Timestamp, orderBy, QueryConstraint } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

export async function fillHistoryDropdown(db, user) {
    var dropdown = document.getElementById("historyDropdown");
    const q = query(collection(db, "bills"), where("owner", "==", user.email));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(doc => {
        let data = doc.data();
        let item = document.createElement("a");
        let dateString = data.date.toDate().toString();
        let date = dateString.split(" ")[0] + " " + dateString.split(" ")[2] + ". " + dateString.split(" ")[1] + ", " + dateString.split(" ")[3];
        let itemText = document.createTextNode(date);
        item.appendChild(itemText);
        //item.href = "index.html"; MAKE LINK TO BILL
        dropdown.appendChild(item);
        let separator = document.createElement("div");
        separator.setAttribute("class", "dropdown-divider");
        dropdown.appendChild(separator);
    });
}

export function displayUserInfo(user) {
    //var name = "test";
    //var email = "test@test.com";
    var nameNode = document.createTextNode(user.displayName);
    var emailNode = document.createTextNode(user.email);

    var nameP = document.createElement("p");
    if (user.displayName) {
        nameP.appendChild(nameNode);
    } else {
        nameP.appendChild(document.createTextNode("Navn ikke angivet"));
    }
    var emailP = document.createElement("p");
    emailP.appendChild(emailNode);

    var nameDiv = document.getElementById("nameTextDiv");
    var emailDiv = document.getElementById("emailTextDiv");

    nameDiv.appendChild(nameP);
    emailDiv.appendChild(emailP);
}

export function changeUserInfo(user) {
    if (user.providerData[0].providerId === "google.com") {
        location.reload();
        alert("Du henvises til Google for at ændre dine kontooplysninger.");
    } else {
        var changeDisplayNameInput = document.getElementById("displayName");
        var changeEmailInput = document.getElementById("email");
        var changePasswordInput = document.getElementById("password");
        var changePasswordRepeatInput = document.getElementById("repeatPassword");
        var confirmDisplayNameButton = document.getElementById("changeDisplayNameButton");
        var confirmEmailButton = document.getElementById("changeEmailButton");
        var confirmPasswordButton = document.getElementById("changePasswordButton");

        if (user.displayName) changeDisplayNameInput.setAttribute("placeholder", user.displayName);
        else changeDisplayNameInput.setAttribute("placeholder", "Navn");
        changeEmailInput.setAttribute("placeholder", user.email);

        confirmDisplayNameButton.addEventListener("click", e => {
            e.preventDefault();
            try {
                updateProfile(user, {
                    displayName: changeDisplayNameInput.value
                });
                alert("Ændringerne er blevet gemt");
            } catch (error) {
                alert(error.message);
            }
        });

        confirmEmailButton.addEventListener("click", e => {
            e.preventDefault();
            try {
                updateProfile(user, {
                    email: changeEmailInput.value
                });
                alert("Ændringerne er blevet gemt");
            } catch (error) {
                alert(error.message);
            }
        });

        confirmPasswordButton.addEventListener("click", e => {
            e.preventDefault();
            if (changePasswordInput.value == changePasswordRepeatInput.value && changePasswordInput.value.length > 7) {
                try {
                    updatePassword(user, changePasswordInput.value);
                    alert("Ændringerne er blevet gemt");
                } catch (error) {
                    alert(error.message);
                }
            } else {
                alert("Tjek at kodeord matcher og er længere end 7 karakterer");
            }
        });
    }
}

export async function changePaymentMethod(db, user) {
    var nameInput = document.getElementById("nameOnCard");
    var cardNumberInput = document.getElementById("cardNumber");
    var expDateMonthInput = document.getElementById("expDateMonth");
    var expDateYearInput = document.getElementById("expDateYear");
    var CVVInput = document.getElementById("CVV");
    var paymentMethodRef = collection(db, "paymentMethods");
    if (cardNumberInput.value.length === 16 && expDateMonthInput.value.length === 2 && expDateYearInput.value.length === 4 && CVVInput.value.length === 3) {
        try {
            var expDate = new Date(expDateYearInput.value, expDateMonthInput.value, 1, 0, 0, 0);
            var expDateTimetamp = Timestamp.fromDate(expDate);
            await setDoc(doc(paymentMethodRef, user.email), {
                name: nameInput.value,
                cardNumber: cardNumberInput.value,
                CVV: CVVInput.value,
                expDate: expDateTimetamp
            });

            alert("Ændringer blev gemt");
        } catch (error) {
            alert(error.message);
        }
    } else {
        alert("Tjek venligst at du har indtastet korrekte oplysninger");
    }
}