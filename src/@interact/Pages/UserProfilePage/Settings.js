import { TextField, Button, Stack } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import "./UserProfilePage.css";
import FollowerList from "./FollowerList";
import { Link } from "react-router-dom";
import PasswordChecklist from "react-password-checklist";
import { auth, db, storage as Storage, logout } from "@jumbo/services/auth/firebase/firebase";

import {
  query,
  collection,
  getDocs,
  where,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import Typography from "@mui/material/Typography";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Modal from "@mui/material/Modal";
import logo from "./visa.png";
import logo1 from "./master.png";

import "./setting.css";

import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
} from "firebase/auth";



import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Country, State, City } from "country-state-city";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { FollowButton } from "../CampaignPage/Stats";
import { async } from "@firebase/util";

import { postRequest, getRequest } from "../../../utils/api";
import Select from "react-select";
import Swal from "sweetalert2";

import InteractFlashyButton from "@interact/Components/Button/InteractFlashyButton";
import InteractButton from "../../Components/Button/InteractButton";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

function Settings() {
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [oldpassword, setOldPassword] = useState("");
  const [email, setEmail] = useState("");
  const [open, setOpen] = React.useState(false);
  const [openmodal, setOpenModal] = React.useState(false);

  const [MLoaded, setsetMLoaded] = useState(1);

  const [modalOpened, setModalOpened] = useState(false);

  const [user, loading, error] = useAuthState(auth);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = React.useState(
    "https://www.diethelmtravel.com/wp-content/uploads/2016/04/bill-gates-wealthiest-person.jpg"
  );
  const navigate = useNavigate();

  const stripe = useStripe();

  const elements = useElements();
  const card = useRef();

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
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState([]);

  const [useForReload, setuseForReload] = useState(1);

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
    const states = State.getStatesOfCountry(country.value);
    setSelectedLocation((prev) => {
      return { ...prev, country };
    });

    setLocations((prev) => ({ ...prev, states: parseForSelect(states) }));
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

  const handleOpen1 = (pmid) => {
    getRequest(`/gd_payment_method/${pmid}`)
      .then((resp) => {
        const detail = resp.data.paymentMethod;

        setUpdateCardInfo({
          pid: pmid,
          name: detail.billing_details.name ? detail.billing_details.name : "",
          state: detail.billing_details.address.state
            ? detail.billing_details.address.state
            : "",
          country: detail.billing_details.address.country
            ? detail.billing_details.address.country
            : "",
          city: detail.billing_details.address.city
            ? detail.billing_details.address.city
            : "",
          postalCode: detail.billing_details.address.postal_code
            ? detail.billing_details.address.postal_code
            : "",
        });
        console.log("detail", detail);
        setOpenModal(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleClose1 = () => setOpenModal(false);

  const updatePassword = async () => {
    // Get the value of the old password
    if (password === oldpassword) {
      const credential = EmailAuthProvider.credential(user?.email, oldpassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      await updatePassword(auth.currentUser, password);
    }
  };

  const updateemailofloginusre = async () => {
    const user = doc(db, "users", userId);
    updateDoc(user, {
      email: email,
    })
      .then((response) => {
        alert("updated");
      })
      .catch((error) => {
        console.log(error.message);
      });

    await updateEmail(auth.currentUser, email);
  };

  const getDefaultpaymentmethod = async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const colledoc = await getDocs(q);
    const data = colledoc.docs[0].data();
    getRequest(`/gd_customer_payment_method/${data.customerId}`)
      .then((resp) => {
        if (resp.data.status) {
          console.log(resp.data.paymentMethod);
          setDefaultPaymentMethod([resp.data.paymentMethod]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));

      const colledoc = await getDocs(q);

      const data = colledoc.docs[0].data();
      setName(data.name);
      setUserCostomerId(data.customerId);
      setUserId(colledoc.docs[0].id);
      console.log(colledoc.docs[0].id);
      setEmail(data.email);

      getRequest(`/customer/method/${data.customerId}`)
        .then((resp) => {
          console.log(resp.data.paymentmethod.data);
          setPaymentMethods(resp.data.paymentmethod.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  const deletepaymentMethod = async (paymentid, customerid) => {
    const formData = new FormData();
    formData.append("paymid", paymentid);
    formData.append("customerid", customerid);
    console.log(paymentid, customerid);
    console.log(paymentid, customerid);

    postRequest("/delete_customer_payment_method", formData)
      .then(async (resp) => {
        setPaymentMethods(resp.data.paymentmethod.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editpaymentmenthod = async (customerid) => {
    const formData = new FormData();
    const updateData = {
      billing_details: {
        name: updateCardInfo.name,
        email: "",
        phone: "",
        address: {
          city: updateCardInfo.city,
          country: updateCardInfo.country,
          line1: "pakistan",
          line2: null,
          postal_code: "50931",
          state: updateCardInfo.state,
        },
      },
    };
    formData.append("paymid", updateCardInfo.pid);
    formData.append("name", updateCardInfo.name);
    formData.append("country", updateCardInfo.country);
    formData.append("state", updateCardInfo.state);
    formData.append("city", updateCardInfo.city);
    formData.append("postal", updateCardInfo.postalCode);
    formData.append("customerid", customerid);

    postRequest("/update_customer_payment_method", formData)
      .then(async (resp) => {
        setOpenModal(false);
        setPaymentMethods(resp.data.paymentmethod.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const setdefault = async (paymentid, customerid) => {
    const formData = new FormData();
    formData.append("paymid", paymentid);
    formData.append("customerId", customerid);
    console.log(paymentid, customerid);

    postRequest("/set_default_customer_payment_method", formData)
      .then(async (resp) => {
        console.log(resp.data.paymentmethod.data);
        setPaymentMethods(resp.data.paymentmethod.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const address = cardInfo.address;
    const billingDetails = {
      name: cardInfo.name,
      address: {
        country: address.country,
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
    setsetMLoaded(MLoaded++);
  };

  const userProfile = async () => {
    let q = query(
      collection(db, "userspicture"),
      where("uid", "==", user?.uid)
    );
    const userProfileDoc = await getDocs(q);
    const userProfiledata = userProfileDoc.docs[0].data();
    if (userProfiledata.imageurl) {
      setImage(userProfiledata.imageurl);
    } else {
      setImage(
        "https://www.diethelmtravel.com/wp-content/uploads/2016/04/bill-gates-wealthiest-person.jpg"
      );
    }
  };

  useEffect(() => {
    userProfile();
  }, [user]);

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    console.log(auth.currentUser);
    fetchUserName();
  }, [user, loading, useForReload]);

  const getall = async () => {
    const q = query(collection(db, "stripeCustomers"));
    const doc = await getDocs(q);
    const paymearray = [];
    if (doc.docs.length > 0) {
      for (let index = 0; index < doc.docs.length; index++) {
        const element = doc.docs[index].data();
        if (element.uid === user?.uid) {
          paymearray.push(element.card);
        }
        console.log(element, doc.docs.length);
      }
    }
  };

  useEffect(() => {
    getall();
  }, []);

  useEffect(() => {
    getDefaultpaymentmethod();
  }, [paymentMethods]);

  localStorage.setItem("name", name);

  return (
    <div>
      <Modal
        open={openmodal}
        onClose={handleClose1}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="wrapper">
            <div className="innerWrapper">
              <div className="title">Update Payment Method</div>
              <div className="row">
                <label>Cardholder Name</label>
                <input
                  onChange={(e) =>
                    setUpdateCardInfo({
                      ...updateCardInfo,
                      [e.target.name]: e.target.value,
                    })
                  }
                  type="text"
                  name="name"
                  value={updateCardInfo.name}
                  placeholder="Enter card holder name"
                />
              </div>

              <div className="addressWrapper">
                <div className="row">
                  <label>Postal Code</label>
                  <input
                    onChange={(e) =>
                      setUpdateCardInfo({
                        ...updateCardInfo,
                        [e.target.name]: e.target.value,
                      })
                    }
                    type="text"
                    name="postalCode"
                    value={updateCardInfo.postalCode}
                    placeholder="Enter Postal Code"
                  />
                </div>
                <div className="row">
                  <label>State</label>
                  <input
                    onChange={(e) =>
                      setUpdateCardInfo({
                        ...updateCardInfo,
                        [e.target.name]: e.target.value,
                      })
                    }
                    type="text"
                    name="state"
                    value={updateCardInfo.state}
                    placeholder="Enter State"
                  />
                </div>
                <div className="row">
                  <label>City</label>
                  <input
                    onChange={(e) =>
                      setUpdateCardInfo({
                        ...updateCardInfo,
                        [e.target.name]: e.target.value,
                      })
                    }
                    type="text"
                    name="city"
                    value={updateCardInfo.city}
                    placeholder="Enter city"
                  />
                </div>
                <div className="btnContainer">
                  <InteractFlashyButton
                    onClick={() => editpaymentmenthod(userCostomerId)}
                  >
                    Submit
                  </InteractFlashyButton>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="wrapper">
            <div className="innerWrapper">
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

                <div className="btnContainer">
                  <InteractFlashyButton onClick={handleSubmit}>
                    Submit
                  </InteractFlashyButton>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      <br />

      <Link to="/campaign" style={{ textDecoration: "none" }}>
        <InteractFlashyButton>Manage Discord account</InteractFlashyButton>
      </Link>
      <br />
      <br /><br /><br/>
      <Card sx={{ maxWidth: 1000 }}>
        <CardHeader
          action={
            <Button
              onClick={handleOpen}
              color="success"
              style={{
                margin: 10,
                padding: "10px 20px",
                // fontWeight:'bold',
              }}
              variant="outlined"
            >
              Add a new billing method
            </Button>
          }
          open
          title="Manage your saved payment (billing) methods"
          subheader="Add, update, or remove your billing address"
        />
        <hr />

        <CardHeader
          title="Primary"
          subheader="Your primary billing method is used for recurring payments"
        />

        <hr />
        {}

        {defaultPaymentMethod.length > 0 ? (
          defaultPaymentMethod.map((item, index) => {
            return (
              <>
                <CardContent
                  style={{
                    borderBottom: "1px solid black",
                    paddingBottom: "50px",
                  }}
                >
                  <div style={{ display: "flex", clear: "both" }}>
                    <img
                      style={{ width: "50px", height: "50px" }}
                      alt="profile-pic"
                      src={logo}
                    />
                    <div style={{ marginLeft: "10px" }}>
                      <Typography gutterBottom variant="h3" component="div">
                        {item.card.brand} ending in {item.card.last4}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        You need a primary billing method when you have active
                        contract or a balance due. To remove this one, set a new
                        primary billing method first.
                      </Typography>
                    </div>
                    <Typography
                      gutterBottom
                      variant="h3"
                      component="div"
                      style={{ marginLeft: "100px" }}
                    >
                      {item.card.country}
                    </Typography>
                  </div>
                  <div
                    style={{ display: "flex", float: "right", clear: "both" }}
                  >
                    <div
                      style={{ color: "green", cursor: "pointer" }}
                      onClick={() => handleOpen1(item.id)}
                    >
                      <span
                        style={{
                          padding: "0px 20px",
                          borderRight: "1px solid lightgray",
                          fontSize: "18px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </span>
                    </div>
                  </div>
                </CardContent>
              </>
            );
          })
        ) : (
          <>
            <CardContent>
              <Typography variant="h5" component="h2" color={"#D3D3D3"}>
                No primary method
              </Typography>
            </CardContent>
          </>
        )}

        <CardHeader
          title="Additional"
        />
        <hr />

        {paymentMethods.length > 0 ? (
          paymentMethods.map((item, index) => {
            if (defaultPaymentMethod.length > 0) {
              if (defaultPaymentMethod[0].id !== item.id) {
                return (
                  <>
                    <CardContent
                      style={{
                        borderBottom: "1px solid black",
                        paddingBottom: "50px",
                      }}
                    >
                      <div style={{ display: "flex", clear: "both" }}>
                        <img
                          style={{ width: "50px", height: "50px" }}
                          alt="profile-pic"
                          src={logo}
                        />
                        <div style={{ marginLeft: "10px" }}>
                          <Typography gutterBottom variant="h3" component="div">
                            {item.card.brand} ending in {item.card.last4}
                          </Typography>
                        </div>
                        <Typography
                          gutterBottom
                          variant="h3"
                          component="div"
                          style={{ marginLeft: "100px" }}
                        >
                          {item.card.country}
                        </Typography>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          float: "right",
                          clear: "both",
                        }}
                      >
                        <div
                          style={{ color: "green", cursor: "pointer" }}
                          onClick={() => handleOpen1(item.id)}
                        >
                          <span
                            style={{
                              padding: "0px 20px",
                              borderRight: "1px solid lightgray",
                              fontSize: "18px",
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </span>
                        </div>
                        <div
                          style={{ color: "green", cursor: "pointer" }}
                          onClick={() => setdefault(item.id, item.customer)}
                        >
                          <span
                            style={{
                              padding: "0px 20px",
                              borderRight: "1px solid lightgray",
                              fontSize: "18px",
                              cursor: "pointer",
                            }}
                          >
                            Set as primary{" "}
                          </span>
                        </div>
                        <div
                          style={{ color: "red", cursor: "pointer" }}
                          onClick={() =>
                            deletepaymentMethod(item.id, item.customer)
                          }
                        >
                          <span
                            style={{
                              padding: "0px 20px",
                              borderRight: "1px solid lightgray",
                              fontSize: "18px",
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </>
                );
              }
            } else {
              return (
                <>
                  <CardContent
                    style={{
                      borderBottom: "1px solid black",
                      paddingBottom: "50px",
                    }}
                  >
                    <div style={{ display: "flex", clear: "both" }}>
                      <img
                        style={{ width: "50px", height: "50px" }}
                        alt="profile-pic"
                        src={logo}
                      />
                      <div style={{ marginLeft: "10px" }}>
                        <Typography gutterBottom variant="h3" component="div">
                          {item.card.brand} ending in {item.card.last4}
                        </Typography>
                      </div>
                      <Typography
                        gutterBottom
                        variant="h3"
                        component="div"
                        style={{ marginLeft: "100px" }}
                      >
                        {item.card.country}
                      </Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        float: "right",
                        clear: "both",
                      }}
                    >
                      <div
                        style={{ color: "green", cursor: "pointer" }}
                        onClick={() => handleOpen1(item.id)}
                      >
                        <span
                          style={{
                            padding: "0px 20px",
                            borderRight: "1px solid lightgray",
                            fontSize: "18px",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </span>
                      </div>
                      <div
                        style={{ color: "green", cursor: "pointer" }}
                        onClick={() => setdefault(item.id, item.customer)}
                      >
                        <span
                          style={{
                            padding: "0px 20px",
                            borderRight: "1px solid lightgray",
                            fontSize: "18px",
                            cursor: "pointer",
                          }}
                        >
                          Set as primary{" "}
                        </span>
                      </div>
                      <div
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() =>
                          deletepaymentMethod(item.id, item.customer)
                        }
                      >
                        <span
                          style={{
                            padding: "0px 20px",
                            borderRight: "1px solid lightgray",
                            fontSize: "18px",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </>
              );
            }
          })
        ) : (
          <>
            <CardContent>
              <Typography variant="h5" component="h2" color={"#D3D3D3"}>
                No additional method
              </Typography>
            </CardContent>
          </>
        )}
      </Card>
      <br/><br/><br/>
      <Typography variant="h2" gutterBottom>
        Change password
      </Typography>
      <div className="TextInputWrapper">
        <TextField
          id="outlined-basic"
          label="Old Password"
          variant="outlined"
          type="password"
          value={oldpassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>

      <div className="TextInputWrapper">
        <TextField
          id="outlined-basic"
          label="New password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="TextInputWrapper">
        <TextField
          id="outlined-basic"
          label="Retype your password"
          variant="outlined"
          type="password"
          value={passwordAgain}
          onChange={(e) => setPasswordAgain(e.target.value)}
        />
      </div>

      <PasswordChecklist
        rules={["minLength", "number", "match"]}
        minLength={5}
        value={password}
        valueAgain={passwordAgain}
        onChange={(isValid) => {}}
      />
      <br />
      <div className="ButtonsWrapper">
        <InteractFlashyButton onClick={updatePassword}>
          Change password
        </InteractFlashyButton>

        {/* <Button
          style={{
            margin: 10,
            color: "white",
            backgroundColor: "purple",
            padding: "10px 20px",
            // fontWeight:'bold',
          }}
          color="info"
          onClick={updatePassword}
        >
          Change Password
        </Button> */}
      </div>
      <br />
      {/*
      <Typography variant="h2" gutterBottom>
        Change Email
      </Typography>
      <div className="TextInputWrapper">
        <TextField
          id="outlined-basic"
          label="Enter email address"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="ButtonsWrapper">
        <InteractFlashyButton onClick={updateemailofloginusre}>
          Change Email
        </InteractFlashyButton>
      </div>
      */}
      <br />

      
    </div>
  );
}

export default Settings;
