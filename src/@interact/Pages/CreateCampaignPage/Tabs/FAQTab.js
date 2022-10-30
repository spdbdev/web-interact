import React from "react";
import { Container, Stack, Typography } from "@mui/material";
import FAQAccordian from "../FAQAccordian";
import { TabNavigation } from "../TabNavigation";
import { useFormValidation } from "@interact/Hooks/use-form-validation";

export default function FAQTab({
  data,
  setData,
  selectedTabIndex,
  setSelectedTabIndex,
}) {
  const { FAQAnswers, lastCompletedTabIndex } = data;

  const formValidationConditions =
    FAQAnswers[0]?.length > 0 && FAQAnswers[1]?.length > 0;

  const isTabValidated = useFormValidation({
    selectedTabIndex,
    lastCompletedTabIndex,
    setData,
    formValidationConditions,
  });

  return (
    <>
      <Stack direction="column" alignItems="center" spacing={4}>
        <Typography variant="h2" sx={{ fontWeight: 500 }}>
          Your campaign FAQ will look like this:
        </Typography>
        <FAQAccordian data={data} setData={setData} />
      </Stack>
      <TabNavigation
        disableNext={!isTabValidated}
        selectedTabIndex={selectedTabIndex}
        setSelectedTabIndex={setSelectedTabIndex}
      />
    </>
  );
}
