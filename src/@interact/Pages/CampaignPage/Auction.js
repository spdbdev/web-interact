import './CampaignPage.css';
import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Divider, OutlinedInput, InputAdornment, useScrollTrigger } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from "react-router-dom";
import { db, auth } from '../../firebase';
import { doc, getDocs, orderBy, setDoc, addDoc, collection, serverTimestamp, getDoc,query,where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Auction({ bids, campaignData, bidAction }) {
  // // //console.log('bid looking at', Math.min(bids.length -1, campaignData?.numBidSlots-1), bids[Math.min(bids.length -1, campaignData?.numBidSlots-1)].price)
  let userData = {
    id: 'user1234', 
    photoUrl: 'https://sm.ign.com/ign_tr/cover/j/john-wick-/john-wick-chapter-4_178x.jpg', 
    username: 'andrew123',
  }
  const [bidAmount, setBidAmount] = useState(0);
  const [clientemail, isClientEmail] = useState("");
  const [name, setName] = useState("");
  const [autoBid, setAutoBid] = useState("5");

  const [loggedInUserData, setLoggedInUserData] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [customerSet, isCustomerSet] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [cardBrand, setCardBrand] = useState(true);
  const [last4, setLast4] = useState(true);
  const [useSaveCard, setUseSaveCard] = useState(false);
  const [stripe_customer_id_new, set_Stripe_customer_id_new] = useState(false);

  const [modal, setModal] = useState(false);
  const [newModal, setNewModal] = useState(false);

  const [stripeError, setStripeError] = useState("");
  const campaignId = 'test12345';
  const [user] = useAuthState(auth);
//console.log(user);
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();


  //console.log(user.uid);
//   const getFullData = async () => {
//   const docRef = doc(db, "users","0th8weoPnKV0KglflVBL");
//   const docSnap =await getDoc(docRef);
//   if (docSnap.exists()) {
//     //  alert('exist');
//     const data = docSnap.data();
//     console.log("data is :" + JSON.stringify(data));

//   }else {
//     // doc.data() will be undefined in this case
//     console.log("No such document!");
//   }
// }

//getFullData();

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
    //alert("An error occured while fetching user data");
  }
};

fetchUserName();

  const getDataRaffle = async () => {
    const docRef = doc(db, "campaigns", campaignId, 'raffles', user?.uid);
    const docSnap = await getDoc(docRef);
    ////console.log(docSnap);
    if (docSnap.exists()) {
      //  alert('exist');
      const data = docSnap.data();
      setLoggedInUserData(data);
      ////console.log("data is :" + JSON.stringify(data));

    } else {
      // doc.data() will be undefined in this case
      //console.log("No such document!");
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
        logged_user_stripe_customer_id = false;
    }  
}

 logged_user_stripe_customer_id = stripe_customer_id_new.customer_id;

