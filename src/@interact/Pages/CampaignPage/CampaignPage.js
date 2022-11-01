import TopBar from "@interact/Components/TopBar/TopBar";
import "./CampaignPage.css";
import CampaignInfo from "@interact/Components/CampaignInfo/CampaignInfo";
import Leaderboard from "@interact/Components/Leaderboard/Leaderboard";
import Giveaway from "./Giveaway";
import Auction from "./Auction";
import Faq from "@interact/Components/Faq/Faq";
import { DataGrid } from "@mui/x-data-grid";
import {auth} from '../../../firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "./Header";
import Stats from "./Stats";
import CreatorName from "./CreatorName";
import { useEffect, useState } from "react";

import {doc, setDoc, addDoc, getDoc, getDocs, collection, query, where, orderBy, serverTimestamp} from "firebase/firestore";
import { db } from "@jumbo/services/auth/firebase/firebase";
import { Box, Stack } from "@mui/material";
import UserCampaignStatus from "@interact/Components/CampaignSnippet/UserCampaignStatus";
import JumboCardFeatured from "@jumbo/components/JumboCardFeatured";
import JumboContentLayout from "@jumbo/components/JumboContentLayout";
import { useJumboTheme } from "@jumbo/hooks";


/* {
  // const DUMMY_COMMENT_DATA = [
  //     {
  //       userId: '02b',
  //       comId: '017',
  //       fullName: 'Lily',
  //       userProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
  //       text: 'This is great',
  //       avatarUrl: 'https://ui-avatars.com/api/name=Lily&background=random',
  //       replies: []
  //     },
  // ]

  // const   DUMMY_BIDS = [
  //   {
  //     id: 'qeiqdh',
  //     person: {
  //       id: 'wihihwff',
  //       username: 'hello#122',
  //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //     },
  //     price: '8.5',
  //     time: new Date('Sept 1 13:00'),
  //   },
  //   {
  //     id: 'qeiqdh',
  //     person: {
  //       id: 'wihihwff',
  //       username: 'hello#122',
  //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //     },
  //     price: '8.5',
  //     time: new Date('Sept 1 13:00'),
  //   },
  //   {
  //     id: 'qeiqdh',
  //     person: {
  //       id: 'wihihwff',
  //       username: 'hello#122',
  //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //     },
  //     price: '8.5',
  //     time: new Date('Sept 1 13:00'),
  //   },    {
  //     id: 'qeiqdh',
  //     person: {
  //       id: 'wihihwff',
  //       username: 'hello#122',
  //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //     },
  //     price: '8.5',
  //     time: new Date('Sept 1 13:00'),
  //   },
  //   {
  //     id: 'qeiqdh',
  //     person: {
  //       id: 'wihihwff',
  //       username: 'hello#122',
  //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //     },
  //     price: '8.5',
  //     time: new Date('Sept 1 13:00'),
  //   },
  //   {
  //     id: 'qeiqdh',
  //     person: {
  //       id: 'wihihwff',
  //       username: 'hello#122',
  //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //     },
  //     price: '8.5',
  //     time: new Date('Sept 1 13:00'),
  //   },    {
  //     id: 'qeiqdh',
  //     person: {
  //       id: 'wihihwff',
  //       username: 'hello#122',
  //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //     },
  //     price: '8.5',
  //     time: new Date('Sept 1 13:00'),
  //   },
  //   {
  //     id: 'qeiqdh',
  //     person: {
  //       id: 'wihihwff',
  //       username: 'hello#122',
  //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //     },
  //     price: '8.5',
  //     time: new Date('Sept 1 13:00'),
  //   },
  //   {
  //     id: 'qeiqdh',
  //     person: {
  //       id: 'wihihwff',
  //       username: 'hello#122',
  //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //     },
  //     price: '8.5',
  //     time: new Date('Sept 1 13:00'),
  //   },    {
  //     id: 'qeiqdh',
  //     person: {
  //       id: 'wihihwff',
  //       username: 'hello#122',
  //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //     },
  //     price: '8.5',
  //     time: new Date('Sept 1 13:00'),
  //   },
  //   {
  //     id: 'qeiqdh',
  //     person: {
  //       id: 'wihihwff',
  //       username: 'hello#122',
  //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //     },
  //     price: '8.5',
  //     time: new Date('Sept 1 13:00'),
  //   },
  //   {
  //     id: 'qeiqdh',
  //     person: {
  //       id: 'wihihwff',
  //       username: 'hello#122',
  //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //     },
  //     price: '8.5',
  //     time: new Date('Sept 1 13:00'),
  //   },    {
  //     id: 'qeiqdh',
  //     person: {
  //       id: 'wihihwff',
  //       username: 'hello#122',
  //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //     },
  //     price: '8.5',
  //     time: new Date('Sept 1 13:00'),
  //   },
  //   {
  //     id: 'qeiqdh',
  //     person: {
  //       id: 'wihihwff',
  //       username: 'hello#122',
  //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //     },
  //     price: '8.5',
  //     time: new Date('Sept 1 13:00'),
  //   },
  //   {
  //     id: 'qeiqdh',
  //     person: {
  //       id: 'wihihwff',
  //       username: 'hello#122',
  //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //     },
  //     price: '8.5',
  //     time: new Date('Sept 1 13:00'),
  //   },
  // ]
  // const DUMMY_RAFFLES = [
  //   {
  //     id: 'qeiqdh',
  //     person: {
  //       id: 'wihihwff',
  //       username: 'hello#122',
  //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //     },
  //     time: new Date('Sept 1 13:00'),
  //   },
  //   {
  //     id: 'qeiqdh',
  //     person: {
  //       id: 'wihihwff',
  //       username: 'hello#122',
  //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //     },
  //     time: new Date('Sept 1 13:00'),
  //   },
  //   {
  //     id: 'qeiqdh',
  //     person: {
  //       id: 'wihihwff',
  //       username: 'hello#122',
  //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //     },
  //     time: new Date('Sept 1 13:00'),
  //   },
  // ]

  // const DUMMY_SUPPORTERS = [
  //       {
  //         id: 'wihihwff',
  //         username: 'hello#122',
  //         photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //       },
  //       {
  //         id: 'wihiffwff',
  //         username: 'hello#122',
  //         photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //       },
  //       {
  //         id: 'w3f3ihihwff',
  //         username: 'hello#122',
  //         photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //       }
  //     ]

  // const DUMMY_DATA = {
  //   CampaignId:'test12345',
  //   creator:{
  //     id: 'jsfhwfw',
  //     username: 'Pattedevelours',
  //     photoUrl: 'data:image/jpeg;base64,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'
  //   },
  //   videoUrl:'https://www.youtube.com/embed/iFg8-b7aZNk',
  //   header: {
  //     title:'Game & Chat with Pattedevelours 1-on-1',
  //     tagline1: 'Best baguette girl who plays Smite',
  //     tagline2: "Scheduling personal interactions for the next 3 months, don't miss out!"
  //   },
  //   numBidSlots: 20,
  //   numRaffleSlots: 50,
  //   CreationDate: new Date('aug 28 2022'),
  //   startDate: new Date('sept 1 2022'),
  //   endDate: new Date('sept 30 2022'),
  //   stats: {
  //     currRaised: 4372,
  //     target: 7000,
  //     targetTagline: 'I will eat 100 burgers at',
  //     numFollowers: 1038,
  //     numBidders: 15,
  //     numRafflers: 102,
  //     Category: 'Gaming'
  //   },
  //   info:{
  //     description: `Hi squad fam! I'm Pav, your favorite french Smite streamer. ...\n Hi squad fam! I'm Pav, your favorite french Smite streamer. ...\n Hi squad fam! I'm Pav, your favorite french Smite streamer. ...\n Hi squad fam! I'm Pav, your favorite french Smite streamer. ...\n Hi squad fam! I'm Pav, your favorite french Smite streamer. ...\n Hi squad fam! I'm Pav, your favorite french Smite streamer. ...\n Hi squad fam! I'm Pav, your favorite french Smite streamer. ...\n `,
  //     faq:[
  //       {
  //         q: 'How long is each interactions?',
  //         a:'30 minutes'
  //       },
  //       {
  //         q: 'What will we be doing during the interaction?',
  //         a:'Playing smite'
  //       }
  //     ],
  //     // comments:[
  //     //   {
  //     //     userId: '02b',
  //     //     comId: '017',
  //     //     fullName: 'Lily',
  //     //     userProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
  //     //     text: 'This is great',
  //     //     avatarUrl: 'https://ui-avatars.com/api/name=Lily&background=random',
  //     //     replies: []
  //     //   }
  //     // ],
  //     // supporters: [
  //     //   {
  //     //     id: 'wihihwff',
  //     //     username: 'hello#122',
  //     //     photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //     //   },
  //     //   {
  //     //     id: 'wihiffwff',
  //     //     username: 'hello#122',
  //     //     photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //     //   },
  //     //   {
  //     //     id: 'w3f3ihihwff',
  //     //     username: 'hello#122',
  //     //     photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //     //   }
  //     // ],
  //   },
  //   // bids:[
  //   //   {
  //   //     id: 'qeiqdh',
  //   //     person: {
  //   //       id: 'wihihwff',
  //   //       username: 'hello#122',
  //   //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //   //     },
  //   //     price: '8.5',
  //   //     time: new Date('Sept 1 13:00'),
  //   //   },
  //   //   {
  //   //     id: 'qeiqdh',
  //   //     person: {
  //   //       id: 'wihihwff',
  //   //       username: 'hello#122',
  //   //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //   //     },
  //   //     price: '8.5',
  //   //     time: new Date('Sept 1 13:00'),
  //   //   },
  //   //   {
  //   //     id: 'qeiqdh',
  //   //     person: {
  //   //       id: 'wihihwff',
  //   //       username: 'hello#122',
  //   //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //   //     },
  //   //     price: '8.5',
  //   //     time: new Date('Sept 1 13:00'),
  //   //   },    {
  //   //     id: 'qeiqdh',
  //   //     person: {
  //   //       id: 'wihihwff',
  //   //       username: 'hello#122',
  //   //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //   //     },
  //   //     price: '8.5',
  //   //     time: new Date('Sept 1 13:00'),
  //   //   },
  //   //   {
  //   //     id: 'qeiqdh',
  //   //     person: {
  //   //       id: 'wihihwff',
  //   //       username: 'hello#122',
  //   //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //   //     },
  //   //     price: '8.5',
  //   //     time: new Date('Sept 1 13:00'),
  //   //   },
  //   //   {
  //   //     id: 'qeiqdh',
  //   //     person: {
  //   //       id: 'wihihwff',
  //   //       username: 'hello#122',
  //   //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //   //     },
  //   //     price: '8.5',
  //   //     time: new Date('Sept 1 13:00'),
  //   //   },    {
  //   //     id: 'qeiqdh',
  //   //     person: {
  //   //       id: 'wihihwff',
  //   //       username: 'hello#122',
  //   //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //   //     },
  //   //     price: '8.5',
  //   //     time: new Date('Sept 1 13:00'),
  //   //   },
  //   //   {
  //   //     id: 'qeiqdh',
  //   //     person: {
  //   //       id: 'wihihwff',
  //   //       username: 'hello#122',
  //   //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //   //     },
  //   //     price: '8.5',
  //   //     time: new Date('Sept 1 13:00'),
  //   //   },
  //   //   {
  //   //     id: 'qeiqdh',
  //   //     person: {
  //   //       id: 'wihihwff',
  //   //       username: 'hello#122',
  //   //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //   //     },
  //   //     price: '8.5',
  //   //     time: new Date('Sept 1 13:00'),
  //   //   },    {
  //   //     id: 'qeiqdh',
  //   //     person: {
  //   //       id: 'wihihwff',
  //   //       username: 'hello#122',
  //   //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //   //     },
  //   //     price: '8.5',
  //   //     time: new Date('Sept 1 13:00'),
  //   //   },
  //   //   {
  //   //     id: 'qeiqdh',
  //   //     person: {
  //   //       id: 'wihihwff',
  //   //       username: 'hello#122',
  //   //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //   //     },
  //   //     price: '8.5',
  //   //     time: new Date('Sept 1 13:00'),
  //   //   },
  //   //   {
  //   //     id: 'qeiqdh',
  //   //     person: {
  //   //       id: 'wihihwff',
  //   //       username: 'hello#122',
  //   //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //   //     },
  //   //     price: '8.5',
  //   //     time: new Date('Sept 1 13:00'),
  //   //   },    {
  //   //     id: 'qeiqdh',
  //   //     person: {
  //   //       id: 'wihihwff',
  //   //       username: 'hello#122',
  //   //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //   //     },
  //   //     price: '8.5',
  //   //     time: new Date('Sept 1 13:00'),
  //   //   },
  //   //   {
  //   //     id: 'qeiqdh',
  //   //     person: {
  //   //       id: 'wihihwff',
  //   //       username: 'hello#122',
  //   //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //   //     },
  //   //     price: '8.5',
  //   //     time: new Date('Sept 1 13:00'),
  //   //   },
  //   //   {
  //   //     id: 'qeiqdh',
  //   //     person: {
  //   //       id: 'wihihwff',
  //   //       username: 'hello#122',
  //   //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //   //     },
  //   //     price: '8.5',
  //   //     time: new Date('Sept 1 13:00'),
  //   //   },
  //   // ],
  //   // raffles:[
  //   //   {
  //   //     id: 'qeiqdh',
  //   //     person: {
  //   //       id: 'wihihwff',
  //   //       username: 'hello#122',
  //   //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //   //     },
  //   //     time: new Date('Sept 1 13:00'),
  //   //   },
  //   //   {
  //   //     id: 'qeiqdh',
  //   //     person: {
  //   //       id: 'wihihwff',
  //   //       username: 'hello#122',
  //   //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //   //     },
  //   //     time: new Date('Sept 1 13:00'),
  //   //   },
  //   //   {
  //   //     id: 'qeiqdh',
  //   //     person: {
  //   //       id: 'wihihwff',
  //   //       username: 'hello#122',
  //   //       photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg'
  //   //     },
  //   //     time: new Date('Sept 1 13:00'),
  //   //   },
  //   // ],
  //   rafflePrice:1.5,
  // }

} */

