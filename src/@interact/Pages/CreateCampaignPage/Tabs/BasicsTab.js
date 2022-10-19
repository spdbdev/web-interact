import React from "react";
import CampaignCategorySelect from "../CampaignCategorySelect";
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
      </CreateCampaignItemWrapper>

      <CreateCampaignItemWrapper>
        <TitleAndDesc title="Campaign Info">
          Enter a short description of your campaign.
        </TitleAndDesc>
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
      </CreateCampaignItemWrapper>
    </>
  );
}
