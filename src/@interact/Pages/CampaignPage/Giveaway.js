import "./CampaignPage.css";
import { InfoCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  OutlinedInput,
  InputAdornment,
  Typography,
  Box,
  Container,
} from "@mui/material";
import InfoTooltip from "../../Components/InfoTooltip";
import InteractButton from "../../Components/Button/InteractButton";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";

export default function Giveaway({ campaignData }) {
  const Swal = useSwalWrapper();
  const buyGiveawayAlert = () => {
    Swal.fire({
      title: "Skill-testing question",
      text: "Before you make this purchase, you must correctly answer the math question below:",
      icon: "warning",
      html: (
        <div>
          <p>300+100+20 = ?</p>
          <input id="answer" type={"number"} />
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
      id="giveawayCard"
    >
      <div style={{ flex: 1 }}>
        <div>
          <span className="Highlight">50</span> x 30 minute interactions
        </div>
        <div>
          <span className="Highlight">50</span> winners will be randomly chosen
          from the ticketholders at the end of the campaign
        </div>
      </div>

      <div id="VIPGiveawaySection">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "10px 0",
          }}
        >
          <Typography variant="h6">VIP Entry</Typography>
        </div>

        <span>
          Chance multiplier: {chanceMultiplier * lossChanceMultiplier * 25}x
        </span>
        <div>
          <span>Chance of winning: 2.5%</span>
          <InfoTooltip
            title="Remember, the % chance of winning the raffle will go down as more fans
          join the raffle."
          />
        </div>

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
      </div>

      <Divider>or</Divider>

      <div
        id="freeGiveawaySection"
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "10px 0",
        }}
      >
        <Typography variant="h6">Free Entry</Typography>

        <span>
          Chance multiplier: {chanceMultiplier * lossChanceMultiplier}x
        </span>
        <Box sx={{ mb: 1 }}>
          <span>Chance of winning: 0.1%</span>
          <InfoTooltip
            title="Remember, the % chance of winning the raffle will go down as more fans
          join the raffle."
          />
        </Box>

        {/* <form
        //   action="http://localhost:4242/create-raffle-session"
        //   method="POST"
        > */}
        <InteractButton onClick={freeGiveawayAlert}>
          Get a free entry
        </InteractButton>
        {/* </form> */}
      </div>
    </JumboCardQuick>
  );
}
