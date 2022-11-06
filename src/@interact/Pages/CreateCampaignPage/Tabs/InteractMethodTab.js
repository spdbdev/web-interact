import { useFormValidation } from "@interact/Hooks/use-form-validation";
import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CampaignCategorySelect from "../CampaignCategorySelect";
import CampaignDropdownSelect from "../CampaignDropdownSelect";
import TitleAndDesc from "../CampaignTitleAndDesc";
import CreateCampaignItemWrapper from "../CreateCampaignItemWrapper";
import FAQAccordian from "../FAQAccordian";
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

  useEffect(() => {
    setFormValidationConditions(
      0 < title?.length &&
        title?.length <= 40 &&
        description?.length > 0 &&
        1 <= categories?.length &&
        categories?.length <= 3
    );
  }, [title, description, categories]);

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

  return (
    <>
      <Stack direction="column" alignItems="center">
        <Typography variant="h2" sx={{ fontWeight: 500, pb: 2 }}>
          Discord
        </Typography>
        <Box sx={{ width: 500 }}>
          <Accordion sx={{ flex: 1 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography>How do I create a Discord server?</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>See the following link:</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ flex: 1 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography>How to add a role:</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>See the following link:</Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Stack>

      <Stack direction="column" alignItems="center">
        <Typography variant="h2" sx={{ fontWeight: 500, pb: 2 }}>
          Or, set up Google Meet
        </Typography>
        <Box sx={{ width: 500 }}>
          <Accordion sx={{ flex: 1 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography>How do I create a Discord server?</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>See the following link:</Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Stack>

      <TabNavigation
        disableNext={!isTabValidated}
        selectedTabIndex={selectedTabIndex}
        setSelectedTabIndex={setSelectedTabIndex}
      />
    </>
  );
}
