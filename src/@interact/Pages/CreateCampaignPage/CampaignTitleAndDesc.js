import { Stack, Typography } from "@mui/material";
import React from "react";

export default function TitleAndDesc({ title, children }) {
  return (
    <Stack direction="column" spacing={1} sx={{ width: 400 }}>
      <Typography sx={{ fontWeight: 500, fontSize: "20px" }}>
        {title}
      </Typography>
      <Typography sx={{ fontWeight: 400, fontSize: "14px" }}>
        {children}
      </Typography>
    </Stack>
  );
}