useEffect(() => {
    getDataRaffle();
    get_stripe_customer_id();
  }, [])


  const payment_method = () => {
    // //console.log('callling api');
    ////console.log("getting data" +logged_user_stripe_customer_id )

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
            ////console.log("getting data" +logged_user_stripe_customer_id )
          } else {
            isCustomerSet(false);
            //setUseSaveCard(false);
            //console.log("not getting data")
          }
        })
        .catch(function (error) {
          //console.log(error);
        });
    } else {
      isCustomerSet(false);
    }
  }

  if (logged_user_stripe_customer_id) {
    payment_method();

  }

  useEffect(() => {
    if (!user?.uid) return navigate("/");
    //fetchUserName();
  }, [user]);
  localStorage.setItem('name', name);

  const handleClickToggle = event => {
    // 👇️ toggle isActive state on click
    event.preventDefault();
    setUseSaveCard(current_a => !current_a);
    setIsActive(current_b => !current_b);
    ////console.log("useSaveCard : "+useSaveCard);
    ////console.log("isActive : "+isActive);

  };

  const handleCheckBox = event => {
    if (event.target.checked) {
      ////console.log('✅ Checkbox is checked');
    } else {
      ////console.log('⛔️ Checkbox is NOT checked');
    }
    setIsSubscribed(current => !current);
  };

  const saveDataInRaffle = (data) => {
    var newData = JSON.stringify(data);
    setDoc(doc(db, "campaigns", campaignId, 'bids', user?.uid), data)
  }
  const saveDatainStripeCustomer = (stripe_customer_data) => {
    console.log(stripe_customer_data);
    setDoc(doc(db, "campaigns", campaignId,'stripeCustomers',user?.uid), stripe_customer_data)
}
  // const saveDataInUser = (data) => {
  //   setDoc(doc(db, "users", campaignId, 'bids', user?.uid), data)
  // }

  useEffect(() => {
    ////console.log('use save card value : ' + useSaveCard)

  }, [useSaveCard])


  const CARD_ELEMENT_OPTIONS = {
    iconStyle: "solid",
    hidePostalCode: true,
    style: {
      base: {
        color: '#817F80',
        '::placeholder': {
          color: '#817F80',
        },
      },
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setStripeError('');
    }, 2000);

    return () => clearInterval(interval);
  }, [stripeError]);



  const handleSubmit = async (event) => {
    //console.log('aaaaa');
    event.preventDefault()
    if (clientemail === "" || name === "") {
      setStripeError("All fields are required");
      return
    }

    if (!stripe || !elements) {
      return 'Fail to load';
    }
    if (customerSet) {
      alert(isActive);
      // logged users
      if (isActive) {
        //already saved card
        axios.post('http://localhost:4242/payment_intent_already_save_card', {
          name: name,
          email: clientemail,
          price: bidAmount,
          isChecked: isSubscribed,
          useSaveCard: isActive,
          stripe_customer_id: logged_user_stripe_customer_id,
          type:"auction_place_bid",

        })
          .then(function (response) {
            if(response.data.success === true){

              var data = {
                person:userData,
                email: response.data.email,
                price: bidAmount,
                stripe_customer_id: response.data.stripe_customer_id,
                payment_id: response.data.id,
                status: response.data.pi_status,
                campaignId: campaignId,
                type: "auction_place_bid",
                time: serverTimestamp(),

              }
              var stripe_customer_data = {
                customer_id: response.data.stripe_customer_id,
            }
            //console.log(data)
            saveDatainStripeCustomer(stripe_customer_data);

              ////console.log(data)
              saveDataInRaffle(data);
              setStripeError(response.data.msg);
              
            }else{
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
              price: bidAmount,
              isChecked: isSubscribed,
              useSaveCard: isActive,
              stripe_customer_id: logged_user_stripe_customer_id,
              type:"auction_place_bid",

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
                          person:userData,
                          email: response.data.email,
                          price: bidAmount,
                          stripe_customer_id: response.data.stripe_customer_id,
                          payment_id: result.paymentIntent.id,
                          status: result.paymentIntent.status,
                          campaignId: campaignId,
                          type: "auction_place_bid",
                          time: serverTimestamp(),

                        }
                        var stripe_customer_data = {
                          customer_id: response.data.stripe_customer_id,
                      }
                      //console.log(data)
                      saveDatainStripeCustomer(stripe_customer_data);

                        ////console.log(data)
                        saveDataInRaffle(data);
                        ////console.log(result);
                        axios.post('http://localhost:4242/set_as_default', {
                          payment_method: result.paymentIntent.payment_method,
                          payment_intent: result.paymentIntent.id,
                          isChecked: isSubscribed,
                          useSaveCard: isActive,
                          stripe_customer_id: logged_user_stripe_customer_id,

                        })
                          .then(function (response) {
                            ////console.log(response);
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
            price: bidAmount,
            isChecked: isSubscribed,
            useSaveCard: isActive,
            type:"auction_place_bid",
          })
            .then(response => {
              ////console.log(response);
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
                      ////console.log("this is one time payment result  : " + JSON.stringify(result));
                      alert("Payment Successful");
                      var data = {
                        person:userData,
                        email: email,
                        price: bidAmount,
                        stripe_customer_id: stripe_customer_id,
                        payment_id: result.paymentIntent.id,
                        status: result.paymentIntent.status,
                        campaignId: campaignId,
                        type: "auction_place_bid",
                        time: serverTimestamp(),

                      }
                      ////console.log(data)
                      var userCoustomerId = {
                        stripe_customer_id: response.data.stripe_customer_id,
                    }
                    var stripe_customer_data = {
                      customer_id: response.data.stripe_customer_id,
                  }
                  //console.log(data)
                  saveDatainStripeCustomer(stripe_customer_data);

                    //saveDataInUser(userCoustomerId);
                      saveDataInRaffle(data);
                      ////console.log('data save successful')
                      // setDoc(doc(db, "campaigns", campaignId, 'raffles', userId), {
                      //     person: user,
                      //     price: "1.5",
                      //     auto: false,
                      //     time: serverTimestamp(),
                      // })
                      ////console.log(isSubscribed);
                      if (isSubscribed) {
                        axios.post('http://localhost:4242/set_as_default', {
                          payment_method: result.paymentIntent.payment_method,
                          payment_intent: result.paymentIntent.id,
                          isChecked: isSubscribed,
                          useSaveCard: isActive,

                        })
                          .then(function (response) {
                            ////console.log(response);
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


  const autoBidHandleSubmit = async (event) => {
    console.log('auto bid handle submit');
    console.log(autoBid)
    event.preventDefault()
    if (clientemail === "" || name === "") {
      setStripeError("All fields are required");
      return
    }

    if (!stripe || !elements) {
      return 'Fail to load';
    }
    if (customerSet) {
      alert(isActive);
      // logged users
      if (isActive) {
        //already saved card
        axios.post('http://localhost:4242/payment_intent_already_save_card', {
          name: name,
          person : userData,
          email: clientemail,
          price: autoBid,
          isChecked: isSubscribed,
          useSaveCard: isActive,
          stripe_customer_id: logged_user_stripe_customer_id,
          type:"auction_place_bid",

        })
          .then(function (response) {
            if(response.data.success === true){

              var data = {
                person:userData,
                email: response.data.email,
                price: autoBid,
                stripe_customer_id: response.data.stripe_customer_id,
                payment_id: response.data.id,
                status: response.data.pi_status,
                campaignId: campaignId,
                type: "auction_place_bid",
                time: serverTimestamp(),

              }
              var stripe_customer_data = {
                customer_id: response.data.stripe_customer_id,
            }
            //console.log(data)
            saveDatainStripeCustomer(stripe_customer_data);

              ////console.log(data)
              saveDataInRaffle(data);
              setStripeError(response.data.msg);
              
            }else{
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
              price: autoBid,
              isChecked: isSubscribed,
              useSaveCard: isActive,
              stripe_customer_id: logged_user_stripe_customer_id,
              type:"auction_place_bid",
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
                          person:userData,
                          email: response.data.email,
                          price: autoBid,
                          stripe_customer_id: response.data.stripe_customer_id,
                          payment_id: result.paymentIntent.id,
                          status: result.paymentIntent.status,
                          campaignId: campaignId,
                          type: "auction_place_bid",
                          time: serverTimestamp(),

                        }
                        ////console.log(data)
                        saveDataInRaffle(data);
                        ////console.log(result);
                        axios.post('http://localhost:4242/set_as_default', {
                          payment_method: result.paymentIntent.payment_method,
                          payment_intent: result.paymentIntent.id,
                          isChecked: isSubscribed,
                          useSaveCard: isActive,
                          stripe_customer_id: logged_user_stripe_customer_id,

                        })
                          .then(function (response) {
                            ////console.log(response);
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
            person:userData,
            email: clientemail,
            name: name,
            price: autoBid,
            isChecked: isSubscribed,
            useSaveCard: isActive,
            type:"auction_place_bid",
          })
            .then(response => {
              ////console.log(response);
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
                      ////console.log("this is one time payment result  : " + JSON.stringify(result));
                      alert("Payment Successful");
                      var data = {
                        person:userData,
                        email: email,
                        price: autoBid,
                        stripe_customer_id: stripe_customer_id,
                        payment_id: result.paymentIntent.id,
                        status: result.paymentIntent.status,
                        campaignId: campaignId,
                        type: "auction_place_bid",
                        time: serverTimestamp(),

                      }
                      ////console.log(data)
                      
                    var stripe_customer_data = {
                      customer_id: response.data.stripe_customer_id,
                  }
                  //console.log(data)
                  saveDatainStripeCustomer(stripe_customer_data);
      
                    //saveDataInUser(userCoustomerId);
                      saveDataInRaffle(data);
                      ////console.log('data save successful')
                      // setDoc(doc(db, "campaigns", campaignId, 'raffles', userId), {
                      //     person: user,
                      //     price: "1.5",
                      //     auto: false,
                      //     time: serverTimestamp(),
                      // })
                      ////console.log(isSubscribed);
                      if (isSubscribed) {
                        axios.post('http://localhost:4242/set_as_default', {
                          payment_method: result.paymentIntent.payment_method,
                          payment_intent: result.paymentIntent.id,
                          isChecked: isSubscribed,
                          useSaveCard: isActive,

                        })
                          .then(function (response) {
                            ////console.log(response);
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

  const newToggleModal = () => {
    setNewModal(!newModal);
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
      <div style={{ fontSize: 30, textDecoration: 'underline' }}><b>Auction</b></div>
      <div>Top<span className='Highlight'>3</span>x 60 min interactions</div>
      <div><span className='Highlight'>17</span>x 30 min interactions</div>
      <div><span className='Highlight'>20</span>/ 20 have already been bid on, the top bidders win at the end of the campaign</div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* <div>Original Price: <span class='Highlight'>{'$'}20</span></div> */}
        <div>Current lowest price to win:  <span class='Highlight'>{'$'}{bids && campaignData ? bids[Math.min(bids.length - 1, campaignData.numBidSlots - 1)]?.price : '0'}</span></div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ paddingRight: 20 }}>Enter bid price {'('}total{')'} </div>
        <OutlinedInput
          id="outlined-adornme nt-amount"
          type="number"
          inputProps={{ step: ".5" }}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          style={{ height: 50 }}
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
        />
      </div>
      <div className='InfoSection'>
        <InfoCircleOutlined style={{ fontSize: 30, color: 'gray' }} />
        <div style={{ fontSize: 15, marginRight: -10 }}> If multiple parties bid the same price, the ones who bid first will have higher rankings</div>
      </div>
      <div style={{ color: '#782eee', display: 'flex', justifyContent: 'space-around', width: '100%' }}>
        {/* <form action="http://localhost:4242/create-auction-session" method="POST">  */}
        <Button variant='outlined' onClick={toggleModal} className="btn-modal" style={{ textTransform: 'none', borderRadius: 0, borderTopRightRadius: 11, borderBottomLeftRadius: 11 }} color='inherit' type="submit">Place bid</Button>
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
                  placeholder="type Email"
                />
                <input
                  type="text"
                  name="name"
                  onChange={handleChangeName}
                  value={name}
                  placeholder="type name"
                />
              </div>
              <div>price : {bidAmount}</div>
              <div className='ButtonsWrapper'>
                <form onSubmit={handleSubmit}>
                  {customerSet
                    ? <div className='card-body-text'>
                      <p>Payment Method </p>
                      <p className={isActive ? 'click-to-show-card-toggle-true' : 'click-to-show-card-toggle-true'}><b style={{ padding: 0 }}>{cardBrand} </b>ending with {last4}
                        <button type='button' onClick={handleClickToggle} className="buttonFloat">change</button>
                      </p>
                      <div className={isActive ? 'click-to-show-card-toggle-false' : 'click-to-show-card-toggle-true'}>
                        <CardElement options={CARD_ELEMENT_OPTIONS} />
                        {/* <div className='show-error'>

                                                {stripeError}
                                                </div> */}
                      </div>
                    </div>
                    :
                    <div>

                      <CardElement options={CARD_ELEMENT_OPTIONS} />


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

                  <div className='show-error'>
                    {stripeError ? stripeError : ''}
                  </div>
                  <button type="submit" >


                    Pay
                  </button>
                </form>
              </div>
              <button id="submit" className="close-modal" onClick={toggleModal}>
                CLOSE
              </button>
            </div>
          </div>
        )}
        or
        <Button variant='outlined' onClick={newToggleModal} style={{ textTransform: 'none', borderRadius: 0, borderTopRightRadius: 11, borderBottomLeftRadius: 11 }} color='inherit' type="submit">Auto bid</Button>
        {newModal && (

<div className="modal">
{console.log(autoBid)}
  <div onClick={newToggleModal} className="overlay"></div>
  <div className="modal-content">
    <div className='modal_input_email'>
      <input
        type="email"
        name="email"
        onChange={handleChangeEmail}
        value={clientemail}
        placeholder="type Email"
      />
      <input
        type="text"
        name="name"
        onChange={handleChangeName}
        value={name}
        placeholder="type name"
      />
    </div>
    <div>price : {autoBid}</div>
    <div className='ButtonsWrapper'>
      <form onSubmit={autoBidHandleSubmit}>
        {customerSet
          ? <div className='card-body-text'>
            <p>Payment Method </p>
            <p className={isActive ? 'click-to-show-card-toggle-true' : 'click-to-show-card-toggle-true'}><b style={{ padding: 0 }}>{cardBrand} </b>ending with {last4}
              <button type='button' onClick={handleClickToggle} className="buttonFloat">change</button>
            </p>
            <div className={isActive ? 'click-to-show-card-toggle-false' : 'click-to-show-card-toggle-true'}>
              <CardElement options={CARD_ELEMENT_OPTIONS} />
              {/* <div className='show-error'>

                                      {stripeError}
                                      </div> */}
            </div>
          </div>
          :
          <div>

            <CardElement options={CARD_ELEMENT_OPTIONS} />


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

        <div className='show-error'>
          {stripeError ? stripeError : ''}
        </div>
        <button type="submit" >
          Pay
        </button>
      </form>
    </div>
    <button id="submit" className="close-modal" onClick={newToggleModal}>
      CLOSE
    </button>
  </div>
</div>
)}
        {/* </form> */}
      </div>
      <span style={{ fontSize: 10, color: '#777' }}>You won't be charged if you don't win</span>
    </div>


  )
}