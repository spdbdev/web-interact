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

export default function InteractionTab() {
  const [numAuctionInteractions, setNumAuctionInteractions] = useState(0);
  const [numGiveawayInteractions, setNumGiveawayInteractions] = useState(0);
  const [auctionMinBidPrice, setAuctionMinBidPrice] = useState(0);
  const [VIPEntryCost, setVIPEntryCost] = useState(0);

  return (
    <>
      <CreateCampaignItemWrapper>
        <TitleAndDesc title="Availability">
          How much time per week would you like to spend interacting with fans?
          <br />
          <br />
          How much time should each interaction take?
        </TitleAndDesc>
        <Stack spacing={4} sx={{ width: 300, mt: 4 }}>
          <InteractionAvailabilitySlider />
          <InteractionDurationsSlider />
        </Stack>
      </CreateCampaignItemWrapper>
      <CreateCampaignItemWrapper>
        <TitleAndDescFullWidth title="Auction">
          I'd like to auction{" "}
          <FormControl>
            <OutlinedInput
              type="number"
              sx={{ mx: 2, mt: 2 }}
              value={numAuctionInteractions}
              onChange={(e) => {
                e.target.value < 0
                  ? (e.target.value = 0)
                  : setNumAuctionInteractions(e.target.value);
              }}
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
              sx={{ mx: 2, mt: 2 }}
              value={auctionMinBidPrice}
              onChange={(e) => setAuctionMinBidPrice(e.target.value)}
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
              sx={{ mx: 2, mt: 2 }}
              value={numGiveawayInteractions}
              onChange={(e) => {
                e.target.value < 0
                  ? (e.target.value = 0)
                  : setNumGiveawayInteractions(e.target.value);
              }}
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
              sx={{ mx: 2, mt: 2 }}
              value={VIPEntryCost}
              onChange={(e) => setVIPEntryCost(e.target.value)}
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
          mt: 6,
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
          With an average of <Span sx={{ fontWeight: 600 }}>5 hrs/week</Span>,
          you can get to know <Span sx={{ fontWeight: 600 }}>97 fans</Span>{" "}
          personally over the period of{" "}
          <Span sx={{ fontWeight: 600 }}>Oct. 28, 2022</Span> to{" "}
          <Span sx={{ fontWeight: 600 }}>Jan. 06, 2023</Span>.{" "}
          <Span sx={{ color: "primary.light", fontSize: 14 }}>
            (94 x 30 min interactions and 3 x 60 min interactions)
          </Span>
        </Typography>
      </Stack>
    </>
  );
}
