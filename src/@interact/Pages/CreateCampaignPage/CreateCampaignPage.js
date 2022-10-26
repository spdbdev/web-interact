import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonBase,
  Container,
  IconButton,
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
import { Close, ExpandLess } from "@mui/icons-material";
import InteractFlashyButton from "@interact/Components/Button/InteractFlashyButton";
import SoloPage from "app/layouts/solo-page/SoloPage";
import Span from "@jumbo/shared/Span";
import useAutosaveCampaign from "@interact/Hooks/use-autosave-campaign";
import { db } from "@jumbo/services/auth/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import moment from "moment";

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
  const [campaignData, setCampaignData] = useState(null);

  const { data, setData, isAutosaving, lastSavedAt, autosaveError } =
    useAutosaveCampaign(campaignData);
  const navigate = useNavigate();

  useEffect(() => {
    const getCampaign = async () => {
      let fetchedData = (
        await getDoc(doc(db, "campaigns", "campaign-creation-test"))
      ).data();
      setCampaignData(fetchedData);
    };

    getCampaign();
  }, [data, lastSavedAt]);

  useEffect(() => {
    setFAQSideBarText(FAQText[selectedTabIndex]);
  }, [selectedTabIndex]);

  function renderTab() {
    switch (selectedTabIndex) {
      case 0:
        return <BasicsTab data={campaignData} setData={setData} />;
      case 1:
        return <SchedulingTab data={campaignData} setData={setData} />;
      case 2:
        return <InteractionTab data={campaignData} setData={setData} />;
      case 3:
        return <GoalVideoTab data={campaignData} setData={setData} />;
      case 4:
        return <FAQTab data={campaignData} setData={setData} />;
      case 5:
        return <PaymentTab data={campaignData} setData={setData} />;
      case 6:
        return <PromotionTab data={campaignData} setData={setData} />;
      default:
        return <BasicsTab data={campaignData} setData={setData} />;
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

  if (!campaignData) {
    return null;
  } else {
    return (
      <SoloPage>
        {/* use the "SoloPage" wrapper to completely remove the header and sidebar. */}
        <Box
          sx={{
            display: "flex",
            position: "relative",
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
          <Box sx={{ position: "absolute", top: 10, right: 10 }}>
            <Span sx={{ color: "text.hint" }}>
              {autosaveError ? (
                <Span sx={{ color: "error" }}>Could not autosave.</Span>
              ) : isAutosaving ? (
                "Saving..."
              ) : (
                <Span>Last saved {moment(lastSavedAt).fromNow()}</Span>
              )}{" "}
            </Span>
            <IconButton
              disableRipple
              disableFocusRipple
              onClick={() => navigate(-1)}
            >
              <Close sx={{ color: "text.secondary" }} />
            </IconButton>
          </Box>
        </Box>
      </SoloPage>
    );
  }
}

export default CreateCampaignPage;
