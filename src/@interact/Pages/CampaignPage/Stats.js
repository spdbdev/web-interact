import "./CampaignPage.css";
// import {InfoCircleOutlined} from '@ant-design/icons'
// import { Button, Divider, OutlinedInput, InputAdornment } from '@mui/material';
// import ProgressBar from "@ramonak/react-progress-bar";
import { useState } from "react";
import Socials from "../../Components/Socials/Socials";
import { LinearProgress } from "@mui/material";
// import { ca } from 'date-fns/locale';

export default function Stats({ campaignData }) {
  let stats = campaignData?.stats ? campaignData.stats : {};

  return (
    <div
      style={{
        paddingLeft: 20,
        paddingRight: 20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ paddingTop: 10 }}>
        <LinearProgress
          completed={4892}
          maxCompleted={7000}
          customLabel=" "
          width="400px"
          height="3px"
          bgColor="#782FEE"
          baseBgColor="#E8D6FF"
        />
        <div
          style={{
            display: "flex",
            paddingTop: 5,
            justifyContent: "flex-start",
            alignItems: "top",
          }}
        >
          <div style={{ fontSize: 40, color: "#782FEE", fontWeight: "bold" }}>
            ${stats.currRaised}{" "}
          </div>
          {/* <div style={{ justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', marginTop:-5}}> */}
          <div style={{ marginTop: 5 }}>
            <span style={{ fontSize: 19, paddingTop: 5, paddingLeft: 10 }}>
              {" "}
              {stats.targetTagline}{" "}
              <span style={{ fontWeight: "bold", color: "#782FEE" }}>
                ${stats.target}
              </span>{" "}
            </span>
          </div>
          {/* <div style={{fontSize:15, fontWeight:'bold'}}>I will eat 100 hotdogs at $5000</div> */}
          {/* </div> */}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Follow />
        <div style={{ marginLeft: 20 }}>
          <span style={{ fontWeight: "bold", color: "#782FEE" }}>
            {stats.numFollowers}
          </span>{" "}
          Followers
        </div>
      </div>

      <div>
        <span style={{ fontWeight: "bold", color: "#782FEE" }}>
          {stats.numBidders}
        </span>{" "}
        Bidders
      </div>

      <div>
        <span style={{ fontWeight: "bold", color: "#782FEE" }}>
          {stats.numRafflers}
        </span>{" "}
        Rafflers
      </div>

      <div
        style={{
          fontWeight: "bold",
          color: "#782FEE",
          fontWeight: "bold",
          textDecoration: "underline",
        }}
      >
        {stats.category}
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <Socials type="hyperlink" />
        <Socials type="discord" />
        <Socials type="tiktok" />
        <Socials type="twitter" />
        <Socials type="facebook" />
        <Socials type="instagram" />
      </div>
    </div>
  );
}

export function Follow({ selected }) {
  let [selectedState, setSelectedState] = useState(selected);
  return (
    <div
      onClick={() => setSelectedState(!selectedState)}
      style={{
        width: 90,
        height: 23,
        cursor: "pointer",
        fontSize: 15,
        fontWeight: "bold",
        padding: 3,
        borderWidth: 2,
        borderStyle: "solid",
        color: "#782FEE",
        borderColor: "#782FEE",
        borderBottomLeftRadius: 11,
        borderTopRightRadius: 11,
      }}
    >
      <center>{selectedState ? "Following" : "Follow"}</center>
    </div>
  );
}
