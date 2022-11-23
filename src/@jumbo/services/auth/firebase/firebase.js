import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  sendPasswordResetEmail, signOut, verifyPasswordResetCode,confirmPasswordReset } from "firebase/auth";
import { getFirestore, query, getDocs, collection, where, addDoc, setDoc, doc} from "firebase/firestore";
import { postRequest } from '../../../../utils/api';
import Swal from 'sweetalert2';
import { validateEmail } from "@jumbo/utils";
import { Navigate } from "react-router-dom";
import { getStorage } from "firebase/storage";

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
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

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
    Swal.fire("Error!", err.message, "error");
  }
};

const getUserByName = async (name) => {
    const q = query(collection(db, "users"), where("nameInLowerCase", "==", name.toLowerCase()))
    const querySnap = await getDocs(q);
    if(querySnap.docs.length > 0){
      const docSnap = querySnap.docs[0];
      if(docSnap.exists()) return docSnap.data();
    }
    return null;
};

const loginWithEmailAndPassword = async (email, password) => {
  if(!validateEmail(email)){
    const doc = await getUserByName(email);
    if(doc != null) email = doc.email;
  }
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    Swal.fire("Error!", err.message, "error");
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

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      nameInLowerCase: name.toLowerCase(),
      legalName,
      authProvider: "local",
      email,
      customerId:'',
      country,
      photoURL:imageurl,
      schedule,
      timezone:timeZone
    });
    postRequest("/user/register", formData).then(async (resp) => {
        setDoc(doc(db, "users", user.uid), {customerId: resp.data.customer.id}, {merge:true});
      })
      .catch((err) => {
        console.log(err);
      });
      return true;
  } catch (err) {
    console.error(err);
    Swal.fire("Error!", err.message, "error");
    return false;
  }
};

const sendPasswordReset = async (email) => {
  if(!validateEmail(email)){
    const doc = await getUserByName(email);
    if(doc) email = doc.email;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    return Swal.fire("Success!", "Password reset link sent!", "success").then((result)=>{
      if(result.isConfirmed) return true;
      if(result.isDismissed) return false;
    });
  } catch (err) {
    Swal.fire("Error!", err.message, "error");
    return false;
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
    Swal.fire("Error!",err.message, "error");
    return false;
  }
}

const confirmPasswordChange = async (code,password) => {
  try{
    await confirmPasswordReset(auth,code,password);
    return Swal.fire("Success!", "Password has been changed!", "success").then((result)=>{
      if(result.isConfirmed) return true;
      if(result.isDismissed) return false;
    });
  }catch(err){
    Swal.fire("Error!",err.message, "error");
    return false;
  }
}

export {
  auth,
  db,
  storage,
  signInWithGoogle,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  verifyResetCode,
  confirmPasswordChange,
  getUserByName,
  logout,
};
