import "./UserProfilePage.css";
import CampaignSnippet from "../../Components/CampaignSnippet/CampaignSnippet";
import MeetingBlocks from "./MeetingBlocks";
import { useEffect, useRef,useState } from "react";
import InteractButton from "@interact/Components/Button/InteractButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate,useParams } from "react-router-dom";
import CampaignCategorySelect from "../CreateCampaignPage/CampaignCategorySelect";
import { auth, db, logout } from "@jumbo/services/auth/firebase/firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { getDateFromTimestamp } from "@interact/Components/utils";

function FollowedCampaigns() {
  const [user, loading, error] = useAuthState(auth);
  
  let { id } = useParams();
  let user_id = id;
  let currentCampaigns = [];
 let campaignSnippets = []
  const navigate = useNavigate();
  const [campaignsList,setCampaignsList] = useState([]);
  const getCampaigns = async ()=>{
    console.log('getCampaigns.user_id');
      console.log(user_id);
      let q = query(collection(db, "campaigns"), where("person.id", "==", user?.uid));
      if(user_id){
         q = query(collection(  db, "campaigns"), where("person.id", "==", user_id));  
      }
    
    const doc =await getDocs(q);
    console.log('compaign:');
      console.log(doc);
      
    for (let i = 0; i < doc.docs.length; i++) {
      console.log('compaigns:'+i);
      console.log(doc.docs[i].data());
      // currentCampaigns.push(doc.docs[i].data());
      let endDate = doc.docs[i].data()?.endDate?.seconds;
      currentCampaigns.push({
        title:doc.docs[i].data().title,
        endDateTime:getDateFromTimestamp({
          timestamp: endDate
        }),
        goal:doc.docs[i].data().goal,
        goalValue:doc.docs[i].data().goalValue,
        username:doc.docs[i].data().person.username
      })
    }
    console.log('currentCampaigns');
    console.log(currentCampaigns);
    setCampaignsList(currentCampaigns);
  }
  const meetingBlockRef = useRef(null);
  useEffect(() => {
    getCampaigns();
    // currentCampaigns
    // meetingBlockRef.current.scrollTo(360 * 4, 0);
  }, [user,loading,id]);

  return (
    <div style={{ paddingLeft: 100 }}>
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
          onClick={() => navigate("/interact/createcampaign")}
          style={{ paddingLeft: 200 }}
        >
          + Create New Campaign
        </InteractButton>
      </div>
      <div>
        <div style={{ marginLeft: 20, textDecorationLine: "underline" }}>
          Interactions acquired
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {campaignsList.map((x, i) => (
            <CampaignSnippet key={i} info={x} />
          ))}
        </div>
        <br />
      </div>
      <div>
        <div style={{ marginLeft: 20, textDecorationLine: "underline" }}>
          Following campaigns
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {currentCampaigns.map((x, i) => (
            <CampaignSnippet key={i} info={x} />
          ))}
        </div>
        <br />
      </div>
      <div>
        <div style={{ marginLeft: 20, textDecorationLine: "underline" }}>
          Supported campaigns
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {currentCampaigns.map((x, i) => (
            <CampaignSnippet key={i} info={x} />
          ))}
        </div>
        <br />
      </div>
    </div>
  );
}

export default FollowedCampaigns;
