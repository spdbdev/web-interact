import React from "react";
import { Box, Container, IconButton, Stack } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import SideBarSupportForm from "./SideBarSupportForm";
import JumboVerticalNavbar from "@jumbo/components/JumboVerticalNavbar/JumboVerticalNavbar";

export default function SideBar({
  isSideBarCollapsed,
  setIsSideBarCollapsed,
  FAQSideBarText,
}) {
  return (
    <Stack
      direction="column"
      sx={{
        width: isSideBarCollapsed ? 40 : 260,
        background:
          "linear-gradient(173.73deg, #782FEE 10.4%, #DD00FF 117.43%)",
        boxShadow: "1px 1px 20px rgba(0, 0, 0, 0.5)",
      }}
    >
      <IconButton
        sx={{ alignSelf: "flex-end" }}
        onClick={() => setIsSideBarCollapsed(!isSideBarCollapsed)}
      >
        <InfoOutlined sx={{ color: "primary.contrastText" }} />
      </IconButton>

      {isSideBarCollapsed ? null : (
        <>
          <Container sx={{ flex: 1, color: "primary.contrastText" }}>
            {FAQSideBarText}
          </Container>
          <SideBarSupportForm />
        </>
      )}
    </Stack>
  );
}
