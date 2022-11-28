import "./UserProfilePage.css";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import CloseIcon from '@mui/icons-material/Close';
import useCurrentUser from "@interact/Hooks/use-current-user";
import { FollowButton } from "../CampaignPage/Stats";
import { fetchUsersByIds } from "../../../firebase";
import { BanButton } from "../BanButton";
export default function FollowerList({ open, setOpen, followers = [] }) {
  // console.log("profilefollowers",followers);
  const [followerlist, setFollowerList] = useState([]);
  useEffect(async ()  => {
    if(followers.length > 0) {
      setFollowerList(await fetchUsersByIds(followers));
    }else {
      setFollowerList([]);
    }
  }, [open])
  return (
    <ReactModal
      className="modal"
      isOpen={open}
      contentLabel="Minimal Modal Example"
      style={{ width: 100 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "3.69px dotted #982fee",
        }}
      >
        <div style={{ fontSize: 23.69, color: "#982fee"}}>Followers</div>
        <CloseIcon onClick={() => setOpen(false)} style={{ cursor: "pointer" }}>
        </CloseIcon>
      </div>
      <div style={{ overflowY: "scroll", height: "calc(100% - 30px)" }}>
        {followerlist.map((x, i) => (
          <FollowerListItem key={i} data={x} />
        ))}
      </div>
    </ReactModal>
  );
}

function FollowerListItem(data) {
  const { user } = useCurrentUser();
  const defaultPhotoURL = "https://iili.io/HH6JxB1.md.jpg";
  return (
    <div
      style={{
        display: "flex",
        paddingTop: 6.9,
        paddingBottom: 6.9,
        alignItems: "center",
      }}
    >
      <img
        src={data?.data?.photoURL ? data?.data?.photoURL : defaultPhotoURL}
        style={{
          objectFit: "cover",
          width: 50,
          height: 50,
          borderRadius: 1000,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div style={{ marginLeft: 20 }}>
          <div style={{ fontSize: 20 }}>{data?.data?.name}</div>
          <div style={{ fontSize: 12, color: "#777" }}>
            {data?.data?.contributions ? `Contributed $${data.data.contributions} total` : ''}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {
            user ? (
              <>
                <FollowButton user={user} targetUser={data.data} sx={{width:'50%'}}/>
                <BanButton user={user} targetUser={data.data} sx={{width:'50%', marginLeft:"10px", marginRight:'10px'}}/>
              </>
              ) : <></>
          }
        </div>
      </div>
    </div>
  );
}

export { FollowerListItem };
