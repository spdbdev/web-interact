import { Box, Slider } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";

export function SchedulingSlider({
  interactionWindowDuration,
  handleSchedulingChanges,
  endDateTime,
}) {
  function handleInteractionWindowChange(event, newValue) {
    handleSchedulingChanges({
      windowDuration: newValue,
      end: endDateTime,
      action: "updateWindow",
    });
  }

  const marks = [
    {
      value: 2,
      label: "2 weeks",
    },
    {
      value: 20,
      label: "20 weeks",
    },
  ];

  return (
    <Slider
      value={interactionWindowDuration}
      onChangeCommitted={handleInteractionWindowChange}
      valueLabelDisplay="auto"
      step={1}
      marks={marks}
      min={2}
      max={20}
    />
  );
}

export function InteractionAvailabilitySlider({ data, setData }) {
  const [interactionAvailability, setInteractionAvailability] = useState(
    data?.creatorWeeklyAvailability
  );

  function handleInteractionAvailabilityChange(event, newValue) {
    setInteractionAvailability(newValue);
    setData({ creatorWeeklyAvailability: newValue });
  }

  const marks = [
    {
      value: 1,
      label: "1 hour",
    },
    {
      value: 10,
      label: "10 hours",
    },
  ];

  return (
    <Slider
      value={interactionAvailability}
      valueLabelDisplay="auto"
      onChangeCommitted={handleInteractionAvailabilityChange}
      step={1}
      marks={marks}
      min={1}
      max={10}
    />
  );
}

export function InteractionDurationsSlider({ data, setData }) {
  const [interactionDurations, setInteractionDurations] = useState([
    data?.interactionDurationTime,
    data?.interactionTopDurationTime,
  ]);

  const marks = [
    {
      value: 15,
      label: "15 min",
    },
    {
      value: 150,
      label: "150 min",
    },
  ];

  const handleInteractionDurationChange = (event, newValue, activeThumb) => {
    let newMinValue = 0;
    let newMaxValue = 0;
    const minDistance = 30; // this needs to be 2 x min value

    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      // activeThumb === 0 means the min slider
      newMinValue = Math.min(
        newValue[0],
        interactionDurations[1] - minDistance
      );
      setInteractionDurations([newMinValue, interactionDurations[1]]);
      setData({
        interactionDurationTime: newMinValue,
        interactionTopDurationTime: interactionDurations[1],
      });
    } else {
      newMaxValue = Math.max(
        newValue[1],
        interactionDurations[0] + minDistance
      );
      setInteractionDurations([interactionDurations[0], newMaxValue]);
      setData({
        interactionDurationTime: interactionDurations[0],
        interactionTopDurationTime: newMaxValue,
      });
    }
  };

  // NOTE: the slider handling below is pretty finicky. don't recommend using
  // const handleInteractionDurationChange = (event, newValue, activeThumb) => {
  //   console.log(newValue[0]);
  //   const minDistance = newValue[0];

  //   if (!Array.isArray(newValue)) {
  //     return;
  //   }

  //   if (newValue[1] - newValue[0] < minDistance) {
  //     if (activeThumb === 0) {
  //       const clamped = Math.min(newValue[0], 100 - minDistance);
  //       setInteractionDurations([clamped, clamped + minDistance]);
  //     } else {
  //       const clamped = Math.max(newValue[1], minDistance);
  //       setInteractionDurations([clamped - minDistance, clamped]);
  //     }
  //   } else {
  //     setInteractionDurations(newValue);
  //   }
  // };

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        max={150}
        min={15}
        marks={marks}
        value={interactionDurations}
        onChange={handleInteractionDurationChange}
        valueLabelDisplay="auto"
        disableSwap
      />
    </Box>
  );
}
