import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import Span from "@jumbo/shared/Span";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import { Box, Divider, Input, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import InteractButton from "../../Components/Button/InteractButton";
import InfoTooltip from "../../Components/InfoTooltip";
import "./CampaignPage.css";

export default function Giveaway({
  campaignData,
  hasUserClaimedFreeEntry,
  hasUserPurchasedVIPEntry,
  setHasUserClaimedFreeEntry,
  setHasUserPurchasedVIPEntry,
  setHasUserEnteredGiveaway,
}) {
  const Swal = useSwalWrapper();
  const buyGiveawayAlert = () => {
    Swal.fire({
      title: "Skill-testing question",
      text: "Before you make this purchase, you must correctly answer the math question below:",
      icon: "warning",
      html: (
        <div>
          <p>300+100+20 = ?</p>
          <Input id="answer" type={"number"} />
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Wait, cancel!",
      reverseButtons: true,
      preConfirm: () => {
        const answer = Swal.getPopup().querySelector("#answer").value;
        if (answer != 420) {
          Swal.showValidationMessage(`Please try again.`);
        }
        return { answer: answer };
      },
    }).then((result) => {
      if (result.value.answer == 420) {
        // setHasUserEnteredGiveaway(true); can't set these to true until we get a confirmation from stripe.
        //setHasUserPurchasedVIPEntry(true);
        Swal.fire(
          "Correct!",
          "You'll now be taken to the payment page.",
          "success"
        );
      } else {
        Swal.fire(
          "Incorrect.",
          "We were expecting a different answer... try again!",
          "error"
        );
      }
    });
  };
  const freeGiveawayAlert = () => {
    Swal.fire({
      title: "Claim free entry?",
      text: "Would you like to claim this free giveaway entry?",
      showCancelButton: true,
      confirmButtonText: "Yes, Claim!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        setHasUserClaimedFreeEntry(true);
        setHasUserEnteredGiveaway(true);
        Swal.fire(
          "Claimed!",
          "You've claimed a free entry for this giveaway. Good luck!",
          "success"
        );
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        // close alert
      }
    });
  };
  useEffect(()=>{
    document.getElementById("giveawayCard").onmousemove = e => {
      for(const card of document.getElementsByClassName("giveawayCard")) {
        const rect = card.getBoundingClientRect(),
       
              x = e.clientX - rect.left,
              y = e.clientY - rect.top;
    
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      };
    }
  })
 
  // these are dummy values and will be replaced with legit DB variables
  const chanceMultiplier = 1;
  const lossChanceMultiplier = 2; // this can be 2 or 4, corresponding to 1 or 2 past losses in a giveaway (for same creator)
  return (
    <JumboCardQuick
      title={"Giveaway"}
      sx={{
        
        ml: 2,
        display: "flex",
        flexDirection: "column",
        width: 400,
      }}
      headerSx={{ pb: 0 }}
      wrapperSx={{
        pt: 1,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      id="giveawayCard"
      className="giveawayCard"
    >
      <Box>
        <div>
          <Span sx={{ color: "primary.main", fontWeight: 500 }}>50</Span> x 30
          minute interactions
        </div>
        <div>
          <Span sx={{ color: "primary.main", fontWeight: 500 }}>50</Span>{" "}
          winners will be randomly chosen from the ticketholders at the end of
          the campaign
        </div>
      </Box>

      <Box id="VIPGiveawaySection">
        <Typography variant="h5" color="text.secondary" mt={2}>
          VIP entry
        </Typography>

        <span>
          Chance multiplier: {chanceMultiplier * lossChanceMultiplier * 25}x
        </span>
        <Stack direction="row" spacing={1} alignItems="center">
          <span>Chance of winning: 2.5%</span>
          <InfoTooltip
            title="Remember, the % chance of winning will go down as more fans
          join the giveaway."
          />
        </Stack>

        <Box sx={{ display: "flex", flexDirection: "row", mb: 2, mt: 1 }}>
          <Box
            sx={{
              flex: 1,
              p: 1,
              mr: 1,
              backgroundColor: "rgba(120, 47, 238, 0.1)",
              borderRadius: 1,
              border: "2px dashed rgba(120, 47, 238, 1)",
            }}
          >
            <span className="Highlight">${campaignData?.rafflePrice}0</span>
          </Box>
          {/* <form
          action="http://localhost:4242/create-raffle-session"
          method="POST"
        > */}
          <InteractButton onClick={buyGiveawayAlert}>
            Buy VIP entry
          </InteractButton>
          {/* </form> */}
        </Box>
      </Box>

      <Divider>or</Divider>

      <Box
        id="freeGiveawaySection"
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "10px 0",
        }}
      >
        <Typography variant="h5" color="text.secondary">
          Free entry
        </Typography>

        <span>
          Chance multiplier: {chanceMultiplier * lossChanceMultiplier}x
        </span>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }} alignItems="center">
          <span>Chance of winning: 0.1%</span>
          <InfoTooltip
            title="Remember, the % chance of winning will go down as more fans
          join the giveaway."
          />
        </Stack>

        {/* <form
        //   action="http://localhost:4242/create-raffle-session"
        //   method="POST"
        > */}
        <InteractButton
          onClick={freeGiveawayAlert}
          disabled={hasUserClaimedFreeEntry || hasUserPurchasedVIPEntry}
        >
          Get a free entry
        </InteractButton>
        {/* </form> */}
      </Box>
    </JumboCardQuick>
  );
}
