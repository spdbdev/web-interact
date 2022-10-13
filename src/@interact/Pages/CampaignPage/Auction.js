import "./CampaignPage.css";
import {
  Button,
  Divider,
  OutlinedInput,
  InputAdornment,
  useScrollTrigger,
  Tooltip,
  InputLabel,
  FormControl,
  Container,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { useState } from "react";
import InfoTooltip from "../../Components/InfoTooltip";
import InteractButton from "../../Components/Button/InteractButton";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import Span from "@jumbo/shared/Span";

export default function Auction({ bids, campaignData, bidAction }) {
  // // console.log('bid looking at', Math.min(bids.length -1, campaignData?.numBidSlots-1), bids[Math.min(bids.length -1, campaignData?.numBidSlots-1)].price)

  const [bidAmount, setBidAmount] = useState(0);
  const [maxBidAmount, setMaxBidAmount] = useState(0);
  const [desiredRanking, setDesiredRanking] = useState(0);

  return (
    <JumboCardQuick
      title={"Auction"}
      id="auctionCard"
      sx={{ ml: 2, display: "flex", flexDirection: "column", minWidth: 400 }}
      headerSx={{ pb: 0 }}
    >
      <Stack id="autoBidSection" direction="column" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          <Typography variant="h5" color="text.secondary" mb={0}>
            Auto-bidding
          </Typography>
          <InfoTooltip
            title="We'll automatically bid the lowest amount to stay at your desired
            rank on the leaderboard until your max bid is reached. If others bid
            more & your max bid amount is exceeded, your rank will be lowered;
            you might still be on the leaderboard or you might not be,
            meaning no interaction (you'll be sent an email to increase your
            'Max bid amount')."
          />
        </Stack>

        <FormControl sx={{ my: 1 }}>
          <InputLabel htmlFor="desired-ranking">Desired Ranking</InputLabel>
          <OutlinedInput
            id="desired-ranking"
            type="number"
            style={{ height: 50 }}
            value={desiredRanking}
            label="Desired Ranking"
            onChange={(e) => {
              // prevent values less than 0 or higher than 20.
              e.target.value < 0
                ? (e.target.value = 0)
                : e.target.value > 20
                ? (e.target.value = 20)
                : setDesiredRanking(e.target.value);
            }}
          />
        </FormControl>
        <FormControl sx={{ my: 1 }}>
          <InputLabel htmlFor="max-bid-amount">Max Bid Amount</InputLabel>
          <OutlinedInput
            id="max-bid-amount"
            type="number"
            inputProps={{ step: ".50" }}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            style={{ height: 50 }}
            value={maxBidAmount}
            label="Max Bid Amount"
            onChange={(e) => setMaxBidAmount(e.target.value)}
          />
        </FormControl>

        <InteractButton onClick={() => bidAction(bidAmount)}>
          Place auto-bid
        </InteractButton>
      </Stack>
      <Divider sx={{ my: 2 }}>or</Divider>
      <Stack id="normalBidSection" direction="column" spacing={2}>
        <Typography variant="h5" color="text.secondary" mb={0}>
          Manual bidding
        </Typography>

        <Stack direction="column">
          <Typography>
            Top <Span sx={{ color: "primary.main", fontWeight: 500 }}>3</Span> x
            60 min interactions
          </Typography>

          <Typography>
            <Span sx={{ color: "primary.main", fontWeight: 500 }}>17</Span> x 30
            min interactions
          </Typography>

          <Typography>
            The top 20 bidders win at the end of the campaign.
          </Typography>
        </Stack>

        {/* <div>Original Price: <span class='Highlight'>{'$'}20</span></div> */}

        <Stack direction="column" spacing={0.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>Enter bid price (total)</Typography>
            <InfoTooltip
              title="If multiple parties bid the same price, the ones who bid first will
            have higher rankings."
            />
          </Stack>
          <OutlinedInput
            type="number"
            inputProps={{ step: ".50" }}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            style={{ height: 50 }}
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
          />
          <Typography>
            Current lowest price to win:{" "}
            <Span sx={{ color: "primary.main", fontWeight: 500 }}>
              {"$"}
              {bids && campaignData
                ? `${
                    bids[
                      Math.min(bids.length - 1, campaignData.numBidSlots - 1)
                    ]?.price
                  }0`
                : "0"}
            </Span>
          </Typography>
        </Stack>

        {/* <form action="http://localhost:4242/create-auction-session" method="POST">  */}
        <InteractButton onClick={() => bidAction(bidAmount)}>
          Place bid
        </InteractButton>
        {/* </form> */}
      </Stack>
      <Typography variant="caption" color="text.hint">
        You won't be charged if you don't win.
      </Typography>
    </JumboCardQuick>
  );
}
