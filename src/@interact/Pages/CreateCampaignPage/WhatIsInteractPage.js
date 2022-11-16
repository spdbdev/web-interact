import InteractFlashyButton from "@interact/Components/Button/InteractFlashyButton";
import { useJumboLayoutSidebar } from "@jumbo/hooks";
import { Close, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  IconButton,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import SoloPage from "app/layouts/solo-page/SoloPage";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InteractLogo from "../../Images/logo512.png";

const WhatIsInteractFAQs = [
  {
    question: <span>How it works</span>,
    answer: (
      <span>
        Content creators start a time-limited campaign (lasting 10 days, by
        default) with a goal, offering 1-on-1 interactions to fans (eg. play a
        game) that are scheduled in the 10 weeks (by default) after the campaign
        ends. Fans try to be selected via the giveaway (with a free entry
        option) or the auction (be a top bidder on the leaderboard; pricier but
        a guaranteed interaction). Fans pay immediately for the giveaway;
        meanwhile in the auction, fans only pay if they win (charged at the end
        of the campaign, triggered manually, part of the firebase cloud
        function). When new fans try to enter the auction/giveaway, they have to
        create an account & input their general availability from Mon-Sun
        (editable on their profile page too). After the campaign ends, selected
        fans (winners) will have interactions assigned to them over the
        interaction window duration, 10 weeks by default (with auction winners
        having priority). The creator selects when they are available week-by-week 
        (creators have to lock in their availability by Friday midnight for the 
        next week, and can sync with their personal Google, Outlook or iCloud 
        calendars); from this, with our matching algorithm, interactions are scheduled.

      </span>
    ),
    defaultExpanded: true,
  },
  {
    question: <span>Why interact with fans?</span>,
    answer: (
      <span>
        Form a closer bond with your fans; either through those who support you
        monetarily and want an interaction or through the consumption of the
        fan-interactions produced, where everyone can learn more & see a
        different side to you. Meeting your most loyal fans is fun & fulfilling.
        It’s a wonderful feeling to see their eyes light up. These aren’t
        tedious requests nor formal lessons; there are no restrictions—you have
        complete freedom & control to stop talking to users and kick them at
        your discretion. Just chill with your fans on your own schedule.
        Maximize profits with Interact’s two-pronged hybrid giveaway + auction
        campaign. Our first-of-a-kind multi-item automated auction bidding
        algorithm allows affluent fans to support the creator with more money &
        gives a 100% success-rate option to fans (for fairness’ sake); it's the
        premium option as auction interactions are scheduled to occur first. On
        the other hand, any fan can spare a few dollars to buy 1 giveaway VIP
        ticket (max of 1 per user) to support you; they didn’t have a compelling
        reason to give some pocket change prior ("support me for the price of a
        coffee"). Now there’s a really attractive incentive—a chance to gain
        fame, gain recognition from an influencer, etc. They’ve invested
        numerous hours into this creator/topic, feel like a part of this special
        community, they’d like to show appreciation for their content, and
        achieve the campaign goal (e.g. to eat a spoonful of hot sauce, play
        this new fan-requested game, talk about X, make a special video, upgrade
        PC setup). In addition, don’t let bots or scalpers ruin everything—with
        Interact, every fan has until the end of the drop to buy a ticket or bid
        for an interaction instead of a first-come-first-serve basis. Do it all
        with minimal effort & complete control: our scheduling algorithm is
        focused on flexibility for the creator; one only has to input their
        specific availability week-by-week, 3 days in advance (on Friday at the
        latest, week starts on Monday).
      </span>
    ),
  },
  {
    question: <span>How much money can I make?</span>,
    answer: (
      <span>
        Maximize profits with Interact’s hybrid giveaway + auction campaign. Our
        special automated auction bidding allows affluent fans to support the
        creator much more & gives a 100% success-rate option to fans (for
        fairness’ sake); it's the premium option as auction interactions are
        scheduled to occur first. On the other hand, any fan can enter the
        giveaway for free or spare a few dollars to buy 1 VIP entry to the
        giveaway (VIP = 25x increased chance, max of 1 per user); For a
        small-medium influencer who has 1000 fans willing to buy the VIP entry
        for $3 in the giveaway for a ~3.5% chance of winning an interaction
        (assuming 10,000 free entries & 50 interactions in the giveaway): $3K.
        Plus 50 interactions sold in the auction, which can add another $2K to
        $4K if each interaction sells for an average of $40 to $80,
        respectively. So that’s a total of{" "}
        <strong style={{ fontWeight: 600 }}>
          $5K to $7K gross raised from one campaign selling 100 interactions
          with 1050 fans supporting you monetarily.
        </strong>{" "}
        If the average interaction 30 minutes, that’s around 5 hours a week of
        fan interaction over 2 months (only one or two interactions a day or one
        evening per week); this is effectively being paid an extra $100 to $140
        per hour while streaming/creating additional content while getting to
        meet & chill with your devoted fans. In a year, if a creator launches 5
        of these campaigns that reserve interactions for 2 months at a time (10
        months of interactions), that’s an additional{" "}
        <strong style={{ fontWeight: 600 }}>
          $25K to $35K gross revenue annually.
        </strong>
      </span>
    ),
  },
  {
    question: <span>How is Interact different from viewer games?</span>,
    answer: (
      <span>
        If you’ve tried viewer games before, it was probably spontaneous
        (pulling users from stream chat), benefiting only users who are paying
        attention in those few minutes & are able to play at that time. Interact
        helps you & your fans plan ahead, organizing interactions with flexible
        scheduling (smart algo matching); this greatly increases demand since
        all fans have the opportunity to vie for an interaction via our unique
        auction & giveaway campaigns (moreover, Interact creates FOMO with 5-20
        day campaigns + incentive to support you with a fun goal).
      </span>
    ),
  },
  {
    question: <span>Why do fans want personal interactions?</span>,
    answer: (
      <span>
        As social platforms are so one-sided, fans give you attention weekly or
        even daily without being able to receive any meaningful attention or
        recognition back. They treat you as someone they trust and/or a
        relatable friend, but have never been able to fulfill that relationship.
        Thus, fans want to be recognized by you & build a relationship by
        showing off their talents (e.g. best X-main in this game, astute
        questions & insights in X, musical/artistic talent, athleticism, or
        comedic genius). Fans want to discuss & make their own viewpoints known
        on subjects they are deeply passionate about, where you’re one of the
        leaders in that subject/community (from anime to politics, from history
        to frontier tech, from reviews & tier lists to educational animations).
        Fame—if a fan’s interaction was interesting, creators can post
        highlights of it or the interaction is part of a
        live-streaming/podcasting scenario where the fan is recognized by many
        fellow fans & viewers (react to content together, try not to laugh
        challenge, etc. even if you don’t create that type of content yet,
        expand your variety—fans love to watch drama & discourse, or just
        something new). Interacting with fans as part of your content is
        effective & appealing since other fans are envious & garners large
        popularity (Mr. Beast, fans who don’t make money are still ecstatic).{" "}
        <strong style={{ fontWeight: 600 }}>
          Creating fresh content is one of the largest challenges we face, why
          not add some spice?
        </strong>
      </span>
    ),
  },
];

function SpecialAccordion({ question, answer, defaultExpanded }) {
  return (
    <Accordion defaultExpanded={defaultExpanded}>
      <AccordionSummary
        sx={{
          background:
            "linear-gradient(90.32deg, #782FEE -8.69%, #DD00FF 109.93%)",
          color: "primary.contrastText",
          fontWeight: 400,
        }}
        expandIcon={<ExpandMore sx={{ color: "primary.contrastText" }} />}
      >
        {question}
      </AccordionSummary>
      <AccordionDetails>{answer}</AccordionDetails>
    </Accordion>
  );
}

export default function WhatIsInteractPage() {
  const navigate = useNavigate();

  const VideoWrapper = styled(Box)`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  padding-bottom: 56.25%;
  overflow: hidden;
  box-shadow: 0px 0px 27px 7px rgba(120, 47, 238, 0.15);
  border-radius: 23px;
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

  return (
    <Slide direction="down" timeout={1000} in={true} mountOnEnter unmountOnExit>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100%",
          padding: 5,
          backgroundColor: "background.default",
        }}
      >
        <Box sx={{ alignSelf: "flex-end" }}>
          <IconButton
            disableRipple
            disableFocusRipple
            onClick={() => navigate(-1)}
          >
            <Close sx={{ color: "text.secondary" }} />
          </IconButton>
        </Box>
        <Stack direction="column" alignItems="center" width={"100%"}>
          <Stack spacing={1} mb={10} sx={{ maxWidth: 1000 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <Stack direction="column" alignItems="center" spacing={2} sx={{ width: { sm: '33%' } }}>
                <img src={InteractLogo} alt="" width={50} />
                <Typography variant="h2">What Is Interact?</Typography>
              </Stack>
              <Stack sx={{ width: { xs: '100%', sm: '66%' } }}>
                <VideoWrapper>
                  <iframe
                    title='youtube'
                    src='https://www.youtube.com/embed/L0AykH20X3Q?playlist=L0AykH20X3Q&loop=1'
                  />
                </VideoWrapper>
              </Stack>
            </Stack>
            <Typography variant="h5" sx={{ py: 4 }}>
              Interact helps you bring joy to your most loyal fans who have
              grown with you not only as a creator, but as a human being. We
              minimize logistical hassle and make it worth your time (while
              creating content/streaming, making an additional $100+ an hour
              with only 1000 devoted fans). This is FREE MONEY at no opportunity
              cost since you get fresh content for your stream (your streaming
              scheduling can stay the same, no additional hours needed) and/or
              you can make use of highlights from interactions to spice up new
              videos.
            </Typography>
            {WhatIsInteractFAQs?.map((item, key) => (
              <SpecialAccordion
                key={key}
                question={item.question}
                answer={item.answer}
                defaultExpanded={item.defaultExpanded}
              />
            ))}
          </Stack>
        </Stack>
        <Box sx={{ position: "fixed", bottom: 50, right: 50 }}>
          <InteractFlashyButton
            onClick={() => navigate("/a/create-campaign")}
          >
            Next →
          </InteractFlashyButton>
        </Box>
      </Box>
    </Slide>
  );
}
