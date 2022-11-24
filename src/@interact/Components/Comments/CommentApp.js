import "./Components/Styles/App.scss";
import Comment from "./Components/Comment";
import AddComment from "./Components/AddComment";
import { addCommentsToDB, addRepliesToDB,editCommentDB, commentDeleteDB } from "../../../firebase";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";

const CommentApp = ({comments, campaignId, user, isCampaignCreator}) => {
  const Swal = useSwalWrapper();

  // add comments
  const addComments = async (newComment) => {
    await addCommentsToDB(newComment, campaignId);
  };

  // add replies
  const updateReplies = async (replies, id) => {
    await addRepliesToDB(replies, campaignId, id);
  };

  // edit comment
  const editComment = async (content, id, type, parentComment) => {
    await editCommentDB(content, id, type, parentComment, campaignId);
  };

  // delete comment
  let commentDelete =  (id, type, parentComment) => {
    Swal.fire({
			title: "Delete this comment?",
			showCancelButton: true,
			confirmButtonText: "Yes, Delete!",
			cancelButtonText: "Cancel",
			reverseButtons: true,
		}).then(async (result) => {
			if (result.value) {
        try{
          await commentDeleteDB(id, type, campaignId, parentComment);
        }catch(e) {
          console.log(e);
        }
			}
		})
  };

  return (
    <main className="App">
      <AddComment buttonValue={"Post"} addComments={addComments} user={user} isCampaignCreator={isCampaignCreator}/>
      {comments && comments.map((comment) => (
        <Comment
          key={comment.id}
          commentData={comment}
          updateReplies={updateReplies}
          editComment={editComment}
          commentDelete={commentDelete}
          user={user}
          isCampaignCreator={isCampaignCreator}
          isCommentCreator={comment?.userid === user?.id ? true : false}
        />
      ))}
    </main>
  );
};

export default CommentApp;
