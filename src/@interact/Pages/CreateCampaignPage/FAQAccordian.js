import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Chip, Stack, TextField } from "@mui/material";

const FAQs = [
  {
    question: "How long is each interaction?",
    answer: (
      <span>
        All interactions are X minutes except for the top 3 on the leaderboard
        (from the auction) which get longer Y minutes interactions.
      </span>
    ),
  },
  {
    question: "How do I get an interaction?",
    answer: (
      <span>
        2 options: auction or giveaway. A max of 2 interactions per user can be
        acquired from every campaign, one from the auction & one from the
        giveaway. Auction: place a bid to be on the leaderboard or use auto-bid
        (select a max bid and your preferred ranking); if you are still on the
        leaderboard when the campaign ends, you will acquire an interaction. If
        you place in the top 3 on the leaderboard, your interaction will be 2x
        or more in duration compared to a normal interaction. Only 1 bid is live
        at a time, each new bid replaces your previous one (meaning you can only
        acquire 1 interaction from the auction). Giveaway: Anyone can join the
        giveaway with a free entry or support a creator with a few dollars for a
        VIP entry that increases your chances of winning by 25x (but first, you
        have to correctly answer a skill based math question). Users can upgrade
        from the free to VIP entry (only 1 entry is allowed per user). Winners
        are drawn at the end of the campaign. Each time a user loses, their next
        giveaway with the same creator will have DOUBLE the chances of winning,
        stacking twice (up to 4x chance or a total of 100x chance if it is a VIP
        entry; this only resets on winning an interaction in the giveaway).
      </span>
    ),
  },
  {
    question: "How does the giveaway work?",
    answer: (
      <span>
        Anyone can join the giveaway with a free entry or support a creator with
        a few dollars for a VIP entry that increases your chances of winning by
        25x (but first, you have to correctly answer a skill based math
        question). Users can upgrade from the free to VIP entry (only 1 entry is
        allowed per user). Winners are drawn at the end of the campaign. Each
        time a user loses, their next giveaway with the same creator will have
        DOUBLE the chances of winning, stacking twice, 4x loss multiplier
        (meaning up to a total 4x chance for a free entry or a total 100x chance
        if it is a VIP entry; this only resets on winning an interaction in the
        giveaway).
      </span>
    ),
  },
  {
    question: "How do the auction & leaderboard work?",
    answer: (
      <span>
        Place a bid to be on the leaderboard or auto-bid: We'll automatically
        bid the lowest amount to stay at your desired rank on the leaderboard
        until your max bid is reached. If others bid more & your max bid amount
        is exceeded, your rank will be lowered (we will automatically bid your
        max bid price if it is exceeded and still try to get you the highest
        rank possible); you might still be on the leaderboard or you might not
        be, meaning meaning no interaction (you'll be sent an email to increase
        your max bid). if you are still on the leaderboard when the campaign
        ends, you will acquire an interaction. If you place in the top 3 on the
        leaderboard, your interaction will be 2x or more in duration compared to
        a normal interaction. Only 1 bid is live at a time, each new bid
        replaces your previous one (meaning you can only acquire 1 interaction
        from the auction).
      </span>
    ),
  },
  {
    question: "When can I interact?",
    answer: (
      <span>
        Your interactions can occur during any week during the date range of
        interactions, where auction winners have interactions generally
        scheduled first, with priority over giveaway winners. You will be
        matched with the content creator’s schedule, which is usually released
        week-by-week. The only thing a fan can control is their own
        availability. You will be notified if you have an interaction during the
        next week at the latest by midnight on Friday.
      </span>
    ),
  },
  {
    question: "How does scheduling work?",
    answer: (
      <span>
        Your interactions can occur during any week during the date range of
        interactions, where auction winners have interactions generally
        scheduled first, with priority over giveaway winners. You will be
        matched with the content creator’s schedule, which is usually released
        week-by-week. Fans can select their availability from Mon-Sun in general
        as long as they have an account, even before they've acquired any
        interactions (a minimum of 5 hours of the week have to be selected).
        Fans also select a preference for time of day (in their timezone),
        morning (6am to 10:30 am), noon (10:30 am to 1:30 pm), afternoon (1:30pm
        to 6pm), evening (6pm to 10:30pm), midnight (10:30pm to 1:30am), gremlin
        time (1:30 am to 6am). The first week after the campaign (starting
        Monday) is when interactions will start to be booked. When the campaign
        ends, creators are shown the availability of all of their fans
        continuously (shown X number of fans that are available for each time
        slot), and release a specific schedule week-by-week on Friday 11:59 pm
        at the latest (except for the first week where creators have until
        Sunday 11:59pm to lock in a schedule for the next week starting Monday),
        with the ability to choose how many interactions to do that week. We
        then allocate the best fitting fans as soon as the creator locks in
        their schedule for each week. Fans & creators can reschedule.
        Rescheduled fans will be added back into the matching algorithm pool &
        matched accordingly once again. By the last week, fans that creators are
        not able to meet are refunded. This means that if a fan or creator
        reschedules an interaction in the last week, the fan is refunded.
      </span>
    ),
  },
];

export default function FAQAccordian({
  data,
  setData,
  shouldAllowEdit = true,
}) {
  const [FAQ1, setFAQ1] = useState(data?.FAQAnswers[0]);
  const [FAQ2, setFAQ2] = useState(data?.FAQAnswers[1]);

  function handleEditFAQ1(e) {
    setFAQ1(e.target.value);
    setData({ FAQAnswers: { 0: e.target.value, 1: FAQ2 } });
  }
  function handleEditFAQ2(e) {
    setFAQ2(e.target.value);
    setData({ FAQAnswers: { 0: FAQ1, 1: e.target.value } });
  }

  return (
    <Box sx={{ flex: 1, width: "100%" }}>
      <Accordion sx={{ flex: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography>What can we do in an interaction?</Typography>
            <Chip label="Editable" />
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <TextField
              fullWidth
              multiline
              value={FAQ1}
              onChange={(e) => handleEditFAQ1(e)}
              variant="standard"
            />
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography>How are interactions carried out?</Typography>

            <Chip label="Editable" />
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <TextField
              fullWidth
              multiline
              value={FAQ2}
              onChange={(e) => handleEditFAQ2(e)}
              variant="standard"
            />
          </Typography>
        </AccordionDetails>
      </Accordion>

      {FAQs?.map((item, key) => {
        return (
          <Accordion sx={{ flex: 1 }} key={key}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography>{item.question}</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{item.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}
