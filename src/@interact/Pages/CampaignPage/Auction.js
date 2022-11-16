import { useState, useEffect, useRef } from "react";
import InfoTooltip from "../../Components/InfoTooltip";
import InteractButton from "../../Components/Button/InteractButton";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import Span from "@jumbo/shared/Span";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "@jumbo/services/auth/firebase/firebase";
import { useNavigate, useParams } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Select as ReactSelect } from "react-select";
import { formatMoney, getDateFromTimestamp } from "@interact/Components/utils";

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





export default function Auction({isCampaignEnded, bids, campaignData, bidAction }) {

	const [bidAmount, setBidAmount] = useState(0);
	const [autoBidAmount, setAutoBidAmount] = useState(0);
	const [minBidAmount, setMinBidAmount] = useState(0);
	const [maxBidAmount, setMaxBidAmount] = useState(0);
	const [numAuctionInteractions, setNumAuctionInteractions] = useState(0);
	const [desiredRanking, setDesiredRanking] = useState(1);

  const [user, loading, error] = useAuthState(auth);
  const [currentUser,setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const stripe = useStripe();
  const [open, setOpen] = useState(false);
  const elements = useElements();
  const card = useRef();
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup1, setOpenPopup1] = useState(false);
  const [selectPopUp, setselectPopUp] = useState(1);


	useEffect(() => {
		if (Object.entries(campaignData).length > 0 && bids.length > 0) {
			if (campaignData.numAuctionInteractions) {
				setNumAuctionInteractions(campaignData.numAuctionInteractions);
			}

			if (bids.length >= campaignData.numAuctionInteractions) 
			{
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
		if(parseInt(e.target.value) >= parseInt(minBidAmount) && parseInt(e.target.value) <= parseInt(maxBidAmount)){
			setBidAmount(e.target.value);
		}
	}

	const onAutoBidAmountChange = function(e){
		if(parseInt(e.target.value) >= parseInt(minBidAmount) && parseInt(e.target.value) <= parseInt(maxBidAmount)){
			setAutoBidAmount(e.target.value);
		}
	}

	const handleMaxBidAmount = function(value){
		if(bids.length > 0)
		{
			let sortedBids = bids;
			let bidAtDesiredRanking = sortedBids[parseInt(value) - 1];
			let thirtyPer = (bidAtDesiredRanking?.price/100) * 30;
			let maxIncrement = 5;
			if(thirtyPer > 5){
				maxIncrement = thirtyPer;
			}
			maxIncrement = Math.round(maxIncrement*2)/2;

			setMaxBidAmount(parseFloat(bidAtDesiredRanking?.price) + maxIncrement);
			setAutoBidAmount(parseFloat(bidAtDesiredRanking?.price) + maxIncrement);
			if(!bidAtDesiredRanking){
				setMaxBidAmount(0.00);
				setAutoBidAmount(0.00);
			}
		}

		if(parseInt(value) > bids.length){
			setMaxBidAmount(0.00);
		}
	}

	const handleDesiredRanking = function(e){
		// prevent values less than 0 or higher than 20.
		console.log("Num interactions",campaignData?.numAuctionInteractions)
		e.target.value < 1
		? (e.target.value = 1)
		: e.target.value > parseInt(campaignData?.numAuctionInteractions)
		? (e.target.value = campaignData?.numAuctionInteractions)
		: setDesiredRanking(e.target.value);
		handleMaxBidAmount(e.target.value);
	}

	useEffect(()=>{
		handleMaxBidAmount(desiredRanking);
	},[])




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
  const [userCostomerId, setUserCostomerId] = useState(null);
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
          if (pmid && userCostomerId) {
            getRequest(`/method/attach/${userCostomerId}/${pmid}`)
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
      setUserCostomerId(data.customerId);
      setCurrentUser(data);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
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
    if (desiredRanking > 0) {
      getRequest(`/customer/method/${userCostomerId}`)
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
        title: "Oops...",
        text: "Please Enter Your Desired Rank",
      });
    }

    // bidAction(bidAmount);
  };
  const verificationOfBid1 = () => {
    if (!user) return navigate("/");
    getRequest(`/customer/method/${userCostomerId}`)
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
    if (loading) return;
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
        undertitle={`The bid will place you ${desiredRanking} on the leaderboard (if others do not bid higher)`}
        onchangeclick={handleOpen}
        price={maxBidAmount}
        userCostomerId={userCostomerId}
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
        userCostomerId={userCostomerId}
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
                <ReactSelect
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
        className="auctionCard"
        >
        <Stack id="autoBidSection" direction="column" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          <Typography variant="h5" color="text.secondary" mb={0}>
            Auto-bidding
          </Typography>
          <InfoTooltip
            title="We'll automatically bid the lowest amount to stay at your desired
            rank on the leaderboard until your max bid is reached. If others bid
            more & your max bid amount is exceeded, your rank will be lowered;
            you might still be on the leaderboard or you might not be,
            meaning no interaction (you'll be sent an email to increase your
            'Max bid amount')."
          />
          </Stack>

          <FormControl sx={{ my: 1 }}>
          <InputLabel htmlFor="desired-ranking">Desired Ranking</InputLabel>
          <Select
            id="desired-ranking"
            type="number"
            style={{ height: 50 }}
            value={desiredRanking}
            label="Desired Ranking"
            onChange={(e) => handleDesiredRanking(e)}
          >
            {options}
          </Select>
          </FormControl>
          <FormControl sx={{ my: 1 }}>
          <InputLabel htmlFor="max-bid-amount">Max Bid Amount</InputLabel>
          <OutlinedInput
            id="max-bid-amount"
            type="number"
            inputProps={{ step: ".50" }}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            style={{ height: 50 }}
            value={formatMoney(autoBidAmount)}
            label="Max Bid Amount"
            onChange={(e) =>  onAutoBidAmountChange(e)}
          />
          </FormControl>

          <InteractButton disabled={isCampaignEnded} onClick={() => bidAction(autoBidAmount,true,desiredRanking,maxBidAmount)}>
          Place auto-bid
          </InteractButton>
        </Stack>
        <Divider sx={{ my: 2 }}>or</Divider>
        <Stack id="normalBidSection" direction="column" spacing={2}>
          <Typography variant="h5" color="text.secondary" mb={0}>
          Manual bidding
          </Typography>

          <Stack direction="column">
          <Typography>
            Top <Span sx={{ color: "primary.main", fontWeight: 500 }}>3</Span> x
            60 min interactions
          </Typography>

          <Typography>
            <Span sx={{ color: "primary.main", fontWeight: 500 }}>17</Span> x 30
            min interactions
          </Typography>

          <Typography>
            The top 20 bidders win at the end of the campaign.
          </Typography>
          </Stack>

          {/* <div>Original Price: <span class='Highlight'>{'$'}20</span></div> */}

          <Stack direction="column" spacing={0.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>Enter bid price (total)</Typography>
            <InfoTooltip
            title="If multiple parties bid the same price, the ones who bid first will
            have higher rankings."
            />
          </Stack>
          <OutlinedInput
            type="number"
            inputProps={{ step: ".50" }}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            style={{ height: 50 }}
            value={formatMoney(bidAmount)}
            onChange={(e) => handleBidAmount(e)}
          />
          <Typography>
            Current lowest price to win:{" "}
            <Span sx={{ color: "primary.main", fontWeight: 500 }}>
            {"$"}
            {minBidAmount
              && `${ formatMoney(
                minBidAmount
              )}`}
            </Span>
          </Typography>
          </Stack>

          {/* <form action="http://localhost:4242/create-auction-session" method="POST">  */}
          <InteractButton disabled={isCampaignEnded} onClick={() => bidAction(bidAmount,false,null,null,minBidAmount)}>
          Place bid
          </InteractButton>
          {/* </form> */}
        </Stack>
        <Typography variant="caption" color="text.hint">
          You won't be charged if you don't win.
        </Typography>
      </JumboCardQuick>
    </>
	);
}
