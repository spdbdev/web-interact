import React, { useState } from "react";
import {
  Container,
  FormControl,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
  Slider,
  Stack,
} from "@mui/material";
import CreateCampaignItemWrapper from "../CreateCampaignItemWrapper";
import TitleAndDesc, { TitleAndDescFullWidth } from "../CampaignTitleAndDesc";

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
        <Stack spacing={6} sx={{ width: 300, mt: 6 }}>
          <Slider
            defaultValue={10}
            valueLabelDisplay="auto"
            step={1}
            // marks={marks}
            min={2}
            max={20}
          />
          <Slider
            defaultValue={10}
            valueLabelDisplay="auto"
            step={1}
            // marks={marks}
            min={2}
            max={20}
          />
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
    </>
  );
}
