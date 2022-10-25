import InteractFlashyButton from "@interact/Components/Button/InteractFlashyButton";
import InteractChip from "@interact/Components/Chips/InteractChip";
import { Close, ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonBase,
  Chip,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import SoloPage from "app/layouts/solo-page/SoloPage";
import React from "react";
import { useNavigate } from "react-router-dom";
import InteractLogo from "../../Images/logo512.png";
import FAQAccordian from "./FAQAccordian";

const CAMPAIGN_SUMMARY_ITEMS = [
  { label: "Goal Value", value: "$1000 USD" },
  { label: "Goal", value: "I will eat a cricket on stream" },
  { label: "Start Date", value: "Oct. 03, 2022" },
  { label: "End Date", value: "Nov. 03, 2022" },
  { label: "Duration", value: "30 days" },
  { label: "Interaction End Date", value: "Jan. 06, 2023" },
  { label: "Auction Min. Bid", value: "$10" },
  { label: "Giveaway VIP Entry Price", value: "$1" },
  { label: "Custom URL", value: "cricket-challenge" },
];

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
  const navigate = useNavigate();

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
                p: 2,
                textAlign: "center",
              }}
            >
              <Typography>Click here to upload a thumbnail image.</Typography>
            </Stack>
            <FAQAccordian shouldAllowEdit={false} />
          </Stack>
          <Stack direction="column" spacing={3}>
            <Stack spacing={2} sx={{ height: 180 }}>
              <Typography variant="h3" sx={{ fontWeight: 500 }}>
                Name of Campaign
              </Typography>
              <Typography flex={1}>
                Interact helps you bring joy to your most loyal fans who have
                grown with you not only as a creator, but as a human being.
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <InteractChip label="Gaming" />
                <InteractChip label="Gaming" />
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
            onClick={() => navigate("/interact/campaign-creation-confirmation")}
          >
            Submit ✓
          </InteractFlashyButton>
        </Box>
      </Box>
    </SoloPage>
  );
}
