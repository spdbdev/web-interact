import { Icon } from "@iconify/react";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import { Avatar, Box, Chip, Link, Stack, Typography } from "@mui/material";
import ChipWithIconAvatar from "app/pages/components/mui/Chips/ChipWithIconAvatar";
import "./CampaignSnippet.css";
import UserCampaignStatus from "./UserCampaignStatus";
export default function CampaignSnippet() {
  return (
    <JumboCardQuick noWrapper sx={{ maxWidth: 280, m: 1 }}>
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
          src="https://clips-media-assets2.twitch.tv/AT-cm%7C861811248-preview-480x272.jpg"
        />
        <Chip
          sx={{
            position: "absolute",
            bottom: 12,
            left: 2,
            backgroundColor: "divider",
          }}
          icon={<Icon icon="iconoir:warning-circled-outline" />}
          label="Limited Interactions"
        />
      </Box>
      <Box sx={{ px: 1 }}>
        <UserCampaignStatus
          userGiveawayWinChance={10}
          userAuctionPosition={8}
        />
      </Box>

      <Stack sx={{ p: 2 }} spacing={0.5}>
        <Typography sx={{ fontWeight: 500 }}>
          I will eat 100 hotdogs at $5000
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          by Friday, 26 August 2022
        </Typography>

        <br />
        <Stack direction="row" spacing={1}>
          <Avatar sx={{ width: 24, height: 24 }} />
          <Box>
            <Typography>Play minecraft with me 1 on 1!</Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Created by{" "}
              <Link href="#" sx={{ color: "primary.main" }}>
                Pattedevelours
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </JumboCardQuick>
  );
}
