import { TextField, Button, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import "./UserProfilePage.css";
import FollowerList from "./FollowerList";
import { Link } from "react-router-dom";
import PasswordChecklist from "react-password-checklist";
import { auth, db, logout } from "@jumbo/services/auth/firebase/firebase";
import { query, collection, getDocs, where, addDoc } from "firebase/firestore";
import Typography from "@mui/material/Typography";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
} from "firebase/auth";

import Storage from "./firebasestorage";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import InteractButton from "@interact/Components/Button/InteractButton";
import { FollowButton } from "../CampaignPage/Stats";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Settings() {
  const [tab, setTab] = React.useState(0);

  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [oldpassword, setOldPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const isCreator = true;

  const [modalOpened, setModalOpened] = useState(false);

  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [image, setImage] = React.useState(
    "https://www.diethelmtravel.com/wp-content/uploads/2016/04/bill-gates-wealthiest-person.jpg"
  );
  const navigate = useNavigate();

  const updatePassword = async () => {
    // Get the value of the old password
    if (password === oldpassword) {
      const credential = EmailAuthProvider.credential(user?.email, oldpassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      await updatePassword(auth.currentUser, password);
    }
  };

  const updateemailofloginusre = async () => {
    await updateEmail(auth.currentUser, email);
  };

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);

      const data = doc.docs[0].data();
      setName(data.name);

      setEmail(data.email);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    console.log(auth.currentUser);
    fetchUserName();
  }, [user, loading]);

  localStorage.setItem("name", name);

  const handleChangeImage = async (e) => {
    const file = e.target.files[0];
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
        async () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            await addDoc(collection(db, "userspicture"), {
              uid: user?.uid,
              name: user.displayName,
              imageurl: url,
            });
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
  return (
    <div>
      <FollowerList open={modalOpened} setOpen={setModalOpened} />
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundColor: "primary.main",
          width: "100%",
          py: 4,
          borderRadius: 2,
        }}
      >
        <div className="image_item">
          <form className="image_item-form">
            <label className="image_item-form--lable"> Add Image</label>
            <input
              className="image-item-form-input"
              type="file"
              id="image-item-form--input-id"
              onChange={handleChangeImage}
            ></input>
          </form>

          {/* <input type="file" onChange={handleChangeImage} /> */}
          <img className="profilePic" alt="profile-pic" src={image} />
        </div>
        <div
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            paddingTop: 10,
          }}
        >
          {name}
        </div>
        <div style={{ marginTop: 10, color: "white", marginBottom: 10 }}>
          I love playing Smite and Minecraft
        </div>
        <div
          style={{
            display: "flex",
            boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
            marginTop: 10,
            padding: 10,
            marginBottom: 5,
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: "0 11px 0 11px",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          {/* <MeetingBlocks /> */}
          <div
            onClick={() => setModalOpened(true)}
            style={{
              fontSize: 20,
              color: "#782fee",
              marginRight: 20,
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: 2,
            }}
          >
            23k followers
          </div>
          <FollowButton />
        </div>
      </Stack>
      <br />
      <br />

      <Link to="/campaign">
        <Button variant={"contained"}>Manage Discord Account</Button>
      </Link>
      <br />
      <br />
      <Typography variant="h2" gutterBottom>
        Change Password
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
          onClick={updatePassword}
        >
          Change Password
        </Button>
      </div>

      <Typography variant="h2" gutterBottom>
        Change Email
      </Typography>
      <div className="TextInputWrapper">
        <TextField
          id="outlined-basic"
          label="Enter Email Address"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
          onClick={updateemailofloginusre}
        >
          Change Email
        </Button>
      </div>

      <br />
      <br />

      <Card sx={{ maxWidth: 1000 }}>
        <CardHeader
          action={
            <Button
              color="success"
              style={{
                margin: 10,
                padding: "10px 20px",
                // fontWeight:'bold',
              }}
              variant="outlined"
            >
              Add a New Billing Method
            </Button>
          }
          title="Manage Billing address"
          subheader="Add, update, or remove your billing address"
        />
        <hr />

        <CardHeader
          title="Primary"
          subheader="Your Primary billing method is used for recurring payments"
        />
        <hr />


        <CardHeader
          title="Additional"
          subheader="Your Primary billing method is used for recurring payments"
        />
        <hr />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Lizard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Share</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default Settings;
