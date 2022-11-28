import { TextField, Button, Stack } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import Tabs from "@mui/material/Tabs";
import { Box, Slide } from "@mui/material";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./UserProfilePage.css";
import Scheduler from "../../Components/Scheduler/Scheduler";
import FollowedCampaigns from "./FollowedCampaigns";
import CreatorSchedules from "./CreatorSchedule";
import Setting from "./Settings";
import FollowerList from "./FollowerList";
import { db, storage as Storage } from "@jumbo/services/auth/firebase/firebase";
import { setDoc, doc, query, onSnapshot, getDocs, where, collection } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { FollowButton } from "../CampaignPage/Stats";
import { fetchUserByName, updateUserPhotoURL, updateUserDescription } from "../../../firebase";
import useCurrentUser from "@interact/Hooks/use-current-user";
import EditIcon from "@mui/icons-material/Edit";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import { StyledTab } from "@interact/Pages/CreateCampaignPage/CampaignCreationTabs";
import Typography from "@mui/material/Typography";
import CropProfilePicture from "./CropProfilePicture"
import EditProfileDescription from "./EditProfileDescription";
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

function UserProfilePage() {
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useCurrentUser();
  const isCreator = user?.name === params.username ? true : false;
  const [description, setDescription] = useState("Welcome to my profile page");
  const [tab, setTab] = React.useState(0);
  const [modalOpened, setModalOpened] = useState(false);
  const [targetUser, setTargetUser] = useState({});
  const fileRef = useRef();
  const [image, setImage] = React.useState("https://iili.io/HH6JxB1.md.jpg");
  const [medal, setMedal] = React.useState(null);
  const Swal = useSwalWrapper();
  const [cropModalOpen, setCropModalOpen] = React.useState(false);
  const [editDescriptionModalOpen, setEditDescriptionModalOpen] = React.useState(false);
  const [croppingImg, setCroppingImg] = React.useState({});

  const updatePhotoURL = async (url) => {
    updateUserPhotoURL(user.id, url);
  };

  const updateDescription = async (description) => {
    updateUserDescription(user.id, description);
    setDescription(description);
  };

  const getTargetUser = async () => {
    let defaultUser = await fetchUserByName(params.username);
    console.log("defaultUser", defaultUser);
    setTargetUser(defaultUser);
    const userListener = onSnapshot(
      query(doc(db, "users", defaultUser.id)),
      (querySnapshot) => {
        let userData = querySnapshot.data();
        const id = querySnapshot.id;
        setTargetUser({ ...userData, id });
        setImage(userData?.photoURL ? userData?.photoURL : "https://iili.io/HH6JxB1.md.jpg");
        if (userData?.description?.length > 0) {
          setDescription(userData.description);
        }else {
          setDescription("Welcome to my profile page");
        }
      }
    );
  };

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleChangeImage = async (e) => {
    const file = e.target.files[0];
    const filesize = Math.round(file.size / 1024);
    if (filesize >= 7168) {
      Swal.fire("Too Large!", "Max 7mb file size is allowed.", "error");
      return;
    }
    if (file) {
      var reader = new FileReader();
      reader.onload = function () {
        var dataURL = reader.result;
        setCroppingImg({ url: dataURL, name: file.name });
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getMedalStatus = async() => {
    const grossRevenue = user.grossRevenue;

    if (grossRevenue === undefined) {
      setMedal(null);
    }
    else if (grossRevenue <= 1000) {
      setMedal('/images/pages/profile/bronzeCreatorRank.png');
    }
    else if (grossRevenue <= 10000) {
      setMedal('/images/pages/profile/silverCreatorRank.png');
    }
    else if (grossRevenue <= 100000) {
      setMedal('/images/pages/profile/goldCreatorRank.png');
    }
    else if (grossRevenue <= 1000000) {
      setMedal('/images/pages/profile/platinumCreatorRank.png');
    }
    else {
      setMedal('/images/pages/profile/diamondCreatorRank.png');
    }
  }

  useEffect(() => {
    if (!user) return;
    if (!params.username) {
      navigate(user.name ? `/u/${user.name}` : "/");
    }

    getMedalStatus();
  }, [user]);

	useEffect(() => {
		if(params.username) getTargetUser();
	}, [params]);


    return (
      <Slide direction="down" timeout={1969} in={true} mountOnEnter unmountOnExit>
      <div>
        <FollowerList
          open={modalOpened}
          setOpen={setModalOpened}
          followers={targetUser?.followers}
        />
        <CropProfilePicture
          cropModalOpen={cropModalOpen}
          setCropModalOpen={setCropModalOpen}
          imgageObj={croppingImg}
          updatePhotoURL={updatePhotoURL}
          setImage={setImage}
        />
        <EditProfileDescription
          editModalOpen={editDescriptionModalOpen}
          setEditModalOpen={setEditDescriptionModalOpen}
          description={description}
          updateDescription={updateDescription}
        />
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundImage:
              "linear-gradient(to bottom right, #4b26a3, #d442f5)",
            width: "100%",
            py: 3.69,
            borderRadius: 2,
          }}
        >
          <div className="image_item">
            {user?.name === params.username && (
              <form className="image_item-form">
                <label className="image_item-form--label">Replace photo</label>
                <input
                  className="image-item-form-input"
                  type="file"
                  accept="image/*"
                  id="image-item-form--input-id"
                  onClick={(e) => e.target.value = null}
                  onChange={(e) => handleChangeImage(e)}
                  ref={fileRef}
                ></input>
              </form>
            )}
            <img className="profilePic" alt="profile-pic" src={image} />
          </div>
          <div style={{display: "flex", alignItems: "center", flexDirection: "row", position: "relative", marginTop: "10px"}}>
            <div
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {targetUser?.name}
            </div>
            <img
              alt=""
              style={{
                width: "40px",
                transform: "translateX(30px)",
                position: "absolute",
                right: "-30px"
              }}
              src={medal}
            />
          </div>
          <Box className="profile-desc--wrapper">
            <Typography
              sx={{
                mt: 1.69,
                mb: 1.69,
                fontSize: "14px",
                textAlign: "center",
                color: "#FFFFFF",
                lineHeight: "20px",
                marginLeft: "2rem",
                paddingRight: "2rem",
                maxWidth: "323.21px",
              }}
            >
              {description}
            </Typography>
            {user?.name === params.username && (
              <EditIcon
                className="profile-desc--edit"
                onClick={(e) => setEditDescriptionModalOpen(true)}
              />
            )}
          </Box>
          <div
            style={{
              display: "flex",
              boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
              marginTop: 10,
              padding: 10,
              marginBottom: 5,
              paddingLeft: 20,
              paddingRight: 20,
              borderRadius: "6.21px 11px 6.21px 11px",
              alignItems: "center",
              backgroundColor: "white",
            }}
          >
            <div
              onClick={() => setModalOpened(true)}
              style={{
                fontSize: 20,
                color: "#782fee",
                marginRight: 20,
                fontWeight: "600",
                cursor: "pointer",
                borderRadius: 2,
              }}
            >
              {targetUser && targetUser?.followers
                ? targetUser?.followers.length
                : 0}{" "}
              followers
            </div>
            <FollowButton user={user} targetUser={targetUser} />
          </div>
        </Stack>

        <Box sx={{ width: "100%" }}>
          <div className="InfoContainer">
            <Box
              sx={{
                mt: 0.42,
                borderTop: 0,
                borderBottom: 0,
                borderColor: "divider",
              }}
            >
              <Tabs
                value={tab}
                onChange={handleChange}
                aria-label="basic tabs example"
                textColor="primary"
                size="50"
                centered
              >
                <StyledTab label="Campaigns" {...a11yProps(0)} />
                {user && (
                  <StyledTab label="Availability" {...a11yProps(1)} />
                )}
                {user && (
                  <StyledTab label="Creator availability" {...a11yProps(2)} />
                )}
                {user && <StyledTab label="Settings" {...a11yProps(3)} />}
              </Tabs>
            </Box>
          </div>

          <TabPanel value={tab} index={0}>
            <FollowedCampaigns />
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Scheduler />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            {isCreator ? <CreatorSchedules /> : null}
          </TabPanel>

          <TabPanel value={tab} index={3}>
            <Setting />
          </TabPanel>
        </Box>
      </div>
    </Slide>
  );
}

export default UserProfilePage;
