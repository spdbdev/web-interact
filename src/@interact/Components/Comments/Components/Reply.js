import { useState } from "react";

import "./Styles/Comment.scss";

import AddComment from "./AddComment";
import { Button } from "@mui/material";
import CommentHeader from "./commentParts/CommentHeader";

const Reply = ({
  commentData,
  addNewReply,
  editComment,
  deleteComment,
  user,
  isCampaignCreator,
  isCommentCreator
}) => {
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(commentData.content);

  // adding reply
  const addReply = (newReply) => {
    addNewReply(newReply);
    setReplying(false);
  };

  const commentContent = () => {
    const text = commentData.content.trim().split(" ");
    const firstWord = text.shift().split(",");

    return !editing ? (
      <div className="comment-content">
        <span className="replyingTo">{firstWord}</span>
        {text.join(" ")}
      </div>
    ) : (
      <textarea
        className="content-edit-box"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
      />
    );
  };

  const updateComment = () => {
    editComment(content, commentData.id, "reply");
    setEditing(false);
  };

  // delete comment
  const deleteReply = () => {
    deleteComment(commentData.id, "reply");
  };

  return (
    <div
      className={`comment-container ${
        commentData.replies[0] !== undefined ? "gap" : ""
      }`}
    >
      <div className="comment">
        <div className="comment--body">
          <CommentHeader
            commentData={commentData}
            setReplying={setReplying}
            setDeleting={deleteReply}
            setEditing={setEditing}
            isCampaignCreator={isCampaignCreator}
            isCommentCreator={isCommentCreator}
          />

          {commentContent()}
          {editing && (
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
              onClick={updateComment}
              >
                Update
            </Button> 
          )}
        </div>
      </div>

      {replying && (
        <AddComment
          buttonValue={"Reply"}
          addComments={addReply}
          replyingTo={commentData.username}
          user={user}
          isCampaignCreator={isCampaignCreator}
        />
      )}
      {commentData.replies.map((reply) => (
        <Reply key={reply.id} commentData={reply} addReply={addReply} />
      ))}
    </div>
  );
};

export default Reply;
