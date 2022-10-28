// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

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

		process_auction_list(campaign_id, Number(data.numBidSlots));
		process_giveaway_list(campaign_id, Number(data.numRaffleSlots));
	});

	function process_auction_list(campaign_id, numBidSlots)
	{
		functions.logger.info("Collecting winners from bids", {structuredData: true});

		// Auction Winners
		var bids = [];
		db.collection("campaigns").doc(campaign_id).collection("bids").get().then(snapshot => {

			snapshot.forEach(document => {
				let doc = document.data();
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
		functions.logger.info("saving winners for "+collection, data, {structuredData: true});
		let coll_ref = db.collection("campaigns").doc(campaign_id).collection(collection);
		data.forEach(document => {
			coll_ref.add(document)
			.then((docRef) => {
				//console.log("Document written with ID: ", docRef.id);
			})
			.catch((error) => {
				console.error("Error adding document: ", error);
			});
		});
	}


	function process_giveaway_list(campaign_id, numRaffleSlots)
	{
		functions.logger.info("Collecting winners from GiveAway", {structuredData: true});

		var fans = [];
		var pool = [];
		var selected = [];
		db.collection("campaigns").doc(campaign_id).collection("raffles").get().then(snapshot => {
		
			snapshot.forEach(document => {
				let doc = document.data();
				doc.price = Number(doc.price);
				
				let type = 'free';
				if(doc.price > 0){
					type = 'vip';
					for (let index = 0; index < 25; index++) {
						pool.push({'id':document.id, 'type':type});
					}
				}else{
					pool.push({'id':document.id, 'type':type});
				}

				fans.push({'id':document.id, 'type':type})
			});

			if(fans.length <= numRaffleSlots) selected = fans;
			else{
				shuffle_array(pool);
				//console.log("pool:", pool);

				while (selected.length < numRaffleSlots) 
				{
					let rendom_index = Math.floor(Math.random() * pool.length);
					selected.push(pool[rendom_index]);

					let selected_obj_id = pool[rendom_index].id;
					pool = pool.filter(obj => obj.id != selected_obj_id);
				}
			}
			//console.log("selected:", selected);

			update_giveaway_winners(campaign_id, selected);
		}).catch(error => {
			console.error("Error getting document:", error);
		});
	}

	function update_giveaway_winners(campaign_id, data) {
		var coll_ref = db.collection("campaigns").doc(campaign_id).collection("raffles");
		data.forEach(document => {
			coll_ref.doc(document.id).update({
				"result": 1,
			})
			.then((docRef) => {
				//console.log("Document successfully updated!", docRef.id);
			}).catch((error) => {
				console.error("Error adding document: ", error);
			});
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