import TopBar from "@interact/Components/TopBar/TopBar";
import "./CampaignPage.css";
import CampaignInfo from "@interact/Components/CampaignInfo/CampaignInfo";
import Leaderboard from "@interact/Components/Leaderboard/Leaderboard";
import Giveaway from "./Giveaway";
import Auction from "./Auction";
import Faq from "@interact/Components/Faq/Faq";
import { DataGrid } from "@mui/x-data-grid";
import Header from "./Header";
import Stats from "./Stats";
import CreatorName from "./CreatorName";
import { useEffect, useState } from "react";
import {
  doc,
  query,
  getDocs,
  orderBy,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "@jumbo/services/auth/firebase/firebase";
import { Box, Stack } from "@mui/material";
import UserCampaignStatus from "@interact/Components/CampaignSnippet/UserCampaignStatus";
import JumboCardFeatured from "@jumbo/components/JumboCardFeatured";
import JumboContentLayout from "@jumbo/components/JumboContentLayout";
import { useJumboTheme } from "@jumbo/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "@jumbo/services/auth/firebase/firebase";


function CampaignPage(userData) {
  const num_giveaway = 10;
  const num_auction = 10;

  const [campaignData, setCampaignData] = useState({});
  const [bids, setBids] = useState([]);
  const [comments, setComments] = useState([]);
  const [supporters, setSupporters] = useState([]);
  const [hasUserEnteredGiveaway, setHasUserEnteredGiveaway] = useState(false);
  const [hasUserEnteredAuction, setHasUserEnteredAuction] = useState(false);
  const [hasUserClaimedFreeEntry, setHasUserClaimedFreeEntry] = useState(false);
  const campaignId = "test12345";
  let userId = 'user123456'; // dummy user id
  let user = {
    id: "user1234",
    photoUrl:
      "https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg",
    username: "andrew123",
  };

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

  useEffect(() => {
    getCampaignData();
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

  const bid = async (amount, clientemail, auto = false) => {
    console.log("bidding", amount);
    console.log("email : " + clientemail);
    await setDoc(doc(db, "campaigns", campaignId, "bids", userId), {
      person: user,
      price: amount,
      auto: auto,
      email:clientemail,
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
              setHasUserClaimedFreeEntry={setHasUserClaimedFreeEntry}
              setHasUserEnteredGiveaway={setHasUserEnteredGiveaway}
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
