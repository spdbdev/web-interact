import { TextField } from "@mui/material";
import React from "react";
import CampaignCategorySelect from "../CampaignCategorySelect";
import CampaignDropdownSelect from "../CampaignDropdownSelect";
import TitleAndDesc from "../CampaignTitleAndDesc";
import CreateCampaignItemWrapper from "../CreateCampaignItemWrapper";

export default function BasicsTab() {
  return (
    <>
      <CreateCampaignItemWrapper>
        <TitleAndDesc title="Campaign Title">
          Enter a title for your campaign. Include your name/alias in the title
          so fans can find you more easily.
        </TitleAndDesc>
        <TextField
          variant="outlined"
          helperText="Max. 40 characters."
          sx={{ width: 400 }}
          placeholder={`Get to know ${"name"} 1-on-1`}
        />
      </CreateCampaignItemWrapper>

      <CreateCampaignItemWrapper>
        <TitleAndDesc title="Campaign Info">
          Enter a short description of your campaign.
        </TitleAndDesc>
        <TextField
          multiline
          rows={4}
          defaultValue="Set some ground rules for interactions & how it will be carried out (will it be live on stream? Will the fan's face be shown?), and you can talk more in-depth about your campaign goal."
          sx={{ width: 400 }}
        />
      </CreateCampaignItemWrapper>

      <CreateCampaignItemWrapper>
        <TitleAndDesc title="Categories">
          Select 1-3 categories for your campaign.
        </TitleAndDesc>
        <CampaignCategorySelect />
      </CreateCampaignItemWrapper>

      <CreateCampaignItemWrapper>
        <TitleAndDesc title="Currency">
          Set the currency for your campaign. This will apply to giveaway entry
          prices, auction bids, and the campaign goal.
        </TitleAndDesc>
        <CampaignDropdownSelect
          placeholder="Currency"
          items={[
            "Oliver Hansen",
            "Van Henry",
            "April Tucker",
            "Ralph Hubbard",
            "Omar Alexander",
            "Carlos Abbott",
            "Miriam Wagner",
            "Bradley Wilkerson",
            "Virginia Andrews",
            "Kelly Snyder",
          ]}
        />
      </CreateCampaignItemWrapper>
    </>
  );
}
