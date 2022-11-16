import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyAztlkNsd8Lu86qj5D7Y9TbI6Wvt_hVjJw",
    authDomain: "interact2002.firebaseapp.com",
    projectId: "interact2002",
    storageBucket: "interact2002.appspot.com",
    messagingSenderId: "614264280566",
    appId: "1:614264280566:web:8644b5c9d6c9f8277c23d7",
    measurementId: "G-LBQPPM4GPT"
};
const app = initializeApp(firebaseConfig)
const storage = getStorage(app);
export default storage;