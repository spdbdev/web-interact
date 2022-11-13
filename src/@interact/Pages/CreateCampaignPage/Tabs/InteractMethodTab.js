import InteractButton from "@interact/Components/Button/InteractButton";
import { useFormValidation } from "@interact/Hooks/use-form-validation";
import Span from "@jumbo/shared/Span";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import { Close, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  IconButton,
  Link,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import TitleAndDesc from "../CampaignTitleAndDesc";
import CreateCampaignItemWrapper from "../CreateCampaignItemWrapper";
import { TabNavigation } from "../TabNavigation";

export default function InteractMethodTab({
  data,
  setData,
  selectedTabIndex,
  setSelectedTabIndex,
}) {
  const [title, setTitle] = useState(data?.title);
  const [description, setDescription] = useState(data?.description);
  const [categories, setCategories] = useState(data?.categories);
  const [errors, setErrors] = useState(false);
  const [formValidationConditions, setFormValidationConditions] =
    useState(false);
  const [method, setMethod] = useState(data?.interactMethod);
  const [isDiscordLinked, setIsDiscordLinked] = useState(false);
  const [isGoogleMeetLinked, setIsGoogleMeetLinked] = useState(false);
  const [shouldShowProgressModal, setShouldShowProgressModal] = useState(false);

  useEffect(() => {
    setFormValidationConditions(
      method === "googleMeet" || method === "discord"
    );
  }, [method]);

  useEffect(() => {
    if (!formValidationConditions) {
      setErrors(true);
    } else {
      setErrors(false);
    }
  }, [formValidationConditions]);

  const isTabValidated = useFormValidation({
    selectedTabIndex,
    lastCompletedTabIndex: data?.lastCompletedTabIndex,
    setData,
    formValidationConditions,
  });

  const Swal = useSwalWrapper();

  function handleGoogleMeetButton() {
    if (isGoogleMeetLinked) {
      setIsGoogleMeetLinked(false);
      setIsDiscordLinked(false);
      setMethod(null);
      setData({ interactMethod: "" });
    } else {
      setIsGoogleMeetLinked(true);
      setIsDiscordLinked(false);
      setMethod("googleMeet");
      setData({ interactMethod: "googleMeet" });
    }
  }

  function handleLinkDiscordButton() {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    setShouldShowProgressModal(true);

    // here, get value of discordServerLinkResult,  'succeeded' or 'failed' and show respective Toast:
    Toast.fire({
      icon: "success",
      title: "Discord server successfully linked!",
    }).then(() => {
      setIsDiscordLinked(true);
      setIsGoogleMeetLinked(false);
      setMethod("discord");
      setData({ interactMethod: "discord" });
      setShouldShowProgressModal(false);
    });

    Toast.fire({
      icon: "error",
      title: "Failed to link server.",
    }).then(() => {
      setShouldShowProgressModal(false);
    });
  }

  return (
    <>
      <Modal open={shouldShowProgressModal}>
        <Box
          sx={{
            p: 3,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: "background.paper",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h3">Linking to Discord...</Typography>

          <CircularProgress sx={{ my: 4 }} />
        </Box>
      </Modal>
      <Stack direction="column" spacing={6}>
        <CreateCampaignItemWrapper>
          <TitleAndDesc title="Link your Discord server">
            Interact via Discord to play mini-games like miniputt & watch
            Youtube videos together. Through our Interact bot, 1 minute before a
            fan's scheduled interaction, they will automatically be given a
            special role to access a private voice channel; they will
            automatically have that role removed after 3 hours (or you can do so
            earlier manually). <br></br>
            <br />
            Press 'Link your Discord Server' again to change the server.
          </TitleAndDesc>
          <InteractButton
            onClick={handleLinkDiscordButton}
            sx={{
              width: 300,
              color: isDiscordLinked ? "primary.contrastText" : "primary.main",
            }}
            variant={isDiscordLinked ? "contained" : "outlined"}
          >
            {isDiscordLinked
              ? "Linked to Discord server ✓"
              : "Link your Discord server"}
          </InteractButton>
        </CreateCampaignItemWrapper>

        <Box sx={{ width: "100%" }}>
          <Accordion sx={{ flex: 1 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography>How do I create a Discord server?</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                See the following link:{" "}
                <Link
                  href="https://support.discord.com/hc/en-us/articles/204849977-How-do-I-create-a-server-"
                  target="_blank"
                >
                  https://support.discord.com/hc/en-us/articles/204849977-How-do-I-create-a-server-
                </Link>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ flex: 1 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography>
                  How do I add a role to my Discord server?
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <ol>
                <li>
                  Click on the Server Settings menu item on your Discord server
                </li>
                <li>Click the Roles tab</li>
                <li>Click the Create role button to create a new role</li>
                <li>
                  Give your role the permission to access a private voice
                  channel (create a private voice channel first)
                </li>
              </ol>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Stack>

      <CreateCampaignItemWrapper>
        <TitleAndDesc title="Or, use Google Meet">
          We'll automatically generate a unique link for every interaction.
        </TitleAndDesc>
        <InteractButton
          onClick={handleGoogleMeetButton}
          sx={{
            width: 300,
            color: isGoogleMeetLinked ? "primary.contrastText" : "primary.main",
          }}
          variant={isGoogleMeetLinked ? "contained" : "outlined"}
        >
          {isGoogleMeetLinked ? "Use Google Meet ✓" : "Use Google Meet"}
        </InteractButton>
      </CreateCampaignItemWrapper>

      <TabNavigation
        disableNext={!isTabValidated}
        selectedTabIndex={selectedTabIndex}
        setSelectedTabIndex={setSelectedTabIndex}
      />
    </>
  );
}
