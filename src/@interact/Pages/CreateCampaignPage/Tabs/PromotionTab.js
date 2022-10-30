import React, { useEffect, useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CreateCampaignItemWrapper from "../CreateCampaignItemWrapper";
import TitleAndDesc, { TitleAndDescFullWidth } from "../CampaignTitleAndDesc";
import InfoTooltip from "@interact/Components/InfoTooltip";
import { TabNavigation } from "../TabNavigation";
import { useFormValidation } from "@interact/Hooks/use-form-validation";
import { isValidHttpUrl } from "@interact/Components/utils";

export default function PromotionTab({
  data,
  setData,
  selectedTabIndex,
  setSelectedTabIndex,
}) {
  const [discord, setDiscord] = useState(data?.socials.discord);
  const [youtube, setYoutube] = useState(data?.socials.youtube);
  const [twitch, setTwitch] = useState(data?.socials.twitch);
  const [reddit, setReddit] = useState(data?.socials.reddit);
  const [twitter, setTwitter] = useState(data?.socials.twitter);
  const [facebook, setFacebook] = useState(data?.socials.facebook);
  const [instagram, setInstagram] = useState(data?.socials.instagram);
  const [tiktok, setTiktok] = useState(data?.socials.tiktok);
  const [URL, setURL] = useState(data?.customURL);
  const [savedURL, setSavedURL] = useState(data?.savedCustomURL);
  const [shouldSaveURL, setShouldSaveURL] = useState(false);

  const isTabValidated = useFormValidation({
    selectedTabIndex,
    setData,
  });

  function handleURLChange(e) {
    setURL(e.target.value);
    if (URL.match(/^[\w-]+$/) && URL.length > 3 && URL.length <= 30) {
      // here we would also check if the URL already exists in the DB.
      if (shouldSaveURL) {
        setData({ customURL: e.target.value, customSavedURL: e.target.value });
      } else {
        setData({
          customURL: e.target.value,
        });
      }
    }
  }

  function handleURLSaveCheck(e) {
    setShouldSaveURL(e.target.checked);

    if (e.target.checked) {
      setSavedURL(URL);
      setData({ customSavedURL: URL });
    } else {
      setSavedURL("");
      setData({ customSavedURL: null });
    }
  }

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
        <Stack alignItems="flex-end">
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h3">www.interact.vip /</Typography>
            <TextField
              variant="outlined"
              inputProps={{ maxLength: 30 }}
              helperText="3 to 30 characters. Letters, numbers, and dashes only."
              value={URL}
              error={!URL.match(/^[\w-]+$/) || URL.length < 3}
              onChange={(e) => handleURLChange(e)}
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={shouldSaveURL}
                  onChange={handleURLSaveCheck}
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
                error={discord && !isValidHttpUrl(discord)}
                onChange={(e) => {
                  setDiscord(e.target.value);
                  setData({
                    socials: { ...data?.socials, discord: e.target.value },
                  });
                }}
              />
              <TextField
                variant="outlined"
                fullWidth
                label="Youtube channel link"
                value={youtube}
                error={youtube && !isValidHttpUrl(youtube)}
                onChange={(e) => {
                  setYoutube(e.target.value);
                  setData({
                    socials: { ...data?.socials, youtube: e.target.value },
                  });
                }}
              />
              <TextField
                variant="outlined"
                fullWidth
                label="Twitch server link"
                value={twitch}
                error={twitch && !isValidHttpUrl(twitch)}
                onChange={(e) => {
                  setTwitch(e.target.value);
                  setData({
                    socials: { ...data?.socials, twitch: e.target.value },
                  });
                }}
              />
              <TextField
                variant="outlined"
                fullWidth
                label="Subreddit link"
                value={reddit}
                error={reddit && !isValidHttpUrl(reddit)}
                onChange={(e) => {
                  setReddit(e.target.value);
                  setData({
                    socials: { ...data?.socials, reddit: e.target.value },
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
                error={twitter && !isValidHttpUrl(twitter)}
                onChange={(e) => {
                  setTwitter(e.target.value);
                  setData({
                    socials: { ...data?.socials, twitter: e.target.value },
                  });
                }}
              />
              <TextField
                variant="outlined"
                fullWidth
                label="Facebook page link"
                value={facebook}
                error={facebook && !isValidHttpUrl(facebook)}
                onChange={(e) => {
                  setFacebook(e.target.value);
                  setData({
                    socials: { ...data?.socials, facebook: e.target.value },
                  });
                }}
              />
              <TextField
                variant="outlined"
                fullWidth
                label="Instagram page link"
                value={instagram}
                error={instagram && !isValidHttpUrl(instagram)}
                onChange={(e) => {
                  setInstagram(e.target.value);
                  setData({
                    socials: { ...data?.socials, instagram: e.target.value },
                  });
                }}
              />
              <TextField
                variant="outlined"
                fullWidth
                label="TikTok profile link"
                value={tiktok}
                error={tiktok && !isValidHttpUrl(tiktok)}
                onChange={(e) => {
                  setTiktok(e.target.value);
                  setData({
                    socials: { ...data?.socials, tiktok: e.target.value },
                  });
                }}
              />
            </Stack>
          </Stack>
        </TitleAndDescFullWidth>
      </CreateCampaignItemWrapper>
      <TabNavigation
        disableNext={!isTabValidated}
        selectedTabIndex={selectedTabIndex}
        setSelectedTabIndex={setSelectedTabIndex}
      />
    </>
  );
}
