import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import Span from "@jumbo/shared/Span";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import { Box, Divider, Input, Stack, Typography } from "@mui/material";
import { useEffect,useState } from "react";
import InteractButton from "../../Components/Button/InteractButton";
import InfoTooltip from "../../Components/InfoTooltip";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { db, auth } from '../../../firebase';
import { doc, setDoc, serverTimestamp, getDoc, query, collection, where, getDocs, getCountFromServer, increment } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./CampaignPage.css";
import { formatMoney } from "@interact/Components/utils";

export default function Giveaway({
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
	const elements = useElements();
	const [priceToPay,setPriceToPay] = useState(0);
	const [entryType,setEntryType] = useState(null);
	const [modal, setModal] = useState(false);
	const [clientemail, isClientEmail] = useState("");
	const [stripeError, setStripeError] = useState("");
	const [name, setName] = useState("");
	const [loggedInUserData, setLoggedInUserData] = useState("");
	const [stripe_customer_id_new, set_Stripe_customer_id_new] = useState(false);

	const [isSubscribed, setIsSubscribed] = useState(false);
	const [customerSet, isCustomerSet] = useState(false);
	const [isActive, setIsActive] = useState(true);
	const [cardBrand, setCardBrand] = useState(true);
	const [last4, setLast4] = useState(true);
	const [useSaveCard, setUseSaveCard] = useState(false);
	const campaignId = 'test12345';
	//const [user] = useAuthState(auth); 
	let user = {
		uid: "wKKU2BUMagamPdJnhjw6iplg6w82",
		photoUrl: "https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg",
		name: "biby",
	  	email: "bibyliss@gmail.com",
	  	customerId: "cus_MlMuNeDDsNVt2Z",
  	};

	const navigate = useNavigate();
	var logged_user_stripe_customer_id = false;

	const Swal = useSwalWrapper();

	const fetchUserName = async () => {
		try {
			const q = query(collection(db, "users"), where("uid", "==", user?.uid));
			const doc = await getDocs(q);
			const data = doc.docs[0].data();
			setName(data.name);
			isClientEmail(data.email)
		} catch (err) {
			console.error(err);
		}
	};
  	fetchUserName();

    const getDataGiveaway = async () => {
        const docRef = doc(db, "campaigns", campaignId, 'Giveaway', user?.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setLoggedInUserData(data);            
        } else {
            console.log("No such document!");
        }
    }

    const get_stripe_customer_id = async () => {
        const docRef = doc(db, "campaigns", campaignId, 'stripeCustomers', user?.uid);
        const docSnap = await getDoc(docRef);
        //console.log(docSnap);
        if (docSnap.exists()) {
            const data = docSnap.data();
            set_Stripe_customer_id_new(data);
            // console.log("data is :" + JSON.stringify(data));
            // console.log("set_Stripe_customer_id is :" + JSON.stringify(stripe_customer_id_new));

            
        } else {
            // doc.data() will be undefined in this case
            // console.log("No such document!");
            logged_user_stripe_customer_id =false;
        }  
    }

    logged_user_stripe_customer_id = stripe_customer_id_new.customer_id;


    useEffect(() => {
        
        getDataGiveaway();
        get_stripe_customer_id();
    }, [])
    
	const payment_method = () => {
		// console.log('callling api');
		//console.log("getting data" +logged_user_stripe_customer_id )

		if (logged_user_stripe_customer_id) {
			axios.post('http://localhost:4242/get_payment_methods', {
					stripe_customer_id: logged_user_stripe_customer_id
				})
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

	if(logged_user_stripe_customer_id){
		payment_method();
	}

    useEffect(() => {
        //if (!user?.uid) return navigate("/");
        //fetchUserName();
    }, []);
    localStorage.setItem('name', name);

    useEffect(() => {
        const interval = setInterval(() => {
            setStripeError('');
        }, 2000);

        return () => clearInterval(interval);
    }, [stripeError]);

    var vipEntryPrice = campaignData.giveawayVIPEntryCost ?? 0;
    var freeEntryPrice = "0";
    //console.log(userData);

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

    const handleSubmit = async (event) => {
      	event.preventDefault();
      	await collectPayment();
    }

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

    const collectPayment = async () => {
    	if (clientemail === "" || name === "") {
    		setStripeError("All fields are required");
    		return
    	}
    	if (customerSet) {
    		// logged users
    		if (isActive) {
    			//already saved card
    			axios.post('http://localhost:4242/payment_intent_already_save_card', {
    					name: name,
    					email: clientemail,
    					price: priceToPay,
    					isChecked: isSubscribed,
    					useSaveCard: isActive,
    					stripe_customer_id: logged_user_stripe_customer_id,

    				})
    				.then(function (response) {
    					//console.log(response);
    					if (response.data.pi_status !== 'succeeded') {
    						stripe
    							.confirmCardPayment(response.data.secret, {
    								payment_method: {
    									card: elements.getElement(CardElement),
    									billing_details: {
    										name: name,
    										email: clientemail,
    									}
    								},
    							}).then(function (result) {
    								if (result.error) {
    									setStripeError(result.error.message);

    								} else {
    									//console.log(result);
    									alert('Payment Successful');
    									var data = {
    										email: response.data.email,
    										price: priceToPay,
    										stripe_customer_id: response.data.stripe_customer_id,
    										payment_id: result.id,
    										status: result.status,
    										campaignId: campaignId,
    										entryType: entryType,
    										type: "Giveaway",
    										time: serverTimestamp(),

    									}
    									var stripe_customer_data = {
    										customer_id: response.data.stripe_customer_id,
    									}

    									setHasUserClaimedFreeEntry(true);
    									setHasUserPurchasedVIPEntry(true);
    									toggleModal();

    									//console.log(data)
    									saveDataInStripeCustomer(stripe_customer_data);



    									//console.log(data)
    									saveDataInGiveaway(data);
    								}

    							});

    					} else if (response.data.pi_status === 'succeeded') {
    						var data = {
    							email: response.data.email,
    							price: priceToPay,
    							stripe_customer_id: response.data.stripe_customer_id,
    							payment_id: response.data.id,
    							status: response.data.pi_status,
    							entryType: entryType,
    							campaignId: campaignId,
    							type: "Giveaway",
    							time: serverTimestamp(),

    						}
    						var stripe_customer_data = {
    							customer_id: response.data.stripe_customer_id,
    						}

    						setHasUserClaimedFreeEntry(true);
    						setHasUserPurchasedVIPEntry(true);
    						toggleModal();

    						//console.log(data)
    						saveDataInStripeCustomer(stripe_customer_data);


    						//console.log(data)
    						saveDataInGiveaway(data);
    						setStripeError(response.data.msg);
    					}
    				})
    				.catch(function (error) {
    					setStripeError(error.message);

    				});
    		} else {
    			//use new card/change card
    			if (!stripe || !elements) {
    				return 'Fail to load';
    			}
    			await stripe.createPaymentMethod({
    				type: 'card',
    				card: elements.getElement(CardElement),
    				billing_details: {
    					name: name,
    				},
    			}).then(function (result) {
    				if (result.error) {
    					setStripeError(result.error.message);

    				}
    				if (result.paymentMethod) {
    					axios.post('http://localhost:4242/payment_intent_save_new_card', {
    							email: clientemail,
    							name: name,
    							price: priceToPay,
    							isChecked: isSubscribed,
    							useSaveCard: isActive,
    							stripe_customer_id: logged_user_stripe_customer_id,
    						})
    						.then(response => {
    							if (response.data.success === true) {
    								var clientSecret = response.data.secret;
    								var name = response.data.name;
    								var email = response.data.email;
    								stripe
    									.confirmCardPayment(clientSecret, {
    										payment_method: {
    											card: elements.getElement(CardElement),
    											billing_details: {
    												name: name,
    												email: email,
    											}
    										},
    									}).then(function (result) {
    										if (result.error) {
    											setStripeError(result.error.message);

    										}
    										if (result.paymentIntent) {
    											alert("Payment Successful");
    											var data = {
    												email: response.data.email,
    												price: priceToPay,
    												stripe_customer_id: response.data.stripe_customer_id,
    												payment_id: result.paymentIntent.id,
    												entryType: entryType,
    												status: result.paymentIntent.status,
    												campaignId: campaignId,
    												type: "Giveaway",
    												time: serverTimestamp(),

    											}
    											var stripe_customer_data = {
    												customer_id: response.data.stripe_customer_id,
    											}

    											setHasUserClaimedFreeEntry(true);
    											setHasUserPurchasedVIPEntry(true);
    											toggleModal();

    											//console.log(data)
    											saveDataInStripeCustomer(stripe_customer_data);
    											saveDataInGiveaway(data);
    											//console.log(result);
    											axios.post('http://localhost:4242/set_as_default', {
    													payment_method: result.paymentIntent.payment_method,
    													payment_intent: result.paymentIntent.id,
    													isChecked: isSubscribed,
    													useSaveCard: isActive,
    													stripe_customer_id: logged_user_stripe_customer_id,

    												})
    												.then(function (response) {
    													//console.log(response);
    												})
    												.catch(function (error) {
    													setStripeError(error.message);

    												});
    										}
    									});
    							} else {
    								setStripeError(response.data.msg);
    							}
    						})
    						.catch(function (error) {
    							setStripeError(error.message);

    						});
    				}
    			});
    		}
    	} else {
    		// non logged user / direct payment
    		if (!stripe || !elements) {
    			return 'Fail to load';
    		}

    		await stripe.createPaymentMethod({
    			type: 'card',
    			card: elements.getElement(CardElement),
    			billing_details: {
    				name: name,
    			},
    		}).then(function (result) {
    			if (result.error) {
    				setStripeError(result.error.message);

    			}
    			if (result.paymentMethod) {
    				axios.post('http://localhost:4242/payment_intent', {
    						email: clientemail,
    						name: name,
    						price: priceToPay,
    						isChecked: isSubscribed,
    						useSaveCard: isActive,
    					})
    					.then(response => {
    						//console.log(response);
    						if (response.data.success === true) {
    							var clientSecret = response.data.secret;
    							var name = response.data.name;
    							var email = response.data.email;
    							var stripe_customer_id = response.data.stripe_customer_id;
    							stripe
    								.confirmCardPayment(clientSecret, {
    									payment_method: {
    										card: elements.getElement(CardElement),
    										billing_details: {
    											name: name,
    											email: email,
    										}
    									},
    								}).then(function (result) {
    									if (result.error) {
    										setStripeError(result.error.message);


    									}
    									if (result.paymentIntent) {
    										//console.log("this is one time payment result  : " + JSON.stringify(result));
    										alert("Payment Successful");
    										var data = {
    											email: email,
    											price: priceToPay,
    											stripe_customer_id: stripe_customer_id,
    											payment_id: result.paymentIntent.id,
    											status: result.paymentIntent.status,
    											entryType: entryType,
    											campaignId: campaignId,
    											type: "Giveaway",
    											time: serverTimestamp(),

    										}
    										var stripe_customer_data = {
    											customer_id: response.data.stripe_customer_id,
    										}

    										setHasUserClaimedFreeEntry(true);
    										setHasUserPurchasedVIPEntry(true);
    										toggleModal();

    										//console.log(data)
    										saveDataInStripeCustomer(stripe_customer_data);

    										//console.log(data)
    										saveDataInGiveaway(data);
    										//console.log('data save successful')
    										// setDoc(doc(db, "campaigns", campaignId, 'giveaway', userId), {
    										//     person: user,
    										//     price: "1.5",
    										//     auto: false,
    										//     time: serverTimestamp(),
    										// })
    										//console.log(isSubscribed);
    										if (isSubscribed) {
    											axios.post('http://localhost:4242/set_as_default', {
    													payment_method: result.paymentIntent.payment_method,
    													payment_intent: result.paymentIntent.id,
    													isChecked: isSubscribed,
    													useSaveCard: isActive,

    												})
    												.then(function (response) {
    													//console.log(response);
    												})
    												.catch(function (error) {
    													setStripeError(error.message);

    												});
    										} else {

    										}


    									}
    								});
    						} else {
    							setStripeError(response.data.msg);
    						}
    					})
    					.catch(function (error) {
    						setStripeError(error.message);

    					});
    			}
    		});



    	}
    };

    const toggleModal = () => {
        setModal(!modal);
    };

    if (modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

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
			).then(()=>{
			setPriceToPay(vipEntryPrice);
			setEntryType('vip');
			toggleModal();
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
 
	return (
		<>
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
			{/* <form
			action="http://localhost:4242/create-giveaway-session"
			method="POST"
			> */}
			<InteractButton onClick={buyGiveawayAlert} disabled={hasUserPurchasedVIPEntry || isCampaignEnded}>
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

			{/* <form
			//   action="http://localhost:4242/create-giveaway-session"
			//   method="POST"
			> */}
			<InteractButton
			onClick={freeGiveawayAlert}
			disabled={hasUserClaimedFreeEntry || hasUserPurchasedVIPEntry || isCampaignEnded}
			>
			Get a free entry
			</InteractButton>
			{/* </form> */}
		</Box>
		</JumboCardQuick>
		{modal && (
		<div className="modal" style={{zIndex:"1000",backgroundColor:"transparent"}}>
			<div onClick={toggleModal} className="overlay" style={{zIndex:"1001"}}></div>
			<div className="modal-content" style={{zIndex:"1002"}}>
				<div className='card-body-text'>Price : "${formatMoney(vipEntryPrice)}"</div>
				<div className='ButtonsWrapper'>
					<form onSubmit={handleSubmit}>
						{customerSet
							? <div className='card-body-text'>
								<p>Payment Method </p>
								<p className={isActive ? 'click-to-show-card-toggle-true' : 'click-to-show-card-toggle-true'}><b style={{ padding: 0 }}>{cardBrand} </b>ending with {last4}
									<button type='button' onClick={handleClickToggle} className="buttonFloat">change</button>
								</p>
								<div className={isActive ? 'click-to-show-card-toggle-false' : 'click-to-show-card-toggle-true'}>
									<div className='card-element-div'>
									<CardElement options={CARD_ELEMENT_OPTIONS} />
									</div>
									{/* <div className='show-error'>

									{stripeError}
									</div> */}
								</div>
							</div>
							:
							<div>
								<div className='card-element-div'>
								<CardElement options={CARD_ELEMENT_OPTIONS} />
								</div>
								<div className='checkbox-div card-body-text' >
								<input
									type="checkbox"
									value={isSubscribed}
									onChange={handleCheckBox}
									id="subscribe"
									name="subscribe"
								/>
									Save Card
								</div>
							</div>
						}

						{/* <div className='checkbox-div card-body-text' >
							<input
								type="checkbox"
								value={isSubscribed}
								onChange={handleCheckBox}
								id="subscribe"
								name="subscribe"
							/>
									Save Card
						</div> */}
						<div className='show-error'>
							{stripeError ? stripeError : ''}
						</div>
						<button type="submit" >
							Pay
						</button>
					</form>
				</div>
				<button id="submit" className="close-modal" onClick={toggleModal}>
					X
				</button>
			</div>
		</div>
		)}
		</>
	);
}