import React from "react";
import {
  Box,
  Button,
  ButtonBase,
  Container,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { InputUnstyled } from "@mui/base";

export default function SideBarSupportForm() {
  return (
    <Stack direction="column" m={2} spacing={1} sx={{ position: "relative" }}>
      <Box
        sx={{
          height: "50px",
          width: "100%",
          position: "absolute",
          top: -80,
          zIndex: 8000,
          background:
            "linear-gradient(360deg, #B016F8 0%, rgba(177, 22, 248, 0) 100%)",
        }}
      ></Box>
      <Typography variant="body2" color={"primary.contrastText"}>
        Have a question? Ask here and we’ll get back to you within 24 hours! (on weekdays)
      </Typography>

      <TextField
        placeholder="I was wondering how to..."
        multiline
        variant="filled"
        InputProps={{
          sx: {
            "&::before": {
              borderColor: "transparent",
            },
            color: "primary.contrastText",
          },
        }}
        rows={4}
        hiddenLabel
      />

      <ButtonBase
        sx={{
          color: "primary.contrastText",
          borderRadius: "2px 9px",
          border: "1px solid",
          py: 1,
        }}
        variant="outlined"
      >
        Submit →
      </ButtonBase>
    </Stack>
  );
}
