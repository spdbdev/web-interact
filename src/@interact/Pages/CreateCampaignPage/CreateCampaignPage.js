import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  ButtonBase,
  Container,
  IconButton,
  Input,
  Slide,
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
import { useNavigate, useParams } from "react-router-dom";
import { Close, ExpandLess } from "@mui/icons-material";
import Span from "@jumbo/shared/Span";
import useAutosaveCampaign from "@interact/Hooks/use-autosave-campaign";
import { db } from "@jumbo/services/auth/firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import moment from "moment";
import Loading from "@interact/Components/Loading/Loading";
import { useJumboLayoutSidebar } from "@jumbo/hooks";
import InteractMethodTab from "./Tabs/InteractMethodTab";
import { fetchCampaign, addCampaign } from "../../../firebase";
import useCurrentUser from "@interact/Hooks/use-current-user";

function FAQSidebarWrapper({ title, children }) {
  return (
    <div>
      <Typography variant="h4" color="primary.contrastText">
        {title}
      </Typography>
      {children}
    </div>
  );
}

const FAQText = {
  0: (
    <FAQSidebarWrapper title="Basics">
      Be true to yourself; fans want to talk to & create a symbiotic 2-way
      relationship. Have meaningful conversations & learn about your fans who
      have grown with you not only as a creator but as a person.
      <br />
      <br />
      <Span sx={{ textDecoration: "underline", display: "block" }}>
        How are interactions carried out?
      </Span>{" "}
      Via Discord (fans link their Discord accounts; when it’s their turn to
      interact, fans join the creator’s server and are given a special role
      automatically) or Google Meet (unique Google Meet link). You may also
      stream it live and/or record it (users have agreed to photo/video release
      in the terms & conditions). If a fan wants to join the content creator in
      a game but they are in different regions, either the fan or the content
      creator can create an account in a different region. <br />
      <br />
    </FAQSidebarWrapper>
  ),
  1: (
    <FAQSidebarWrapper title="Scheduling">
      <Span sx={{ textDecoration: "underline", display: "block" }}>
        When do fans interact?
      </Span>{" "}
      Fans have interactions assigned to them in the 10 weeks (by default, or
      the Interaction window duration of your choice) after the campaign ends,
      where auction winners have interactions generally scheduled first, with
      priority over giveaway winners. The only thing a fan can control is their
      own general availability, as they wait to get matched with the content
      creator who locks in their schedule week by week, at the latest by Friday
      midnight for the upcoming week.
      <br />
      <br />
      <Span sx={{ textDecoration: "underline", display: "block" }}>
        How does scheduling work?
      </Span>{" "}
      You can sync with your Google, Outlook or iCloud calendar, where your
      scheduled events will show up as unavailable timeslots automatically on
      your creator schedule tab (in your Interact profile page); after you lock
      in your availability for a week, your interactions with fans are scheduled
      and can be exported to your calendar. Fans can select their availability
      from Mon-Sun in general as long as they have an account, even before
      they've acquired any interactions (a minimum of 5 hours of the week have
      to be selected). Fans also select a preference for time of day (in their
      timezone), morning (6am to 10:30 am), noon (10:30 am to 1:30 pm),
      afternoon (1:30pm to 6pm), evening (6pm to 10:30pm), midnight (10:30pm to
      1:30am), gremlin time (1:30 am to 6am). The first week after the campaign
      (starting Monday) is when interactions will start to be booked. When the
      campaign ends, creators are shown the availability of all of their fans
      continuously (shown X number of fans that are available for each time
      slot), and release a specific schedule week-by-week on Friday 11:59 pm at
      the latest (except for the first week where creators have until Sunday
      11:59pm to lock in a schedule for the next week starting Monday), with the
      ability to choose how many interactions to do that week. We then allocate
      the best fitting fans as soon as the creator locks in their schedule for
      each week. Fans & creators can reschedule. Rescheduled fans will be added
      back into the matching algorithm pool & matched accordingly once again. By
      the last week, fans that creators are not able to meet are refunded. This
      means that if a fan or creator reschedules an interaction in the last
      week, the fan is refunded.
    </FAQSidebarWrapper>
  ),
  2: (
    <FAQSidebarWrapper title="Interaction">
      <Span sx={{ textDecoration: "underline", display: "block" }}>
        Why giveaway + auction format?
      </Span>{" "}
      Both affluent & everyday fans have an opportunity to interact: The
      giveaway allows all of your fans—for free or for a few dollars—to support
      you & achieve the campaign goal while getting a chance to interact with a
      content creator they love. The auction makes it fair by giving your most
      loyal fans the option to get an interaction with 100% certainty; your most
      loyal fans who want to tell you, their favorite creator, about themselves
      will save up birthday money / holiday wishes for an interaction with you.
      <br />
      <Span sx={{ textDecoration: "underline", display: "block" }}>
        <br />
        How does the giveaway work?
      </Span>{" "}
      Anyone can join the giveaway with a free entry or support a creator with a
      few dollars for a VIP entry that increases your chances of winning by 25x.
      Users can upgrade from the free to VIP entry (only 1 entry is allowed per
      user).
      <br />
      <br />
      <Span sx={{ textDecoration: "underline", display: "block" }}>
        How does the auction & leaderboard work?
      </Span>{" "}
      Fans place a bid to be on the leaderboard. If the fan is still on the
      leaderboard when the campaign ends, they'll win an interaction & their
      previously selected payment method will be charged. If a fan places in the
      top 3 on the leaderboard, their interaction will be longer in duration
      compared to a normal interaction.
      <br />
      <Span sx={{ textDecoration: "underline", display: "block" }}>
        <br />
        Additional giveaway info
      </Span>{" "}
      Winners are drawn at the end of the campaign. Each time a user loses,
      their next giveaway with the same creator will have DOUBLE the chances of
      winning, stacking twice, 4x loss multiplier (meaning up to a total 4x
      chance for a free entry or a total 100x chance if it is a VIP entry; this
      only resets on winning an interaction in the giveaway). <br />
    </FAQSidebarWrapper>
  ),
  3: (
    <FAQSidebarWrapper title="Goal & video">
      <Span sx={{ textDecoration: "underline", display: "block" }}>Goal:</Span>{" "}
      You must create a goal which is non-binding, i.e. interactions are still
      carried out with those who have supported you even if the goal is not
      reached. The goal gives fans incentive to pledge more to help you reach
      your goal in this limited amount of time. You can make the goal content
      that you already might plan to release soon. They can be casual or
      complex:
      <ul>
        <li>I won’t have to sell my kidney to feed myself</li>
        <li>Get an RTX 4090, ‘upgrade streaming setup’</li>
        <li>I will jump off a plane (skydive)</li>
        <li>New video with behind-the-scenes & bloopers</li>
      </ul>{" "}
      <br />
      <Span sx={{ textDecoration: "underline", display: "block" }}>
        Video:
      </Span>{" "}
      Make a quick video explaining your Interact campaign to fans. For example:
      "Do you want to play a game of Valorant with me, showing off your skills?
      You definitely deserve to be higher ranked but matchmaking has toyed with
      your heart. Talk to me about your troubles, or ask questions, and I’ll
      answer your concerns while probably roasting you. Get to know me, and let
      me get to know my awesome fans; it’ll be fun! Of course you’re also
      getting us closer to the goal of $5,000 where I’ll eat a spoonful of Da
      Bomb; the spice definitely exaggerated, I’m not worried. This campaign
      ends on December 10th, so don’t miss out! These are the only interactions
      we’ll have for the next few months. Go to interact.vip/cool "
    </FAQSidebarWrapper>
  ),
  4: (
    <FAQSidebarWrapper title="Interaction method">
      <Span sx={{ textDecoration: "underline", display: "block" }}>
        What activities can I do with a fan in an interaction?{" "}
      </Span>{" "}
      Playing games (from competitive games like Valorant & Chess to…. GeoGuessr
      or mini putt in Discord activities). Discussing topics fans are passionate
      about, commentating, and learning from each other (fans can screen share:
      they might show off their own creations, favorite clips of your content
      and ask for advice in your field of expertise… or just anime. You could
      also spice it up with a Try Not to Laugh challenge, watching funny YouTube
      videos via Discord activities).
      <Span sx={{ textDecoration: "underline", display: "block" }}>
        <br />
        Why do fans want personal interactions?
      </Span>{" "}
      As social platforms are so one-sided, fans give you attention weekly or
      even daily without being able to receive any meaningful attention or
      recognition back. They treat you as someone they trust and/or a relatable
      friend, but have never been able to fulfill that relationship. Thus, fans
      want to be recognized by you & build a relationship by showing off their
      talents (e.g. best X-main in this game, astute questions & insights in X,
      musical/artistic talent, athleticism, or comedic genius). Fans want to
      discuss & make their own viewpoints known on subjects they are deeply
      passionate about, where you’re one of the leaders in that
      subject/community (from anime to politics, from history to frontier tech,
      from reviews & tier lists to educational animations). Fame—if a fan’s
      interaction was interesting, creators can post highlights of it or the
      interaction is part of a live-streaming/podcasting scenario where the fan
      is recognized by many fellow fans & viewers (react to content together,
      try not to laugh challenge, etc. even if you don’t create that type of
      content yet, expand your variety—fans love to watch drama & discourse, or
      just something new). Interacting with fans as part of your content is
      effective & appealing since other fans are envious & garners large
      popularity (Mr. Beast, fans who don’t make money are still ecstatic).
      Creating fresh content is one of the largest challenges we face, why not
      add some spice?
    </FAQSidebarWrapper>
  ),
  5: (
    <FAQSidebarWrapper title="FAQ">
      This is the FAQ your fans will see on your campaign. Most answers are
      pre-filled, but you'll need to fill in custom details for some questions,
      namely: "What can we do in an interaction?" and "How are interactions
      carried out?" <br /> <br />
      <Span sx={{ textDecoration: "underline", display: "block" }}>
        "What can we do in an interaction?"
      </Span>{" "}
      Tell your fans what kind of rewarding experience they'd get with you if
      they won an interaction. For example, "You'll get the exclusive experience
      of seeing how I make my videos behind the scenes, and you'll even get a
      chance to be in one!" <br />
      <br />
      <Span sx={{ textDecoration: "underline", display: "block" }}>
        "How are interactions carried out?"
      </Span>{" "}
      Here, you can tell your fans how they'll be able to interact with you via
      Discord (fans link their Discord accounts; when it’s their turn to
      interact, fans join the creator’s server and are given a special role
      automatically) or Google Meet (unique Google Meet link). Are you going to
      stream the interaction live and/or record it (If you wish to play a game,
      what is the game? Which region/server?)
    </FAQSidebarWrapper>
  ),
  6: (
    <FAQSidebarWrapper title="Payment">
      <Span sx={{ textDecoration: "underline", display: "block" }}>
        How do fees work?
      </Span>{" "}
      We take our 17%-2% commission after sharing the fees (including payment
      processing of 2.9% + 0.30c, foreign exchange fees of 2%+ when fans pay
      with their local currency, etc.). Your commission rate is reduced
      drastically as you create more campaigns; if you have over $1000 in
      cumulative sales on Interact (each campaign adds to it), the rate is 16%
      (silver rank):
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
    </FAQSidebarWrapper>
  ),
  7: (
    <FAQSidebarWrapper title="Promotion">
      While promoting the campaign, the goal is to drive hype & FOMO: it’s a
      fan’s only chance for a few months usually. If they miss out they’ll sit
      in envy of other lucky fans who get to interact with a content creator
      they love.
      <Span sx={{ textDecoration: "underline", display: "block" }}>
        Is there protection against bots/abusers?
      </Span>{" "}
      The creator can ban any participant of their campaigns from their current
      and future campaigns (lifetime). You can also delete any comment on your
      campaigns (with the ability to also ban the user who made that comment). A
      ban button is next to users on the ‘supporters’ tab of your campaign and
      also on the user profile page when you have scheduled interactions with a
      fan. Users have to AUTHORIZE a payment method to bid or enter the giveaway
      (meaning their payment method is validated via a small void transaction
      usually). Every fan has until the end of the drop to bid & enter the
      giveaway instead of a first-come-first-serve basis. <br />
      <br />
      <Span sx={{ textDecoration: "underline", display: "block" }}>
        When can I start the next campaign?
      </Span>{" "}
      The next campaign has to end after all of your currently scheduled
      interactions would be completed. Ex: 50 interactions with fans over 2
      months from March 1st to April 28th, then your new campaign can start on
      April 19th and end on May 1st if you want a 10 day campaign. It can start
      even earlier if you would want a 15 or 20 day campaign; it’s just that the
      end date has to be after all of the interactions are completed. <br />
      <br />
      <Span sx={{ textDecoration: "underline", display: "block" }}>
        What URLs do old campaigns use when I launch a new campaign?
      </Span>{" "}
      If you launch a new campaign and you want to use the same URL as before,
      like www.interact.vip/pewdiepie the old campaign will be assigned an URL
      consisting of your username and a number, like
      www.interact.vip/c/username_1, where the number denotes your 1st, 2nd,
      3rd, etc. campaigns.
    </FAQSidebarWrapper>
  ),
};

