import React, { useState } from "react";
import { OutlinedInput, Stack, TextField } from "@mui/material";
import CreateCampaignItemWrapper from "../CreateCampaignItemWrapper";
import TitleAndDesc from "../CampaignTitleAndDesc";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { SchedulingSlider } from "../Sliders";

export default function SchedulingTab() {
  const [startDateTime, setStartDateTime] = useState(moment().format());
  const [endDateTime, setEndDateTime] = useState(moment().format());
  const [campaignDurationDays, setCampaignDurationDays] = useState(0);

  return (
    <>
      <CreateCampaignItemWrapper>
        <TitleAndDesc title="Campaign Duration">
          Set how long the campaign will be active. Enter a start date & time,
          then duration in days OR the end date & time. <br />
          <br />
          Changing the duration will recalculate the end date, and vice-versa.
          Campaigns can last 5 to 20 days. Recommended duration: 10 days.
        </TitleAndDesc>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Stack direction="column" alignItems="center" spacing={3}>
            <DateTimePicker
              label="Start date & time"
              InputProps={{ sx: { width: 300 } }}
              value={startDateTime}
              onChange={(newValue) => setStartDateTime(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <OutlinedInput
              type="number"
              style={{ height: 50 }}
              value={campaignDurationDays}
              onChange={(newValue) => setCampaignDurationDays(newValue)}
            />
            <DateTimePicker
              label="End date & time"
              InputProps={{ sx: { width: 300 } }}
              value={endDateTime}
              onChange={(newValue) => setEndDateTime(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Stack>
        </LocalizationProvider>
      </CreateCampaignItemWrapper>
      <CreateCampaignItemWrapper>
        <TitleAndDesc title="Interaction Window Duration">
          Choose the number of weeks; interactions will be scheduled with fans
          for X weeks after the campaign ends Too many weeks = some fans will
          have to wait a long time, but too few weeks = more interactions to
          complete every week. Recommended: 10 weeks.
        </TitleAndDesc>
        <Stack sx={{ width: 300 }}>
          <SchedulingSlider />
        </Stack>
      </CreateCampaignItemWrapper>
    </>
  );
}
