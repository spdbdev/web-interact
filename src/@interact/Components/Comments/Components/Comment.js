import { useState } from "react";
import "./Styles/Comment.scss";
import AddComment from "./AddComment";
import ReplyContainer from "./ReplyContainer";
import { Button } from "@mui/material";
import CommentHeader from "./commentParts/CommentHeader";

const Comment = ({
  commentData,
  updateReplies,
  editComment,
  commentDelete,
  user,
  isCampaignCreator,
  isCommentCreator
}) => {
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(commentData.content);
  

  const addReply = (newReply) => {
    const replies = [...commentData.replies, newReply];
    updateReplies(replies, commentData.id);
    setReplying(false);
  };

  const updateComment = (text, id, type) => {
    const finalType = type !== undefined ? type : "comment";
    const finalId = id !== undefined ? id : commentData.id;
    const finalContent = type === "reply" ? text :   content;
    editComment(finalContent, finalId, finalType,commentData.id);
    setEditing(false);
  };

  const deleteComment = (id, type) => {
    const finalType = type !== undefined ? type : "comment";
    const finalId = id !== undefined ? id : commentData.id;
    commentDelete(finalId, finalType, commentData.id);
    
    
  };

  return (
    <div
      className={`comment-container ${
        commentData.replies[0] !== undefined ? "reply-container-gap" : ""
      }`}
    >
      <div className="comment">
        <div className="comment--body">
          <CommentHeader
            commentData={commentData}
            replying={replying}
            setReplying={setReplying}
            setDeleting={deleteComment}
            setEditing={setEditing}
            isCampaignCreator={isCampaignCreator}
            isCommentCreator={isCommentCreator}
          />
          {!editing ? (
            <div className="comment-content">{commentData.content}</div>
          ) : (
            <textarea
              className="content-edit-box"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          )}
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
      {commentData.replies !== [] && (
        <ReplyContainer
          key={commentData.replies.id}
          commentData={commentData.replies}
          addReply={addReply}
          editComment={updateComment}
          deleteComment={deleteComment}
          user={user}
          isCampaignCreator={isCampaignCreator}
          isCommentCreator={isCommentCreator}
        />
      )}
    </div>
  );
};

export default Comment;
