import { useEffect, useRef, useState } from "react";
import { SingleCommentProps } from "./types";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";

const Comment = ({ comment, setComments }: SingleCommentProps) => {
  const [showMoreComment, setShowMoreComment] = useState<boolean>(false);
  const [isCommentOverflowing, setIsCommentOverflowing] =
    useState<boolean>(false);
  const commentRef = useRef<HTMLDivElement>(null);

  const handleShowMoreCommentState = () => setShowMoreComment(!showMoreComment);

  useEffect(() => {
    if (commentRef.current) {
      setIsCommentOverflowing(commentRef.current.scrollHeight > 60);
    }
  }, []);

  const deleteComment = async () => {
    try {
      const commentRef = doc(
        db,
        `posts/${comment.postAuthorId}/userPosts/${comment.postId}/comments/${comment.commentId}`
      );
      await deleteDoc(commentRef);
      console.log("Comment deleted successfully");
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      setComments((prevComments) =>
        (prevComments ?? []).filter(
          (prevComment) => prevComment.commentId !== comment.commentId
        )
      );
    }
  };

  return (
    <div className="w-full bg-bgColorSecondary px-4 py-2 rounded-lg my-2">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-user rounded-full text-xs">
            {/* <img src="" alt="" /> */}
          </i>
          <p className="text-sm font-semibold text-primary">
            {comment.commentatorName}
          </p>
        </div>
        {(auth.currentUser?.uid === comment.commentatorId ||
          auth.currentUser?.uid === comment.postAuthorId) && (
          <div className="flex justify-center items-center gap-4">
            {auth.currentUser?.uid === comment.commentatorId && (
              <i
                onClick={() => console.log(`update comment`)}
                className="fa-solid fa-pen text-xs text-green-600 cursor-pointer
          hover:opacity-70 transition-opacity duration-300"
              ></i>
            )}
            <i
              onClick={deleteComment}
              className="fa-solid fa-trash-can text-xs text-red-600 cursor-pointer 
          hover:opacity-70 transition-opacity duration-300"
            ></i>
          </div>
        )}
      </div>
      <div
        ref={commentRef}
        className={`overflow-hidden transition-max-height duration-500 ease-in-out 
                ${
                  showMoreComment
                    ? "max-h-[300px] overflow-y-scroll"
                    : "max-h-[3rem]"
                }`}
      >
        {comment.commentText}
        <p className="text-[0.6rem] text-gray-400">{comment.date}</p>
      </div>
      {isCommentOverflowing && (
        <div
          onClick={handleShowMoreCommentState}
          className="text-end cursor-pointer text-primary border-b-4 border-primary pb-4"
        >
          {showMoreComment ? "Show less..." : "See more..."}
        </div>
      )}
    </div>
  );
};

export default Comment;
