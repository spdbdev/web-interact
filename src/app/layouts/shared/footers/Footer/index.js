import React from "react";
import { Typography } from "@mui/material";
import Div from "@jumbo/shared/Div";
import InteractLogo from "@interact/Images/logo.png";

const Footer = () => {
  return (
    <Div
      sx={{
        py: 2,
        px: { lg: 6, xs: 4 },
        borderTop: 2,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Div
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={InteractLogo} width={120} />
        <Typography variant={"body1"} sx={{ color: "text.disabled" }}>
          Copyright Interact © 2022
        </Typography>
      </Div>
    </Div>
  );
};

export default Footer;
