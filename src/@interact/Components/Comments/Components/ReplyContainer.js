import Reply from "./Reply";

const ReplyContainer = ({
  commentData,
  addReply,
  editComment,
  deleteComment,
  setBan,
  user,
  isCampaignCreator,
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
          setBan={setBan}
          user={user}
          isCampaignCreator={isCampaignCreator}
          isCommentCreator={user?.id === data?.userid ? true : false}
        />
      ))}
    </div>
  );
};

export default ReplyContainer;
