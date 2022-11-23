import Reply from "./Reply";

const ReplyContainer = ({
  commentData,
  addReply,
  editComment,
  deleteComment,
  user,
  isCampaignCreator,
  isCommentCreator
}) => {
  return (
    <div className="reply-container">
      {commentData.map((data) => (
        <Reply
          key={data.id}
          commentData={data}
          addNewReply={addReply}
          editComment={editComment}
          deleteComment={deleteComment}
          user={user}
          isCampaignCreator={isCampaignCreator}
          isCommentCreator={isCommentCreator}
        />
      ))}
    </div>
  );
};

export default ReplyContainer;