function CreateCampaignPage() {
  // initialize lastCompleteTabIndex to -1 in firestore
  const { campaignId } = useParams();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [
    hasInitialTabBeenSetFromDatabase,
    setHasInitialTabBeenSetFromDatabase,
  ] = useState(false);
  const [FAQSideBarText, setFAQSideBarText] = useState("");
  const [campaignData, setCampaignData] = useState(campaignId);
  const [isSideBarCollapsed, setIsSideBarCollapsed] = useState(false);
  const { user } = useCurrentUser();
  const campaignAddedRef = useRef(false);

  const { sidebarOptions, setSidebarOptions } = useJumboLayoutSidebar();

  useEffect(() => {
    // Fixes a bug where sidebar is hidden but remains "open" when
    // navigating to this screen from the user profile
    if (sidebarOptions.open === true) {
      setSidebarOptions({ open: false });
    }
  }, [sidebarOptions]);

  const { data, setData, isAutosaving, lastSavedAt, autosaveError } =
    useAutosaveCampaign(campaignData);

  const navigate = useNavigate();

  useEffect(() => {
    // data is for checking when all autosave data has been autosaved
    // Based on data, it will update campaignData which is used to populate form fields

    handleCampaign();
  }, [data, lastSavedAt, user]);

  useEffect(() => {
    setFAQSideBarText(FAQText[selectedTabIndex]);
  }, [selectedTabIndex]);

  useEffect(() => {
    const initialTabIndex = campaignData?.lastCompletedTabIndex + 1;

    if (initialTabIndex >= 0 && !hasInitialTabBeenSetFromDatabase) {
      setSelectedTabIndex(initialTabIndex);
      setHasInitialTabBeenSetFromDatabase(true);
    }
  }, [campaignData]);

  const handleCampaign = () => {
    const getCampaign = async (campaignId) => {
      let fetchedData = await fetchCampaign(campaignId);

      if (fetchedData) {
        setCampaignData({ ...fetchedData, campaignId });
      }
    };

    const handleAddCampaign = async () => {
      let newCampaignId = await addCampaign(user);
      navigate(`/d/${newCampaignId}`)
    }
    if (user) {
      if (campaignAddedRef.current === true) {
        return
      } else if (data && !(data.lastCompletedTabIndex !== undefined && Object.keys(data).length === 1) && !campaignId) {
        campaignAddedRef.current = true;
        handleAddCampaign();
      } else {
        getCampaign("campaign-creation-test");
      }
    }
  }

  function renderTab() {
    const tabProps = {
      data: campaignData,
      setData: setData,
      selectedTabIndex,
      setSelectedTabIndex,
    };

    switch (selectedTabIndex) {
      case 0:
        return <BasicsTab {...tabProps} />;
      case 1:
        return <SchedulingTab {...tabProps} />;
      case 2:
        return <InteractionTab {...tabProps} />;
      case 3:
        return <GoalVideoTab {...tabProps} />;
      case 4:
        return <InteractMethodTab {...tabProps} />;
      case 5:
        return <FAQTab {...tabProps} />;
      case 6:
        return <PaymentTab {...tabProps} />;
      case 7:
        return <PromotionTab {...tabProps} />;
      default:
        return <BasicsTab {...tabProps} selectedTabIndex={0} />;
    }
  }

  if (!campaignData) {
    return <Loading />;
  }

  return (
    <Slide direction="down" timeout={1000} in={true} mountOnEnter unmountOnExit>
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
              onClick={() => navigate("/a/what-is-interact")}
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
            pb={10}
            position="relative"
          >
            {campaignData !== campaignId ? renderTab() : null}
          </Stack>
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
            onClick={() => navigate(`/u/${user.name}`)}
          >
            <Close sx={{ color: "text.secondary" }} />
          </IconButton>
        </Box>
      </Box>
    </Slide>
  );
}

export default CreateCampaignPage;
