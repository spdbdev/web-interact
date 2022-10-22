import React, { useEffect, useState } from "react";
import { OutlinedInput, Stack, TextField, Typography } from "@mui/material";
import CreateCampaignItemWrapper from "../CreateCampaignItemWrapper";
import TitleAndDesc from "../CampaignTitleAndDesc";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { SchedulingSlider } from "../Sliders";
import Span from "@jumbo/shared/Span";

export default function SchedulingTab() {
  const [startDateTime, setStartDateTime] = useState(moment());
  const [endDateTime, setEndDateTime] = useState(moment());
  const [campaignDurationDays, setCampaignDurationDays] = useState(0);

  useEffect(() => {
    //calculate days from start and end dates
    const durationDiff = endDateTime.diff(startDateTime, "days");
    setCampaignDurationDays(durationDiff);
  }, [startDateTime, endDateTime]);

  useEffect(() => {
    //calculate new end date from duration
    const newEndDate = moment(startDateTime).add(campaignDurationDays, "days");
    setEndDateTime(newEndDate);
  }, [campaignDurationDays]);

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
              minDateTime={moment()}
            />
            <Stack direction="row" alignItems="center" spacing={2}>
              <OutlinedInput
                sx={{ width: 100 }}
                type="number"
                style={{ height: 50 }}
                value={campaignDurationDays}
                defaultValue={10}
                onChange={(e) => {
                  // prevent values less than 0 or higher than 20.
                  e.target.value < 0
                    ? (e.target.value = 0)
                    : e.target.value > 20
                    ? (e.target.value = 20)
                    : setCampaignDurationDays(e.target.value);
                }}
              />
              <Typography sx={{ fontSize: 16 }}>days</Typography>
            </Stack>

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
          for X weeks after the campaign ends. <br /> <br />
          Too many weeks = some fans will have to wait a long time, but too few
          weeks = more interactions to complete every week. Recommended: 10
          weeks.
        </TitleAndDesc>
        <Stack sx={{ width: 300 }} spacing={3}>
          <SchedulingSlider />
          <Typography sx={{ fontSize: 12 }}>
            Interactions will be available from{" "}
            <Span sx={{ fontWeight: 500 }}>10/28/22 at 12:00 AM</Span> until{" "}
            <Span sx={{ fontWeight: 500 }}>01/06/23 at 12:00 AM</Span>.
          </Typography>
        </Stack>
      </CreateCampaignItemWrapper>
    </>
  );
}
