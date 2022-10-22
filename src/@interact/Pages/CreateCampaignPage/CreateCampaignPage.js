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

const FAQText = {
  0: <span>this is the basics tab</span>,
  1: <span>this is schedulinf</span>,
  2: <span></span>,
  3: <span></span>,
  4: <span></span>,
  5: <span></span>,
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
        <Container
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
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
            spacing={4}
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
              mt: 10,
              mb: 6,
            }}
          >
            <InteractFlashyButton
              onClick={() => setSelectedTabIndex(selectedTabIndex - 1)}
            >
              ← Back
            </InteractFlashyButton>
            <InteractFlashyButton
              onClick={() => setSelectedTabIndex(selectedTabIndex + 1)}
            >
              Next →
            </InteractFlashyButton>
          </Box>
        </Container>
      </Box>
    </SoloPage>
  );
}

export default CreateCampaignPage;
