import { useState } from "react";
import { Button, TextField } from "@mui/material";
import "./Styles/AddComment.scss";

const AddComment = ({ buttonValue, addComments, replyingTo, user, isCampaignCreator }) => {
  const replyingToUser = replyingTo ? `@${replyingTo}, ` : "";
  const [comment, setComment] = useState(replyingToUser);

  const clickHandler = () => {
    if (comment === "" || comment === " ") return;

    const newComment = {
      id: new Date().getTime(),
      content: replyingToUser + comment.replace(replyingToUser, ""),
      createdAt: new Date(),
      username: user.name,
      photoURL: user?.photoURL,
      replyingTo: replyingTo ? replyingTo : "",
      userid: user.id,
      isCampaignCreator: isCampaignCreator,
      replies: [],
    };

    addComments(newComment);
    setComment("");
  };

  return (
    <div className="add-comment">
      <TextField
        placeholder={buttonValue === "Post" ? "Got questions?":""}
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
        }}
        sx={{
          "& .MuiInputBase-root": {
            borderRadius: "10px",
            width: '100%',
            maxHeight:'40px',
            padding:'0', 
          },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "#c5a5f8"
            }
          },
        }}
        fullWidth 
      >
      </TextField>
      
      <div className="send-btn-container">
        <Button
          sx={{
            ":hover": {
                background:
                "linear-gradient(180deg, #782FEE -8.69%, #DD00FF 109.93%)", // theme.palette.primary.main
                  color: "white",
              },
              background:
              "linear-gradient(90deg, #782FEE -8.69%, #DD00FF 109.93%)",
                borderColor: "primary.main",
                fontWeight: 500,
                fontSize: 15.21,
                textTransform: "none",
                borderRadius: "3px 11px",
                borderWidth: 1,
                px: 3,
                py: 0.69,
            }} 
            variant={"contained"}
            onClick={clickHandler}
            > {buttonValue}
          </Button> 
      </div>
    </div>
  );
};

export default AddComment;
