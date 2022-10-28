import React from "react";
import { Container, Stack, Typography } from "@mui/material";
import FAQAccordian from "../FAQAccordian";

export default function FAQTab({ data, setData }) {
  return (
    <>
      <Stack direction="column" alignItems="center" spacing={4}>
        <Typography variant="h2" sx={{ fontWeight: 500 }}>
          Your campaign FAQ will look like this:
        </Typography>
        <FAQAccordian data={data} setData={setData} />
      </Stack>
    </>
  );
}
