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
  ButtonBase,
  Container,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import SoloPage from "app/layouts/solo-page/SoloPage";
import { doc, getDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../../firebase.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InteractionIcon from "../../Images/interaction-icon.png";
import InteractButton from "@interact/Components/Button/InteractButton.js";

export default function CampaignCreationConfirmationPage() {
  const [campaignData, setCampaignData] = useState(null);
  const [campaignImage, setCampaignImage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getCampaign = async () => {
      let fetchedData = (
        await getDoc(doc(db, "campaigns", "campaign-creation-test"))
      ).data();
      setCampaignData(fetchedData);

      const getImage = httpsCallable(functions, "getCampaignImage");

      getImage({
        title: fetchedData?.title,
        categories: fetchedData?.categories,
        creatorName: fetchedData?.creatorName,
        description: fetchedData?.description,
        thumbnailUrl: fetchedData?.campaignVideoThumbnailLink,
        startDate: getDateFromTimestamp({
          timestamp: fetchedData?.startDateTime.seconds,
        }),
        endDate: getDateFromTimestamp({
          timestamp: fetchedData?.endDateTime.seconds,
        }),
        goal: fetchedData?.goal,
        goalValue: fetchedData?.goalValue,
        numInteractions: JSON.stringify(
          fetchedData?.numAuctionInteractions +
            fetchedData?.numGiveawayInteractions
        ),
        campaignUrl: campaignData?.customURL,
      })
        .then((result) => {
          setCampaignImage(result?.data?.file?.url);
        })
        .catch((e) => {
          console.log(e);
        });
    };

    getCampaign();
  }, []);

  // useEffect(() => {
  //   const getCampaignImage = async () => {
  //     const getImage = httpsCallable(functions, "getCampaignImage");

  //     console.log(campaignData?.categories);
  //     getImage({
  //       title: campaignData?.title,
  //       categories: campaignData?.categories,
  //       creatorName: campaignData?.creatorName,
  //       description: campaignData?.description,
  //       thumbnailUrl: campaignData?.campaignVideoThumbnailLink,
  //       startDate: getDateFromTimestamp({
  //         timestamp: campaignData?.startDateTime.seconds,
  //       }),
  //       endDate: getDateFromTimestamp({
  //         timestamp: campaignData?.endDateTime.seconds,
  //       }),
  //       goal: campaignData?.goal,
  //       goalValue: campaignData?.goalValue,
  //       numInteractions: JSON.stringify(
  //         campaignData?.numAuctionInteractions +
  //           campaignData?.numGiveawayInteractions
  //       ),
  //       campaignUrl: campaignData?.customURL,
  //     })
  //       .then((result) => {
  //         setCampaignImage(result?.data?.file?.url);
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //       });
  //   };

  //   getCampaignImage();
  // }, []);

  return (
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

            <Typography>
              add a message to the creator when this is generated, saying "If on
              Twitch, add your campaign link https://www.interact.vip/url to the
              'Image Links To' section when uploading a panel"
            </Typography>
            <Stack direction="row" alignItems="center" spacing={4}>
              <InteractFlashyButton
                onClick={() => navigate("/interact/campaign")}
              >
                Go to campaign
              </InteractFlashyButton>

              <InteractButton sx={{ height: 40 }} disabled={!campaignImage}>
                {!campaignImage ? (
                  "Generating panel for download..."
                ) : (
                  <Link
                    sx={{ textDecoration: "none" }}
                    href={campaignImage}
                    download
                  >
                    Get campaign panel
                  </Link>
                )}
              </InteractButton>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
