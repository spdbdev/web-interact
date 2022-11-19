import React from "react";
import { Typography, Grid } from "@mui/material";
import Link from '@mui/material/Link';
import Div from "@jumbo/shared/Div";
import InteractLogo from "@interact/Images/logo.png";
import Stack from '@mui/material/Stack';

const Footer = () => {
  return (
    <Stack
      sx={{
        bgcolor: "background.paper",
        borderTop: 2,
        borderColor: "divider"
      }}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        maxWidth='1440px'
        width='100%'
        alignSelf='center'
        sx={{
          py: 4,
          px: {xl: 0, lg: 6, xs: 4 },
        }}
      >
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          width='100%'
          spacing={2}
          sx={{
            '& a': { color: '#A2B2C3', transition: 'color 0.2s linear' },
            '& a:hover': { color: '#DD00FF' }
          }}
        >
          <Link href="/a/faq" underline="hover">FAQ</Link>
          <Link href="/a/campaign-creator-faq" underline="hover">Campaign creator FAQ</Link>
          <Link href="/a/privacy-policy" underline="hover">Privacy policy</Link>
          <Link href="/a/campaign-creator-faq" underline="hover">Campaign creator FAQ</Link>
        </Stack>
        <Div
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            mt: 2
          }}
        >
          <img src={InteractLogo} width={120} alt='' />
          <Typography variant={"body1"} sx={{ color: "text.disabled", ml: 2 }}>
            Copyright Interact © 2022
          </Typography>
        </Div>
      </Stack>
    </Stack>
  );
};

export default Footer;
