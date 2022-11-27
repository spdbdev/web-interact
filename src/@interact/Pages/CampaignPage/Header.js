import "./CampaignPage.css";
import { useEffect, useState } from "react";
import {
  Button,
  Divider,
  OutlinedInput,
  InputAdornment,
  Typography,
  Box,
  Stack,
  Grid 
} from "@mui/material";
import moment from "moment";
import { getDateFromTimestamp } from "app/utils";
import Span from "@jumbo/shared/Span";
import InteractFlashyButton from "@interact/Components/Button/InteractFlashyButton";
import {localizationServices} from "app/services/localization"
import { fetchUser } from "../../../firebase";

export default function Header({ campaignData }) {
  const [campaignUser, setCampaignUser] = useState({});
  useEffect(async ()  =>{
    if(campaignData?.person?.id){
      let userData = await fetchUser(campaignData.creatorId);
      setCampaignUser(userData);
    }
  },[campaignData])
  const numInteractions = Number(campaignData.numAuctionInteractions ?? 0) + Number(campaignData.numGiveawayInteractions ?? 0);
  return (
    <div className="Description">
      <Typography
        variant="h3"
        py={0}
        mb={0}
        style={{ fontSize: 30, fontWeight: 400 }}
      >
        {campaignData?.title}
      </Typography>
      <Typography sx={{ color: "text.secondary", fontSize: 18 }}>
        Created by
        <img
          src={campaignUser?.photoURL ? campaignUser?.photoURL : "https://iili.io/HH6JxB1.md.jpg"}
          alt={'No image'}
          align="center"
          className="profile_image"
          style={{
              objectFit: "cover",
              width: 35,
              height: 35,
              borderRadius: 1000,
              marginLeft: "5px",
          }}
        >
        </img>
        <a href={`/u/${campaignData?.person?.username}`} style={{ color: "#782fee" }}>
          {campaignData?.creatorName}
        </a>
      </Typography>
      <Divider />
      <Stack direction="column">
        <Typography py={0}>
          <Span>
            {numInteractions} interactions will be carried out from{" "}
            {getDateFromTimestamp({
              timestamp: campaignData?.interactionStartDateTime?.seconds,
            })}{" "}
            to{" "}
            {getDateFromTimestamp({
              timestamp: campaignData?.interactionEndDateTime?.seconds,
            })}
            , don't miss out!
          </Span>
          <br />
          <Span>
            Campaign ends at{" "}
            {getDateFromTimestamp({
              timestamp: campaignData?.endDateTime?.seconds,
              format: ` h:mm a [${localizationServices.getDeviceTimezone()} on] dddd, MMMM Do YYYY`,
            })}
          </Span>
        </Typography>
      </Stack>
      <br></br>
      <InteractFlashyButton
        >
          {(()=> {
            if (moment().isBefore(moment.unix(campaignData?.startDateTime?.seconds))) {
              return <Typography fontWeight={600} padding={0.2169}>Starts {moment.unix(campaignData?.startDateTime?.seconds).fromNow()}</Typography>
            }
            else if (moment().isBefore(moment.unix(campaignData?.endDateTime?.seconds)) ) {
              return <Typography fontWeight={600} padding={0.2169}>Ends {moment.unix(campaignData?.endDateTime?.seconds).fromNow()}</Typography>
            }
            else {
              return <Typography fontWeight={600} padding={0.2169}>Ended {moment.unix(campaignData?.endDateTime?.seconds).toNow()}</Typography>
            }
          })()}

      </InteractFlashyButton>
    </div>
  );
}
