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
import { formatMoney } from "app/utils";
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


export default function Auction({isCampaignEnded, isCampaignScheduled, bids, userAuctionPosition, campaignData, bidAction}) {
	
	const navigate = useNavigate();

	// auto bid
	const [desiredRank, setDesiredRank] = useState(1);
	const [autoBidAmount, setAutoBidAmount] = useState(0);
  	const [minRankBidAmount, setMinRankBidAmount] = useState(0);
	// manual bid
	const [bidAmount, setBidAmount] = useState(0);
	const [minBidAmount, setMinBidAmount] = useState(0);
	const [manualRanking, setManualRanking] = useState(1);

	const [previousBidData, setPreviousBidData] = useState({price:0});
	
  	const { user } = useCurrentUser();
	const [currentUser, setCurrentUser] = useState(null);
	const stripe = useStripe();
	const [open, setOpen] = useState(false);
	const elements = useElements();
	const [openPopup, setOpenPopup] = useState(false);
	const [openPopup1, setOpenPopup1] = useState(false);
	const [selectPopUp, setselectPopUp] = useState(1);

	const paymentRef = useRef();
	const [selectPaymentMethod, setSelectPaymentMethod] = useState("");
	const [loading, setLoading] = useState(false);

	const handleMaxBidAmount = function(value)
	{
		let desired_rank = parseInt(value);
		if (bids.length > 0 && bids.length >= desired_rank) 
		{	
			let bidAtDesiredRank = bids[desired_rank - 1];
			let priceAtDesiredRank = parseFloat(bidAtDesiredRank?.price) ?? 0;

			let thirtyPer = (priceAtDesiredRank / 100) * 30;

			let minIncrement = 5;
			if (thirtyPer > 5) minIncrement = thirtyPer;
			minIncrement = Math.round(minIncrement * 2) / 2;

			// if priceAtDesiredRank is less than previous bid then abort
			if(priceAtDesiredRank < parseFloat(previousBidData.price)){
				Swal.fire({icon: "error", title: "Oops...", text: "You can't bid lower than your previous bid !"});
				return;
			}
			else setDesiredRank(value);

			setAutoBidAmount(priceAtDesiredRank + minIncrement);
			setMinRankBidAmount(priceAtDesiredRank + 0.5);
		}
		else {
			setAutoBidAmount(parseFloat(minBidAmount) + 5);
			setMinRankBidAmount(parseFloat(minBidAmount) + 0.5);
		}
	}

	useEffect(() => {
		if (Object.entries(campaignData).length > 0) 
		{
			let thirtyPer = 0;
			if(bids.length > 0) thirtyPer = (bids[0]?.price/100) * 30;

			let minIncrement = 5;
			if(thirtyPer > 5) minIncrement = thirtyPer;
			minIncrement = Math.round(minIncrement * 2) / 2;

			// manual bidding
			let min_bid_amount = campaignData.auctionMinBid;
			let bid_amount = parseFloat(campaignData.auctionMinBid) + minIncrement;
			if (bids.length >= campaignData.numAuctionInteractions) 
			{
				let lastBidPrice = bids[campaignData.numAuctionInteractions - 1].price;
				if (lastBidPrice >= campaignData.auctionMinBid) {
					min_bid_amount = parseFloat(lastBidPrice) + 0.5;
					bid_amount = parseFloat(lastBidPrice) + 0.5;
				}
			}
			setMinBidAmount(parseFloat(min_bid_amount));
			setBidAmount(parseFloat(bid_amount));

			handleMaxBidAmount(desiredRank);
		}

		// get previous bid
		if(bids.length > 0 && userAuctionPosition > 0)
		{
			console.log(bids[userAuctionPosition - 1]);
			setPreviousBidData(bids[userAuctionPosition - 1]);
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

	const handleBidAmount = function(e){
		if(	parseFloat(e.target.value) >= parseFloat(minBidAmount) && parseFloat(e.target.value) <= parseFloat(autoBidAmount) ){
			if(parseFloat(e.target.value) < (parseFloat(previousBidData.price) + 0.5)) setBidAmount(parseFloat(previousBidData.price) + 0.5);
			else setBidAmount(e.target.value);
		}
	}

	const onAutoBidAmountChange = function(e){
		if(parseFloat(e.target.value) >= parseFloat(minBidAmount) && parseFloat(e.target.value) >= parseFloat(minRankBidAmount)){
			if(parseFloat(e.target.value) < (parseFloat(previousBidData.price) + 0.5)) setAutoBidAmount(parseFloat(previousBidData.price) + 0.5);
			else setAutoBidAmount(e.target.value);
		}
	}

	const handleDesiredRank = function(e){
		// prevent values less than 0 or higher than allowed interactions 20.
		if(e.target.value < 1) e.target.value = 1;
		else if(e.target.value > parseInt(campaignData?.numAuctionInteractions)) e.target.value = campaignData?.numAuctionInteractions;
	
		handleMaxBidAmount(e.target.value);
	}

	const followCampaign = async () => {
    	const targetUser = await fetchUserByName(campaignData?.person?.username);
		if(user === undefined) {
            console.log("You need to sign in to follow user");
            navigate("/a/signin");
            return;
        }
        if(!targetUser?.followers?.includes(user?.id)) {
            followUser(user, targetUser);
        }
  	}

	const handleBidClick = async (amount, auto = false, desiredRank = null, maxBidPrice = null) => {
		followCampaign();
		bidAction(amount, auto, desiredRank, maxBidPrice);
	}




  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    handleMaxBidAmount(desiredRank);
  }, []);

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [userCustomerId, setUserCustomerId] = useState(null);

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

    setLoading(true);
    stripe
    .createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement),
    })
    .then((resp) => {
      console.log(resp.paymentMethod);
      const pmid = resp?.paymentMethod?.id;
      if (pmid && userCustomerId) {
        getRequest(`/method/attach/${userCustomerId}/${pmid}`)
          .then((resp) => {
            setOpen(false);
            if (resp.data.added) {
              setPaymentMethods(resp.data.paymentmethod.data);
              setSelectPaymentMethod(resp.data.paymentmethod.data[0].id);
              setLoading(false);
              if (selectPopUp === 1) {
                setOpenPopup(true);
              } else {
                setOpenPopup1(true);
              }
            } else {
              setLoading(false);
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "An error occurred",
              });
            }
          })
          .catch((err) => {
            /*Handle Error */
            setOpen(false);
            setLoading(false);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "An error occurred",
            });
          });
      }
      else { //response error
        setOpen(false);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "An error occurred",
        });
      }
      console.log(resp);
    })
    .catch((err) => {
      /* Handle Error*/
      setOpen(false);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred",
      });
    });
  };

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const colledoc = await getDocs(q);
      const data = colledoc.docs[0].data();
      data.id = colledoc.docs[0].id;
      setUserCustomerId(data.customerId);
      setCurrentUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  const verificationOfAutoBid = () => {
    if (!user) return navigate("/a/signup");
    if (desiredRank > 0) {
      getRequest(`/customer/method/${userCustomerId}`)
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
        title: "Please enter your desired rank",
        text: "",
      });
    }

    // bidAction(bidAmount);
  };
  const verificationOfBid = () => {
    console.log("manualbid");
    console.log(bids);

    console.log(manualRanking);
    if (!user) return navigate("/a/signup");
    getRequest(`/customer/method/${userCustomerId}`)
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

  return (
    <>
      <ConfirmAuctionPopup
        openstate={openPopup}
        settheOpenPopup={setOpenPopup}
        closefunction={closefunction}
        allprimarymethod={paymentMethods}
        desiredRank={desiredRank}
        onaddclick={handleOpen}
        price={minRankBidAmount}
        userCustomerId={userCustomerId}
        bidAction={() => bidAction(minRankBidAmount, true, desiredRank, autoBidAmount)}
        selectPaymentMethod={selectPaymentMethod}
        setSelectedPaymentMethod={setSelectPaymentMethod}
        autobid={true}
      />

      <ConfirmAuctionPopup
        openstate={openPopup1}
        settheOpenPopup={setOpenPopup1}
        closefunction={closefunction1}
        allprimarymethod={paymentMethods}
        desiredRank={manualRanking}
        onaddclick={handleOpen}
        price={bidAmount}
        userCustomerId={userCustomerId}
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
              <div className="paymentRequestDiv">
                <PaymentRequestForm price={minRankBidAmount} handleSubmit={handleClose}/>
              </div>
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
              <InteractFlashyButton onClick={handleSubmit} loading={loading} className="stripe-card_field_button">Submit</InteractFlashyButton>
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

          <Typography mt={1.21} maxWidth={316.9}>
            The top{" "}
            <Span sx={{ color: "primary.main", fontWeight: 600 }}>{campaignData?.numAuctionInteractions}</Span>{" "}
            bidders win an interaction & pay
            at the end of the campaign;{" "}
            <Span sx={{color: "text.hint"}}>if you don't win (not on the leaderboard), you won't be charged</Span>&nbsp;&nbsp;
            <InfoTooltip
            title="If you're no longer on the leaderboard, you won't be charged. If you are on the leaderboard at the end of the campaign, a top bidder, you will win 
            a premium interaction that occurrs before winners from 
            the giveaway."
            />
          </Typography>

          <Typography >
            Top <Span sx={{ color: "primary.main", fontWeight: 600 }}>3</Span> x{" "}
            {campaignData?.interactionTopDurationTime} min interactions
          </Typography>

          <Typography>
            <Span sx={{ color: "primary.main", fontWeight: 600 }}>
              {campaignData?.numAuctionInteractions - 3}
            </Span>{" "}
            x {campaignData?.interactionDurationTime} min interactions
          </Typography>

        </Stack>
		


        <br></br>
        <Stack id="autoBidSection" direction="column" >
          	<Stack direction="row" alignItems="center" mb={1.21}>
				<Typography variant="h5" color="text.secondary" mb={0}>
						Auto-bid
				</Typography>&nbsp;&nbsp;
				<InfoTooltip
					title="We'll automatically bid the lowest amount to stay at your 
					desired rank on the leaderboard until your max bid is reached; if others 
					bid more & your max bid amount is exceeded, your rank will be lowered"
				/>
          	</Stack>

          	<FormControl sx={{ my: 1.21 }}>
          		<InputLabel htmlFor="desired-ranking">Desired rank</InputLabel>
				<Select
					id="desired-rank"
					type="number"
					style={{ height: 50 }}
					value={desiredRank}
					label="Desired rank"
					onChange={(e) => handleDesiredRank(e)}
					>
					{options}
				</Select>
          	</FormControl>
        
			<Typography >
				<Span sx={{ color: "primary.main", fontWeight: 600}}>
					&nbsp;&nbsp;&nbsp;${minRankBidAmount
					&& `${ formatMoney(
						minRankBidAmount
					)}`}
				</Span>{" "}
				minimum bid for {desiredRank}{nth(desiredRank)} place
			</Typography>

          	<FormControl sx={{ mb:1.69, mt:1.869 }}>
          		<InputLabel htmlFor="max-bid-amount">Max bid amount</InputLabel>
				<OutlinedInput
					id="max-bid-amount"
					type="number"
					inputProps={{ step: ".50" }}
					startAdornment={<InputAdornment position="start">$</InputAdornment>}
					style={{ height: 50 }}
					value={formatMoney(autoBidAmount)}
					label="Max bid amount"
					onChange={(e) =>  onAutoBidAmountChange(e)}
				/>
          	</FormControl>

          {/*
		  	minRankBidAmount => it should be the current bid amount (price)
			autoBidAmount => it will be the maxBidPrice
			<InteractButton disabled={isCampaignEnded||isCampaignScheduled} onClick={() => handleBidClick(minRankBidAmount, true, desiredRank, autoBidAmount)}>
				Place auto-bid
			</InteractButton>
          */}

          <InteractButton disabled={isCampaignEnded||isCampaignScheduled}
            
            onClick={() => verificationOfAutoBid()}
          >
            Place auto-bid
          </InteractButton>
        </Stack>



      <Divider sx={{ my: 1.69 }}>or</Divider>
      <Stack id="normalBidSection" direction="column" >
			<Typography variant="h5" color="text.secondary" mb={1.21}>
				Manual bid&nbsp;&nbsp;
				<InfoTooltip
					title="If multiple parties bid the same price, the one who placed a bid the earliest will have the highest ranking"
				/>
			</Typography>

          	{/* <div>Original Price: <span class='Highlight'>{'$'}20</span></div> */}

			<Stack direction="column" spacing={0}>
				<Typography mb={1.69}>
					<Span sx={{ color: "primary.main", fontWeight: 600}}>
					&nbsp;&nbsp;&nbsp;${minBidAmount && `${ formatMoney(minBidAmount)}`}
					</Span>{" "}
					minimum bid
				</Typography>
				<FormControl sx={{ mt: 0.2169, mb:1.69 }}>
					<InputLabel htmlFor="enter-bid-price">Enter bid price</InputLabel>
					<OutlinedInput
						id="enter-bid-price"
						type="number"
						inputProps={{ step: ".50" }}
						startAdornment={<InputAdornment position="start">$</InputAdornment>}
						style={{ height: 50 }}
						value={formatMoney(bidAmount)}
						label="Enter bid price"
						onChange={(e) => handleBidAmount(e)}
					/>
				</FormControl>
			</Stack>

          {/*
          <InteractButton disabled={isCampaignEnded} onClick={() => bidAction(bidAmount)}>
          Place bid
          </InteractButton>
          */}
          <InteractButton
            disabled={isCampaignEnded||isCampaignScheduled}
            onClick={() => verificationOfBid()}
          >
            Place bid
          </InteractButton>
          {/* </form> */}
      </Stack>
    </JumboCardQuick>
    </>
    );
  }
