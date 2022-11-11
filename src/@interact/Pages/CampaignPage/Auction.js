import { formatMoney } from "@interact/Components/utils";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import Span from "@jumbo/shared/Span";
import { getDateFromTimestamp } from "@interact/Components/utils";
import {
  Divider, FormControl, InputAdornment, InputLabel, OutlinedInput, Stack, Typography, Select, MenuItem
} from "@mui/material";
import { useEffect, useState } from "react";
import InteractButton from "../../Components/Button/InteractButton";
import InfoTooltip from "../../Components/InfoTooltip";
import "./CampaignPage.css";



export default function Auction({isCampaignEnded, bids, campaignData, bidAction }) {

	const [bidAmount, setBidAmount] = useState(0);
	const [autoBidAmount, setAutoBidAmount] = useState(0);
	const [minBidAmount, setMinBidAmount] = useState(0);
	const [maxBidAmount, setMaxBidAmount] = useState(0);
	const [numAuctionInteractions, setNumAuctionInteractions] = useState(0);
	const [desiredRanking, setDesiredRanking] = useState(1);

	useEffect(() => {
		if (Object.entries(campaignData).length > 0 && bids.length > 0) {
			if (campaignData.numAuctionInteractions) {
				setNumAuctionInteractions(campaignData.numAuctionInteractions);
			}

			if (bids.length >= campaignData.numAuctionInteractions) 
			{
				let lastPrice = bids[campaignData.numAuctionInteractions - 1].price;
				if (lastPrice >= campaignData.auctionMinBid) {
					setMinBidAmount(parseFloat(lastPrice) + 0.5);
					setBidAmount(parseFloat(lastPrice) + 0.5);
				} else {
					setMinBidAmount(campaignData.auctionMinBid);
					setBidAmount(campaignData.auctionMinBid);
				}
			} else {
				setMinBidAmount(campaignData.auctionMinBid);
				setBidAmount(campaignData.auctionMinBid);
			}
		}
	}, [campaignData, bids]);

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

	const handleBidAmount = function(e){
		if(parseInt(e.target.value) >= parseInt(minBidAmount) && parseInt(e.target.value) <= parseInt(maxBidAmount)){
			setBidAmount(e.target.value);
		}
	}

	const onAutoBidAmountChange = function(e){
		if(parseInt(e.target.value) >= parseInt(minBidAmount) && parseInt(e.target.value) <= parseInt(maxBidAmount)){
			setAutoBidAmount(e.target.value);
		}
	}

	const handleMaxBidAmount = function(value){
		if(bids.length > 0)
		{
			let sortedBids = bids;
			let bidAtDesiredRanking = sortedBids[parseInt(value) - 1];
			let thirtyPer = (bidAtDesiredRanking?.price/100) * 30;
			let maxIncrement = 5;
			if(thirtyPer > 5){
				maxIncrement = thirtyPer;
			}
			maxIncrement = Math.round(maxIncrement*2)/2;

			setMaxBidAmount(parseFloat(bidAtDesiredRanking?.price) + maxIncrement);
			setAutoBidAmount(parseFloat(bidAtDesiredRanking?.price) + maxIncrement);
			if(!bidAtDesiredRanking){
				setMaxBidAmount(0.00);
				setAutoBidAmount(0.00);
			}
		}

		if(parseInt(value) > bids.length){
			setMaxBidAmount(0.00);
		}
	}

  	
	const handleDesiredRanking = function(e){
		// prevent values less than 0 or higher than 20.
		console.log("Num interactions",campaignData?.numAuctionInteractions)
		e.target.value < 1
		? (e.target.value = 1)
		: e.target.value > parseInt(campaignData?.numAuctionInteractions)
		? (e.target.value = campaignData?.numAuctionInteractions)
		: setDesiredRanking(e.target.value);
		handleMaxBidAmount(e.target.value);
	}

	useEffect(()=>{
		handleMaxBidAmount(desiredRanking);
	},[])

	function nth(n){return["st","nd","rd"][((n+90)%100-10)%10-1]||"th"}

	const options = [];
	for (let i = 1; i <= parseInt(campaignData?.numAuctionInteractions); i++) {
		options.push(<MenuItem value={i}>{i}{nth(i)}</MenuItem>);
	}

	return (
		<JumboCardQuick
		title={"Auction"}
		id="auctionCard"
		sx={{ ml: 2, display: "flex", flexDirection: "column", minWidth: 400 }}
		headerSx={{ pb: 0 }}
		className="auctionCard"
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
			<Select
				id="desired-ranking"
				type="number"
				style={{ height: 50 }}
				value={desiredRanking}
				label="Desired Ranking"
				onChange={(e) => handleDesiredRanking(e)}
			>
				{options}
			</Select>
			</FormControl>
			<FormControl sx={{ my: 1 }}>
			<InputLabel htmlFor="max-bid-amount">Max Bid Amount</InputLabel>
			<OutlinedInput
				id="max-bid-amount"
				type="number"
				inputProps={{ step: ".50" }}
				startAdornment={<InputAdornment position="start">$</InputAdornment>}
				style={{ height: 50 }}
				value={formatMoney(autoBidAmount)}
				label="Max Bid Amount"
				onChange={(e) =>  onAutoBidAmountChange(e)}
			/>
			</FormControl>

			<InteractButton disabled={isCampaignEnded} onClick={() => bidAction(autoBidAmount,true,desiredRanking,maxBidAmount)}>
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
				value={formatMoney(bidAmount)}
				onChange={(e) => handleBidAmount(e)}
			/>
			<Typography>
				Current lowest price to win:{" "}
				<Span sx={{ color: "primary.main", fontWeight: 500 }}>
				{"$"}
				{minBidAmount
					&& `${ formatMoney(
						minBidAmount
					)}`}
				</Span>
			</Typography>
			</Stack>

			{/* <form action="http://localhost:4242/create-auction-session" method="POST">  */}
			<InteractButton disabled={isCampaignEnded} onClick={() => bidAction(bidAmount,false,null,null,minBidAmount)}>
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
