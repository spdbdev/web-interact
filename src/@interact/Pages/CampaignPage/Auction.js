import "./CampaignPage.css";
import {
  Button,
  Divider,
  OutlinedInput,
  InputAdornment,
  useScrollTrigger,
  Tooltip,
  InputLabel,
  FormControl,
  Container,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import InfoTooltip from "../../Components/InfoTooltip";
import InteractButton from "../../Components/Button/InteractButton";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import Span from "@jumbo/shared/Span";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "@jumbo/services/auth/firebase/firebase";
import { useNavigate, useParams } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Select from "react-select";
import {
  query,
  collection,
  getDocs,
  where,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
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

const belowAutobidTitle =
  "The bid will place you Xth on the leaderboard (if others do not bid higher)";

export default function Auction({ bids, campaignData, bidAction }) {
  // // console.log('bid looking at', Math.min(bids.length -1, campaignData?.numBidSlots-1), bids[Math.min(bids.length -1, campaignData?.numBidSlots-1)].price)
  const [user, loading, error] = useAuthState(auth);
  const [bidAmount, setBidAmount] = useState(0);
  const [maxBidAmount, setMaxBidAmount] = useState(0);
  const [desiredRanking, setDesiredRanking] = useState(0);
  const navigate = useNavigate();
  const stripe = useStripe();
  const [open, setOpen] = useState(false);
  const elements = useElements();
  const card = useRef();
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup1, setOpenPopup1] = useState(false);
  const [selectPopUp, setselectPopUp] = useState(1);

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

  // function handleChangePostalCode(e) {
  //   const { value } = e.target;
  //   setCardInfo((prev) => {
  //     return { ...prev, address: { ...prev.address, postalCode: value } };
  //   });
  // }

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

      setUserCostomerId(data.customerId);

      // getRequest(`/customer/method/${data.customerId}`)
      //   .then((resp) => {
      //     console.log(resp.data.paymentmethod.data);
      //     setPaymentMethods(resp.data.paymentmethod.data);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
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
    if (!user) return navigate("/");
    console.log(auth.currentUser);
    fetchUserName();
  }, [user]);

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
            <OutlinedInput
              id="desired-ranking"
              type="number"
              style={{ height: 50 }}
              value={desiredRanking}
              label="Desired Ranking"
              onChange={(e) => {
                // prevent values less than 0 or higher than 20.
                e.target.value < 0
                  ? (e.target.value = 0)
                  : e.target.value > 20
                  ? (e.target.value = 20)
                  : setDesiredRanking(e.target.value);
              }}
            />
          </FormControl>
          <FormControl sx={{ my: 1 }}>
            <InputLabel htmlFor="max-bid-amount">Max Bid Amount</InputLabel>
            <OutlinedInput
              id="max-bid-amount"
              type="number"
              inputProps={{ step: ".50" }}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              style={{ height: 50 }}
              value={maxBidAmount}
              label="Max Bid Amount"
              onChange={(e) => setMaxBidAmount(e.target.value)}
            />
          </FormControl>

          <InteractButton onClick={() => verificationOfBid()}>
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
              Top <Span sx={{ color: "primary.main", fontWeight: 500 }}>3</Span>{" "}
              x 60 min interactions
            </Typography>

            <Typography>
              <Span sx={{ color: "primary.main", fontWeight: 500 }}>17</Span> x
              30 min interactions
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
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              style={{ height: 50 }}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
            />
            <Typography>
              Current lowest price to win:{" "}
              <Span sx={{ color: "primary.main", fontWeight: 500 }}>
                {"$"}
                {bids && campaignData
                  ? `${
                      bids[
                        Math.min(bids.length - 1, campaignData.numBidSlots - 1)
                      ]?.price
                    }0`
                  : "0"}
              </Span>
            </Typography>
          </Stack>

          {/* <form action="http://localhost:4242/create-auction-session" method="POST">  */}
          <InteractButton onClick={() => verificationOfBid1()}>
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
