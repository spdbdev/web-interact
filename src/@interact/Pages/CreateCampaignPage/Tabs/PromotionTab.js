import React from "react";
import {
  Checkbox,
  Container,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CreateCampaignItemWrapper from "../CreateCampaignItemWrapper";
import TitleAndDesc, { TitleAndDescFullWidth } from "../CampaignTitleAndDesc";

export default function PromotionTab() {
  return (
    <>
      <CreateCampaignItemWrapper>
        <TitleAndDesc title="Campaign URL">
          Select a URL for this campaign.
          <br />
          <br />
          Note that this URL won't be reserved until you finish the campaign
          creation.
        </TitleAndDesc>
        <Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h3">www.interact.vip /</Typography>
            <TextField
              variant="outlined"
              inputProps={{ maxLength: 40 }}
              placeholder={`cricket-challenge`}
              helperText="3 to 30 characters."
            />
          </Stack>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Save URL for future campaigns"
          />
        </Stack>
      </CreateCampaignItemWrapper>
      <CreateCampaignItemWrapper>
        <TitleAndDescFullWidth title="Social Links">
          <Stack
            direction="row"
            spacing={4}
            justifyContent="space-between"
            flex={1}
            width="100%"
          >
            <Stack spacing={2} flex={1} justifyContent="space-between">
              <TextField
                variant="outlined"
                inputProps={{ maxLength: 40 }}
                fullWidth
                label="Discord server link"
              />
              <TextField
                variant="outlined"
                inputProps={{ maxLength: 40 }}
                fullWidth
                label="Youtube server link"
              />
              <TextField
                variant="outlined"
                inputProps={{ maxLength: 40 }}
                fullWidth
                label="Twitch server link"
              />
              <TextField
                variant="outlined"
                inputProps={{ maxLength: 40 }}
                fullWidth
                label="Subreddit link"
              />
            </Stack>
            <Stack spacing={2} flex={1} justifyContent="space-between">
              <TextField
                variant="outlined"
                inputProps={{ maxLength: 40 }}
                fullWidth
                label="Twitter profile link"
              />
              <TextField
                variant="outlined"
                inputProps={{ maxLength: 40 }}
                fullWidth
                label="Facebook page link"
              />
              <TextField
                variant="outlined"
                inputProps={{ maxLength: 40 }}
                fullWidth
                label="Instagram page link"
              />
              <TextField
                variant="outlined"
                inputProps={{ maxLength: 40 }}
                fullWidth
                label="TikTok profile link"
              />
            </Stack>
          </Stack>
        </TitleAndDescFullWidth>
      </CreateCampaignItemWrapper>
    </>
  );
}