function CampaignPage(userData) {
  const num_giveaway = 10;
  const num_auction = 10;

  const [vipChanceMultiplier,setVipChanceMultiplier] = useState(25);
  const [freeChanceMultiplier, setFreeChanceMultiplier] = useState(1);

  const [campaignData, setCampaignData] = useState({});
  const [bids, setBids] = useState([]);
  const [comments, setComments] = useState([]);
  const [supporters, setSupporters] = useState([]);
  const [totalEntry,setTotalEntry] = useState(0);
  const [winningChances,setWiningChances] = useState(100);
  const [hasUserEnteredGiveaway, setHasUserEnteredGiveaway] = useState(false);
  const [hasUserEnteredAuction, setHasUserEnteredAuction] = useState(false);
  const [hasUserClaimedFreeEntry, setHasUserClaimedFreeEntry] = useState(false);
  const campaignId = "test12345";
  let userId = 'user123456'; // dummy user id
  // let user = {
  //   id: "user1234",
  //   photoUrl:
  //     "https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg",
  //   username: "andrew123",
  // };
  let [user] = useAuthState(auth);
  console.log("User>>",user);


  const { theme } = useJumboTheme();

  const getFirebaseArray = async (col) => {
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
  const getCampaignData = async () => {
    let _campaignData = (await getDoc(doc(db, "campaigns", campaignId))).data();
    // console.log('_campaignData', _campaignData)
    setCampaignData(_campaignData);
    console.log("Campaign Data>>",campaignData);
    if(Object.entries(_campaignData).length > 0) getChanceMultiplier()

    // let bidQuery = query(collection(db, 'campaigns', campaignId, 'bids'), orderBy("time"))
    // console.log('bidQuery', bidQuery)
    setBids(
      await getFirebaseArray(collection(db, "campaigns", campaignId, "bids"))
    );

    // setComments(
    //   await getFirebaseArray(
    //     collection(db, "campaigns", campaignId, "comments")
    //   )
    // );
    // setSupporters(
    //   await getFirebaseArray(
    //     collection(db, "campaigns", campaignId, "supporters")
    //   )
    // );
  };

  const getChanceMultiplier = async () => {
    let lostHistory = await getUserLostHistory(campaignData.person.id);
    lostHistory = parseInt(lostHistory);

    let freeMultiplier = 1;
    let vipMultiplier = 25;

    if(lostHistory === 1){
      freeMultiplier = 2;
      vipMultiplier = 50;
    }
    else if(lostHistory > 1){
      freeMultiplier = 4;
      vipMultiplier = 100;
    }
    setVipChanceMultiplier(vipMultiplier);
    setFreeChanceMultiplier(freeMultiplier);

    console.log("Lost history",lostHistory,'vip chance',vipChanceMultiplier,'free chance',freeChanceMultiplier);
  }

  const getUserLostHistory = async (creater_id) => {
    const campaignHistoryUsers = await getDoc(doc(db, 'giveAwayLossHistory', creater_id, 'users', user.uid ));
    const {numOfLoss} = campaignHistoryUsers.data();
    if(numOfLoss) return numOfLoss;
    return 0;
  }

  const getTotalEntry = async () => {
    let chances = 100;
    const docSnap = await getDocs(collection(db, "campaigns", campaignId, 'Giveaway'));
    console.log("doc snap", docSnap)
    if (!docSnap.empty) {
        const size = docSnap.size;
        setTotalEntry(parseInt(size));        
    } else {
        console.log("No such document!");
    }
    if(totalEntry !== 0) chances = (1/totalEntry)*100;
    setWiningChances(chances);
  }

  useEffect(() => {
    getCampaignData();
    getTotalEntry();
    // DUMMY_RAFFLES.forEach((x, i)=>{
    //   let raffle = {...DUMMY_RAFFLES[i]};
    //   raffle.time = serverTimestamp();
    //   // console.log(raffle)
    //   addDoc(collection(db, "campaigns", "test12345", 'raffles'), raffle);

    // })
    // setDoc(doc(db, "campaigns", "test12345", 'raffles', 'dummySupporterId3'), DUMMY_SUPPORTERS[1]);
    // // console.log('doc shouldve been setted')

    // setCampaignData(DUMMY_DATA);

    // setBids(DUMMY_BIDS);

    // setComments(DUMMY_COMMENT_DATA)
    // setSupporters(DUMMY_SUPPORTERS)
  }, []);

  const bid = async (amount, auto = false) => {
    console.log("bidding", amount);
    console.log("User", user);
    const usersRef = collection(db,'users');
    const q = query(usersRef,where('uid','==',user.uid));
    var userSnap = await getDocs(q);
    userData = userSnap.docs[0];
    await setDoc(doc(db, "campaigns", campaignId, "bids", userData.id), {
      person: {
        username:  userData.data().name,
        id: userData.id,
        photoUrl: user.photoURL
      },
      price: amount,
      auto: auto,
      email:user.email,
      time: serverTimestamp(),
    });
    getCampaignData();
  };

  function renderUserCampaignStatus() {
    if (hasUserEnteredAuction || hasUserEnteredGiveaway) {
      return (
        <Stack
          alignItems="center"
          sx={{
            position: "fixed",
            bottom: 10,
            left: 0,
            zIndex: 4000,
            width: "100%",
          }}
        >
          <Box
            sx={{
              backgroundColor: "primary.translucent",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 30px",
              p: 1,
              borderRadius: 2,
            }}
          >
            <UserCampaignStatus
              userAuctionPosition={8}
              userGiveawayWinChance={20}
              auctionLeaderboardSpots={31}
              showUserAvatar
            />
          </Box>
        </Stack>
      );
    } else {
      return null;
    }
  }
  // console.log('bids 1', bids)
  return (
    <JumboContentLayout
      layoutOptions={{
        wrapper: {
          sx: {
            [theme.breakpoints.up("xl")]: {
              px: 2,
            },
            [theme.breakpoints.up("xxl")]: {
              px: 30,
            },
          },
        },
      }}
    >
      <Box className="CampaignPage">
        {renderUserCampaignStatus()}
        <Header campaignData={campaignData} />
        <p>{localStorage.getItem('data')}</p>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            py: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flex: 1,
              mr: 1,
              borderRadius: 3,
              overflow: "hidden",
              paddingBottom: "41.25%",
              position: "relative",
            }}
          >
            <iframe
              style={{ flex: 1, position: "absolute" }}
              src={campaignData?.videoUrl}
              title="YouTube video player"
              width="100%"
              height="100%"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </Box>

          {num_giveaway > 0 ? (
             <Giveaway
             campaignData={campaignData}
             hasUserClaimedFreeEntry={hasUserClaimedFreeEntry}
             hasUserPurchasedVIPEntry={hasUserEnteredGiveaway}
             setHasUserClaimedFreeEntry={setHasUserClaimedFreeEntry}
             setHasUserEnteredGiveaway={setHasUserEnteredGiveaway}
             setHasUserPurchasedVIPEntry={setHasUserEnteredGiveaway}
             vipChanceMultiplier={vipChanceMultiplier}
             freeChanceMultiplier = {freeChanceMultiplier}
             winningChances={winningChances}
           />
          ) : null}
        </Box>

        <Stats campaignData={campaignData} />

        {num_auction > 0 ? (
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              padding: "20px 0",
            }}
          >
            <Leaderboard campaignData={campaignData} bids={bids} />
            <Auction
              bidAction={bid}
              campaignData={campaignData}
              bids={bids}
              hasUserEnteredAuction={hasUserEnteredAuction}
              setHasUserEnteredAuction={setHasUserEnteredAuction}
            />
          </Box>
        ) : null}

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Box sx={{ flex: 1, mr: 3 }}>
            <CreatorName campaignData={campaignData} />
            <CampaignInfo
              campaignData={campaignData}
              comments={comments}
              campaignId={campaignId}
              supporters={supporters}
            />
          </Box>
          <Box sx={{ flex: 1, mt: 3 }}>
            <Faq campaignData={campaignData} />
          </Box>
        </Box>

        {/* <center style={{color:'gray'}}>Affiliate Program: Refer an influencer {'&'} earn up to $10,000! 5% of their first year of profits will be given to the referrer.</center> */}
        {/* <center> <br/> some footer stuff <br /> </center> */}
      </Box>
    </JumboContentLayout>
  );
}

export default CampaignPage;
