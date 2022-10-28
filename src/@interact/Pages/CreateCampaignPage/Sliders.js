import { Box, Slider } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";

export function SchedulingSlider({ endDateTime, setData }) {
  const [interactionWindowDuration, setInteractionWindowDuration] =
    useState(10);

  useEffect(() => {
    handleInteractionWindowChange(null, interactionWindowDuration);
  }, [endDateTime]);

  function handleInteractionWindowChange(event, newValue) {
    setInteractionWindowDuration(newValue);

    const interactionWindowEndDate = moment(endDateTime).add(newValue, "weeks");
    setData({
      interactionEndDateTime: moment(interactionWindowEndDate).unix(),
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

export function InteractionAvailabilitySlider() {
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
      defaultValue={5}
      valueLabelDisplay="auto"
      step={1}
      marks={marks}
      min={1}
      max={10}
    />
  );
}

export function InteractionDurationsSlider() {
  const [interactionDurations, setInteractionDurations] = useState([30, 60]);

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
    const minDistance = 30;

    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setInteractionDurations([
        Math.min(newValue[0], interactionDurations[1] - minDistance),
        interactionDurations[1],
      ]);
    } else {
      setInteractionDurations([
        interactionDurations[0],
        Math.max(newValue[1], interactionDurations[0] + minDistance),
      ]);
    }
  };

  // NOTE: the slider handling below is pretty finicky. don't recommend using
  //   const handleInteractionDurationChange = (event, newValue, activeThumb) => {
  //     console.log(newValue[0]);
  //     const minDistance = newValue[0];

  //     if (!Array.isArray(newValue)) {
  //       return;
  //     }

  //     if (newValue[1] - newValue[0] < minDistance) {
  //       if (activeThumb === 0) {
  //         const clamped = Math.min(newValue[0], 100 - minDistance);
  //         setInteractionDurations([clamped, clamped + minDistance]);
  //       } else {
  //         const clamped = Math.max(newValue[1], minDistance);
  //         setInteractionDurations([clamped - minDistance, clamped]);
  //       }
  //     } else {
  //       setInteractionDurations(newValue);
  //     }
  //   };

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        getAriaLabel={() => "Minimum distance shift"}
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
