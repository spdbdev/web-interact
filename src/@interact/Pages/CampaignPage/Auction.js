import { useState, useEffect, useRef } from "react";
import InfoTooltip from "../../Components/InfoTooltip";
import InteractButton from "../../Components/Button/InteractButton";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import Span from "@jumbo/shared/Span";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "@jumbo/services/auth/firebase/firebase";
import { useNavigate, useParams } from "react-router-dom";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { formatMoney, getDateFromTimestamp } from "@interact/Components/utils";
import {
  query,
  collection,
  getDocs,
  where,
} from "firebase/firestore";
import "./CampaignPage.css";
import {
  Divider,
  OutlinedInput,
  InputAdornment,
  InputLabel,
  FormControl,
  Typography,
  Box,
  Stack,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton
} from "@mui/material";
import WestIcon from '@mui/icons-material/West';
import Modal from "@mui/material/Modal";
import InteractFlashyButton from "@interact/Components/Button/InteractFlashyButton";
import Swal from "sweetalert2";
import { getRequest, postRequest } from "../../../utils/api";
import ConfirmAuctionPopup from "./ConfirmAuctionPopup";
import { fetchUserByName, followUser } from "../../../firebase";
import PaymentRequestForm from "@interact/Components/Stripe/PaymentRequestForm";

import "@interact/Components/Stripe/Stripe.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  padding: 0,
  width: 400,
  borderRadius: 15
};

