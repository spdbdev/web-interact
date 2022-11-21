import { TextField, Button, Stack } from "@mui/material";
import React, { useEffect, useState,useRef } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box , Slide} from "@mui/material";
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
import { setDoc, doc,query, onSnapshot } from "firebase/firestore";
import Storage from "./firebasestorage";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import { FollowButton } from "../CampaignPage/Stats";
import { fetchUserByName } from "../../../firebase";
import useCurrentUser from "@interact/Hooks/use-current-user";
import EditIcon from "@mui/icons-material/Edit";
import Swal from 'sweetalert2';
import { StyledTab } from "@interact/Pages/CreateCampaignPage/CampaignCreationTabs";
import Typography from "@mui/material/Typography";

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
    const isCreator = user?.name == params.username ? true : false;

    const [tab, setTab] = React.useState(0);
    const [modalOpened, setModalOpened] = useState(false);
    const [targetUser, setTargetUser] = useState({});
    const fileRef = useRef();
    const [image, setImage] = React.useState("https://iili.io/HH6JxB1.md.jpg");


    const updatePhotoURL = async (url) => {
      setDoc(doc(db, "users", user.id), {photoURL:url}, {merge:true});
    };

    const getTargetUser = async () => {
      let defaultUser = await fetchUserByName(params.username);
      setTargetUser(defaultUser);
      const userListener = onSnapshot(query(doc(db, "users",defaultUser.id)), (querySnapshot) => {
        let userData = querySnapshot.data();
        const id = querySnapshot.id;
        setTargetUser({ ...userData, id });
      });
    };

    const handleFileClick = function(){
      fileRef.current.click();
    }

    const handleChange = (event, newValue) => {
      setTab(newValue);
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
              updatePhotoURL(url);
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
      setImage(user.photoURL);
    }, [user]);

    useEffect(()  => {
      if(params.username) getTargetUser();
    }, [params]);

    return (
      <Slide direction="down" timeout={1621} in={true} mountOnEnter unmountOnExit>
      <div>
        <FollowerList open={modalOpened} setOpen={setModalOpened} followers={targetUser?.followers}/>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundImage: "linear-gradient(to bottom right, #4b26a3, #d442f5)",
            width: "100%",
            py: 3.69,
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

          <Typography
            sx={{
              mt: 1.69,
              mb: 1.69,
              fontSize: "14px",
              textAlign: "center",
              color: '#FFFFFF',
              lineHeight: '20px',
              maxWidth: '291.21px',
            }}
          >
            Manage your interactions, campaigns, availability, and settings on this page.
          </Typography>
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
              {targetUser && targetUser?.followers ? targetUser?.followers.length : 0} followers
            </div>
            <FollowButton user={user} targetUser={targetUser}/>
          </div>
        </Stack>
        
        <Box sx={{ width: "100%" }}>
          <div className="InfoContainer">
            <Box sx={{ mt:0.42, borderTop: 0, borderBottom: 0, borderColor: "divider"}}>
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
                <StyledTab label="Fan availability"
                {...a11yProps(1)}/>
              )}
              {user && (
                <StyledTab label="Creator availability"
                {...a11yProps(2)}/>
              )}
              {user && (
                <StyledTab label="Settings"
                {...a11yProps(3)}/>
              )}
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