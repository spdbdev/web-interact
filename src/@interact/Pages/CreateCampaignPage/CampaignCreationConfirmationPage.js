import InteractFlashyButton from "@interact/Components/Button/InteractFlashyButton";
import { getDateFromTimestamp } from "@interact/Components/utils";
import { db } from "@jumbo/services/auth/firebase/firebase";
import { Close, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import SoloPage from "app/layouts/solo-page/SoloPage";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InteractionIcon from "../../Images/interaction-icon.png";

export default function CampaignCreationConfirmationPage() {
  const [campaignData, setCampaignData] = useState(null);

  useEffect(() => {
    const getCampaign = async () => {
      let fetchedData = (
        await getDoc(doc(db, "campaigns", "campaign-creation-test"))
      ).data();
      setCampaignData(fetchedData);
    };

    getCampaign();
  }, []);
  const navigate = useNavigate();

  return (
    <SoloPage>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100%",
          padding: 5,
          backgroundColor: "background.default",
        }}
      >
        <Box sx={{ alignSelf: "flex-end" }}>
          <IconButton
            disableRipple
            disableFocusRipple
            // onClick={() => navigate(-1)}
          >
            <Close sx={{ color: "text.secondary" }} />
          </IconButton>
        </Box>
        <Stack
          direction="column"
          alignItems="center"
          width={"100%"}
          height={"100%"}
        >
          <Stack
            direction="column"
            alignItems="center"
            flex={1}
            spacing={4}
            justifyContent="center"
            sx={{ maxWidth: 1000 }}
          >
            <Typography variant="h2">
              Success! Your campaign has been created!
            </Typography>
            <Typography variant="h5" sx={{ pb: 4 }}>
              Your campaign will start on{" "}
              {getDateFromTimestamp({
                timestamp: campaignData?.startDateTime,
                format: "MMM Do, YYYY [at] h:mm a",
              })}
            </Typography>
            <img alt="interaction-icon" src={InteractionIcon} width={120} />
            <Typography textAlign="center" sx={{ maxWidth: 400 }}>
              Until then, you can unsubmit and make changes to the campaign. You
              will not be able to make changes after the campaign goes live.
            </Typography>
            <Box>
              <InteractFlashyButton
                onClick={() => navigate("/interact/campaign")}
              >
                Got it
              </InteractFlashyButton>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </SoloPage>
  );
}
