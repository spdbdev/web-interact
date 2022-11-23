import { useState, useEffect, useRef } from "react";
import InfoTooltip from "../../Components/InfoTooltip";
import InteractButton from "../../Components/Button/InteractButton";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import Span from "@jumbo/shared/Span";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "@jumbo/services/auth/firebase/firebase";
import { useNavigate, useParams } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { formatMoney, getDateFromTimestamp } from "app/utils";
import {query, collection, getDocs, where, setDoc, addDoc, getDoc, updateDoc, doc} from "firebase/firestore";
import "./CampaignPage.css";
import {Button, Divider, OutlinedInput, InputAdornment, useScrollTrigger, Tooltip, InputLabel, FormControl, 
  Container, Typography, Box, Stack, Select, MenuItem} from "@mui/material";
import Modal from "@mui/material/Modal";
import InteractFlashyButton from "@interact/Components/Button/InteractFlashyButton";
import Swal from "sweetalert2";
import { Country, State, City } from "country-state-city";
import { getRequest, postRequest } from "../../../utils/api";
import supported_transfer_countries from "./countrylist";
import ConfirmPopup from "./ConfirmPopup";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from '@mui/material/IconButton';
import { fetchUserByName, followUser } from '../../../firebase';
import useCurrentUser from "@interact/Hooks/use-current-user";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const autobid = [
  `You will only be charged if you're a winning bidder on the
  leaderboard at the end of the campaign`,
  `When you confirm your bid, you consent to an automatic charge via
  this payment method at the end of the campaign & you will
  automatically follow the creator of this campaign & consent to
  receiving email updates from the campaigns`,
  `New bids replace old bids, since each user is limited to 1
  interaction`,
];

const manualbid = [
  `You will only be charged if you're a winning bidder on the leaderboard at the end of the campaign`,
  `By pressing 'Confirm', you will automatically follow the creator of this campaign & consent to receiving email updates from the campaigns`,
  `New bids replace old bids, since each user is limited to 1 interaction`,
];

const belowAutobidTitle = "The bid will place you Xth on the leaderboard (if others do not bid higher)";

