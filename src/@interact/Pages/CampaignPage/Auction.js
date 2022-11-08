import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import Span from "@jumbo/shared/Span";
import { getDateFromTimestamp } from "@interact/Components/utils";
import {
  Divider, FormControl, InputAdornment, InputLabel, OutlinedInput, Stack, Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import InteractButton from "../../Components/Button/InteractButton";
import InfoTooltip from "../../Components/InfoTooltip";
import "./CampaignPage.css";

export default function Auction({ bids, campaignData, bidAction }) {
  // // console.log('bid looking at', Math.min(bids.length -1, campaignData?.numBidSlots-1), bids[Math.min(bids.length -1, campaignData?.numBidSlots-1)].price)

  const [bidAmount, setBidAmount] = useState(0);
  const [maxBidAmount, setMaxBidAmount] = useState(0);
  const [desiredRanking, setDesiredRanking] = useState(0);

  useEffect(()=>{
    document.getElementById("auctionCard").onmousemove = e => {
      for(const card of document.getElementsByClassName("auctionCard")) {
        const rect = card.getBoundingClientRect(),
       
              x = e.clientX - rect.left,
              y = e.clientY - rect.top;
    
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      };
    }
  })
  return (
    <JumboCardQuick
      title={"Auction"}
      id="auctionCard"
      sx={{ ml: 2, display: "flex", flexDirection: "column", minWidth: 400 }}
      headerSx={{ pb: 0 }}
      className="auctionCard"
    >
      <Stack direction="column">
          <Typography>
            Top <Span sx={{ color: "primary.main", fontWeight: 600 }}>3</Span> x
            60 min interactions
          </Typography>

          <Typography>
            <Span sx={{ color: "primary.main", fontWeight: 600 }}>17</Span> x 30
            min interactions 
          </Typography>
          
          <Typography>
            In total, the top <Span sx={{ color: "primary.main", fontWeight: 600 }}>20</Span> bidders at the end of the campaign
          </Typography>
          <Typography>
            (
              {getDateFromTimestamp({
              timestamp: campaignData?.endDate?.seconds,
              format: "h:mm a [EST on] dddd, MMMM Do",
              })}
            ) win interactions
          </Typography>
        </Stack>

        <br />
      <Stack id="autoBidSection" direction="column" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          <Typography variant="h5" color="text.secondary" mb={0}>
            Auto-bid
          </Typography>
          <InfoTooltip
            title="We'll automatically bid the lowest amount to stay at your desired
            rank on the leaderboard until your max bid is reached. If others bid
            more & your max bid amount is exceeded, your rank will be lowered (we
            will automatically bid your max bid price if it is exceeded and still
            try to get you the highest rank possible;
            you might still be on the leaderboard or you might not be,
            meaning no interaction (you'll be sent an email to increase your
            'Max bid amount')"
          />
        </Stack>

        <FormControl sx={{ my: 1 }}>
          <InputLabel htmlFor="desired-ranking">Desired ranking</InputLabel>
          <OutlinedInput
            id="desired-ranking"
            type="number"
            style={{ height: 50 }}
            value={desiredRanking}
            label="Desired ranking"
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
          <InputLabel htmlFor="max-bid-amount">Max bid amount</InputLabel>
          <OutlinedInput
            id="max-bid-amount"
            type="number"
            inputProps={{ step: ".50" }}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            style={{ height: 50 }}
            value={maxBidAmount}
            label="Max bid amount"
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
          Manual bid
        </Typography>

        {/* <div>Original Price: <span class='Highlight'>{'$'}20</span></div> */}
        <Stack direction="column" spacing={0.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>Enter bid price</Typography>
            <InfoTooltip
              title="If multiple parties bid the same price, the one who placed a bid the earliest will have the highest ranking"
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