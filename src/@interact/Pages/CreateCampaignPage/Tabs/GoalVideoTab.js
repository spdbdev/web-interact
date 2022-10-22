import React, { useState } from "react";
import {
  Container,
  FormControl,
  FormHelperText,
  InputAdornment,
  Link,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CreateCampaignItemWrapper from "../CreateCampaignItemWrapper";
import TitleAndDesc from "../CampaignTitleAndDesc";
import { Add } from "@mui/icons-material";
import InteractButton from "@interact/Components/Button/InteractButton";
import Span from "@jumbo/shared/Span";

export default function GoalVideoTab() {
  const [campaignMoneyGoal, setCampaignMoneyGoal] = useState(0);
  const [campaignReward, setCampaignReward] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <>
      <Stack direction="column" alignItems="center">
        <Typography variant="h2" sx={{ fontWeight: 500 }}>
          What's your goal for this campaign?
        </Typography>
        <Stack direction="row" alignItems="center" mt={4} sx={{ fontSize: 18 }}>
          If we raise{" "}
          <FormControl>
            <OutlinedInput
              type="number"
              inputProps={{ step: ".50" }}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              sx={{ mx: 2, mt: 2 }}
              value={campaignMoneyGoal}
              onChange={(e) => setCampaignMoneyGoal(e.target.value)}
            />
            <FormHelperText sx={{ ml: 3 }}>Min. $10</FormHelperText>
          </FormControl>
          I will
          <FormControl>
            <TextField
              sx={{ mx: 2, mt: 2, width: 400 }}
              variant="outlined"
              inputProps={{ maxLength: 40 }}
              helperText="Max. 50 characters."
              placeholder={`Eat a cricket on stream`}
              fullWidth
            />
          </FormControl>
        </Stack>
      </Stack>

      <CreateCampaignItemWrapper>
        <TitleAndDesc title="Introduction Video">
          Upload a short video and thumbnail where you describe your campaign
          and goal where you tell your fans about the goal, explain how
          interactions work & how fans can acquire them in the campaign.
          <br />
          <br />
          After selecting a video and thumbnail, you can then click 'Upload to
          YouTube'. A tab will open and you'll be prompted to login to your
          YouTube account.
          <br />
          <br />
          <Link href="#">Not sure what to say? See a sample script here</Link>
        </TitleAndDesc>
        <Stack spacing={2}>
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{
              bgcolor: "divider",
              width: 280,
              height: 150,
              borderRadius: 2,
              p: 2,
              textAlign: "center",
            }}
          >
            <Add />
            <Typography>Click here to upload a thumbnail image.</Typography>
          </Stack>
          <InteractButton>
            <Span
              sx={{
                fontWeight: 500,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                px: 2,
              }}
            >
              Browse for video
            </Span>
          </InteractButton>
          <InteractButton variant="contained" disabled={!selectedVideo}>
            <Span
              sx={{
                fontWeight: 500,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                px: 2,
                color: "#FFFFFF",
              }}
            >
              Upload to Youtube
            </Span>
          </InteractButton>
        </Stack>
      </CreateCampaignItemWrapper>
    </>
  );
}
