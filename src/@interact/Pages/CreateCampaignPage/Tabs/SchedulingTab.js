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
  const [interactionWindowDuration, setInteractionWindowDuration] = useState(
    data?.interactionWindow
  );

  function handleSchedulingChanges({
    start,
    end,
    duration,
    windowDuration,
    action,
  }) {
    let durationDiff = null;
    let newEndDate = null;
    let interactionWindowEndDate = null;

    if (action == "updateStart") {
      //calculate days from start and end dates
      durationDiff = end?.diff(start, "days");
      const startTimestampValue = moment(start).unix();
      setData({
        durationDays: durationDiff,
        startDateTime: startTimestampValue,
      });

      setStartDateTime(start);
      setCampaignDurationDays(durationDiff);
    }

    if (action == "updateEnd") {
      //calculate days from start and end dates
      durationDiff = end?.diff(start, "days");

      const endTimestampValue = moment(end).unix();

      // calculate end date from interaction window
      interactionWindowEndDate = moment(end).add(windowDuration, "weeks");
      const interactionTimestampValue = moment(interactionWindowEndDate).unix();

      setData({
        durationDays: durationDiff,
        endDateTime: endTimestampValue,
        interactionEndDateTime: interactionTimestampValue,
      });

      setCampaignDurationDays(durationDiff);
      setEndDateTime(end);
    }

    if (action == "updateDuration") {
      //calculate new end date from duration
      newEndDate = moment(start)?.add(duration, "days");

      // calculate end date from interaction window
      interactionWindowEndDate = moment(newEndDate).add(
        windowDuration,
        "weeks"
      );

      const endTimestampValue = moment(newEndDate).unix();
      const interactionTimestampValue = moment(interactionWindowEndDate).unix();

      setData({
        durationDays: duration,
        endDateTime: endTimestampValue,
        interactionEndDateTime: interactionTimestampValue,
      });

      setCampaignDurationDays(duration);
      setEndDateTime(newEndDate);
    }

    if (action == "updateWindow") {
      // calculate end date from interaction window
      interactionWindowEndDate = moment(end).add(windowDuration, "weeks");
      const interactionTimestampValue = moment(interactionWindowEndDate).unix();

      setData({
        interactionWindow: windowDuration,
        interactionEndDateTime: interactionTimestampValue,
      });

      setInteractionWindowDuration(windowDuration);
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
              onChange={(newValue) =>
                handleSchedulingChanges({
                  start: newValue,
                  end: endDateTime,
                  action: "updateStart",
                })
              }
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
                onChange={(e) => {
                  // prevent values less than 0 or higher than 20.
                  if (e.target.value < 0) {
                    setCampaignDurationDays(0);
                  } else if (e.target.value > 20) {
                    setCampaignDurationDays(20);
                  } else {
                    handleSchedulingChanges({
                      duration: e.target.value,
                      start: startDateTime,
                      end: endDateTime,
                      windowDuration: interactionWindowDuration,
                      action: "updateDuration",
                    });
                  }
                }}
              />
              <Typography sx={{ fontSize: 16 }}>days</Typography>
            </Stack>

            <DateTimePicker
              label="End date & time"
              InputProps={{ sx: { width: 300 } }}
              value={endDateTime}
              onChange={(newValue) =>
                handleSchedulingChanges({
                  start: startDateTime,
                  end: newValue,
                  windowDuration: interactionWindowDuration,
                  action: "updateEnd",
                })
              }
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
          <SchedulingSlider
            interactionWindowDuration={interactionWindowDuration}
            handleSchedulingChanges={handleSchedulingChanges}
            endDateTime={endDateTime}
          />
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
