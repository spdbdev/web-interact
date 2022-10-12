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
} from "@mui/material";
import { useState } from "react";
import InfoTooltip from "../../Components/InfoTooltip";
import InteractButton from "../../Components/Button/InteractButton";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";

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
    >
      <div
        id="autoBidSection"
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "10px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: "10px 0",
          }}
        >
          <Typography variant="h6">Auto-bidding</Typography>

          <InfoTooltip
            title="We'll automatically bid the lowest amount to stay at your desired
            rank on the leaderboard until your max bid is reached. If others bid
            more & your max bid amount is exceeded, your rank will be lowered;
            you might still be on the leaderboard or you might not be,
            meaning no interaction (you'll be sent an email to increase your
            'Max bid amount')."
          />
        </div>

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
      </div>
      <Divider>or</Divider>
      <div
        id="normalBidSection"
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "10px 0",
        }}
      >
        <div
          style={{
            margin: "10px 0",
          }}
        >
          <Typography variant="h6">Manual bidding</Typography>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>
            Top <span className="Highlight">3</span> x 60 min interactions
          </div>
          <div>
            <span className="Highlight">17</span> x 30 min interactions
          </div>
          <div>The top 20 bidders win at the end of the campaign.</div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            margin: "10px 0",
          }}
        >
          {/* <div>Original Price: <span class='Highlight'>{'$'}20</span></div> */}
          <div>
            Current lowest price to win:{" "}
            <span class="Highlight">
              {"$"}
              {bids && campaignData
                ? bids[Math.min(bids.length - 1, campaignData.numBidSlots - 1)]
                    ?.price
                : "0"}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                paddingRight: 20,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              Enter bid price {"("}total{")"}{" "}
              <InfoTooltip
                title="If multiple parties bid the same price, the ones who bid first will
            have higher rankings."
              />
            </div>
            <OutlinedInput
              type="number"
              inputProps={{ step: ".50" }}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              style={{ height: 50 }}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
            />
          </div>
        </div>

        {/* <form action="http://localhost:4242/create-auction-session" method="POST">  */}
        <InteractButton onClick={() => bidAction(bidAmount)}>
          Place bid
        </InteractButton>
        {/* </form> */}
      </div>
      <span style={{ fontSize: 10, color: "#777", textAlign: "center" }}>
        You won't be charged if you don't win.
      </span>
    </JumboCardQuick>
  );
}
