import { TextField, Button, Stack } from "@mui/material";
import React, { useEffect, useState,useRef } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";
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
import { db } from "@jumbo/services/auth/firebase/firebase";
import { query, collection, getDocs, where, addDoc } from "firebase/firestore";
import Storage from "./firebasestorage";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import { FollowButton } from "../CampaignPage/Stats";
import { fetchUserByName } from "../../../firebase";
import useCurrentUser from "@interact/Hooks/use-current-user";
import EditIcon from "@mui/icons-material/Edit";

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
    const [tab, setTab] = React.useState(0);
    const navigate = useNavigate();
    const params = useParams();
    const { user } = useCurrentUser();
    const isCreator = user?.name == params.username ? true : false;
    const [modalOpened, setModalOpened] = useState(false);
    const [targetUser, setTargetUser] = useState({});
    const fileRef = useRef();
    const [image, setImage] = React.useState(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSi7Mj2jDzj87i1emqmIAKigu5gzrIKsFfOua8gZbV-g&s"
    );

    const userProfile = async () => {
      let q = query(collection(db, "userspicture"), where("uid", "==", user?.uid));
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

    const handleFileClick = function(){
      fileRef.current.click();
    }

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

    useEffect(() => {
      if (!user) return;
      if (!params.username) {
        navigate(user.name ? `/u/${user.name}` : "/")
      }
      userProfile();
    }, [user]);

    useEffect(async ()  => {
      if(params.username) {
        try {
          setTargetUser(await fetchUserByName(params.username));
        }catch(e) {
          setTargetUser({});
        }
      }
    }, [params, targetUser])
    const handleChange = (event, newValue) => {
      setTab(newValue);
    };

    return (
      <div>
        <FollowerList open={modalOpened} setOpen={setModalOpened} followers={targetUser?.followers}/>
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
            <input type="file" accept="image/*" style={{display:"none"}} onChange={(e)=>handleChangeImage(e)} ref={fileRef}/>
            <EditIcon onClick={(e)=>handleFileClick(e)} style={{width:'1.3em',height:'1.3em'}} className="profile_pic--icon"/>
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
            {targetUser?.name}
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
              {targetUser && targetUser?.followers ? targetUser?.followers.length : 0} followers
            </div>
            <FollowButton user={user} targetUser={targetUser}/>
          </div>
        </Stack>

        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tab}
              onChange={handleChange}
              aria-label="basic tabs example"
              indicatorColor="secondary"
              centered
            >
              <Tab
                label="Campaigns"
                {...a11yProps(0)}
                style={{ color: "black" }}
              />
              <Tab
                label="Schedule"
                {...a11yProps(1)}
                style={{ color: "black" }}
              />
              <Tab
                label="Creator Schedule"
                {...a11yProps(2)}
                style={{ color: "black" }}
              />
              {user && (
                <Tab
                  label="Settings"
                  {...a11yProps(3)}
                  style={{ color: "black" }}
                />
              )}
            </Tabs>
          </Box>
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
    );
}

export default UserProfilePage;