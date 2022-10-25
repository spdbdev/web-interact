import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonBase,
  Container,
  Input,
  Stack,
  Typography,
} from "@mui/material";
import CampaignCreationTabs from "./CampaignCreationTabs";
import BasicsTab from "./Tabs/BasicsTab";
import SchedulingTab from "./Tabs/SchedulingTab";
import InteractionTab from "./Tabs/InteractionTab";
import GoalVideoTab from "./Tabs/GoalVideoTab";
import FAQTab from "./Tabs/FAQTab";
import PaymentTab from "./Tabs/PaymentTab";
import PromotionTab from "./Tabs/PromotionTab";
import SideBar from "./SideBar";
import { useNavigate } from "react-router-dom";
import { ExpandLess } from "@mui/icons-material";
import { useJumboContentLayout } from "@jumbo/hooks";
import JumboContentLayout from "@jumbo/components/JumboContentLayout";
import InteractFlashyButton from "@interact/Components/Button/InteractFlashyButton";
import CampaignCategorySelect from "./CampaignCategorySelect";
import SoloPage from "app/layouts/solo-page/SoloPage";
import Span from "@jumbo/shared/Span";

const FAQText = {
  0: <span>this is the basics tab</span>,
  1: <span>this is schedulinf</span>,
  2: <span></span>,
  3: <span></span>,
  4: <span></span>,
  5: (
    <div>
      <Typography variant="h4" color="primary.contrastText">
        Payment
      </Typography>
      <Span sx={{ textDecoration: "underline", display: "block" }}>
        How do fees work?
      </Span>{" "}
      We only make money when you do. We&apos;re not making money from any fees;
      we instead share costs with you; Interact only takes a cut after all of
      the referral, email, & payment processing fees. Interact takes a 17%-2%
      commission after sharing the fees (including payment processing of 2.9% +
      $0.30). Your commission rate is reduced drastically as you create more
      campaigns; if you have over $1000 in cumulative sales on Interact (each
      campaign adds to it), the rate is 16% (silver rank):
      <ul>
        <li>Default, $0 = 17%</li>
        <li>Silver, $1K = 16%</li>
        <li>Gold, $10K = 14%</li>
        <li>Platinum, $100K = 10%</li>
        <li>Diamond, $1M = 2%</li>
      </ul>
      <Span sx={{ textDecoration: "underline", display: "block" }}>
        When do you get paid?
      </Span>{" "}
      Within 3 business days after the campaign is completed.
    </div>
  ),
  6: <span></span>,
};

function CreateCampaignPage() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isSideBarCollapsed, setIsSideBarCollapsed] = useState(false);
  const [FAQSideBarText, setFAQSideBarText] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setFAQSideBarText(FAQText[selectedTabIndex]);
  }, [selectedTabIndex]);

  function renderTab() {
    switch (selectedTabIndex) {
      case 0:
        return <BasicsTab />;
      case 1:
        return <SchedulingTab />;
      case 2:
        return <InteractionTab />;
      case 3:
        return <GoalVideoTab />;
      case 4:
        return <FAQTab />;
      case 5:
        return <PaymentTab />;
      case 6:
        return <PromotionTab />;
      default:
        return <BasicsTab />;
    }
  }

  function handleNextButtonClick() {
    if (selectedTabIndex < 6) {
      setSelectedTabIndex(selectedTabIndex + 1);
    } else if (selectedTabIndex === 6) {
      navigate("/interact/campaign-creation-summary");
    } else {
      return;
    }
  }

  function handleBackButtonClick() {
    if (selectedTabIndex > 0) {
      setSelectedTabIndex(selectedTabIndex - 1);
    } else {
      return;
    }
  }

  return (
    <SoloPage>
      {/* use the "SoloPage" wrapper to completely remove the header and sidebar. */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          height: "100%",
          width: "100%",
          padding: 0,
          backgroundColor: "background.default",
        }}
      >
        <SideBar
          isSideBarCollapsed={isSideBarCollapsed}
          setIsSideBarCollapsed={setIsSideBarCollapsed}
          FAQSideBarText={FAQSideBarText}
        />
        <Box
          sx={{
            width: isSideBarCollapsed ? "40px" : "260px",
          }}
        ></Box>
        <Container
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            // marginLeft: isSideBarCollapsed ? "40px" : "260px",
          }}
        >
          <Container sx={{ display: "flex", justifyContent: "center" }}>
            <ButtonBase
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "text.hint",
              }}
              onClick={() => navigate("/interact/what-is-interact")}
            >
              <ExpandLess />
              <Typography sx={{ my: 0, py: 0 }}>What Is Interact?</Typography>
            </ButtonBase>
          </Container>

          <CampaignCreationTabs
            selectedTabIndex={selectedTabIndex}
            setSelectedTabIndex={setSelectedTabIndex}
          />
          <Stack
            direction="column"
            flex={1}
            justifyContent="space-evenly"
            spacing={2}
          >
            {renderTab()}
          </Stack>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignSelf: "flex-end",
              my: 4,
            }}
          >
            <InteractFlashyButton onClick={handleBackButtonClick}>
              ← Back
            </InteractFlashyButton>
            <InteractFlashyButton onClick={handleNextButtonClick}>
              Next →
            </InteractFlashyButton>
          </Box>
        </Container>
      </Box>
    </SoloPage>
  );
}

export default CreateCampaignPage;
