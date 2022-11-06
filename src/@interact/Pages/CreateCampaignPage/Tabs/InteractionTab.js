import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  FormControl,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import CreateCampaignItemWrapper from "../CreateCampaignItemWrapper";
import TitleAndDesc, { TitleAndDescFullWidth } from "../CampaignTitleAndDesc";
import {
  InteractionAvailabilitySlider,
  InteractionDurationsSlider,
} from "../Sliders";
import Span from "@jumbo/shared/Span";
import InteractionIcon from "../../../Images/interaction-icon.png";
import {
  addTrailingZerosToDollarValue,
  getDateFromTimestamp,
} from "@interact/Components/utils";
import { useFormValidation } from "@interact/Hooks/use-form-validation";
import { TabNavigation } from "../TabNavigation";

export default function InteractionTab({
  data,
  setData,
  selectedTabIndex,
  setSelectedTabIndex,
}) {
  const [numAuctionInteractions, setNumAuctionInteractions] = useState(
    data?.numAuctionInteractions
  );
  const [numGiveawayInteractions, setNumGiveawayInteractions] = useState(
    data?.numGiveawayInteractions
  );

  const [auctionMinBidPrice, setAuctionMinBidPrice] = useState(
    addTrailingZerosToDollarValue(data?.auctionMinBid)
  );
  const [VIPEntryCost, setVIPEntryCost] = useState(
    addTrailingZerosToDollarValue(data?.giveawayVIPEntryCost)
  );

  const isTabValidated = useFormValidation({
    selectedTabIndex,
    lastCompletedTabIndex: data?.lastCompletedTabIndex,
    setData,
    formValidationConditions: true, //due to the setup of this form inputs, it will always be valid
  });

  function getNumStdLengthInteractions() {
    const numStdLengthInteractions =
      numGiveawayInteractions + (numAuctionInteractions - 3); // interactions that take up std. time
    return numStdLengthInteractions;
  }

  return (
    <>
      <CreateCampaignItemWrapper>
        <TitleAndDesc title="Availability">
          How much time per week would you like to spend interacting with fans?
          <br />
          <br />
          How much time should each interaction take?
        </TitleAndDesc>
        <Stack spacing={3} sx={{ width: 300, pt: 4 }}>
          <InteractionAvailabilitySlider data={data} setData={setData} />
          <InteractionDurationsSlider data={data} setData={setData} />
        </Stack>
      </CreateCampaignItemWrapper>
      <CreateCampaignItemWrapper>
        <TitleAndDescFullWidth title="Auction">
          I'd like to auction{" "}
          <NumInteractionsInput
            value={numAuctionInteractions}
            setValue={setNumAuctionInteractions}
            setData={setData}
            dataField={"numAuctionInteractions"}
            minValue={3}
            helpText={"Min. 3 interactions"}
          />
          interactions, with a minimum bid price of
          <BidInput
            value={auctionMinBidPrice}
            setValue={setAuctionMinBidPrice}
            setData={setData}
            dataField={"auctionMinBid"}
          />
        </TitleAndDescFullWidth>
      </CreateCampaignItemWrapper>
      <CreateCampaignItemWrapper>
        <TitleAndDescFullWidth
          title="Giveaway"
          tooltipText="Fans can select either a free entry or a paid VIP entry where their chance of winning is increased by 25x."
        >
          I'd like to include{" "}
          <NumInteractionsInput
            value={numGiveawayInteractions}
            setValue={setNumGiveawayInteractions}
            setData={setData}
            dataField={"numGiveawayInteractions"}
            minValue={0}
          />
          interactions in the giveaway, where a VIP entry costs
          <BidInput
            value={VIPEntryCost}
            setValue={setVIPEntryCost}
            setData={setData}
            dataField={"giveawayVIPEntryCost"}
          />
        </TitleAndDescFullWidth>
      </CreateCampaignItemWrapper>
      <Stack
        direction="row"
        alignItems="center"
        spacing={4}
        sx={{
          background: "rgba(120, 47, 238, 0.1)",
          p: 3,
          borderRadius: 3,
          boxShadow: "0px 0px 20px rgba(120, 47, 238, 0.15)",
        }}
      >
        <img alt="interaction-icon" src={InteractionIcon} width={60} />
        <Typography
          sx={{
            color: "primary.main",
            fontWeight: 400,
            fontSize: 18,
          }}
        >
          With an average of{" "}
          <Span sx={{ fontWeight: 600 }}>
            {data?.creatorWeeklyAvailability} hrs/week
          </Span>
          , you can get to know{" "}
          <Span sx={{ fontWeight: 600 }}>
            {data?.numAuctionInteractions + data?.numGiveawayInteractions} fans
          </Span>{" "}
          personally over the period of{" "}
          <Span sx={{ fontWeight: 600 }}>
            {getDateFromTimestamp({ timestamp: data?.endDateTime?.seconds })}
          </Span>{" "}
          to{" "}
          <Span sx={{ fontWeight: 600 }}>
            {getDateFromTimestamp({
              timestamp: data?.interactionEndDateTime?.seconds,
            })}
          </Span>
          .{" "}
          <Span sx={{ color: "primary.light", fontSize: 14 }}>
            ({getNumStdLengthInteractions()} x {data?.interactionDurationTime}{" "}
            min interactions and 3 x {data?.interactionTopDurationTime} min
            interactions)
          </Span>
        </Typography>
      </Stack>
      <TabNavigation
        disableNext={!isTabValidated}
        selectedTabIndex={selectedTabIndex}
        setSelectedTabIndex={setSelectedTabIndex}
      />
    </>
  );
}

