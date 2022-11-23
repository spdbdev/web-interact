import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  sendPasswordResetEmail, signOut, verifyPasswordResetCode,confirmPasswordReset } from "firebase/auth";
import { getFirestore, query, getDocs, collection, where, addDoc, setDoc, doc} from "firebase/firestore";
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

const FinalSwal = Swal.mixin({
  customClass: {
      popup: 'custom_swal_popup',
  }
});

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const getErrorMessage = (message) => {

  let errMessage;
  switch (message) {
    case "Firebase: Error (auth/invalid-email).":
      errMessage = "Invalid Email!";
      break;
    case "Firebase: Error (auth/wrong-password).":
      errMessage = "Wrong Password!";
    case "Firebase: Error (internal-error).":
      errMessage = "You don't have access to this page unless you have clicked the link from the email!";
    default:
      errMessage = message;
      break;
  }

  return errMessage;
};

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    FinalSwal.fire(getErrorMessage(err.message), "", "error");
  }
};

const loginWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    FinalSwal.fire(getErrorMessage(err.message), "", "error");
  }
};

const registerWithEmailAndPassword = async (name,legalName, email, password, imageurl,country,schedule,timeZone) => {
  try {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", name);
    // console.log("customer id", usersdoc.docs[index].id);

    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    postRequest("/user/register", formData)
      .then(async (resp) => {
        await setDoc(doc(db, "users", user.uid), {
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
    FinalSwal.fire(getErrorMessage(err.message), "", "error");
    return false;
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    FinalSwal.fire("Success!", "Password reset link sent!", "success");
  } catch (err) {
    console.error(err);
    FinalSwal.fire(getErrorMessage(err.message), "", "error");
  }
};

const logout = () => {
  signOut(auth);
};

const verifyResetCode = async (code) => {
  try{
    await verifyPasswordResetCode(auth,code);
    return true;
  }catch(err){
    FinalSwal.fire(getErrorMessage(err.message), "", "error");
    return false;
  }
}

const confirmPasswordChange = async (code,password) => {
  try{
    await confirmPasswordReset(auth,code,password);
    FinalSwal.fire("Success!", "Password has been changed!", "success");
  }catch(err){
    FinalSwal.fire(getErrorMessage(err.message), "", "error");
  }
}

export {
  auth,
  db,
  signInWithGoogle,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  verifyResetCode,
  confirmPasswordChange,
  logout,
};
