import "./CampaignPage.css";
import { useState, useEffect, useRef } from "react";
import { Divider, Typography, Box, Input, Stack } from "@mui/material";
import InfoTooltip from "../../Components/InfoTooltip";
import InteractButton from "../../Components/Button/InteractButton";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import Span from "@jumbo/shared/Span";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db, logout } from "@jumbo/services/auth/firebase/firebase";

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
import { getRequest } from "../../../utils/api";
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
  "By pressing 'Confirm', you will automatically follow the creator of this campaign & consent to receiving email updates from the campaigns",
];

const hoverText =
  "Only 1 entry is allowed per user. Each time a user loses, their next giveaway with the same creator will have DOUBLE the chances of winning, stacking twice, 4x loss multiplier (meaning up to a total 100x chance with a VIP entry)";

export default function Giveaway({
  campaignData,
  hasUserClaimedFreeEntry,
  hasUserPurchasedVIPEntry,
  setHasUserClaimedFreeEntry,
  setHasUserPurchasedVIPEntry,
  setHasUserEnteredGiveaway,
}) {
  const Swal = useSwalWrapper();
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const stripe = useStripe();
  const [currentUser,setCurrentUser] = useState(null);
  const [open, setOpen] = useState(false);
  const elements = useElements();
  const card = useRef();
  const [openPopup, setOpenPopup] = useState(false);
  const [rafflePrice, setRafflePrice] = useState(0);
  const [selectedPaymentMethod,setSelectedPaymentMethod] = useState(null);
  useEffect(() => {
    if (typeof campaignData?.rafflePrice === "undefined") {
      setRafflePrice(0);
    } else {
      setRafflePrice(campaignData?.rafflePrice);
    }
  }, []);

  const [cardInfo, setCardInfo] = useState({
    name: "",
    expiry: "",
    number: "",
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

  const closefunction = () => {
    setOpenPopup(false);
  };

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
      data.id = colledoc.docs[0].id;
      setCurrentUser(data);


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
  const createReceipt = async () => {
    console.log("GIVEAWAY RECEIPT DETAILS", {
      creator_username: campaignData?.person?.username,
      purchaser_username: currentUser?.name,
      price: rafflePrice,
      paymentmethod:selectedPaymentMethod, 
      type:'giveaway'
  }); 
//   await db.collection('users').doc("eBgjz86kRKRqBKe2iMI1").collection('receipts').add({
//     creator_username: campaignData?.person?.username,
//     purchaser_username: currentUser?.name,
//     price: maxBidAmount,
//     rank: desiredRanking,
//     type:'auction'
// });

  const receiptResponse = await addDoc(collection(db, "users", currentUser.id, "receipts"), {
    creator_username: campaignData?.person?.username,
    purchaser_username: currentUser?.name,
    price: rafflePrice,
    paymentmethod:selectedPaymentMethod, 
    type:'giveaway'
});
console.log('Giveaway receiptResponse');
console.log(receiptResponse);
  }

  useEffect(() => {
    if (!user) return navigate("/");
    fetchUserName();
  }, [user]);

  const resturnOption = () => {
    const options = supported_transfer_countries.map((item, index) => {
      return { value: item.code, label: item.country };
    });
    return options;
  };
  const buyGiveawayAlert = () => {
    if (!user) return navigate("/");
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
        // Swal.fire(
        //   "Correct!",
        //   "You'll now be taken to the payment page.",
        //   "success"
        // );
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
        Swal.fire(
          "Incorrect.",
          "We were expecting a different answer... try again!",
          "error"
        );
      }
    });
  };
  const freeGiveawayAlert = () => {
    if (!user) return navigate("/");
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
        createReceipt();
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
    <>
      <ConfirmPopup
      createReceipt={createReceipt}
        openstate={openPopup}
        settheOpenPopup={setOpenPopup}
        closefunction={closefunction}
        allprimarymethod={paymentMethods}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        title={"Confirm VIP entry"}
        belowtext={autobid}
        undertitle={``}
        onchangeclick={handleOpen}
        price={rafflePrice}
        userCostomerId={userCostomerId}
        hovertext={hoverText}
        hovereffect={true}
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
                style={{ float: "right", cursor: "pointer", marginTop: "-8px" }}
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
    </>
  );
}