function BidInput({ value, setValue, setData, dataField }) {
  // These are currently the same for both auctions and giveaway. If they change,
  // pass these values in through props instead.
  const increment = 0.5;
  const minValue = 1.5;

  // Used to update this components value as it changes,
  // while still allowing for true validation on blur
  // If not valid, default to the last setValue
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  function validate(nextValue) {
    function isValidIncrement(nextIncrement) {
      if (nextIncrement % increment === 0) {
        return true;
      } else {
        return false;
      }
    }

    return (
      typeof nextValue === "number" &&
      !isNaN(nextValue) &&
      nextValue >= minValue &&
      isValidIncrement(nextValue)
    );
  }

  function handleBid(e) {
    const nextValue = Number(e.target.value);
    const isValid = validate(nextValue);
    if (isValid) {
      setValue(addTrailingZerosToDollarValue(nextValue));
      setData({ [dataField]: nextValue });
    } else {
      setTempValue(addTrailingZerosToDollarValue(minValue));
    }
  }

  return (
    <FormControl>
      <OutlinedInput
        type="number"
        inputProps={{ step: ".50" }}
        startAdornment={<InputAdornment position="start">$</InputAdornment>}
        sx={{ mx: 2, height: "40px" }}
        value={tempValue}
        onChange={(e) => {
          if (e.nativeEvent.inputType == "insertReplacementText") {
            // handles stepUp/arrowUp and stepDown/arrowDown
            // without this, it's possible to step above or below the min/max values
            setTempValue(e.target.value);
            handleBid(e);
          } else {
            setTempValue(e.target.value);
          }
        }}
        onBlur={(e) => handleBid(e)}
      />
      <FormHelperText sx={{ ml: 3 }}>
        $0.50 increments. Min. $1.50
      </FormHelperText>
    </FormControl>
  );
}

function NumInteractionsInput({
  value,
  setValue,
  setData,
  dataField,
  minValue = 0,
  helpText = " ",
}) {
  // Used to update this components value as it changes,
  // while still allowing for true validation on blur
  // If not valid, default to the last setValue
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  function validate(nextValue) {
    return (
      typeof nextValue === "number" &&
      !isNaN(nextValue) &&
      nextValue >= minValue
    );
  }

  function handleInteraction(e) {
    const nextValue = Number(e.target.value);
    const isValid = validate(nextValue);
    if (isValid) {
      setValue(nextValue);
      setData({ [dataField]: nextValue });
    } else {
      setTempValue(minValue);
    }
  }

  return (
    <FormControl>
      <OutlinedInput
        type="number"
        sx={{ mx: 2, height: "40px" }}
        value={tempValue}
        onChange={(e) => {
          if (e.nativeEvent.inputType == "insertReplacementText") {
            // handles stepUp/arrowUp and stepDown/arrowDown
            // without this, it's possible to step above or below the min/max values
            setTempValue(e.target.value);
            handleInteraction(e);
          } else {
            setTempValue(e.target.value);
          }
        }}
        onBlur={(e) => handleInteraction(e)}
      />{" "}
      <FormHelperText sx={{ ml: 3 }}>{helpText}</FormHelperText>
    </FormControl>
  );
}
