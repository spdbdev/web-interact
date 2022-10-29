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
import Loading from "@interact/Components/Loading/Loading";

const FAQText = {
  0: (
    <div>
      On this tab, you can set the basic info for your campaign. Be yourself and
      be true to your personality; fans want to talk to the real you and want to
      connect with you. Drive hype & FOMO: it’s a fan’s only chance for a few
      months usually. If they miss out they’ll sit in envy of other lucky fans
      who get to interact with a content creator they love. How are interactions
      carried out? Via Google Meet, each interaction box has a ‘Join’ button
      that will go to the unique link of this interaction. You may also stream
      it live and/or record it (fans have already agreed to a photo/video
      release form) If a fan wants to join the content creator in a game but
      they are in different regions, either the fan or the content creator can
      create an account in a different region. What activities can I do with a
      fan in an interaction? Playing games (from competitive games like Valorant
      to Chess to…. Geoguessr) Discussing topics fans are passionate about,
      commentating on that, and learning from each other (fans can screen share:
      they might show off their own creations, favorite clips of your content
      and ask for advice in your field of expertise, or just anime & bad dad
      jokes. You can spice it up with a challenge like Try Not to Laugh)
    </div>
  ),
  1: (
    <div>
      When do fans interact? The only thing a fan can control is their own
      availability. They will be matched with the content creator’s schedule,
      which is usually released week-by-week. The fan’s interaction can occur
      during any week during the date range of interactions, where auction
      winners have interactions generally scheduled first, with priority over
      giveaway winners. Fans will be notified if they have an interaction during
      the next week at the latest by midnight on Friday (that’s when creators
      have to lock in their schedule for next week). How does scheduling work?
      Fans can select their availability from Mon-Sun in general as long as they
      have an account, even before they've acquired any interactions (a minimum
      of 5 hours of the week have to be selected). Fans also select a preference
      for time of day (in their timezone), morning (6am to 10:30 am), noon
      (10:30 am to 1:30 pm), afternoon (1:30pm to 6pm), evening (6pm to
      10:30pm), midnight (10:30pm to 1:30am), gremlin time (1:30 am to 6am). The
      first week after the campaign (starting Monday) is when interactions will
      start to be booked. When the campaign ends, creators are shown the
      availability of all of their fans continuously (shown X number of fans
      that are available for each time slot), and release a specific schedule
      week-by-week on Friday 11:59 pm at the latest (except for the first week
      where creators have until Sunday 11:59pm to lock in a schedule for the
      next week starting Monday), with the ability to choose how many
      interactions to do that week. We then allocate the best fitting fans as
      soon as the creator locks in their schedule for each week. Fans & creators
      can reschedule. Rescheduled fans will be added back into the matching
      algorithm pool & matched accordingly once again. By the last week, fans
      that creators are not able to meet are refunded. This means that if a fan
      or creator reschedules an interaction in the last week, the fan is
      refunded.
    </div>
  ),
  2: (
    <div>
      How does the giveaway work? Anyone can join the giveaway with a free entry
      or support a creator with a few dollars for a VIP entry that increases
      your chances of winning by 25x (but first, you have to correctly answer a
      skill based math question). Users can upgrade from the free to VIP entry
      (only 1 entry is allowed per user). Winners are drawn at the end of the
      campaign. Each time a user loses, their next giveaway with the same
      creator will have DOUBLE the chances of winning, stacking twice, 4x loss
      multiplier (meaning up to a total 4x chance for a free entry or a total
      100x chance if it is a VIP entry; this only resets on winning an
      interaction in the giveaway). How does the auction & leaderboard work?
      Fans place a bid to be on the leaderboard. If the fan is still on the
      leaderboard when the campaign ends, they'll win an interaction & their
      previously selected payment method will be charged. If a fan places in the
      top 3 on the leaderboard, their interaction will be longer in duration
      compared to a normal interaction. Why giveaway + auction format? Both
      affluent & everyday fans have an opportunity to interact: The giveaway
      allows all of your fans—for free or for a few dollars—to support you &
      achieve the campaign goal while getting a chance to interact with a
      content creator they love. The auction makes it fair by giving your most
      loyal fans the option to get an interaction with 100% certainty; your most
      loyal fans who want to tell you, their favorite creator, about themselves
      will save up birthday money / holiday wishes for an interaction with you.
      What can you do in an interaction? Playing games (from competitive games
      like Valorant to Chess to…. Geoguessr) Discussing topics fans are
      passionate about, commentating on that, and learning from each other (fans
      can screen share: they might show off their own creations, favorite clips
      of your content and ask for advice in your field of expertise, or just
      anime & bad dad jokes. You can spice it up with a challenge like Try Not
      to Laugh) How are interactions carried out? You can stream it live or
      record it Zoom & Discord (custom zoom link created for each interaction,
      or you can add the fan’s Discord ID) If a fan wants to join you in a
      game/server but they are in different regions, either you or the fan can
      create an account in a different region. Why do fans want personal
      interactions? As social platforms are so one-sided, fans give you
      attention weekly or even daily without being able to receive any
      meaningful attention or recognition back. They treat you as someone they
      trust and/or a relatable friend, but have never been able to fulfill that
      relationship. Thus, fans want to be recognized by you & build a
      relationship by showing off their talents (e.g. best X-main in this game,
      astute questions & insights in X, musical/artistic talent, athleticism, or
      comedic genius). Fans want to discuss & make their own viewpoints known on
      subjects they are deeply passionate about, where you’re one of the leaders
      in that subject/community (from anime to politics, from history to
      frontier tech, from reviews & tier lists to educational animations).
      Fame—if a fan’s interaction was interesting, creators can post highlights
      of it or the interaction is part of a live-streaming/podcasting scenario
      where the fan is recognized by many fellow fans & viewers (react to
      content together, try not to laugh challenge, etc. even if you don’t
      create that type of content yet, expand your variety—fans love to watch
      drama & discourse, or just something new). Interacting with fans as part
      of your content is effective & appealing since other fans are envious &
      garners large popularity (Mr. Beast, fans who don’t make money are still
      ecstatic). Creating fresh content is one of the largest challenges we
      face, why not add some spice?
    </div>
  ),
  3: (
    <div>
      Goal: You must create a goal but the goal is non-binding, interactions are
      still carried out with those who have supported you even if the goal is
      not reached. The goal gives fans incentive to pledge more to help you
      reach your goal in this limited amount of time. You can make the goal
      content that you already might plan to release soon. They can be casual or
      complex: - I won’t have to sell my kidney to feed myself - Get an RTX
      4090, ‘upgrade streaming setup’ - I will jump off a plane (skydive) - New
      video with behind-the-scenes & bloopers Video: Make a quick video
      explaining your Interact campaign to fans. For example: "Do you want to
      play a game of Valorant with me, showing off your skills? You definitely
      deserve to be higher ranked but matchmaking has toyed with your heart.
      Talk to me about your troubles, or ask questions, and I’ll answer your
      concerns while probably roasting you. Get to know me, and let me get to
      know my awesome fans; it’ll be fun! Of course you’re also getting us
      closer to the goal of $5,000 where I’ll eat a spoonful of Da Bomb; the
      spice definitely exaggerated, I’m not worried. This campaign ends on
      December 10th, so don’t miss out! These are the only interactions we’ll
      have for the next few months. Go to interact.vip/cool "
    </div>
  ),
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
    return <Loading />;
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
