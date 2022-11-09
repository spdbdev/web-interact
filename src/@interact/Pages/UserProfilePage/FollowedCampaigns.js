import "./UserProfilePage.css";
import CampaignSnippet from "../../Components/CampaignSnippet/CampaignSnippet";
import MeetingBlocks from "./MeetingBlocks";
import { useEffect, useRef } from "react";
import InteractButton from "@interact/Components/Button/InteractButton";
import { useNavigate } from "react-router-dom";
import CampaignCategorySelect from "../CreateCampaignPage/CampaignCategorySelect";
import { initCampaignDoc } from "../CreateCampaignPage/utils";

function FollowedCampaigns() {
  const currentCampaigns = [1, 2, 3];
  const navigate = useNavigate();

  const meetingBlockRef = useRef(null);
  useEffect(() => {
    meetingBlockRef.current.scrollTo(360 * 4, 0);
  }, []);

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
          onClick={() => {
              navigate(`/a/create-campaign/`); // creates a new doc with initaliized values, gets the id as a result and passes that into route params
          }}
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
          {currentCampaigns.map((x, i) => (
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
