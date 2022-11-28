import { Icon } from "@iconify/react";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import { Avatar, Box, Chip, Link, Stack, Typography } from "@mui/material";
import ChipWithIconAvatar from "app/pages/components/mui/Chips/ChipWithIconAvatar";
import { formatMoney } from "app/utils";
import "./CampaignSnippet.css";
import { useEffect, useRef, useState } from "react";
import UserCampaignStatus from "./UserCampaignStatus";
import { getDateFromTimestamp } from "app/utils";
import { fetchUser } from "../../../firebase";
import moment from "moment";

export default function CampaignSnippet(props) {
  
  const {info} = props;
  const [campaignUser, setCampaignUser] = useState({});
  useEffect(async ()  =>{
    if(info.person?.id){
      let userData = await fetchUser(info.creatorId);
      setCampaignUser(userData);
    }
  },[info])

  return (
    <JumboCardQuick noWrapper sx={{ maxWidth: 280, m: 2 }}>
      <Box sx={{ position: "relative" }}>
        <img
          alt=""
          style={{
            width: "100%",
            borderBottomWidth: 5,
            borderTopRightRadius: 11,
            borderBottomStyle: "solid",
            borderBottomColor: "#782fee",
          }}
          src={info.campaignVideoThumbnailLink ? info.campaignVideoThumbnailLink : "https://clips-media-assets2.twitch.tv/AT-cm%7C861811248-preview-480x272.jpg"}
        />
        <Chip
          size="small"
          sx={{
            position: "absolute",
            bottom: 14,
            left: 4,
            backgroundColor: "divider",
            fontSize: 12,
          }}
          icon={<Icon icon="iconoir:warning-circled-outline" />}
          label="Limited interactions"
        />
      </Box>
      <Box sx={{ px: 1 }}>
        <UserCampaignStatus
          userGiveawayWinChance={10}
          userAuctionPosition={8}
        />
      </Box>

      <Stack sx={{ p: 2 }}>
        <Typography sx={{ fontWeight: 500 }}>
          I will {info.goal} at ${formatMoney(info.goalValue)}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {(()=> {
            if (moment().isBefore(moment.unix(info?.startDateTime?.seconds))) {
              return <span> {moment.unix(info?.startDateTime?.seconds).fromNow()}</span>
            }
            else if (moment().isBefore(moment.unix(info?.endDateTime?.seconds)) ) {
              return <span>Ends {moment.unix(info?.endDateTime?.seconds).fromNow()}</span>
            }
            else {
              return <span>Ended {moment.unix(info?.endDateTime?.seconds).toNow()}</span>
            }
          })()}
        </Typography>

        <br />
        <Stack direction="row" spacing={1}>
          <Avatar sx={{ width: 24, height: 24 }} alt="" src={campaignUser.photoURL ? campaignUser.photoURL : "https://iili.io/HH6JxB1.md.jpg"} />
          <Box>
            <Typography>{info.title}</Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Created by{" "}
              <Link href="#" sx={{ color: "primary.main" }}>
              {campaignUser.name}
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </JumboCardQuick>
  );
}
