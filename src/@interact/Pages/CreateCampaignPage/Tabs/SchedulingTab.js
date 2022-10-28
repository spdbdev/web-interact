import React, { useEffect, useState } from "react";
import { OutlinedInput, Stack, TextField, Typography } from "@mui/material";
import CreateCampaignItemWrapper from "../CreateCampaignItemWrapper";
import TitleAndDesc from "../CampaignTitleAndDesc";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment, { duration } from "moment";
import { SchedulingSlider } from "../Sliders";
import Span from "@jumbo/shared/Span";
import {
  formatMomentDate,
  getDateFromTimestamp,
} from "../../../Components/utils.js";

export default function SchedulingTab({ data, setData }) {
  const [startDateTime, setStartDateTime] = useState(
    moment.unix(data?.startDateTime) || moment() // convert existing timestamp value to moment if it exists, if not, create new moment
  ); //    moment.unix(data?.startDateTime)
  const [endDateTime, setEndDateTime] = useState(
    moment.unix(data?.endDateTime) || moment() // convert existing timestamp value to moment if it exists, if not, create new moment
  ); //moment.unix(data?.endDateTime)
  const [campaignDurationDays, setCampaignDurationDays] = useState(
    data?.durationDays
  );

  // useEffect(() => {
  //   const endTimestampValue = moment(endDateTime).unix();
  //   const startTimestampValue = moment(startDateTime).unix();

  //   setData({ durationDays: campaignDurationDays });
  //   setData({ endDateTime: endTimestampValue });
  //   setData({ startDateTime: startTimestampValue });
  // }, [endDateTime, startDateTime, campaignDurationDays]);

  function updateDurationDays({ start, end }) {
    //calculate days from start and end dates
    const durationDiff = end?.diff(start, "days");
    setCampaignDurationDays(durationDiff);
    setData({ durationDays: durationDiff });
  }

  function updateEndDateTime(newDurationDays) {
    //calculate new end date from duration
    const newEndDate = moment(startDateTime)?.add(newDurationDays, "days");
    setEndDateTime(newEndDate);

    const endTimestampValue = moment(newEndDate).unix(); // convert moment to timestamp for storing in DB
    setData({ endDateTime: endTimestampValue }); // set value in DB
  }

  function handleStartDateChange(newValue) {
    setStartDateTime(newValue); // set local state
    updateDurationDays({ end: endDateTime, start: newValue }); // update duration days based on new start date

    const startTimestampValue = moment(newValue).unix(); // convert moment to timestamp for storing in DB
    setData({ startDateTime: startTimestampValue }); // set value in DB
    setData({ durationDays: campaignDurationDays }); // set value in DB, needs to be updated here
  }

  function handleEndDateChange(newValue) {
    setEndDateTime(newValue); // set local state
    updateDurationDays({ end: newValue, start: startDateTime }); // update duration days based on new end date

    const endTimestampValue = moment(newValue).unix(); // convert moment to timestamp for storing in DB
    setData({
      endDateTime: endTimestampValue,
      durationDays: campaignDurationDays,
    }); // set value in DB
    // setData({ durationDays: campaignDurationDays }); // set value in DB, needs to be updated here
  }

  function handleDurationDaysChange(e) {
    // prevent values less than 0 or higher than 20.
    if (e.target.value < 0) {
      setCampaignDurationDays(0);
    } else if (e.target.value > 20) {
      setCampaignDurationDays(20);
    } else {
      setCampaignDurationDays(e.target.value); // set local state
      updateEndDateTime(e.target.value); // update end date based on new duration
      setData({ durationDays: e.target.value }); // set value in DB
    }
  }

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
          {/* need this to use DateTimePicker. Date library used here is moment.js */}
          <Stack direction="column" alignItems="center" spacing={3}>
            <DateTimePicker
              label="Start date & time"
              InputProps={{ sx: { width: 300 } }}
              value={startDateTime}
              onChange={(newValue) => handleStartDateChange(newValue)}
              renderInput={(params) => <TextField {...params} />}
              minDateTime={moment()} // min date is current date/time
              minutesStep={15}
            />
            <Stack direction="row" alignItems="center" spacing={2}>
              <OutlinedInput
                sx={{ width: 100 }}
                type="number"
                style={{ height: 50 }}
                value={campaignDurationDays}
                onChange={(e) => handleDurationDaysChange(e)}
                on
              />
              <Typography sx={{ fontSize: 16 }}>days</Typography>
            </Stack>

            <DateTimePicker
              label="End date & time"
              InputProps={{ sx: { width: 300 } }}
              value={endDateTime}
              onChange={(newValue) => handleEndDateChange(newValue)}
              renderInput={(params) => <TextField {...params} />}
              minDateTime={moment()} // min date is current date/time
              minutesStep={15}
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
          <SchedulingSlider setData={setData} endDateTime={endDateTime} />
          <Typography sx={{ fontSize: 12 }}>
            Interactions will be available from{" "}
            <Span sx={{ fontWeight: 500 }}>
              {formatMomentDate({ date: endDateTime })}
            </Span>{" "}
            until{" "}
            <Span sx={{ fontWeight: 500 }}>
              {getDateFromTimestamp({
                timestamp: data?.interactionEndDateTime,
              })}
            </Span>
            .
          </Typography>
        </Stack>
      </CreateCampaignItemWrapper>
    </>
  );
}
