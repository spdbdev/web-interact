import { useState, useEffect, useRef } from "react";
import { commentPostedTime, getDateFromTimestamp } from "@interact/Components/utils";
import CommentBtn from "./CommentBtn";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CommentHeader = ({
  commentData,
  replying,
  setReplying,
  setDeleting,
  setEditing,
  isCampaignCreator,
  isCommentCreator
}) => {
  const createdAt = commentData.createdAt.seconds * 1000;
  let today = new Date();
  const [time, setTime] = useState(commentPostedTime(today.getTime() - createdAt));
  const date = useState(getDateFromTimestamp({timestamp: commentData.createdAt.seconds,format:"MMMM D YYYY HH:mm A zz"}));
  const navigate = useNavigate();

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
        src={commentData?.photoURL ? commentData?.photoURL :  "https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png"}
        alt="No Item"
        onClick={()=>navigate(`/u/${commentData.username}`)}
      />
      <div>
        <a className="username" href={`/u/${commentData.username}`}>{commentData.username}</a>
        {commentData.isCampaignCreator ? <div className="creator-tag">Creator</div> : ""}
        <Tooltip title={date} disableInteractive arrow>
          <div className="comment-posted-time">{`${time}`}</div>
        </Tooltip>
      </div>
      <CommentBtn
        commentData={commentData}
        replying={replying}
        setReplying={setReplying}
        setDeleting={setDeleting}
        setEditing={setEditing}
        isCampaignCreator={isCampaignCreator}
        isCommentCreator={isCommentCreator}
      />
    </div>
  );
};

export default CommentHeader;
