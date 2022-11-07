import "./CampaignPage.css";
import { InfoCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  OutlinedInput,
  InputAdornment,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import moment from "moment";
import { getDateFromTimestamp } from "@interact/Components/utils";
import Span from "@jumbo/shared/Span";

export default function Header({ campaignData }) {
  const numInteractions =
    campaignData?.numBidSlots + campaignData?.numRaffleSlots;

  return (
    // "50 interactions will be carried out from Aug 8th 2022 to Oct 3rd 2022, don't miss out!"
    // "Campaign ends at 8:00 pm EST on Aug 5th 2022"
    // "Ends in X days" or "Ends in X hours" or "Ends in X minutes"

    <div className="Description">
      <Typography
        variant="h3"
        py={0}
        mb={0}
        style={{ fontSize: 30, fontWeight: 400 }}
      >
        Game &#38; Chat with{" "}
        <span style={{ color: "#782eee" }}>Pattedevelours</span> 1-on-1
      </Typography>
      <Typography sx={{ color: "text.secondary", fontSize: 18 }}>
        {campaignData?.header?.tagline1}
      </Typography>
      <Divider />
      <Stack direction="column">
        <Typography py={0}>
          <Span>
            {numInteractions} interactions will be carried out from{" "}
            {getDateFromTimestamp({
              timestamp: campaignData?.startDate?.seconds,
            })}{" "}
            to{" "}
            {getDateFromTimestamp({
              timestamp: campaignData?.endDate?.seconds,
            })}
            , don't miss out!
          </Span>
          <br />
          <Span>
            Campaign ends at{" "}
            {getDateFromTimestamp({
              timestamp: campaignData?.endDate?.seconds,
              format: " h:mm a [on] dddd, MMMM Do YYYY",
            })}
          </Span>
        </Typography>
      </Stack>
      <br />
      <Box
        sx={{
          background: "linear-gradient(173.73deg, #782FEE, #DD00FF 117.43%)",
          borderRadius: 2,
          px: 2,
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          m={0}
          p={0}
          sx={{ color: "secondary.contrastText" }}
        >
          Ends {moment.unix(campaignData?.endDate?.seconds).toNow()}
        </Typography>
      </Box>
    </div>
  );
}
