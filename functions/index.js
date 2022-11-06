// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

// Initialize express server with cors middleware to allow for http access from browser
const express = require("express");
const cors = require("cors")({ origin: true });
const app = express();
app.use(cors);

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
exports.determineWinners = functions.https.onRequest((request, response) => {
  const campaign_id = request.query.campaign_id;
  var db = admin.firestore();

  db.collection("campaigns")
    .doc(campaign_id)
    .get()
    .then((snapshot) => {
      let data = snapshot.data();
      functions.logger.info("campaign data:", data, { structuredData: true });

      process_auction_list(campaign_id, Number(data.numBidSlots));
      process_giveaway_list(
        campaign_id,
        Number(data.numRaffleSlots),
        data.person.id
      );
    });

  function process_auction_list(campaign_id, numBidSlots) {
    functions.logger.info("Collecting winners from bids", {
      structuredData: true,
    });

    // Auction Winners
    var bids = [];
    db.collection("campaigns")
      .doc(campaign_id)
      .collection("bids")
      .get()
      .then((snapshot) => {
        snapshot.forEach((document) => {
          let doc = document.data();
          doc.price = Number(doc.price);
          bids.push(doc);
        });
        bids.sort((a, b) => b.price - a.price);

        //console.log("Bids:", bids);
        if (bids.length > 3) {
          var top3AuctionWinners = bids.splice(0, 3);
          saveAuctionWinners(
            campaign_id,
            "top3AuctionWinners",
            top3AuctionWinners
          );
          saveAuctionWinners(campaign_id, "normalAuctionWinners", bids);
        } else {
          saveAuctionWinners(campaign_id, "top3AuctionWinners", bids);
        }
      })
      .catch((error) => {
        console.error("Error getting document:", error);
      });
  }

  function saveAuctionWinners(campaign_id, collection, data) {
    functions.logger.info("saving winners for " + collection, data, {
      structuredData: true,
    });
    let coll_ref = db
      .collection("campaigns")
      .doc(campaign_id)
      .collection(collection);
    data.forEach((document) => {
      coll_ref
        .add(document)
        .then((docRef) => {
          //console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    });
  }

  async function process_giveaway_list(
    campaign_id,
    numRaffleSlots,
    creator_id
  ) {
    functions.logger.info("Collecting winners from GiveAway", {
      structuredData: true,
    });

    var fans = []; // all users in giveAway
    var pool = []; // all users with multiplier entries
    var selected = []; // users which are selected
    var loosers = []; // users which are not get selected
    try {
      const snapshot = await db
        .collection("campaigns")
        .doc(campaign_id)
        .collection("Giveaway")
        .get();

      for (let document of snapshot.docs) {
        let doc = document.data();
        doc.price = Number(doc.price);

        let previousLoss = 0;
        let docSnap = await db
          .collection("giveAwayLossHistory")
          .doc(creator_id)
          .collection("users")
          .doc(document.id)
          .get();
        if (docSnap.data()) {
          let previousLossObj = docSnap.data();
          previousLoss = previousLossObj.numOfLoss;
          console.log("previousLoss", document.id, previousLoss);
        }

        let noOfEntries = 1;
        if (doc.price > 0) noOfEntries = 25;
        if (previousLoss == 1) noOfEntries = noOfEntries * 2;
        else if (previousLoss > 1) noOfEntries = noOfEntries * 4;

        for (let index = 0; index < noOfEntries; index++) {
          pool.push({ id: document.id, previousLoss: previousLoss });
        }

        fans.push({
          id: document.id,
          previousLoss: previousLoss,
          price: doc.price,
          noOfEntries: noOfEntries,
        });
      }
      //console.log("pool-00:", pool);
      //console.log("fans-00:", fans);

      if (fans.length <= numRaffleSlots) selected = fans;
      else {
        loosers = fans;
        shuffle_array(pool);
        //console.log("pool:", pool);

        while (selected.length < numRaffleSlots) {
          let rendom_index = Math.floor(Math.random() * pool.length);
          selected.push(pool[rendom_index]);

          let selected_obj_id = pool[rendom_index].id;
          pool = pool.filter((obj) => obj.id != selected_obj_id);
          loosers = loosers.filter((obj) => obj.id != selected_obj_id);

          if (selected.length % 9 == 0) {
            shuffle_array(pool);
            //console.log("pool:", pool);
          }
        }
      }
      //console.log("selected:", selected);
      //console.log("loosers:", loosers);

      update_giveaway_users(campaign_id, selected, 1, creator_id);
      update_giveaway_users(campaign_id, loosers, 0, creator_id);
    } catch (error) {
      console.error("Error getting document:", error);
    }
  }

  function update_giveaway_users(campaign_id, data, result, creator_id) {
    var coll_ref = db
      .collection("campaigns")
      .doc(campaign_id)
      .collection("Giveaway");
    var loss_ref = db
      .collection("giveAwayLossHistory")
      .doc(creator_id)
      .collection("users");

    data.forEach((document) => {
      coll_ref
        .doc(document.id)
        .update({
          result: result,
        })
        .then((docRef) => {
          //console.log("Document successfully updated!", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });

      if (result == 0) {
        loss_ref
          .doc(document.id)
          .set({
            user_id: document.id,
            numOfLoss: document.previousLoss + 1,
          })
          .then((docRef) => {
            //console.log("Document successfully updated!", docRef.id);
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      } else if (result == 1) {
        loss_ref.doc(document.id).delete();
      }
    });
  }

  function shuffle_array(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  response.send("Collecting winners are done.");
});

// TODO

const CloudConvert = require("cloudconvert");
const getCampaignImageHTML = require("./CampaignSummaryImage");

// https://us-central1-interact2002.cloudfunctions.net/getCampaignImage?campaign_id=test12345
exports.getCampaignImage = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    const {
      title,
      categories,
      creatorName,
      description,
      thumbnailUrl,
      startDate,
      endDate,
      goal,
      goalValue,
      numInteractions,
      campaignUrl,
    } = request.body.data;

    // THIS IS USING ALINA PAVELS API KEY, WHICH SHOULD BE SWITCHED TO ONE RUN BY INTERACT!!
    // THIS WILL EVENTUALLY RUN INTO RATE LIMITS, AND WILL BE ROTATED ONE MONTH AFTER MY LAST DAY
    const cloudConvert = new CloudConvert(
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZjBhNzQ5MzE4ZmJmZTRlNmQzZTBlODQ2ZTM4ZWZlMmViZjAzNGExZmFhMDFjNGYzNjIwNzAwMjVhYjhjNzViNTQ2NzBhM2NkYjU0NmRiYTQiLCJpYXQiOjE2Njc0NTU4MzguOTczMzgsIm5iZiI6MTY2NzQ1NTgzOC45NzMzODEsImV4cCI6NDgyMzEyOTQzOC45NjkxODUsInN1YiI6IjYwNTc1Nzg1Iiwic2NvcGVzIjpbInRhc2sud3JpdGUiLCJ0YXNrLnJlYWQiLCJ3ZWJob29rLnJlYWQiLCJ3ZWJob29rLndyaXRlIl19.l6CHQB5JyvpGLAkKZnZWqycjpomnp1FxdGoDR34FFl1rQO0H5J304xhy7zWT_pc2u7RoHqgfiL33Tb5uH-OGujJVXl0lSBnZaE5QainDQvKyDyjSXDzy2UqrvlTWwDGrcpT31vFpxPBYbF94ihxKpuD-gwUamPyXDVzPBlZdU8ipPnivv7kAox_e1EwKMInrhWwGfyW-F0J5kj_OlsTYpGeEjU6teNHw3XSEHkCWkQtLeacGYo-31UZaQ6diaG7UGrgqSVbXNQeo1hzYHbYrrvpNZEs-0Q7nn5mpvSShVAstZcxEcHA-2F5I3UD8t7pSsom4WclUS9sq0ZdA72o3q6hkqeaozf0eVHBQxeXDW05IB18iKcGMajfnRyUMs3C08A0_GnvQhEyCeJwlpM96-QU8OszzahJkKPBHlgsOKO7G-lzOwdX-85g2bhH5wlaX4pAYoMeEa8N8pl_ubhptaEZcndNwa6B36QCA9QQl0qoUsB80Kv2prKYkWXUUDD3JqK0FQVjX00i0N4I7Fb-ZhhUcxJIwDxLCgEv31593ECQB1Ip7HyJThBDtArJ6O1Yn08JEuQMWn14ziU_pMW--GNk_KLWH37ZR_vM44GmgSwrs71H4_QbEmk-GxvxFMeN4kQQiWWr-0dOs1uUOSda5Ygh8seUgPRV0buxnZe1gHrQ",
      false
    );

    const CAMPAIGN_SUMMARY_IMAGE_HTML_TEMPLATE = getCampaignImageHTML({
      title,
      categories: categories,
      creatorName,
      description,
      thumbnailUrl,
      startDate,
      endDate,
      goal,
      goalValue,
      numInteractions,
      campaignUrl,
    });

    async function generateImgFromCampaignData() {
      let jobInit = await cloudConvert.jobs.create({
        tasks: {
          "import-html": {
            operation: "import/raw",
            file: CAMPAIGN_SUMMARY_IMAGE_HTML_TEMPLATE,
            filename: `Campaign-Panel-${creatorName}-${title}.html`,
          },
          "convert-html-to-png": {
            operation: "convert",
            input_format: "html",
            output_format: "png",
            engine: "chrome",
            input: ["import-html"],
            screen_width: 530,
            screen_height: 1050,
          },
          "export-png-to-url": {
            operation: "export/url",
            input: ["convert-html-to-png"],
            inline: false,
            archive_multiple_files: false,
          },
        },
        tag: "jobbuilder",
      });
      const job = await cloudConvert.jobs.wait(jobInit.id);

      const pngConversionTask = job.tasks.filter(
        (task) => task.name === "export-png-to-url"
      )[0];

      return pngConversionTask?.result?.files[0];
    }

    try {
      const file = await generateImgFromCampaignData();

      response.send({
        status: "success",
        data: { file },
      });
    } catch (error) {
      return { error };
    }
  });
});