export default function Auction({
  isCampaignEnded,
  bids,
  campaignData,
  bidAction,
}) {
  const [bidAmount, setBidAmount] = useState(0);
  const [autoBidAmount, setAutoBidAmount] = useState(0);
  const [minBidAmount, setMinBidAmount] = useState(0);
  const [maxBidAmount, setMaxBidAmount] = useState(0);
  const [numAuctionInteractions, setNumAuctionInteractions] = useState(0);
  const [desiredRanking, setDesiredRanking] = useState(1);
  const [manualRanking, setManualRanking] = useState(1);

  const [user, loading, error] = useAuthState(auth);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const stripe = useStripe();
  const [open, setOpen] = useState(false);
  const elements = useElements();
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup1, setOpenPopup1] = useState(false);
  const [selectPopUp, setselectPopUp] = useState(1);
  const paymentRef = useRef();
  const [selectPaymentMethod, setSelectPaymentMethod] = useState("");

  useEffect(() => {
    if (Object.entries(campaignData).length > 0 && bids.length > 0) {
      if (campaignData.numAuctionInteractions) {
        setNumAuctionInteractions(campaignData.numAuctionInteractions);
      }

      if (bids.length >= campaignData.numAuctionInteractions) {
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

  useEffect(() => {
    document.getElementById("auctionCard").onmousemove = (e) => {
      for (const card of document.getElementsByClassName("auctionCard")) {
        const rect = card.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      }
    };
  });

  const handleBidAmount = function (e) {
    if (
      parseInt(e.target.value) >= parseInt(minBidAmount) &&
      parseInt(e.target.value) <= parseInt(maxBidAmount)
    ) {
      setBidAmount(e.target.value);
    }

    for (let i = 0; i < bids.length; i++) {
      if (e.target.value < Number(bids[i].price)) {
        setManualRanking(i + 1);
        return;
      }
    }
  };

  const onAutoBidAmountChange = function (e) {
    if (
      parseInt(e.target.value) >= parseInt(minBidAmount) &&
      parseInt(e.target.value) <= parseInt(maxBidAmount)
    ) {
      setAutoBidAmount(e.target.value);
    }
  };

  const handleMaxBidAmount = function (value) {
    if (bids.length > 0) {
      let sortedBids = bids;
      let bidAtDesiredRanking = sortedBids[parseInt(value) - 1];
      let thirtyPer = (bidAtDesiredRanking?.price / 100) * 30;
      let maxIncrement = 5;
      if (thirtyPer > 5) {
        maxIncrement = thirtyPer;
      }
      maxIncrement = Math.round(maxIncrement * 2) / 2;

      setMaxBidAmount(parseFloat(bidAtDesiredRanking?.price) + maxIncrement);
      setAutoBidAmount(parseFloat(bidAtDesiredRanking?.price) + maxIncrement);
      if (!bidAtDesiredRanking) {
        setMaxBidAmount(0.0);
        setAutoBidAmount(0.0);
      }
    }

    if (parseInt(value) > bids.length) {
      setMaxBidAmount(0.0);
    }
  };

  const handleDesiredRanking = function (e) {
    // prevent values less than 0 or higher than 20.
    console.log("Num interactions", campaignData?.numAuctionInteractions);
    e.target.value < 1
      ? (e.target.value = 1)
      : e.target.value > parseInt(campaignData?.numAuctionInteractions)
      ? (e.target.value = campaignData?.numAuctionInteractions)
      : setDesiredRanking(e.target.value);
    handleMaxBidAmount(e.target.value);
  };

  useEffect(() => {
    handleMaxBidAmount(desiredRanking);
  }, []);

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [userCostomerId, setUserCostomerId] = useState(null);

  const handleBackPopup = () => {
    setOpen(false);
    if (selectPopUp === 1) {
      setOpenPopup(true);
    } else {
      setOpenPopup1(true);
    }
  }
  const handleOpen = () => {
    setOpen(true);
  }
  const handleClose = () => setOpen(false);
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      stripe
        .createPaymentMethod({
          type: "card",
          card: elements.getElement(CardNumberElement),
        })
        .then((resp) => {
          console.log(resp.paymentMethod);
          const pmid = resp.paymentMethod.id;
          if (pmid && userCostomerId) {
            getRequest(`/method/attach/${userCostomerId}/${pmid}`)
              .then((resp) => {
                setOpen(false);
                if (resp.data.added) {
                  setPaymentMethods(resp.data.paymentmethod.data);
                  setSelectPaymentMethod(resp.data.paymentmethod.data[0].id);
                  if (selectPopUp === 1) {
                    setOpenPopup(true);
                  } else {
                    setOpenPopup1(true);
                  }
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "An error occured",
                  });
                }
              })
              .catch((err) => {
                /*Handle Error */
              });
          }
          console.log(resp);
        });
    } catch (err) {
      /* Handle Error*/
    }
  };

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const colledoc = await getDocs(q);
      const data = colledoc.docs[0].data();
      data.id = colledoc.docs[0].id;
      setUserCostomerId(data.customerId);
      setCurrentUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  const verificationOfBid = () => {
    if (!user) return navigate("/");
    if (desiredRanking > 0) {
      getRequest(`/customer/method/${userCostomerId}`)
        .then((resp) => {
          const mdata = resp.data.paymentmethod.data;
          console.log(resp.data.paymentmethod.data);
          if (mdata.length > 0) {
            setPaymentMethods(resp.data.paymentmethod.data);
            setSelectPaymentMethod(resp.data.paymentmethod.data[0].id);
            // setOpen(true);
            setOpenPopup(true);
          } else {
            setOpen(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please Enter Your Desired Rank",
      });
    }

    // bidAction(bidAmount);
  };
  const verificationOfBid1 = () => {
    console.log("manualbid");
    console.log(bids);

    console.log(manualRanking);
    if (!user) return navigate("/");
    getRequest(`/customer/method/${userCostomerId}`)
      .then((resp) => {
        const mdata = resp.data.paymentmethod.data;
        console.log(resp.data.paymentmethod.data);
        if (mdata.length > 0) {
          setPaymentMethods(resp.data.paymentmethod.data);
          setSelectPaymentMethod(resp.data.paymentmethod.data[0].id);
          // setOpen(true);
          setOpenPopup1(true);
        } else {
          setOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // bidAction(bidAmount);
  };
  const closefunction = () => {
    setselectPopUp(1);
    setOpenPopup(false);
  };
  const closefunction1 = () => {
    setselectPopUp(2);
    setOpenPopup1(false);
  };

  useEffect(() => {
    fetchUserName();
  }, [user]);

  function nth(n) {
    return ["st", "nd", "rd"][((((n + 90) % 100) - 10) % 10) - 1] || "th";
  }
  const options = [];
  for (let i = 1; i <= parseInt(campaignData?.numAuctionInteractions); i++) {
    options.push(
      <MenuItem value={i} key={i}>
        {i}
        {nth(i)}
      </MenuItem>
    );
  }
  const followCampaign = async () => {
    const targetUser = await fetchUserByName(campaignData?.person?.username);
    if (user === undefined) {
      console.log("You need to sign in to follow user");
      navigate("/a/signin");
      return;
    }
    if (!targetUser?.followers?.includes(user?.id)) {
      followUser(user, targetUser);
    }
  };
  const handleBidClick = async (
    amount,
    auto = false,
    desiredRanking = null,
    maxBidPrice = null,
    minBidPrice = null
  ) => {
    followCampaign();
    bidAction(amount, auto, desiredRanking, maxBidPrice, minBidPrice);
  };
  return (
    <>
      <ConfirmAuctionPopup
        openstate={openPopup}
        settheOpenPopup={setOpenPopup}
        closefunction={closefunction}
        allprimarymethod={paymentMethods}
        desiredRanking={desiredRanking}
        onaddclick={handleOpen}
        price={maxBidAmount}
        userCostomerId={userCostomerId}
        bidAction={() => bidAction(autoBidAmount,true,desiredRanking,maxBidAmount)}
        selectPaymentMethod={selectPaymentMethod}
        setSelectedPaymentMethod={setSelectPaymentMethod}
        autobid={true}
      />

      <ConfirmAuctionPopup
        openstate={openPopup1}
        settheOpenPopup={setOpenPopup1}
        closefunction={closefunction1}
        allprimarymethod={paymentMethods}
        desiredRanking={manualRanking}
        onaddclick={handleOpen}
        price={bidAmount}
        userCostomerId={userCostomerId}
        bidAction={() => bidAction(bidAmount,false,null,null,minBidAmount)}
        selectPaymentMethod={selectPaymentMethod}
        setSelectedPaymentMethod={setSelectPaymentMethod}
        autobid={false}
      />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="wrapper">
            <div className="innerWrapper">
              <IconButton onClick={handleBackPopup} style={{ padding: 0, marginBottom: '15px' }}> <WestIcon /> </IconButton>
              <PaymentRequestForm price={maxBidAmount} handleSubmit={handleClose}/>
              <div className="payment-divider" />
              <div className="stripe-card-wrapper">
                <div className="number_input">
                    <label htmlFor="#" className="stripe-card_field_label">Card number</label>
                    <CardNumberElement className={"number_input"}  options={{ showIcon: true }} />
                </div>
                <div className="expiry_input">
                    <label htmlFor="#" className="stripe-card_field_label">Expiration</label>
                    <CardExpiryElement className={"expiry_input"} />
                </div>
                <div className="cvc_input">
                    <label htmlFor="#" className="stripe-card_field_label">CVC</label>
                    <CardCvcElement className={"cvc_input"} />
                </div>
              </div>
              <FormControlLabel style={{marginTop: '10px'}}
                control={<Checkbox disabled checked sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}/>}
                label={<Typography style={{fontSize: '14px'}}>Save payment info for future purchases.</Typography>}
              />
              <InteractFlashyButton onClick={handleSubmit} className="stripe-card_field_button">Submit</InteractFlashyButton>
            </div>
          </div>
        </Box>
      </Modal>

      <JumboCardQuick
        title={"Auction"}
        id="auctionCard"
        sx={{ ml: 2, display: "flex", flexDirection: "column", minWidth: 400 }}
        headerSx={{ pb: 0 }}
        wrapperSx={{
          pt: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        className="auctionCard"
      >
        <Stack direction="column">
          <Typography mt={1.21}>
            Top <Span sx={{ color: "primary.main", fontWeight: 600 }}>3</Span> x{" "}
            {campaignData?.interactionTopDurationTime} min interactions
          </Typography>

          <Typography>
            <Span sx={{ color: "primary.main", fontWeight: 600 }}>
              {campaignData?.numAuctionInteractions - 3}
            </Span>{" "}
            x {campaignData?.interactionDurationTime} min interactions
          </Typography>

          <Typography>
            In total, the top{" "}
            <Span sx={{ color: "primary.main", fontWeight: 600 }}>
              {campaignData?.numAuctionInteractions}
            </Span>{" "}
            bidders win interactions at the<br></br>end of the campaign (
            {getDateFromTimestamp({
              timestamp: campaignData?.endDateTime?.seconds,
              format: "h:mm a [EST on] MMMM Do",
            })}
            )
          </Typography>
        </Stack>
        <br></br>
        <Stack id="autoBidSection" direction="column" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Typography variant="h6" color="text.secondary" mb={0}>
              Auto-bid
            </Typography>
            <InfoTooltip
              title="We'll automatically bid the lowest amount to stay at your 
            desired rank on the leaderboard until your max bid is reached (you'll be sent an email to increase your 'Max bid amount'). If others 
            bid more & your max bid amount is exceeded, your rank will be lowered (we 
              will automatically bid your max bid price if it is exceeded and still try 
              to get you the highest rank possible; you may still be on the leaderboard 
              or you may not be (no interaction)."
            />
          </Stack>

          <FormControl sx={{ my: 1 }}>
            <InputLabel htmlFor="desired-ranking">Desired ranking</InputLabel>
            <Select
              id="desired-ranking"
              type="number"
              style={{ height: 50 }}
              value={desiredRanking}
              label="Desired ranking"
              onChange={(e) => handleDesiredRanking(e)}
            >
              {options}
            </Select>
          </FormControl>
          <FormControl sx={{ my: 1 }}>
            <InputLabel htmlFor="max-bid-amount">Max bid amount</InputLabel>
            <OutlinedInput
              id="max-bid-amount"
              type="number"
              inputProps={{ step: ".50" }}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              style={{ height: 50 }}
              value={formatMoney(autoBidAmount)}
              label="Max bid amount"
              onChange={(e) => onAutoBidAmountChange(e)}
            />
          </FormControl>

          {/*
          <InteractButton disabled={isCampaignEnded} onClick={() => bidAction(autoBidAmount,true,desiredRanking,maxBidAmount)}>
          Place auto-bid
          </InteractButton>
          */}

          <InteractButton
            
            onClick={() => verificationOfBid()}
          >
            Place auto-bid
          </InteractButton>
        </Stack>
        <Divider sx={{ my: 2 }}>or</Divider>
        <Stack id="normalBidSection" direction="column" spacing={2}>
          <Typography variant="h6" color="text.secondary" mb={0}>
            Manual bid{" "}
            <InfoTooltip title="If multiple parties bid the same price, the one who placed a bid the earliest will have the highest ranking" />
          </Typography>

          {/* <div>Original Price: <span class='Highlight'>{'$'}20</span></div> */}

          <Stack direction="column" spacing={0.5}>
            <FormControl sx={{ my: 1 }}>
              <InputLabel htmlFor="enter-bid-price">Enter bid price</InputLabel>
              <OutlinedInput
                id="enter-bid-price"
                type="number"
                inputProps={{ step: ".50" }}
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                style={{ height: 50 }}
                value={formatMoney(bidAmount)}
                label="Enter bid price"
                onChange={(e) => handleBidAmount(e)}
              />
            </FormControl>

            <Typography>
              Current lowest price to win:{" "}
              <Span sx={{ color: "primary.main", fontWeight: 500 }}>
                {"$"}
                {minBidAmount && `${formatMoney(minBidAmount)}`}
              </Span>
            </Typography>
          </Stack>

          {/* <form action="http://localhost:4242/create-auction-session" method="POST">  */}
          {/*
          <InteractButton disabled={isCampaignEnded} onClick={() => bidAction(bidAmount,false,null,null,minBidAmount)}>
          Place bid
          </InteractButton>
          */}
          <InteractButton
            disabled={isCampaignEnded}
            onClick={() => verificationOfBid1()}
          >
            Place bid
          </InteractButton>
          {/* </form> */}
        </Stack>
        <Typography variant="caption" color="text.hint">
          You won't be charged if you don't win
        </Typography>
      </JumboCardQuick>
    </>
  );
}
