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
          py: 5,
          px: {xl: 0, lg: 6, xs: 4 },
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems='center'
          justifyContent='space-between'
          width='77.96%'
          spacing={0}
          sx={{
            '& a': { color: '#A2B2C3', transition: 'color 0.2s linear' },
            '& a:hover': { color: '#782fee' }
          }}
        >
          <Link href="/a/faq" underline="hover">FAQ</Link>
          <Link href="/a/privacy-policy" underline="hover">Privacy policy</Link>
          <img src={InteractLogo} width={150} alt='' />
        </Stack>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems='center'
          justifyContent='space-between'
          width='77.96%'
          spacing={0}
          paddingTop={0}
          paddingBottom ={4.69}
          sx={{
            '& a': { color: '#A2B2C3', transition: 'color 0.2s linear' },
            '& a:hover': { color: '#782fee' }
          }}
        >
          <Link href="/a/campaign-creator-faq" underline="hover">Campaign creator FAQ</Link>
          <Link href="/a/terms-and-conditions" underline="hover">Terms & conditions</Link>
          <Typography variant={"body1"} sx={{ color: "text.disabled", mt: 1, fontSize: '12px' }}>
            Copyright Interact © 2022
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Footer;
