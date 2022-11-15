import { TextField, Button, FormControlLabel, Checkbox,Alert, Icon } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';

import EditIcon from "@mui/icons-material/Edit";

import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, registerWithEmailAndPassword, signInWithGoogle } from "@jumbo/services/auth/firebase/firebase";
import PasswordChecklist from "react-password-checklist";

import fb_logo from "./facebook.png";
import gl_logo from "./google.png";

import profile_1 from "./interact-heart-baby-blue.png";
import profile_2 from "./interact-heart-light-orange.png";
import profile_3 from "./interact-heart-light-pink.png";
import profile_4 from "./interact-heart-light-violet.png";
import profile_5 from "./interact-heart-purple-original.png";
import profile_6 from "./interact-heart-red.png";
import profile_7 from "./interact-heart-yellow.png";

import { Storage } from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import "./SignUpPage.css";
import InteractButton from "@interact/Components/Button/InteractButton";
import { useRef } from "react";

// newer SignUpPage with birthday.
function SignUpPage2() {
  const [birdthday, setBirthday] = React.useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [isPassValid,setIsPassValid] = useState(false);
  const [name, setName] = useState("");
  const [nameError,setNameError] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [imageUrl,setImageUrl] = useState(null);
  const [image,setImage] = useState(null);
  const navigate = useNavigate();

  const fileRef = useRef();

  const profile_images = [profile_1,profile_2,profile_3,profile_4,profile_5,profile_6,profile_7];
  const handleFileClick = function(){
    fileRef.current.click();
  }

  const validateUserName = function(){
    if(name.length > 14){
      setNameError("Username cannot be longer than 15.");
      return false;
    }else if(/\s/.test(name)){
      setNameError("Whitespaces are not allowed in username");
      return false;
    }else if(JSON.stringify(name).includes('\\')){
      setNameError("Username cannot contain '\\' character.")
      return false
    }
    return true;
  }

  const register = () => {
    if (!validateUserName()) return;
    if (!isPassValid) {
      Swal.fire(
        "Incorrect!",
        "Password is not valid",
        "error"
        );
      return;
    }
    if(registerWithEmailAndPassword(name, email, password,imageUrl)) navigate(`/u/${name}`);
  };

  const handleChangeImage = async (e) => {
    const file = e.target.files[0];
    const filesize = Math.round((file.size / 1024));
    if(filesize >= 7168){
      Swal.fire(
        "Too Large!",
        "Max 7mb file size is allowed.",
        "error"
        );
      return;
    }
    if (file) {
      const storageRef = ref(Storage, `/user_profile_pictures/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            setImageUrl(url);
          });
        }
      );

      var reader = new FileReader();
      reader.onload = function () {
        var dataURL = reader.result;
        setImage(dataURL);
      };
      reader.readAsDataURL(file);
    }
  };

  const setRandomImage = function(){
    setImage(profile_images[Math.floor(Math.random() * profile_images.length)]);
    setImageUrl(profile_images[Math.floor(Math.random() * profile_images.length)]);
  }

  useEffect(() => {
    setRandomImage();
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
          style={{ height: 120, padding: 20 }}
        />
        <div className="profile_pic" style={{position: "relative",margin:"1rem"}}>
          <img
            src={image}
            alt="profile image"
            style={{height: 100, padding: 10,borderRadius:"50%"}}
          />
          <input type="file" accept="image/*" onChange={(e)=>handleChangeImage(e)} ref={fileRef}/>
          <EditIcon onClick={(e)=>handleFileClick(e)} className="profile_pic--icon"/>
        </div>
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
        <div style={{width:"80%",padding:"10px"}}>
          <Alert severity="warning">Warning: username cannot be changed in the future</Alert>
        </div>
        <div className="TextInputWrapper">
          <TextField
            error={nameError.length > 0}
            id="outlined-basic"
            label="Legal name"
            variant="outlined"
            value={name}
            helperText={nameError}
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
          minLength={6}
          value={password}
          valueAgain={passwordAgain}
          onChange={(isValid) => {
            setIsPassValid(isValid);
          }}
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
            I agree to the <Link to="/a/termsandconditions">terms & conditions</Link>, <Link to="/a/privacypolicy">privacy policy</Link>, and I declare that I am over 13 years old{" "}
          </span>
        </div>
        <div className="ButtonsWrapper" style={{margin:10}}>
          <InteractButton
          onClick={register}>Create Account</InteractButton>
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
