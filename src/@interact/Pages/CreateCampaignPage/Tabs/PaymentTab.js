import React from "react";
import { Container, Stack, Typography } from "@mui/material";
import TitleAndDesc from "../CampaignTitleAndDesc";
import InteractButton from "@interact/Components/Button/InteractButton";
import StripeLogo from "@interact/Images/stripe-logo.svg";
import Span from "@jumbo/shared/Span";
import CreateCampaignItemWrapper from "../CreateCampaignItemWrapper";
import { TabNavigation } from "../TabNavigation";

export default function PaymentTab({
  selectedTabIndex,
  setSelectedTabIndex,
}) {
  return (
    <>
      <CreateCampaignItemWrapper>
        <TitleAndDesc title={"Banking details"}>
          Link a bank account where your campaign funds will be
          deposited. <br />
          <br /> Funds are processed through our third-party provider
          (Stripe) and your bank account details are not stored on our
          servers. <br />
          <br /> Funds will be deposited automatically within 3
          business days after the campaign ends.
        </TitleAndDesc>
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
            Link through{" "}
            <img alt="stripe logo" src={StripeLogo} width="60px" />
          </Span>
        </InteractButton>
      </CreateCampaignItemWrapper>
      <TabNavigation
        disableNext={false} // Not yet wired up to stripe
        selectedTabIndex={selectedTabIndex}
        setSelectedTabIndex={setSelectedTabIndex}
      />
    </>
  );
}
