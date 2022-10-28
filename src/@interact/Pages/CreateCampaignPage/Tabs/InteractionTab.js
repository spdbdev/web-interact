import React, { useState } from "react";
import {
  Box,
  Container,
  FormControl,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
  Slider,
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
  addTrailingZeros,
  getDateFromTimestamp,
} from "@interact/Components/utils";

export default function InteractionTab({ data, setData }) {
  const [numAuctionInteractions, setNumAuctionInteractions] = useState(
    data?.numAuctionInteractions
  );
  const [numGiveawayInteractions, setNumGiveawayInteractions] = useState(
    data?.numGiveawayInteractions
  );
  const [auctionMinBidPrice, setAuctionMinBidPrice] = useState(
    data?.auctionMinBid
  );
  const [VIPEntryCost, setVIPEntryCost] = useState(data?.giveawayVIPEntryCost);

  function handleNumAuction(e) {
    if (e.target.value < 3) {
      setNumAuctionInteractions(3);
    } else {
      setNumAuctionInteractions(Number(e.target.value));
      setData({ numAuctionInteractions: Number(e.target.value) });
    }
  }

  function handleNumGiveaway(e) {
    if (e.target.value < 0) {
      setNumGiveawayInteractions(0);
    } else {
      setNumGiveawayInteractions(Number(e.target.value));
      setData({ numGiveawayInteractions: Number(e.target.value) });
    }
  }

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
          <FormControl>
            <OutlinedInput
              type="number"
              sx={{ mx: 2, height: "40px" }}
              value={numAuctionInteractions}
              onChange={(e) => handleNumAuction(e)}
            />
            <FormHelperText sx={{ ml: 3 }}>Min. 3 interactions</FormHelperText>
          </FormControl>
          interactions, with a minimum bid price of
          <FormControl>
            <OutlinedInput
              type="number"
              inputProps={{ step: ".50" }}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              sx={{ mx: 2, height: "40px" }}
              value={auctionMinBidPrice}
              onChange={(e) => {
                setAuctionMinBidPrice(Number(e.target.value));
                setData({ auctionMinBid: Number(e.target.value) });
              }}
            />
            <FormHelperText sx={{ ml: 3 }}>
              $0.50 increments. Min. $1.50
            </FormHelperText>
          </FormControl>
        </TitleAndDescFullWidth>
      </CreateCampaignItemWrapper>
      <CreateCampaignItemWrapper>
        <TitleAndDescFullWidth
          title="Giveaway"
          tooltipText="Fans can select either a free entry or a paid VIP entry where their chance of winning is increased by 25x."
        >
          I'd like to include{" "}
          <FormControl>
            <OutlinedInput
              type="number"
              sx={{ mx: 2, height: "40px" }}
              value={numGiveawayInteractions}
              onChange={(e) => handleNumGiveaway(e)}
            />{" "}
            <FormHelperText sx={{ ml: 3 }}> </FormHelperText>
          </FormControl>
          interactions in the giveaway, where a VIP entry costs
          <FormControl>
            <OutlinedInput
              type="number"
              inputProps={{ step: ".50" }}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              sx={{ mx: 2, height: "40px" }}
              value={VIPEntryCost}
              onChange={(e) => {
                setVIPEntryCost(Number(e.target.value));
                setData({ giveawayVIPEntryCost: Number(e.target.value) });
              }}
            />
            <FormHelperText sx={{ ml: 3 }}>
              $0.50 increments. Min. $1.50
            </FormHelperText>
          </FormControl>
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
          sx={{ color: "primary.main", fontWeight: 400, fontSize: 18 }}
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
            {getDateFromTimestamp({ timestamp: data?.endDateTime })}
          </Span>{" "}
          to{" "}
          <Span sx={{ fontWeight: 600 }}>
            {getDateFromTimestamp({ timestamp: data?.interactionEndDateTime })}
          </Span>
          .{" "}
          <Span sx={{ color: "primary.light", fontSize: 14 }}>
            ({getNumStdLengthInteractions()} x {data?.interactionDurationTime}{" "}
            min interactions and 3 x {data?.interactionTopDurationTime} min
            interactions)
          </Span>
        </Typography>
      </Stack>
    </>
  );
}
