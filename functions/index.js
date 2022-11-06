// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();



/* 
	https://us-central1-interact2002.cloudfunctions.net/determineWinners?campaign_id=test12345

	top3AuctionWinners
	normalAuctionWinners 
	-------
	GiveAwayVipWinners
	GiveAwayFreeWinners
*/
exports.determineWinners = functions.https.onRequest((request, response) => 
{
	const campaign_id = request.query.campaign_id;
	var db = admin.firestore();

	db.collection("campaigns").doc(campaign_id).get().then(snapshot => {
		let data = snapshot.data();
		functions.logger.info("campaign data:", data, {structuredData: true});

		process_auction_list(campaign_id, Number(data.numAuctionInteractions));
		process_giveaway_list(campaign_id, Number(data.numGiveawayInteractions), data.person.id);
	});

	function process_auction_list(campaign_id, numAuctionInteractions)
	{
		functions.logger.info("Collecting winners from bids", {structuredData: true});

		// Auction Winners
		var bids = [];
		db.collection("campaigns").doc(campaign_id).collection("bids").get().then(snapshot => {

			snapshot.forEach(document => {
				let doc = document.data();
				doc.id = document.id;
				doc.price = Number(doc.price);
				bids.push(doc);
			});
			bids.sort((a, b)=> b.price - a.price);

			//console.log("Bids:", bids);
			if (bids.length > 3) 
			{
				var top3AuctionWinners = bids.splice(0, 3);
				saveAuctionWinners(campaign_id, "top3AuctionWinners", top3AuctionWinners);
				saveAuctionWinners(campaign_id, "normalAuctionWinners", bids);
			}
			else{
				saveAuctionWinners(campaign_id, "top3AuctionWinners", bids);
			}

		}).catch(error => {
			console.error("Error getting document:", error);
		})

	}

	function saveAuctionWinners(campaign_id, collection, data) 
	{
		//functions.logger.info("saving winners for "+collection, data, {structuredData: true});

		let coll_ref = db.collection("campaigns").doc(campaign_id).collection(collection);
		data.forEach(document => {
			let did = document.id;
			delete document.id;
			coll_ref.doc(did).set(document)
			.then((docRef) => {
				//console.log("Document written with ID: ", docRef.id);
			})
			.catch((error) => {
				console.error("Error adding document: ", error);
			});
		});
	}


	async function process_giveaway_list(campaign_id, numGiveawayInteractions, creator_id)
	{
		functions.logger.info("Collecting winners from GiveAway", {structuredData: true});

		var fans = []; // all users in giveAway
		var pool = []; // all users with multiplier entries
		var selected = []; // users which are selected
		var loosers = []; // users which are not get selected
		try{
			const snapshot = await db.collection("campaigns").doc(campaign_id).collection("Giveaway").get();
		
			for (let document of snapshot.docs) {
				let doc = document.data();
				doc.price = Number(doc.price);
				
				let previousLoss = 0;
				let docSnap = await db.collection("giveAwayLossHistory").doc(creator_id).collection('users').doc(document.id).get();
				if (docSnap.data()) {
					let previousLossObj = docSnap.data();
					previousLoss = Number(previousLossObj.numOfLoss);
					//console.log('previousLoss', document.id, previousLoss);
				}
				
				let noOfEntries = 1;
				if(doc.price > 0) noOfEntries = 25;
				if(previousLoss === 1) noOfEntries = noOfEntries * 2;
				else if(previousLoss > 1) noOfEntries = noOfEntries * 4;

				for (let index = 0; index < noOfEntries; index++) {
					pool.push({'id':document.id, 'previousLoss':previousLoss, 'obj':doc});
				}

				fans.push({'id':document.id, 'previousLoss':previousLoss, 'obj':doc});
			}	

			if(fans.length <= numGiveawayInteractions) selected = fans;
			else{
				loosers = fans;
				shuffle_array(pool);
				//console.log("pool:", pool);

				while (selected.length < numGiveawayInteractions) 
				{
					let rendom_index = Math.floor(Math.random() * pool.length);
					selected.push(pool[rendom_index]);

					let selected_obj_id = pool[rendom_index].id;
					pool = pool.filter(obj => obj.id !== selected_obj_id);
					loosers = loosers.filter(obj => obj.id !== selected_obj_id);

					if(selected.length % 9 === 0) {
						shuffle_array(pool);
						//console.log("pool:", pool);
					}
				}
			}
			//console.log("selected:", selected);
			//console.log("loosers:", loosers);

			if(selected.length > 0) update_giveaway_users(campaign_id, selected, 1, creator_id);
			if(loosers.length > 0) update_giveaway_users(campaign_id, loosers, 0 , creator_id);
		}
		catch(error) {
			console.error("Error getting document:", error);
		};
	}

	function update_giveaway_users(campaign_id, data, result, creator_id) 
	{
		var update_ref = db.collection("campaigns").doc(campaign_id).collection("Giveaway");

		if(result === 1) var add_ref = db.collection("campaigns").doc(campaign_id).collection("GiveawayWinners");
		else var add_ref = db.collection("campaigns").doc(campaign_id).collection("GiveawayLosers");

		var loss_ref = db.collection("giveAwayLossHistory").doc(creator_id).collection('users');
		
		data.forEach(document => {

			update_ref.doc(document.id).update({
				"result": result,
			})
			.then((docRef) => {
				//console.log("Document successfully updated!", docRef.id);
			}).catch((error) => {
				console.error("Error updating document: ", error);
			});

			add_ref.doc(document.id).set(document.obj)
			.then((docRef) => {
				//console.log("Document successfully added!", docRef.id);
			}).catch((error) => {
				console.error("Error adding document: ", error);
			});


			if(result === 0) {
				loss_ref.doc(document.id).set({
					"user_id":document.id,
					"numOfLoss": document.previousLoss + 1
				})
				.then((docRef) => {
					//console.log("Document successfully updated!", docRef.id);
				}).catch((error) => {
					console.error("Error adding document: ", error);
				});
			}
			else if(result === 1)
			{
				loss_ref.doc(document.id).delete();
			}
			
		});
	}

	function shuffle_array(array) {
		let currentIndex = array.length, randomIndex;
	  
		// While there remain elements to shuffle.
		while (currentIndex != 0) {
	  
			// Pick a remaining element.
		  	randomIndex = Math.floor(Math.random() * currentIndex);
		  	currentIndex--;
	  
		  	// And swap it with the current element.
		  	[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}
	  
		return array;
	}

	response.send("Collecting winners are done.");
});




exports.autoBidding = functions.firestore.document('/campaigns/{campaign_id}/bids/{bid_id}').onWrite(async (snap, context) => 
{
	// Exit when the data is deleted.
    if (!snap.after) {
		return null;
    }

	// Grab the current value of what was written to Firestore.
	let original = snap.after.data();
	let campaign_id = context.params.campaign_id;
	let bid_id = context.params.bid_id;
	console.log('autoBidding', campaign_id, bid_id, original);
	
	// Exit if this is not an auto bid.
	if(original.auto === false) return null;

	original.price = Number(original.price);
	original.maxBidPrice = Number(original.maxBidPrice);
	if (original.price >= original.maxBidPrice) {
		console.log('Already at maxBidPrice. ....', original.price, original.maxBidPrice);
		return null;
	}



	/* ***** start auto bidding process ***** */
	var db = admin.firestore();
	var bids_coll_ref = db.collection("campaigns").doc(campaign_id).collection('bids');
	const snapshot = await db.collection("campaigns").doc(campaign_id).collection("bids").get();
	
	var bids = [];
	var auto_bids = [];
	snapshot.forEach(document => {
		let doc = document.data();
		doc.id = document.id;
		doc.price = Number(doc.price);
		doc.maxBidPrice = Number(doc.maxBidPrice);
		doc.desiredRanking = Number(doc.desiredRanking);

		bids.push(doc);
		if (doc.auto && doc.price < doc.maxBidPrice) {
			auto_bids.push(doc);
		}
	});
	
	auto_bids.sort((a, b)=> a.desiredRanking - b.desiredRanking);
	auto_bids.forEach((document, index) => {
		bids.sort((a, b)=> b.price - a.price);
		//log_bids();

		perform_auto_bidding(document, index);
	});

	async function perform_auto_bidding(document, index)
	{
		console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>', index, document.id);
		const current_index = bids.findIndex(element => element.id == document.id);
		if (current_index == -1) {
			console.log('Error: unable to find index of current user in bids. findIndex is not working');
			return null;
		}

		let desiredRanking = document.desiredRanking-1;
		if (current_index <= desiredRanking){
			console.log('Already have Desired Ranking. ....', current_index, desiredRanking);
			return null;
		}

		let targetPrice = bids[desiredRanking].price;
		console.log('current_index:',current_index, 'desiredRanking:',desiredRanking, 'targetPrice:',targetPrice);
		if (targetPrice >= document.maxBidPrice) {
			document.price = document.maxBidPrice;
		} 
		else {
			document.price = (targetPrice + 0.5);
		}

		//bids[current_index].price = document.price;
		bids_coll_ref.doc(document.id).set({price:document.price},{merge:true});
	}

	function log_bids(){
		console.log('=========================== Sorted Auto Bids Start { ===========================');
		auto_bids.forEach((doc, index) => console.log(index, doc.auto, doc.desiredRanking-1, doc.price, doc.maxBidPrice, doc.id));
		console.log('--------');
		bids.forEach((doc, index) => console.log(index, '------', doc.price, '------',doc.id));
		console.log('=========================== Sorted Bids End { ===========================');
	}


	return null;
});