import React, { SetStateAction, useEffect, useRef, useState } from "react";
import EmojiPickerComponent from "../../../utils/EmojiPickerComponent";
import Comment from "./Comment";
import { PostComponentProps } from "../../../pages/types";
import { auth, db } from "../../../firebase/firebaseConfig";
import PostModal from "./PostModal";
import { CommentsProps, EditablePostValues } from "./types";
import ErrorMessage from "../../shared/ErrorMessage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { deletePostImageFromFirebaseStorage } from "../../../utils/ImageUtils";
import { formatDate } from "../../../utils/formatedDate";

const Post = React.memo(
  ({
    post,
    removeDeletedPostFromPostsStateById,
    updatePostsStateById,
  }: PostComponentProps) => {
    const [showMoreContent, setShowMoreContent] = useState<boolean>(false);
    const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
    const [commentInput, setCommentInput] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editablePostValues, setEditablePostValues] =
      useState<EditablePostValues>({
        title: post.title,
        content: post.content,
        imageURL: post.imageURL,
      });
    const [likesCount, setLikesCount] = useState<number>(0);
    const [dislikesCount, setDislikesCount] = useState<number>(0);
    const [comments, setComments] = useState<CommentsProps[] | null>(null);
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({
      width: 0,
      height: 0,
    });

    const contentRef = useRef<HTMLDivElement>(null);

    const handleShowMoreContentState = () =>
      setShowMoreContent(!showMoreContent);

    const handleCommentInput = (e: {
      target: { value: SetStateAction<string> };
    }) => setCommentInput(e.target.value);

    const addNewComment = async () => {
      if (commentInput.trim() !== "") {
        try {
          if (auth.currentUser) {
            const commentsRef = collection(
              db,
              `posts/${post.authorId}/userPosts/${post.id}/comments`
            );

            const newComment = {
              postAuthorId: post.authorId,
              postId: post.id,
              commentatorId: auth.currentUser.uid,
              commentatorName: auth.currentUser.displayName ?? "Anonymous",
              commentatorProfileImage: auth.currentUser.photoURL ?? "",
              commentText: commentInput,
              date: formatDate(true),
            };

            const docRef = doc(commentsRef);
            const commentId = docRef.id;
            const commentWithUpdatedId = { ...newComment, commentId };
            await addDoc(commentsRef, commentWithUpdatedId);
            setComments((prevComments) =>
              prevComments
                ? [commentWithUpdatedId, ...prevComments]
                : [commentWithUpdatedId]
            );
          } else {
            console.error("User is not logged in, cannot add comment.");
          }
        } catch (error) {
          if (error instanceof Error) {
            console.log("Error adding comment: ", error.message);
          }
        } finally {
          setOpenEmojiPicker(false);
        }

        setCommentInput("");
      }
    };

    const handleEmojiSelect = (emoji: string) => {
      setCommentInput(commentInput + emoji);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleLikeButton = () => {
      handleLikesOrDislikesButtonsInteraction(
        post.id,
        post.authorId,
        auth.currentUser!.uid,
        "like"
      );
    };

    const handleDislikeButton = () => {
      handleLikesOrDislikesButtonsInteraction(
        post.id,
        post.authorId,
        auth.currentUser!.uid,
        "dislike"
      );
    };

    const handleLikesOrDislikesButtonsInteraction = async (
      postId: string,
      authorId: string,
      userId: string,
      interaction: "like" | "dislike"
    ) => {
      const postRef = doc(db, "posts", authorId, "userPosts", postId);

      const interactionRef = doc(
        db,
        "posts",
        authorId,
        "userPosts",
        postId,
        "interactions",
        userId
      );

      try {
        const interactionSnap = await getDoc(interactionRef);

        if (interactionSnap.exists()) {
          const currentInteraction = interactionSnap.data()?.interaction;

          if (currentInteraction === interaction) {
            await updateDoc(interactionRef, { interaction: "neutral" });

            if (interaction === "like") {
              await updateDoc(postRef, { likesCount: increment(-1) });
              setLikesCount((prevCount) => prevCount - 1);
            } else if (interaction === "dislike") {
              await updateDoc(postRef, { dislikesCount: increment(-1) });
              setDislikesCount((prevCount) => prevCount - 1);
            }
          } else {
            await setDoc(interactionRef, { interaction });

            if (interaction === "like") {
              await updateDoc(postRef, { likesCount: increment(1) });
              setLikesCount((prevCount) => prevCount + 1);

              if (currentInteraction === "dislike") {
                await updateDoc(postRef, { dislikesCount: increment(-1) });
                setDislikesCount((prevCount) => prevCount - 1);
              }
            } else if (interaction === "dislike") {
              await updateDoc(postRef, { dislikesCount: increment(1) });
              setDislikesCount((prevCount) => prevCount + 1);

              if (currentInteraction === "like") {
                await updateDoc(postRef, { likesCount: increment(-1) });
                setLikesCount((prevCount) => prevCount - 1);
              }
            }
          }
        } else {
          await setDoc(interactionRef, { interaction });

          if (interaction === "like") {
            await updateDoc(postRef, { likesCount: increment(1) });
            setLikesCount((prevCount) => prevCount + 1);
          } else if (interaction === "dislike") {
            await updateDoc(postRef, { dislikesCount: increment(1) });
            setDislikesCount((prevCount) => prevCount - 1);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    };

    const deletePost = async () => {
      if (auth.currentUser?.uid && post.id) {
        try {
          const docRef = doc(
            db,
            `posts/${auth.currentUser?.uid}/userPosts/${post.id}`
          );
          await deleteDoc(docRef);
          deletePostImageFromFirebaseStorage(post.imageURL);
        } catch (error) {
          if (error instanceof Error) {
            console.log(error.message);
            setErrorMessage("Post was not deleted. Please try again");
          }
        } finally {
          removeDeletedPostFromPostsStateById(post.id);
        }
      }
    };

    useEffect(() => {
      if (contentRef.current) {
        setIsOverflowing(contentRef.current.scrollHeight > 60);
      }
    }, [editablePostValues.content]);

    useEffect(() => {
      const updatedComments =
        post.comments?.map((comment) => ({
          ...comment,
          commentatorProfileImage: comment.commentatorProfileImage ?? "",
        })) || null;

      setLikesCount(post.likesCount);
      setDislikesCount(post.dislikesCount);
      setComments(updatedComments);
    }, [post.comments, post.dislikesCount, post.likesCount]);

    useEffect(() => {
      if (editablePostValues.imageURL) {
        const img = new Image();
        img.src = editablePostValues.imageURL;

        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height });
        };
      }
    }, [editablePostValues.imageURL]);

    const isPortrait = imageDimensions.height > imageDimensions.width;

    return (
      <div className="sm:w-4/5 w-11/12 flex flex-col gap-6 border-8 rounded-lg border-bgColorExtra border-opacity-20 relative">
        {isModalOpen && (
          <PostModal
            isOpen={true}
            onClose={closeModal}
            currentTitle={post.title}
            currentContent={post.content}
            currentImage={post.imageURL}
            postId={post.id}
            setEditablePostValues={setEditablePostValues}
            updatePostsStateById={updatePostsStateById}
          />
        )}
        <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 px-8 lg:px-16 max-lg:pr-0">
          <h1 className="w-full md:w-1/2 font-bold text-lg pt-4 sm:pt-8 pr-2">
            {editablePostValues.title}
          </h1>
          <div className="w-full md:w-1/2 flex gap-4 sm:justify-end items-center pl-2 pt-8 text-primary font-semibold text-sm relative">
            <div className="flex flex-col items-center">
              <div className="flex h-full gap-2 justify-center items-center">
                <div className="w-full flex justify-center items-center gap-2">
                  {post.authorProfileImage ? (
                    <img
                      src={post.authorProfileImage}
                      alt="profile image"
                      className="rounded-full w-9 h-9"
                    />
                  ) : (
                    <i className="fa-solid fa-user rounded-full"></i>
                  )}

                  <div className="flex flex-col mr-6">
                    <div>{post.author}</div>
                    <div className="italic">
                      {formatDate(undefined, post.date)}
                    </div>
                  </div>
                </div>
                {auth.currentUser?.displayName === post.author && (
                  <div className="flex justify-center items-center gap-4 pr-1 absolute right-5 lg:right-0 top-0">
                    <i
                      onClick={deletePost}
                      className="fa-solid fa-trash-can text-lg text-red-600 cursor-pointer 
                            hover:opacity-70 transition-opacity duration-300"
                    ></i>
                    <i
                      onClick={openModal}
                      className="fa-solid fa-pen text-lg text-green-600 cursor-pointer
                            hover:opacity-70 transition-opacity duration-300"
                    ></i>
                  </div>
                )}
              </div>
              <div>
                <ErrorMessage message={errorMessage} />
              </div>
            </div>
          </div>
        </div>
        {editablePostValues.imageURL && (
          <div
            className={`px-4 w-full max-w-[100%] sm:max-w-[400px] md:max-w-[600px] h-auto object-contain m-auto ${
              isPortrait ? "max-h-[400px]" : "max-h-[600px]"
            }`}
          >
            <img
              src={
                editablePostValues.imageURL ? editablePostValues.imageURL : ""
              }
              alt="post image"
              className="m-auto w-full h-full object-contain object-center"
            />
          </div>
        )}

        <div className="px-8 pb-4 lg:px-16">
          <div
            ref={contentRef}
            className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
              showMoreContent
                ? "max-h-[300px] overflow-y-scroll"
                : "max-h-[4.5rem]"
            }`}
          >
            {editablePostValues.content}
          </div>
          {isOverflowing && (
            <div
              onClick={handleShowMoreContentState}
              className="text-end cursor-pointer text-primary border-b-4 border-primary pb-4"
            >
              {showMoreContent ? "Show less..." : "See more..."}
            </div>
          )}
          <div className="my-6 flex gap-6">
            <div className="flex gap-1 items-center">
              <span className="text-green-700 font-bold">{likesCount}</span>
              <i
                onClick={handleLikeButton}
                className="fa-solid fa-thumbs-up  text-green-700 cursor-pointer hover:opacity-70 transition-opacity duration-300"
              ></i>
            </div>
            <div className="flex gap-1 items-center">
              <span className="text-red-700 font-bold">{dislikesCount}</span>
              <i
                onClick={handleDislikeButton}
                className="fa-solid fa-thumbs-down pt-1 text-rose-700 cursor-pointer hover:opacity-70 transition-opacity duration-300"
              ></i>
            </div>
          </div>
          <div className="w-full">
            {comments
              ? comments.map((comment) => (
                  <Comment comment={comment} setComments={setComments} />
                ))
              : ""}
            <div className="flex w-full mt-2">
              <input
                onKeyDown={(e: { key: string }) => {
                  if (e.key === "Enter") {
                    addNewComment();
                  }
                }}
                onChange={handleCommentInput}
                value={commentInput}
                className="w-full pl-2 rounded-l-lg outline-none"
                type="text"
                placeholder="Enter Comment..."
              />
              <div
                onClick={addNewComment}
                className="flex justify-center items-center bg-white px-2 rounded-r-lg hover:opacity-50 transition-opacity duration-300 cursor-pointer"
              >
                <i
                  onClick={() => {}}
                  className="fa-solid fa-location-arrow text-xl text-primary rotate-45"
                />
              </div>
            </div>
            <EmojiPickerComponent
              open={openEmojiPicker}
              setOpen={setOpenEmojiPicker}
              onEmojiSelect={handleEmojiSelect}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default Post;
