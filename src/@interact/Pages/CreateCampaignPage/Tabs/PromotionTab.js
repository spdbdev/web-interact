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
import InfoTooltip from "@interact/Components/InfoTooltip";

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
          <Stack direction="row" alignItems="center">
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Save URL for future campaigns"
            />
            <InfoTooltip title="This will override any past saved URLs, you can only reserve 1 URL at a time." />
          </Stack>
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
                fullWidth
                label="Discord server link"
              />
              <TextField
                variant="outlined"
                fullWidth
                label="Youtube server link"
              />
              <TextField
                variant="outlined"
                fullWidth
                label="Twitch server link"
              />
              <TextField variant="outlined" fullWidth label="Subreddit link" />
            </Stack>
            <Stack spacing={2} flex={1} justifyContent="space-between">
              <TextField
                variant="outlined"
                fullWidth
                label="Twitter profile link"
              />
              <TextField
                variant="outlined"
                fullWidth
                label="Facebook page link"
              />
              <TextField
                variant="outlined"
                fullWidth
                label="Instagram page link"
              />
              <TextField
                variant="outlined"
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