export default function Auction({isCampaignEnded, isCampaignScheduled, bids, campaignData, bidAction}) {
	
	const navigate = useNavigate();

	// auto bid
	const [desiredRank, setDesiredRank] = useState(1);
	const [autoBidAmount, setAutoBidAmount] = useState(0);
  	const [minRankBidAmount, setMinRankBidAmount] = useState(0);
	// manual bid
	const [bidAmount, setBidAmount] = useState(0);
	const [minBidAmount, setMinBidAmount] = useState(0);
	
  	const { user } = useCurrentUser();
	const [currentUser, setCurrentUser] = useState(null);
	const stripe = useStripe();
	const [open, setOpen] = useState(false);
	const elements = useElements();
	const card = useRef();
	const [openPopup, setOpenPopup] = useState(false);
	const [openPopup1, setOpenPopup1] = useState(false);
	const [selectPopUp, setselectPopUp] = useState(1);


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
		if(parseFloat(e.target.value) >= parseFloat(minBidAmount) && parseFloat(e.target.value) <= parseFloat(autoBidAmount)){
			setBidAmount(e.target.value);
		}
	}

	const onAutoBidAmountChange = function(e){
		if((parseFloat(e.target.value) >= (parseFloat(minBidAmount))) && (parseFloat(e.target.value) >=parseFloat(minRankBidAmount))){
			setAutoBidAmount(e.target.value);
		}
	}

	const handleDesiredRank = function(e){
		// prevent values less than 0 or higher than 20.
		console.log("Num interactions",campaignData?.numAuctionInteractions)
		e.target.value < 1
		? (e.target.value = 1)
		: e.target.value > parseInt(campaignData?.numAuctionInteractions)
		? (e.target.value = campaignData?.numAuctionInteractions)
		: setDesiredRank(e.target.value);
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
  const handlePupUpClose = () => {
    setOpen(false);
  };
  const [cardInfo, setCardInfo] = useState({
    name: "",
    expiry: "",
    number: "",
    country: "",
    address: {
      line: "",
      postalCode: "",
    },
  });
  const [updateCardInfo, setUpdateCardInfo] = useState({
    pid: "",
    name: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
  });
  const [locations, setLocations] = useState({
    countries: "",
    states: "",
    cities: "",
  });
  const [selectedLocation, setSelectedLocation] = useState({
    country: {},
    city: {},
    state: {},
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [userCustomerID, setuserCustomerID] = useState(null);
  function handleChangeAddressLine(e) {
    const { value } = e.target;
    setCardInfo((prev) => {
      return { ...prev, address: { ...prev.address, line: value } };
    });
  }
  function handleChangeName(e) {
    const { value } = e.target;
    setCardInfo((prev) => {
      return { ...prev, name: value };
    });
  }
  function parseForSelect(arr) {
    return arr.map((item) => ({
      label: item.name,
      value: item.isoCode ? item.isoCode : item.name,
    }));
  }
  function handleSelectCountry(country) {
    setSelectedLocation((prev) => {
      return { ...prev, country };
    });
    setCardInfo({
      ...cardInfo,
      country: country.value,
    });
  }
  function handleSelectState(state) {
    const cities = City.getCitiesOfState(
      selectedLocation.country.value,
      state.value
    );
    setSelectedLocation((prev) => {
      return { ...prev, state };
    });

    setLocations((prev) => ({ ...prev, cities: parseForSelect(cities) }));
  }
  function handleSelectCity(city) {
    setSelectedLocation((prev) => {
      return { ...prev, city };
    });
  }
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const address = cardInfo.address;
    const billingDetails = {
      name: cardInfo.name,
      address: {
        country: cardInfo.country,
        state: address.state,
        city: address.city,
        line1: address.line,
      },
    };

    try {
      stripe
        .createPaymentMethod({
          type: "card",
          billing_details: billingDetails,
          card: elements.getElement(CardElement),
        })
        .then((resp) => {
          const pmid = resp.paymentMethod.id;
          if (pmid && userCustomerID) {
            getRequest(`/method/attach/${userCustomerID}/${pmid}`)
              .then((resp) => {
                setOpen(false);
                if (resp.data.added) {
                  setPaymentMethods(resp.data.paymentmethod.data);
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
      setuserCustomerID(data.customerId);
      setCurrentUser(data);
    } catch (err) {
      console.error(err);
    }
  };
  const resturnOption = () => {
    const options = supported_transfer_countries.map((item, index) => {
      return { value: item.code, label: item.country };
    });
    return options;
  };
  const verificationOfBid = () => {
    if (!user) return navigate("/");
    if (desiredRank > 0) {
      getRequest(`/customer/method/${userCustomerID}`)
        .then((resp) => {
          const mdata = resp.data.paymentmethod.data;
          console.log(resp.data.paymentmethod.data);
          if (mdata.length > 0) {
            setPaymentMethods(resp.data.paymentmethod.data);
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
  const verificationOfBid1 = () => {
    if (!user) return navigate("/");
    getRequest(`/customer/method/${userCustomerID}`)
      .then((resp) => {
        const mdata = resp.data.paymentmethod.data;
        console.log(resp.data.paymentmethod.data);
        if (mdata.length > 0) {
          setPaymentMethods(resp.data.paymentmethod.data);
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

	function nth(n){return["st","nd","rd"][((n+90)%100-10)%10-1]||"th"}
	const options = [];
	for (let i = 1; i <= parseInt(campaignData?.numAuctionInteractions); i++) {
		options.push(<MenuItem value={i} key={i}>{i}{nth(i)}</MenuItem>);
	}

	return (
    <>
      <ConfirmPopup
        openstate={openPopup} 
        settheOpenPopup={setOpenPopup}
        closefunction={closefunction}
        allprimarymethod={paymentMethods}
        title={"Confirm auto-bid"}
        belowtext={autobid}
        undertitle={`The bid will place you ${desiredRank} on the leaderboard (if others do not bid higher)`}
        onchangeclick={handleOpen}
        price={autoBidAmount}
        userCustomerID={userCustomerID}
        bidAction={bidAction}
        bidActionstatus={true}
      />

      <ConfirmPopup
        openstate={openPopup1}
        settheOpenPopup={setOpenPopup1}
        closefunction={closefunction1}
        allprimarymethod={paymentMethods}
        title={"Confirm manual bid"}
        belowtext={manualbid}
        undertitle={``}
        onchangeclick={handleOpen}
        price={bidAmount}
        userCustomerID={userCustomerID}
        bidAction={bidAction}
        bidActionstatus={true}
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
              <IconButton
                onClick={handleClose}
                style={{ float: "right", cursor: "pointer",marginTop:"-8px" }}
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <CancelIcon />
              </IconButton>

              <div className="title">Add Payment Method</div>
              <div className="row">
                <label>Cardholder Name</label>
                <input
                  onChange={handleChangeName}
                  type="text"
                  name="name"
                  placeholder="Enter card holder name"
                />
              </div>
              <div className="rowPaymentInput">
                <CardElement ref={card} />
              </div>

              <div className="rowSelect">
                <label>Country</label>
                <Select
                  options={resturnOption()}
                  onChange={handleSelectCountry}
                />
              </div>

              <div className="addressWrapper">
                <div className="row">
                  <label>Address</label>
                  <input
                    onChange={handleChangeAddressLine}
                    type="text"
                    name="address"
                    placeholder="Enter Full Address"
                  />
                </div>
                <div className="checkbox-div card-body-text">
                  <input
                    type="checkbox"
                    disabled="disabled"
                    id="subscribe"
                    name="subscribe"
                    checked
                  />
                  Save Card
                </div>

                <InteractFlashyButton onClick={handleSubmit}>
                  Submit
                </InteractFlashyButton>
              </div>
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
			*/}
			<InteractButton disabled={isCampaignEnded||isCampaignScheduled} onClick={() => handleBidClick(minRankBidAmount, true, desiredRank, autoBidAmount)}>
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

          	<InteractButton disabled={isCampaignEnded||isCampaignScheduled} onClick={() => handleBidClick(bidAmount)}>
          		Place bid
          	</InteractButton>
        </Stack>
    </JumboCardQuick>
    </>
	);
}
