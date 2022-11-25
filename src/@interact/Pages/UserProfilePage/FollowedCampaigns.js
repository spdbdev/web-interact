import React from "react";
import "./UserProfilePage.css";
import MeetingBlocks from "./MeetingBlocks";


import { useEffect, useRef, useState } from "react";
import InteractFlashyButton from "@interact/Components/Button/InteractFlashyButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import CampaignCategorySelect from "../CreateCampaignPage/CampaignCategorySelect";
import { auth, db, logout } from "@jumbo/services/auth/firebase/firebase";
import { collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import { getDateFromTimestamp } from "app/utils";
import CampaignsRow from "./CampaignsRow";



function FollowedCampaigns() {
	
	let { id } = useParams();
  	const [user, loading, error] = useAuthState(auth);
	let user_id = id;
	/* let user = {
		uid: "wKKU2BUMagamPdJnhjw6iplg6w82",
		photoURL:
		"https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg",
		name: "biby",
		email: "bibyliss@gmail.com",
		customerId: "cus_MlMuNeDDsNVt2Z",
	}; */


	const meetingBlockRef = useRef(null);
	const navigate = useNavigate();
	const [currentCampaigns, setCurrentCampaigns] = useState([]);
	const [interactionCampaigns, setInteractionCampaigns] = useState([]);

	const getCampaignData = async () => {
		let current_campaigns = [];
		let interaction_campaigns = [];

		const docSnap = await getDocs(collection(db, "campaigns"));
		if (!docSnap.empty) {
		for (let document of docSnap.docs) 
		{
			let doc = document.data();

			let endDate = doc.endDate?.seconds;
			let new_doc = {
				title: doc.title,
				endDateTime: getDateFromTimestamp({
					timestamp: endDate
				}),
				goal: doc.goal,
				goalValue: doc.goalValue,
				username: doc.person?.username
			};


			current_campaigns.push(new_doc);

			// check user in these collections if found then add this campaign into interaction_campaigns
			// if (
			// 	(await cus(document.id, "top3AuctionWinners")) === true ||
			// 	(await cus(document.id, "normalAuctionWinners")) === true ||
			// 	(await cus(document.id, "GiveawayWinners")) === true
			// 	) 
			// {
			// 	interaction_campaigns.push(new_doc);
			// }
		}
		}
		setCurrentCampaigns(current_campaigns);
		setInteractionCampaigns(interaction_campaigns);
	};

	// checkUserSelection
	const cus = async (campaignID, collectionName) => {
		const docSnap = await getDoc(doc(db, "campaigns", campaignID, collectionName, user?.uid));
		if (docSnap.exists()) {
			return true;
		}
		return false;
	};

	useEffect(() => {
		getCampaignData();
		meetingBlockRef.current.scrollTo(360 * 4, 0);
	}, [user, loading, id]);

	return (
		<div style={{ paddingLeft: 100, paddingRight: 100 }}>
		<div
			ref={meetingBlockRef}
			className="horizontalScroll"
			style={{
				display: "flex",
				overflowX: "scroll",
				padding: 20,
				marginLeft: -120,
				paddingLeft: 140,
				marginRight: -20,
			}}
			>
			<MeetingBlocks passed={true} />
			<MeetingBlocks passed={true} />
			<MeetingBlocks passed={true} />
			<MeetingBlocks passed={true} />
			<MeetingBlocks />
			<MeetingBlocks />
			<MeetingBlocks />
			<MeetingBlocks />
			<MeetingBlocks />
			<MeetingBlocks />
		</div>
		<div style={{ margin: 20 }}>
		</div>
		<br></br>
		<CampaignsRow
			currentCampaigns={currentCampaigns}
			heading="Followed campaigns"
		/>
		<CampaignsRow
			currentCampaigns={interactionCampaigns}
			heading="Interaction acquired"
		/>
		</div>
	);
}

export default FollowedCampaigns;
