import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
     apiKey: "AIzaSyDfx6JC9eVQks4vWoEA5It730BW2thEBps",
     authDomain: "dukaan-ddc14.firebaseapp.com",
     projectId: "dukaan-ddc14",
     storageBucket: "dukaan-ddc14.appspot.com",
     messagingSenderId: "188414300081",
     appId: "1:188414300081:web:a146be636e9b78d6677790",
     measurementId: "G-KP9P888767"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db=firebaseApp.firestore();

const authPhone = getAuth();
function verifyPhone(number){
    const recaptchaVerifier = new RecaptchaVerifier('sign-in-phone-number', {
        'size': 'invisible',
        'callback': (response) => {
          // console.log(response);
        }
    }, authPhone);
    return signInWithPhoneNumber(authPhone, number, recaptchaVerifier);
}

// AUTHENTICATION FOR LOGIN
const auth=firebase.auth();
const provider=new firebase.auth.GoogleAuthProvider();


export { auth, verifyPhone, provider };
export default db;