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
  setDoc,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  limit,
  deleteDoc
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { DUMMY_CAMPAIGN } from "./config";

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
const Storage = getStorage(app);

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

export async function fetchUserByName(name) {
  const q = query(collection(db, "users"), where("name", "==", name))
  const querySnapshot = await getDocs(q);
  const docSnapshots = querySnapshot.docs[0];
  const id = docSnapshots.id;
  const data = docSnapshots.data()
  return { ...data, id }
}

export async function fetchUsersByIds(idlist = []) {
  let returnData = [];
  if(idlist === []){
    return returnData;
  }
  const q = query(collection(db, "users"), where("__name__", "in", idlist))
  const querySnapshot = await getDocs(q);
  for(let i = 0; i < querySnapshot.docs.length; i++) {
    const docSnapshots = querySnapshot.docs[i];
    const data = docSnapshots.data();
    const id = docSnapshots.id;
    returnData.push({...data, id});
  }
  return returnData;
}


export const addCampaign = async (user) => {
  console.log(user)
  let campaignCounter = (user && user.campaigns && user.campaigns.length + 1) ?? 1
  let newCampaignId = `${user.name}_${campaignCounter}`;

  let updatedUserData =
    user.campaigns
      ?
      { campaigns: [...user.campaigns, { campaignId: newCampaignId, campaignStatus: "draft" }] }
      :
      { campaigns: [{ campaignId: newCampaignId, campaignStatus: "draft" }] }
  await setDoc(doc(db, "campaigns", newCampaignId), DUMMY_CAMPAIGN);
  await updateDoc(doc(db, "users", user.id), updatedUserData);
  return newCampaignId;
}
/*
function to follow/unfollowUser
user=>Signed User that is going to follow
targetUser=>User that signed user is going to follow
isfollow=>isfollow ? follow : unfollow
*/
export const followUser = async (user, targetUser, isfollow = true) => {
  console.log("isfollow", isfollow);
  if(targetUser === {}) {
    console.log("targetUser is wrong");
    return;
  }else if(user?.id === targetUser?.id) {
    console.log("You can not follow yourself");
    return;
  }
  let following = user && user?.following ? user?.following : [];
  let followers = targetUser && targetUser?.followers ? targetUser?.followers : [];
  if(isfollow) {
    if(following?.includes(targetUser?.id)) {
      console.log("You already followed this user");
      return;
    }
    following.push(targetUser.id);
    followers.push(user.id);
  }else {
    following = following.filter(e => e !== targetUser.id);
    followers = followers.filter(e => e !== user.id);
  }
  let updatedFollowingData = {
    following:following
  }
  
  let updatedFollowersData = {
    followers:followers
  }
  console.log("updatedFollowingData",updatedFollowingData);
  console.log("updatedFollowersData",updatedFollowersData);
  
  await updateDoc(doc(db, "users", user.id), updatedFollowingData);
  await updateDoc(doc(db, "users", targetUser.id), updatedFollowersData);
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

export function createCampaignURL(campaign) {
  return `${campaign.campaignStatus === "draft" ? "/d" : "/c"}/${campaign.campaignId}`
}

export async function publishCampaign(campaignId, userId) {
  let docRef = doc(db, "campaigns", campaignId); //this needs to be passed in programatically
  let userDocRef = doc(db, "users", userId); //this needs to be passed in programatically
  let userData = (
    await getDoc(userDocRef)
  ).data();
  let selectedCampaign = userData.campaigns.find((c) => c.campaignId === campaignId);
  selectedCampaign.campaignStatus = "scheduled";
  await updateDoc(docRef, { campaignStatus: "scheduled" });
  await updateDoc(userDocRef, { campaigns: userData.campaigns });
}

export const checkCustomURLAgainstOtherCampaigns = async (url) => {
  const campaign = await fetchCampaign(url);
  return campaign;
}

export const getFirebaseArray = async (col) => {
  let arr = [];
  let arrFirebaseObject = await getDocs(col);
  arrFirebaseObject.forEach((x, i) => {
    arr.push({ ...x.data() }); // order by price to be implemented
  });
  return arr;
};

/*
Function to store campaignid to users data for Recent Campaign Feature.
*/
export const saveToRecentCampaignHistory = async (campaignId, user) => {  
  if(campaignId && user) {
    let currentRecentCampaignData = user?.recentCampaignData ? user?.recentCampaignData : [];
    if(currentRecentCampaignData?.includes(campaignId)) {
      return;
    }
    const index = currentRecentCampaignData.indexOf(campaignId);
    if (index > -1) {
      //If CampaignId Exist in Array, Remove and Add to first.
      currentRecentCampaignData.splice(index, 1);
    }
    
    let recentCampaignData = [campaignId];
    recentCampaignData = [...recentCampaignData, ...currentRecentCampaignData];
    let updatedRecentCampaignData = {
      recentCampaignData : recentCampaignData
    }
    await updateDoc(doc(db, "users", user.id), updatedRecentCampaignData);
  } 
}

/*
Function to return Recent CampaignList
Returns recent 17 campaignlist.
*/
export const fetchRecentCampaigns = async (idlist) => {
  let returnData = [];
  if(idlist === []){
    return returnData;
  }
  const q = query(collection(db, "campaigns"), where("__name__", "in", idlist), limit(17))
  const querySnapshot = await getDocs(q);
  for(let i = 0; i < querySnapshot.docs.length; i++) {
    const docSnapshots = querySnapshot.docs[i];
    const data = docSnapshots.data();
    const id = docSnapshots.id;
    returnData.push({...data, id});
  }
  return returnData;
}

/*
Function to add Comments of Campaign
*/
export const addCommentsToDB = async (comment, campaignId) => {
  await addDoc(collection(db, "campaigns", campaignId, "comments"), comment);
}

/*
Function to add Reply of Comment
Reply is array in Comment Object
*/
export const addRepliesToDB = async (replies, campaignId,commentId ) => {
  await updateDoc(doc(db, "campaigns", campaignId, "comments", commentId), {replies:replies});
}

/*
Function to edit comment
type = comment, reply
*/
export const editCommentDB = async (content, id, type, parentComment, campaignId) => {
  if(type === "comment") {  
    await updateDoc(doc(db, "campaigns", campaignId, "comments", id), {content:content});
  }else if(type === "reply"){
    const docSnap = await getDoc(doc(db, "campaigns", campaignId, "comments", parentComment));
    if (docSnap.exists()) {
      let comment = docSnap.data();
      comment.replies.forEach((data) => {
        if (data.id === id) {
          data.content = content;
        }
      });
      await updateDoc(doc(db, "campaigns", campaignId, "comments", parentComment), {replies:comment.replies});
    } else {
      console.log("fail");
    }
  }
}
/*
Function to delete Comment
type = comment, reply
*/
export const commentDeleteDB = async (id, type, campaignId, parentComment) => {
  if (type === "comment") {
    await deleteDoc(doc(db, "campaigns", campaignId, "comments", id));
  } else if (type === "reply") {
    const docSnap = await getDoc(doc(db, "campaigns", campaignId, "comments", parentComment));
    if (docSnap.exists()) {
      let comment = docSnap.data();
      let updatedReplies = comment.replies.filter((data) => data.id !== id);
      await updateDoc(doc(db, "campaigns", campaignId, "comments", parentComment), {replies:updatedReplies});
    } else {
      console.log("fail");
    }
  }
}

/*
Function to validate Campaign Id
Returns true is campaignid is valid
*/
export const isCampaignId = async (campaignId) => {
  try {
    const docSnap = await getDoc(doc(db, "campaigns", campaignId));
    if (docSnap.exists()) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

export {
  auth,
  db,
  functions,
  Storage,
  signInWithGoogle,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
