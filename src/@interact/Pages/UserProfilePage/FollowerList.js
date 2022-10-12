import "./UserProfilePage.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReactModal from "react-modal";
import InteractButton from "@interact/Components/Button/InteractButton";

export default function FollowerList({ open, setOpen }) {
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
          borderBottom: "1px solid #000",
        }}
      >
        <div style={{ fontSize: 20 }}>Followers</div>
        <div onClick={() => setOpen(false)} style={{ cursor: "pointer" }}>
          X
        </div>
      </div>
      <div style={{ overflowY: "scroll", height: "calc(100% - 30px)" }}>
        {[...Array(100).keys()].map((x, i) => (
          <FollowerListItem />
        ))}
      </div>
    </ReactModal>
  );
}

function FollowerListItem() {
  return (
    <div
      style={{
        display: "flex",
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: "center",
        borderBottom: "1px solid #aaa",
      }}
    >
      <img
        src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png"
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
          <div style={{ fontSize: 20 }}>Andrew Thompson</div>
          <div style={{ fontSize: 12, color: "#777" }}>
            Contributed $50 2 interactions total
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <InteractButton>Follow</InteractButton>
          <MoreVertIcon style={{ fontSize: 20 }} />
        </div>
      </div>
    </div>
  );
}

export { FollowerListItem };
