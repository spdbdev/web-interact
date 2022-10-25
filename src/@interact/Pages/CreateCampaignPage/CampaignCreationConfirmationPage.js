import InteractFlashyButton from "@interact/Components/Button/InteractFlashyButton";
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
import React from "react";
import { useNavigate } from "react-router-dom";
import InteractLogo from "../../Images/logo512.png";

export default function CampaignCreationConfirmationPage() {
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
            onClick={() => navigate(-1)}
          >
            <Close sx={{ color: "text.secondary" }} />
          </IconButton>
        </Box>
        <Stack direction="column" alignItems="center" width={"100%"}>
          <Stack spacing={1} sx={{ maxWidth: 1000 }}>
            <Stack direction="column" alignItems="center" spacing={2}>
              <img src={InteractLogo} alt="" width={50} />
              <Typography variant="h2">
                Success! Your campaign has been created!
              </Typography>
            </Stack>
            <Typography variant="h5" sx={{ py: 4 }}>
              Your campaign will start on October 3rd, 2022.
            </Typography>
          </Stack>
        </Stack>
        <Box>
          <InteractFlashyButton onClick={() => navigate("/interact/campaign")}>
            Got it
          </InteractFlashyButton>
        </Box>
      </Box>
    </SoloPage>
  );
}
