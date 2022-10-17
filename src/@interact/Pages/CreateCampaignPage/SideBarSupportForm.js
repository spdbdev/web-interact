import React from "react";
import {
  Button,
  ButtonBase,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { InputUnstyled } from "@mui/base";

export default function SideBarSupportForm() {
  return (
    <Stack direction="column" m={2} spacing={1}>
      <Typography variant="body2" color={"primary.contrastText"}>
        Have a question? Ask here and we’ll get back to you within 24 hours!
      </Typography>
      <TextField
        placeholder="I was wondering how to..."
        multiline
        variant="filled"
        rows={4}
        hiddenLabel
        color="primary.contrastText"
      />
      {/* <InputUnstyled
        componentsProps={{
          input: {
            style: {
              outline: "none",
              backgroundColor: "rgba(255, 255, 255, .20)",
              borderColor: "transparent",
              borderRadius: 3,
              resize: "none",
              flex: 1,
              padding: 10,
              width: "100%",
            },
          },
        }}
        placeholder="I was wondering how to..."
        multiline
        rows={4}
        type="submit"
      /> */}
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
