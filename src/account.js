import { collection, query, where, getDocs } from "firebase/firestore"
export async function fillHistoryDropdown(db, user){
    var dropdown = document.getElementById("historyDropdown");
    //const q = await query(collection(db, "bills"), where("owner", "==", user.providerData[0].email));
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