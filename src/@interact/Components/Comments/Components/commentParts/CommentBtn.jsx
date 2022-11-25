import { ReactComponent as IconReply } from "../../Assets/images/icon-reply.svg";
import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const CommentBtn = ({
  commentData,
  replying,
  setReplying,
  setBan,
  setDeleting,
  setEditing,
  isCampaignCreator,
  isCommentCreator
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const showAddComment = () => {
    handleClose();
    setReplying(!replying);
  };

  // delete comment
  const handleDeleteAction = () => {
    handleClose();
    setDeleting(commentData.id);
  };

  // edit comment
  const showEditComment = () => {
    handleClose();
    setEditing(true);
  };

  // ban 
  const handleBanAction = () => {
    handleClose();
    setBan(commentData.userid);
  };
  return (
    <div className="comment--btn">
      <button
        className="reply-btn"
        onClick={showAddComment}
      >
        <IconReply />
      </button>
      
      {
        isCommentCreator || isCampaignCreator ? (
        <>
          <MoreVertIcon
            id="comment_threedot_button"
            aria-controls={open ? "comment_threedot_menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{
              color: "black",
              width: "20px",
              height: "20px",
            }}
          >
          </MoreVertIcon>
          <Menu
            id="comment_threedot_menu"
            aria-labelledby="comment_threedot_button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
          >
            <MenuItem key={`${commentData.id}Edit`} onClick={showEditComment}>Edit</MenuItem>
            <MenuItem key={`${commentData.id}Delete`} onClick={handleDeleteAction}>Delete</MenuItem>
            {
              isCampaignCreator ?  <MenuItem key={`${commentData.id}Ban`} onClick={handleBanAction}>Ban</MenuItem> : []
            }
          </Menu>
        </>
        ) : <></>
      }
      
    </div>
  );
};

export default CommentBtn;
