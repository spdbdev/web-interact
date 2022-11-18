import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  sendPasswordResetEmail, signOut } from "firebase/auth";
import { getFirestore, query, getDocs, collection, where, addDoc} from "firebase/firestore";
import { postRequest } from '../../../../utils/api';
import Swal from 'sweetalert2';

const firebaseConfig = {
  apiKey: "AIzaSyAztlkNsd8Lu86qj5D7Y9TbI6Wvt_hVjJw",
  authDomain: "interact2002.firebaseapp.com",
  projectId: "interact2002",
  storageBucket: "interact2002.appspot.com",
  messagingSenderId: "614264280566",
  appId: "1:614264280566:web:8644b5c9d6c9f8277c23d7",
  measurementId: "G-LBQPPM4GPT",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    Swal.fire("Error!", err.message, "error");
  }
};

const loginWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    Swal.fire("Error!", err.message, "error");
  }
};

const registerWithEmailAndPassword = async (name,legalName, email, password, imageurl,country) => {
  try {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", name);
    // console.log("customer id", usersdoc.docs[index].id);

    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    postRequest("/user/register", formData)
      .then(async (resp) => {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name,
          legalName,
          authProvider: "local",
          email,
          customerId: resp.data.customer.id,
          country,
          photoURL:imageurl
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.error(err);
    Swal.fire("Error!", err.message, "error");
    return false;
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    Swal.fire("Success!", "Password reset link sent!", "success");
  } catch (err) {
    console.error(err);
    Swal.fire("Error!", err.message, "error");
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  signInWithGoogle,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
