// to do remove this file as its stored in @jumbo/services/auth/firebase

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  doc,
  getDoc
} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAztlkNsd8Lu86qj5D7Y9TbI6Wvt_hVjJw",
  authDomain: "interact2002.firebaseapp.com",
  projectId: "interact2002",
  storageBucket: "interact2002.appspot.com",
  messagingSenderId: "614264280566",
  appId: "1:614264280566:web:8644b5c9d6c9f8277c23d7",
  measurementId: "G-LBQPPM4GPT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// enable when testing local functions:
// connectFunctionsEmulator(functions, "localhost", 5001);

const googleProvider = new GoogleAuthProvider();

// custom functions
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
    alert(err.message);
  }
};

const loginWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

export async function fetchUserByUsername(username) {
  const q = query(collection(db, "users"), where("username", "==", username));
  const querySnapshot = await getDocs(q);
  const docSnapshots = querySnapshot.docs[0];
  const data = docSnapshots.data()
  return data
}

export async function fetchUser(id) {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data()
    return data
  } else {
    // doc.data() will be undefined in this case
    return
  }
}

export async function fetchUserByUid(uid) {
  const q = query(collection(db, "users"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  const docSnapshots = querySnapshot.docs[0];
  const id = docSnapshots.id;
  const data = docSnapshots.data()
  return { ...data, id }
}

export async function fetchCampaign(campaignId) {
  // Check for the customURL first
  const customURLQ = query(collection(db, "campaigns"), where("customURL", "==", campaignId));
  const customURLQuerySnapshot = await getDocs(customURLQ);
  var docSnapshots = customURLQuerySnapshot.docs[0];
  var data;
  if (docSnapshots) {
    data = docSnapshots.data()
  } else if (!docSnapshots) {
    // If there is no customURL, check for the id
    data = (await getDoc(doc(db, "campaigns", campaignId))).data();
  }
  return data
}

export const getFirebaseArray = async (col) => {
  let arr = [];
  let arrFirebaseObject = await getDocs(col);
  arrFirebaseObject.forEach((x, i) => {
    // console.log(i);
    arr.push({ ...x.data() }); // order by price to be implemented
  });
  //order by price backend later
  // _bids.sort((a, b)=> a.price > b.price)
  return arr;
};


// export const createUserProfileDocument = async (userAuth, additionalData) => {
//   if (!userAuth) return;

//   const userRef = firestore.doc(`users/${userAuth.uid}`);

//   const snapShot = await userRef.get();

//   if (!snapShot.exists) {
//     const { displayName, email } = userAuth;
//     const createdAt = new Date();

//     try {
//       await userRef.set({
//         displayName,
//         email,
//         createdAt,
//         ...additionalData
//       })
//     } catch (error) {
//       console.log('error creating user', error.message);
//     }
//   }

//   return userRef;

// }

export {
  auth,
  db,
  functions,
  signInWithGoogle,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
