import React from "react";
import "./UserProfilePage.css";
import CampaignSnippet from "../../Components/CampaignSnippet/CampaignSnippet";
import MeetingBlocks from "./MeetingBlocks";
import InteractButton from "@interact/Components/Button/InteractButton";
import { useNavigate } from "react-router-dom";
import CampaignsRow from "./CampaignsRow";

import { useEffect, useRef, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@jumbo/services/auth/firebase/firebase";

function FollowedCampaigns() {
  const navigate = useNavigate();
  const meetingBlockRef = useRef(null);
  //let [user, loading] = useAuthState(auth);
  let user = {
    uid: "wKKU2BUMagamPdJnhjw6iplg6w82",
    photoUrl:
      "https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg",
    name: "biby",
    email: "bibyliss@gmail.com",
    customerId: "cus_MlMuNeDDsNVt2Z",
  };

  const [currentCampaigns, setCurrentCampaigns] = useState([]);
  const [interactionCampaigns, setInteractionCampaigns] = useState([]);

  const getCampaignData = async () => {
    var currentCampaigns = [];
    var interactionCampaigns = [];

    const docSnap = await getDocs(collection(db, "campaigns"));
    if (!docSnap.empty) {
      for (let document of docSnap.docs) {
        let doc = document.data();
        currentCampaigns.push(doc);

        // check user in these collections if found then add this campaign into InteractionCampaigns
        if (
          (await cus(document.id, "top3AuctionWinners")) === true ||
          (await cus(document.id, "normalAuctionWinners")) === true ||
          (await cus(document.id, "GiveawayWinners")) === true
        ) {
          interactionCampaigns.push(doc);
        }
      }
    }
    setCurrentCampaigns(currentCampaigns);
    setInteractionCampaigns(interactionCampaigns);
  };

  // checkUserSelection
  const cus = async (campaignID, collectionName) => {
    const docSnap = await getDoc(
      doc(db, "campaigns", campaignID, collectionName, user.uid)
    );
    if (docSnap.exists()) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    meetingBlockRef.current.scrollTo(360 * 4, 0);
    getCampaignData();
  }, []);

  return (
    <div style={{ paddingLeft: 100, paddingRight: 100 }}>
      <div
        ref={meetingBlockRef}
        className="horizontalScroll"
        style={{
          display: "flex",
          overflowX: "scroll",
          padding: 20,
          marginLeft: -120,
          paddingLeft: 140,
          marginRight: -20,
        }}
      >
        <MeetingBlocks passed={true} />
        <MeetingBlocks passed={true} />
        <MeetingBlocks passed={true} />
        <MeetingBlocks passed={true} />
        <MeetingBlocks />
        <MeetingBlocks />
        <MeetingBlocks />
        <MeetingBlocks />
        <MeetingBlocks />
        <MeetingBlocks />
      </div>
      <div style={{ margin: 20 }}>
        <InteractButton
          //   onClick={() =>
          //     addCampaign(user).then((result) =>
          //       navigate(`/a/create-campaign/${result}`)
          //     )
          //   }
          onClick={() => navigate(`/a/create-campaign/`)}
          style={{ paddingLeft: 200 }}
        >
          + Create New Campaign
        </InteractButton>
      </div>
      <CampaignsRow
        currentCampaigns={currentCampaigns}
        heading="Live campaigns"
      />
      <CampaignsRow
        currentCampaigns={interactionCampaigns}
        heading="Interaction acquired"
      />
    </div>
  );
}

export default FollowedCampaigns;
