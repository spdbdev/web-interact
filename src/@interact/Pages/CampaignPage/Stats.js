import "./CampaignPage.css";
import { useState } from "react";
import Socials from "@interact/Components/Socials/Socials";
import{Box,Divider,LinearProgress,Stack,Tooltip,Typography}from"@mui/material";
import InteractButton from "@interact/Components/Button/InteractButton";
import InfoTooltip from "@interact/Components/InfoTooltip";
import Span from "@jumbo/shared/Span";
import { formatMoney } from "@interact/Components/utils";


export default function Stats({ campaignData, bids }) {
	let stats = campaignData.stats ?? {};

	return (
		<Stack
		direction="row"
		justifyContent="space-between"
		alignItems="center"
		spacing={4}
		>
		<GoalDisplay campaignData={campaignData} bids={bids} />
		<Stack
			flex={1}
			direction="row"
			alignItems="center"
			justifyContent="space-evenly"
			spacing={4}
			>
			<Stack
			spacing={2}
			direction="row"
			divider={<Divider orientation="vertical" flexItem />}
			>
			<FollowButton />
			<StatDisplay statValue={stats?.numFollowers} statTitle="Followers" />
			<StatDisplay
				statValue={campaignData.numGiveawayEntries ?? 0}
				statTitle="Giveaway entries"
			/>
			<StatDisplay
				statValue={campaignData.numAuctionBids ?? 0}
				statTitle="Auction bids"
			/>
			{stats?.category ? (
				<StatDisplay statValue={stats?.category} statTitle="Category" />
			) : null}
			</Stack>
			<Stack spacing={1} direction="row" alignItems="center">
			<Socials type="discord" />
			<Socials type="tiktok" />
			<Socials type="twitter" />
			<Socials type="facebook" />
			<Socials type="instagram" />
			</Stack>
		</Stack>
		</Stack>
	);
}

export function FollowButton({ selected }) {
	let [selectedState, setSelectedState] = useState(selected);
	return (
		<InteractButton sx={{ width: 120 }} variant={selectedState ? "contained" : "outlined"}
			onClick={() => setSelectedState(!selectedState)}>
		<Span sx={{ color: selectedState ? "primary.contrastText" : "primary.main" }} >
			{selectedState ? "Following ✓" : "Follow"}
		</Span>
		</InteractButton>
	);
}

export function GoalDisplay({ campaignData, bids }) 
{
	let goalValue = parseFloat(campaignData.goalValue ?? 1);
	let campaignGoalTotal = parseFloat(campaignData.campaignVIPtotal ?? 0);

	bids = bids.slice(0, campaignData.numAuctionInteractions);
	let campaignAuctionsTotal = 0;
	bids.forEach((document, index) => {
		campaignAuctionsTotal += parseFloat(document.price);
	});
	campaignGoalTotal += campaignAuctionsTotal;

	return (
		<Box id="goalDisplay" sx={{ width: 400 }}>

			<LinearProgress variant="determinate" value={(campaignGoalTotal / goalValue) * 100} sx={{ color: "primary.main" }} />
		
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "flex-start", mt: 1, }} >

				<Typography variant="h1" sx={{ color: "primary.main", fontSize: 32, fontWeight: 500 }} >
					${Math.round(campaignGoalTotal)}
				</Typography>

				<Box sx={{display: "flex",flex: 1,flexDirection: "row",alignItems: "center",justifyContent: "flex-end",mt: 0.5,}} >
					<Typography variant="body" ml={2} >
						{campaignData.stats?.targetTagline}
						<Span sx={{ color: "primary.main", fontWeight: 500, mr: 0.5 }}>
						{" "}
						${formatMoney(goalValue)}
						</Span>
						<InfoTooltip title="Interactions will still occur even if the goal is not reached, the goal is non-binding." />
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}

export function StatDisplay({ statValue, statTitle }) {
	return (
		<Box>
		<Typography variant="h4" sx={{ color: "primary.main", fontWeight: 500, my: 0 }} >
			{statValue}
		</Typography>
		<Typography variant="caption" noWrap>
			{statTitle}
		</Typography>
		</Box>
	);
}
