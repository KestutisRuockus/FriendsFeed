import { SetStateAction, useEffect, useRef, useState } from "react";
import { SingleCommentProps } from "./types";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";
import { formatDate } from "../../../utils/formatedDate";
import EmojiPickerComponent from "../../../utils/EmojiPickerComponent";

const Comment = ({ comment, setComments }: SingleCommentProps) => {
  const [showMoreComment, setShowMoreComment] = useState<boolean>(false);
  const [isCommentOverflowing, setIsCommentOverflowing] =
    useState<boolean>(false);
  const [editedCommentInput, setEditedCommentInput] = useState<string>("");
  const [showEditedCommentInput, setShowEditedCommentInput] =
    useState<boolean>(false);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const commentRef = useRef<HTMLDivElement>(null);

  const handleShowMoreCommentState = () => setShowMoreComment(!showMoreComment);

  const handleEmojiSelect = (emoji: string) => {
    setEditedCommentInput(editedCommentInput + emoji);
  };

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

  const handleEditedCommentInputElement = () => {
    setEditedCommentInput(comment.commentText);
    setShowEditedCommentInput(!showEditedCommentInput);
  };

  const handleEditedCommentInput = (e: {
    target: { value: SetStateAction<string> };
  }) => setEditedCommentInput(e.target.value);

  useEffect(() => {
    if (commentRef.current) {
      setIsCommentOverflowing(commentRef.current.scrollHeight > 60);
    }
  }, []);

  const updateComment = async () => {
    if (editedCommentInput.trim() !== "") {
      try {
        if (auth.currentUser && comment.commentId) {
          const commentRef = doc(
            db,
            `posts/${comment.postAuthorId}/userPosts/${comment.postId}/comments/${comment.commentId}`
          );

          const updatedComment = {
            ...comment,
            commentText: editedCommentInput,
            date: formatDate(true),
          };

          await setDoc(commentRef, updatedComment);

          setComments((prevComments) =>
            prevComments
              ? prevComments.map((prevComment) =>
                  prevComment.commentId === comment.commentId
                    ? { ...prevComment, commentText: editedCommentInput }
                    : prevComment
                )
              : []
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      } finally {
        setOpenEmojiPicker(false);
      }
    }
    console.log(`update comment`);
    setShowEditedCommentInput(false);
  };

  return (
    <div className="w-full bg-secondary px-4 py-2 rounded-lg my-2">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          {comment.commentatorProfileImage ? (
            <img
              src={comment.commentatorProfileImage}
              alt="profile image"
              className="rounded-full w-4 h-4"
            />
          ) : (
            <i className="fa-solid fa-user rounded-full"></i>
          )}
          <p className="text-sm font-semibold text-primary">
            {comment.commentatorName}
          </p>
        </div>
        {(auth.currentUser?.uid === comment.commentatorId ||
          auth.currentUser?.uid === comment.postAuthorId) && (
          <div className="flex justify-center items-center gap-4">
            {auth.currentUser?.uid === comment.commentatorId && (
              <i
                onClick={handleEditedCommentInputElement}
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
        <p className="text-primary">{comment.commentText}</p>
        <p className="text-[0.6rem] text-gray-400">{comment.date}</p>
      </div>
      {showEditedCommentInput && (
        <div>
          <div className="flex w-4/5 p-2 mt-2 bg-secondary rounded-xl">
            <input
              onKeyDown={(e: { key: string }) => {
                if (e.key === "Enter") {
                  updateComment();
                }
              }}
              onChange={handleEditedCommentInput}
              value={editedCommentInput}
              className="w-full pl-2 rounded-l-lg outline-none"
              type="text"
              placeholder="Enter Comment..."
            />
            <div
              onClick={updateComment}
              className="flex justify-center items-center bg-white px-2 rounded-r-lg hover:opacity-50 transition-opacity duration-300 cursor-pointer"
            >
              <i
                onClick={() => {}}
                className="fa-solid fa-location-arrow text-xl text-primary rotate-45"
              />
            </div>
            <div className="flex justify-center items-center ms-2 rounded-lg hover:opacity-50 transition-opacity duration-300">
              <i
                onClick={handleEditedCommentInputElement}
                className="fa-solid fa-rectangle-xmark text-2xl text-red-600 cursor-pointer"
              ></i>
            </div>
          </div>
          <EmojiPickerComponent
            open={openEmojiPicker}
            setOpen={setOpenEmojiPicker}
            onEmojiSelect={handleEmojiSelect}
          />
        </div>
      )}
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
