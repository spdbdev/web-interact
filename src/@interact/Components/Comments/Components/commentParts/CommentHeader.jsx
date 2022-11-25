import { useState, useEffect } from "react";
import { commentPostedTime, getDateFromTimestamp } from "@interact/Components/utils";
import CommentBtn from "./CommentBtn";
import { Tooltip, Typography  } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../../../../../firebase";
const CommentHeader = ({
  commentData,
  replying,
  setReplying,
  setBan,
  setDeleting,
  setEditing,
  isCampaignCreator,
  isCommentCreator
}) => {
  const createdAt = commentData.createdAt.seconds * 1000;
  let today = new Date();
  const [time, setTime] = useState(commentPostedTime(today.getTime() - createdAt));
  const date = getDateFromTimestamp({timestamp: commentData.createdAt.seconds,format:"MMMM D YYYY HH:mm A zz"}).toString();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  useEffect(async ()  =>{
    if(commentData?.userid){
      let userData = await fetchUser(commentData.userid);
      setUserData(userData);
    }
  },[commentData])

  useEffect(() => {
    const timeout = setInterval(() => {
      today = new Date();
      setTime(commentPostedTime(today.getTime() - createdAt));
    }, 60000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="comment--header">
      <img
        className="profile-pic"
        align="center"
        src={userData?.photoURL ? userData?.photoURL :  commentData.photoURL}
        alt="No Item"
        onClick={()=>navigate(`/u/${commentData.username}`)}
      />
      <div>
        <a className="username" href={`/u/${commentData.username}`}>{commentData.username}</a>
        <Tooltip title={date} disableInteractive arrow>
          <div className="comment-posted-time">{`${time}`}</div>
        </Tooltip>
      </div>
      {commentData.isCampaignCreator ? <div className="creator-tag">Creator</div> : ""}
      <CommentBtn
        commentData={commentData}
        replying={replying}
        setReplying={setReplying}
        setBan={setBan}
        setDeleting={setDeleting}
        setEditing={setEditing}
        isCampaignCreator={isCampaignCreator}
        isCommentCreator={isCommentCreator}
      />
    </div>
  );
};

export default CommentHeader;
