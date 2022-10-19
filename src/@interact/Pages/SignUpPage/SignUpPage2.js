import { TextField, Button, FormControlLabel, Checkbox } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, registerWithEmailAndPassword, signInWithGoogle } from "@jumbo/services/auth/firebase/firebase";
import PasswordChecklist from "react-password-checklist";

import fb_logo from "./facebook.png";
import gl_logo from "./google.png";

import "./SignUpPage.css";

// newer SignUpPage with birthday.
function SignUpPage2() {
  const [birdthday, setBirthday] = React.useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const register = () => {
    if (!name) alert("Please enter name");
    registerWithEmailAndPassword(name, email, password);
  };
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/user");
  }, [user, loading]);

  return (
    <div className="SignUpPage">
      {/* <div className='CredentialsBox'> */}

      <div className="CredentialBox">
        <img
          src={process.env.PUBLIC_URL + "/logo.png"}
          alt="logo"
          style={{ height: 100, padding: 20 }}
        />
        {/* need to set google sign in in the firebase console, rn its only email/password*/}
        <Button className="SignUpWithGoogle" onClick={signInWithGoogle}>
          <img src={gl_logo} style={{ height: "100%", paddingRight: 10 }} />{" "}
          <div>Sign Up with Google</div>
        </Button>
        {/* <br /> */}
        <Button
          className="SignUpWithGoogle"
          style={{
            backgroundColor: "#1778F2",
            color: "white",
            display: "flex",
          }}
        >
          <img src={fb_logo} style={{ height: "100%", paddingRight: 10 }} />{" "}
          <div>Sign Up with Facebook</div>
        </Button>
        <br />
        or
        <br />
        <div className="TextInputWrapper">
          <TextField
            id="outlined-basic"
            label="Create a Username"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="TextInputWrapper">
          <TextField
            id="outlined-basic"
            label="Enter Email Address"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="TextInputWrapper">
          <TextField
            id="outlined-basic"
            label="Create a password"
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
        <div className="TextInputWrapper">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Birthday"
              value={birdthday}
              onChange={(newValue) => {
                setBirthday(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
        {/* <FormControlLabel control={<Checkbox />} label={"I agree to all " + <a href='https://eforms.com/release/media/'>terms and services</a>} /> */}
        <div
          style={{
            display: "flex",
            justifContent: "center",
            alignItems: "center",
          }}
        >
          <Checkbox />{" "}
          <span>
            I agree to all{" "}
            <a href="https://eforms.com/release/media/">terms and services</a>
          </span>
        </div>
        <div className="ButtonsWrapper">
          <Button
            style={{
              margin: 10,
              color: "white",
              backgroundColor: "purple",
              padding: "10px 20px",
              // fontWeight:'bold',
            }}
            color="info"
            onClick={register}
          >
            Create Account
          </Button>
        </div>
        <div style={{ paddingTop: 20 }}>
          Already have an account? <Link to="/">Log in</Link>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}

export default SignUpPage2;
