import React, { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { Container } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    // this uses the theme we passed to the ThemeProvider in App.js
    textTransform: "none",
    fontWeight: 400,
    fontSize: "16px",
    color: theme.palette.text.primary,
    "&.Mui-selected": {
      color: theme.palette.text.primary,
    },
  })
);

export default function CampaignCreationTabs({
  selectedTabIndex,
  setSelectedTabIndex,
}) {
  const handleTabChange = (event, newTabIndex) => {
    event.preventDefault(); // prevent clicking tabs
  };

  return (
    <Container
      disableGutters
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        maxWidth: 1000,
        my: 3,
      }}
    >
      <Tabs
        value={selectedTabIndex}
        onChange={handleTabChange}
        centered={true}
        textColor="primary"
        variant="fullWidth"
        aria-label="icon label tabs example"
      >
        <StyledTab label="Basics" />
        <StyledTab label="Scheduling" />
        <StyledTab label="Interaction" />
        <StyledTab label="Goal & Video" />
        <StyledTab label="FAQ" />
        <StyledTab label="Payment" />
        <StyledTab label="Promotion" />
      </Tabs>
    </Container>
  );
}
