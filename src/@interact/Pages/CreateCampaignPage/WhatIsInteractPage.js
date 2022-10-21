import InteractFlashyButton from "@interact/Components/Button/InteractFlashyButton";
import { Close, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import SoloPage from "app/layouts/solo-page/SoloPage";
import React from "react";
import { useNavigate } from "react-router-dom";
import InteractLogo from "../../Images/logo512.png";

const WhatIsInteractFAQs = [
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
        Maximize profits with Interact’s two-pronged hybrid raffle + auction
        campaign. Our first-of-a-kind multi-item automated auction bidding
        algorithm allows affluent fans to support the creator with more money &
        gives a 100% success-rate option to fans (for fairness’ sake); it's the
        premium option as auction interactions are scheduled to occur first. On
        the other hand, any fan can spare a few dollars to buy 1 raffle ticket
        (max of 1 per user) to support you; they didn’t have a compelling reason
        to give some pocket change prior ("support me for the price of a
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
        auction & raffle campaigns (moreover, Interact creates FOMO with 5-20
        day campaigns + incentive to support you with a fun goal).
      </span>
    ),
  },
  {
    question: <span>Why do fans want personal interactions?</span>,
    answer: <span>dknfkdnfkajsdn lfdnf kjlsndf lsdfn</span>,
  },
];

function SpecialAccordion({ question, answer }) {
  return (
    <Accordion>
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

  return (
    <SoloPage>
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
          <Stack spacing={1} sx={{ maxWidth: 1000 }}>
            <Stack direction="column" alignItems="center" spacing={2}>
              <img src={InteractLogo} alt="" width={50} />
              <Typography variant="h2">What Is Interact?</Typography>
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
              />
            ))}
          </Stack>
        </Stack>
        <Box sx={{ position: "fixed", bottom: 50, right: 50 }}>
          <InteractFlashyButton
            onClick={() => navigate("/interact/createcampaign")}
          >
            Next →
          </InteractFlashyButton>
        </Box>
      </Box>
    </SoloPage>
  );
}
