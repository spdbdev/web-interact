import "./CampaignPage.css";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Divider, OutlinedInput, InputAdornment } from "@mui/material";

export default function Header({ campaignData }) {
  return (
    // "50 interactions will be carried out from Aug 8th 2022 to Oct 3rd 2022, don't miss out!"
    // "Campaign ends at 8:00 pm EST on Aug 5th 2022"
    // "Ends in X days" or "Ends in X hours" or "Ends in X minutes"

    <div className="Description">
      <div style={{ fontSize: 30, fontWeight: 400, paddingBottom: 10 }}>
        Game &#38; Chat with{" "}
        <span style={{ color: "#782eee" }}>Pattedevelours</span> 1-on-1
      </div>
      <div style={{ color: "gray", fontSize: 18 }}>
        {campaignData?.header?.tagline1}
      </div>
      <Divider />
      <div style={{ fontSize: 20 }}>{campaignData?.header?.tagline2}</div>
      <div style={{ color: "gray", fontSize: 18 }}>
        Began on{" "}
        {new Date(campaignData?.startDate?.seconds * 1000)
          ?.toString()
          .slice(0, 15)}{" "}
        || Ends on{" "}
        {new Date(campaignData?.endDate?.seconds * 1000)
          ?.toString()
          .slice(0, 15)}
      </div>
    </div>
  );
}
