import TopBar from "@interact/Components/TopBar/TopBar";
import "./CampaignPage.css";
import CampaignInfo from "@interact/Components/CampaignInfo/CampaignInfo";
import Leaderboard from "@interact/Components/Leaderboard/Leaderboard";
import Giveaway from "./Giveaway";
import Auction from "./Auction";
import Faq from "@interact/Components/Faq/Faq";
import { DataGrid } from "@mui/x-data-grid";


import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "./Header";
import Stats from "./Stats";
import { useEffect, useState } from "react";

import { doc, setDoc, addDoc, getDoc, getDocs, collection, query, where, orderBy, serverTimestamp, onSnapshot, getCountFromServer} from "firebase/firestore";
import { Box, Stack } from "@mui/material";
import UserCampaignStatus from "@interact/Components/CampaignSnippet/UserCampaignStatus";
import JumboCardFeatured from "@jumbo/components/JumboCardFeatured";
import JumboContentLayout from "@jumbo/components/JumboContentLayout";
import { auth, logout, db } from "@jumbo/services/auth/firebase/firebase";
import { useJumboLayoutSidebar, useJumboTheme } from "@jumbo/hooks";
import { sortBids } from "@interact/Components/utils";


function CampaignPage(userData) {
  const [vipChanceMultiplier, setVipChanceMultiplier] = useState(25);
  const [freeChanceMultiplier, setFreeChanceMultiplier] = useState(1);
  const [campaignData, setCampaignData] = useState({});
  const [bids, setBids] = useState([]);
  const [giveaways, setGiveaways] = useState([]);
  const [comments, setComments] = useState([]);
  const [supporters, setSupporters] = useState([]);
  const [winningChances, setWiningChances] = useState({ vip: 100, free: 100 });
  const [hasUserPurchasedVIPEntry, setHasUserPurchasedVIPEntry] = useState(false);
  const [hasUserEnteredAuction, setHasUserEnteredAuction] = useState(false);
  const [hasUserClaimedFreeEntry, setHasUserClaimedFreeEntry] = useState(false);
  const [userAuctionPosition, setUserAuctionPosition] = useState(0);
  const [isCampaignEnded, setIsCampaignEnded] = useState(false);

  const num_giveaway = 10;
  const num_auction = 10;
  const { theme } = useJumboTheme();
  const campaignId = "test12345";
  const navigate = useNavigate();
  let [user, loading] = useAuthState(auth);
  // let user = {
  //   uid: "wKKU2BUMagamPdJnhjw6iplg6w82",
  //   photoUrl:
  //     "https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg",
  //   name: "biby",
  //   email: "bibyliss@gmail.com",
  //   customerId: "cus_MlMuNeDDsNVt2Z",
  // };

  const { sidebarOptions, setSidebarOptions } = useJumboLayoutSidebar();

  useEffect(() => {
    // Fixes a bug where sidebar is hidden but remains "open" when
    // navigating to this screen
    if (sidebarOptions.open === true) {
      setSidebarOptions({ open: false });
    }
  }, [sidebarOptions]);

  const checkAuthentication = () => {
		if(!user) {
			navigate(`/a/signup?redirect=/c/${campaignId}`);
			return false;
		};
		return true;
	}

  const getCampaignData = async () => {
    //campaigns change listener
    const campaignsListener = onSnapshot(
      query(doc(db, "campaigns", campaignId)),
      (querySnapshot) => {
        let _campaignData = querySnapshot.data();
        setCampaignData(_campaignData);

        // console.log("Campaign Data >>>>>>>>>>>", _campaignData);

        //Check Campaign End Time
        let campaignEndDate = new Date(_campaignData.endDate.seconds * 1000);
        let now = new Date();
        if (campaignEndDate - now < 0) setIsCampaignEnded(true);

        if (Object.entries(_campaignData).length > 0)
          getChanceMultiplier(_campaignData);
      }
    );

    //Bids change listener
    const bidsListener = onSnapshot(
      query(collection(db, "campaigns", campaignId, "bids")),
      (querySnapshot) => {
        let bidsList = [];
        querySnapshot.forEach((doc) => {
          bidsList.push(doc.data());
        });
        bidsList = sortBids(bidsList);
        setBids(bidsList);

        let position = bidsList.findIndex(
          (element) => element.email === user.email
        );
        setUserAuctionPosition(++position);
        setHasUserEnteredAuction(true);
      }
    );

    const commentsListener = onSnapshot(
      query(collection(db, "campaigns", campaignId, "comments")),
      (querySnapshot) => {
        let commentsList = [];
        querySnapshot.forEach((doc) => {
          commentsList.push(doc.data());
        });
        setComments(commentsList);
      }
    );

    const giveawayListener = onSnapshot(
      query(collection(db, "campaigns", campaignId, "Giveaway")),
      (querySnapshot) => {
        let giveawayList = [];
        querySnapshot.forEach((doc) => {
          giveawayList.push(doc.data());
        });
        setGiveaways(giveawayList);
      }
    );

    // Using giveaways and bids instead of supporters.
    // const supportersListener = onSnapshot(query(collection(db, 'campaigns', campaignId, "supporters")),(querySnapshot)=>{
    // 	let supportersList = [];
    // 	querySnapshot.forEach((doc) => {
    // 		supportersList.push(doc.data());
    // 	});
    // 	setSupporters(supportersList[0].supporters);
    // })

    /* 
		// replace these with listeners
		setComments(
		  await getFirebaseArray(
		    collection(db, "campaigns", campaignId, "comments")
		  )
		);
		setSupporters(
		  await getFirebaseArray(
		    collection(db, "campaigns", campaignId, "supporters")
		  )
		); */
  };

  const getUserLostHistory = async (creator_id, user_id) => {
    const campaignHistoryUsers = await getDoc(
      doc(
        db,
        "contributionAndGiveawayLossHistory",
        creator_id,
        "users",
        user_id
      )
    );
    if (doc.exists) {
      const { numOfLoss } = campaignHistoryUsers.data();
      return parseInt(numOfLoss);
    }
    return 0;
  };

  const getChanceMultiplier = async (_campaignData) => {
    let lostHistory = await getUserLostHistory(
      _campaignData.person.id,
      user.uid
    );
    lostHistory = parseInt(lostHistory);

    let freeMultiplier = 1;
    let vipMultiplier = 25;

    if (lostHistory === 1) {
      freeMultiplier = 2;
      vipMultiplier = 50;
    } else if (lostHistory > 1) {
      freeMultiplier = 4;
      vipMultiplier = 100;
    }
    setVipChanceMultiplier(vipMultiplier);
    setFreeChanceMultiplier(freeMultiplier);

    //console.log("Lost history",lostHistory, 'vip chance',vipChanceMultiplier, 'free chance',freeChanceMultiplier);
    getChanceOfwinning(_campaignData, vipMultiplier, freeMultiplier);
  };

  const getChanceOfwinning = async (
    _campaignData,
    vipMultiplier,
    freeMultiplier
  ) => {
    const docSnap = await getDocs(
      collection(db, "campaigns", campaignId, "Giveaway")
    );
    //console.log("doc snap", docSnap);

    if (!docSnap.empty) {
      let TotalPoolEntries = 0;
      for (let document of docSnap.docs) {
        let doc = document.data();
        doc.price = Number(doc.price);

        let noOfEntries = 1;
        if (doc.price > 0) noOfEntries = 25;

        let previousLoss = await getUserLostHistory(
          _campaignData.person.id,
          document.id
        );
        if (previousLoss === 1) noOfEntries = noOfEntries * 2;
        else if (previousLoss > 1) noOfEntries = noOfEntries * 4;

        TotalPoolEntries = TotalPoolEntries + noOfEntries;
      }

      if (TotalPoolEntries !== 0) {
        let vipChances = Math.round((vipMultiplier / TotalPoolEntries) * 100);
        let freeChances = Math.round((freeMultiplier / TotalPoolEntries) * 100);

        setWiningChances({ vip: vipChances, free: freeChances });
      }
    } else {
      console.log("No such collection!");
    }
  };

  const checkPurchasedEntry = async () => {
    const docRef = doc(db, "campaigns", campaignId, "Giveaway", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.entryType === "free") {
        setHasUserClaimedFreeEntry(true);
      } else if (data.entryType === "vip") {
        setHasUserClaimedFreeEntry(true);
        setHasUserPurchasedVIPEntry(true);
      }
      console.log("User Giveaway", data);
    } else {
      console.log("No such document!");
    }
  };

  const bid = async (
    amount,
    auto = false,
    desiredRanking = null,
    maxBidPrice = null,
    minBidPrice = null
  ) => {
    if(!checkAuthentication()) return;
    var userSnap = await getDocs(
      query(collection(db, "users"), where("uid", "==", user.uid))
    );
    let user_data = userSnap.docs[0];

    await setDoc(doc(db, "campaigns", campaignId, "bids", user.uid), {
      person: {
        username: user_data.data().name,
        id: user_data.id,
        photoUrl: user.photoURL,
      },
      desiredRanking,
      minBidPrice,
      maxBidPrice,
      price: amount,
      auto: auto,
      email: user.email,
      time: serverTimestamp(),
    });

    const snapshot = await getCountFromServer(
      collection(db, "campaigns", campaignId, "bids")
    );
    const counter = snapshot.data().count;
    console.log("bids count: ", counter);

    setDoc(
      doc(db, "campaigns", campaignId),
      { numAuctionBids: counter },
      { merge: true }
    );
  };

  useEffect(() => {
    //if (loading) return;
    //if (!user) return navigate("/");

    console.log("User>>", user);
    getCampaignData();
    checkPurchasedEntry();
  }, []);

  /* useEffect(() => {
		// Check if there is a campaignId in params
		if (params.campaignId) {
		  // Then, check if the campaign is a draft, 
		  if (user && user.campaigns && user.campaigns[0] && user.campaigns[0].campaignStatus === "draft") {
			// then redirect the user to /d/
			navigate(createCampaignURL(user.campaigns[0]))
		  } else {
			// otherwise, proceed with getting campaign data
			getCampaignData(params.campaignId);
		  }
		} else {
		  // otherwise, check if user is authenticated
		  if (user) {
			// then redirect either to appropriate campaign, or to create campaign page
			navigate(user.campaigns && user.campaigns[0] ? createCampaignURL(user.campaigns[0]) : "/a/create-campaign")
		  }
		}
		console.log(params, !params.campaignId, user)
	}, [user, params]); */

  function renderUserCampaignStatus() {
    if (
      hasUserEnteredAuction ||
      hasUserPurchasedVIPEntry ||
      hasUserClaimedFreeEntry
    ) {
      let statusType = "bid";
      let chances = 0;
      if (hasUserPurchasedVIPEntry) {
        chances = winningChances.vip;
        statusType = "giveaway";
      } else if (hasUserClaimedFreeEntry) {
        chances = winningChances.free;
        statusType = "giveaway";
      }
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
              statusType={statusType}
              userAuctionPosition={userAuctionPosition}
              userGiveawayWinChance={chances}
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

  return (
    <JumboContentLayout
      layoutOptions={{
        wrapper: {
          sx: {
            [theme.breakpoints.up("lg")]: {
              px: 10,
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
        <p>{localStorage.getItem("data")}</p>
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={4}
          sx={{
            position: "relative",
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
              paddingBottom: "38.25%",
              position: "relative",
            }}
          >
            <iframe
              style={{ flex: 1, position: "absolute" }}
              src={campaignData?.videoUrl}
              title="YouTube video player"
              width="100%"
              height="100%"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>

          {num_giveaway > 0 ? (
            <Giveaway
              isCampaignEnded={isCampaignEnded}
              campaignData={campaignData}
              hasUserClaimedFreeEntry={hasUserClaimedFreeEntry}
              hasUserPurchasedVIPEntry={hasUserPurchasedVIPEntry}
              setHasUserClaimedFreeEntry={setHasUserClaimedFreeEntry}
              setHasUserPurchasedVIPEntry={setHasUserPurchasedVIPEntry}
              vipChanceMultiplier={vipChanceMultiplier}
              freeChanceMultiplier={freeChanceMultiplier}
              winningChances={winningChances}
            />
          ) : null}
        </Stack>

        <Stats campaignData={campaignData} bids={bids} />

        {num_auction > 0 ? (
          <Stack
            direction="row"
            spacing={4}
            style={{
              padding: "20px 0",
            }}
          >
            <Leaderboard campaignData={campaignData} bids={bids} />
            <Auction
              isCampaignEnded={isCampaignEnded}
              bidAction={bid}
              campaignData={campaignData}
              bids={bids}
              hasUserEnteredAuction={hasUserEnteredAuction}
              setHasUserEnteredAuction={setHasUserEnteredAuction}
            />
          </Stack>
        ) : null}

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Box sx={{ flex: 1, mr: 3 }}>
            {/* <CreatorName campaignData={campaignData} /> */}
            <CampaignInfo
              isCampaignEnded={isCampaignEnded}
              campaignData={campaignData}
              giveaways={giveaways}
              bids={bids}
              comments={comments}
              campaignId={campaignId}
              // supporters={supporters}
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
