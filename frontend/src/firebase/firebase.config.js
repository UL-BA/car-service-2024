import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyCkjlx9T423x24mJFtBXPQHbwoqUL4Zc_0",
    authDomain: "road-ready-mern.firebaseapp.com",
    projectId: "road-ready-mern",
    storageBucket: "road-ready-mern.firebasestorage.app",
    messagingSenderId: "408898106288",
    appId: "1:408898106288:web:6604dee4a16ac321f7dc75"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);