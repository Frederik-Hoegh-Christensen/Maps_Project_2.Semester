import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithRedirect } from "firebase/auth";

export function initSignUp() {
    var signUpButton = document.getElementById("btn-sign-up");
    signUpButton.addEventListener("click", e => {
        window.location.href = "signUp.html";
    });
}

export function signUpEmail(auth) {
    var signUpButtonCancel = document.getElementById("btn-sign-up-cancel");
    var signUpForm = document.getElementById("form-sign-up");

    signUpButtonCancel.addEventListener("click", e => {
        e.preventDefault();
        window.location.href = "index.html";
    });
    signUpForm.addEventListener("submit", e => {
        e.preventDefault();
        var signUpEmailInput = document.getElementById("input-sign-up-email");
        var signUpPasswordInput = document.getElementById("input-sign-up-password");
        var signUpPasswordRepeatInput = document.getElementById("input-sign-up-password-repeat");

        if (signUpPasswordInput.value === signUpPasswordRepeatInput.value && signUpPasswordInput.value.length > 7) {
            createUserWithEmailAndPassword(auth, signUpEmailInput.value, signUpPasswordInput.value)
            .then(userCredential => {
                window.location.href = "account.html";
            }).catch(error => {
                alert(error.message);
            });
        } else {
            alert("Tjek at kodeord matcher og er længere end 7 karakterer");
        }
    });
}

export function logInEmail(auth) {
    var logInEmailButton = document.getElementById("btn-sign-in-email");
    var logInEmailInput = document.getElementById("modal-log-in-email");
    var logInPasswordInput = document.getElementById("modal-log-in-password");
    logInEmailButton.addEventListener("click", e => {
        signInWithEmailAndPassword(auth, logInEmailInput.value, logInPasswordInput.value).then(userCredential => {
            window.location.href = "account.html";
        });
    });
}

export function logInGoogle(auth, googleAuthProvider) {
    var logInGoogleButton = document.getElementById("btn-sign-in-google");
    logInGoogleButton.addEventListener("click", e => {
        signInWithRedirect(auth, googleAuthProvider).then(userCredential => {
            window.location.href = "account.html";
        })
    });
}