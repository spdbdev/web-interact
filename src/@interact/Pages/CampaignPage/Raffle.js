import './CampaignPage.css';
import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, } from '@mui/material';
import { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
//import { query, where } from "firebase/firestore";
//import { Navigate } from 'react-router-dom';
//import navigate
import { useNavigate } from "react-router-dom";
import { db, auth } from '../../firebase';
import { doc, setDoc, serverTimestamp, getDoc,query,collection,where,getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Raffle({ campaignData }) {
  
    const stripe = useStripe();
    const elements = useElements();
    const [modal, setModal] = useState(false);
    const [clientemail, isClientEmail] = useState("");
    const [stripeError, setStripeError] = useState("");
    const [name, setName] = useState("");
    //const [userData, setUserData] = useState("");
    const [loggedInUserData, setLoggedInUserData] = useState("");
    const [stripe_customer_id_new, set_Stripe_customer_id_new] = useState(false);

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [customerSet, isCustomerSet] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [cardBrand, setCardBrand] = useState(true);
    const [last4, setLast4] = useState(true);
    const [useSaveCard, setUseSaveCard] = useState(false);
    //const fullData = collection(db, "campaigns");
    //const [newcampaignData, setnewCampaignData] = useState({})
    const campaignId = 'test12345';
    //const [bids, setBids] = useState([])
    //const [comments, setComments] = useState([])
    //const [supporters, setSupporters] = useState([])
    const [user] = useAuthState(auth); 

    const navigate = useNavigate();
    //console.log('User is ' + JSON.stringify(user));
    //console.log("logged_user_stripe_customer_id : " + logged_user_stripe_customer_id);
  
   var logged_user_stripe_customer_id = false;

   const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      //console.log("thi is data"+ JSON.stringify(data));
      console.log(data)
      console.log(data.name)
      console.log(data.email)
      console.log(data.uid)
      setName(data.name);
      isClientEmail(data.email)

      setName(data.name);
    } catch (err) {
      console.error(err);
      ///alert("An error occured while fetching user data");
    }
  };

  fetchUserName();
    const getDataRaffle = async () => {
        const docRef = doc(db, "campaigns", campaignId, 'raffles', user?.uid);
        const docSnap = await getDoc(docRef);
        //console.log(docSnap);
        if (docSnap.exists()) {
          //  alert('exist');
            const data = docSnap.data();
            setLoggedInUserData(data);
            //console.log("data is :" + JSON.stringify(data));
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    
    const get_stripe_customer_id = async () => {
        const docRef = doc(db, "campaigns", campaignId, 'stripeCustomers', user?.uid);
        const docSnap = await getDoc(docRef);
        //console.log(docSnap);
        if (docSnap.exists()) {
          //  alert('exist');
            const data = docSnap.data();
            set_Stripe_customer_id_new(data);
            console.log("data is :" + JSON.stringify(data));
            console.log("set_Stripe_customer_id is :" + JSON.stringify(stripe_customer_id_new));

            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            logged_user_stripe_customer_id =false;
        }  
    }

    logged_user_stripe_customer_id = stripe_customer_id_new.customer_id;


    useEffect(() => {
        
        getDataRaffle();
        get_stripe_customer_id();
    }, [])
    
const payment_method = () => {
   // console.log('callling api');
    //console.log("getting data" +logged_user_stripe_customer_id )

    if(logged_user_stripe_customer_id){
        axios.post('http://localhost:4242/get_payment_methods', {
        stripe_customer_id:logged_user_stripe_customer_id 
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
    }else{
        isCustomerSet(false);
    }
}




if(logged_user_stripe_customer_id){
    payment_method();

}




    useEffect(() => {
        if (!user?.uid) return navigate("/");
        //fetchUserName();
    }, [user]);
    localStorage.setItem('name', name);

     

    // const fetchUserName = async () => {
    //     const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    //     const doc = await getDocs(q);
    //     const data = doc.docs[0].data();
    //     console.log("thi is data" + JSON.stringify(data));
    //     var logUserData = data;
    //     setUserData(logUserData);
    //     console.log("this is userData" + JSON.stringify(userData));
    // };

   // let userLogInUid = user.uid;
    //let userId = user.uid;

   // console.log("this is user   id : " + userId); // dummy user id

   
 


    useEffect(() => {
        const interval = setInterval(() => {
            setStripeError('');
        }, 2000);

        return () => clearInterval(interval);
    }, [stripeError]);

    var rafflePrice = "1.50";
    //console.log(userData);

    const saveDataInRaffle = (data) => {
        setDoc(doc(db, "campaigns", campaignId, 'raffles', user?.uid), data)
    }

    const saveDataInStripeCustomer = (stripe_customer_data) => {
        console.log(stripe_customer_data);
        setDoc(doc(db, "campaigns", campaignId,'stripeCustomers',user?.uid), stripe_customer_data)
        setDoc(doc(db, 'stripeCustomers',user?.uid), stripe_customer_data)
    }


    const handleClickToggle = event => {
        // 👇️ toggle isActive state on click
        event.preventDefault();
        setUseSaveCard(current_a => !current_a);
        setIsActive(current_b => !current_b);
        //console.log("useSaveCard : "+useSaveCard);
        //console.log("isActive : "+isActive);


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

console.log("user.name : " + JSON.stringify(user));
console.log("user.name : " + user?.uid);

console.log("user.email : " + user?.email);

    const handleSubmit = async (event) => {
        event.preventDefault()
        if(clientemail === "" || name ===""){
            setStripeError("All fields are required");
            return
          }
        if (customerSet) {
            alert(isActive);
            // logged users
            if (isActive) {
                //already saved card
                axios.post('http://localhost:4242/payment_intent_already_save_card', {
                    name: name,
                    email: clientemail,
                    price: rafflePrice,
                    isChecked: isSubscribed,
                    useSaveCard: isActive,
                    stripe_customer_id:logged_user_stripe_customer_id,

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
                
                                    }else{
                                        //console.log(result);
                                        alert('Payment Successful');
                                        var data = {
                                            email: response.data.email,
                                            price: rafflePrice,
                                            stripe_customer_id: response.data.stripe_customer_id,
                                            payment_id: result.id,
                                            status: result.status,
                                            campaignId: campaignId,
                                            type: "Giveaway",
                                            time: serverTimestamp(),
    
                                        }
                                        var stripe_customer_data = {
                                            customer_id: response.data.stripe_customer_id,
                                        }
                                        //console.log(data)
                                        saveDataInStripeCustomer(stripe_customer_data);


                                     
                                        //console.log(data)
                                        saveDataInRaffle(data);
                                    }
                                   
                                });

                        } else if(response.data.pi_status === 'succeeded') {
                             var data = {
                                        email: response.data.email,
                                        price: rafflePrice,
                                        stripe_customer_id: response.data.stripe_customer_id,
                                        payment_id: response.data.id,
                                        status: response.data.pi_status,
                                        campaignId: campaignId,
                                        type: "Giveaway",
                                        time: serverTimestamp(),

                                    } 
                                    var stripe_customer_data = {
                                        customer_id: response.data.stripe_customer_id,
                                    }
                                    //console.log(data)
                                    saveDataInStripeCustomer(stripe_customer_data);


                                    //console.log(data)
                                    saveDataInRaffle(data);
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
                            price: rafflePrice,
                            isChecked: isSubscribed,
                            useSaveCard: isActive,
                            stripe_customer_id:logged_user_stripe_customer_id,
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
                                                    price: rafflePrice,
                                                    stripe_customer_id: response.data.stripe_customer_id,
                                                    payment_id: result.paymentIntent.id,
                                                    status: result.paymentIntent.status,
                                                    campaignId: campaignId,
                                                    type: "Giveaway",
                                                    time: serverTimestamp(),
    
                                                }
                                                var stripe_customer_data = {
                                                    customer_id: response.data.stripe_customer_id,
                                                }
                                                //console.log(data)
                                                saveDataInStripeCustomer(stripe_customer_data);
                                                saveDataInRaffle(data);
                                                //console.log(result);
                                                axios.post('http://localhost:4242/set_as_default', {
                                                    payment_method: result.paymentIntent.payment_method,
                                                    payment_intent: result.paymentIntent.id,
                                                    isChecked: isSubscribed,
                                                    useSaveCard: isActive,
                                                    stripe_customer_id:logged_user_stripe_customer_id,

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
                        price: rafflePrice,
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
                                                price: rafflePrice,
                                                stripe_customer_id: stripe_customer_id,
                                                payment_id: result.paymentIntent.id,
                                                status: result.paymentIntent.status,
                                                campaignId: campaignId,
                                                type: "Giveaway",
                                                time: serverTimestamp(),

                                            }
                                            var stripe_customer_data = {
                                                customer_id: response.data.stripe_customer_id,
                                            }
                                            //console.log(data)
                                            saveDataInStripeCustomer(stripe_customer_data);

                                            //console.log(data)
                                            saveDataInRaffle(data);
                                            //console.log('data save successful')
                                            // setDoc(doc(db, "campaigns", campaignId, 'raffles', userId), {
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

    const handleChangeEmail = event => {
        isClientEmail(event.target.value);
    };
    const handleChangeName = event => {
        setName(event.target.value);
    };
 
    return (
        <div className='Card'>

            <div style={{ fontSize: 30, textDecoration: 'underline' }}><b>Raffle</b></div>
            <div><span className='Highlight'>50</span>x 30 minute interactions</div>
            <div><span className='Highlight'>50</span>winners will be randomly chosen from the ticketholders at the end of the campaign</div>
            <div style={{ fontSize: 20 }}>Ticket cost: <span className='Highlight'>${campaignData?.rafflePrice}</span></div>


            <div>Chance multipler: 1x <a href='http://localhost:3000/?#/'>learn more</a></div>

            <div className='InfoSection'>
                <InfoCircleOutlined style={{ fontSize: 30, color: 'gray' }} />
                <div style={{ marginRight: -10 }}>Remember, the % chance of winning the raffle will go down as more fans join the raffle</div>
            </div>

            <div style={{ color: '#782eee' }}>
                <Button variant='outlined' onClick={toggleModal} className="btn-modal" style={{ textTransform: 'none', borderRadius: 0, borderTopRightRadius: 11, borderBottomLeftRadius: 11 }} color='inherit' type="submit">Buy</Button>
                {modal && (

                    <div className="modal">
                        <div onClick={toggleModal} className="overlay"></div>
                        <div className="modal-content">
                            <div className='modal_input_email'>
                                <input
                                    type="email"
                                    name="email"
                                    onChange={handleChangeEmail}
                                    value={clientemail}
                                    placeholder="Email"
                                />
                                <input
                                    type="text"
                                    name="name"
                                    onChange={handleChangeName}
                                    value={name}
                                    placeholder="Username"
                                />
                            </div>
                            <div className='card-body-text'>Price : "$1.50"</div>
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

            </div>
        </div>


    )
}