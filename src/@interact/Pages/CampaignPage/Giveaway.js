import { useState, useEffect, useRef } from "react";
import { Divider, Typography, Box, Input, Stack } from "@mui/material";
import InfoTooltip from "../../Components/InfoTooltip";
import InteractButton from "../../Components/Button/InteractButton";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import Span from "@jumbo/shared/Span";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db, logout } from "@jumbo/services/auth/firebase/firebase";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Select from "react-select";
import {query, setDoc, serverTimestamp, getCountFromServer, increment, collection, getDoc, getDocs, where, addDoc, updateDoc, doc} from "firebase/firestore";
import Modal from "@mui/material/Modal";
import InteractFlashyButton from "@interact/Components/Button/InteractFlashyButton";
import { Country, State, City } from "country-state-city";
import { getRequest, postRequest } from "../../../utils/api";
import supported_transfer_countries from "./countrylist";
import ConfirmVIPPopup from "./ConfirmVIPPopup";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";

import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import "./CampaignPage.css";
import { formatMoney } from "@interact/Components/utils";
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

export default function Giveaway({
	campaignId,
	isCampaignEnded,
	campaignData,
	hasUserClaimedFreeEntry,
	hasUserPurchasedVIPEntry,
	setHasUserClaimedFreeEntry,
	setHasUserPurchasedVIPEntry,
	vipChanceMultiplier,
	freeChanceMultiplier,
	winningChances,
}) {
	const stripe = useStripe();
	const [stripeError, setStripeError] = useState("");
	const [stripe_customer_id_new, set_Stripe_customer_id_new] = useState(false);

	const elements = useElements();
	const [priceToPay,setPriceToPay] = useState(0);
	const [entryType,setEntryType] = useState(null);
	const [modal, setModal] = useState(false);
	const [clientemail, isClientEmail] = useState("");
	const [name, setName] = useState("");
	const [loggedInUserData, setLoggedInUserData] = useState("");

	const [isSubscribed, setIsSubscribed] = useState(false);
	const [customerSet, isCustomerSet] = useState(false);
	const [isActive, setIsActive] = useState(true);
	const [cardBrand, setCardBrand] = useState(true);
	const [last4, setLast4] = useState(true);
	const [useSaveCard, setUseSaveCard] = useState(false);

	const { user } = useCurrentUser();
	const [currentUser, setCurrentUser] = useState(null);
	const [open, setOpen] = useState(false);
	const card = useRef();
	const [openPopup, setOpenPopup] = useState(false);
	const [selectedPaymentMethod,setSelectedPaymentMethod] = useState(null);


	const navigate = useNavigate();
	const Swal = useSwalWrapper();
	var logged_user_stripe_customer_id = false;


	const fetchUserName = async () => {
		try {
			const q = query(collection(db, "users"), where("uid", "==", user?.uid));
			const colledoc = await getDocs(q);
			const data = colledoc.docs[0].data();
			setName(data.name);
			isClientEmail(data.email);

			setUserCostomerId(data.customerId);
			data.id = colledoc.docs[0].id;
			setCurrentUser(data);
		} catch (err) {
			console.error(err);
		}
	};
	useEffect(() => {
		console.log('user >>>', user, campaignId);
        if (user?.uid){
			fetchUserName();
			getDataGiveaway();
        	get_stripe_customer_id();
		}

		if(logged_user_stripe_customer_id){
			payment_method();
		}
    }, [user, logged_user_stripe_customer_id]);
    localStorage.setItem('name', name);

    const getDataGiveaway = async () => {
        const docRef = doc(db, "campaigns", campaignId, 'Giveaway', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setLoggedInUserData(data);            
        }
    }

    const get_stripe_customer_id = async () => {
        const docRef = doc(db, "campaigns", campaignId, 'stripeCustomers', user.uid);
        const docSnap = await getDoc(docRef);
        //console.log(docSnap);
        if (docSnap.exists()) {
            const data = docSnap.data();
            set_Stripe_customer_id_new(data);
        } else {
            logged_user_stripe_customer_id = false;
        }  
    }
    logged_user_stripe_customer_id = stripe_customer_id_new.customer_id;
    
	const payment_method = () => {
		if (logged_user_stripe_customer_id) {
			postRequest("/get_payment_methods", {stripe_customer_id: logged_user_stripe_customer_id})
			.then(function (response) {
				var data = response.data;
				if (data.status) {
					isCustomerSet(true);
					var brand = data.brand;
					var last4 = data.last4;
					setCardBrand(brand);
					setLast4(last4);
					setUseSaveCard(true);
					//console.log("getting data" +logged_user_stripe_customer_id )
				} else {
					isCustomerSet(false);
					//setUseSaveCard(false);
					console.log("not getting data")
				}
			})
			.catch(function (error) {
				console.log(error);
			});
		} else {
			isCustomerSet(false);
		}
	}

    useEffect(() => {
        const interval = setInterval(() => {
            setStripeError('');
        }, 2000);

        return () => clearInterval(interval);
    }, [stripeError]);

    var vipEntryPrice = campaignData.giveawayVIPEntryCost ?? 0;
    var freeEntryPrice = "0";

    const saveDataInGiveaway = async (data) => {
        await setDoc(doc(db, "campaigns", campaignId, 'Giveaway', user?.uid), data);

		const snapshot = await getCountFromServer(collection(db, "campaigns", campaignId, 'Giveaway'));
		const counter = snapshot.data().count;
		console.log('Giveaway count: ', counter);

		setDoc(doc(db, "campaigns", campaignId), {numGiveawayEntries:counter}, { merge: true });


		if(data.price > 0 && data.status === 'succeeded' && data.stripe_customer_id != null)
		{
			setDoc(
				doc(db, "contributionAndGiveawayLossHistory", campaignData.person.id, 'users', user.uid), 
				{contributionTotal: increment(data.price)}, 
				{ merge: true }
			);

			setDoc(doc(db, "campaigns", campaignId), {campaignVIPtotal: increment(data.price)}, { merge: true });
		}
    }

    const saveDataInStripeCustomer = (stripe_customer_data) => {
        // console.log(stripe_customer_data);
        setDoc(doc(db, "campaigns", campaignId,'stripeCustomers',user?.uid), stripe_customer_data);
        setDoc(doc(db, 'stripeCustomers',user?.uid), stripe_customer_data);
    }


    const handleClickToggle = event => {
        // 👇️ toggle isActive state on click
        event.preventDefault();
        setUseSaveCard(current_a => !current_a);
        setIsActive(current_b => !current_b);
    };
     

    useEffect(() => {
        //console.log('use save card value : ' + useSaveCard)

    }, [useSaveCard])

    const handleCheckBox = event => {
        if (event.target.checked) {
            //console.log('✅ Checkbox is checked');
        } else {
            //console.log('⛔️ Checkbox is NOT checked');
        }
        setIsSubscribed(current => !current);
    };

    const CARD_ELEMENT_OPTIONS = {
        hidePostalCode: true,
    };

    const collectFreeEntryPayment = async () => {
    	var data = {
    		email: clientemail,
    		price: priceToPay,
    		stripe_customer_id: null,
    		payment_id: null,
    		entryType: 'free',
    		status: 'succeeded',
    		campaignId: campaignId,
    		type: "Giveaway",
    		time: serverTimestamp(),
    	}

    	saveDataInGiveaway(data);

    	return true;
    }


    const toggleModal = () => {
        setModal(!modal);
    };

    if (modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

	const checkAuthentication = () => {
		if(!user) {
			navigate(`/a/signup?redirect=/c/${campaignId}`);
			return false;
		};
		return true;
	}
	const followCampaign = async () => {
        const targetUser = await fetchUserByName(campaignData?.person?.username);
		console.log("user", user);
		console.log("targetuser", targetUser);
		if(user === undefined) {
            console.log("You need to sign in to follow user");
            navigate("/a/signin");
            return;
        }
        if(!targetUser?.followers?.includes(user?.id)) {
            followUser(user, targetUser);
        }
    }
	const buyGiveawayAlert = () => {
		if(!checkAuthentication()) return;
		followCampaign();
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
				/* Swal.fire(
				"Correct!",
				"You'll now be taken to the payment page.",
				"success"
				).then(()=>{
				setPriceToPay(vipEntryPrice);
				setEntryType('vip');
				toggleModal();
				}); */

				getRequest(`/customer/method/${userCostomerId}`)
				.then((resp) => {
					const mdata = resp.data.paymentmethod.data;
					console.log(resp.data.paymentmethod.data);
					if (mdata.length > 0) {
					setPaymentMethods(resp.data.paymentmethod.data);
					setSelectedPaymentMethod(resp.data.paymentmethod.data[0].id);
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
		if(!checkAuthentication()) return;
		followCampaign();
		Swal.fire({
			title: "Claim free entry?",
			text: "Would you like to claim this free giveaway entry?",
			showCancelButton: true,
			confirmButtonText: "Yes, Claim!",
			cancelButtonText: "Cancel",
			reverseButtons: true,
		}).then((result) => {
			if (result.value) {
				setPriceToPay(freeEntryPrice);
				setEntryType('free');
				if(!collectFreeEntryPayment()){
					return;
				};
				setHasUserClaimedFreeEntry(true);
				Swal.fire(
					"Claimed!",
					"You've claimed a free entry for this giveaway. Good luck!",
					"success"
				);
			} else if (result.dismiss === Swal.DismissReason.cancel) {
				/* Read more about handling dismissals below */
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
		stripe.createPaymentMethod({
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
							setSelectedPaymentMethod(resp.data.paymentmethod.data[0].id);
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
	const resturnOption = () => {
		const options = supported_transfer_countries.map((item, index) => {
			return { value: item.code, label: item.country };
		});
		return options;
	};
 
	return (
		<>
		<ConfirmVIPPopup
			openstate={openPopup}
			settheOpenPopup={setOpenPopup}
			closefunction={closefunction}
			allprimarymethod={paymentMethods}
			onchangeclick={handleOpen}
			price={vipEntryPrice}
			userCostomerId={userCostomerId}
			selectPaymentMethod={selectedPaymentMethod}
			setSelectedPaymentMethod={setSelectedPaymentMethod}
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
				<Typography variant="h5" color="text.secondary" mt={1}>
				VIP entry
				</Typography>

				<span>
				Chance multiplier: {vipChanceMultiplier}x
				</span>
				<Stack direction="row" spacing={1} alignItems="center">
				<span>Chance of winning: {winningChances.vip}%</span>
				<InfoTooltip
					title="Remember, the % chance of winning will go down as more fans
				join the giveaway."
				/>
				</Stack>
				<Box sx={{ display: "flex", flexDirection: "row", mb: 1, mt: 1 }}>
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
					<span className="Highlight">${formatMoney(vipEntryPrice)}</span>
				</Box>

				<InteractButton onClick={buyGiveawayAlert} disabled={hasUserPurchasedVIPEntry || isCampaignEnded}>
					Buy VIP entry
				</InteractButton>
				</Box>
			</Box>

			<Divider>or</Divider>

			<Box
				id="freeGiveawaySection"
				style={{
				display: "flex",
				flexDirection: "column",
				marginTop: "10px",
				}}
				>
				<Typography variant="h5" color="text.secondary">
				Free entry
				</Typography>

				<span>
				Chance multiplier: {freeChanceMultiplier}x
				</span>
				<Stack direction="row" spacing={1} sx={{ mb: 1 }} alignItems="center">
				<span>Chance of winning: {winningChances.free}%</span>
				<InfoTooltip
					title="Remember, the % chance of winning will go down as more fans
				join the giveaway."
				/>
				</Stack>

				<InteractButton onClick={freeGiveawayAlert}
					disabled={hasUserClaimedFreeEntry || hasUserPurchasedVIPEntry || isCampaignEnded} >
					Get a free entry
				</InteractButton>
			</Box>
		</JumboCardQuick>
		</>
	);
}
