import React, { useState } from "react";
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

export default function PromotionTab({ data, setData }) {
  const [discord, setDiscord] = useState(data?.socials.discord);
  const [youtube, setYoutube] = useState(data?.socials.youtube);
  const [twitch, setTwitch] = useState(data?.socials.twitch);
  const [reddit, setReddit] = useState(data?.socials.reddit);
  const [twitter, setTwitter] = useState(data?.socials.twitter);
  const [facebook, setFacebook] = useState(data?.socials.facebook);
  const [instagram, setInstagram] = useState(data?.socials.instagram);
  const [tiktok, setTiktok] = useState(data?.socials.tiktok);
  const [URL, setURL] = useState(data?.customURL);
  const [shouldSaveURL, setShouldSaveURL] = useState(false);

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
              value={URL}
              onChange={(e) => {
                setURL(e.target.value);
                setData({
                  customURL: e.target.value,
                });
              }}
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  checked={shouldSaveURL}
                  onChange={() => setShouldSaveURL(!shouldSaveURL)}
                />
              }
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
                value={discord}
                onChange={(e) => {
                  setDiscord(e.target.value);
                  setData({
                    socials: { discord: e.target.value, ...data?.socials },
                  });
                }}
              />
              <TextField
                variant="outlined"
                fullWidth
                label="Youtube server link"
                value={youtube}
                onChange={(e) => {
                  setYoutube(e.target.value);
                  setData({
                    socials: { youtube: e.target.value, ...data?.socials },
                  });
                }}
              />
              <TextField
                variant="outlined"
                fullWidth
                label="Twitch server link"
                value={twitch}
                onChange={(e) => {
                  setTwitch(e.target.value);
                  setData({
                    socials: { twitch: e.target.value, ...data?.socials },
                  });
                }}
              />
              <TextField
                variant="outlined"
                fullWidth
                label="Subreddit link"
                value={reddit}
                onChange={(e) => {
                  setReddit(e.target.value);
                  setData({
                    socials: { reddit: e.target.value, ...data?.socials },
                  });
                }}
              />
            </Stack>
            <Stack spacing={2} flex={1} justifyContent="space-between">
              <TextField
                variant="outlined"
                fullWidth
                label="Twitter profile link"
                value={twitter}
                onChange={(e) => {
                  setTwitter(e.target.value);
                  setData({
                    socials: { twitter: e.target.value, ...data?.socials },
                  });
                }}
              />
              <TextField
                variant="outlined"
                fullWidth
                label="Facebook page link"
                value={facebook}
                onChange={(e) => {
                  setFacebook(e.target.value);
                  setData({
                    socials: { facebook: e.target.value, ...data?.socials },
                  });
                }}
              />
              <TextField
                variant="outlined"
                fullWidth
                label="Instagram page link"
                value={instagram}
                onChange={(e) => {
                  setInstagram(e.target.value);
                  setData({
                    socials: { instagram: e.target.value, ...data?.socials },
                  });
                }}
              />
              <TextField
                variant="outlined"
                fullWidth
                label="TikTok profile link"
                value={tiktok}
                onChange={(e) => {
                  setTiktok(e.target.value);
                  setData({
                    socials: { tiktok: e.target.value, ...data?.socials },
                  });
                }}
              />
            </Stack>
          </Stack>
        </TitleAndDescFullWidth>
      </CreateCampaignItemWrapper>
    </>
  );
}
