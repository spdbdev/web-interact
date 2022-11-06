import InteractFlashyButton from "@interact/Components/Button/InteractFlashyButton";
import InteractChip from "@interact/Components/Chips/InteractChip";
import Loading from "@interact/Components/Loading/Loading";
import {
  getDateFromTimestamp,
  getYoutubeIDFromURL,
} from "@interact/Components/utils";
import { db } from "@jumbo/services/auth/firebase/firebase";
import { ExpandLess } from "@mui/icons-material";
import {
  Box,
  ButtonBase,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import SoloPage from "app/layouts/solo-page/SoloPage";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FAQAccordian from "./FAQAccordian";

export function CampaignSummaryItem({ label, value }) {
  return (
    <Grid item xs={12} sm={6} md={6}>
      <Typography sx={{ fontWeight: 500, fontSize: 18 }}>{label}</Typography>
      <Typography
        sx={{ fontWeight: 500, fontSize: 16, color: "text.secondary" }}
      >
        {value}
      </Typography>
    </Grid>
  );
}

export default function CampaignCreationSummaryPage() {
  const [campaignData, setCampaignData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getCampaign = async () => {
      let fetchedData = (
        await getDoc(doc(db, "campaigns", "campaign-creation-test"))
      ).data();

      setCampaignData(fetchedData);
    };

    getCampaign();
  }, []);

  const CAMPAIGN_SUMMARY_ITEMS = [
    { label: "Goal Value", value: `$${campaignData?.goalValue}` },
    { label: "Goal", value: campaignData?.goal },
    {
      label: "Start Date",
      value: getDateFromTimestamp({ timestamp: campaignData?.startDateTime }),
    },
    {
      label: "End Date",
      value: getDateFromTimestamp({ timestamp: campaignData?.endDateTime }),
    },
    { label: "Duration", value: `${campaignData?.durationDays} days` },
    {
      label: "Interaction End Date",
      value: getDateFromTimestamp({
        timestamp: campaignData?.interactionEndDateTime,
      }),
    },
    { label: "Auction Min. Bid", value: `$${campaignData?.auctionMinBid}` },
    {
      label: "Giveaway VIP Entry Price",
      value: `$${campaignData?.giveawayVIPEntryCost}`,
    },
    {
      label: "Custom URL",
      value: `www.interact.vip/${campaignData?.customURL}`,
    },
  ];

  if (!campaignData) {
    return <Loading />;
  } else {
    return (
      <SoloPage>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            width: "100%",
            padding: 0,
            backgroundColor: "background.default",
          }}
        >
          <Container sx={{ display: "flex", justifyContent: "center" }}>
            <ButtonBase
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "text.hint",
              }}
              onClick={() => navigate("/interact/createCampaign")}
            >
              <ExpandLess />
              <Typography sx={{ my: 0, py: 0 }}>Go back and edit</Typography>
            </ButtonBase>
          </Container>
          <Typography
            variant="h2"
            mt={4}
            sx={{ fontWeight: 500, alignSelf: "center" }}
          >
            Are you sure you want to submit this campaign?
          </Typography>
          <Stack
            direction="row"
            alignSelf="center"
            spacing={4}
            mt={6}
            pb={10}
            sx={{ maxWidth: 800 }}
          >
            <Stack direction="column" spacing={3} sx={{ maxWidth: 350 }}>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={2}
                sx={{
                  bgcolor: "divider",
                  width: 350,
                  height: 180,
                  borderRadius: 2,
                  textAlign: "center",
                  overflow: "hidden",
                }}
              >
                <iframe
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  src={`https://www.youtube.com/embed/${getYoutubeIDFromURL(
                    campaignData?.campaignVideoLink
                  )}`}
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </Stack>
              <FAQAccordian data={campaignData} shouldAllowEdit={false} />
            </Stack>
            <Stack direction="column" spacing={3}>
              <Stack spacing={2} sx={{ height: 180 }}>
                <Typography variant="h3" sx={{ fontWeight: 500 }}>
                  {campaignData?.title}
                </Typography>
                <Typography flex={1}>{campaignData?.description}</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  {campaignData?.categories?.map((item, index) => (
                    <InteractChip label={item} key={index} />
                  ))}
                </Stack>
              </Stack>
              <Grid sx={{ width: "100%" }} container rowSpacing={3}>
                {CAMPAIGN_SUMMARY_ITEMS?.map((item, index) => (
                  <CampaignSummaryItem
                    key={index}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </Grid>
            </Stack>
          </Stack>
          <Box sx={{ position: "fixed", bottom: 50, right: 50 }}>
            <InteractFlashyButton
              onClick={() =>
                navigate("/interact/campaign-creation-confirmation")
              }
            >
              Submit ✓
            </InteractFlashyButton>
          </Box>
        </Box>
      </SoloPage>
    );
  }
}
